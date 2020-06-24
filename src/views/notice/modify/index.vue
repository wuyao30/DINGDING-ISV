<template>
  <div class="createPost-container">
    <sticky :class-name="'sub-navbar'">
      <el-button style="margin-left: 10px;" type="success" @click="submitForm">
        修改通知
      </el-button>
      <el-button style="margin-left: 10px;" type="warning" @click="deleteForm">
        删除通知
      </el-button>
    </sticky>
    <el-form ref="postForm" :model="postForm" label-position="left" class="form-container">
      <div class="createPost-main-container">
        <el-row :gutter="15">
          <el-col :span="6">
            <el-form-item label-width="80px" label="通知类型:" class="postInfo-container-item">
              <el-select v-model="postForm.type" placeholder="请选择" clearable class="filter-item" @change="noticeTypeChange">
                <el-option v-for="item in noticeOptions" :key="item.key" :label="item.label" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="80px" label="通知内容:" class="postInfo-container-item">
              <el-select v-model="parachuanru.id" clearable class="filter-item" @change="tongzhixuhao">
                <el-option v-for="(elem,index) of tongzhiOptions" :key="index" :label="elem.label" :value="elem.key" />
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
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import { getNotice } from '@/api/notice'

const defaultForm = {
  status: 'draft',
  title: '', // 文章题目
  writeTime: '',
  type: undefined,
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
  name: 'Index',
  components: {
    Sticky
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      noticeOptions: [
        { label: '通知公告', key: 1 },
        { label: '上级声音', key: 2 },
        { label: '警示公告', key: 3 },
        { label: '交流园地', key: 4 },
        { label: '资料库', key: 5 }
      ]
    }
  },
  methods: {
    noticeTypeChange() {
      if (this.postForm.type > 0) {
        console.log('hello')
      }
      console.log(this.postForm.type)
    },
    submitForm() {
    },
    deleteForm() {}
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
