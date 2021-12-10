<template>
  <div style="background: #eaeaea; height: 850px">
    <InterfaceEdit v-if="showInterfaceEdit" :request_data="request_data" />
    <div v-else>
      <div style="background: #fff">
        <p
          style="
            width: 1600px;
            height: 60px;
            padding-left: 31px;
            font-size: 22px;
            margin-top: 0px;
            line-height: 55px;
            text-align: center;
          "
        >
          <el-button
            style="margin-left: 10px; float: left; margin-top: 10px"
            type="primary"
            @click="addFile"
          >添加文件</el-button>
          <span>单个接口</span>
        </p>
      </div>
      <div>
        <el-container>
          <el-aside
            width="270px"
            style="
              background-color: #ffffff;
              margin-left: 10px;
              margin-right: 10px;
              height: 750px;
            "
          >
            <div class="custom-tree-container">
              <p style="text-align: center">接口文件</p>
              <div class="block">
                <el-tree
                  highlight-current
                  ref="dataConfigTree"
                  :data="fileData"
                  @node-click="getInterfaceUseCaseList"
                  node-key="id"
                  default-expand-all
                  :expand-on-click-node="false"
                >
                  <span class="custom-tree-node" slot-scope="{ node }">
                    <span class="tmp" :title="node.data.file_name">
                      <i class="el-icon-folder"></i>
                      {{ node.data.file_name }}
                    </span>
                    <span>
                      <el-button type="text" size="mini" @click="() => editFile(node)">编辑</el-button>
                      <el-button type="text" size="mini" @click="() => deleteFile(node)">删除</el-button>
                    </span>
                  </span>
                </el-tree>
              </div>
            </div>
          </el-aside>
          <el-main style="background-color: #ffffff; padding-left: 10px">
            <div>
              <div>
                <div>
                  <div>
                    <el-form
                      :inline="true"
                      class="demo-form-inline"
                      style="margin-left: 10px; padding-top: 15px"
                    >
                      <el-input
                        v-model="seareRequestName"
                        placeholder="请输入接口名称"
                        suffix-icon="el-icon-search"
                        style="width:250px"
                      ></el-input>
                      <el-button
                        style="
                          float: right;
                          margin-bottom: 20px;
                          margin-right: 50px;
                        "
                        type="primary"
                        icon="el-icon-plus"
                        size="small"
                        @click="addRequest"
                      >添加</el-button>
                    </el-form>
                    <el-table
                      :header-cell-style="{
                        background: '#DCDFE6',
                        color: '#303133',
                      }"
                      :data="
                        tableData.slice(
                          (currentPage - 1) * pagesize,
                          currentPage * pagesize
                        )
                      "
                      height="600"
                    >
                      <el-table-column
                        :show-overflow-tooltip="true"
                        max-height="100"
                        width="150"
                        prop="request_name"
                        label="请求名称"
                      ></el-table-column>
                      <el-table-column
                        :show-overflow-tooltip="true"
                        width="80"
                        prop="method"
                        label="请求类型"
                      >
                        <template slot-scope="scope">
                          <el-tag
                            :type="scope.row.method == 'get' ? 'success' : ''"
                          >{{ scope.row.method }}</el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column
                        :show-overflow-tooltip="true"
                        prop="environment, environment_url"
                        label="请求环境"
                        width="150"
                      >
                        <template slot-scope="scope">
                          <el-tooltip
                            class="item"
                            effect="dark"
                            :content="scope.row.environment_url"
                            placement="top-start"
                          >
                            <el-tag
                              :type="
                                scope.row.environment_name == '没有引用环境'
                                  ? 'danger'
                                  : 'success'
                              "
                            >{{ scope.row.environment_name }}</el-tag>
                          </el-tooltip>
                        </template>
                      </el-table-column>
                      <el-table-column :show-overflow-tooltip="true" prop="address" label="请求地址"></el-table-column>
                      <el-table-column :show-overflow-tooltip="true" prop="headers" label="请求头部"></el-table-column>
                      <el-table-column :show-overflow-tooltip="true" prop="data" label="请求参数"></el-table-column>
                      <el-table-column width="275" label="操作">
                        <template slot-scope="scope">
                          <el-button
                            size="mini"
                            type="success"
                            plain
                            @click="sendRequest(scope.$index, scope.row)"
                          >运行</el-button>
                          <el-button
                            size="mini"
                            type="primary"
                            plain
                            @click="copy(scope.$index, scope.row)"
                          >复制</el-button>
                          <el-button size="mini" @click="editInterface(scope.$index, scope.row)">编辑</el-button>
                          <el-button
                            size="mini"
                            type="danger"
                            plain
                            @click="deleteInterface(scope.$index, scope.row)"
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
                  <el-dialog title="响应数据" :visible.sync="drawer" width="55%">
                    <Response :responseData="responseData" />
                  </el-dialog>
                </div>
              </div>
            </div>
          </el-main>
        </el-container>
      </div>
    </div>
  </div>
</template>

<script>
import {
  get_request_list,
  update_request,
  delete_request
} from "@/api/interfaceTesting";
import JsonViewer from "vue-json-viewer";
import vueJsonEditor from "vue-json-editor";
import { request_debug } from "@/api/interfaceTesting";
import InterfaceEdit from "./interfaceEdit";
import Response from "../interfaceTesting/Response";
//__________________
import {
  get_file_list,
  create_file,
  delete_file
} from "@/api/interfaceTesting";
import { parse } from "path-to-regexp";
export default {
  components: { InterfaceEdit, Response },
  data() {
    return {
      //响应数据
      responseData: {
        request_headers: "",
        request_data: "",
        request_url: "",
        request_method: "",
        response_code: "",
        response_data: "",
        response_headers: "{}",
        dataState: "",
        assert_result: []
      },
      //文件id
      file_id: "",
      //断言结果
      assert_result: {},
      seareRequestName: "", //搜索值
      currentPage: 1, //初始页
      pagesize: 10, //    每页的数据
      //编辑页面使用的数据
      request_data: {
        aa: "222222"
      },
      showInterfaceEdit: false,
      //默认展开第三个响应数据
      activeNames: ["3", "4"],
      resultInfo: {},
      drawer: false,
      //接口列表
      tableData: [],
      //______________________
      //项目id
      project_id: localStorage.getItem("project_id"),
      //文件数据
      fileData: [],
      value: "",
      showCaseDetails: false,
      currentPage: 1, //初始页
      pagesize: 10, //    每页的数据
      seareFileName: ""
    };
  },
  methods: {
    //添加
    addRequest() {
      this.request_data = {
        isEnvironment: true,
        address: "",
        assert_details: [
          {
            //断言类型
            assertType: "",
            //断言提取表达式
            assertExtractExpression: "",
            //期望值
            expectancyValue: "",
            //关系
            relation: "",
            //断言提取表达式
            assertExtractExpression: ""
          }
        ],
        extraction_details: [
          {
            extractionType: "",
            parameterExtractExpression: "",
            variableName: ""
          }
        ],
        extraction_result: [],
        assert_result: [],
        dataState: "2",
        environment_id: null,
        environment_name: "",
        environment_url: "",
        headers: [
          {
            key: "Content-Type",
            value: "application/json"
          }
        ],
        request_file_id: this.file_id,
        method: "get",
        params: [{}],
        request_name: "",
        body: "{}"
      };
      this.showInterfaceEdit = true;
    },
    //运行  -  发送请求
    sendRequest(index, row) {
      console.log(row, "我是运行啊");
      const request_data = {
        environment_id: row.environment_id,
        address: row.address,
        method: row.method,
        body: new Function("return " + row.body)(),
        headers: new Function("return " + row.headers)(),
        params: new Function("return " + row.params)(),
        dataState: row.dataState,
        request_name: row.request_name,
        assert_details: new Function("return " + row.assert_details)(),
        extraction_details: new Function("return " + row.extraction_details)(),
        isEnvironment: row.isEnvironment,
        project_id: this.project_id
      };
      //发送请求，返回数据
      request_debug(request_data)
        .then(response => {
          this.responseData = response.data;
          console.log(this.responseData, "响应数据");
          if (this.responseData.assert_result) {
            this.responseData.assert_result.forEach(ele => {
              if (ele.assertType == 1) {
                ele.assertType = "响应文本(正则)";
              } else if (ele.assertType == 2) {
                ele.assertType = "响应文本(JSON)";
              } else if (ele.assertType == 3) {
                ele.assertType = "响应状态码";
              }
              if (ele.relation == 1) {
                ele.relation = "包含";
              } else if (ele.relation == 2) {
                ele.relation = "匹配";
              }
            });
          }
          this.responseData.response_data = JSON.stringify(
            this.responseData.response_data
          );
          this.responseData.response_headers = JSON.stringify(
            this.responseData.response_headers
          );
          console.log(this.responseData, "响应数据处理后的样子");
          if (this.responseData.response_code == 200) {
            this.$message({
              message: response.message,
              type: "success"
            });
          } else {
            this.$message({
              message: response.message,
              type: "error"
            });
          }
          //右侧弹窗显示信息
          this.drawer = true;
        })
        .catch(error => {
          this.$message({
            message: "请求失败！",
            type: "error"
          });
          console.log(error);
        });
    },
    //复制接口
    copy(index, row) {
      console.log(row);
      const request_data = {
        requestName: row.request_name + "_副本",
        environment_id: row.environment_id,
        address: row.address,
        method: row.method,
        body: JSON.parse(row.body),
        headers: JSON.parse(row.headers),
        params: JSON.parse(row.params),
        dataState: row.dataState,
        file_id: [row.request_file_id],
        isEnvironment: row.isEnvironment,
        assert_details: JSON.parse(row.assert_details),
        assert_result: JSON.parse(row.assert_result),
        extraction_details: JSON.parse(row.extraction_details),
        extraction_result: JSON.parse(row.extraction_result)
      };
      //发送保存请求
      update_request(request_data)
        .then(response => {
          this.$message({
            message: "复制成功!",
            type: "success"
          });
          // 切换到我的接口列表
          this.$parent.showInterfaceEdit = false;
          // 获取接口列表
          get_request_list({ file_id: this.file_id }).then(response => {
            const responseData = response.data;
            responseData.forEach((elem, index) => {
              if (elem.dataState == "2") {
                elem["data"] = elem["body"];
              } else {
                elem["data"] = elem["params"];
              }
            });
            console.log(responseData);
            this.tableData = responseData;
            this.selected();
          });
        })
        .catch(error => {
          this.$message({
            message: "复制错误",
            type: "error"
          });
          console.log(error);
        });
    },
    //编辑接口
    editInterface(index, row) {
      const headers = [];
      const params = [];
      const sHeaders = new Function("return " + row.headers)();
      const sParams = new Function("return " + row.params)();
      console.log(Object.keys(sHeaders), "Object.keys(sHeaders)");
      Object.keys(sHeaders).forEach(elem => {
        headers.push({ key: elem, value: sHeaders[elem] });
        console.log(elem, sHeaders[elem], "22222222222");
      });
      Object.keys(sParams).forEach(elem => {
        params.push({ key: elem, value: sParams[elem] });
      });
      this.request_data = {
        isEnvironment: row.isEnvironment,
        address: row.address,
        assert_details: new Function("return " + row.assert_details)(),
        assert_result: new Function("return " + row.assert_result)(),
        extraction_details: new Function("return " + row.extraction_details)(),
        extraction_result: new Function("return " + row.extraction_result)(),
        dataState: row.dataState,
        environment_id: row.environment_id,
        environment_name: row.environment_name,
        environment_url: row.environment_url,
        headers: headers,
        request_file_id: this.file_id,
        id: row.id,
        method: row.method,
        params: params,
        request_file_id: row.request_file_id,
        request_name: row.request_name,
        body: JSON.stringify(JSON.parse(row.body), null, 2)
      };
      console.log(this.request_data, "this.request_data");
      this.showInterfaceEdit = true;
    },
    //删除接口
    deleteInterface(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该接口, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delete_request({ id: row.id })
            .then(response => {
              this.$message.success(response.message);
              const data = { file_id: this.file_id };
              // 获取接口列表
              get_request_list(data).then(response => {
                const responseData = response.data;
                responseData.forEach((elem, index) => {
                  if (elem.dataState == "2") {
                    elem["data"] = elem["body"];
                  } else {
                    elem["data"] = elem["params"];
                  }
                });
                console.log(responseData);
                this.tableData = responseData;
              });
            })
            .catch(erro => {
              this.$message.error(erro.message);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //_________________________
    //点击文件
    getInterfaceUseCaseList(node) {
      this.$refs.dataConfigTree.setCurrentKey(node.id);
      console.log(node);
      this.file_id = node.id;
    },
    //添加文件
    addFile() {
      this.$prompt("请输入文件名", "提示", {
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
          const createData = { fileName: value, project_id: this.project_id };
          //发送新增文件接口
          create_file(createData)
            .then(response => {
              get_file_list({ project_id: this.project_id }).then(response => {
                this.fileData = response.data;
              });
            })
            .catch(error => {
              this.$message({
                message: "新增失败",
                type: "error"
              });
              console.log(error);
            });
          this.selected();
          console.log("ssssssss");
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
    editFile(node) {
      console.log(node, "2222222222222");
      this.$prompt("请输入文件名", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: node.data.file_name,
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
            fileName: value,
            id: node.data.id
          };
          create_file(data)
            .then(response => {
              get_file_list({ project_id: this.project_id }).then(response => {
                this.fileData = response.data;
              });
            })
            .catch(error => {
              this.$message({
                message: "修改失败",
                type: "error"
              });
              console.log(error);
            });
          this.selected();
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
    //删除文件
    deleteFile(node) {
      console.log(node);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //删除文件接口
          const id = { id: node.data.id };
          delete_file(id)
            .then(response => {
              this.$message.success(response.message);
              get_file_list({ project_id: this.project_id }).then(response => {
                this.fileData = response.data;
              });
              setTimeout(() => {
                if (this.fileData.length != 0) {
                  this.$refs.dataConfigTree.setCurrentKey(this.fileData[0].id);
                  console.log(this.fileData[0].id);
                  this.file_id = this.fileData[0].id;
                }
              }, 100);
            })
            .catch(error => {
              this.$message.error(error.message);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
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
    //选中状态
    selected() {
      setTimeout(() => {
        if (this.fileData.length != 0) {
          this.$refs.dataConfigTree.setCurrentKey(this.file_id);
        }
      }, 50);
    }
  },
  // 创建之前发送请求
  created() {
    //获取文件列表
    get_file_list({ project_id: this.project_id })
      .then(response => {
        console.log(response.data);
        this.fileData = response.data;
      })
      .catch(error => {
        this.$message({
          message: "获取失败",
          type: "error"
        });
        console.log(error);
      });
    //请求参数
    // console.log(this.$route.params, "--------------")
  },
  mounted() {
    setTimeout(() => {
      if (this.fileData.length != 0) {
        this.$refs.dataConfigTree.setCurrentKey(this.fileData[0].id);
        console.log(this.fileData[0].id);
        this.file_id = this.fileData[0].id;
      }
    }, 100);
  },
  watch: {
    seareRequestName(newVal) {
      get_request_list({
        file_id: this.file_id,
        request_name: this.seareRequestName
      }).then(response => {
        this.tableData = response.data;
        this.currentPage = 1;
      });
    },
    file_id(val) {
      console.log(val, "监听");
      const data = { file_id: this.file_id };
      // 获取接口列表
      get_request_list(data)
        .then(response => {
          const responseData = response.data;
          responseData.forEach((elem, index) => {
            if (elem.dataState == "2") {
              elem["data"] = elem["body"];
            } else {
              elem["data"] = elem["params"];
            }
          });
          console.log(responseData);
          this.tableData = responseData;
        })
        .catch(error => {
          console.log(error);
        });
    }
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

/* .el-tree-node {
  border: 1px solid rgb(218, 218, 218);
} */

.el-tree-node__content {
  background-color: #ffffff;
  height: 40px;
}

/* .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: rgb(209, 209, 209) !important;
} */
.tmp {
  white-space: nowrap; /*强制单行显示*/
  text-overflow: ellipsis; /*超出部分省略号表示*/
  overflow: hidden; /*超出部分隐藏*/
  width: 150px; /*设置显示的最大宽度*/
  display: inline-block;
}
.tmp-next {
  vertical-align: top;
}
</style>
