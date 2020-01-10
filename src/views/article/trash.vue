<template>
  <div class="app-container">
    <!-- 垃圾列表 -->
    <el-table v-loading="loading" :data="articleList" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column label="主题" width="300" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column prop="category.name" label="分类" width="100" show-overflow-tooltip />
      <el-table-column label="描述" width="500" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}... </span>
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
      <el-table-column>
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
        </template>
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="还原" placement="top">
            <el-button type="primary" size="mini" icon="el-icon-refresh-left" circle @click="handleRecover(scope.row._id)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDelete(scope.row._id)" />
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
      search: '',
      articleList: []
    }
  },
  computed: {

  },
  created () {
    this.filterSearch()
  },
  methods: {
    async filterSearch (pageNum = 1) {
      this.loading = true
      const query = `?title=${this.search}&pageNum=${pageNum}&pageSize=${10}&status=1`
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
    async handleDelete (id) {
      const res = await article.destroy([id])
      if (res.code === 200) {
        this.$message.success('删除成功')
        this.filterSearch()
      }
    },
    async handleRecover (id) {
      const res = await article.recover([id])
      if (res.code === 200) {
        this.$message.success('还原成功')
        this.filterSearch()
      }
    }
  }
}
</script>
