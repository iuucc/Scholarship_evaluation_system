<script>
export default {
  name: "Audit",
  data() {
    return {
      tableData: Object,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      tradename: "",
      type: "",
      form: {},
      materialUs:[],
      multipleSelection: [],
      dialogFormVisible: false,
      dialogFormVisible2:false,
      dialogFormVisible3:false,
      roles:[],
      options:[],
      filteredScopes:[],
      filteredlevel:[],
      filteredscore:[],
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
        this.dialogFormVisible2=true
    },
    CheckRight(){
      this.form.status=""
      this.form.operator=this.adminName
      this.request.get("/bonus/updata2/"+this.form.id+"/"+this.form.operator).then((res) => {
        if (res.code==='200') {
          this.$message.success("审核成功");
          this.dialogFormVisible = false;
          this.load();
        } else {
          this.$message.error("审核失败");
        }
        this.dialogFormVisible=false
      });
    },
    handledownload(row) {
      this.request.get("/material/some/" + row.materialUrl).then((res) => {
        res.data.forEach(item => {
          this.materialUs = this.materialUs.concat(item.materialUrls);
        });
        console.log(this.materialUs);
        let urls = [...this.materialUs]; // 复制数组以防止修改原始数组
        function openNextUrl() {
          if (urls.length > 0) {
            let url = urls.shift();
            window.open(url);
            setTimeout(openNextUrl, 2000); // 延迟1秒后打开下一个URL
          }
        }
        openNextUrl();
        this.materialUs = []; // 清空数组
      });
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
          .get("/bonus/pages", {
            params: {
              pageNum: this.pageNum,
              pageSize: this.pageSize,
              tradename: this.tradename,
              type: this.type,
            },
          })
          .then((res) => {
            console.log(res.data)
            this.tableData = res.data.records.filter((record) => record.status !== "未提交")
            this.total = res.data.total;
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
    handleEdit2(row){
      this.request.get("/user/"+row.userId).then(res=>{
        if(res.code==='200'){
          this.studentName=res.data.username
        }
      })
      this.request.get("/material/some/" + row.materialUrl).then((res) => {
            res.data.forEach(item => {
              this.materialUs = this.materialUs.concat(item.materialUrls);
            });});
      this.form = row;
      this.dialogFormVisible3=true
    },
    handleDialogClose(){
      this.materialUs=[];
    },
    handleEdit(row){
      if(row.status==="已审核"){
        this.$message.warning("已经审核过了!!!")
      }else if(row.status==="已驳回"){
        this.$message.warning("已经驳回了!!!")
      } else {
        this.form = row;
        this.dialogFormVisible=true
      }
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

    <el-table
        :data="tableData"
        :border="true"
        :stripe="true"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
          prop="userId"
          label="学号"
          width="50"
      ></el-table-column>
      <el-table-column
          prop="userName"
          label="姓名"
          width="100"
      ></el-table-column>
      <el-table-column
          prop="specialized"
          label="专业"
          width="140"
      ></el-table-column>
      <el-table-column
          prop="classes"
          label="班级"
          width="120"
      ></el-table-column>
      <el-table-column prop="status" label="审核状态" width="100"></el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button
              type="success"
              @click="handleEdit(scope.row)"
          >审核 <i class="el-icon-s-release"></i
          ></el-button>
          <el-button
              type="warning"
              @click="handleEdit2(scope.row)"
          >查看详细 <i class="el-icon-s-release"></i
          ></el-button>
          <el-button
              type=""
              @click="handledownload(scope.row)"
              style="margin-left: 20px;"
          >下载附件 <i class="el-icon-bottom"></i
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
    <el-dialog title="项目详细" :visible.sync="dialogFormVisible">
      <el-form label-width="80px">
        <el-form-item label="项目名称">
          <el-input
              v-model=this.form.projectName
              :disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="项目范围">
          <el-input
              v-model=this.form.projectScope
              :disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="项目等级">
          <el-input
              v-model=this.form.projectLevel
              :disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="所加分数" >
          <el-input
              v-model=this.form.projectScores
              :disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="申请时间" >
          <el-input
              v-model=this.form.submissiontime
              :disabled="true">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click=CheckRight>审核通过</el-button>
        <el-button type="danger" @click=CheckBad>审核不通过</el-button>
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
    <el-dialog title="项目详细" :visible.sync="dialogFormVisible3"  @close="handleDialogClose">
      <el-form label-width="80px">
        <el-form-item label="项目名称">
          <el-input
              v-model=this.form.projectName
              :disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="项目范围">
          <el-input
              v-model=this.form.projectScope
              :disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="项目等级">
          <el-input
              v-model=this.form.projectLevel
              :disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="所加分数" >
          <el-input
              v-model=this.form.projectScores
              :disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="申请时间" >
          <el-input
              v-model=this.form.submissiontime
              :disabled="true">
          </el-input>
        </el-form-item>
      </el-form>
      <h1>佐证材料</h1>
      <div class="block" v-for="fit in materialUs" :key="fit">
        <div class="demo-image__preview">
          <el-image
              style="width: 200px; height: 200px"
              :src="fit"
              :preview-src-list="srcList">
          </el-image>
        </div>
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