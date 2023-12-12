<script>
export default {
  name: "Type",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      name: "",
      form: {},
      multipleSelection: [],
      dialogFormVisible: false,
      options:[],
    };
  },
  methods: {
    load() {
      this.request
          .get("/type", {
            params: {
              name: this.name,
            },
          })
          .then((res) => {
            this.tableData = res.data
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
    reset() {
      this.name = "";
      this.load();
    },
    handleAdd() {
      this.dialogFormVisible=true
      this.form={}
    },
    handleAdd1(pid) {
      this.dialogFormVisible=true
      this.form={}
      this.request
          .get("/menu/icons")
          .then((res) => {
            this.options = res.data
          });
      if(pid){
        this.form.pid=pid
      }
    },
    handleEdit(row) {
      this.form = row;
      this.dialogFormVisible = true;
      this.request
          .get("/menu/icons")
          .then((res) => {
            this.options = res.data
          });
    },
    save() {
      this.request.post("/type", this.form).then((res) => {
        if (res.code==='200') {
          this.$message.success("保存成功");
          this.dialogFormVisible = false;
          this.load();
        } else {
          this.$message.error("保存失败");
        }
      });
    },

    del(id) {
      this.request.delete("/menu/" + id).then((res) => {
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
    delBatch() {
      let ids = this.multipleSelection.map((v) => v.id);
      this.request.post("/menu/del/batch", ids).then((res) => {
        if (res.code==='200') {
          this.$message.success("批量删除成功");
          this.load();
        } else {
          this.$message.error("批量删除失败");
        }
      });
    },
    exp() {
      window.open("http://localhost:9090/menu/export")
    },
    handelExcelImportSuccess() {
      this.$message.success("导入成功")
      this.load()

    },
  },
  created() {
    //请求分页查询数据
    this.load();
  },


};
</script>

<template>
  <div>
    <div style="padding: 10px 0">
      <el-input
          style="width: 200px"
          placeholder="请输入名称"
          suffix-icon="el-icon-search"
          v-model="name"
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
    </div>
    <el-table
        :data="tableData"
        :border="true"
        :stripe="true"
        @selection-change="handleSelectionChange"
        row-key="id"
        default-expand-all
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="项目名称" ></el-table-column>
      <el-table-column prop="scope" label="项目范围" align="center" ></el-table-column>
      <el-table-column prop="level" label="项目等级" align="center"></el-table-column>
      <el-table-column prop="scores" label="加分标准" width="55" align="center"></el-table-column>
      <el-table-column label="操作"  width="400" align="center">
        <template slot-scope="scope">
          <el-button
              type="primary"
              @click="handleAdd1(scope.row.id)"
              v-if="!scope.row.pid && !scope.row.path"
              style="margin-left: 55px"
          >新增加分项目 <i class="el-icon-plus"></i
          ></el-button>
          <el-button
              type="success"
              @click="handleEdit(scope.row)"
              style="margin-left: 10px"
          >编辑 <i class="el-icon-edit"></i
          ></el-button>
          <el-popconfirm
              style="margin-left: 5px"
              confirm-button-text="确定"
              cancel-button-text="我再想想"
              icon="el-icon-info"
              icon-color="red"
              title="您确定删除吗？"
              @confirm="del(scope.row.id)"
          >
            <el-button type="danger" slot="reference"
            >删除<i class="el-icon-remove-outline"></i
            ></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog title="类别信息" :visible.sync="dialogFormVisible">
      <el-form label-width="80px">
        <el-form-item label="项目名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目范围">
          <el-input v-model="form.scope" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目等级">
          <el-input v-model="form.level" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="加分标准">
          <el-input v-model="form.scores" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style >
.fontSize18{
  font-size: 18px;
}
.fontSize12{
  font-size: 12px;
}
</style>