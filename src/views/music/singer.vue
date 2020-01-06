<template>
  <div class="app-container">
    <div class="avatar-box">
      <i class="avatar-effect" :style="{backgroundImage: `url(${singer.picUrl})` }" />
      <el-row>
        <el-col :span="4">
          <el-avatar class="avatar-img" :src="singer.picUrl"/>
        </el-col>
        <el-col :span="19" :offset="1">
          <div class="info-box">
            <h2>{{ singer.name }}</h2>
            <div class="desc">简介：{{ singer.desc.slice(0,180)||'暂无' }}</div>
            <el-popover placement="bottom" title="简介" width="1000" offset="100" trigger="click" :content="singer.desc">
              <el-button slot="reference" type="text">更多</el-button>
            </el-popover>
            <div class="operate">
              <el-button type="danger" icon="el-icon-delete" round>删除专辑</el-button>
              <el-button type="info" round>信息按钮</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-row class="album-box">
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
                <el-link :href="`/music/singer/${singer._id}`">{{ singer.name }}</el-link>
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
      singer: {
        _id: '',
        name: '',
        picUrl: '',
        desc: ''
      },
      albumList: []
    }
  },
  computed: {
  },
  async created() {
    const { sid } = this.$route.params
    const res = await music.getOneSinger(sid)
    const { albumList, ...others } = res.data
    this.singer = others
    this.albumList = albumList
  },
  methods: {

  }
}
</script>
<style lang="scss" scope>
.avatar-box {
  color: #fff;
  position: relative;
  border-radius: 8px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  z-index: 1;
  padding: 20px 100px;
  box-sizing: border-box;
  .avatar-img {
    width: 200px;
    height: 200px;
  }
  .avatar-effect {
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
</style>
