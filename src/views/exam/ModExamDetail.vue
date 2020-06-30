<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :label-position="labelPosition" :rules="rules" class="form-container">
      <sticky :class-name="'sub-navbar '">
        <el-button v-loading="loading" :disabled="canZengjiaShiTi" type="warning" @click="submitForm">创建试题</el-button>
        <el-button v-loading="loading" :disabled="canModShiTi" type="warning" @click="modifiedQuestion">修改试题</el-button>
        <el-button v-loading="loading" :disabled="canModShiTi" type="warning" @click="deleteQuestion">删除试题</el-button>
      </sticky>
      <div class="createPost-main-container">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item tyle="margin-bottom: 20px;" label-width="80px" label="试卷编号:">
              <el-select v-model="postForm.examId" clearable class="postInfo-container-item" style="width: 220px;" @change="shijuanhao" >
                <el-option v-for="item in noticeOptions" :key="item.key" :label="item.label" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item style="margin-bottom: 20px;" label-width="80px" label="试卷标题:">
              <el-input :rows="1" v-model="postForm.title" :disabled="true" type="textarea" clearable class="article-textarea" autosize placeholder="请输入试卷标题"/>
              <span v-show="titleShortLength" class="word-counter">{{ titleShortLength }}字</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label-width="80px" label="开始时间:" class="postInfo-container-item">
              <el-date-picker v-model="postForm.startDate" :disabled="true" type="date" placeholder="选择日期时间" @change="changeEnd"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="80px" label="结束时间:" class="postInfo-container-item">
              <el-date-picker v-model="postForm.endDate" :disabled="true" type="date" placeholder="选择日期时间" @change="changeEndd"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label-width="80px" label="考试时长:" class="postInfo-container-item">
              <el-input v-model="postForm.examLength" :disabled="true" style="width: 220px;" required/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="80px" label="试卷状态:" class="postInfo-container-item">
              <el-select v-model="postForm.iStop" :disabled="true" class="filter-item" style="width: 220px;" clearable @change="shititype">
                <el-option v-for="item in stopNotice" :key="item.key" :label="item.label" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
          <!--<el-col :span="6">-->
            <!--<el-form-item label-width="80px" label="发布者:" class="postInfo-container-item">-->
              <!--<el-select v-model="postForm.isFinish" disabled="true" class="filter-item" style="width: 220px;" clearable @change="shititype">-->
                <!--<el-option v-for="item in pubNotice" :key="item.key" :label="item.label" :value="item.key"/>-->
              <!--</el-select>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
        </el-row>
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item style="margin-bottom: 20px;" label-width="80px" label="试卷摘要:">
              <el-input :rows="1" v-model="postForm.summary" disabled="true" type="textarea" class="article-textarea" autosize placeholder="请输入内容"/>
              <span v-show="summaryShortLength" class="word-counter">{{ summaryShortLength }}字</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label-width="80px" label="试卷共有:" class="postInfo-container-item">
              <el-input v-model="examAllInfo.allInfo" disabled="true" style="width: 220px;" required/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label-width="80px" label="单选题:" class="postInfo-container-item">
              <el-input v-model="examAllInfo.singleInfo" :disabled="true" style="width: 220px;" required/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="80px" label="分值:" class="postInfo-container-item">
              <el-input v-model="examAllInfo.singleInfoS" :disabled="true" style="width: 220px;" required/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label-width="80px" label="多选题:" class="postInfo-container-item">
              <el-input v-model="examAllInfo.multipleInfo" :disabled="true" style="width: 220px;" required/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="80px" label="分值:" class="postInfo-container-item">
              <el-input v-model="examAllInfo.multipleInfoS" :disabled="true" style="width: 220px;" required/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label-width="80px" label="判断题:" class="postInfo-container-item">
              <el-input v-model="examAllInfo.judgeInfo" :disabled="true" style="width: 220px;" required/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="80px" label="分值:" class="postInfo-container-item">
              <el-input v-model="examAllInfo.judgeInfoS" :disabled="true" style="width: 220px;" required/>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="createPost-main-container">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label-width="80px" label="题目序号:" class="postInfo-container-item">
              <el-select v-model="examData.queId" class="filter-item" clearable @change="shitihao">
                <el-option v-for="item in timuSet" :key="item.key" :label="item.label" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="80px" label="题目类型:" class="postInfo-container-item">
              <el-select v-model="examData.queType" class="filter-item" clearable @change="shititype">
                <el-option v-for="item in tiMuOptions" :key="item.key" :label="item.label" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="80px" label="题目答案:" class="postInfo-container-item">
              <el-input v-model="examData.queAnswer" required/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="80px" label="题目分值:" class="postInfo-container-item">
              <el-input v-model="examData.queScore" required/>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-form-item style="margin-bottom: 20px;" label-width="80px" label="题目内容:">
            <el-input :rows="1" v-model="examData.queContent" type="textarea" class="article-textarea" autosize placeholder="请输入内容"/>
            <span v-show="quecontentShortLength" class="word-counter">{{ quecontentShortLength }}字</span>
          </el-form-item>
          <el-form-item style="margin-bottom: 20px;" label-width="80px" label="选项A:">
            <el-input :rows="1" v-model="examData.choiceA" type="textarea" class="article-textarea" autosize placeholder="请输入内容"/>
            <span v-show="choiceAShortLength" class="word-counter">{{ choiceAShortLength }}字</span>
          </el-form-item>
          <el-form-item style="margin-bottom: 20px;" label-width="80px" label="选项B:">
            <el-input :rows="1" v-model="examData.choiceB" type="textarea" class="article-textarea" autosize placeholder="请输入内容"/>
            <span v-show="choiceBShortLength" class="word-counter">{{ choiceBShortLength }}字</span>
          </el-form-item>
          <el-form-item v-show="examData.queType < 2" style="margin-bottom: 20px;" label-width="80px" label="选项C:">
            <el-input :rows="1" v-model="examData.choiceC" type="textarea" class="article-textarea" autosize placeholder="请输入内容"/>
            <span v-show="choiceCShortLength" class="word-counter">{{ choiceCShortLength }}字</span>
          </el-form-item>
          <el-form-item v-show="examData.queType < 2" style="margin-bottom: 20px;" label-width="80px" label="选项D:">
            <el-input :rows="1" v-model="examData.choiceD" type="textarea" class="article-textarea" autosize placeholder="请输入内容"/>
            <span v-show="choiceDShortLength" class="word-counter">{{ choiceDShortLength }}字</span>
          </el-form-item>
          <el-form-item v-show="examData.queType < 2" style="margin-bottom: 20px;" label-width="80px" label="选项E:">
            <el-input :rows="1" v-model="examData.choiceE" type="textarea" class="article-textarea" autosize placeholder="请输入内容"/>
            <span v-show="choiceEShortLength" class="word-counter">{{ choiceEShortLength }}字</span>
          </el-form-item>
          <el-form-item v-show="examData.queType < 2" style="margin-bottom: 20px;" label-width="80px" label="选项F:">
            <el-input :rows="1" v-model="examData.choiceF" type="textarea" class="article-textarea" autosize placeholder="请输入内容"/>
            <span v-show="choiceFShortLength" class="word-counter">{{ choiceFShortLength }}字</span>
          </el-form-item>
          <el-form-item v-show="examData.queType < 2" style="margin-bottom: 20px;" label-width="80px" label="选项G:">
            <el-input :rows="1" v-model="examData.choiceG" type="textarea" class="article-textarea" autosize placeholder="请输入内容"/>
            <span v-show="choiceGShortLength" class="word-counter">{{ choiceGShortLength }}字</span>
          </el-form-item>
          <el-form-item v-show="examData.queType < 2" style="margin-bottom: 20px;" label-width="80px" label="选项H:">
            <el-input :rows="1" v-model="examData.choiceH" type="textarea" class="article-textarea" autosize placeholder="请输入内容"/>
            <span v-show="choiceHShortLength" class="word-counter">{{ choiceHShortLength }}字</span>
          </el-form-item>
        </el-row>
      </div>
    </el-form>
  </div>
</template>
<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import { validateURL } from '@/utils/validate'
import { fetchArticle } from '@/api/article'
import { userSearch } from '@/api/remoteSearch'
import { deleteQue, getExamInfo, getExamDetailSingle, insertQue, getAllQuestionByID, getOneQuestionByID, getInfo, updateQue } from '@/api/login'
import { getToken } from '@/utils/auth'

const defaultForm = {
  status: 'draft',
  title: '', // 文章题目
  startDate: '',
  endDate: '',
  examLength: 0,
  type: 0,
  iStop: -1,
  isFinish: -1,
  writeUser: '',
  infoContent: '', // 文章内容
  summary: '', // 文章摘要
  source_uri: '', // 文章外链
  image_uri: '', // 文章图片
  display_time: undefined, // 前台展示时间
  display_end_time: undefined, // 前台展示时间

  shijuanzhuangtai: '',
  shifoufabu: '',
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 1,
  queId: -1,
  queContent: '',
  queType: -1,
  queAnswer: '',
  queScore: '',
  examId: -1,
  choiceA: '',
  choiceB: '',
  choiceC: '',
  choiceD: '',
  choiceE: '',
  choiceF: '',
  choiceG: '',
  choiceH: ''

}
export default {
  name: 'ModExamDetail',
  components: { Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
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
      stopNotice: [{ label: '请选择', key: -1 }, { label: '该考试停止', key: 0 }, { label: '该考试开始', key: 1 }],
      pubNotice: [{ label: '请选择', key: -1 }, { label: '试卷没发布', key: 0 }, { label: '试卷已发布', key: 1 }],
      timuSet: [{ label: '请选择试题', key: 0 }],
      noticeOptions: [{ label: '试卷编号', key: -1 }],
      tiMuOptions: [{ label: '请选择题目类型', key: -1 }, { label: '单选', key: 0 }, { label: '多选', key: 1 }, { label: '判断', key: 2 }],

      postForm: Object.assign({}, defaultForm),
      loading: false,
      canInsertQue: false,
      canFaBuShiJuan: true,
      canNewSurvey: false,
      canModSurvey: true,
      canZengjiaShiTi: true,
      canModShiTi: true,
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
        examName: '', //
        startDate: '',
        endDate: '',
        examLength: 0,
        info: '',
        iStop: 0,
        isFinish: 0

      },
      examData: {
        queContent: '',
        queType: -1,
        queAnswer: '',
        queScore: '',
        examId: 0,
        choiceA: '',
        choiceB: '',
        choiceC: '',
        choiceD: '',
        choiceE: '',
        choiceF: '',
        choiceG: '',
        choiceH: '',
        iStop: -1,
        isFinish: -1
      },
      examDataH: {
        examId: 0,
        queContent: '',
        queType: -1,
        queAnswer: '',
        queScore: '',
        choiceA: '',
        choiceB: '',
        choiceC: '',
        choiceD: '',
        choiceE: '',
        choiceF: '',
        choiceG: '',
        choiceH: ''
      },
      examDataG: {
        examId: 0,
        queContent: '',
        queType: -1,
        queAnswer: '',
        queScore: '',
        choiceA: '',
        choiceB: '',
        choiceC: '',
        choiceD: '',
        choiceE: '',
        choiceF: '',
        choiceG: ''
      },
      examDataF: {
        examId: 0,
        queContent: '',
        queType: -1,
        queAnswer: '',
        queScore: '',
        choiceA: '',
        choiceB: '',
        choiceC: '',
        choiceD: '',
        choiceE: '',
        choiceF: ''

      },
      examDataE: {
        examId: 0,
        queContent: '',
        queType: -1,
        queAnswer: '',
        queScore: '',
        choiceA: '',
        choiceB: '',
        choiceC: '',
        choiceD: '',
        choiceE: ''

      },
      examDataD: {
        examId: 0,
        queContent: '',
        queType: -1,
        queAnswer: '',
        queScore: '',
        choiceA: '',
        choiceB: '',
        choiceC: '',
        choiceD: ''

      },
      examDataC: {
        examId: 0,
        queContent: '',
        queType: -1,
        queAnswer: '',
        queScore: '',
        choiceA: '',
        choiceB: '',
        choiceC: ''

      },
      examDataB: {
        examId: 0,
        queContent: '',
        queType: -1,
        queAnswer: '',
        queScore: '',
        choiceA: '',
        choiceB: ''

      },
      examDataA: {
        examId: 0,
        queContent: '',
        queType: -1,
        queAnswer: '',
        queScore: '',
        choiceA: ''

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
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)

    let map = Object()
    map.key = -1
    map.label = '请选择'
    this.noticeOptions = []
    this.noticeOptions[0] = map
    // this.tongzhiOptions[1] = '请选择通知编号'

    getExamInfo(getToken()).then(response => {
      // console.log(':::'+response.length)
      for (var ii = 0; ii < response.length; ii++) {
        // let jj = ii+1
        map = Object()
        map.key = response[ii].examId
        map.label = response[ii].examName
        this.noticeOptions.push(map)

        // console.log('iii:'+response[ii].title)
      }
      // console.log('the tz length is:' + this.tongzhiOptions.length)

      for (let kk = 0; kk < this.noticeOptions.length; kk++) {
        // console.log('kk:'+kk+' => ' + this.tongzhiOptions[kk] )
      }
      // this.tongzhiOptions =  res
    }).catch(() => {
      console.log('获取考试错误')
    })
  },
  methods: {
    shijuanhao() {
      if (this.postForm.examId > 0) {
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
        this.postForm.title = ''
        this.postForm.examLength = -1
        this.postForm.summary = ''
        this.chuanru.iStop = -1
        this.chuanru.isFinish = -1
        this.iStop = -1
        this.isFinish = -1
        this.examAllInfo.allInfo = ''
        this.examAllInfo.singleInfo = ''
        this.examAllInfo.singleInfoS = ''
        this.examAllInfo.multipleInfo = ''
        this.examAllInfo.multipleInfoS = ''
        this.examAllInfo.judgeInfo = ''
        this.examAllInfo.judgeInfoS = ''
      }
      this.parachuanru.examId = this.postForm.examId
      console.log('the shi juan ID:' + this.parachuanru.examId)
      getExamDetailSingle(getToken(), this.parachuanru).then(response => {
        this.postForm.title = response.examName
        this.postForm.examLength = response.examLength
        this.postForm.summary = response.info
        this.chuanru.iStop = response.iStop
        this.chuanru.isFinish = response.isFinish
        this.postForm.iStop = parseInt(response.iStop)
        this.postForm.isFinish = parseInt(response.isFinish)
        this.postForm.startDate = response.startDate
        let ss = []
        console.log('istop label：' + this.stopNotice[parseInt(this.chuanru.iStop) + 1].label)
        this.postForm.zhuangtai = this.stopNotice[parseInt(this.chuanru.iStop) + 1].label
        this.postForm.fabu = this.pubNotice[parseInt(this.chuanru.isFinish) + 1].label
        if (this.postForm.startDate.length >= 8) {
          ss = this.postForm.startDate.split('-')
          this.postForm.display_time = new Date(parseInt(ss[0]), parseInt(ss[1]) - 1, parseInt(ss[2]))
        }
        this.postForm.endDate = response.endDate
        console.log('the start date:' + this.postForm.startDate)
        console.log('the end date:' + this.postForm.endDate)
        ss = []
        if (this.postForm.endDate.length >= 8) {
          ss = this.postForm.endDate.split('-')
          console.log('this.postForm.endDate ss0:' + ss[0])
          console.log('this.postForm.endDate ss1:' + ss[1])
          console.log('this.postForm.endDate ss2:' + ss[2])
          this.postForm.display_end_time = new Date(parseInt(ss[0]), parseInt(ss[1]) - 1, parseInt(ss[2]))
        }
      }).catch(() => {
        console.log('获取题目内容错误')
      })
      let map = Object()
      map.key = -1
      map.label = '请选择'
      this.timuSet = []
      this.timuSet[0] = map
      getAllQuestionByID(getToken(), this.parachuanru).then(response => {
        for (var ii = 0; ii < response.length; ii++) {
          map = Object()
          map.key = response[ii].queId
          map.label = response[ii].queContent
          this.timuSet.push(map)
        }
      }).catch(() => {
        console.log('获取题目错误')
      })

      this.parachuanru.examId = this.postForm.examId
      getInfo(getToken(), this.parachuanru).then(response => {
        if (response) {
          this.examAllInfo.examId = response.examId
          this.examAllInfo.judgeExamScore = response.judgeExamScore
          this.examAllInfo.judgeNumber = response.judgeNumber
          this.examAllInfo.multipleExamScore = response.multipleExamScore
          this.examAllInfo.multipleNumber = response.multipleNumber
          this.examAllInfo.singleExamScore = response.singleExamScore
          this.examAllInfo.singleNumber = response.singleNumber
          console.log('获取 整体信息:' + this.examAllInfo.examId)
          const s1 = '' + (parseInt(this.examAllInfo.judgeNumber) + parseInt(this.examAllInfo.multipleNumber) + parseInt(this.examAllInfo.singleNumber)) + '试题 '
          const s2 = '' + (parseInt(this.examAllInfo.judgeExamScore) + parseInt(this.examAllInfo.multipleExamScore) + parseInt(this.examAllInfo.singleExamScore)) + '分'
          this.examAllInfo.allInfo = s1 + s2
          this.examAllInfo.singleInfo = '' + this.examAllInfo.singleNumber
          this.examAllInfo.singleInfoS = '' + this.examAllInfo.singleExamScore
          this.examAllInfo.multipleInfo = '' + this.examAllInfo.multipleNumber
          this.examAllInfo.multipleInfoS = '' + this.examAllInfo.multipleExamScore
          this.examAllInfo.judgeInfo = '' + this.examAllInfo.judgeNumber
          this.examAllInfo.judgeInfoS = '' + this.examAllInfo.judgeExamScore
        }
      }).catch(() => {
        console.log('获取试卷整体信息失败')
      })
    },
    updateQuestion(value) {
      updateQue(getToken(), value).then(response => {
        console.log(response)
        this.loading = true
        this.$notify({
          title: '成功',
          message: '修改试题成功',
          type: 'success',
          duration: 2000
        })

        this.loading = false
      }).catch(() => {
        console.log('修改试题错误')
        this.$notify({
          title: '失败',
          message: '修改试题失败',
          type: 'success',
          duration: 2000
        })
      })
    },
    deleteQuestion() {
      if (this.postForm.examId < 0) {
        this.$message({
          message: '试卷号有误',
          type: 'warning'
        })
        return
      }
      if (this.examData.queId < 0) {
        this.$message({
          message: '题目序号错误',
          type: 'warning'
        })
        return
      }
      deleteQue({ queId: this.examData.queId }).then(response => {
        if (response === 1) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '删除失败',
            type: 'warning'
          })
        }
      })
    },
    modifiedQuestion() {
      if (this.postForm.examId < 0) {
        this.$message({
          message: '试卷号有误',
          type: 'warning'
        })
        return
      }
      if (this.examData.queId < 0) {
        this.$message({
          message: '题目序号错误',
          type: 'warning'
        })
        return
      }
      if (this.examData.queType < 0) {
        this.$message({
          message: '题目类型错误',
          type: 'warning'
        })
        return
      }
      const reg = /^[A-H]+$/
      if (this.examData.queAnswer.length === 0 || !reg.test(this.examData.queAnswer)) {
        this.$message({
          message: '请填写试题答案(只能用大写字母)',
          type: 'warning'
        })
        return
      } else {
        this.examData.queAnswer = [...new Set(this.examData.queAnswer.split('').sort())].join('')
        console.log('the answer is :' + this.examData.queAnswer)
      }
      if ((this.examData.queType !== 1) && this.examData.queAnswer.length > 1) {
        this.$message({
          message: '单选和判断只能有一个答案',
          type: 'warning'
        })
        return
      }

      if ((this.examData.queScore.length === 0) || isNaN(this.examData.queScore)) {
        this.$message({
          message: '请填写题目分值',
          type: 'warning'
        })
        return
      } else {
        this.examData.queScore = parseInt(this.examData.queScore)
      }

      if (this.examData.queContent.length === 0) {
        this.$message({
          message: '请填写题目内容',
          type: 'warning'
        })
        return
      }
      console.log('this.examData.queType ' + this.examData.queType)
      if (parseInt(this.examData.queType) === 2) {
        if ((this.examData.choiceA.length !== 0) && (this.examData.choiceB.length !== 0)) {
          this.examDataB.queId = this.examData.queId
          this.examDataB.examId = this.postForm.examId
          this.examDataB.queContent = this.examData.queContent
          this.examDataB.queType = this.examData.queType
          this.examDataB.queAnswer = this.examData.queAnswer
          this.examDataB.queScore = this.examData.queScore
          this.examDataB.choiceA = this.examData.choiceA
          this.examDataB.choiceB = this.examData.choiceB

          this.updateQuestion(this.examDataB)

          this.$message({
            message: '修改试题成功',
            type: 'warning'
          })
          return
        } else {
          this.$message({
            message: '请选择正确的题目类型',
            type: 'warning'
          })
          return
        }
      }
      if (this.examData.choiceA === '' || this.examData.choiceA === null || this.examData.choiceA === undefined || this.examData.choiceA.length === 0) {
        this.$message({
          message: '多选和单选题选项不能少于四个',
          type: 'warning'
        })
        return
      }
      if (this.examData.choiceB === '' || this.examData.choiceB === null || this.examData.choiceB === undefined || this.examData.choiceB.length === 0) {
        this.$message({
          message: '多选和单选题选项不能少于四个',
          type: 'warning'
        })
        return
      }
      if (this.examData.choiceC === '' || this.examData.choiceC === null || this.examData.choiceC === undefined || this.examData.choiceC.length === 0) {
        this.$message({
          message: '多选和单选题选项不能少于四个',
          type: 'warning'
        })
        return
      }
      if (this.examData.choiceD === '' || this.examData.choiceD === null || this.examData.choiceD === undefined || this.examData.choiceD.length === 0) {
        this.$message({
          message: '多选和单选题选项不能少于四个',
          type: 'warning'
        })
        return
      }
      if (this.examData.choiceE === '' || this.examData.choiceE === null || this.examData.choiceE === undefined || this.examData.choiceE.length === 0) {
        this.examDataD.queId = this.examData.queId
        this.examDataD.examId = this.postForm.examId
        this.examDataD.queContent = this.examData.queContent
        this.examDataD.queType = this.examData.queType
        this.examDataD.queAnswer = this.examData.queAnswer
        this.examDataD.queScore = this.examData.queScore
        this.examDataD.choiceA = this.examData.choiceA
        this.examDataD.choiceB = this.examData.choiceB
        this.examDataD.choiceC = this.examData.choiceC
        this.examDataD.choiceD = this.examData.choiceD
        this.updateQuestion(this.examDataD)
        this.freshQue()
        return
      }
      if (this.examData.choiceF === '' || this.examData.choiceF === null || this.examData.choiceF === undefined || this.examData.choiceF.length === 0) {
        this.examDataE.queId = this.examData.queId
        this.examDataE.examId = this.postForm.examId
        this.examDataE.queContent = this.examData.queContent
        this.examDataE.queType = this.examData.queType
        this.examDataE.queAnswer = this.examData.queAnswer
        this.examDataE.queScore = this.examData.queScore
        this.examDataE.choiceA = this.examData.choiceA
        this.examDataE.choiceB = this.examData.choiceB
        this.examDataE.choiceC = this.examData.choiceC
        this.examDataE.choiceD = this.examData.choiceD
        this.examDataE.choiceE = this.examData.choiceE
        console.log('choiceF is: ' + this.examData.choiceF)
        this.updateQuestion(this.examDataE)
        this.freshQue()
        return
      }
      if (this.examData.choiceG === '' || this.examData.choiceG === null || this.examData.choiceG === undefined || this.examData.choiceG.length === 0) {
        this.examDataF.queId = this.examData.queId
        this.examDataF.examId = this.postForm.examId
        this.examDataF.queContent = this.examData.queContent
        this.examDataF.queType = this.examData.queType
        this.examDataF.queAnswer = this.examData.queAnswer
        this.examDataF.queScore = this.examData.queScore
        this.examDataF.choiceA = this.examData.choiceA
        this.examDataF.choiceB = this.examData.choiceB
        this.examDataF.choiceC = this.examData.choiceC
        this.examDataF.choiceD = this.examData.choiceD
        this.examDataF.choiceE = this.examData.choiceE
        this.examDataF.choiceF = this.examData.choiceF
        this.updateQuestion(this.examDataF)
        this.freshQue()
        return
      }
      if (this.examData.choiceH === '' || this.examData.choiceH === null || this.examData.choiceH === undefined || this.examData.choiceH.length === 0) {
        this.examDataG.queId = this.examData.queId
        this.examDataG.examId = this.postForm.examId
        this.examDataG.queContent = this.examData.queContent
        this.examDataG.queType = this.examData.queType
        this.examDataG.queAnswer = this.examData.queAnswer
        this.examDataG.queScore = this.examData.queScore
        this.examDataG.choiceA = this.examData.choiceA
        this.examDataG.choiceB = this.examData.choiceB
        this.examDataG.choiceC = this.examData.choiceC
        this.examDataG.choiceD = this.examData.choiceD
        this.examDataG.choiceE = this.examData.choiceE
        this.examDataG.choiceF = this.examData.choiceF
        this.examDataG.choiceG = this.examData.choiceG
        this.updateQuestion(this.examDataG)
        this.freshQue()
        return
      } else {
        this.examDataH.queId = this.examData.queId
        this.examDataH.examId = this.postForm.examId
        this.examDataH.queContent = this.examData.queContent
        this.examDataH.queType = this.examData.queType
        this.examDataH.queAnswer = this.examData.queAnswer
        this.examDataH.queScore = this.examData.queScore
        this.examDataH.choiceA = this.examData.choiceA
        this.examDataH.choiceB = this.examData.choiceB
        this.examDataH.choiceC = this.examData.choiceC
        this.examDataH.choiceD = this.examData.choiceD
        this.examDataH.choiceE = this.examData.choiceE
        this.examDataH.choiceF = this.examData.choiceF
        this.examDataH.choiceG = this.examData.choiceG
        this.examDataH.choiceH = this.examData.choiceH
        this.updateQuestion(this.examDataH)
        this.freshQue()
        return
      }
    },
    changedExamData() {
      this.examData.queId = -1
      this.examData.queContent = ''
      this.examData.queType = -1
      this.examData.queAnswer = ''
      this.examData.queScore = ''
      this.examData.choiceA = ''
      this.examData.choiceB = ''
      this.examData.choiceC = ''
      this.examData.choiceD = ''
      this.examData.choiceE = ''
      this.examData.choiceF = ''
      this.examData.choiceG = ''
      this.examData.choiceH = ''
    },
    shititype() {
    },
    shitihao() {
      // console.log('this shi ti hao changed' + this.postForm.queId)
      if (this.examData.queId > 0) {
        this.canZengjiaShiTi = true
        this.canModShiTi = false
      } else {
        this.canZengjiaShiTi = false
        this.canModShiTi = true

        console.log('this shi ti hao changed xiao' + this.cenNewShiTi)
        this.changedExamData()
        return
      }

      this.paraexam.examId = this.postForm.examId
      this.paraexam.queId = this.examData.queId

      console.log('this examID:' + this.paraexam.examId)
      getOneQuestionByID(getToken(), this.paraexam).then(response => {
        // console.log(':::'+response)

        // for ( let ii = 0 ; ii < response.length; ii++) {
        // let jj = ii+1
        // this.tongzhiOptions.push(response[ii].title)

        console.log('______qqq@@@@@@@@@@@@' + response[0].questions.length)

        this.examData.queContent = response[0].questions[0].queContent
        console.log('______ccc@@@@@@@@@@@@:' + response[0].questions[0].queContent)
        this.examData.queType = response[0].questions[0].queType
        this.examData.queAnswer = response[0].questions[0].queAnswer
        this.examData.queScore = response[0].questions[0].queScore
        this.examData.choiceA = response[0].questions[0].choiceA
        this.examData.choiceB = response[0].questions[0].choiceB
        this.examData.choiceC = response[0].questions[0].choiceC
        this.examData.choiceD = response[0].questions[0].choiceD
        this.examData.choiceE = response[0].questions[0].choiceE
        this.examData.choiceF = response[0].questions[0].choiceF
        this.examData.choiceG = response[0].questions[0].choiceG
        this.examData.choiceH = response[0].questions[0].choiceH

        // console.log('return write time is:' + this.postForm.writeTime)

      //  }
        // console.log('the tz length is:' + this.tongzhiOptions.length)

        // this.tongzhiOptions =  res
      }).catch(() => {
        console.log('获取题目内容错误')
      })
    },

    GetSurveyDetail() {
      console.log('this shi juan hao changed:' + this.postForm.examId)
      if (this.postForm.examId > 0) {
        this.canFaBuShiJuan = false
        this.canNewShiJuan = true
        this.canModShiJuan = false
        this.canModShiTi = true
        this.canZengjiaShiTi = false
      } else {
        this.canFaBuShiJuan = true
        this.canNewShiJuan = false
        this.canModShiJuan = true
        this.canModShiTi = true
        this.canZengjiaShiTi = true
        this.postForm.title = ''
        this.postForm.examLength = -1
        this.postForm.summary = ''
        this.postForm.iStop = -1
        this.postForm.isFinish = -1
        // this.examData.startDate = response.startDate
        this.changedExamData()
        return
      }

      this.parachuanru.examId = this.postForm.examId
      console.log('the shi juan ID:' + this.parachuanru.examId)
      getExamDetailSingle(getToken(), this.parachuanru).then(response => {
        // console.log(':::'+response)

        // for ( let ii = 0 ; ii < response.length; ii++) {
        // let jj = ii+1
        // this.tongzhiOptions.push(response[ii].title)

        // console.log('iii:'+response[ii].title)

        this.postForm.title = response.examName
        this.postForm.examLength = response.examLength
        this.postForm.summary = response.info
        this.postForm.iStop = parseInt(response.iStop)
        this.postForm.isFinish = parseInt(response.isFinish)
        this.postForm.startDate = response.startDate
        this.postForm.shijuanzhuangtai = this.stopNotice[parseInt(this.postForm.iStop) + 1].label
        this.postForm.shifoufabu = this.pubNotice[parseInt(this.postForm.isFinish) + 1].label
        let ss = []

        if (this.postForm.startDate.length >= 8) {
          ss = this.postForm.startDate.split('-')
          console.log('this.postForm.startDate ss0:' + ss[0])
          console.log('this.postForm.startDate ss1:' + ss[1])
          console.log('this.postForm.startDate ss2:' + ss[2])
          console.log('???????????????___________:')
          this.postForm.display_time = new Date(parseInt(ss[0]), parseInt(ss[1]) - 1, parseInt(ss[2]))
          // this.postForm.writeTime = Date.parse(ss[0] + '-' + ss[1] + ss[2] )
        }
        this.postForm.endDate = response.endDate

        console.log('the start date:' + this.postForm.startDate)
        console.log('the end date:' + this.postForm.endDate)
        ss = []
        if (this.postForm.endDate.length >= 8) {
          ss = this.postForm.endDate.split('-')
          console.log('this.postForm.endDate ss0:' + ss[0])
          console.log('this.postForm.endDate ss1:' + ss[1])
          console.log('this.postForm.endDate ss2:' + ss[2])
          this.postForm.display_end_time = new Date(parseInt(ss[0]), parseInt(ss[1]) - 1, parseInt(ss[2]))
          // this.postForm.writeTime = Date.parse(ss[0] + '-' + ss[1] + ss[2] )
        }
        // console.log('return write time is:' + this.postForm.writeTime)

      //  }
        // console.log('the tz length is:' + this.tongzhiOptions.length)

        // this.tongzhiOptions =  res
      }).catch(() => {
        console.log('获取题目内容错误')
      })

      let map = Object()
      map.key = -1
      map.label = '请选择'
      this.timuSet = []
      this.timuSet[0] = map
      // this.tongzhiOptions[1] = '请选择通知编号'

      getAllQuestionByID(getToken(), this.parachuanru).then(response => {
        // console.log(':::'+response.length)
        for (var ii = 0; ii < response.length; ii++) {
          // let jj = ii+1
          map = Object()
          map.key = response[ii].queId
          map.label = response[ii].queContent
          this.timuSet.push(map)

          // console.log('iii:'+response[ii].title)
        }
        // console.log('the tz length is:' + this.tongzhiOptions.length)

        for (let kk = 0; kk < this.timuSet.length; kk++) {
        // console.log('kk:'+kk+' => ' + this.tongzhiOptions[kk] )
        }
        // this.tongzhiOptions =  res
      }).catch(() => {
        console.log('获取题目错误')
      })

      this.parachuanru.examId = this.postForm.examId
      getInfo(getToken(), this.parachuanru).then(response => {
        // console.log(':::'+response.length)
        if (response) {
          this.examAllInfo.examId = response.examId
          this.examAllInfo.judgeExamScore = response.judgeExamScore
          this.examAllInfo.judgeNumber = response.judgeNumber
          this.examAllInfo.multipleExamScore = response.multipleExamScore
          this.examAllInfo.multipleNumber = response.multipleNumber
          this.examAllInfo.singleExamScore = response.singleExamScore
          this.examAllInfo.singleNumber = response.singleNumber
          console.log('获取 整体信息:' + this.examAllInfo.examId)
          const s1 = '' + (parseInt(this.examAllInfo.judgeNumber) + parseInt(this.examAllInfo.multipleNumber) + parseInt(this.examAllInfo.singleNumber)) + '试题 '
          const s2 = '' + (parseInt(this.examAllInfo.judgeExamScore) + parseInt(this.examAllInfo.multipleExamScore) + parseInt(this.examAllInfo.singleExamScore)) + '分'
          this.examAllInfo.allInfo = s1 + s2
          this.examAllInfo.singleInfo = '' + this.examAllInfo.singleNumber
          this.examAllInfo.singleInfoS = '' + this.examAllInfo.singleExamScore

          this.examAllInfo.multipleInfo = '' + this.examAllInfo.multipleNumber
          this.examAllInfo.multipleInfoS = '' + this.examAllInfo.multipleExamScore

          this.examAllInfo.judgeInfo = '' + this.examAllInfo.judgeNumber
          this.examAllInfo.judgeInfoS = '' + this.examAllInfo.judgeExamScore
        }
      }).catch(() => {
        console.log('获取试卷整体信息失败')
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
        this.postForm = response
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
    insertQuestion(value) {
      insertQue(getToken(), value).then(response => {
        this.loading = true
        this.$notify({
          title: '成功',
          message: '创建试题成功',
          type: 'success',
          duration: 2000
        })
        this.postForm.status = 'published'
        this.loading = false
      }).catch(() => {
        console.log('插入试题错误')
        this.$notify({
          title: '失败',
          message: '创建试卷失败',
          type: 'error',
          duration: 2000
        })
      })
    },
    submitForm() {
      this.canInsertQue = true
      this.chuanru.examName = this.postForm.title
      this.chuanru.startDate = this.postForm.startDate
      this.chuanru.endDate = this.postForm.endDate
      this.chuanru.examLength = this.postForm.examLength
      this.chuanru.info = this.postForm.summary

      if (this.postForm.examId < 0) {
        this.$message({
          message: '试卷号有误',
          type: 'warning'
        })
        return
      }

      if (this.examData.queType < 0) {
        this.$message({
          message: '题目类型错误',
          type: 'warning'
        })
        return
      }
      const reg = /^[A-H]+$/
      if (this.examData.queAnswer.length === 0 || !reg.test(this.examData.queAnswer)) {
        this.$message({
          message: '请填写试题答案(只能用大写字母)',
          type: 'warning'
        })
        return
      } else {
        this.examData.queAnswer = [...new Set(this.examData.queAnswer.split('').sort())].join('')// this.examData.queAnswer.split('').sort().join('')
        console.log('the answer is :' + this.examData.queAnswer)
      }
      if ((this.examData.queType !== 1) && this.examData.queAnswer.length > 1) {
        this.$message({
          message: '单选和判断只能有一个答案',
          type: 'warning'
        })
        return
      }
      if ((this.examData.queScore.length === 0) || isNaN(this.examData.queScore)) {
        this.$message({
          message: '请填写题目分值',
          type: 'warning'
        })
        return
      } else {
        this.examData.queScore = parseInt(this.examData.queScore)
      }

      if (this.examData.queContent.length === 0) {
        this.$message({
          message: '请填写题目内容',
          type: 'warning'
        })
        return
      }
      if (this.examData.queType === 2) {
        if ((this.examData.choiceA.length !== 0) && (this.examData.choiceB.length !== 0)) {
          this.examDataB.examId = this.postForm.examId
          this.examDataB.queContent = this.examData.queContent
          this.examDataB.queType = this.examData.queType
          this.examDataB.queAnswer = this.examData.queAnswer
          this.examDataB.queScore = this.examData.queScore
          this.examDataB.choiceA = this.examData.choiceA
          this.examDataB.choiceB = this.examData.choiceB

          this.insertQuestion(this.examDataB)

          this.$message({
            message: '插入试题成功',
            type: 'success'
          })
          return
        } else {
          this.$message({
            message: '请填写选项的内容',
            type: 'warning'
          })
          return
        }
      }

      if (this.examData.choiceA === '' || this.examData.choiceA === null || this.examData.choiceA === undefined || this.examData.choiceA.length === 0) {
        this.$message({
          message: '多选和单选题选项不能少于四个',
          type: 'warning'
        })
        return
      }
      if (this.examData.choiceB === '' || this.examData.choiceB === null || this.examData.choiceB === undefined || this.examData.choiceB.length === 0) {
        this.$message({
          message: '多选和单选题选项不能少于四个',
          type: 'warning'
        })
        return
      }
      if (this.examData.choiceC === '' || this.examData.choiceC === null || this.examData.choiceC === undefined || this.examData.choiceC.length === 0) {
        this.$message({
          message: '多选和单选题选项不能少于四个',
          type: 'warning'
        })
        return
      }
      if (this.examData.choiceD === '' || this.examData.choiceD === null || this.examData.choiceD === undefined || this.examData.choiceD.length === 0) {
        this.$message({
          message: '多选和单选题选项不能少于四个',
          type: 'warning'
        })
        return
      }
      if (this.examData.choiceE === '' || this.examData.choiceE === null || this.examData.choiceE === undefined || this.examData.choiceE.length === 0) {
        this.examDataD.examId = this.postForm.examId
        this.examDataD.queContent = this.examData.queContent
        this.examDataD.queType = this.examData.queType
        this.examDataD.queAnswer = this.examData.queAnswer
        this.examDataD.queScore = this.examData.queScore
        this.examDataD.choiceA = this.examData.choiceA
        this.examDataD.choiceB = this.examData.choiceB
        this.examDataD.choiceC = this.examData.choiceC
        this.examDataD.choiceD = this.examData.choiceD
        this.insertQuestion(this.examDataD)
        this.freshQue()
        return
      }
      if (this.examData.choiceF === '' || this.examData.choiceF === null || this.examData.choiceF === undefined || this.examData.choiceF.length === 0) {
        this.examDataE.examId = this.postForm.examId
        this.examDataE.queContent = this.examData.queContent
        this.examDataE.queType = this.examData.queType
        this.examDataE.queAnswer = this.examData.queAnswer
        this.examDataE.queScore = this.examData.queScore
        this.examDataE.choiceA = this.examData.choiceA
        this.examDataE.choiceB = this.examData.choiceB
        this.examDataE.choiceC = this.examData.choiceC
        this.examDataE.choiceD = this.examData.choiceD
        this.examDataE.choiceE = this.examData.choiceE
        this.insertQuestion(this.examDataE)
        this.freshQue()
        return
      }
      if (this.examData.choiceG === '' || this.examData.choiceG === null || this.examData.choiceG === undefined || this.examData.choiceG.length === 0) {
        this.examDataF.examId = this.postForm.examId
        this.examDataF.queContent = this.examData.queContent
        this.examDataF.queType = this.examData.queType
        this.examDataF.queAnswer = this.examData.queAnswer
        this.examDataF.queScore = this.examData.queScore
        this.examDataF.choiceA = this.examData.choiceA
        this.examDataF.choiceB = this.examData.choiceB
        this.examDataF.choiceC = this.examData.choiceC
        this.examDataF.choiceD = this.examData.choiceD
        this.examDataF.choiceE = this.examData.choiceE
        this.examDataF.choiceF = this.examData.choiceF
        this.insertQuestion(this.examDataF)
        this.freshQue()
        return
      }
      if (this.examData.choiceH === '' || this.examData.choiceH === null || this.examData.choiceH === undefined || this.examData.choiceH.length === 0) {
        this.examDataG.examId = this.postForm.examId
        this.examDataG.queContent = this.examData.queContent
        this.examDataG.queType = this.examData.queType
        this.examDataG.queAnswer = this.examData.queAnswer
        this.examDataG.queScore = this.examData.queScore
        this.examDataG.choiceA = this.examData.choiceA
        this.examDataG.choiceB = this.examData.choiceB
        this.examDataG.choiceC = this.examData.choiceC
        this.examDataG.choiceD = this.examData.choiceD
        this.examDataG.choiceE = this.examData.choiceE
        this.examDataG.choiceF = this.examData.choiceF
        this.examDataG.choiceG = this.examData.choiceG
        this.insertQuestion(this.examDataG)
        this.freshQue()
        return
      } else {
        this.examDataH.examId = this.postForm.examId
        this.examDataH.queContent = this.examData.queContent
        this.examDataH.queType = this.examData.queType
        this.examDataH.queAnswer = this.examData.queAnswer
        this.examDataH.queScore = this.examData.queScore
        this.examDataH.choiceA = this.examData.choiceA
        this.examDataH.choiceB = this.examData.choiceB
        this.examDataH.choiceC = this.examData.choiceC
        this.examDataH.choiceD = this.examData.choiceD
        this.examDataH.choiceE = this.examData.choiceE
        this.examDataH.choiceF = this.examData.choiceF
        this.examDataH.choiceG = this.examData.choiceG
        this.examDataH.choiceH = this.examData.choiceH
        this.insertQuestion(this.examDataH)
        this.freshQue()
        return
      }
    },

    freshQue() {
      this.parachuanru.examId = this.postForm.examId
      getInfo(getToken(), this.parachuanru).then(response => {
        // console.log(':::'+response.length)
        if (response) {
          this.examAllInfo.examId = response.examId
          this.examAllInfo.judgeExamScore = response.judgeExamScore
          this.examAllInfo.judgeNumber = response.judgeNumber
          this.examAllInfo.multipleExamScore = response.multipleExamScore
          this.examAllInfo.multipleNumber = response.multipleNumber
          this.examAllInfo.singleExamScore = response.singleExamScore
          this.examAllInfo.singleNumber = response.singleNumber
          console.log('获取 整体信息:' + this.examAllInfo.examId)
          const s1 = '' + (parseInt(this.examAllInfo.judgeNumber) + parseInt(this.examAllInfo.multipleNumber) + parseInt(this.examAllInfo.singleNumber)) + '试题 '
          const s2 = '' + (parseInt(this.examAllInfo.judgeExamScore) + parseInt(this.examAllInfo.multipleExamScore) + parseInt(this.examAllInfo.singleExamScore)) + '分'
          this.examAllInfo.allInfo = s1 + s2
          this.examAllInfo.singleInfo = '' + this.examAllInfo.singleNumber
          this.examAllInfo.singleInfoS = '' + this.examAllInfo.singleExamScore

          this.examAllInfo.multipleInfo = '' + this.examAllInfo.multipleNumber
          this.examAllInfo.multipleInfoS = '' + this.examAllInfo.multipleExamScore

          this.examAllInfo.judgeInfo = '' + this.examAllInfo.judgeNumber
          this.examAllInfo.judgeInfoS = '' + this.examAllInfo.judgeExamScore
        }
      }).catch(() => {
        console.log('获取试卷整体信息失败')
      })

      this.parachuanru.examId = this.postForm.examId
      let map = Object()
      map.key = -1
      map.label = '请选择'
      this.timuSet = []
      this.timuSet[0] = map
      // this.tongzhiOptions[1] = '请选择通知编号'

      getAllQuestionByID(getToken(), this.parachuanru).then(response => {
        // console.log(':::'+response.length)
        for (var ii = 0; ii < response.length; ii++) {
          // let jj = ii+1
          map = Object()
          map.key = response[ii].queId
          map.label = response[ii].queContent
          this.timuSet.push(map)

          // console.log('iii:'+response[ii].title)
        }
        // console.log('the tz length is:' + this.tongzhiOptions.length)

        for (let kk = 0; kk < this.timuSet.length; kk++) {
        // console.log('kk:'+kk+' => ' + this.tongzhiOptions[kk] )
        }
        // this.tongzhiOptions =  res
      }).catch(() => {
        console.log('获取题目错误')
      })
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
        if (!response.items) return
        this.userListOptions = response.items.map(v => v.name)
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
    padding: 20px 45px 20px 50px;
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
