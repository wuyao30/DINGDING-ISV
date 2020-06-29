<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" :label-position="labelPosition" class="form-container">
      <sticky :class-name="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" :disabled="canNewSurvey" style="margin-left: 10px;" type="success" @click="submitForm">新建问卷
        </el-button>
        <el-button v-loading="loading" :disabled="canModSurvey" type="warning" @click="modifyExam">修改问卷</el-button>
        <el-button v-loading="loading" :disabled="canModSurvey" type="warning" @click="deleteExam">删除问卷</el-button>
      </sticky>
      <div class="createPost-main-container">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item tyle="margin-bottom: 20px;" label-width="80px" label="问卷标题:">
              <el-select v-model="postForm.id" clearable class="postInfo-container-item" style="width: 220px;" @change="GetSurveyDetail" >
                <el-option v-for="item in surveyOptions" :key="item.id" :label="item.surveyName" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item style="margin-bottom: 20px;" label-width="80px" label="问卷标题:">
              <el-input :rows="1" v-model="postForm.surveyName" type="textarea" clearable class="article-textarea" autosize placeholder="请输入试卷标题"/>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="postInfo-container">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label-width="80px" label="开始时间:" class="postInfo-container-item">
                <el-date-picker v-model="postForm.startDate" type="date" placeholder="选择日期时间" style="width: 220px;" @change="changeEnd"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="80px" label="结束时间:" class="postInfo-container-item">
                <el-date-picker v-model="postForm.endDate" type="date" placeholder="选择日期时间" style="width: 220px;" @change="changeEndd"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item tyle="margin-bottom: 20px;" label-width="80px" label="问卷状态:" class="postInfo-container-item">
                <el-select v-model="postForm.release" clearable style="width: 220px;" class="filter-item">
                  <el-option v-for="item in stopNotice" ref="zhuangtai" :key="item.key" :label="item.label" :value="item.key"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item tyle="margin-bottom: 20px;" label-width="80px" label="是否匿名:" class="postInfo-container-item">
                <el-select v-model="postForm.anonymous" style="width: 220px;" clearable class="filter-item">
                  <el-option v-for="item in niming" ref="zhuangtai" :key="item.key" :label="item.label" :value="item.key"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-form-item style="margin-bottom: 20px;" label-width="80px" label="问卷摘要:">
          <el-input :rows="1" v-model="postForm.summary" type="textarea" class="article-textarea" autosize placeholder="请输入内容"/>
          <!--<span v-show="summaryShortLength" class="word-counter">{{ summaryShortLength }}字</span>-->
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import { validateURL } from '@/utils/validate'
import { fetchArticle } from '@/api/article'
import { userSearch } from '@/api/remoteSearch'
import { deleteSurveyById, updateSurvey, insertSurvey, getSurveyDetail, getSurveyInfo, getOneQuestionByID } from '@/api/login'
import { getToken } from '@/utils/auth'

const defaultForm = {
  id: undefined,
  surveyName: undefined,
  startDate: undefined,
  endDate: undefined,
  release: undefined,
  anonymous: undefined,
  summary: undefined
}

export default {
  name: 'CreateSurvey',
  components: { Sticky },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validateURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      labelPosition: 'left',
      niming: [{ label: '匿名', key: 0 }, { label: '实名', key: 1 }],
      stopNotice: [{ label: '请选择', key: -1 }, { label: '问卷未发布', key: 0 }, { label: '问卷已发布', key: 1 }],
      pubNotice: [{ label: '请选择', key: -1 }, { label: '试卷没发布', key: 0 }, { label: '试卷已发布', key: 1 }],
      timuSet: [{ label: '请选择试题', key: -1 }],
      surveyOptions: [{ label: '问卷标题', key: -1 }],
      tiMuOptions: [{ label: '请选择题目类型', key: -1 }, { label: '单选', key: 0 }, { label: '多选', key: 1 }, { label: '判断', key: 2 }],
      postForm: Object.assign({}, defaultForm),
      loading: false,
      canInsertQue: false,
      canFaBuShiJuan: true,
      canNewSurvey: false,
      canModSurvey: true,
      canZengjiaShiTi: true,
      canModShiTi: true,
      iStop: 0,
      isFinish: 0,
      userListOptions: [],
      kaotiChuanru: {
      },
      parachuanru: {
        examId: ''
      },
      paraexam: {
        examId: '',
        queId: ''
      },
      chuanru: {
        examId: '',
        examName: '', //
        startDate: '',
        endDate: '',
        examLength: 0,
        info: '',
        iStop: 0,
        isFinish: 0

      },
      examAllInfo: {
        examId: -1,
        judgeExamScore: -1,
        judgeNumber: -1,
        multipleExamScore: -1,
        multipleNumber: -1,
        singleExamScore: -1,
        singleNumber: -1,
        allInfo: '',
        singleInfo: '',
        singleInfoS: '',
        multipleInfo: '',
        multipleInfoS: '',
        judgeInfo: '',
        judgeInfoS: ''

      },
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        infoContent: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {}
    }
  },

  computed: {
    summaryShortLength() {
      return this.postForm.summary.length
    },
    titleShortLength() {
      return this.postForm.title.length
    },
    quecontentShortLength() {
      return this.postForm.queContent.length
    },
    choiceAShortLength() {
      return this.postForm.choiceA.length
    },
    choiceBShortLength() {
      return this.postForm.choiceB.length
    },
    choiceCShortLength() {
      return this.postForm.choiceC.length
    },
    choiceDShortLength() {
      return this.postForm.choiceD.length
    },
    choiceEShortLength() {
      return this.postForm.choiceE.length
    },
    choiceFShortLength() {
      return this.postForm.choiceF.length
    },
    choiceGShortLength() {
      return this.postForm.choiceG.length
    },
    choiceHShortLength() {
      return this.postForm.choiceH.length
    },
    lang() {
      return this.$store.getters.language
    }
  },
  created() {
    this.postForm = Object.assign({}, defaultForm)
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
    getSurveyInfo().then(response => {
      console.log(response)
      this.surveyOptions = response.data
    }).catch(() => {
      console.log('获取通知ID错误')
    })
  },
  methods: {
    shitihao() {
      // console.log('this shi ti hao changed' + this.postForm.queId)
      if (this.postForm.queId > 0) {
        this.canZengjiaShiTi = true
        this.canModShiTi = false
        this.paraexam.examId = this.postForm.examId
        this.paraexam.queId = this.postForm.queId
        console.log('this examID:' + this.paraexam.examId)
        getOneQuestionByID(getToken(), this.paraexam).then(response => {
          this.postForm.queContent = response.data[0].questions[0].queContent
          this.postForm.queType = response.data[0].questions[0].queType
          this.postForm.queAnswer = response.data[0].questions[0].queAnswer
          this.postForm.queScore = response.data[0].questions[0].queScore
          this.postForm.choiceA = response.data[0].questions[0].choiceA
          this.postForm.choiceB = response.data[0].questions[0].choiceB
          this.postForm.choiceC = response.data[0].questions[0].choiceC
          this.postForm.choiceD = response.data[0].questions[0].choiceD
          this.postForm.choiceE = response.data[0].questions[0].choiceE
          this.postForm.choiceF = response.data[0].questions[0].choiceF
          this.postForm.choiceG = response.data[0].questions[0].choiceG
          this.postForm.choiceH = response.data[0].questions[0].choiceH
        }).catch(() => {
          console.log('获取题目内容错误')
        })
      } else {
        this.canZengjiaShiTi = false
        this.canModShiTi = true
        console.log('this shi ti hao changed xiao' + this.cenNewShiTi)
      }
    },
    GetSurveyDetail() {
      if (this.postForm.id > 0) {
        this.canFaBuShiJuan = false
        this.canNewSurvey = true
        this.canModSurvey = false
        this.canModShiTi = true
        this.canZengjiaShiTi = false
      } else {
        this.canFaBuShiJuan = true
        this.canNewSurvey = false
        this.canModSurvey = true
        this.canModShiTi = true
        this.canZengjiaShiTi = true
      }
      getSurveyDetail(this.postForm.id)
        .then(response => {
          this.postForm = response.data
        })
        .catch(e => {
          console.log(e)
          this.$notify({
            title: '失败',
            message: '获取信息失败',
            type: 'warning',
            duration: 2000
          })
        })
    },
    changeEnd() {
      const strYear = String(this.postForm.display_time.getFullYear())
      const strMonth = String(this.postForm.display_time.getMonth() + 1)
      const strDay = String(this.postForm.display_time.getDate())
      const strM = strMonth.valueOf().padStart(2, '0')
      const strD = strDay.valueOf().padStart(2, '0')
      this.postForm.startDate = strYear.valueOf() + '-' + strM + '-' + strD
      console.log('long lhai ying:' + this.postForm.startDate)
    },
    changeEndd() {
      const strYear = String(this.postForm.display_end_time.getFullYear())
      const strMonth = String(this.postForm.display_end_time.getMonth() + 1)
      const strDay = String(this.postForm.display_end_time.getDate())
      const strM = strMonth.valueOf().padStart(2, '0')
      const strD = strDay.valueOf().padStart(2, '0')
      this.postForm.endDate = strYear.valueOf() + '-' + strM + '-' + strD
      console.log('long hai ying end:' + this.postForm.endDate)
    },
    fetchData(id) {
      fetchArticle(id).then(response => {
        this.postForm = response.data
        // Just for test
        this.postForm.title += `   Article Id:${this.postForm.id}`
        this.postForm.summary += `   Article Id:${this.postForm.id}`
        // Set tagsview title
        this.setTagsViewTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '编辑文章' : 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('updateVisitedView', route)
    },
    validate() {
      if (this.postForm.surveyName.length === 0) {
        this.$message({
          message: '请填写标题',
          type: 'warning'
        })
        return
      }
      if (this.postForm.startDate.length === 0) {
        this.$message({
          message: '请填写开始时间',
          type: 'warning'
        })
        return
      }
      if (this.postForm.endDate.length === 0) {
        this.$message({
          message: '请填写结束时间',
          type: 'warning'
        })
        return
      }
      if (this.postForm.release == null) {
        this.$message({
          message: '请选择问卷状态',
          type: 'warning'
        })
        return
      }
      if (this.postForm.anonymous == null) {
        this.$message({
          message: '请选择问卷是否匿名',
          type: 'warning'
        })
        return
      }
      if (this.postForm.summary.length === 0) {
        this.$message({
          message: '请填写摘要内容',
          type: 'warning'
        })
        return
      }
    },
    modifyExam() {
      this.validate()
      updateSurvey(getToken(), this.postForm)
        .then(response => {
          if (response.data === 1) {
            this.$notify({
              title: '成功',
              message: '修改问卷信息',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '失败',
              message: '修改问卷信息',
              type: 'warning',
              duration: 2000
            })
          }
        }).catch()
    },
    submitForm() {
      if (this.postForm.surveyName.length === 0) {
        this.$message({
          message: '请填写标题',
          type: 'warning'
        })
        return
      }
      if (this.postForm.startDate.length === 0) {
        this.$message({
          message: '请填写开始时间',
          type: 'warning'
        })
        return
      }
      if (this.postForm.endDate.length === 0) {
        this.$message({
          message: '请填写结束时间',
          type: 'warning'
        })
        return
      }
      if (this.postForm.release == null) {
        this.$message({
          message: '请选择问卷状态',
          type: 'warning'
        })
        return
      }
      if (this.postForm.anonymous == null) {
        this.$message({
          message: '请选择问卷是否匿名',
          type: 'warning'
        })
        return
      }
      if (this.postForm.summary.length === 0) {
        this.$message({
          message: '请填写摘要内容',
          type: 'warning'
        })
        return
      }
      insertSurvey(getToken(), this.postForm)
        .then(response => {
          console.log(response)
          if (response.data === 1) {
            this.$notify({
              title: '成功',
              message: '新建问卷信息',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '失败',
              message: '新建问卷信息',
              type: 'warning',
              duration: 2000
            })
          }
        })
      this.postForm.status = 'published'
    },
    draftForm() {
      if (this.postForm.infoContent.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    getRemoteUserList(query) {
      userSearch(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
    },
    deleteExam() {
      deleteSurveyById(getToken(), this.postForm.id)
        .then(response => {
          if (response.data === 1) {
            this.$notify({
              title: '成功',
              message: '删除问卷信息',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '失败',
              message: '删除问卷信息',
              type: 'warning',
              duration: 2000
            })
          }
        }).catch(e => {
          console.log(e)
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
          text-align: right;
          margin-right: 10px;
          .editor-upload-btn {
            display: inline-block;
          }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }
</style>
