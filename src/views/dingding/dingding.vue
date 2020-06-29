<template>
  <div class="components-container">
    <div class="editor-container">
      <markdown-editor :language="language" v-model="content" height="300px" />
      <el-button style="margin-top:80px;" type="primary" icon="el-icon-document" @click="uploadHandler">
        发送通知
      </el-button>
    </div>
    <div v-html="html" />
  </div>
</template>

<script>
import { uploadMessage } from '@/api/user'
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
      }
    }
  },
  computed: {
    language() {
      return 'zh_CN'
    }
  },
  methods: {
    uploadHandler() {
      uploadMessage({ content: this.content }).then(response => {
        if (response.status === 200) {
          Message.success('发送成功')
        } else {
          Message.error('发送失败')
        }
      }
      )
    },
    getHtml() {
      this.html = this.$refs.markdownEditor.getHtml()
      console.log(this.html)
    }
  }
}
</script>

<style scoped>
  .editor-container{
    margin-top: 20px;
    margin-left: 20px;
  }
</style>

