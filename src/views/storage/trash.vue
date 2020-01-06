<template>
  <div class="app-container">
    <!-- 回收站列表 -->
    <el-table v-loading="loading" :data="mergeList" tooltip-effect="dark" style="width: 100%" @selection-change="(arr)=>selectArray = arr">
      <el-table-column type="selection" width="50" />
      <el-table-column label="文件（夹）名" width="800" show-overflow-tooltip>
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.type" :style="{width:'2em',height:'2em'}" />
          <span class="file-name">{{ scope.row.fName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="大小" width="200">
        <template slot-scope="scope">
          <span>{{ sizeTransform(scope.row.size) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="删除时间">
        <template slot-scope="scope">
          <span>{{ scope.row.meta&&scope.row.meta.updatedAt ? $moment(scope.row.meta.updatedAt).format('YYYY-MM-DD HH:mm'):'--' }}</span>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
        </template>
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="恢复" placement="top">
            <el-button type="primary" size="mini" icon="el-icon-download" circle />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDelete([scope.row._id], scope.row.isFolder)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :total="total" class="pagination" @current-change="getTypeList" />
  </div>
</template>
<script>
const { storage } = require('@/api')
export default {
  name: 'StorageIndex',
  data () {
    return {
      // 辅助
      loading: false,
      isShow: false,
      search: '',
      // 选择内容
      selectArray: [],
      // 状态
      query: '',
      total: 0,
      // 列表信息
      mergeList: []
    }
  },
  created () {
    const pid = this.$store.getters.baseFolder
    this.getTypeList(4, pid)
  },
  methods: {
    // 获取不同状态下的内容
    async getTypeList (type, fid) {
      const res = await storage.getList({ type, fid })
      if (res.code === 200) {
        this.mergeList = res.data
      }
    },
    // 恢复文件（夹）
    async handleReset (arr) {

    },
    // 删除文件或者文件夹
    async handleDelete (arr, type = false) {
      if (!arr) {
        arr = this.selectArray.map(e => e._id)
      }
      const res = await storage.setTrash(arr, type)
      if (res.code === 200) {
        this.getTypeList(this.type, this.folder._id)
      }
    },
    // 文件大小转换
    sizeTransform (size = 0) {
      if (size === 0) {
        return '--'
      } else if (size < 1024) {
        return (size += 'Byte')
      } else if (size / 1024 < 1024) {
        return (size = parseFloat(size / 1024).toFixed(2) + 'KB')
      } else if (size / 1024 / 1024 < 1024) {
        return (size = parseFloat(size / 1024 / 1024).toFixed(2) + 'MB')
      } else {
        return (size = parseFloat(size / 1024 / 1024 / 1024).toFixed(2) + 'GB')
      }
    }
  }
}
</script>
<style lang="scss" scope>
</style>
