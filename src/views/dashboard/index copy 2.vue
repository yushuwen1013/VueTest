<template>
  <div style="background:#EAEAEA; height: 850px">
    <CaseDetails v-if="showCaseDetails" />
    <div v-else>
      <div style="background:#fff">
        <p
          style="width: 1600px;height: 60px;padding-left: 31px;font-size:22px;margin-top: 0px;line-height:55px;"
        >
          <span style>
            选择项目：
            <el-select v-model="value" placeholder="请选择项目">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </span>
          <el-button style="margin-left: 10px;" type="primary">添加模块</el-button>
          <span style="margin-left: 400px;">项目用例管理</span>
        </p>
      </div>
      <div>
        <el-container>
          <el-aside
            width="270px"
            style="background-color: #ffffff;margin-left: 20px;margin-right: 20px;height: 750px;"
          >
            <div class="custom-tree-container">
              <p style="text-align: center">模块列表</p>
              <div class="block">
                <el-tree
                  highlight-current
                  ref="dataConfigTree"
                  :data="data"
                  @node-click="getInterfaceUseCaseList"
                  node-key="id"
                  default-expand-all
                  :expand-on-click-node="false"
                >
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>
                      <i class="el-icon-folder"></i>
                      {{ node.label }}
                    </span>
                    <span>
                      <el-button type="text" size="mini" @click="() => append(data)">编辑</el-button>
                      <el-button type="text" size="mini" @click="() => remove(node, data)">删除</el-button>
                    </span>
                  </span>
                </el-tree>
              </div>
            </div>
          </el-aside>
          <el-main style="background-color: #ffffff;margin-right: 20px;">
            <div>
              <el-form :inline="true" class="demo-form-inline" style="margin-left: 35px;">
                <el-form-item label="用例名称">
                  <el-input v-model="seareFileName" placeholder="请输入文件名称"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="inquire">查询</el-button>
                  <el-button type="primary" @click="reset">重置</el-button>
                </el-form-item>
                <el-button
                  style="float: right;margin-bottom: 20px;margin-right: 50px;"
                  type="primary"
                  icon="el-icon-plus"
                  @click="add_use_case"
                >添加</el-button>
              </el-form>
              <el-table
                :header-cell-style="{background:'#DCDFE6',color:'#303133'}"
                height="600"
                @row-dblclick="showInterfaceList"
                :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                style="width: 100%;left: 20px;"
              >
                <el-table-column :show-overflow-tooltip="true" prop="use_case_name" label="用例名称"></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="create_time" label="创建时间"></el-table-column>
                <el-table-column width="350" label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini" type="primary">查看结果</el-button>
                    <el-button size="mini" type="primary">执行</el-button>
                    <el-button size="mini" @click="edit_use_case(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      @click="delete_use_case(scope.$index, scope.row)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
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
          </el-main>
        </el-container>
      </div>
    </div>
  </div>
</template>

<script>
import CaseDetails from "./CaseDetails";
import {
  update_use_case,
  delete_use_case,
  get_use_case
} from "@/api/interfaceTesting";
export default {
  components: { CaseDetails },
  data() {
    const data = [
      {
        id: 1,
        label: "WebPro",
      },
      {
        id: 2,
        label: "nansdnasndasd",
      }
    ];
    return {
      data: JSON.parse(JSON.stringify(data)),
      data: JSON.parse(JSON.stringify(data)),
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: "",
      showCaseDetails: false,
      currentPage: 1, //初始页
      pagesize: 10, //    每页的数据
      tableData: [], //用例列表
      seareFileName: ""
    };
  },
  methods: {
    getInterfaceUseCaseList(node) {
      console.log(data, "22222222222");
      this.$refs.dataConfigTree.setCurrentKey(node.id)
    },
    append(data) {
      console.log(data);
      const newChild = { id: id++, label: "testtest", children: [] };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },

    remove(node, data) {
      console.log(node, data);
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    //查询
    inquire() {
      get_file_list({ file_name: this.seareFileName })
        .then(response => {
          this.tableData = response.data;
        })
        .catch(error => {
          this.$message({
            message: "查询失败",
            type: "error"
          });
          console.log(error);
        });
    },
    //重置
    reset() {
      this.seareFileName = "";
      get_file_list().then(response => {
        this.tableData = response.data;
      });
    },
    //添加文件
    add_use_case() {
      this.$prompt("请输入用例名称", "添加", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputErrorMessage: "输入不能为空",
        inputValidator: value => {
          // 点击按钮时，对文本框里面的值进行验证
          console.log(value);
          if (!value.trim()) {
            return "输入不能为空";
          }
        }
      })
        .then(({ value }) => {
          //接口参数
          const createData = { use_case_name: value };
          //发送新增文件接口
          update_use_case(createData)
            .then(response => {
              get_use_case().then(response => {
                this.tableData = response.data;
              });
            })
            .catch(error => {
              this.$message({
                message: "新增失败",
                type: "error"
              });
              console.log(error);
            });
          this.$message({
            type: "success",
            message: "文件名称是: " + value
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    //编辑文件
    edit_use_case(index, row) {
      this.$prompt("请输入用例名", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: row.use_case_name,
        inputErrorMessage: "输入不能为空",
        inputValidator: value => {
          // 点击按钮时，对文本框里面的值进行验证
          if (!value.trim()) {
            return "输入不能为空";
          }
        }
      })
        .then(({ value }) => {
          const data = {
            use_case_name: value,
            id: row.id
          };
          update_use_case(data)
            .then(response => {
              get_use_case().then(response => {
                this.tableData = response.data;
              });
            })
            .catch(error => {
              this.$message({
                message: "修改失败",
                type: "error"
              });
              console.log(error);
            });
          this.$message({
            type: "success",
            message: "文件名称是: " + value
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    //删除用例
    delete_use_case(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该用例, 是否继续?", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //删除文件接口
          const id = { id: row.id };
          delete_use_case(id)
            .then(response => {
              console.log(response.data);
              get_use_case().then(response => {
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
    //双击进入接口列表
    showInterfaceList(row, column) {
      console.log(row, "----------", column);
      localStorage.setItem("use_case_id", row.id);
      this.showCaseDetails = true;
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function(size) {
      this.pagesize = size;
      console.log(this.pagesize); //每页下拉显示数据
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      console.log(this.currentPage); //点击第几页
    }
  },
  // 创建之前发送获取用例列表请求
  created() {
    //获取文件列表
    get_use_case()
      .then(response => {
        console.log(response.data);
        this.tableData = response.data;
      })
      .catch(error => {
        this.$message({
          message: "获取失败",
          type: "error"
        });
        console.log(error);
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

.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
background-color: rgb(209, 209, 209) !important;
}
</style>
