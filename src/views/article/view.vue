<template>
  <div class="app-container">
    <el-form :model="article" label-position="left" label-width="50px">
      <el-form-item label="主题">
        <el-input v-model="article.title" size="small" placeholder="主题...." />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="article.category" size="small" placeholder="分类" @change="getTagList">
          <el-option label="全部" value="" />
          <el-option v-for="e in categoryList" :key="e._id" :label="e.name" :value="e._id" />
        </el-select>
      </el-form-item>
      <el-form-item label="标签">
        <el-select v-model="article.tagList" size="small" multiple collapse-tags placeholder="标签">
          <el-option label="全部" value="" />
          <el-option v-for="e in tagList" :key="e._id" :label="e.name" :value="e._id" />
        </el-select>
        <div>
          <el-tag v-for="tag in selectTag" :key="tag._id" closable style="margin-left:5px" @close="handleClose(tag._id)">
            {{ tag.name }}
          </el-tag>
        </div>
      </el-form-item>
    </el-form>
    <mavon-editor ref="md" v-model="article.content" :ishljs="true" :editable="!isView" code-style="code_style" @imgAdd="$imgAdd" @imgDel="$imgDel" />
    <div class="view-button">
      <el-tooltip content="取消" placement="top">
        <el-button type="danger" icon="el-icon-close" size="small" circle @click="cancelArticle" />
      </el-tooltip>
      <el-tooltip content="保存" placement="top">
        <el-button type="success" icon="el-icon-check" size="small" circle @click="saveArticle" />
      </el-tooltip>
    </div>
  </div>
</template>
<script>
import { category, tag, article, upload } from '@/api'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
  name: 'ArticleView',
  components: {
    mavonEditor
  },
  props: {
    type: {
      type: String,
      default: 'add'
    }
  },
  data () {
    return {
      // 辅助
      isAdd: false,
      isEdit: false,
      isView: false,
      img_file: {},
      tagList: [],
      categoryList: [],
      // 主体内容
      article: {
        title: '',
        category: '',
        tagList: [],
        content: ''
      }
    }
  },
  computed: {
    selectTag () {
      return this.tagList.filter(e => this.article.tagList.includes(e._id))
    }
  },
  async created () {
    this.checkType()
    await this.getCategoryList()
    this.$route.params.aid && await this.getOne(this.$route.params.aid)
  },
  methods: {
    checkType () {
      const type = this.type
      if (type === 'add') {
        this.isAdd = true
      } else if (type === 'edit') {
        this.isEdit = true
      } else {
        this.isView = true
      }
    },
    async getOne (_id) {
      const res = await article.getOne(_id)
      // await this.$http.get(`${this.$api.article}/${_id}`)
      res.data.category && await this.getTagList(res.data.category)
      this.article = Object.assign({}, res.data)
    },
    async getCategoryList () {
      const res = await category.getList()
      this.categoryList = res ? res.data : []
    },
    async getTagList (cid) {
      if (cid) {
        const res = await tag.getList(cid)
        this.tagList = res ? res.data : []
      }
    },
    async saveArticle () {
      if (this.type === 'add') {
        const res = await article.create(this.article)
        if (res.code === 200) {
          this.$message.success('添加成功')
          this.$router.back(-1)
        }
      } else if (this.type === 'edit') {
        const res = await article.update(this.article)
        if (res.code === 200) {
          this.$message.success('更新成功')
          this.$router.back(-1)
        }
      }
    },
    cancelArticle () {
      this.$emit('changeView', { type: null })
    },
    handleClose (tid) {
      this.article.tagList.splice(this.article.tagList.indexOf(tid), 1)
    },
    $imgAdd (pos, $file) {
      console.log(this.$api)
      // 第一步.将图片上传到服务器.
      var formdata = new FormData()
      formdata.append('file', $file)
      this.img_file[pos] = $file
      upload.img(formdata)
        .then((res) => {
          const url = res.data.url
          // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
          this.$refs.md.$img2Url(pos, url)
        })
    },
    $imgDel (pos) {
      delete this.img_file[pos]
    }
  }
}
</script>
<style lang="scss" scoped>
.view-button {
  display: flex;
  justify-content: space-around;
  margin-top: 30px;
  padding: 0 10px;
}
</style>

