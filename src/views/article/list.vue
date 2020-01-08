<template>
  <div class="app-container">
    <el-form :inline="true" :model="query" class="demo-form-inline">
      <el-form-item label="主题">
        <el-input v-model="query.title" size="small" placeholder="主题...." />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="query.category" size="small" placeholder="分类" @change="(id)=>{getTagList(id);filterSearch()}">
          <el-option label="全部" value="" />
          <el-option v-for="e in categoryList" :key="e._id" :label="e.name" :value="e._id" />
        </el-select>
      </el-form-item>
      <el-form-item label="标签">
        <el-select v-model="query.tag" size="small" placeholder="标签" @change="filterSearch()">
          <el-option label="全部" value="" />
          <el-option v-for="e in tagList" :key="e._id" :label="e.name" :value="e._id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-tooltip content="查询" placement="top">
          <el-button icon="el-icon-search" size="small" circle @click="filterSearch()" />
        </el-tooltip>
      </el-form-item>
      <el-form-item style="position:absolute;right:10px">
        <el-tooltip content="添加" placement="top">
          <el-button type="success" icon="el-icon-plus" size="small" circle @click="$router.push('/article/add')" />
        </el-tooltip>
      </el-form-item>
    </el-form>
    <!-- 文章列表 -->
    <el-table v-loading="loading" :data="articleList" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column label="主题" width="300" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column prop="category.name" label="分类" width="100" show-overflow-tooltip />
      <el-table-column label="描述" width="400" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.content.slice(0,100) }}... </span>
        </template>
      </el-table-column>
      <el-table-column prop="author.username" label="作者" width="100" show-overflow-tooltip />
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <span>{{ $moment(scope.row.meta.createdAt).format('YYYY-MM-DD HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间">
        <template slot-scope="scope">
          <span>{{ $moment(scope.row.meta.updatedAt).format('YYYY-MM-DD HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="$router.push(`/article/edit/${scope.row._id}`)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDelete(scope.row._id)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="收藏" placement="top">
            <el-button type="warning" size="mini" icon="el-icon-star-off" circle @click="handleCollect(scope.row._id, scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :total="total" class="pagination" @current-change="filterSearch" />
  </div>
</template>
<script>
import { article, category, tag } from '@/api'
export default {
  name: 'ArticleList',
  data () {
    return {
      loading: false,
      total: 0,
      query: {
        title: '',
        category: '',
        tag: '',
        pageSize: 10
      },
      articleList: [],
      tagList: [],
      categoryList: []
    }
  },
  computed: {

  },
  created () {
    this.getCategoryList()
    this.filterSearch()
  },
  methods: {
    async filterSearch (pageNum = 1) {
      this.loading = true
      const query = `?title=${this.query.title}&category=${this.query.category}&tag=${this.query.tag}&pageNum=${pageNum}&pageSize=${this.query.pageSize}&status=0`
      const res = await article.getList(query)
      if (res.code === 200) {
        this.articleList = res.data.list
        this.total = res.data.total
      }
      this.loading = false
    },
    async getCategoryList () {
      const res = await category.getList()
      this.categoryList = res ? res.data : []
    },
    async getTagList (cid) {
      if (cid) {
        this.query.tag = ''
        const res = await tag.getList(cid)
        if (res.code === 200) {
          this.tagList = res.data
        }
      }
    },
    async handleDelete (id) {
      const res = await article.delete([id])
      if (res.code === 200) {
        this.$message.success('删除成功')
        this.filterSearch()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.pagination {
  position: absolute;
  right: 0;
  margin: 10px;
}
</style>

