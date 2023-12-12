<script>
export default {
  name: "Assess",
  data() {
    return {
      tableData: Object,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      form: Object,
      multipleSelection: [],
      dialogFormVisible: false,
      form2:{},
      dialogFormVisible2:false,
      dialogFormVisible3:false,
      dialogFormVisible4:false,
      dialogFormVisible5:false,
      Percentageofgrades:0.9,
      Percentageofextrapoints:0.1,
      options: [{
        value: '一等奖学金',
        label: '一等奖学金'
      }, {
        value: '二等奖学金',
        label: '二等奖学金'
      }, {
        value: '三等奖学金',
        label: '三等奖学金'
      }],
      filteredScopes:[],
      filteredlevel:[],
      filteredscore:[],
      average:"",
      overruledata:"",
      scholarshiplevel:"",
      adminName:JSON.parse(localStorage.getItem("user")).username,
      id:JSON.parse(localStorage.getItem("userAll")).id,
    };
  },
  created() {
    //请求分页查询数据
    this.load();
  },
  computed:{
    updatedProjectScores() {
      this.form.projectScores=this.filteredscore[0]
      return this.filteredscore.length > 0 ? this.filteredscore[0] : ''; // 根据实际需求处理
    }
  },
  methods:{
    reset() {
      this.dialogFormVisible5=true
    },
    load() {
      this.request
          .get("/user/allStudent", {
          })
          .then((res) => {
            this.tableData=res.data.sort((a, b) => {
              return b.finalscore - a.finalscore;
            });
            console.log(this.tableData)
          });
    },
    handleEdit(row){
      this.form=row
      this.dialogFormVisible=true
    },
    del(id) {
      this.request.delete("/bonus/" + id).then((res) => {
        if (res.code==='200') {
          this.$message.success("删除成功");
          this.load();
        } else {
          this.$message.error("删除失败");
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.load();
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.load();
    },
    Seedetails(row){
      this.form=row
      this.request
          .get("/bonus/allScores/"+this.form.id, {
          }).then((res) => {
            if(res.status==='500'){
              this.$message.error("该生无加分信息")
            }

            console.log(row)
            this.dialogFormVisible4=true
          });
      this.request
          .get("/bonus/"+this.form.id, {}).then((res) => {
          this.form2=res.data
      });
    },
    rating(){
      this.form.scholarshiplevel=this.scholarshiplevel
      this.form.evaluation=1
      this.request.post("/user",this.form).then(res=>{
        if(res.code==='200'){
          this.$message.success("评定成功")
          this.dialogFormVisible=false
        }
      })
    },
    changeTheProportions(){
      for (let data of this.tableData){
        console.log(data.average,this.Percentageofgrades, data.totalpluspoints, this.Percentageofextrapoints);
        data.finalscore=data.average*this.Percentageofgrades+data.totalpluspoints*this.Percentageofextrapoints
        this.request.post("/user",data).then((res) => {});
      }
      this.$message.success("重新计算成功")
      this.dialogFormVisible5=false
    }
  }
}
</script>

<template>
  <div>
    <div style="padding: 10px 0">
      <el-button style="margin-left: 5px" type="warning" @click="reset"
      >编辑比例</el-button
      >
    </div>
    <el-table
        :data="tableData"
        :border="true"
        :stripe="true"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" ></el-table-column>
      <el-table-column
          prop="id"
          label="学号"
          width="60"
      ></el-table-column>
      <el-table-column
          prop="username"
          label="学生姓名"
          width="140"
      ></el-table-column>
      <el-table-column
          prop="specialized"
          label="专业"
          width="140"
      ></el-table-column>
      <el-table-column
          prop="classes"
          label="班级"
          width="140"
      ></el-table-column>
      <el-table-column
          prop="average"
          label="平均成绩"
          width="140"
      ></el-table-column>
      <el-table-column
          prop="totalpluspoints"
          label="总加分数"
          width="140"
      ></el-table-column>
      <el-table-column
          prop="finalscore"
          label="最终成绩"
          width="140"
      ></el-table-column>
      <el-table-column
          prop="scholarshiplevel"
          label="奖学金等级"
          width="140"
      ></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
              type="success"
              @click="handleEdit(scope.row)"
          >评定 <i class="el-icon-s-release"></i
          ></el-button>
          <el-button
              type="success"
              @click="Seedetails(scope.row)"
          >查看详细 <i class="el-icon-s-release"></i
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="padding: 10px 0">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[2, 5, 10, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
      >
      </el-pagination>
    </div>
<!--    详细弹窗-->
    <el-dialog title="详细" :visible.sync="dialogFormVisible4">
      <el-form>
        <el-table
            :data="form2"
            :border="true"
            :stripe="true"
            @selection-change="handleSelectionChange"
        >
          <el-table-column
              prop="projectName"
              label="项目名"

          ></el-table-column>
          <el-table-column
              prop="projectLevel"
              label="等级"

          ></el-table-column>
          <el-table-column
              prop="projectScores"
              label="得分"

          ></el-table-column>
        </el-table>
      </el-form>
    </el-dialog>
<!--    评定弹窗-->
    <el-dialog title="评定" :visible.sync="dialogFormVisible">
      <el-form label-width="80px">
        <el-select v-model="scholarshiplevel" placeholder="请选择">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="rating">确定</el-button>
      </div>
    </el-dialog>
<!--    比例弹窗-->
    <el-dialog title="修改比例" :visible.sync="dialogFormVisible5">
      <el-form>
      <el-form-item label="成绩所占比">
        <el-input
            v-model="Percentageofgrades"
           >
        </el-input>
      </el-form-item>
        <el-form-item label="加分所占比">
          <el-input
              v-model="Percentageofextrapoints"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeTheProportions">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style >
.avatar-uploader{
  text-align: center;
  padding-bottom: 10px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 138px;
  height: 138px;
  line-height: 138px;
  text-align: center;
}
.avatar {
  width:138px;
  height: 138px;
  display: block;
}

</style>