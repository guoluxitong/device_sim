<template>
  <el-form :model="loginForm" :rules="rules" ref="loginForm" label-position="left" label-width="0px" class="login-container">

          <h3 class="title">简洁软件数据管理平台</h3>
          <el-form-item prop="account">
            <el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="账号"></el-input>
          </el-form-item>
          <el-form-item prop="passWord">
            <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item v-show="false" prop="orgType">
            <el-input type="password" v-model="loginForm.orgType" auto-complete="off" ></el-input>
          </el-form-item>
          <!--<el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>-->
          <el-form-item style="width:100%;">
            <el-button type="primary" style="width:100%;" @click.native.prevent="handleLogin" :loading="loading">登录</el-button>
          </el-form-item>
  </el-form>
</template>

<script>
  export default {
    data() {
      return {
        applet:'/static/common/applet.jpg',
        image: false,
        loading: false,
        loginForm: {
          account: '',
          password: '',
        },
        rules: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        },
        //checked: true
      };
    },

    methods: {
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
           if(this.loginForm.account== '18888281821' &&this.loginForm.password=='123456'){
             this.$router.push({ path: this.redirect || '/home/index' })
           }else {
             return
           }
          } else {
            return false
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .login-container {
    width: 350px;
    position: absolute;
    left:50%;
    top:50%;
    margin-left:-175px;
    margin-top:-280px;
    padding: 35px 35px 15px 35px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>
