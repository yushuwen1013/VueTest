<template>
  <div style="background: #eaeaea; height: 850px">
    <InterfaceEdit v-if="showInterfaceEdit" :request_data="request_data" :extractParameterList='extractParameterList'/>
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
            >添加用例</el-button
          >
          <span>业务用例</span>
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
              <p style="text-align: center">用例列表</p>
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
                      <el-button
                        type="text"
                        size="mini"
                        @click="() => editFile(node)"
                        >编辑</el-button
                      >
                      <el-button
                        type="text"
                        size="mini"
                        @click="() => deleteFile(node)"
                        >删除</el-button
                      >
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
                    <div>
                      <el-form
                        :inline="true"
                        class="demo-form-inline"
                        style="margin-left: 10px; padding-top: 15px"
                      >
                      <el-button
                          style="
                            float: left;
                            margin-bottom: 20px;
                          "
                          type="primary"
                          size="small"
                          @click="extractParameterListVisible = true"
                          >参数列表</el-button
                        >
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
                          >添加</el-button
                        >
                        
                        <el-button
                          style="
                            float: right;
                            margin-bottom: 20px;
                            margin-right: 10px;
                          "
                          type="primary"
                          icon="el-icon-plus"
                          size="small"
                          @click="importInterface"
                          >导入我的接口</el-button
                        >
                        <el-button
                          style="
                            float: right;
                            margin-bottom: 20px;
                            margin-right: 10px;
                          "
                          type="primary"
                          size="small"
                          @click="openRequestDefaults"
                          >请求默认值</el-button
                        >
                        <el-button
                          style="
                            float: right;
                            margin-bottom: 20px;
                            margin-right: 10px;
                          "
                          type="primary"
                          size="small"
                          >查看结果</el-button
                        >
                        <el-button
                          style="
                            float: right;
                            margin-bottom: 20px;
                            margin-right: 10px;
                          "
                          type="primary"
                          size="small"
                          @click="debuggingUseCases()"
                          >调试</el-button
                        >
                        <!-- <el-popover placement="right" border width="600" trigger="click">
                        
                          <ExtractParameterList :extractParameterList='extractParameterList'/>
                          <el-button
                            style="float: left; margin-bottom: 20px;"
                            type="primary"
                            size="small"
                            slot="reference"
                          >参数提取列表</el-button>
                        </el-popover> -->
                      </el-form>
                      <el-table
                        :data="
                          tableData.slice(
                            (currentPage - 1) * pagesize,
                            currentPage * pagesize
                          )
                        "
                        :header-cell-style="{
                          background: '#DCDFE6',
                          color: '#303133',
                        }"
                        height="600"
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
                          width="80"
                          prop="method"
                          label="请求类型"
                        >
                          <template slot-scope="scope">
                            <el-tag
                              :type="scope.row.method == 'get' ? 'success' : ''"
                              >{{ scope.row.method }}</el-tag
                            >
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
                                >{{ scope.row.environment_name }}</el-tag
                              >
                            </el-tooltip>
                          </template>
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
                        <el-table-column
                          :show-overflow-tooltip="true"
                          prop="data"
                          label="请求参数"
                        ></el-table-column>
                        <el-table-column width="62" label="状态">
                          <template slot-scope="scope">
                            <!-- <el-switch
                              v-model="scope.row.isUse"
                              @change="isUse(scope.$index, scope.row)"
                              active-color="#13ce66"
                              inactive-color="#ff4949"
                            ></el-switch>-->
                            <el-switch
                              v-model="scope.row.isUse"
                              @change="isUse(scope.$index, scope.row)"
                            ></el-switch>
                          </template>
                        </el-table-column>
                        <el-table-column width="275" label="操作">
                          <template slot-scope="scope">
                            <el-button
                              size="mini"
                              type="success"
                              plain
                              @click="sendRequest(scope.$index, scope.row)"
                              >运行</el-button
                            >
                            <el-button
                              size="mini"
                              type="primary"
                              plain
                              @click="copy(scope.$index, scope.row)"
                              >复制</el-button
                            >
                            <el-button
                              size="mini"
                              @click="editInterface(scope.$index, scope.row)"
                              >编辑</el-button
                            >
                            <el-button
                              size="mini"
                              type="danger"
                              plain
                              @click="
                                delete_interface_use_case(
                                  scope.$index,
                                  scope.row
                                )
                              "
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
                    <!-- 运行接口返回信息 -->
                    <el-dialog
                      title="响应数据"
                      :visible.sync="drawer"
                      width="55%"
                    >
                      <Response :responseData="responseData" />
                    </el-dialog>
                    <!-- 请求默认值 -->
                    <el-dialog
                      title="请求默认值"
                      :visible.sync="requestDefaultsFormVisible"
                    >
                      <el-form
                        :model="requestDefaultsForm"
                        style="padding-left: 20px; padding-right: 50px"
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
                          <div style="height: 200px; overflow-y: auto">
                            <template>
                              <el-table
                                :data="requestDefaultsForm.assertData"
                                style="width: 100%"
                              >
                                <el-table-column
                                  label="断言类型"
                                  width="150"
                                  align="center"
                                >
                                  <template slot-scope="scope">
                                    <el-select
                                      v-model="scope.row.assertType"
                                      placeholder="断言类型"
                                    >
                                      <el-option
                                        label="响应文本（正则）"
                                        :value="1"
                                      ></el-option>
                                      <el-option
                                        label="响应文本（JSON）"
                                        :value="2"
                                      ></el-option>
                                      <el-option
                                        label="响应状态码"
                                        :value="3"
                                      ></el-option>
                                    </el-select>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  label="提取表达式"
                                  width="200"
                                  align="center"
                                >
                                  <template slot-scope="scope">
                                    <el-input
                                      :disabled="
                                        scope.row.assertType == 3 ? true : false
                                      "
                                      placeholder="表达式"
                                      v-model="
                                        scope.row.assertExtractExpression
                                      "
                                      clearable
                                    ></el-input>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  label="期望关系"
                                  width="150"
                                  align="center"
                                >
                                  <template slot-scope="scope">
                                    <el-select
                                      :disabled="
                                        scope.row.assertType == 3 ? true : false
                                      "
                                      v-model="scope.row.relation"
                                      placeholder="期望关系"
                                    >
                                      <el-option
                                        label="包含"
                                        :value="1"
                                      ></el-option>
                                      <el-option
                                        label="匹配"
                                        :value="2"
                                      ></el-option>
                                    </el-select>
                                  </template>
                                </el-table-column>
                                <el-table-column
                                  label="期望值"
                                  width="155"
                                  align="center"
                                >
                                  <template slot-scope="scope">
                                    <el-input
                                      placeholder="期望值"
                                      v-model="scope.row.expectancyValue"
                                      clearable
                                    ></el-input>
                                  </template>
                                </el-table-column>
                                <slot></slot>
                                <el-table-column fixed="right" align="center">
                                  <template slot="header" slot-scope="scope">
                                    <el-button
                                      @click.native.prevent="
                                        addAssert(
                                          scope.$index,
                                          requestDefaultsForm.assertData
                                        )
                                      "
                                      type="primary"
                                      size="mini"
                                      >添加</el-button
                                    >
                                  </template>
                                  <template slot-scope="scope">
                                    <el-button
                                      @click.native.prevent="
                                        deleteAssert(
                                          scope.$index,
                                          requestDefaultsForm.assertData
                                        )
                                      "
                                      type="text"
                                      size="mini"
                                      >移除</el-button
                                    >
                                  </template>
                                </el-table-column>
                              </el-table>
                            </template>
                          </div>
                        </el-form-item>
                      </el-form>
                      <div slot="footer" class="dialog-footer">
                        <el-button @click="cancel">取 消</el-button>
                        <el-button
                          type="primary"
                          @click="updateRequestDefaults(requestDefaultsForm)"
                          >确 定</el-button
                        >
                      </div>
                    </el-dialog>
                    <!-- 导入接口 -->
                    <el-dialog
                      title="请选择接口用例"
                      :visible.sync="importInterfaceFormVisible"
                    >
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
                            :header-cell-style="{
                              background: '#F2F6FC',
                              color: '#303133',
                            }"
                            ref="multipleTable"
                            :row-key="getRowKeys"
                            @selection-change="handleSelectionChange"
                            :data="
                              saveForm.tableData.slice(
                                (interfaceFormPage.currentPage - 1) *
                                  interfaceFormPage.pagesize,
                                interfaceFormPage.currentPage *
                                  interfaceFormPage.pagesize
                              )
                            "
                            style="width: 100%; height: 300px"
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
                              prop="request_name"
                              label="请求名称"
                            ></el-table-column>
                            <el-table-column
                              :show-overflow-tooltip="true"
                              prop="method"
                              label="请求类型"
                            >
                              <template slot-scope="scope">
                                <el-tag
                                  :type="
                                    scope.row.method == 'get' ? 'success' : ''
                                  "
                                  >{{ scope.row.method }}</el-tag
                                >
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
                                    :type="
                                      scope.row.environment_name ==
                                      '没有引用环境'
                                        ? 'danger'
                                        : 'success'
                                    "
                                    >{{ scope.row.environment_name }}</el-tag
                                  >
                                </el-tooltip>
                              </template>
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
                            <el-table-column
                              :show-overflow-tooltip="true"
                              prop="data"
                              label="请求参数"
                            ></el-table-column>
                          </el-table>
                          <!-- 分页显示 -->
                          <el-pagination
                            style="text-align: center"
                            @size-change="interfaceFormPageHandleSizeChange"
                            @current-change="
                              interfaceFormPageHandleCurrentChange
                            "
                            :current-page="interfaceFormPage.currentPage"
                            :page-sizes="[5]"
                            :page-size="interfaceFormPage.pagesize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="saveForm.tableData.length"
                            >//这是显示总共有多少数据，</el-pagination
                          >
                        </el-form-item>
                      </el-form>
                      <div slot="footer" class="dialog-footer">
                        <el-button @click="cancelImportInterface"
                          >取 消</el-button
                        >
                        <el-button
                          type="primary"
                          @click="confirmImportInterface"
                          >确 定</el-button
                        >
                      </div>
                    </el-dialog>
                    <!-- 调试界面 -->
                    <el-drawer
                      title="调试结果"
                      :visible.sync="debuggingDrawer"
                      size="85%"
                    >
                      <div style="background: #eaeaea">
                        <el-card
                          class="box-card"
                          style="width: 25%; margin-left: 10px; height: 820px"
                        >
                          <div slot="header" class="clearfix">
                            <span>用例信息</span>
                          </div>
                          <el-descriptions :column="1" border>
                            <el-descriptions-item
                              :contentStyle="{ 'text-align': 'center' }"
                              label="用例名称"
                              >登录</el-descriptions-item
                            >
                            <el-descriptions-item
                              :contentStyle="{ 'text-align': 'center' }"
                              label="接口数量"
                              >10</el-descriptions-item
                            >
                            <el-descriptions-item
                              :contentStyle="{ 'text-align': 'center' }"
                              label="调试时间"
                              >10</el-descriptions-item
                            >
                            <el-descriptions-item
                              :contentStyle="{ 'text-align': 'center' }"
                              label="耗时"
                              >10</el-descriptions-item
                            >
                            <el-descriptions-item
                              label="联系地址"
                              :contentStyle="{ 'text-align': 'center' }"
                              >江苏省苏州市吴中区吴中大道 1188
                              号</el-descriptions-item
                            >
                          </el-descriptions>
                          <el-divider content-position="left"
                            >接口执行顺序</el-divider
                          >
                          <el-tree
                            height="30px"
                            highlight-current
                            ref="dataConfigTree"
                            :data="fileData"
                            @node-click="getInterfaceUseCaseList"
                            node-key="id"
                            default-expand-all
                            :expand-on-click-node="false"
                          >
                            <span
                              class="custom-tree-node"
                              slot-scope="{ node }"
                            >
                              <span class="tmp" :title="node.data.file_name">
                                <i class="el-icon-folder"></i>
                                {{ node.data.use_case_name }}
                              </span>
                              <span>
                                <el-tag type="success">成功</el-tag>
                              </span>
                            </span>
                          </el-tree>
                        </el-card>
                      </div>
                    </el-drawer>
                    <!-- 提取的参数 -->
                    <el-dialog
                      title="参数信息"
                      width="40%"
                      :visible.sync="extractParameterListVisible"
                    >
                      <ExtractParameterList
                        :extractParameterList="extractParameterList"
                      />
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
  update_request_defaults,
} from "@/api/interfaceTesting";
import {
  update_interface_use_case_serial_number,
  get_request_defaults,
  get_file_list,
  get_request_list,
} from "@/api/interfaceTesting";
import { request_debug } from "@/api/interfaceTesting";
import InterfaceEdit from "./interfaceEdit";
import Response from "../interfaceTesting/Response";
//__________________
import {
  update_use_case,
  delete_use_case,
  get_use_case,
  debugging_use_cases,
  get_extract_parameter,
} from "@/api/interfaceTesting";
import { parse } from "path-to-regexp";
import ExtractParameterList from "./extractParameterList";
export default {
  components: { InterfaceEdit, Response, ExtractParameterList },
  data() {
    return {
      //参数列表显影
      extractParameterListVisible: false,
      //提取参数列表
      extractParameterList: [],
      //调试弹窗显隐
      debuggingDrawer: false,
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
        assert_result: [],
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
        interfaceFileOptions: [],
      },
      //导入接口
      importInterfaceFormVisible: false, // 导入表单显隐
      interfaceFormPage: {
        currentPage: 1, //初始页
        pagesize: 5, //    每页的数据
      },
      currentPage: 1, //初始页
      pagesize: 20, //    每页的数据
      //保存的表单
      saveForm: {
        request_name: null,
        tableData: [],
        //所选择的文件夹
        multipleSelection: "",
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
        headers: "",
        //断言表单
        assertData: [
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
            assertExtractExpression: "",
          },
        ],
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
      seareFileName: "",
    };
  },
  methods: {
    //复制Key
    copyKey(index, rows) {
      let data = rows.variableName;
      let oInput = document.createElement("input");
      oInput.value = data;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象;
      console.log(oInput.value);
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message({
        message: "已成功复制Key到剪切板",
        type: "success",
      });
      oInput.remove();
    },
    //调试用例
    debuggingUseCases() {
      if (this.use_case_id != "") {
        // debugging_use_cases({
        //   use_case_id: this.use_case_id,
        //   project_id: this.project_id
        // }).then(response => {
        //   console.log(response);
        // });
        this.debuggingDrawer = true;
      } else {
        this.$message({
          message: "请先选择用例",
          type: "error",
        });
      }
    },
    //删除断言
    deleteAssert(index, rows) {
      rows.splice(index, 1);
      this.$message({
        message: "移除成功！",
        type: "success",
      });
    },
    // 添加断言
    addAssert(index, rows) {
      this.requestDefaultsForm.assertData.push({
        //断言类型
        assertType: "",
        //断言提取表达式
        assertExtractExpression: "",
        //期望值
        expectancyValue: "",
        //关系
        relation: "",
        //断言提取表达式
        assertExtractExpression: "",
      });
      this.$message({
        message: "添加成功！",
        type: "success",
      });
    },
    //确定导入接口
    confirmImportInterface() {
      const request_data = {
        importInterfaceList: this.saveForm.multipleSelection,
        use_case_id: this.use_case_id,
      };
      console.log(request_data);
      //发送保存请求
      update_interface_use_case(request_data)
        .then((response) => {
          console.log(response);
          this.$bus.$emit("response", response.data);
          this.$message({
            message: "保存成功！",
            type: "success",
          });
          //获取接口用例列表
          const data = { use_case_id: this.use_case_id };
          get_interface_use_case(data).then((response) => {
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
        .catch((error) => {
          this.$message({
            message: "参数错误！",
            type: "error",
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
      if (this.use_case_id != "") {
        this.importInterfaceFormVisible = true;
        //获取文件列表
        get_file_list({ project_id: this.project_id })
          .then((response) => {
            this.interfaceFileForm.interfaceFile = response.data[0].id;
            this.interfaceFileForm.interfaceFileOptions = response.data;
          })
          .catch((error) => {
            this.$message({
              message: "获取失败",
              type: "error",
            });
            console.log(error);
          });
        console.log(this.interfaceFileForm.interfaceFile);
      } else {
        this.$message({
          message: "请选择用例后在添加",
          type: "error",
        });
      }
    },
    //取消更新接口默认值
    cancel() {
      //获取请求默认值
      get_request_defaults({ use_case_id: this.use_case_id }).then(
        (response) => {
          this.requestDefaultsForm.requestType =
            response.data.request_defaults_method;
          this.requestDefaultsForm.headers =
            response.data.request_defaults_headers;
          this.requestDefaultsForm.environment =
            response.data.request_defaults_environment_id;
          this.requestDefaultsForm.requestAddress =
            response.data.request_defaults_address;
          this.requestDefaultsForm.assertData = new Function(
            "return " + response.data.request_defaults_assert_details
          )();
          if (this.requestDefaultsForm.assertData == null) {
            this.requestDefaultsForm.assertData = [
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
                assertExtractExpression: "",
              },
            ];
          }
        }
      );
      this.requestDefaultsFormVisible = false;
    },
    //打开请求默认值
    openRequestDefaults() {
      if (this.use_case_id == "") {
        this.$message({
          message: "请先选择用例，然后在配置默认值",
          type: "error",
        });
      } else {
        this.requestDefaultsFormVisible = true;
      }
    },
    //更新接口默认值
    updateRequestDefaults(RequestDefaults) {
      //请求参数
      const request_data = {
        method: RequestDefaults.requestType,
        address: RequestDefaults.requestAddress,
        headers: RequestDefaults.headers,
        assert_details: RequestDefaults.assertData,
        environment_id:
          RequestDefaults.environment == ""
            ? null
            : RequestDefaults.environment,
        id: this.use_case_id,
      };
      //如果headers是字符串再判断他是否是Json字符串
      if (typeof RequestDefaults.headers == String) {
        //如果headers是json格式就更新，否则不更新，给出提示
        if (isJSON(RequestDefaults.headers)) {
          //发送更新接口默认值的请求
          update_request_defaults(request_data)
            .then((response) => {
              this.requestDefaultsFormVisible = false;
              this.$message({
                message: "更新成功",
                type: "success",
              });
            })
            .catch((error) => {
              this.$message({
                message: "更新失败",
                type: "success",
              });
            });
        } else {
          this.$message({
            message: "headers必须是Json格式",
            type: "error",
          });
        }
      } else {
        //发送更新接口默认值的请求
        update_request_defaults(request_data)
          .then((response) => {
            this.requestDefaultsFormVisible = false;
            this.$message({
              message: "更新成功",
              type: "success",
            });
          })
          .catch((error) => {
            this.$message({
              message: "更新失败",
              type: "success",
            });
          });
      }
    },
    //是否使用
    isUse(index, row) {
      console.log(index, row);
      const request_data = {
        id: row.id,
        isUse: row.isUse,
      };
      //发送更新状态的接口
      update_interface_use_case(request_data).then((response) => {
        if (row.isUse == true) {
          this.$message({
            message: row.request_name + "已开启！",
            type: "success",
          });
        } else {
          this.$message({
            message: row.request_name + "已关闭！",
            type: "success",
          });
        }
      });
    },
    //添加
    addRequest() {
      if (this.use_case_id != "") {
        //把headers参数json字符串转换为对象
        const headers = [];
        //把headers对象转换成key:value数组
        const sHeaders = new Function(
          "return " + this.requestDefaultsForm.headers
        )();
        if (sHeaders != null) {
          Object.keys(sHeaders).forEach((elem) => {
            headers.push({ key: elem, value: sHeaders[elem] });
          });
        }
        this.request_data = {
          isEnvironment: true,
          address: this.requestDefaultsForm.requestAddress,
          assert_details: this.requestDefaultsForm.assertData,
          extraction_details: [
            {
              extractionType: "",
              parameterExtractExpression: "",
              variableName: "",
            },
          ],
          extraction_result: [],
          assert_result: [],
          dataState: "2",
          environment_id: this.requestDefaultsForm.environment,
          environment_name: "",
          environment_url: "",
          headers,
          use_case_id: this.use_case_id,
          method: this.requestDefaultsForm.requestType,
          params: [{}],
          request_name: "",
          body: "{}",
        };
        this.showInterfaceEdit = true;
      } else {
        this.$message({
          message: "请选择用例后在添加",
          type: "error",
        });
      }
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
        isEnvironment: row.isEnvironment,
        project_id: this.project_id,
      };
      //发送请求，返回数据
      request_debug(request_data)
        .then((response) => {
          this.responseData = response.data;
          console.log(this.responseData, "响应数据");
          if (this.responseData.assert_result) {
            this.responseData.assert_result.forEach((ele) => {
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
            type: "success",
          });
          //右侧弹窗显示信息
          this.drawer = true;
        })
        .catch((error) => {
          this.$message({
            message: "请求失败！",
            type: "error",
          });
          console.log(error);
        });
    },
    //复制接口
    copy(index, row) {
      console.log(row);
      const request_data = {
        importInterfaceList: [row],
        use_case_id: this.use_case_id,
      };
      request_data.importInterfaceList[0].request_name =
        request_data.importInterfaceList[0].request_name + "_副本";
      console.log(request_data);
      //发送保存请求
      update_interface_use_case(request_data)
        .then((response) => {
          console.log(response);
          this.$bus.$emit("response", response.data);
          this.$message({
            message: "复制成功",
            type: "success",
          });
          //获取接口用例列表
          get_interface_use_case({ use_case_id: this.use_case_id }).then(
            (response) => {
              const responseData = response.data;
              responseData.forEach((elem, index) => {
                if (elem.dataState == "2") {
                  elem["data"] = elem["body"];
                } else {
                  elem["data"] = elem["params"];
                }
              });
              this.tableData = responseData;
            }
          );
        })
        .catch((error) => {
          this.$message({
            message: "参数错误！",
            type: "error",
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
      Object.keys(sHeaders).forEach((elem) => {
        headers.push({ key: elem, value: sHeaders[elem] });
        console.log(elem, sHeaders[elem], "22222222222");
      });
      Object.keys(sParams).forEach((elem) => {
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
        body: JSON.stringify(JSON.parse(row.body), null, 2),
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
        type: "warning",
      })
        .then(() => {
          delete_interface_use_case({ id: row.id }).then((response) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 获取用例接口列表
            get_interface_use_case({ use_case_id: this.use_case_id })
              .then((response) => {
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
              .catch((error) => {
                this.$bus.$emit("response", {});
                console.log(error);
              });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.pagesize = size;
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
    },
    interfaceFormPageHandleSizeChange: function (size) {
      this.interfaceFormPage.pagesize = size;
    },
    interfaceFormPageHandleCurrentChange: function (currentPage) {
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
        },
      });
    },
    //禁止默认行为
    disableDefaultBehavior() {
      // 阻止默认行为
      console.log("ssssssssss");
      document.body.ondrop = function (event) {
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
        inputValidator: (value) => {
          // 点击按钮时，对文本框里面的值进行验证
          console.log(value);
          if (!value.trim()) {
            return "输入不能为空";
          }
        },
      })
        .then(({ value }) => {
          //接口参数
          const createData = {
            use_case_name: value,
            project_id: this.project_id,
          };
          //发送新增用例接口
          update_use_case(createData)
            .then((response) => {
              get_use_case({ project_id: this.project_id }).then((response) => {
                this.fileData = response.data;
              });
            })
            .catch((error) => {
              this.$message({
                message: "新增失败",
                type: "error",
              });
              console.log(error);
            });
          this.selected();
          console.log("ssssssss");
          this.$message({
            type: "success",
            message: "文件名称是: " + value,
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
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
        inputValidator: (value) => {
          // 点击按钮时，对文本框里面的值进行验证
          if (!value.trim()) {
            return "输入不能为空";
          }
        },
      })
        .then(({ value }) => {
          const data = {
            use_case_name: value,
            id: node.data.id,
          };
          update_use_case(data)
            .then((response) => {
              get_use_case({ project_id: this.project_id }).then((response) => {
                this.fileData = response.data;
              });
            })
            .catch((error) => {
              this.$message({
                message: "修改失败",
                type: "error",
              });
              console.log(error);
            });
          this.selected();
          this.$message({
            type: "success",
            message: "文件名称是: " + value,
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    //删除文件
    deleteFile(node) {
      console.log(node);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //删除文件接口
          const id = { id: node.data.id };
          delete_use_case(id)
            .then((response) => {
              console.log(response.data);
              get_use_case({ project_id: this.project_id }).then((response) => {
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
    //选中状态
    selected() {
      setTimeout(() => {
        if (this.fileData.length != 0) {
          this.$refs.dataConfigTree.setCurrentKey(this.use_case_id);
        }
      }, 50);
    },
  },
  // 创建之前发送请求
  created() {
    //获取已提取的参数
    get_extract_parameter({ project_id: this.project_id }).then((response) => {
      this.extractParameterList = response.data;
    });
    //获取环境信息
    get_environment_configuration({ project_id: this.project_id }).then(
      (response) => {
        this.requestDefaultsForm.environment_options = response.data;
      }
    );
    //获取用例列表
    get_use_case({ project_id: this.project_id })
      .then((response) => {
        console.log(response.data);
        this.fileData = response.data;
      })
      .catch((error) => {
        this.$message({
          message: "获取失败",
          type: "error",
        });
        console.log(error);
      });
  },
  mounted() {
    // 阻止默认行为
    document.body.ondrop = function (event) {
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
        .then((response) => {
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
        .catch((error) => {
          console.log(error);
        });
      //获取请求默认值
      get_request_defaults({ use_case_id: this.use_case_id }).then(
        (response) => {
          this.use_case_name = response.data.use_case_name;
          this.requestDefaultsForm.requestType =
            response.data.request_defaults_method;
          this.requestDefaultsForm.headers =
            response.data.request_defaults_headers;
          this.requestDefaultsForm.environment =
            response.data.request_defaults_environment_id;
          this.requestDefaultsForm.requestAddress =
            response.data.request_defaults_address;
          this.requestDefaultsForm.assertData = new Function(
            "return " + response.data.request_defaults_assert_details
          )();
          if (this.requestDefaultsForm.assertData == null) {
            this.requestDefaultsForm.assertData = [
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
                assertExtractExpression: "",
              },
            ];
          }
        }
      );
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
            (response) => {
              console.log(response, "update_interface_use_case_serial_number");
            }
          );
        }
      },
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
          .then((response) => {
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
          .catch((error) => {
            console.log(error);
          });
      },
    },
  },
};
</script>

<style lang="scss">
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
  height: 40px;
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
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
