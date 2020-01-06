<template>
  <div class="app-container">
    <el-form label-width="100px">
      <el-form-item label="添加新分类">
        <el-input v-model="addCategory" size="small" style="width:200px" />
        <el-tooltip effect="dark" content="保存" placement="top">
          <el-button type="success" icon="el-icon-check" circle size="small" @click="categoryAdd" />
        </el-tooltip>
      </el-form-item>
    </el-form>
    <el-table :data="categoryList" :expand-row-keys="expandRow" row-key="_id" style="width: 100%" @expand-change="expandChange">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-tag v-for="tag in props.row.tagList" :key="tag._id" closable :disable-transitions="false" style="margin-right:10px" @close="tagDelete(tag._id)">
            {{ tag.name }}
          </el-tag>
          <el-input v-if="addTagVisible" ref="saveTagInput" v-model="addTag" class="input-new-tag" size="small" @keyup.enter.native="handleInputConfirm(props.row._id)" @blur="handleInputConfirm(props.row._id)" />
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新增</el-button>
        </template>
      </el-table-column>
      <el-table-column label="分类名称">
        <template slot-scope="scope">
          <el-input v-if="editCategory._id===scope.row._id" ref="name" v-model="editCategory.name" size="small" style="width: 100%" />
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签个数" prop="tagList.length" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div v-if="editCategory._id!==scope.row._id">
            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" circle size="small" @click.stop="categoryEdit(scope.row)" />
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" circle size="small" @click.stop="categoryDelete(scope.row)" />
            </el-tooltip>
          </div>
          <div v-else>
            <el-tooltip effect="dark" content="取消" placement="top">
              <el-button type="danger" icon="el-icon-close" circle size="small" @click.stop="resetCategory()" />
            </el-tooltip>
            <el-tooltip effect="dark" content="保存" placement="top">
              <el-button type="success" icon="el-icon-check" circle size="small" @click.stop="categorySave(scope.row._id)" />
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { category, tag } from '@/api'
export default {
  data() {
    return {
      addTagVisible: false,
      addTag: '',
      addCategory: '',
      editCategory: {
        _id: null,
        name: null,
        tag: [],
        shop: null,
        shopId: null
      },
      expandRow: [],
      categoryList: []
    }
  },
  created() {
    this.getCategoryListTag()
  },
  methods: {
    getCategoryListTag() {
      category.getWithTag().then(res => {
        this.categoryList = res.data
      })
    },
    showInput() {
      this.addTagVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm(_id) {
      console.log(_id)
      const addTag = this.addTag
      if (addTag) {
        this.tagAdd(_id, addTag)
      }
      this.addTagVisible = false
      this.addTag = ''
    },
    categoryEdit(row) {
      console.log(row)
      this.editCategory = Object.assign({}, row)
    },
    categoryDelete() { },
    categorySave(_id) {
      const tagList = this.editCategory.tagList.map(e => e._id)
      console.log(tagList)
      category.update(Object.assign({}, this.editCategory, { tagList })).then(res => {
        this.$Message.success('更新成功')
      })
      this.categoryList = this.categoryList.map(e => e._id === _id ? Object.assign({}, this.editCategory) : e)
      this.resetCategory()
    },
    async categoryAdd() {
      await category.create({ name: this.addCategory })
      // await this.$http.post(this.$api.category.public, { name: this.addCategory })
      this.getCategoryListTag()
    },
    resetCategory() {
      this.editCategory = {
        _id: null,
        name: null,
        tag: [],
        shop: null,
        shopId: null
      }
    },
    tagEdit() {

    },
    async tagDelete(id) {
      await tag.delete({ ids: [id] })
      this.getCategoryListTag()
    },
    async tagAdd(category, name) {
      await tag.create({ category, name })
      this.getCategoryListTag()
    },
    expandChange(row, openObj) {
      this.expandRow = this.expandRow.includes(row._id) ? [] : [row._id]
    }
  }
}
</script>
<style lang="scss" scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
