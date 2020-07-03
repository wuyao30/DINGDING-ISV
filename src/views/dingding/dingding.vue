<template>
  <div class="components-container">
    <div class="department-select">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="部门名称：">
          <el-select v-model="selectedDepartment" placeholder="请选择部门">
            <el-option v-for="item in departments" :key="item" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="editor-container">
      <markdown-editor :language="language" v-model="content" height="300px" />
      <el-button style="margin-top:30px;" type="primary" icon="el-icon-document" @click="uploadHandler">
        发送通知
      </el-button>
    </div>
  </div>
</template>

<script>
import { getDepartment, uploadMessage } from '@/api/user'
import { Message } from 'element-ui'
import MarkdownEditor from '@/components/MarkdownEditor'

export default {
  name: 'DingDing',
  components: { MarkdownEditor },
  data() {
    return {
      content: '',
      html: '',
      languageTypeList: {
        'en': 'en_US',
        'zh': 'zh_CN',
        'es': 'es_ES'
      },
      departments: [],
      selectedDepartment: ''
    }
  },
  computed: {
    language() {
      return 'zh_CN'
    }
  },
  created() {
    getDepartment().then(res => {
      this.departments = res.result.departmentlist
    }).catch(err => {
      console.error(err)
      this.$notify.error('获取部门信息失败，请刷新')
    })
  },
  methods: {
    uploadHandler() {
      if(this.selectedDepartment) {
        uploadMessage({ content: this.content, deptIdList: this.selectedDepartment }).then(response => {
          if (response.status === 200) {
            Message.success('发送成功')
          } else {
            Message.error('发送失败')
          }
        })
      } else {
        this.$notify.warning('请选择部门')
      }
    },
    getHtml() {
      this.html = this.$refs.markdownEditor.getHtml()
      console.log(this.html)
    }
  }
}
</script>

<style scoped>
  .department-select {
    margin-top: 10px;
  }
  .editor-container{
    margin-top: 20px;
    margin-left: 35px;
  }
</style>

