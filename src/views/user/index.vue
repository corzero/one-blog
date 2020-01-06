<template>
  <div class="app-container">
    <el-row style="margin: 50px 150px;">
      <el-col :span="4">
        <el-upload class="avatar-uploader" action="/api/upload/avatar" accept="image/*" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="form.avatar" :src="form.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-col>
      <el-col :span="10" :offset="2">
        <el-form ref="form" :model="form" label-position="left" label-width="80px" size="mini">
          <el-form-item label="UID">
            <span>{{ form._id }}</span>
          </el-form-item>
          <el-form-item label="用户名">
            <span>{{ form.username }}</span>
          </el-form-item>
          <el-form-item label="注册时间">
            <span>{{ $moment(form.meta.createdAt).format('YYYY-MM-DD HH:mm:ss') }}</span>
          </el-form-item>
          <el-form-item label="个性签名">
            <el-input v-model="form.title" :disabled="isView" />
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="form.sex" :disabled="isView">
              <el-radio :label="true">女</el-radio>
              <el-radio :label="false">男</el-radio>>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="form.email" :disabled="isView" />
          </el-form-item>
          <el-form-item label="地区">
            <el-cascader v-model="form.region" :disabled="isView" :options="area" :props="props" @change="handleChange" />
          </el-form-item>
          <el-form-item label="隐藏主页">
            <el-switch v-model="form.delivery" :disabled="isView" />
          </el-form-item>
          <el-form-item v-if="isView">
            <el-button type="primary" @click="isView = false">编辑</el-button>
          </el-form-item>
          <el-form-item v-else>
            <el-button type="primary" :loading="loading" @click="updateInfo">更新</el-button>
            <el-button @click="isView = true">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { user } from '@/api'
import area from './area.json'
export default {
  data() {
    return {
      area: area,
      props: {
        value: 'code',
        label: 'name'
      },
      isView: true,
      loading: false,
      form: {
        _id: '',
        name: '',
        title: '',
        email: '',
        region: [],
        delivery: false,
        sex: null,
        meta: {
          createAt: ''
        }
      }
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
      const res = await user.getDetail(this.$store.getters.user._id)
      this.form = res.data
    },
    async updateInfo() {
      this.loading = true
      const { _id, title, email, region, delivery, sex } = this.form
      await user.updateInfo({ _id, title, email, region, delivery, sex })
      this.loading = false
      this.isView = true
    },
    handleAvatarSuccess(res, file) {
      console.log(res, file)
      this.form.avatar = res.data.url
      this.$store.commit('user/SET_INFO', { avatar: res.data.url })
      user.updateInfo({ _id: this.form._id, avatar: res.data.url })
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    onSubmit() {
      console.log('submit!')
    },
    handleChange() {
      console.log(...arguments)
    }
  }
}
</script>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
