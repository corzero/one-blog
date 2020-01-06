<template>
  <div class="app-container">
    <div class="album-box">
      <i class="album-effect" :style="{backgroundImage: `url(${album.picUrl})` }" />
      <el-row>
        <el-col :span="4">
          <el-image :src="album.picUrl">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </el-col>
        <el-col :span="19" :offset="1">
          <div class="info-box">
            <h2>{{ album.name }}</h2>
            <p><i class="el-icon-user" />歌手：
              <el-link :href="`/music/singer/${singer._id}`">{{ singer.name }}</el-link>
            </p>
            <p>发行时间：{{ album.pubTime }}</p>
            <div class="desc">简介：{{ album.desc.slice(0,200) }}</div>
            <el-popover placement="bottom" title="简介" width="1000" offset="100" trigger="click" :content="album.desc">
              <el-button slot="reference" type="text">更多</el-button>
            </el-popover>
            <div class="operate">
              <el-button type="primary" icon="el-icon-video-play" round @click="handlerPlayAll">播放全部</el-button>
              <el-button type="danger" icon="el-icon-delete" round>删除专辑</el-button>
              <el-button type="info" round>信息按钮</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-row style="margin:70px">
      <!-- 歌曲列表 -->
      <el-table ref="albumTable" :data="songList" tooltip-effect="dark" :show-header="false" style="width: 100%" @selection-change="handleSelect">
        <el-table-column type="selection" width="55" />
        <el-table-column label="歌名" width="250" show-overflow-tooltip>
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
      <div style="margin-top: 20px;padding: 0 13px;">
        <el-checkbox v-model="isSelectAll" @change="handlerAllSelect">全选</el-checkbox>
        <el-button type="primary" icon="el-icon-video-play" round style="margin-left:20px">播放选中歌曲</el-button>
      </div>
    </el-row>
  </div>
</template>

<script>
import { music } from '@/api'
export default {
  data() {
    return {
      isSelectAll: false,
      singer: {
        _id: '',
        name: ''
      },
      album: {
        _id: null,
        desc: '',
        name: '',
        picUrl: '',
        pubTime: ''
      },
      songList: [],
      selectedArr: []
    }
  },
  computed: {
  },
  async created() {
    const { aid } = this.$route.params
    const res = await music.getOneAlbum(aid)
    const { singer, songList, ...others } = res.data
    this.singer = singer
    this.album = others
    this.songList = songList
  },
  methods: {
    handlerAllSelect(check) {
      this.selectedArr = this.songList
      if (check) {
        this.$refs.albumTable.clearSelection()
        this.songList.forEach(row => {
          this.$refs.albumTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.albumTable.clearSelection()
      }
    },
    handleSelect(arr) {
      this.selectedArr = arr
      if (arr.length === this.songList.length) {
        this.isSelectAll = true
      } else {
        this.isSelectAll = false
      }
    },
    handlerPlayAll() {
      const list = this.songList.map(e => {
        return {
          title: e.name,
          artist: e.singer,
          src: e.playUrl.normal,
          pic: this.album.picUrl,
          lrc: e.lyric
        }
      })
      this.$store.commit('music/SET_LIST', list)
    }
  }
}
</script>
<style lang="scss" scope>
.album-box {
  color: #fff;
  position: relative;
  border-radius: 8px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  z-index: 1;
  padding: 50px;
  box-sizing: border-box;
  .album-effect {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    -webkit-filter: blur(20px);
    -moz-filter: blur(20px);
    -ms-filter: blur(20px);
    -o-filter: blur(20px);
    filter: blur(20px);
    z-index: -1;
    background-image: url('http://cdnmusic.migu.cn/picture/2019/1031/0345/AM5de8083821ba4a3eb7f44b4add5347c0.jpg');
    background-position: center top;
    background-attachment: fixed;
  }
  .operate {
    margin-top: 10px;
  }
  .info-box {
    .desc {
      max-width: 90%;
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
