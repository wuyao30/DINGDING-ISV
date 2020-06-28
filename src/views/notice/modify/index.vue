<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :label-position="labelPosition" :rules="rules" class="form-container">

      <sticky :class-name="'sub-navbar'">

        <el-button v-loading="loading" :disabled="canMod" style="margin-left: 10px;" type="success" @click="submitForm">修改通知
        </el-button>
        <el-button v-loading="loading" :disabled="canMod" style="margin-left: 10px;" type="success" @click="deleteForm">删除通知
        </el-button>

      </sticky>

      <div class="createPost-main-container">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label-width="80px" label="通知类型:" class="postInfo-container-item">
              <el-select v-model="parachuanru.type" :placeholder="请选择" clearable class="filter-item" @change="tongzhileixing">
                <el-option v-for="item in noticeOptions" :key="item.key" :label="item.label" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="80px" label="通知序号:" class="postInfo-container-item">
              <el-select ref="selecttz" v-model="parachuanru.id" :placeholder="请选择" clearable class="filter-item" @change="tongzhixuhao">
                <el-option v-for="(elem,index) of tongzhiOptions" :key="index" :label="elem.label" :value="elem.key" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label-width="80px" label="发布人员:" class="postInfo-container-item">
              <el-input v-model="postForm.writeUser" :placeholder="发布人员" required />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label-width="80px" label="发布时间:" class="postInfo-container-item">
              <el-date-picker v-model="postForm.display_time" type="date" placeholder="选择日期时间" @change="changeEnd" />
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item label-width="80px" label="重要性:" class="postInfo-container-item">
              <el-rate
                v-model="postForm.importance"
                :max="3"
                :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                :low-threshold="1"
                :high-threshold="3"
                style="margin-top:8px;"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <div class="postInfo-container">
          <el-row>
            <el-col :span="24">
              <el-form-item style="margin-bottom: 20px;" label-width="80px" label="通知标题:">
                <el-input v-model="postForm.title" :rows="1" type="textarea" clearable class="article-textarea" autosize placeholder="请输入通知标题" />
                <span v-show="titleShortLength" class="word-counter">{{ titleShortLength }}字</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-form-item style="margin-bottom: 40px;" label-width="80px" label="摘要:">
          <el-input v-model="postForm.summary" :rows="1" type="textarea" class="article-textarea" autosize placeholder="请输入内容" />
          <span v-show="summaryShortLength" class="word-counter">{{ summaryShortLength }}字</span>
        </el-form-item>
        <div class="editor-container">
          <Tinymce ref="editor" v-model="postForm.infoContent" :height="400" />
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validateURL } from '@/utils/validate'
import { userSearch } from '@/api/remoteSearch'
import { getNotice, updateNotice, deleteNotice } from '@/api/login'
import { fetchArticle } from '@/api/article'
import { getToken } from '@/utils/auth'

const defaultForm = {
  status: 'draft',
  title: '', // 文章题目
  writeTime: '',
  type: -1,
  istop: 0,
  writeUser: '',
  infoContent: '', // 文章内容
  summary: '', // 文章摘要
  source_uri: '', // 文章外链
  image_uri: '', // 文章图片
  display_time: undefined, // 前台展示时间
  id: undefined,
  tongzhiId: 0,
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 1
}

export default {
  name: 'ModArticleDetail',
  components: { Tinymce, Sticky },
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
      noticeOptions: [{ label: '请选择', key: 0 }, { label: '通知公告', key: 1 }, { label: '上级声音', key: 2 }, { label: '警示公告', key: 3 }, { label: '交流园地', key: 4 }, { label: '资料库', key: 5 }],
      tongzhiOptions: [],
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      canNew: false,
      canMod: true,
      parachuanru: {
        id: 0,
        type: 0
      },
      chuanru: {
        id: '',
        title: '', // 文章题目
        writeTime: '',
        type: 0,
        istop: 0,
        writeUser: '',
        infoContent: '', // 文章内容
        summary: '', // 文章摘要
        importance: 1
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
    contentShortLength() {
      return this.postForm.title.length
    },
    summaryShortLength() {
      return this.postForm.summary.length
    },
    titleShortLength() {
      return this.postForm.title.length
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
  },
  methods: {
    previewInfo() {
      console.log(this.postForm.infoContent)
    },
    tongzhixuhao() {
      if (this.canNew === true && this.parachuanru.id > 0) {
        this.canMod = false
      } else {
        this.canMod = true
        console.log('xxxxx00000')
        this.$refs.editor.setContent('')
        this.postForm.importance = 0
        this.postForm.writeUser = ''
        this.postForm.title = ''
        this.postForm.summary = ''
        return
      }
      console.log('the id is:' + this.parachuanru.id)
      getNotice(getToken(), this.parachuanru).then(response => {
        // console.log(':::'+ response.data.length)
        this.postForm.importance = response.data[0].importance
        this.postForm.writeUser = response.data[0].writeUser
        this.postForm.title = response.data[0].title
        this.postForm.summary = response.data[0].summary
        this.postForm.infoContent = response.data[0].infoContent
        this.$refs.editor.setContent(this.postForm.infoContent)
        this.postForm.writeTime = response.data[0].writeTime
        // if (this.postForm.writeTime.length >= 8) {
        //   ss = this.postForm.writeTime.split('-')
        //   console.log('return write time ss0:' + ss[0])
        //   console.log('return write time ss1:' + ss[1])
        //   console.log('return write time ss2:' + ss[2])
        //   this.postForm.display_time = new Date(parseInt(ss[0]), parseInt(ss[1]) - 1, parseInt(ss[2]))
        //   this.postForm.writeTime = Date.parse(ss[0] + '-' + ss[1] + ss[2] )
        // }
        console.log('return write time is:' + this.postForm.writeTime)
        for (let kk = 0; kk < this.tongzhiOptions.length; kk++) {
          console.log('hello')
        }
      }).catch(e => {
        console.log(e)
        console.log('获取通知ID错误')
      })
    },
    tongzhileixing() {
      if (this.parachuanru.type > 0) {
        this.canNew = true
        this.parachuanru.id = 0
        this.tongzhiOptions.length = 0
      } else {
        this.canNew = false
        this.parachuanru.id = 0
        this.tongzhiOptions.length = 0
        this.$refs.selecttz = -1
        this.$refs.editor.setContent('')
        this.postForm.importance = 0
        this.postForm.writeUser = ''
        this.postForm.title = ''
        this.postForm.summary = ''
        return
      }
      this.$refs.editor.setContent('')
      this.postForm.infoContent = ''
      let map = Object()
      map.key = ''
      map.label = '请选择'
      this.tongzhiOptions = []
      this.tongzhiOptions[0] = map
      getNotice(getToken(), this.parachuanru).then(response => {
        for (var ii = 0; ii < response.data.length; ii++) {
          map = Object()
          map.key = response.data[ii].id
          map.label = response.data[ii].title
          this.tongzhiOptions.push(map)
        }
        // for (let kk = 0; kk < this.tongzhiOptions.length; kk++) {
        // }
      }).catch(() => {
        console.log('获取通知ID错误')
      })
    },
    changeEnd() {
      const strYear = String(this.postForm.display_time.getFullYear())
      const strMonth = String(this.postForm.display_time.getMonth() + 1)
      const strDay = String(this.postForm.display_time.getDate())
      const strM = strMonth.valueOf().padStart(2, '0')
      const strD = strDay.valueOf().padStart(2, '0')
      this.postForm.writeTime = strYear.valueOf() + '-' + strM + '-' + strD
      console.log('long lhai ying:' + this.postForm.writeTime)
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
    modifyForm() {

    },
    submitForm() {
      this.chuanru.id = this.parachuanru.id
      this.chuanru.type = this.parachuanru.type
      this.chuanru.title = this.postForm.title
      this.chuanru.writeUser = this.postForm.writeUser
      this.chuanru.writeTime = this.postForm.writeTime
      this.chuanru.infoContent = this.postForm.infoContent
      this.chuanru.importance = this.postForm.importance
      this.chuanru.summary = this.postForm.summary
      this.chuanru.istop = this.postForm.istop
      // console.log('the type is:'+this.postForm.noticetype)
      if (this.canNew === false || this.parachuanru.id < 0) {
        this.$message({
          message: '通知ID有误',
          type: 'warning'
        })
        return
      }
      if (this.parachuanru.type < 1 || (this.parachuanru.type === '')) {
        this.$message({
          message: '请选择发布类型',
          type: 'warning'
        })
        return
      }
      if (this.postForm.writeUser.length === 0) {
        this.$message({
          message: '请填写作者',
          type: 'warning'
        })
        return
      }
      /* if (this.postForm.writeTime.length === 0 ) {
          this.$message({
            message: '请填写发布时间',
            type: 'warning'
          })
          return
        }*/
      if (this.postForm.title.length === 0) {
        this.$message({
          message: '请填写标题',
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
      if (this.postForm.infoContent.length === 0) {
        this.$message({
          message: '请填写内容',
          type: 'warning'
        })
        return
      }
      updateNotice(getToken(), this.chuanru).then(response => {
        console.log(response.data)
        this.loading = true
        this.$notify({
          title: '成功',
          message: '修改文件/通知成功',
          type: 'success',
          duration: 2000
        })
        this.loading = false
      }).catch(() => {
        console.log('修改通知错误')
        this.$notify({
          title: '失败',
          message: '修改文章失败',
          type: 'success',
          duration: 2000
        })
      })
    },
    deleteForm() {
      this.chuanru.id = this.parachuanru.id
      this.chuanru.type = this.parachuanru.type
      this.chuanru.title = this.postForm.title
      this.chuanru.writeUser = this.postForm.writeUser
      this.chuanru.writeTime = this.postForm.writeTime
      this.chuanru.infoContent = this.postForm.infoContent
      this.chuanru.importance = this.postForm.importance
      this.chuanru.summary = this.postForm.summary
      this.chuanru.istop = this.postForm.istop
      // console.log('the type is:'+this.postForm.noticetype
      deleteNotice(getToken(), this.chuanru).then(
        response => {
          console.log(response.data)
          this.loading = true
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.loading = false
        }).catch(() => {
        console.log('修改通知错误')
        this.$notify({
          title: '失败',
          message: '删除失败',
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
        message: '修改成功',
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
