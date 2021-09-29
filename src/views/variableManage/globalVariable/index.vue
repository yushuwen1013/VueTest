<template>
  <div style="background:#EAEAEA; height: 100%">
    <div style="background:#fff">
      <p
        style="width: 1600px;height: 60px;padding-left: 31px;font-size:22px;margin-top: 0px;line-height:55px;"
      >
        <span style>全局变量</span>
      </p>
    </div>
    <div>
      <el-form :inline="true" class="demo-form-inline" style="margin-left: 35px;">
        <el-form-item label="变量名称">
          <el-input v-model="seareVariableKey" placeholder="请输入变量名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="inquire">查询</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-form-item>
        <el-button
          style="float: right;margin-bottom: 20px;margin-right: 50px;"
          type="primary"
          icon="el-icon-plus"
          @click="dialogFormVisible = true"
        >添加</el-button>
      </el-form>
      <el-table
        height="600"
        :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        style="width: 100%;left: 20px;"
      >
        <el-table-column :show-overflow-tooltip="true" prop="key" label="变量名(Key)"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="value" label="变量值(Value)"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="description" label="备注 -- 使用方法：${key}"></el-table-column>
        <el-table-column width="225" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="clickEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteVariable(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页显示 -->
      <el-pagination
        style="text-align:center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
      >//这是显示总共有多少数据，</el-pagination>
    </div>
    <el-dialog title="变量" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="updateForm">
        <el-form-item label="变量名" label-width="80px">
          <el-input v-model="updateForm.key" autocomplete="off" placeholder="请输入变量名"></el-input>
        </el-form-item>
        <el-form-item label="变量值" label-width="80px">
          <el-input v-model="updateForm.value" autocomplete="off" placeholder="请输入变量值"></el-input>
        </el-form-item>
        <el-form-item label="描述" label-width="80px">
          <el-input v-model="updateForm.description" autocomplete="off" placeholder="请输入描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addVariable">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  update_global_variable,
  get_global_variable,
  delete_global_variable
} from "@/api/interfaceTesting";
import Tables from "@/views/interfaceTesting/Tables";
export default {
  components: { Tables },
  data() {
    return {
      updateForm: {
        key: "",
        value: "",
        description: ""
      },
      dialogFormVisible: false, //添加或编辑弹窗
      currentPage: 1, //初始页
      pagesize: 10, //    每页的数据
      tableData: [],
      seareVariableKey: "" //搜索框的值
    };
  },
  methods: {
    //初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function(size) {
      this.pagesize = size;
      console.log(this.pagesize); //每页下拉显示数据
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      console.log(this.currentPage); //点击第几页
    },
    //删除变量
    deleteVariable(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该变量, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //删除变量接口
          const id = { id: row.id };
          delete_global_variable(id)
            .then(response => {
              console.log(response.data);
              get_global_variable().then(response => {
                this.tableData = response.data;
              });
            })
            .catch(error => {
              this.$message({
                message: "删除失败",
                type: "error"
              });
              console.log(error);
            });
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //点击编辑
    clickEdit(row) {
      this.dialogFormVisible = true;
      this.updateForm = {
        key: row.key,
        value: row.value,
        description: row.description,
        id: row.id
      };
    },
    //确定添加变量
    addVariable() {
      console.log(this.updateForm);
      if (
        this.updateForm.key.trim() == "" ||
        this.updateForm.value.trim() == ""
      ) {
        this.$message({
          message: "key和value不能为空",
          type: "error"
        });
      } else {
        update_global_variable(this.updateForm)
          .then(response => {
            get_global_variable().then(response => {
              this.tableData = response.data;
            });
            this.updateForm = {
              key: "",
              value: "",
              description: ""
            };
            this.$message({
              message: response.data,
              type: "success"
            });
            this.dialogFormVisible = false;
          })
          .catch(error => {
            console.log(error);
            this.$message({
              message: error.message,
              type: "error"
            });
            console.log(error);
          });
      }
    },
    //查询
    inquire() {
      const request_data = {
        variable_key: this.seareVariableKey
      };
      get_global_variable(request_data).then(response => {
        this.tableData = response.data;
      });
    },
    //重置
    reset() {
      get_global_variable().then(response => {
        this.tableData = response.data;
        this.seareVariableKey = "";
      });
    }
  },
  created() {
    get_global_variable().then(response => {
      this.tableData = response.data;
    });
  }
};
</script>

<style>
.el-tooltip__popper {
  max-width: 20%;
}
.el-tooltip__popper,
.el-tooltip__popper.is-dark {
  background: rgb(48, 65, 86) !important;
  color: #fff !important;
  line-height: 24px;
}
.app-main[data-v-078753dd] {
  background: rgb(234, 234, 234);
  height: 100%;
}
</style>
