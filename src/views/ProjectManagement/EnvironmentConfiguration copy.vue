<template>
  <div style="background:#EAEAEA; height: 850px">
    <div>
      <div style="background:#fff">
        <p
          style="width: 1600px;height: 60px;padding-left: 31px;font-size:22px;margin-top: 0px;line-height:55px;"
        >
          <el-button @click="back" style="margin-left: 10px;" type="primary">返回</el-button>
          <el-button
            style="margin-left: 30px;"
            type="primary"
            @click="environmentFormVisible = true"
          >添加环境</el-button>
          <span style="margin-left: 400px;">环境配置</span>
        </p>
      </div>
      <div>
        <el-container>
          <el-aside
            width="270px"
            style="background-color: #ffffff;margin-left: 20px;margin-right: 20px;height: 750px;"
          >
            <div class="custom-tree-container">
              <p style="text-align: center">环境列表</p>
              <div class="block">
                <el-tree
                  highlight-current
                  ref="dataConfigTree"
                  :data="environmentData"
                  @node-click="getInterfaceUseCaseList"
                  node-key="id"
                  default-expand-all
                  :expand-on-click-node="false"
                >
                  <span class="custom-tree-node" slot-scope="{ node }">
                    <span>
                      <i class="el-icon-folder"></i>
                      {{ node.data.environment_name }}
                    </span>
                    <span>
                      <el-button type="text" size="mini" @click="editEnvironment(node)">编辑</el-button>
                      <el-button type="text" size="mini" @click="() => remove(node)">删除</el-button>
                    </span>
                  </span>
                </el-tree>
              </div>
            </div>
          </el-aside>
          <el-main style="background-color: #ffffff;margin-right: 20px;">
            <div style="background:#EAEAEA; height: 100%">
              <div style="background:#fff">
                <div style="height: 50px;">
                  <span>环境域名：</span>
                  <el-input
                    placeholder="请输入环境域名"
                    v-model="domain"
                    class="input-with-select"
                    style="width: 432px;"
                  ></el-input>
                </div>
              </div>
              <div>
                <el-form
                  :inline="true"
                  class="demo-form-inline"
                  style="margin-left: 35px;margin-top: 20px;"
                >
                  <el-form-item label="环境变量名称">
                    <el-input v-model="seareVariableKey" placeholder="请输入环境变量名称"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="inquire">查询</el-button>
                    <el-button type="primary" @click="reset">重置</el-button>
                  </el-form-item>
                  <el-button
                    style="float: right;margin-bottom: 20px;margin-right: 50px;"
                    type="primary"
                    icon="el-icon-plus"
                    @click="variableFormVisible = true"
                  >添加</el-button>
                </el-form>
                <el-table
                  height="600"
                  :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                  style="left: 20px;width: 1300px;"
                  :header-cell-style="{background:'#DCDFE6',color:'#303133'}"
                >
                  <el-table-column :show-overflow-tooltip="true" prop="key" label="变量名(Key)"></el-table-column>
                  <el-table-column :show-overflow-tooltip="true" prop="value" label="变量值(Value)"></el-table-column>
                  <el-table-column
                    :show-overflow-tooltip="true"
                    prop="description"
                    label="备注 -- 使用方法：${key}"
                  ></el-table-column>
                  <el-table-column width="225" label="操作">
                    <template slot-scope="scope">
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
              <el-dialog title="变量" :visible.sync="variableFormVisible" width="30%">
                <el-form :model="updateForm">
                  <el-form-item label="变量名" label-width="80px">
                    <el-input v-model="updateForm.key" autocomplete="off" placeholder="请输入变量名"></el-input>
                  </el-form-item>
                  <el-form-item label="变量值" label-width="80px">
                    <el-input v-model="updateForm.value" autocomplete="off" placeholder="请输入变量值"></el-input>
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
                  <el-button @click="variableFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="addVariable">确 定</el-button>
                </div>
              </el-dialog>
              <el-dialog title="环境配置" :visible.sync="environmentFormVisible" width="30%">
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
                      placeholder="请输入环境域名"
                    ></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="environmentFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="updateEnvironment">确 定</el-button>
                </div>
              </el-dialog>
            </div>
          </el-main>
        </el-container>
      </div>
    </div>
  </div>
</template>

<script>
import {
  update_global_variable,
  get_global_variable,
  delete_global_variable
} from "@/api/interfaceTesting";
import {
  update_environment_configuration,
  get_environment_configuration,
  delete_environment_configuration
} from "@/api/interfaceTesting";
export default {
  data() {
    const data = [
      {
        id: 1,
        label: "WebPro"
      },
      {
        id: 2,
        label: "nansdnasndasd"
      }
    ];
    return {
      //域名
      domain: "",
      formLabelAlign: {
        name: "",
        region: "",
        type: ""
      },
      updateForm: {
        // key: "",
        // value: "",
        // description: ""
      },
      environmentFormVisible: false, //环境添加或编辑弹窗
      variableFormVisible: false, //变量添加或编辑弹窗
      currentPage: 1, //初始页
      pagesize: 10, //    每页的数据
      tableData: [], //变量表格数据
      environmentData: [], //环境数据
      seareVariableKey: "", //搜索框的值
      data: JSON.parse(JSON.stringify(data)),
      data: JSON.parse(JSON.stringify(data))
    };
  },
  methods: {
    //点击编辑环境
    editEnvironment(node) {
      this.environmentFormVisible = true;
      this.updateForm = {
        environment_name: node.data.environment_name,
        environment_url: node.data.environment_url,
        id: node.data.id
      };
    },
    //添加环境
    updateEnvironment() {
      console.log(this.updateForm);
      if (
        this.updateForm.environment_name.trim() == "" ||
        this.updateForm.environment_url.trim() == ""
      ) {
        this.$message({
          message: "名称和地址不能为空",
          type: "error"
        });
      } else {
        update_environment_configuration(this.updateForm)
          .then(response => {
            get_environment_configuration().then(response => {
              this.tableData = response.data;
            });
            this.updateForm = {
              environment_name: "",
              environment_url: "",
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
    //编辑环境名称
    editenvironment(node) {
      this.environmentFormVisible = true;
    },
    //返回项目列表
    back() {
      this.$parent.showEnvironmentConfiguration = false;
    },
    getInterfaceUseCaseList(data) {
      console.log(data);
      this.domain = data.environment_url;
    },
    // append(data) {
    //   console.log(data);
    //   const newChild = { id: id++, label: "testtest", children: [] };
    //   if (!data.children) {
    //     this.$set(data, "children", []);
    //   }
    //   data.children.push(newChild);
    // },
    // remove(node, data) {
    //   console.log(node, data);
    //   const parent = node.parent;
    //   const children = parent.data.children || parent.data;
    //   const index = children.findIndex(d => d.id === data.id);
    //   children.splice(index, 1);
    // },
    remove(node, data) {
      console.log(node, data);
      // const parent = node.parent;
      // const children = parent.data.children || parent.data;
      // const index = children.findIndex(d => d.id === data.id);
      // children.splice(index, 1);
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
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
      this.variableFormVisible = true;
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
            this.variableFormVisible = false;
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
    // 获取环境变量的请求
    get_global_variable().then(response => {
      this.tableData = response.data;
    });
    //获取环境配置
    get_environment_configuration().then(response => {
      this.environmentData = response.data;
    });
  }
};
</script>

<style lang="css">
.el-tooltip__popper {
  max-width: 20%;
}
.el-tooltip__popper,
.el-tooltip__popper.is-dark {
  background: rgb(48, 65, 86) !important;
  color: #fff !important;
  line-height: 24px;
}
.el-table__header {
  height: 60px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.el-tree-node {
  border: 1px solid rgb(218, 218, 218);
}

.el-tree-node__content {
  background-color: #ffffff;
  height: 60px;
}

.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: rgb(209, 209, 209) !important;
}
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
