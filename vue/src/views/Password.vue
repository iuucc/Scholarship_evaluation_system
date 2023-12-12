<script>
export default {
  name: "Password",
  data() {
    return {
      form: {},
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      rules: {
        password: [
          {required: true, message: '请输入原密码', trigger: 'blur'},
          {min: 3, message: '长度不少于3位', trigger: 'blur'}
        ],
        newpassword: [
          {required: true, message: '请输入新密码', trigger: 'blur'},
          {min: 3, message: '长度不少于3位', trigger: 'blur'}
        ],
        confirmPassword: [
          {required: true, message: '请确入密码', trigger: 'blur'},
          {min: 3, message: '长度不少于3位', trigger: 'blur'}
        ],
      }
    }
  },
  created() {
    this.form.username=this.user.username
  },
  methods:{
        save(){
          this.$refs.pass.validate((valid)=>{
            if(valid){
              if(this.form.newpassword!==this.form.confirmPassword){
                this.$message.error("两次输入密码不一致")
                return false
              }
              this.request.post("/user/password",this.form).then(res=>{
                if(res.code==='200'){
                  this.$message.success("修改成功")
                  this.$store.commit("logout")
                }else {
                  this.$message.error(res.msg)
                }
              })
            }
          })
        }
  }
}
</script>

<template>
    <el-card >
      <el-form label-width="120px" size="small" :model="form" :rules="rules" ref="pass">
        <el-form-item label="原密码" prop="password">
          <el-input v-model="form.password" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="form.newpassword" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">确定</el-button>
        </el-form-item>
      </el-form>
    </el-card>
</template>

<style scoped>

</style>