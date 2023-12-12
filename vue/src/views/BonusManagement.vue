<script>
export default {
  name: "BonusManagement",
  data() {
    return {
      tableData: Object,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      tradename: "",
      type: "",
      form: {},
      form2:{},
      multipleSelection: [],
      dialogFormVisible: false,
      dialogFormVisible1:false,
      dialogFormVisible2:false,
      roles:[],
      materialUrls:[],
      options:[],
      filteredScopes:[],
      filteredlevel:[],
      filteredscore:[],
      id:JSON.parse(localStorage.getItem("userAll")).id,
      userall:JSON.parse(localStorage.getItem("userAll")),
      sellername:JSON.parse(localStorage.getItem("userAll")).nickname,
      activities: [],
      materialUs: [],
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
    handleDialogClose(){
      this.activities = []; // 清空activities数组
      this.materialUs=[];
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
      this.form={}
      this.request
          .get("/type")
          .then((res) => {
            const seen = {}; // 初始化 seen 对象
            this.options = res.data.map((item) => {
              if (item.children) {
                item.children = item.children.filter((child) => {
                  if (seen[child.name]) {
                    return false; // 如果已经出现过，则返回 false，将该对象从数组中移除
                  }
                  seen[child.name] = true; // 将当前 name 值保存到 seen 对象中
                  return true;
                });
              }
              return item;
            });
          });
    },
    reset() {
      this.tradename = "";
      this.type = "";
      this.load();
    },
    load() {
      console.log(JSON.parse(localStorage.getItem("userAll")).id)
      this.request
          .get("/bonus/page", {
            params: {
              pageNum: this.pageNum,
              pageSize: this.pageSize,
              tradename: this.tradename,
              type: this.type,
              userId:this.id
            },
          })
          .then((res) => {
            this.tableData = res.data.records
            this.total = res.data.total;

          });
    },

    save() {
      this.form.userId=this.id
      this.form.specialized=this.userall.specialized
      this.form.classes=this.userall.classes
      this.form.userName=this.userall.username
      this.form.status="未提交"
      this.request.post("/bonus", this.form).then((res) => {
        if (res.code==='200') {
          this.$message.success("保存成功");
          this.dialogFormVisible = false;
          this.load();
        } else {
          this.$message.error("保存失败");
        }
      });
      for(let i=0;i<this.materialUrls.length;i++){
        this.form2.materialUrls=this.materialUrls[i]
        this.request.post("/material",this.form2).then(res=>{
        })
      }

    },
    changeEnable(row){
      this.request.post("/commodity",row).then(res=>{
        if(res.code==='200'){
          this.$message.success("操作成功")
        }
      })
    },
    handleAvatarSuccess(res){
      const randomNum = Math.floor(10000000 + Math.random() * 90000000); // 生成八位随机数
      this.materialUrls.push(res); // 将 res 添加到 materialUrls 数组中
      this.form.materialUrl = randomNum.toString(); // 将生成的随机数赋值给 materialUrl
      this.form2.bonusId=randomNum.toString();
    },
    handleEdit(row){
      if(row.status==="未审核"||row.status==="已审核"){
        this.$message.warning("已提交不得修改")
      }else{
        this.form = row;
        this.dialogFormVisible = true;
      }
    },
    handleEdit2(row){
      if(row.status==="已审核"){
        this.$message.warning("已经审核过了!!!")
      } else if(row.status==="未审核"){
        this.$message.warning("等待审核请勿重复提交")
      }else if(row.status==="已驳回"){
        this.$message.warning("已驳回请重新申请")
      }else {
        this.form = row;
        this.form.status=""
        this.request.get("/bonus/updata/"+row.id).then((res) => {
          if (res.code==='200') {
            this.$message.success("提交成功");
            this.dialogFormVisible = false;
            this.load();
          } else {
            this.$message.error("提交失败");
          }
        });
      }
    },
    handleEdit3(row){
      this.request.get("/bonus/some/"+row.id).then((res) => {
        console.log(res.data)
        if(res.data.submissiontime!==null){
          this.dialogFormVisible1=true
          this.activities.push({
            content: '提交审核',
            timestamp: res.data.submissiontime,
            size: 'large',
            type: 'primary',
            icon: 'el-icon-s-promotion'
          }, {
            content: '审核中',
            timestamp: '',
            color: '#0bbd87'
          })
        }else {
          this.$message.warning("未提交审核，请提交后查看！")
        }
        if(res.data.reviewtime!==null){
            this.activities.push({
              content: '审核通过'+'   '+'审核人:'+res.data.operator,
              timestamp: res.data.reviewtime,
              type: 'primary',
              size: 'large',
              icon: 'el-icon-check'
            })
        }
        if(res.data.overruletime!==null){
          this.activities.push({
            content: '已驳回'+'   '+'驳回人：'+res.data.operator+' '+"驳回理由："+res.data.overrule,
            timestamp: res.data.overruletime,
            type: 'danger',
            size: 'large',
            icon: 'el-icon-error'
          })
        }
      });
    },
    del(row) {
      if(row.status==="未审核"||row.status==="已审核"){
        this.$message.warning("已提交审核，无法删除!")
      }else{
        this.request.delete("/bonus/" + row.id).then((res) => {
          if (res.code==='200') {
            this.$message.success("删除成功");
            this.load();
          } else {
            this.$message.error("删除失败");
          }
        });
      }
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
    exceed(){
      this.$message.warning("超出文件个数")
    },
    handleEdit4(row){
      this.dialogFormVisible2=true
      this.request.get("/material/some/"+row.materialUrl).then((res) => {
        res.data.forEach(item => {
          this.materialUs = this.materialUs.concat(item.materialUrls);
        });
        console.log(this.materialUs);
      });
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
      <el-input
          style="width: 200px; margin-left: 5px"
          placeholder="请输入种类"
          suffix-icon="el-icon-message"
          v-model="type"
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
      <el-button type="primary" @click="handleAdd">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
      <el-popconfirm
          style="margin-left: 5px"
          confirm-button-text="确定"
          cancel-button-text="我再想想"
          icon="el-icon-info"
          icon-color="red"
          title="您确定批量删除吗？"
          @confirm="delBatch"
      >
        <el-button type="danger" slot="reference"
        >批量删除 <i class="el-icon-remove-outline"></i
        ></el-button>
      </el-popconfirm>

    </div>
    <el-table
        :data="tableData"
        :border="true"
        :stripe="true"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
          prop="projectName"
          label="项目名称"
          width="140"
      ></el-table-column>
      <el-table-column
          prop="projectScope"
          label="项目范围"
          width="120"
      ></el-table-column>
      <el-table-column prop="projectLevel" label="项目等级" width="100"></el-table-column>
      <el-table-column prop="projectScores" label="所加分数" width="100"></el-table-column>


      <el-table-column  label="审核进度" width="120">
        <template slot-scope="scope">
        <el-button
            type="primary"
            @click="handleEdit3(scope.row)"
            style="margin-left: 5px"
        >查看 <i class="el-icon-s-release"></i
        ></el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button
              type="info"
              @click="handleEdit(scope.row)"
              style="margin-left: 20px;width: 80px"
          >编辑 <i class="el-icon-edit"></i
          ></el-button>
          <el-button
              type="info"
              @click="handleEdit4(scope.row)"
              style="margin-left: 20px;"
          >查看佐证材料 <i class="el-icon-edit"></i
          ></el-button>
          <el-button
              type="success"
              @click="handleEdit2(scope.row)"
          >提交审核 <i class="el-icon-s-promotion"></i
          ></el-button>
          <el-popconfirm
              style="margin-left: 5px"
              confirm-button-text="确定"
              cancel-button-text="我再想想"
              icon="el-icon-info"
              icon-color="red"
              title="您确定删除吗？"
              @confirm="del(scope.row)"
          >
            <el-button type="danger" slot="reference" style="width: 95px"
            >删除<i class="el-icon-remove-outline"></i
            ></el-button>
          </el-popconfirm>
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
    <el-dialog title="审核进度" :visible.sync="dialogFormVisible1" @close="handleDialogClose">
      <div class="block">
        <el-timeline>
          <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :timestamp="activity.timestamp">
            {{activity.content}}
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>

    <el-dialog title="填写加分项目" :visible.sync="dialogFormVisible">
      <el-form label-width="80px">
        <el-upload
            class="upload-demo"
            drag
            action="http://localhost:9090/file/upload/"
            :multiple="true"
            :limit="2"
            :on-success="handleAvatarSuccess"
            :on-exceed="exceed">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-form-item label="项目名称" style="margin-top: 10px">
          <el-cascader :options="options" :show-all-levels="false" :props="{ value: 'name', label: 'name' }"  @change="handleCascaderChange"></el-cascader>
        </el-form-item>
        <el-form-item label="项目范围">
          <el-select v-model="form.projectScope" placeholder="请选择" @change="handleCascaderChange1">
            <el-option
                v-for="item in filteredScopes"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="项目等级">
          <el-select v-model="form.projectLevel" placeholder="请选择" @change="handleCascaderChange2" >
            <el-option
                v-for="item in filteredlevel"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所加分数" >
          <el-input v-model="updatedProjectScores" style="width: 100px" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="佐证材料" :visible.sync="dialogFormVisible2"  @close="handleDialogClose">
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