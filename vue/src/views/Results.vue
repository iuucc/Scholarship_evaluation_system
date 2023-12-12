<script>
export default {
  name: "Results",
  data () {
    return {
      size: '',
      userall:JSON.parse(localStorage.getItem("userAll")),
    };
  },
  methods:{
    created() {
      //请求分页查询数据
      this.load();
    },
    load() {
      console.log(this.userall.id)
    },
    click(){
      console.log("名字为："+this.userall.username)
    }
  }
}
</script>

<template>
  <div>
    <el-radio-group v-model="size">
      <el-radio label="">默认</el-radio>
      <el-radio label="medium">中等</el-radio>
      <el-radio label="small">小型</el-radio>
      <el-radio label="mini">超小</el-radio>
    </el-radio-group>
    <el-descriptions class="margin-top" title="带边框列表" :column="3" :size="size" border>
      <el-descriptions-item :label="this.userall.username" v-if="this.userall.username">
        <template slot="label">
          <i class="el-icon-user"></i>
          学生姓名
        </template>
        {{ userall.username }}
      </el-descriptions-item>
      <el-descriptions-item :label="this.userall.phone" v-if="this.userall.phone">
        <template slot="label">
          <i class="el-icon-mobile-phone"></i>
          电话
        </template>
        {{ userall.phone}}
      </el-descriptions-item>
      <el-descriptions-item :label="this.userall.address" v-if="this.userall.address">
        <template slot="label">
          <i class="el-icon-location-outline"></i>
          居住地
        </template>
        {{ userall.address}}
      </el-descriptions-item>
      <el-descriptions-item :label="this.userall.specialized" v-if="this.userall.specialized">
        <template slot="label">
          <i class="el-icon-location-outline"></i>
          专业
        </template>
        {{ userall.specialized}}
      </el-descriptions-item>
      <el-descriptions-item :label="this.userall.classes" v-if="this.userall.classes">
        <template slot="label">
          <i class="el-icon-location-outline"></i>
         班级
        </template>
        {{ userall.classes}}
      </el-descriptions-item>
      <el-descriptions-item :label="this.userall.scholarshiplevel" v-if="this.userall.scholarshiplevel">
        <template slot="label">
          <i class="el-icon-tickets"></i>
          奖学金等级
        </template>
        {{ userall.scholarshiplevel}}
      </el-descriptions-item>
      <el-descriptions-item :label="this.userall.email" v-if="this.userall.email">
        <template slot="label">
          <i class="el-icon-office-building"></i>
          邮箱
        </template>
        {{ userall.email}}
      </el-descriptions-item>

      <el-descriptions-item :label="this.userall.average" >
        <template slot="label">
          <i class="el-icon-table-lamp"></i>
          平均成绩
        </template>
        {{ userall.average}}
      </el-descriptions-item>
      <el-descriptions-item :label="this.userall.totalpluspoints" >
        <template slot="label">
          <i class="el-icon-wallet"></i>
          总加分数
        </template>
        {{ userall.totalpluspoints}}
      </el-descriptions-item>
      <el-descriptions-item :label="this.userall.finalscore" >
        <template slot="label">
          <i class="el-icon-baseball"></i>
          最终得分
        </template>
        {{ userall.finalscore}}
      </el-descriptions-item>
      <el-descriptions-item :label="this.userall.evaluation" >
        <template slot="label">
          <i class="el-icon-sunny"></i>
          评定状态
        </template>
        <el-tag v-if="this.userall.evaluation == 1" type="success">已评级</el-tag>
        <el-tag v-else type="warning">未评级</el-tag>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<style scoped>

</style>