<template>
  <div class="createPost-container">
    <sticky :class-name="'sub-navbar'">
      <el-button v-loading="loading" :disabled="canNew" style="margin-left: 10px;" type="success" @click="submitForm">
        创建通知
      </el-button>
    </sticky>
    <el-form ref="postForm" :model="postForm" label-position="left" :rules="rules" class="form-container">
      <div class="createPost-main-container">
        <el-row :gutter="15">
          <el-col :span="6">
            <el-form-item label-width="80px" label="通知类型:" class="postInfo-container-item">
              <el-select v-model="postForm.type" placeholder="请选择" clearable class="filter-item">
                <el-option v-for="item in noticeOptions" :key="item.key" :label="item.label" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="80px" label="发布人员:" class="postInfo-container-item">
              <el-input v-model="postForm.writeUser" placeholder="发布人员" required />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="80px" label="发布时间:" class="postInfo-container-item">
              <el-date-picker v-model="postForm.display_time" type="date" placeholder="选择日期时间" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
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
            <el-col :span="20">
              <el-form-item style="margin-bottom: 20px;" label-width="80px" label="通知标题:">
                <el-input v-model="postForm.title" :rows="1" type="textarea" clearable class="article-textarea" autosize placeholder="请输入通知标题" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="postInfo-container">
          <el-row>
            <el-col :span="20">
              <el-form-item style="margin-bottom: 40px;" label-width="80px" label="摘要:">
                <el-input v-model="postForm.summary" type="textarea" class="article-textarea" autosize placeholder="请输入内容" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="editor-container">
          <Tinymce ref="editor" v-model="postForm.infoContent" :height="400" />
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import Tinymce from '@/components/Tinymce'
import { insertNotice } from '@/api/notice'

const defaultForm = {
  status: 'draft',
  title: '', // 文章题目
  writeTime: '',
  type: undefined,
  istop: 0,
  writeUser: undefined,
  infoContent: '', // 文章内容
  summary: '', // 文章摘要
  source_uri: '', // 文章外链
  image_uri: '', // 文章图片
  display_time: undefined, // 前台展示时间
  id: undefined,
  tongzhiId: 0,
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 0
}
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

export default {
  name: 'Index',
  components: { Sticky, Tinymce },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      noticeOptions: [{ label: '通知公告', key: 1 }, { label: '上级声音', key: 2 }, { label: '警示公告', key: 3 }, { label: '交流园地', key: 4 }, { label: '资料库', key: 5 }],
      loading: false,
      canNew: false,
      rules: {
        title: [{ validator: validateRequire }],
        infoContent: [{ validator: validateRequire }]
      }
    }
  },
  methods: {
    submitForm() {
      this.postForm.url = this.postForm.image_uri
      console.log(this.postForm)
      insertNotice(this.postForm).then(response => {
        this.loading = true
        this.$notify({
          title: '成功',
          message: '发布文件/通知成功',
          type: 'success',
          duration: 2000
        })
        this.postForm.status = 'published'
        this.loading = false
      }).catch(() => {
        this.$notify({
          title: '失败',
          message: '发布文章失败',
          type: 'error',
          duration: 2000
        })
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
      .postInfo-container-item {
        float: left;
        & /deep/ .el-date-editor {
          width: 150px;
        }
      }
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
