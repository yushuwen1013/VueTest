<template>
  <div style="background:#EAEAEA; height: 850px">
    <InterfaceEdit v-if="showInterfaceEdit" :request_data="request_data" />
    <div v-else>
      <div style="background:#fff">
        <p
          style="width: 1600px;height: 60px;padding-left: 31px;font-size:22px;margin-top: 0px;line-height:55px;text-align: center;"
        >
          <el-button
            style="margin-left: 10px;float: left;margin-top: 10px;"
            type="primary"
            @click="addFile"
          >添加用例</el-button>
          <span>业务用例</span>
        </p>
      </div>
      <div>
        <el-container>
          <el-aside
            width="270px"
            style="background-color: #ffffff;margin-left: 20px;
            margin-right: 20px;height: 750px;"
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
                      {{ node.data.use_case_name }}
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
          <el-main style="background-color: #ffffff;margin-right: 20px;">
            <div>
              <div>
                <div>
                  <div style="background: #eaeaea; height: 100%">
                    <div>
                      <el-form
                        :inline="true"
                        class="demo-form-inline"
                        style="margin-left: 35px;padding-top: 15px;"
                      >
                        <el-button
                          style="float: right; margin-bottom: 20px; margin-right: 50px"
                          type="primary"
                          icon="el-icon-plus"
                          @click="addRequest"
                        >添加接口</el-button>
                        <el-button
                          style="float: right; margin-bottom: 20px; margin-right: 10px"
                          type="primary"
                          icon="el-icon-plus"
                          @click="importInterface"
                        >导入接口</el-button>
                        <el-button
                          style="float: right; margin-bottom: 20px; margin-right: 10px"
                          type="primary"
                        >查看结果</el-button>
                        <el-button
                          style="float: right; margin-bottom: 20px; margin-right: 10px"
                          type="primary"
                          @click="requestDefaultsFormVisible = true"
                        >请求默认值</el-button>
                        <el-button
                          style="float: right; margin-bottom: 20px; margin-right: 10px"
                          type="primary"
                        >执行用例</el-button>
                      </el-form>
                      <el-table
                        :data="
              tableData.slice(
                (currentPage - 1) * pagesize,currentPage * pagesize)"
                        :header-cell-style="{background:'#DCDFE6',color:'#303133'}"
                        height="600"
                        style="width: 1300px; left: 20px"
                        row-key="id"
                        align="left"
                      >
                        <el-table-column
                          :show-overflow-tooltip="true"
                          max-height="100"
                          width="60"
                          prop="serial_number"
                          label="编号"
                        ></el-table-column>
                        <el-table-column
                          :show-overflow-tooltip="true"
                          max-height="100"
                          width="150"
                          prop="request_name"
                          label="请求名称"
                        ></el-table-column>
                        <el-table-column
                          :show-overflow-tooltip="true"
                          width="150"
                          prop="method"
                          label="请求类型"
                        >
                          <template slot-scope="scope">
                            <el-tag
                              :type="scope.row.method == 'get'? 'success': ''"
                            >{{scope.row.method}}</el-tag>
                          </template>
                        </el-table-column>
                        <el-table-column
                          :show-overflow-tooltip="true"
                          prop="environment, environment_url"
                          label="请求环境"
                        >
                          <template slot-scope="scope">
                            <el-tooltip
                              class="item"
                              effect="dark"
                              :content="scope.row.environment_url"
                              placement="top-start"
                            >
                              <el-tag
                                :type="scope.row.environment_name == '没有引用环境'? 'danger': 'success'"
                              >{{scope.row.environment_name}}</el-tag>
                            </el-tooltip>
                          </template>
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="address" label="请求地址"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="headers" label="请求头部"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="data" label="请求参数"></el-table-column>
                        <el-table-column width="62" label="状态">
                          <template slot-scope="scope">
                            <el-switch
                              v-model="scope.row.isUse"
                              @change="isUse(scope.$index, scope.row)"
                              active-color="#13ce66"
                              inactive-color="#ff4949"
                            ></el-switch>
                          </template>
                        </el-table-column>
                        <el-table-column width="250" label="操作">
                          <template slot-scope="scope">
                            <el-button
                              size="mini"
                              type="primary"
                              @click="sendRequest(scope.$index, scope.row)"
                            >运行</el-button>
                            <el-button
                              size="mini"
                              @click="editInterface(scope.$index, scope.row)"
                            >编辑</el-button>
                            <el-button
                              size="mini"
                              type="danger"
                              @click="delete_interface_use_case(scope.$index, scope.row)"
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
                    <!-- 运行接口返回信息 -->
                    <el-dialog title="响应数据" :visible.sync="drawer" width="55%">
                      <Response :responseData="responseData" />
                    </el-dialog>
                    <!-- 请求默认值 -->
                    <el-dialog title="请求默认值" :visible.sync="requestDefaultsFormVisible">
                      <el-form
                        :model="requestDefaultsForm"
                        style="padding-left: 50px; padding-right: 50px"
                      >
                        <el-form-item label="请求类型">
                          <el-select
                            v-model="requestDefaultsForm.requestType"
                            placeholder="请选择请求类型"
                            style="width: 147px"
                          >
                            <el-option label="GET" value="get"></el-option>
                            <el-option label="POST" value="post"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="请求环境">
                          <el-select
                            v-model="requestDefaultsForm.environment"
                            clearable
                            placeholder="请选择环境"
                          >
                            <el-option
                              v-for="item in requestDefaultsForm.environment_options"
                              :key="item.id"
                              :label="item.environment_name"
                              :value="item.id"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="请求地址">
                          <el-input
                            v-model="requestDefaultsForm.requestAddress"
                            placeholder="请输入地址"
                            style="width: 500px"
                          ></el-input>
                        </el-form-item>
                        <el-form-item label="请求头部">
                          <el-input
                            type="textarea"
                            :rows="3"
                            placeholder="请输入请求头"
                            v-model="requestDefaultsForm.headers"
                            style="width: 500px"
                          ></el-input>
                        </el-form-item>
                        <el-form-item label="结果断言">
                          <template height="250">
                            <el-table :data="assertData" style="width: 100%">
                              <el-table-column label="断言类型" width="200" align="center">
                                <template slot-scope="scope">
                                  <el-select v-model="scope.row.assertType" placeholder="请选择断言类型">
                                    <el-option label="响应文本（正则）" :value="1"></el-option>
                                    <el-option label="响应文本（JSON）" :value="2"></el-option>
                                    <el-option label="响应状态码" :value="3"></el-option>
                                  </el-select>
                                </template>
                              </el-table-column>
                              <el-table-column label="提取表达式" align="center">
                                <template slot-scope="scope">
                                  <el-input
                                    :disabled="scope.row.assertType==3?true:false"
                                    placeholder="请输入表达式"
                                    v-model="scope.row.assertExtractExpression"
                                    clearable
                                  ></el-input>
                                </template>
                              </el-table-column>
                              <el-table-column label="期望关系" width="200" align="center">
                                <template slot-scope="scope">
                                  <el-select
                                    :disabled="scope.row.assertType == 3? true: false"
                                    v-model="scope.row.relation"
                                    placeholder="请选择断言类型"
                                  >
                                    <el-option label="包含" :value="1"></el-option>
                                    <el-option label="匹配" :value="2"></el-option>
                                  </el-select>
                                </template>
                              </el-table-column>
                              <el-table-column label="期望值" align="center">
                                <template slot-scope="scope">
                                  <el-input
                                    placeholder="请输入期望值"
                                    v-model="scope.row.expectancyValue"
                                    clearable
                                  ></el-input>
                                </template>
                              </el-table-column>
                              <slot></slot>
                              <el-table-column fixed="right" width="125" align="center">
                                <template slot="header" slot-scope="scope">
                                  <el-button
                                    @click.native.prevent="addAssert(scope.$index, assertData)"
                                    type="primary"
                                    size="medium"
                                  >添加</el-button>
                                </template>
                                <template slot-scope="scope">
                                  <el-button
                                    @click.native.prevent="deleteAssert(scope.$index, assertData)"
                                    type="text"
                                    size="medium"
                                  >移除</el-button>
                                </template>
                              </el-table-column>
                            </el-table>
                          </template>
                        </el-form-item>
                      </el-form>
                      <div slot="footer" class="dialog-footer">
                        <el-button @click="cancel">取 消</el-button>
                        <el-button
                          type="primary"
                          @click="updateRequestDefaults(requestDefaultsForm)"
                        >确 定</el-button>
                      </div>
                    </el-dialog>
                    <!-- 导入接口 -->
                    <el-dialog title="请选择接口用例" :visible.sync="importInterfaceFormVisible">
                      <el-form :model="interfaceFileForm">
                        <el-form-item label="接口文件" label-width="80px">
                          <el-select
                            filterable
                            v-model="interfaceFileForm.interfaceFile"
                            placeholder="请选择接口文件"
                          >
                            <el-option
                              v-for="item in interfaceFileForm.interfaceFileOptions"
                              :key="item.id"
                              :label="item.file_name"
                              :value="item.id"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="接口列表" label-width="80px">
                          <el-table
                            :header-cell-style="{background:'#F2F6FC',color:'#303133'}"
                            ref="multipleTable"
                            :row-key="getRowKeys"
                            @selection-change="handleSelectionChange"
                            :data="saveForm.tableData.slice((interfaceFormPage.currentPage-1)*interfaceFormPage.pagesize,interfaceFormPage.currentPage*interfaceFormPage.pagesize)"
                            style="width: 100%;height: 300px;"
                          >
                            <el-table-column
                              :reserve-selection="true"
                              prop="id"
                              type="selection"
                              width="55"
                            ></el-table-column>
                            <el-table-column
                              :show-overflow-tooltip="true"
                              max-height="100"
                              width="180"
                              prop="request_name"
                              label="请求名称"
                            ></el-table-column>
                            <el-table-column
                              :show-overflow-tooltip="true"
                              width="150"
                              prop="method"
                              label="请求类型"
                            ></el-table-column>
                            <el-table-column
                              :show-overflow-tooltip="true"
                              prop="environment, environment_url"
                              label="请求环境"
                            >
                              <template
                                slot-scope="scope"
                              >{{scope.row.environment_name}}：{{scope.row.environment_url}}</template>
                            </el-table-column>
                            <el-table-column
                              :show-overflow-tooltip="true"
                              prop="address"
                              label="请求地址"
                            ></el-table-column>
                            <el-table-column
                              :show-overflow-tooltip="true"
                              prop="headers"
                              label="请求头部"
                            ></el-table-column>
                            <el-table-column :show-overflow-tooltip="true" prop="data" label="请求参数"></el-table-column>
                          </el-table>
                          <!-- 分页显示 -->
                          <el-pagination
                            style="text-align:center"
                            @size-change="interfaceFormPageHandleSizeChange"
                            @current-change="interfaceFormPageHandleCurrentChange"
                            :current-page="interfaceFormPage.currentPage"
                            :page-sizes="[5]"
                            :page-size="interfaceFormPage.pagesize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="saveForm.tableData.length"
                          >//这是显示总共有多少数据，</el-pagination>
                        </el-form-item>
                      </el-form>
                      <div slot="footer" class="dialog-footer">
                        <el-button @click="cancelImportInterface">取 消</el-button>
                        <el-button type="primary" @click="confirmImportInterface">确 定</el-button>
                      </div>
                    </el-dialog>
                  </div>
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
import Sortable from "sortablejs";
import {
  update_interface_use_case,
  delete_interface_use_case,
  get_interface_use_case,
  get_environment_configuration,
  update_request_defaults
} from "@/api/interfaceTesting";
import {
  update_interface_use_case_serial_number,
  get_request_defaults,
  get_file_list,
  get_request_list
} from "@/api/interfaceTesting";
import JsonViewer from "vue-json-viewer";
import vueJsonEditor from "vue-json-editor";
import { request_debug } from "@/api/interfaceTesting";
import InterfaceEdit from "./interfaceEdit";
import Response from "../interfaceTesting/Response";
//__________________
import {
  update_use_case,
  delete_use_case,
  get_use_case
} from "@/api/interfaceTesting";
import { parse } from "path-to-regexp";
export default {
  components: { InterfaceEdit, Response },
  data() {
    return {
      //断言表单
      assertData: [{
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
      }],
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
      //用例id
      use_case_id: "",
      //用例名称
      use_case_name: "",
      //接口文件表单
      interfaceFileForm: {
        //接口文件
        interfaceFile: "",
        //接口文件选项
        interfaceFileOptions: []
      },
      //导入接口
      importInterfaceFormVisible: false, // 导入表单显隐
      interfaceFormPage: {
        currentPage: 1, //初始页
        pagesize: 5 //    每页的数据
      },
      currentPage: 1, //初始页
      pagesize: 10, //    每页的数据
      //保存的表单
      saveForm: {
        request_name: null,
        tableData: [],
        //所选择的文件夹
        multipleSelection: ""
      },
      //请求默认值
      requestDefaultsForm: {
        //默认请求类型
        requestType: "",
        //默认环境（域名）
        environment: "",
        //默认请求Url
        requestAddress: "",
        //环境选项
        environment_options: [],
        //默认请求头
        headers: ""
        // //响应断言规则
        // responseAssertRules: 1,
        // //响应断言的内容
        // responseAssertContent: "",
        // //Json断言表单
        // jsonAssertForm: {
        //   json_path: "",
        //   json_value: ""
        // },
        // //断言类型
        // assertType: 0 //0是不使用，1是响应断言，2是Json断言
      },
      //请求默认值显隐
      requestDefaultsFormVisible: false,
      //断言结果
      assert_result: {},
      seareRequestName: "", //搜索值
      //编辑页面使用的数据
      request_data: {},
      showInterfaceEdit: false,
      //默认展开第三个响应数据
      activeNames: ["3", "4"],
      resultInfo: {},
      drawer: false,
      tableData: [], //接口用例数据
      requestData: {},
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
    //删除断言
    deleteAssert(index, rows) {
      rows.splice(index, 1);
      this.$message({
        message: "移除成功！",
        type: "success"
      });
    },
    // 添加断言
    addAssert(index, rows) {
      this.assertData.push({
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
      });
      this.$message({
        message: "添加成功！",
        type: "success"
      });
    },
    //确定导入接口
    confirmImportInterface() {
      const use_case_id = localStorage.getItem("use_case_id");
      const request_data = {
        importInterfaceList: this.saveForm.multipleSelection,
        use_case_id: use_case_id
      };
      console.log(request_data);
      //发送保存请求
      update_interface_use_case(request_data)
        .then(response => {
          console.log(response);
          this.$bus.$emit("response", response.data);
          this.$message({
            message: "保存成功！",
            type: "success"
          });
          //获取接口用例列表
          const data = { use_case_id: use_case_id };
          get_interface_use_case(data).then(response => {
            const responseData = response.data;
            responseData.forEach((elem, index) => {
              if (elem.dataState == "2") {
                elem["data"] = elem["body"];
              } else {
                elem["data"] = elem["params"];
              }
            });
            this.tableData = responseData;
            //隐藏导入接口框
            this.importInterfaceFormVisible = false;
            //清空所选择的接口
            this.$refs.multipleTable.clearSelection();
            //恢复成第一页
            this.interfaceFormPage.currentPage = 1;
          });
        })
        .catch(error => {
          this.$message({
            message: "参数错误！",
            type: "error"
          });
          console.log(error);
        });
    },
    //取消导入接口
    cancelImportInterface() {
      //清空所选择的接口
      this.$refs.multipleTable.clearSelection();
      this.importInterfaceFormVisible = false;
    },
    //选择接口
    handleSelectionChange(val) {
      this.saveForm.multipleSelection = val;
    },
    //获取row的id
    getRowKeys(row) {
      return row.id;
    },
    //导入接口
    importInterface(form) {
      this.importInterfaceFormVisible = true;
      //获取文件列表
      get_file_list()
        .then(response => {
          this.interfaceFileForm.interfaceFile = response.data[0].id;
          this.interfaceFileForm.interfaceFileOptions = response.data;
        })
        .catch(error => {
          this.$message({
            message: "获取失败",
            type: "error"
          });
          console.log(error);
        });
      console.log(this.interfaceFileForm.interfaceFile);
    },
    //取消更新接口默认值
    cancel() {
      //获取请求默认值
      get_request_defaults({ use_case_id: this.use_case_id }).then(response => {
        this.requestDefaultsForm.requestType =
          response.data.request_defaults_method;
        this.requestDefaultsForm.headers =
          response.data.request_defaults_headers;
        this.requestDefaultsForm.environment =
          response.data.request_defaults_environment_id;
        this.requestDefaultsForm.requestAddress =
          response.data.request_defaults_address;
        const assert_details = new Function(
          "return " + response.data.request_defaults_assert_details
        )();
        //如果断言详情是null那么断言类型就设为0
        if (assert_details == null) {
          this.requestDefaultsForm.assertType = 0;
        } else {
          this.requestDefaultsForm.assertType = assert_details.assert_type;
        }
        if (assert_details.assert_type == 0) {
        } else if (assert_details.assert_type == 1) {
          this.requestDefaultsForm.responseAssertContent =
            assert_details.response_assert_content;
          this.requestDefaultsForm.responseAssertRules =
            assert_details.response_assert_rules;
        } else if (assert_details.assert_type == 2) {
          this.requestDefaultsForm.jsonAssertForm.json_path =
            assert_details.json_path;
          this.requestDefaultsForm.jsonAssertForm.json_value =
            assert_details.json_value;
        }
      });
      this.requestDefaultsFormVisible = false;
    },
    //更新接口默认值
    updateRequestDefaults(RequestDefaults) {
      //请求参数
      const request_data = {
        method: RequestDefaults.requestType,
        address: RequestDefaults.requestAddress,
        headers: RequestDefaults.headers,
        assert_details: RequestDefaults.assert_details,
        environment_id:
          RequestDefaults.environment == ""
            ? null
            : RequestDefaults.environment,
        id: this.use_case_id
      };
      //assert_details 断言详情
      var assert_details = {
        assert_type: this.requestDefaultsForm.assertType
      };
      //如果断言类型是1断言详情就写响应断言的内容，2就写Json断言的内容
      if (this.requestDefaultsForm.assertType == 1) {
        assert_details.response_assert_rules = this.requestDefaultsForm.responseAssertRules;
        assert_details.response_assert_content = this.requestDefaultsForm.responseAssertContent;
        request_data.assert_details = assert_details;
      } else if (this.requestDefaultsForm.assertType == 2) {
        assert_details.json_path = this.requestDefaultsForm.jsonAssertForm.json_path;
        assert_details.json_value = this.requestDefaultsForm.jsonAssertForm.json_value;
        request_data.assert_details = assert_details;
      }
      //如果headers是字符串再判断他是否是Json字符串
      if (typeof RequestDefaults.headers == String) {
        //如果headers是json格式就更新，否则不更新，给出提示
        if (isJSON(RequestDefaults.headers)) {
          //发送更新接口默认值的请求
          update_request_defaults(request_data)
            .then(response => {
              this.requestDefaultsFormVisible = false;
              this.$message({
                message: "更新成功",
                type: "success"
              });
            })
            .catch(error => {
              this.$message({
                message: "更新失败",
                type: "success"
              });
            });
        } else {
          this.$message({
            message: "headers必须是Json格式",
            type: "error"
          });
        }
      } else {
        //发送更新接口默认值的请求
        update_request_defaults(request_data)
          .then(response => {
            this.requestDefaultsFormVisible = false;
            this.$message({
              message: "更新成功",
              type: "success"
            });
          })
          .catch(error => {
            this.$message({
              message: "更新失败",
              type: "success"
            });
          });
      }
    },
    //判断断言类型切换断言的详情
    assert(val) {
      if (val == 0) {
        this.requestDefaultsForm.assertType = 0;
      } else if (val == 1) {
        this.requestDefaultsForm.assertType = 1;
      } else {
        this.requestDefaultsForm.assertType = 2;
      }
    },
    //是否使用
    isUse(index, row) {
      console.log(index, row);
      const request_data = {
        id: row.id,
        isUse: row.isUse
      };
      //发送更新状态的接口
      update_interface_use_case(request_data).then(response => {
        if (row.isUse == true) {
          this.$message({
            message: row.request_name + "已开启！",
            type: "success"
          });
        } else {
          this.$message({
            message: row.request_name + "已关闭！",
            type: "success"
          });
        }
      });
    },
    //添加
    addRequest() {
      this.request_data = {
        isEnvironment: true,
        address: this.requestDefaultsForm.requestAddress,
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
        environment_id: this.requestDefaultsForm.environment,
        environment_name: "",
        environment_url: "",
        headers: [
          {
            key: "Content-Type",
            value: "application/json"
          }
        ],
        use_case_id: this.use_case_id,
        method: this.requestDefaultsForm.requestType,
        params: [{}],
        request_name: "",
        body: "{}"
      };
      this.showInterfaceEdit = true;
    },
    //运行  -  发送请求
    sendRequest(index, row) {
      console.log(row);
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
        isEnvironment: row.isEnvironment
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
          this.$message({
            message: "请求成功！",
            type: "success"
          });
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
    delete_interface_use_case(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该接口用例, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delete_interface_use_case({ id: row.id }).then(response => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            // 获取用例接口列表
            get_interface_use_case({ use_case_id: this.use_case_id })
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
                this.$bus.$emit("response", {});
                console.log(error);
              });
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
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
    },
    interfaceFormPageHandleSizeChange: function(size) {
      this.interfaceFormPage.pagesize = size;
    },
    interfaceFormPageHandleCurrentChange: function(currentPage) {
      this.interfaceFormPage.currentPage = currentPage;
    },
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector(".el-table__body-wrapper tbody");
      const _this = this;
      Sortable.create(tbody, {
        draggable: ".el-table__row",
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tableData.splice(oldIndex, 1)[0];
          _this.tableData.splice(newIndex, 0, currRow);
        }
      });
    },
    //禁止默认行为
    disableDefaultBehavior() {
      // 阻止默认行为
      console.log("ssssssssss");
      document.body.ondrop = function(event) {
        event.preventDefault();
        event.stopPropagation();
      };
      this.rowDrop();
    },
    //_________________________
    //点击选中用例
    getInterfaceUseCaseList(node) {
      this.$refs.dataConfigTree.setCurrentKey(node.id);
      console.log(node);
      this.use_case_id = node.id;
    },
    //添加文件
    addFile() {
      this.$prompt("请输入用例名", "提示", {
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
          const createData = {
            use_case_name: value,
            project_id: this.project_id
          };
          //发送新增用例接口
          update_use_case(createData)
            .then(response => {
              get_use_case({ project_id: this.project_id }).then(response => {
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
        inputValue: node.data.use_case_name,
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
            id: node.data.id
          };
          update_use_case(data)
            .then(response => {
              get_use_case({ project_id: this.project_id }).then(response => {
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
          delete_use_case(id)
            .then(response => {
              console.log(response.data);
              get_use_case({ project_id: this.project_id }).then(response => {
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
          this.$refs.dataConfigTree.setCurrentKey(this.use_case_id);
        }
      }, 50);
    }
  },
  // 创建之前发送请求
  created() {
    //获取环境信息
    get_environment_configuration({ project_id: this.project_id }).then(
      response => {
        this.requestDefaultsForm.environment_options = response.data;
      }
    );
    //获取用例列表
    get_use_case({ project_id: this.project_id })
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
  },
  mounted() {
    // 阻止默认行为
    document.body.ondrop = function(event) {
      event.preventDefault();
      event.stopPropagation();
    };
    this.rowDrop();
    setTimeout(() => {
      if (this.fileData.length != 0) {
        this.$refs.dataConfigTree.setCurrentKey(this.fileData[0].id);
        console.log(this.fileData[0].id);
        this.use_case_id = this.fileData[0].id;
      }
    }, 100);
  },
  watch: {
    use_case_id(val) {
      console.log(val, "监听");
      const data = { use_case_id: this.use_case_id };
      // 获取接口用例列表
      get_interface_use_case(data)
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
      //获取请求默认值
      get_request_defaults({ use_case_id: this.use_case_id }).then(response => {
        this.use_case_name = response.data.use_case_name;
        this.requestDefaultsForm.requestType =
          response.data.request_defaults_method;
        this.requestDefaultsForm.headers =
          response.data.request_defaults_headers;
        this.requestDefaultsForm.environment =
          response.data.request_defaults_environment_id;
        this.requestDefaultsForm.requestAddress =
          response.data.request_defaults_address;
        const assert_details = new Function(
          "return " + response.data.request_defaults_assert_details
        )();
        if (assert_details == null) {
          this.requestDefaultsForm.assertType = 0;
        } else {
          this.requestDefaultsForm.assertType = assert_details.assert_type;
        }
        if (this.requestDefaultsForm.assertType == 0) {
        } else if (this.requestDefaultsForm.assertType == 1) {
          this.requestDefaultsForm.responseAssertContent =
            assert_details.response_assert_content;
          this.requestDefaultsForm.responseAssertRules =
            assert_details.response_assert_rules;
        } else if (this.requestDefaultsForm.assertType == 2) {
          this.requestDefaultsForm.jsonAssertForm.json_path =
            assert_details.json_path;
          this.requestDefaultsForm.jsonAssertForm.json_value =
            assert_details.json_value;
        }
      });
    },
    //拖拽排序后更新编号（serial_number）
    tableData: {
      handler(newValue, oldvalue) {
        const data = [];
        console.log("tableData被修改了", newValue, oldvalue, oldvalue.length);
        if (oldvalue.length != 0) {
          newValue.forEach((element, index) => {
            element.serial_number = index + 1;
            data.push({ id: element.id, serial_number: element.serial_number });
          });
          update_interface_use_case_serial_number({ serial_number: data }).then(
            response => {
              console.log(response, "update_interface_use_case_serial_number");
            }
          );
        }
      }
    },
    //导入接口的文件变更后发送请求返回对应的接口列表
    "interfaceFileForm.interfaceFile": {
      handler(newValue, oldvalue) {
        //清空所选择的接口
        this.$refs.multipleTable.clearSelection();
        //恢复成第一页
        this.interfaceFormPage.currentPage = 1;
        //请求参数
        const file_id = newValue;
        const data = { file_id: file_id };
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
            this.saveForm.tableData = responseData;
          })
          .catch(error => {
            console.log(error);
          });
      }
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

.el-tree-node {
  border: 1px solid rgb(218, 218, 218);
}

.el-tree-node__content {
  background-color: #ffffff;
  height: 50px;
}

.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: rgb(209, 209, 209) !important;
}
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
