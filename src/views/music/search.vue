<template>
  <div class="app-container">
    <el-row>
      <div class="filter-container">
        <el-input v-model.trim="searchKey" placeholder="歌手/歌名/专辑名" size="small" style="width: 300px;" class="filter-item" />
        <el-tooltip class="item" effect="dark" content="查询" placement="top">
          <el-button icon="el-icon-search" circle size="small" />
        </el-tooltip>
      </div>
    </el-row>
    <h3>每日推荐</h3>
    <el-row style="padding:0 100px">
      <!-- 歌曲列表 -->
      <el-table :data="songList" tooltip-effect="dark" :show-header="false" style="width: 100%">
        <el-table-column label="歌名" width="500" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column prop="singer" label="歌手" width="200" show-overflow-tooltip />
        <el-table-column label="专辑" width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-link :href="`/music/album/${scope.row.album._id}`">{{ scope.row.album.name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="时长" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="播放" placement="top">
              <el-button type="success" size="mini" icon="el-icon-caret-right" circle @click="handlePlay(scope.row._id)" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDelete(scope.row._id)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <h3>猜你喜欢</h3>
    <!-- 歌手列表 -->
    <el-row style="padding:0 100px">
      <p v-if="!albumList.length">Oops~，东西被外星人拿走了。</p>
      <el-col v-for="item in albumList" v-else :key="item._id" :span="4" class="card-box">
        <el-link :href="`/music/album/${item._id}`">
          <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <div class="image-box">
              <img :src="item.picUrl" class="image">
              <i class="el-icon-video-play" />
            </div>
            <div style="padding: 14px;">
              {{ item.name }}
              <div class="bottom clearfix">
                <el-link :href="`/music/singer/${item.singer._id}`">{{ item.singer.name }}</el-link>
                <time class="time">{{ item.pubTime }}</time>
              </div>
            </div>
          </el-card>
        </el-link>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { music } from '@/api'
export default {
  data() {
    return {
      searchKey: '',
      songList: [],
      albumList: [],
      singerList: []
    }
  },
  created() {
    this.getRandomAlbum()
    this.getRandomSong()
  },
  methods: {
    async getRandomAlbum() {
      const res = await music.getRandomAlbum()
      if (res) {
        this.albumList = res.data
      }
    },
    async getRandomSong() {
      const res = await music.getRandomSong()
      if (res) {
        this.songList = res.data
      }
    },
    async getSingerList() {

    },
    async getAlbumList() {

    },
    async getSongList() {

    },
    searchHandler() {
      if (this.searchKey) {
        this.getSingerList()
        this.getAlbumList()
        this.getAlbumList()
      } else {
        this.getRandomAlbum()
        this.getRandomSong()
      }
    }
  }
}
</script>
<style lang="scss" scope>
.time {
  font-size: 13px;
  color: #999;
}
.bottom {
  position: relative;
  margin-top: 13px;
  line-height: 13px;
  time {
    position: absolute;
    right: 10px;
  }
}
.button {
  padding: 0;
  float: right;
}
.card-box {
  padding: 17px;
}
.image-box {
  position: relative;
  overflow: hidden;
  .image {
    width: 100%;
    display: block;
    cursor: pointer;
    transition: all 0.6s;
  }
  &:hover .image {
    transform: scale(1.2);
    opacity: 0.4;
  }
  &:hover i {
    opacity: 1;
  }
  i {
    font-size: 50px;
    position: absolute;
    top: 50%;
    left: 50%;
    opacity: 0;
    transform: translate(-50%, -50%);
  }
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
