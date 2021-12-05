<template>
  <div id="login-component">
    <el-container>
      <el-header style="height: 15%">
        <img src="../assets/logo.png" alt="" />
        <h2>欢迎登录</h2>
      </el-header>
      <el-main>
        <el-form
          ref="loginForm"
          :label-position="labelPosition"
          :rules="rules"
          id="login-form"
          label-width="0px"
          :model="loginForm"
        >
          <el-form-item prop="username">
            <el-input
              prefix-icon="iconfont icon-user"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              prefix-icon="iconfont icon-lock_fill"
              type="password"
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>
          <el-button type="primary" round @click="login" :loading="isDoingLogin"
            >{{ isDoingLogin ? '正在登录' : '登&nbsp;录' }}
          </el-button>
          <el-button type="info" round @click="reset">重置</el-button>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>

export default {
  name: "Login",
  data () {
    return {
      isDoingLogin: false,
      rules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 5, message: '长度至少为6个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '长度至少为6个字符', trigger: 'blur' }
        ],
      },
      labelPosition: 'right',
      loginForm: {
        username: 'hcf2000',
        password: '123456',
      }
    }
  },
  methods: {
    reset () {
      this.$refs.loginForm.resetFields()
    },
    login () {
      this.$refs.loginForm.validate(async (r) => {
        if (!r) return
        this.isDoingLogin = true
        try {
          const { data: data } = await this.$axios.post("/login", this.loginForm)
          if (data.code === this.$httpStatus.REDIRECT_CODE) {
            this.$message.success(data.message)
            await this.$router.push(data.data.redirect)
          }
        } finally {
          this.isDoingLogin = false
        }
      }
      )
    }
  }
}
</script>

<style scoped>
#login-component {
  margin: 1% auto 0;
  text-align: center;
}

img {
  height: 100%;
  width: 100%;
  max-width: 200px;
  border-radius: 50%;
  background-color: #00fff7;
  box-shadow: 0 0 10px;
}

#login-form {
  width: 80%;
  max-width: 500px;
  min-width: 300px;
  margin: 0 auto;
}

button {
  width: 30%;
}
</style>
