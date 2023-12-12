<script>
import router from "@/router";

export default {
  name: "Register",
  data(){
    return{
      user:{},
      rules:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      },
    }
  },

  methods:{
    router() {
      return router
    },
    login(){
      this.$refs['userFrom'].validate((valid) => {
        if (valid) { //合法
          if(this.user.password!=this.user.confirmPassword){
            this.$message.error("两次输入密码不一致")
            return false
          }
          this.request.post("/user/register",this.user).then(res=>{
            if(res.code==='200'){
              this.$message.success("注册成功")
            }else {
              this.$message.error("用户名或密码错误")
            }
          })
        }
      });

    },
  },

}
</script>

<template>
  <div class="wrapper">
    <div style="margin: 100px auto;background-color: #fff;width: 350px;height: 400px;padding: 20px;border-radius: 10px" >
      <div style="margin: 20px 0;text-align: center;font-size: 24px;">注册</div>
      <el-form  :model="user" :rules="rules" ref="userFrom">
      <el-form-item prop="username">
        <el-input  placeholder="请输入账号" v-model="user.username" prefix-icon="el-icon-user" size="medium" style="margin: 5px 0"> </el-input>
      </el-form-item>
        <el-form-item prop="password">
          <el-input  placeholder="请输入密码" v-model="user.password" prefix-icon="el-icon-lock" size="medium" show-password style="margin: 5px 0">  </el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input  placeholder="请确认密码" v-model="user.confirmPassword" prefix-icon="el-icon-lock" size="medium" show-password style="margin: 5px 0">  </el-input>
        </el-form-item>
      <div style="margin: 10px 0;text-align: right">
        <el-button type="primary" size="small" autocomplete="off" @click="login">注册</el-button>
        <el-button type="warning" size="small" autocomplete="off" @click="$router.push('/login')">返回登录</el-button>
      </div>
      </el-form>
    </div>
  </div>
</template>

<style>
  .wrapper{
    height: 100vh;
    background-image: url("../assets/img_1.png");
    overflow:hidden;
  }
</style>