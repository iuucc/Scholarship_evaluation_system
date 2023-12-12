<script>
export default {
  name: "Grades",
  data() {
    return {
      tableData: Object,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      tradename: "",
      type: "",
      form: {},
      multipleSelection: [],
      dialogFormVisible: false,
      dialogFormVisible2:false,
      dialogFormVisible3:false,
      roles:[],
      options:[],
      filteredScopes:[],
      filteredlevel:[],
      filteredscore:[],
      average:"",
      studentName:"",
      overruledata:"",
      adminName:JSON.parse(localStorage.getItem("user")).username,
      id:JSON.parse(localStorage.getItem("userAll")).id,
      sellername:JSON.parse(localStorage.getItem("userAll")).nickname,
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
    overrule1(){
      this.form.operator=this.adminName
      this.form.overrule=this.overruledata
      this.request.post("/bonus", this.form).then((res) => {
        if (res.code==='200') {
          this.request.get("/bonus/updata3/"+this.form.id).then((res) => {});
          this.$message.success("驳回成功");
          this.dialogFormVisible = false;
          this.load();
        } else {
          this.$message.error("驳回失败");
        }
      });
      this.dialogFormVisible=false
      this.dialogFormVisible2=false
    },
    CheckBad(){
      this.request.post("/user", this.form).then((res) => {
        if (res.code==='200') {
          this.$message.success("录入成功");
          this.dialogFormVisible = false;
          this.load();
        } else {
          this.$message.error("录入失败");
        }
        this.dialogFormVisible=false
      });

    },
    CheckRight(){
      this.dialogFormVisible=false
    },
    handledownload(materialUrl){
      console.log(materialUrl)
      window.open(materialUrl)
    },
    handleCascaderChange2(value){
      this.form.level = value;
      this.request.get("/type").then((res) => {
        this.filteredscore = []; // 清空数组
        res.data.forEach((item) => {
          const matchingChildren = item.children.filter((child) => child.scope === this.form.scope && child.name === this.form.projectName && child.level === this.form.level);
          matchingChildren.forEach((child) => {
            this.filteredscore.push(child.scores);
          });
        });
      });
    },
    handleCascaderChange1(value){
      this.form.scope=value
      const selectedlevels = [];
      this.request.get("/type").then((res)=>{
        res.data.forEach((item) => {
          const matchingChildren = item.children.filter((child) => child.scope === this.form.scope && child.name === this.form.projectName);
          matchingChildren.forEach((child) => {
            selectedlevels.push(child.level);
          });
        });
        this.filteredlevel=selectedlevels
      })
    },
    handleCascaderChange(value){
      this.form.projectName= value[value.length - 1]; // 获取最后一级的值
      let filtered;
      // 根据选中的值筛选对应的 scope 值
      const selectedScopes = [];
      this.request.get("/type").then((res)=>{
        res.data.forEach((item) => {
          const matchingChildren = item.children.filter((child) => child.name === this.form.projectName);
          matchingChildren.forEach((child) => {
            selectedScopes.push(child.scope);
          });
        });
        filtered = [...new Set(selectedScopes)];
        this.filteredScopes=filtered
      })
    },
    handleAdd(){
      this.dialogFormVisible=true

    },
    reset() {
      this.tradename = "";
      this.type = "";
      this.load();
    },
    load() {
      this.request
          .get("/user/allStudent", {
          })
          .then((res) => {
            this.tableData=res.data
            console.log(this.tableData)
          });
    },

    save() {
      this.form.userId=this.id
      this.form.status="未审核"
      this.request.post("/bonus", this.form).then((res) => {
        if (res.code==='200') {
          this.$message.success("保存成功");
          this.dialogFormVisible = false;
          this.load();
        } else {
          this.$message.error("保存失败");
        }
      });
    },
    changeEnable(row){
      this.request.post("/commodity",row).then(res=>{
        if(res.code==='200'){
          this.$message.success("操作成功")
        }
      })
    },
    handleAvatarSuccess(res){
      this.form.materialUrl=res
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
    delBatch(){
      let ids = this.multipleSelection.map((v) => v.id);
      this.request.post("/commodity/del/batch", ids).then((res) => {
        if (res.code==='200') {
          this.$message.success("批量删除成功");
          this.load();
        } else {
          this.$message.error("批量删除失败");
        }
      });
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.load();
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.load();
    },
    import1(){
      this.dialogFormVisible3=true
      // this.request
      //     .get("/user/import", {
      //     })
      //     .then((res) => {
      //       console.log(this.tableData)
      //     });
    },
    export1() {
      window.open("http://localhost:9090/user/export")
    },
    handleUploadSuccess(){
        this.$message.success("上传成功")
    }
  }
}
</script>

<template>
  <div>
    <div style="padding: 10px 0">
      <el-input
          style="width: 200px"
          placeholder="请输入名称"
          suffix-icon="el-icon-search"
          v-model="tradename"
      >
      </el-input>

      <el-button style="margin-left: 5px" type="primary" @click="load"
      >搜索</el-button
      >
      <el-button style="margin-left: 5px" type="warning" @click="reset"
      >重置</el-button
      >
    </div>
    <div style="margin: 5px 0">
      <div>
        <el-tooltip content="导入格式请参考导出格式" placement="top">
        <!-- 上传按钮 -->
        <el-upload
            ref="upload"
            action="http://localhost:9090/user/import/"
            accept=".doc,.docx,.xlsx"
            :headers="uploadHeaders"
            :show-file-list="false"
            @change="handleFileChange"
            @success="handleUploadSuccess"
            style="float: left">
          <el-button type="primary" icon="el-icon-upload2">导入</el-button>
        </el-upload>
        </el-tooltip>
      </div>
      <el-button type="primary" @click="export1" style="margin-left: 5px">导出 <i class="el-icon-circle-plus-outline"></i></el-button>
    </div>
    <el-table
        :data="tableData"
        :border="true"
        :stripe="true"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
          prop="id"
          label="学号"
          width="140"
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
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button
              type="success"
              @click="handleEdit(scope.row)"
          >录入 <i class="el-icon-s-release"></i
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
    <el-dialog title="录入成绩" :visible.sync="dialogFormVisible">
      <el-form label-width="80px">
        <el-form-item label="学生姓名">
          <el-input
              v-model=this.form.username
              :disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input
              v-model=this.form.phone
              :disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input
              v-model=this.form.email
              :disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="平均成绩" >
          <el-input
              v-model="form.average"
              placeholder="请输入平均成绩">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click=CheckRight>取消</el-button>
        <el-button type="danger" @click=CheckBad>确定</el-button>
      </div>
    </el-dialog>
    <!--    驳回界面-->
    <el-dialog title="项目详细" :visible.sync="dialogFormVisible2">
      <el-form label-width="80px">
        <el-form-item label="驳回人">
          <el-input  v-model="this.adminName"  :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="驳回理由">
          <el-input type="textarea" v-model="overruledata" :autosize="{ minRows: 6, maxRows: 8 }"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="overrule1" type="success">驳回</el-button>
      </div>
    </el-dialog>
    <el-dialog title="导入分数" :visible.sync="dialogFormVisible3">
      <el-form label-width="80px">
      <el-upload
          class="upload-demo"
          drag
          action="http://localhost:9090/user/import/"
          accept=".doc,.docx,.xlsx"
          multiple
      >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传Word文件（.doc/.docx .xlsx 格式）</div>
      </el-upload>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">上传</el-button>
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