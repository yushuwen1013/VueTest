<template>
  <div style="background: #eaeaea; height: 100%">
    <div style="background: #fff">
      <p
        style="
          width: 1600px;
          height: 60px;
          padding-left: 31px;
          font-size: 22px;
          margin-top: 0px;
          line-height: 55px;
        "
      >
        <span style>环境配置</span>
      </p>
    </div>
    <div>
      <el-form
        :inline="true"
        class="demo-form-inline"
        style="margin-left: 35px"
      >
        <el-form-item label="环境名称">
          <el-input
            v-model="seareEnvironment_name"
            placeholder="请输入环境名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="inquire">查询</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-form-item>
        <el-button
          style="float: right; margin-bottom: 20px; margin-right: 50px"
          type="primary"
          icon="el-icon-plus"
          @click="dialogFormVisible = true"
          >添加</el-button
        >
      </el-form>
      <el-table
        height="600"
        :data="
          tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)
        "
        style="width: 100%; left: 20px"
        :header-cell-style="{ background: '#DCDFE6', color: '#303133' }"
      >
        <el-table-column
          :show-overflow-tooltip="true"
          prop="environment_name"
          label="环境名称"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="environment_url"
          label="环境地址"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="description"
          label="描述"
        ></el-table-column>
        <el-table-column width="300" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="dbConfig(scope.row)"
              >配置数据库</el-button
            >
            <el-button size="mini" @click="clickEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="deleteVariable(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页显示 -->
      <el-pagination
        style="text-align: center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
        >//这是显示总共有多少数据，</el-pagination
      >
    </div>
    <el-dialog title="环境配置" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="updateForm">
        <el-form-item label="环境名称" label-width="80px">
          <el-input
            v-model="updateForm.environment_name"
            autocomplete="off"
            placeholder="请输入环境名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="环境地址" label-width="80px">
          <el-input
            v-model="updateForm.environment_url"
            autocomplete="off"
            placeholder="请输入环境地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" label-width="80px">
          <el-input
            v-model="updateForm.description"
            autocomplete="off"
            placeholder="请输入描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addVariable">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="配置数据库" width="65%" :visible.sync="dbTableVisible">
      <el-dialog
        width="30%"
        title="添加数据库"
        :visible.sync="dbEditVisible"
        append-to-body
      >
        <el-form
          style="margin-right: 20px"
          :model="dbForm"
          :rules="rules"
          ref="dbForm"
          label-width="100px"
          class="demo-ruleForm"
          size="mini"
        >
          <el-form-item label="引用名称" prop="name">
            <el-input v-model="dbForm.name"></el-input>
          </el-form-item>
          <el-form-item label="数据库类型" prop="db_type">
            <el-select v-model="dbForm.db_type" placeholder="请选择活动区域">
              <el-option label="mysql" value="mysql"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="ip" prop="host">
            <el-input v-model="dbForm.host"></el-input>
          </el-form-item>
          <el-form-item label="端口" prop="port">
            <el-input v-model.number="dbForm.port"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="user">
            <el-input v-model="dbForm.user"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pwd">
            <el-input v-model="dbForm.pwd"></el-input>
          </el-form-item>
          <el-form-item label="数据库名" prop="db_name">
            <el-input v-model="dbForm.db_name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('dbForm')"
              >立即创建</el-button
            >
            <el-button @click="resetForm('dbForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-table :data="dbTableData" style="width: 100%">
        <el-table-column prop="name" label="引用名称"></el-table-column>
        <el-table-column prop="db_type" label="数据库类型"></el-table-column>
        <el-table-column prop="host" label="ip"></el-table-column>
        <el-table-column prop="port" label="端口" width="50"></el-table-column>
        <el-table-column prop="user" label="用户名"></el-table-column>
        <el-table-column prop="db_name" label="数据库名"></el-table-column>
        <el-table-column width="225" label="操作">
          <template slot="header">
            <el-button size="mini" type="primary" @click="addDB"
              >添加数据库</el-button
            >
          </template>
          <template slot-scope="scope">
            <el-button size="mini" @click="clickEdit(scope.row)"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" @click="deleteDB(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { update_db, get_db, delete_db } from "@/api/interfaceTesting";
import {
  update_environment_configuration,
  get_environment_configuration,
  delete_environment_configuration,
} from "@/api/interfaceTesting";
export default {
  data() {
    return {
      dbForm: {
        //添加数据库表单
        name: "",
        db_type: "mysql",
        host: "",
        port: "",
        user: "",
        pwd: "",
        db_name: "",
      },
      rules: {
        //添加数据库的校验规则
        name: [
          { required: true, message: "请输入引用名称", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        db_type: [
          { required: true, message: "请选择数据库类型", trigger: "change" },
        ],
        host: [{ required: true, message: "请输入ip", trigger: "blur" }],
        port: [{ required: true, message: "请输入端口", trigger: "blur" }],
        user: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        pwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
        db_name: [
          { required: true, message: "请数据数据库名", trigger: "blur" },
        ],
      },
      dbEditVisible: false, // 数据库编辑弹窗
      dbTableVisible: false, // 数据库表格弹窗
      dbTableData: [
        // 数据库表格的数据
        // {
        //   name: "MySQL的一个库",
        //   db_type: "mysql",
        //   host:"127.0.0.1",
        //   port:3306,
        //   user: "root",
        //   pwd: "123456",
        //   db_name: "sys"
        // }
      ],
      project_id: localStorage.getItem("project_id"), //项目id
      updateForm: {
        environment_name: "",
        environment_url: "",
        description: "",
        project_id: localStorage.getItem("project_id"),
      },
      dialogFormVisible: false, //添加或编辑弹窗
      currentPage: 1, //初始页
      pagesize: 10, //    每页的数据
      tableData: [],
      seareEnvironment_name: "", //搜索框的值
    };
  },
  methods: {
    //删除数据库
    deleteDB(row) {
      delete_db({ id: row.id })
        .then((res) => {
          this.$message.success(res.message);
          get_db({ environment_id: this.dbForm.environment_id }).then(
            (response) => {
              this.dbTableData = response.data;
            }
          );
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    //添加数据库
    addDB() {
      this.dbEditVisible = true;
    },
    //确定添加
    submitForm(formName) {
      console.log(formName);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert("submit!");
          update_db(this.dbForm)
            .then((res) => {
              this.$message.success(res.message);
              this.dbEditVisible = false;
              get_db({ environment_id: this.dbForm.environment_id }).then(
                (response) => {
                  this.dbTableData = response.data;
                }
              );
            })
            .catch((error) => {
              this.$message.error(error.message);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //重置添加数据库表单数据
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //配置数据库
    dbConfig(row) {
      this.dbForm.environment_id = row.id;
      get_db({ environment_id: row.id }).then((response) => {
        this.dbTableData = response.data;
      });
      this.dbTableVisible = true;
    },
    //初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.pagesize = size;
      console.log(this.pagesize); //每页下拉显示数据
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
      console.log(this.currentPage); //点击第几页
    },
    //删除变量
    deleteVariable(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该变量, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //删除变量接口
          const id = { id: row.id };
          delete_environment_configuration(id)
            .then((response) => {
              console.log(response.data);
              get_environment_configuration({
                project_id: this.project_id,
              }).then((response) => {
                this.tableData = response.data;
              });
            })
            .catch((error) => {
              this.$message({
                message: "删除失败",
                type: "error",
              });
              console.log(error);
            });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //点击编辑
    clickEdit(row) {
      this.dialogFormVisible = true;
      this.updateForm = {
        environment_name: row.environment_name,
        environment_url: row.environment_url,
        description: row.description,
        project_id: localStorage.getItem("project_id"),
        id: row.id,
      };
    },
    //确定添加变量
    addVariable() {
      console.log(this.updateForm);
      if (
        this.updateForm.environment_name.trim() == "" ||
        this.updateForm.environment_url.trim() == ""
      ) {
        this.$message({
          message: "名称和地址不能为空",
          type: "error",
        });
      } else {
        update_environment_configuration(this.updateForm)
          .then((response) => {
            get_environment_configuration({ project_id: this.project_id }).then(
              (response) => {
                this.tableData = response.data;
              }
            );
            this.updateForm = {
              environment_name: "",
              environment_url: "",
              description: "",
              project_id: localStorage.getItem("project_id"),
            };
            this.$message({
              message: response.data,
              type: "success",
            });
            this.dialogFormVisible = false;
          })
          .catch((error) => {
            console.log(error);
            this.$message({
              message: error.message,
              type: "error",
            });
            console.log(error);
          });
      }
    },
    //查询
    inquire() {
      const request_data = {
        environment_name: this.seareEnvironment_name,
        project_id: this.project_id,
      };
      get_environment_configuration(request_data).then((response) => {
        this.tableData = response.data;
      });
    },
    //重置
    reset() {
      get_environment_configuration({ project_id: this.project_id }).then(
        (response) => {
          this.tableData = response.data;
          this.seareEnvironment_name = "";
        }
      );
    },
  },
  created() {
    get_environment_configuration({ project_id: this.project_id }).then(
      (response) => {
        this.tableData = response.data;
      }
    );
  },
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
