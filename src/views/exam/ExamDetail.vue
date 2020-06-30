<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" :label-position="labelPosition" class="form-container">
      <sticky :class-name="'sub-navbar'">
        <el-button v-loading="loading" :disabled="canNewSurvey" type="success" @click="submitForm">新建试卷</el-button>
        <el-button v-loading="loading" :disabled="canModSurvey" type="warning" @click="modifyExam(0)">修改试卷</el-button>
        <el-button v-loading="loading" :disabled="canModSurvey" type="warning" @click="deleteExam">删除试卷</el-button>
      </sticky>
      <div class="createPost-main-container">
        <el-row :gutter="20">
          <el-col :span="7">
            <el-form-item tyle="margin-bottom: 20px;" label-width="80px" label="试卷编号:">
              <el-select v-model="postForm.examId" clearable class="postInfo-container-item" @change="shijuanhao" >
                <el-option v-for="item in noticeOptions" :key="item.key" :label="item.label" :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item style="margin-bottom: 20px;" label-width="80px" label="试卷标题:">
              <el-input :rows="1" v-model="postForm.title" type="textarea" clearable class="article-textarea" autosize placeholder="请输入试卷标题"/>
              <span v-show="titleShortLength" class="word-counter">{{ titleShortLength }}字</span>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="postInfo-container">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label-width="80px" label="开始时间:" class="postInfo-container-item">
                <el-date-picker v-model="postForm.startDate" type="date" placeholder="选择日期时间" @change="changeEnd"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="80px" label="结束时间:" class="postInfo-container-item">
                <el-date-picker v-model="postForm.endDate" type="date" placeholder="选择日期时间" @change="changeEndd"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label-width="80px" label="考试时长:" class="postInfo-container-item">
                <el-input style="width: 220px;" v-model="postForm.examLength" required/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item tyle="margin-bottom: 20px;" label-width="80px" label="考试状态:" class="postInfo-container-item">
                <el-select v-model="postForm.iStop" clearable class="filter-item" style="width: 220px;">
                  <el-option v-for="item in stopNotice" ref="zhuangtai" :key="item.key" :label="item.label" :value="item.key"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-form-item style="margin-bottom: 20px;" label-width="80px" label="试卷摘要:">
          <el-input :rows="1" v-model="postForm.summary" type="textarea" class="article-textarea" autosize placeholder="请输入内容"/>
          <span v-show="summaryShortLength" class="word-counter">{{ summaryShortLength }}字</span>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label-width="90px" label="本试卷共有:" class="postInfo-container-item">
              <el-input v-model="examAllInfo.allInfo" disabled="true" style="width: 200px;" required/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label-width="90px" label="单选题:" class="postInfo-container-item">
              <el-input v-model="examAllInfo.singleInfo" disabled="true" style="width: 200px;" required/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="90px" label="分值:" class="postInfo-container-item">
              <el-input v-model="examAllInfo.singleInfoS" disabled="true" style="width: 200px;" required/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label-width="90px" label="多选题:" class="postInfo-container-item">
              <el-input v-model="examAllInfo.multipleInfo" disabled="true" style="width: 200px;" required/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="90px" label="分值:" class="postInfo-container-item">
              <el-input v-model="examAllInfo.multipleInfoS" disabled="true" style="width: 200px;" required/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label-width="90px" label="判断题:" class="postInfo-container-item">
              <el-input v-model="examAllInfo.judgeInfo" disabled="true" style="width: 200px;" required/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="90px" label="分值:" class="postInfo-container-item">
              <el-input v-model="examAllInfo.judgeInfoS" disabled="true" style="width: 200px;" required/>
            </el-form-item>
          </el-col>
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
import { getExamInfo, getExamDetailSingle, insertExample, updateExam, getAllQuestionByID, getOneQuestionByID, getInfo, deleteExam } from '@/api/login'
import { getToken } from '@/utils/auth'

const defaultForm = {
  status: 'draft',
  title: '', // 文章题目
  startDate: '',
  endDate: '',
  examLength: 0,
  type: 0,
  iStop: 0,
  isFinish: -1,
  writeUser: '',
  infoContent: '', // 文章内容
  summary: '', // 文章摘要
  source_uri: '', // 文章外链
  image_uri: '', // 文章图片
  display_time: undefined, // 前台展示时间
  display_end_time: undefined, // 前台展示时间
  zhuangtai: '',
  fabu: '',

  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 1,
  queId: 0,
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
  choiceH: ''

}

export default {
  name: 'ExamDetail',
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
      stopNotice: [{ label: '考试停止', key: 0 }, { label: '考试开始', key: 1 }],
      pubNotice: [{ label: '请选择', key: -1 }, { label: '试卷未发布', key: 0 }, { label: '试卷已发布', key: 1 }],
      timuSet: [{ label: '请选择试题', key: -1 }],
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

    // stopNotice pubNotice
    //  this.stopNotice = Object.assign({}, this.stopNotice)
    //   this.$set(this.pubNotice,this.pubNotice,'')
    getExamInfo(getToken()).then(response => {
      for (var ii = 0; ii < response.length; ii++) {
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
      console.log('获取通知ID错误')
    })
  },
  methods: {
    shijuanhao() {
      console.log('this shi juan hao changed:' + this.postForm.examId)
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
        return
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
        this.postForm.endDate = response.endDate
        let ss = []

        // stopNotice pubNotice
        console.log('istop label：' + this.stopNotice[parseInt(this.chuanru.iStop) + 1].label)
        this.postForm.zhuangtai = this.stopNotice[parseInt(this.chuanru.iStop) + 1].label
        this.postForm.fabu = this.pubNotice[parseInt(this.chuanru.isFinish) + 1].label
        //  this.$set( this.$refs.zhuangtai.label ,this.stopNotice[parseInt(this.chuanru.iStop) +1].label)
        //  this.$refs.fabu.label = this.pubNotice[parseInt(this.chuanru.isFinish) +1].key

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
    shitihao() {
      // console.log('this shi ti hao changed' + this.postForm.queId)
      if (this.postForm.queId > 0) {
        this.canZengjiaShiTi = true
        this.canModShiTi = false

        this.paraexam.examId = this.postForm.examId
        this.paraexam.queId = this.postForm.queId

        console.log('this examID:' + this.paraexam.examId)
        getOneQuestionByID(getToken(), this.paraexam).then(response => {
          // console.log(':::'+response)

          // for ( let ii = 0 ; ii < response.length; ii++) {
          // let jj = ii+1
          // this.tongzhiOptions.push(response[ii].title)

          console.log('______qqq@@@@@@@@@@@@' + response[0].questions.length)

          this.postForm.queContent = response[0].questions[0].queContent
          console.log('______ccc@@@@@@@@@@@@:' + response[0].questions[0].queContent)
          this.postForm.queType = response[0].questions[0].queType
          this.postForm.queAnswer = response[0].questions[0].queAnswer
          this.postForm.queScore = response[0].questions[0].queScore
          this.postForm.choiceA = response[0].questions[0].choiceA
          this.postForm.choiceB = response[0].questions[0].choiceB
          this.postForm.choiceC = response[0].questions[0].choiceC
          this.postForm.choiceD = response[0].questions[0].choiceD
          this.postForm.choiceE = response[0].questions[0].choiceE
          this.postForm.choiceF = response[0].questions[0].choiceF
          this.postForm.choiceG = response[0].questions[0].choiceG
          this.postForm.choiceH = response[0].questions[0].choiceH

        // console.log('return write time is:' + this.postForm.writeTime)

          //  }
          // console.log('the tz length is:' + this.tongzhiOptions.length)

        // this.tongzhiOptions =  res
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
        this.chuanru.iStop = response.iStop
        this.chuanru.isFinish = response.isFinish
        this.iStop = parseInt(response.iStop)
        this.isFinish = parseInt(response.isFinish)
        this.postForm.startDate = response.startDate
        let ss = []

        // stopNotice pubNotice
        console.log('istop label：' + this.stopNotice[parseInt(this.chuanru.iStop) + 1].label)
        this.postForm.zhuangtai = this.stopNotice[parseInt(this.chuanru.iStop) + 1].label
        this.postForm.fabu = this.pubNotice[parseInt(this.chuanru.isFinish) + 1].label

        if (this.postForm.startDate.length >= 8) {
          ss = this.postForm.startDate.split('-')
          console.log('this.postForm.startDate ss0:' + ss[0])
          console.log('this.postForm.startDate ss1:' + ss[1])
          console.log('this.postForm.startDate ss2:' + ss[2])
          console.log('???????????????___________:')
          this.postForm.display_time = new Date(parseInt(ss[0]), parseInt(ss[1]) - 1, parseInt(ss[2]))
          // this.ostForm.writeTime = Date.parse(ss[0] + '-' + ss[1] + ss[2] )
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
    deleteExam() {
      this.chuanru.examId = this.postForm.examId
      this.chuanru.examName = this.postForm.title
      this.chuanru.startDate = this.postForm.startDate
      this.chuanru.endDate = this.postForm.endDate
      this.chuanru.examLength = this.postForm.examLength
      this.chuanru.info = this.postForm.summary
      deleteExam(getToken(), this.chuanru)
        .then(response => {
          this.loading = true
          this.$notify({
            title: '成功',
            message: '删除试卷成功',
            type: 'success',
            duration: 2000
          })
          this.postForm.status = 'published'
          this.loading = false
        })
        .catch(() => {
          this.$notify({
            title: '失败',
            message: '删除试卷失败',
            type: 'success',
            duration: 2000
          })
        })
      this.postForm = {}
    },
    modifyExam(value) {
      this.chuanru.examId = this.postForm.examId
      this.chuanru.examName = this.postForm.title
      this.chuanru.startDate = this.postForm.startDate
      this.chuanru.endDate = this.postForm.endDate
      this.chuanru.examLength = this.postForm.examLength
      this.chuanru.info = this.postForm.summary
      this.chuanru.iStop = this.postForm.iStop
      if (value === 1) {
        this.chuanru.isFinish = 1
        console.log('PUBLISHED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
      }
      if (this.postForm.title.length === 0) {
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
      if (this.postForm.examLength === 0) {
        this.$message({
          message: '请填写考试时长',
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
      updateExam(getToken(), this.chuanru).then(response => {
        console.log(response)
        this.loading = true
        this.$notify({
          title: '成功',
          message: '修改试卷成功',
          type: 'success',
          duration: 2000
        })
        this.postForm.status = 'published'
        this.loading = false
      }).catch(() => {
        console.log('发布试卷错误')
        this.$notify({
          title: '失败',
          message: '修改试卷失败',
          type: 'success',
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

      // this.chuanru.iStop = this.postForm.iStop
      // this.chuanru.isFinish = this.postForm.isFinish

      this.chuanru.iStop = this.iStop
      this.chuanru.isFinish = this.isFinish
      if (this.postForm.title.length === 0) {
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
      if (this.postForm.examLength === 0) {
        this.$message({
          message: '请填写考试时长',
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

      insertExample(getToken(), this.chuanru).then(response => {
        console.log(response)
        this.loading = true
        this.$notify({
          title: '成功',
          message: '创建试卷成功',
          type: 'success',
          duration: 2000
        })
        this.postForm.status = 'published'
        this.loading = false
      }).catch(() => {
        console.log('插入试卷错误')
        this.$notify({
          title: '失败',
          message: '创建试卷失败',
          type: 'success',
          duration: 2000
        })
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
