<script>
import {setRouters} from "@/router";

export default {
  name: "Login",
  data(){
    return{
      user:{},
      userAll:{},
      rules:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      },
    }
  },

  methods:{
    login(){
      this.$refs['userFrom'].validate((valid) => {
        if (valid) { //合法
          this.request.post("/user/login",this.user).then(res=>{
            if(res.code==='200'){
              localStorage.setItem("user",JSON.stringify(res.data))
              localStorage.setItem("menus",JSON.stringify(res.data.menus))
              setRouters()
              this.request.get("/orders/finduser/"+this.user.username).then(res=>{
                localStorage.setItem("userAll",JSON.stringify(res.data))
                this.userAll=localStorage.getItem("userAll") ? JSON.parse(localStorage.getItem("userAll")) : {}
              })
              this.$message.success("登录成功")
              console.log(res.data.role)
              this.$router.push("/home")
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
    <div style="margin: 200px auto;background-color: #fff;width: 350px;height: 300px;padding: 20px;border-radius: 10px" >
      <div style="margin: 20px 0;text-align: center;font-size: 24px;">奖学金评定系统</div>
      <el-form  :model="user" :rules="rules" ref="userFrom">
      <el-form-item prop="username">
        <el-input  v-model="user.username" prefix-icon="el-icon-user" size="medium" style="margin: 10px 0"> </el-input>
      </el-form-item>
        <el-form-item prop="password">
          <el-input  v-model="user.password" prefix-icon="el-icon-lock" size="medium" show-password style="margin: 10px 0">  </el-input>
        </el-form-item>
      <div style="margin: 10px 0;text-align: right">
        <el-button type="primary" size="small" autocomplete="off" @click="login">登录</el-button>
        <el-button type="warning" size="small" autocomplete="off" @click="$router.push('/register')">注册</el-button>
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