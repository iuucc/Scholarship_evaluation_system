<script>
export default {
  name: "role",
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
      menuDialogVis:false,
      menuData:[],
      props:{
        label:'name'
      },
      expends:[],
      checks:[],
      roleId:0,
      roleFlag:''
    };
  },
  methods: {
    load() {
      this.request
          .get("/role/page", {
            params: {
              pageNum: this.pageNum,
              pageSize: this.pageSize,
              name: this.name,
            },
          })
          .then((res) => {
            if(res.data.records!=null){
              this.tableData = res.data.records
            }
            this.total = res.data.total;
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
      this.dialogFormVisible = true;
      this.form = {};
    },
    save() {
      this.request.post("/role", this.form).then((res) => {
        if (res.code==='200') {
          this.$message.success("保存成功");
          this.dialogFormVisible = false;
          this.load();
        } else {
          this.$message.error("保存失败");
        }
      });
    },
    handleEdit(row) {
      this.form = row;
      this.dialogFormVisible = true;
    },
    del(id) {
      this.request.delete("/role/" + id).then((res) => {
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
      this.request.post("/role/del/batch", ids).then((res) => {
        if (res.code==='200') {
          this.$message.success("批量删除成功");
          this.load();
        } else {
          this.$message.error("批量删除失败");
        }
      });
    },
    exp() {
      window.open("http://localhost:9090/role/export")
    },
    handelExcelImportSuccess() {
      this.$message.success("导入成功")
      this.load()

    },
    selectMenu(role){
      this.menuDialogVis=true
      this.roleId=role.id
      this.roleFlag=role.flag
      this.request
          .get("/menu")
          .then((res) => {
            this.menuData = res.data
            this.expends= this.menuData.map(v=>v.id)
          });
      this.request
          .get("/role/roleMenu/" +this.roleId)
          .then((res) => {
            this.checks=res.data
          })
    },
    saveRoleMenu(){
      console.log(this.roleId.id)
      this.request.post("/role/roleMenu/"+this.roleId,this.$refs.tree.getCheckedKeys()).then(res => {
       if(res.code==='200'){
         this.$message.success("绑定成功")
         this.menuDialogVis=false
         if(this.roleFlag==='ROLE_admin'){
          this.$store.commit("logout")
         }
       }else {
         this.$message.error("绑定失败")
       }
      })

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
      >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="flag" label="唯一标识"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column label="操作"  width="300">
        <template slot-scope="scope">
          <el-button type="info" @click="selectMenu(scope.row)">分配菜单<i class="el-icon-menu"></i></el-button>
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
    <el-dialog title="菜单分配" :visible.sync="menuDialogVis">
      <el-tree
          :props="props"
          :data="menuData"
          :load="loadNode"
          node-key="id"
          ref="tree"
          :default-expanded-keys="expends"
          :default-checked-keys="checks"
          :check-strictly="true"
          show-checkbox
         >
        <span class="custom-tree-node" slot-scope="{ node, data }">
            <span><i :class="data.icon"></i>{{ data.name }}</span>
        </span>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="menuDialogVis = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleMenu">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="角色新增" :visible.sync="dialogFormVisible">
      <el-form label-width="60px">
        <el-form-item label="名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="唯一标识">
          <el-input v-model="form.flag" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
</style>