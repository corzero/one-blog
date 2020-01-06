<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>
      <app-main @mousemove="mousemove" />
      <keep-alive>
        <Aplayer v-show="showPlayer&&$store.getters.musicItem.src" class="transition-box" autoplay :music="$store.getters.musicItem" :list="$store.getters.musicList" :show-lrc="true" :list-folded="true" :volume="0.3" style="position: fixed; bottom: 0px; width: 88%; z-index: 2;" />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import Aplayer from '@/components/mplayer/vue-aplayer.vue'
export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    Aplayer
  },
  mixins: [ResizeMixin],
  data() {
    return {
      showPlayer: false
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.app.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  sockets: {
    // 查看socket是否渲染成功
    connect() {
      console.log('#####socket', '链接成功')
    },
    disconnect() {
      console.log('#####socket', '断开链接')
    }, // 检测socket断开链接
    reconnect() {
      console.log('#####socket', '重新链接')
    },
    scrpitOutput(data) {
      this.$notify({
        title: data.type === 'info' ? '提示' : '错误',
        type: data.type,
        message: data.msg
      })
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    mousemove(e) {
      if (e.offsetY > document.body.scrollHeight - 80) {
        this.showPlayer = true
      } else {
        this.showPlayer = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
