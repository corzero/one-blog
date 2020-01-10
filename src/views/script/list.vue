<template>
  <div class="app-container">
    <el-form v-show="!createNew" :inline="true" class="demo-form-inline">
      <el-form-item label="名称">
        <el-input v-model="search" size="small" placeholder="名称...." />
      </el-form-item>
      <el-form-item>
        <el-tooltip content="查询" placement="top">
          <el-button icon="el-icon-search" size="small" circle @click="getScriptList()" />
        </el-tooltip>
      </el-form-item>
      <el-form-item style="position:absolute;right:10px">
        <el-tooltip content="添加" placement="top">
          <el-button type="success" icon="el-icon-plus" size="small" circle @click="createNew = true" />
        </el-tooltip>
      </el-form-item>
    </el-form>
    <transition name="el-zoom-in-top">
      <el-form v-show="createNew" ref="createNew" label-width="80px" :model="newScript" size="mini">
        <el-form-item label="脚本名称" prop="name">
          <el-input v-model.trim="newScript.name" placeholder="脚本名称必须和文件名相同" />
        </el-form-item>
        <el-form-item label="描述说明" prop="remark">
          <el-input v-model.trim="newScript.remark" placeholder="脚本类型与作用" />
        </el-form-item>
        <el-form-item label="参数" prop="argument">
          <el-input v-model="newScript.argument" placeholder="请使用#划分参数，执行脚本时将传入参数数组" />
        </el-form-item>
        <el-form-item>
          <el-button type="danger" icon="el-icon-close" size="small" circle @click="handlerReset" />
          <el-button type="success" icon="el-icon-check" size="small" circle @click="handlerCreate" />
        </el-form-item>
      </el-form>
    </transition>
    <el-table v-loading="loading" :data="scriptList" tooltip-effect="dark" style="width: 100%">
      <el-table-column label="脚本名称" show-overflow-tooltip width="200">
        <template slot-scope="scope">
          <el-input v-if="currentEdit&&currentEdit._id===scope.row._id" v-model="currentEdit.name" />
          <p v-else>{{ scope.row.name }}</p>
        </template>
      </el-table-column>
      <el-table-column label="说明" show-overflow-tooltip width="600">
        <template slot-scope="scope">
          <el-input v-if="currentEdit&&currentEdit._id===scope.row._id" v-model="currentEdit.remark" />
          <p v-else>{{ scope.row.remark }}</p>
        </template>
      </el-table-column>
      <el-table-column label="参数说明" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input v-if="currentEdit&&currentEdit._id===scope.row._id" v-model="currentEdit.argument" />
          <p v-else>{{ scope.row.argument }}</p>
        </template>
      </el-table-column>
      <el-table-column label="脚本状态" width="100">
        <template slot-scope="scope">
          <el-switch :value="!scope.row.disabled" active-color="#13ce66" inactive-color="#ff4949" @change="handlerStatus(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <span>{{ $moment(scope.row.meta.createdAt).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div v-if="currentEdit&&currentEdit._id===scope.row._id">
            <el-tooltip class="item" effect="dark" content="保存" placement="top">
              <el-button type="success" size="mini" icon="el-icon-check" circle @click="handlerEdit(scope.row._id)" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="取消" placement="top">
              <el-button type="danger" size="mini" icon="el-icon-close" circle @click="currentEdit = null" />
            </el-tooltip>
          </div>
          <div v-else>
            <el-tooltip class="item" effect="dark" content="运行" placement="top">
              <el-button type="warning" size="mini" :disabled="scope.row.disabled" icon="el-icon-video-play" circle @click="handleArgs(scope.row)" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="setEdit(scope.row)" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDelete(scope.row._id)" />
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="运行脚本" :visible.sync="dialogScript" :close-on-click-modal="false" width="40%">
      <p>{{ currentSript ? currentSript.remark : '' }}</p>
      <el-form label-position="top" label-width="10%">
        <el-form-item v-for="(e,i) in scriptArgs" :key="e + i" :label="argsKey[i]">
          <el-input v-model.trim="scriptArgs[i]" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleRunScript">运 行</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { script } from '@/api'
export default {
  name: 'ScriptList',
  data () {
    return {
      search: '',
      loading: false,
      createNew: false,
      currentSript: null,
      currentEdit: null,
      newScript: {
        name: '', // 脚本名称 与文件名相同
        remark: '', // 描述说明
        argument: '' // Json参数
      },
      scriptList: [],
      // 参数
      argsKey: [''],
      scriptArgs: [''],
      dialogScript: false
    }
  },
  created () {
    this.getScriptList()
  },
  methods: {
    handlerReset () {
      console.log(this.$refs)
      this.createNew = false
      this.$refs['createNew'].resetFields()
    },
    async handlerCreate () {
      const res = await script.create(this.newScript)
      if (res.code === 200) {
        this.$message.success('添加成功')
      }
      this.handlerReset()
      this.getScriptList()
    },
    async getScriptList () {
      this.loading = true
      const res = await script.getList()
      this.scriptList = res.data
      this.loading = false
    },
    async handlerEdit (_id) {
      const { meta, ...params } = this.currentEdit
      const res = await script.update(params)
      this.scriptList = this.scriptList.map(e => e._id === _id ? Object.assign({}, this.currentEdit) : e)
      this.currentEdit = null
    },
    async handlerStatus (row) {
      const res = await script.status([row._id], !row.disabled)
      if (res.code === 200) {
        this.getScriptList()
      }
    },
    async handleDelete (_id) {
      this.$confirm('此操作将删除该记录但会保留当前脚本, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await script.delete([_id])
        if (res.code === 200) {
          this.getScriptList()
        }
      }).catch(() => console.log('取消删除'))
    },
    handleArgs (row) {
      this.currentSript = row
      this.dialogScript = true
      this.argsKey = row.argument.split('#')
      this.scriptArgs = Array.from({ length: this.argsKey.length }, (v, k) => '')
    },
    handleCancel () {
      this.dialogScript = false
      this.argsKey = ['']
      this.scriptArgs = ['']
      this.currentSript = null
    },
    handleRunScript () {
      const args = this.scriptArgs.filter(e => e !== '')
      this.$socket.emit('runScript', { name: this.currentSript.name, args })
      this.handleCancel()
    },
    setEdit (row) {
      this.currentEdit = row
    }
  }
}
</script>
<style lang="scss" scope>
</style>
