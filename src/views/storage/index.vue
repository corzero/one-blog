<template>
  <div class="app-container">
    <div class="storage-bar">
      <el-dropdown>
        <el-button type="primary" size="small">上传文件<i class="el-icon-arrow-down el-icon--right" /></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item class="upload-type">
            <input ref="uploadFile" type="file" multiple="multiplt" @change="handleUploadFiles($event.target)">
            上传文件
          </el-dropdown-item>
          <el-dropdown-item class="upload-type">
            <input ref="uploadFolder" type="file" multiple="multiplt" webkitdirectory @change="handleUploadFolder($event.target)">
            上传文件夹
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div style="margin-left:12px;display:inline-block">
        <el-button icon="el-icon-folder-add" size="small" @click="createFolder">新建文件夹</el-button>
        <el-button icon="el-icon-download" size="small">离线下载</el-button>
        <el-button-group v-show="selectArray.length" style="margin-left:10px">
          <el-button type="primary" size="small" icon="el-icon-download" />
          <el-button type="warning" size="small" icon="el-icon-share" />
          <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelete()" />
        </el-button-group>
      </div>
    </div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="e in breadList" :key="e._id" style="cursor:pointer" @click.native="changeFolder(e._id)">{{ e.fName }}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 文章列表 -->
    <el-table v-loading="loading" :data="mergeList" tooltip-effect="dark" style="width: 100%" @selection-change="(arr)=>selectArray = arr">
      <el-table-column type="selection" width="50" />
      <el-table-column label="文件（夹）名" width="800" show-overflow-tooltip>
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.type" :style="{width:'2em',height:'2em'}" />
          <el-input v-if="edit._id==scope.row._id" v-model="edit.name" size="small" style="position:absolute;max-width:200px" />
          <el-button v-else-if="scope.row.type==='folder'" type="text" class="file-name" style="padding:0px" @click.native="changeFolder(scope.row._id)">{{ scope.row.fName }}</el-button>
          <span v-else class="file-name">{{ scope.row.fName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="大小" width="200">
        <template slot-scope="scope">
          <span>{{ sizeTransform(scope.row.size) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.meta&&scope.row.meta.updatedAt ? $moment(scope.row.meta.updatedAt).format('YYYY-MM-DD HH:mm'):'--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div v-if="edit._id===scope.row._id">
            <el-tooltip class="item" effect="dark" content="确定" placement="top">
              <el-button type="success" size="mini" icon="el-icon-check" circle @click="saveEdit()" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="取消" placement="top">
              <el-button type="danger" size="mini" icon="el-icon-close" circle @click="cancelEdit()" />
            </el-tooltip>
          </div>
          <div v-else>
            <el-tooltip class="item" effect="dark" content="重命名" placement="top">
              <el-button size="mini" icon="el-icon-edit" circle @click="handleRename(scope.row)" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDelete([scope.row._id], scope.row.isFolder)" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分享" placement="top">
              <el-button type="warning" size="mini" icon="el-icon-share" circle />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="下载" placement="top">
              <el-button type="primary" size="mini" icon="el-icon-download" circle />
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :total="total" class="pagination" @current-change="getTypeList" />
    <el-card v-show="uploadList.length&&isShow" class="upload-box" :body-style="{padding:'10px'}">
      <div slot="header" class="clearfix" style="margin: -8px;">
        <span>正在上传</span>
        <div class="upload-operate">
          <el-button type="text" style="padding: 3px 5px" icon="el-icon-minus" />
          <el-button type="text" style="padding: 3px 5px" icon="el-icon-close" @click="isShow = false" />
        </div>
      </div>
      <div v-for="(e,i) in uploadList" :key="e.name + i" class="upload-item clearfix">
        <div class="item-box upload-icon">
          <svg-icon :icon-class="e.type||'folder'" :style="{width:'1.2em',height:'1.2em'}" />
        </div>
        <div class="item-box upload-name">{{ e.name }}</div>
        <div class="item-box upload-size">{{ sizeTransform(e.size) }}</div>
        <div class="item-box upload-path">{{ e.path }}</div>
        <div class="item-box upload-status">{{ statusType(e.status) }}</div>
        <div class="item-box upload-control">
          <el-button v-show="e.status==1" type="text" icon="el-icon-video-pause" @click="handlerPause(e.id)" />
          <el-button v-show="e.status==3" type="text" icon="el-icon-upload2" @click="handlerContinue(e.id)" />
          <el-button v-show="e.status!=2" type="text" icon="el-icon-close" @click="handlerCancel(e.id)" />
        </div>
        <el-progress class="upload-progress" :percentage="e.percent" color="#67c23a" :stroke-width="1" :format="()=>''" />
      </div>
    </el-card>
  </div>
</template>
<script>
const { storage } = require('@/api')
const uuid = require('uuid')
import { encodeUploadType, TaskQueue } from '@/utils'
import spliceFile from '@/utils/upload'
export default {
  name: 'StorageIndex',
  props: {
    type: {
      type: Number,
      required: true,
      default: () => -1
    }
  },
  data () {
    return {
      // 辅助
      loading: false,
      isShow: false,
      // 面包屑
      breadList: [],
      // 选择内容
      selectArray: [],
      // 状态
      query: '',
      total: 0,
      edit: {
        _id: null,
        name: null,
        suffix: null
      },
      // 当前文件夹信息
      folder: {
        _id: '',
        name: '',
        path: ''
      },
      // 列表信息
      mergeList: [],
      uploadList: []
    }
  },
  created () {
    const pid = this.$store.getters.baseFolder
    this.queryFolder(pid)
    this.getTypeList(this.type, pid)
  },
  methods: {
    // 查询某一个文件夹
    async queryFolder (pid) {
      const res = await storage.queryFolder(pid)
      if (res.code === 200) {
        this.folder = Object.assign({}, res.data)
        this.breadList.push(res.data)
      }
    },
    // 获取不同状态下的内容
    async getTypeList (type, fid) {
      const res = await storage.getList({ type, fid })
      if (res.code === 200) {
        this.mergeList = res.data
      }
    },
    // 改变当前_id
    changeFolder (id) {
      if (this.folder._id !== id) {
        console.log('index', this.folder._id, id, this.breadList.findIndex(e => e._id === id))
        const index = this.breadList.findIndex(e => e._id === id)
        if (index !== -1) { // 点击之前的链接
          this.breadList.splice(index) // 保留当前点击那个
        }
        // this.breadList.splice()
        this.queryFolder(id)
        this.getTypeList(this.type, id)
      }
    },
    // 上传多个文件
    async handleUploadFiles (target) {
      console.log(target.files)
      if (target.files.length) {
        try {
          for (const file of target.files) {
            const item = { id: uuid.v1(), name: file.name, type: encodeUploadType(file.type), size: file.size, path: this.folder.name, status: 0, percent: 0 }
            this.uploadList.push(item)
            this.isShow = true
            const { parmasList, total, hash } = await spliceFile(file, storage.upload, this.progress, item.id).catch(e => console.error(e))
            item.task = new TaskQueue(parmasList)
            item.task.end(() => {
              storage.merge({ parentFolder: this.folder, size: file.size, name: file.name, total, hash, type: encodeUploadType(file.type) })
              this.uploadList = this.uploadList.map(e => e.id === item.id ? Object.assign(e, { status: 2, percent: 100 }) : e)
            })
            // await Promise.all(parmasList.map(async e => await storage.upload(e.form, e.option))).catch(e => console.error(e))
            // await storage.merge({ parentFolder: this.folder, size: file.size, name: file.name, total, hash, type: encodeUploadType(file.type) })
            // this.uploadList = this.uploadList.map(e => e.id === item.id ? Object.assign(e, { status: 2, percent: 100 }) : e)
          }
          this.$message.success('上传成功')
        } catch (e) {
          console.error(e)
          this.$message.error('上传失败')
        }
      }
      target = null
      this.getTypeList(this.type, this.folder._id)
    },
    // 上传文件夹
    async handleUploadFolder (target) {
      console.log(target.files)
      if (target.files.length) {
        for (const file of target.files) {
          const item = { id: uuid.v1(), name: file.name, type: file.type, size: file.size, path: this.folder.name, status: 0, percent: 0 }
          this.uploadList.push(item)
          this.isShow = true
          const { parmasList, total, hash } = await spliceFile(file, this.progress, item.id).catch(e => console.error(e))
          this.taskList[item.id] = parmasList
          console.log(parmasList)
          await Promise.all(parmasList.map(async e => await storage.upload(e.form, e.option))).catch(e => console.error(e))
          await storage.merge({ size: file.size, name: file.name, total, hash, type: 0 })
          this.uploadList = this.uploadList.map(e => e.id === item.id ? Object.assign(e, { status: 2, percent: 100 }) : e)
        }
      }
      target = null
    },
    // 创建文件夹
    async createFolder () {
      const res = await this.$prompt('请输入文件名', '新建文件夹', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\u4e00-\u9fa5|A-Za-z|0-9|_]{1,30}$/,
        inputErrorMessage: '文件名格式错误'
      }).catch((e) => {
        console.log('取消')
      })
      console.log('value', res)
      if (res && res.value) {
        const params = {
          path: this.folder.path,
          parentId: this.folder._id,
          fName: res.value
        }
        console.log('params', params)
        await storage.createFolder(params).catch(e => console.error(e))
        this.getTypeList(this.type, this.folder._id)
      }
    },
    // 分享内容
    async handleShare () {

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
    // 移动文件
    async handleremove () {

    },
    // 暂停上传（还没想好）
    handlerPause (id) {
      const item = this.uploadList.filter(e => e.id === id)[0]
      item.task.pause()
    },
    // 继续上传（也没想好）
    handlerContinue (id) {
      const item = this.uploadList.filter(e => e.id === id)[0]
      item.task.next()
    },
    // 取消上传
    handlerCancel (id) {
      const item = this.uploadList.filter(e => e.id === id)[0]
      item.task.clear()
    },
    // 重命名
    handleRename (row) {
      const { _id, fName } = row
      const suffix = /\.[^\.]+$/.exec(fName)
      this.edit = { _id, name: fName.replace(/\.[^\.]+$/, ''), suffix }
    },
    // 保存修改
    async saveEdit () {
      const data = {
        fName: this.edit.name + this.edit.suffix,
        _id: this.edit._id
      }
      await storage.rename(data)
      this.cancelEdit()
    },
    //
    handleSelect () {

    },
    // 取消修改
    cancelEdit () {
      this.edit = {
        _id: null,
        name: null,
        suffix: null
      }
    },
    // 上传时的状态改变
    statusType (status) {
      switch (status) {
        case 0:
          status = '正在校验'
          break
        case 1:
          status = '正在上传'
          break
        case 2:
          status = '上传成功'
          break
        case 3:
          status = '暂停上传'
          break
        case 4:
          status = '取消上传'
          break
        default: status = '--'
      }
      return status
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
    },
    // 上传进度条事件
    progress (id, percent, loaded) {
      this.uploadList.map
      this.uploadList = this.uploadList.map(e => e.id === id ? Object.assign(e, { status: 1, percent: 100 * percent }) : e)
    }
  }
}
</script>
<style lang="scss">
.storage-bar {
  margin: 0 20px 10px 12px;
}
.file-name {
  display: inline-block;
  line-height: 30px;
  height: 30px;
  vertical-align: top;
  margin-left: 15px;
}
.upload-type {
  position: relative;
  text-align: center;
  input {
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0;
    position: absolute;
    cursor: pointer;
  }
}
.el-icon-arrow-down {
  font-size: 12px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}
.upload-box {
  position: fixed;
  right: 0px;
  bottom: 0;
  width: 600px;
  .upload-operate {
    display: inline-block;
    position: absolute;
    padding: 3px 0px;
    right: 10px;
  }
  .upload-item {
    width: 100%;
    height: 30px;
    font-size: 14px;
    line-height: 30px;
    position: relative;
    border-bottom: 1px solid #f2f6fd;
    .item-box {
      height: 30px;
      float: left;
      text-align: center;
      margin-right: 5px;
      &.upload-icon {
        vertical-align: middle;
      }
      &.upload-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
        width: 30%;
      }
      &.upload-size {
        width: 10%;
      }
      &.upload-path {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 25%;
      }
      &.upload-status {
        width: 15%;
      }
      &.upload-control {
        button {
          padding: 3px 0px;
          font-size: 20px;
        }
      }
    }
    .upload-progress {
      position: absolute;
      bottom: -7px;
      width: 100%;
      .el-progress-bar {
        padding: 0;
      }
    }
  }
}
</style>
