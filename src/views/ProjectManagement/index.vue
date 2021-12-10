<template>
  <div>
    <div v-if="showEnvironmentConfiguration">
      <EnvironmentConfiguration />
    </div>
    <div v-else style="background: #eaeaea; height: 100%">
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
          <span style>项目管理</span>
        </p>
      </div>
      <div>
        <el-form :inline="true" class="demo-form-inline" style="margin-left: 35px">
          <el-input v-model="seareProject_name" placeholder="请输入项目名称" suffix-icon="el-icon-search" style="width:250px"></el-input>
          <el-button
            style="float: right; margin-bottom: 20px; margin-right: 50px"
            type="primary"
            icon="el-icon-plus"
            @click="dialogFormVisible = true"
          >添加</el-button>
        </el-form>
        <el-table
          height="600"
          :data="
          tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)
        "
          style="width: 100%; left: 20px"
          :header-cell-style="{ background: '#DCDFE6', color: '#303133' }"
        >
          <el-table-column :show-overflow-tooltip="true" prop="project_name" label="项目名称"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="description" label="项目描述"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="update_time" label="更新时间"></el-table-column>
          <el-table-column width="350" label="操作">
            <template slot-scope="scope">
              <!-- <el-button size="mini" @click="showEnvironmentConfiguration = true">环境配置</el-button> -->
              <el-button size="mini" @click="clickEdit(scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="deleteVariable(scope.$index, scope.row)"
              >删除</el-button>
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
        >//这是显示总共有多少数据，</el-pagination>
      </div>
      <el-dialog title="项目信息" :visible.sync="dialogFormVisible" width="30%">
        <el-form :model="updateForm">
          <el-form-item label="项目名称" label-width="80px">
            <el-input v-model="updateForm.project_name" autocomplete="off" placeholder="请输入项目名称"></el-input>
          </el-form-item>
          <el-form-item label="项目描述" label-width="80px">
            <el-input v-model="updateForm.description" autocomplete="off" placeholder="请输入项目描述"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addVariable">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  updata_project,
  get_project_list,
  delete_project
} from "@/api/interfaceTesting";
import EnvironmentConfiguration from "./EnvironmentConfiguration";
export default {
  components: { EnvironmentConfiguration },
  data() {
    return {
      showEnvironmentConfiguration: false,
      updateForm: {
        project_name: "",
        update_time: "",
        description: ""
      },
      dialogFormVisible: false, //添加或编辑弹窗
      currentPage: 1, //初始页
      pagesize: 10, //    每页的数据
      tableData: [],
      seareProject_name: "" //搜索框的值
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
      this.$confirm(
        "此操作将永久删除项目及项目下的所有模块和用例, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          //删除变量接口
          const id = { id: row.id };
          delete_project(id)
            .then(response => {
              console.log(response.data);
              get_project_list().then(response => {
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
        project_name: row.project_name,
        description: row.description,
        id: row.id
      };
    },
    //确定添加变量
    addVariable() {
      console.log(this.updateForm);
      console.log(this.updateForm.project_name);
      if (this.updateForm.project_name.trim() == "") {
        this.$message({
          message: "项目名称不能为空",
          type: "error"
        });
      } else {
        updata_project(this.updateForm)
          .then(response => {
            get_project_list().then(response => {
              this.tableData = response.data;
            });
            this.updateForm = {
              project_name: "",
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
    }
  },
  created() {
    get_project_list().then(response => {
      this.tableData = response.data;
    });
  },
  watch: {
    seareProject_name(newVal) {
      const request_data = {
        project_name: this.seareProject_name
      };
      get_project_list(request_data).then(response => {
        this.tableData = response.data;
        this.currentPage = 1;
      });
    }
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
