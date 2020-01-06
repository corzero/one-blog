<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="歌手" name="singer">
        <div class="filter-container">
          <el-input v-model="singer.name" placeholder="歌手" size="small" style="width: 200px;" class="filter-item" />
          <el-tooltip class="item" effect="dark" content="查询" placement="top">
            <el-button icon="el-icon-search" circle size="small" />
          </el-tooltip>
        </div>
        <!-- 歌手列表 -->
        <el-row>
          <el-col v-for="(item, index) in singerList" :key="item._id" :span="8" :offset="index > 0 ? 2 : 0">
            <el-card :body-style="{ padding: '0px' }">
              <img :src="item.pic" class="image">
              <div style="padding: 14px;">
                <span>{{ item.name }}</span>
                <div class="bottom clearfix">
                  <time class="time">{{ item.meta.updateAt }}</time>
                  <el-button type="text" class="button">操作按钮</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="专辑" name="album">
        <div class="filter-container">
          <el-input v-model="album.name" placeholder="专辑" size="small" style="width: 200px;" class="filter-item" />
          <el-tooltip class="item" effect="dark" content="查询" placement="top">
            <el-button icon="el-icon-search" circle size="small" />
          </el-tooltip>
        </div>
        <!-- 专辑列表 -->
        <el-row>
          <el-col v-for="(item, index) in albumList" :key="item._id" :span="8" :offset="index > 0 ? 2 : 0">
            <el-card :body-style="{ padding: '0px' }">
              <img :src="item.pic" class="image">
              <div style="padding: 14px;">
                <span>{{ item.name }}</span>
                <div class="bottom clearfix">
                  <time class="time">{{ item.meta.updateAt }}</time>
                  <el-button type="text" class="button">操作按钮</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="歌曲" name="song">
        <div class="filter-container">
          <el-input v-model="song.name" placeholder="歌曲名称" size="small" style="width: 200px;" class="filter-item" />
          <el-tooltip class="item" effect="dark" content="查询" placement="top">
            <el-button icon="el-icon-search" circle size="small" />
          </el-tooltip>
        </div>
        <!-- 歌曲列表 -->
        <el-table :data="songList" tooltip-effect="dark" style="width: 100%">
          <el-table-column type="selection" width="55" />
          <el-table-column label="歌名" width="200" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column prop="author" label="歌手" width="100" show-overflow-tooltip />
          <el-table-column prop="album" label="专辑" width="100" show-overflow-tooltip />
          <el-table-column prop="createdAt" label="创建时间" />
          <el-table-column prop="updatedAt" label="更新时间" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="handleEdit(scope.row.id, scope.row)" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDelete(scope.row.id, scope.row)" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="收藏" placement="top">
                <el-button type="warning" size="mini" icon="el-icon-star-off" circle @click="handleCollect(scope.row.id, scope.row)" />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'singer',
      singer: {
        name: ''
      },
      album: {
        name: ''
      },
      song: {
        name: ''
      },
      singerList: [],
      albumList: [],
      songList: []
    }
  },
  computed: {
  },
  created() {
  },
  methods: {

  }
}
</script>
<style lang="scss" scope>
.time {
  font-size: 13px;
  color: #999;
}
.bottom {
  margin-top: 13px;
  line-height: 12px;
}
.button {
  padding: 0;
  float: right;
}
.image {
  width: 100%;
  display: block;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}
</style>
