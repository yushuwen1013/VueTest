<template>
  <div style="background-color: #ffffff; max-height: 900px; overflow: auto">
    <el-main style="position: relative">
      <div style="background-color: #ffffff; padding-top: 20px">
        <el-form
          ref="form"
          :rules="rules"
          :model="form"
          label-width="80px"
          style="height: 400px"
        >
          <el-form-item label="请求名称">
            <el-input
              v-model="form.requestName"
              placeholder="请输入地址"
              style="width: 300px"
            ></el-input>
            <el-popover placement="right" border width="600" trigger="click">
              <!-- <el-table :data="extractParameterList" max-height="300">
                            <el-table-column
                              width="150"
                              :show-overflow-tooltip="true"
                              property="variableName"
                              label="Key"
                            ></el-table-column>
                            <el-table-column
                              property="variableValue"
                              :show-overflow-tooltip="true"
                              label="Value"
                            ></el-table-column>
                            <el-table-column width="80" label="操作">
                              <template slot-scope="scope">
                                <el-button
                                  size="mini"
                                  type="primary"
                                  plain
                                  @click="copyKey(scope.$index, scope.row)"
                                >复制</el-button>
                              </template>
                            </el-table-column>
              </el-table>-->
              <ExtractParameterList
                :extractParameterList="extractParameterList"
              />
              <!-- style="float: right; margin-bottom: 20px" -->
              <el-button
                style="margin-left: 20px"
                type="primary"
                size="small"
                slot="reference"
                >参数列表</el-button
              >
            </el-popover>
          </el-form-item>
          <!-- 请求类型和地址 -->
          <el-form-item label="请求参数">
            <el-select
              v-model="form.requestType"
              placeholder="请选择请求类型"
              style="width: 147px"
            >
              <el-option label="GET" value="get"></el-option>
              <el-option label="POST" value="post"></el-option>
            </el-select>
            <el-switch
              style="left: 50px"
              v-model="isEnvironment"
              active-text="引用环境"
            ></el-switch>
          </el-form-item>
          <el-form-item label="请求地址" prop="requestAddress">
            <el-select
              v-show="isEnvironment"
              v-model="form.environment"
              clearable
              placeholder="请选择环境"
            >
              <el-option
                v-for="item in environment_options"
                :key="item.id"
                :label="item.environment_name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-input
              v-model="form.requestAddress"
              placeholder="请输入地址"
              :style="isEnvironment ? 'width: 500px;' : 'width: 702px;'"
            ></el-input>
            <el-button
              style="margin-left: 10px"
              type="primary"
              @click="sendRequest('form')"
              >Send</el-button
            >
            <el-button type="primary" @click="sureSave(form)">保存</el-button>
            <el-button type="primary" @click="back">取消</el-button>
          </el-form-item>
          <el-tabs type="border-card" @tab-click="handleClick">
            <!-- 请求头 -->
            <el-tab-pane
              style="max-height: 260px; overflow: auto"
              label="Headers"
            >
              <Tables :TableData="headersTableData" />
            </el-tab-pane>
            <!-- 请求Params参数 -->
            <el-tab-pane
              style="max-height: 260px; overflow: auto"
              label="Params"
            >
              <Tables :TableData="paramsTableData" />
            </el-tab-pane>
            <!-- 请求Body Json参数 -->
            <el-tab-pane style="max-height: 260px; overflow: auto" label="Body">
              <b-ace-editor
                v-model="bodyData"
                lang="json"
                width="100%"
                height="250"
              ></b-ace-editor>
            </el-tab-pane>
            <!-- 断言 -->
            <el-tab-pane style="max-height: 260px; overflow: auto" label="断言">
              <template height="250">
                <el-table :data="assertData" style="width: 100%">
                  <el-table-column label="断言类型" width="200" align="center">
                    <template slot-scope="scope">
                      <el-select
                        v-model="scope.row.assertType"
                        placeholder="请选择断言类型"
                      >
                        <el-option
                          label="响应文本（正则）"
                          :value="1"
                        ></el-option>
                        <el-option
                          label="响应文本（JSON）"
                          :value="2"
                        ></el-option>
                        <el-option label="响应状态码" :value="3"></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="提取表达式" align="center">
                    <template slot-scope="scope">
                      <el-input
                        :disabled="scope.row.assertType == 3 ? true : false"
                        placeholder="请输入表达式"
                        v-model="scope.row.assertExtractExpression"
                        clearable
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="期望关系" width="200" align="center">
                    <template slot-scope="scope">
                      <el-select
                        :disabled="scope.row.assertType == 3 ? true : false"
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
                        @click.native.prevent="
                          addAssert(scope.$index, assertData)
                        "
                        type="primary"
                        size="medium"
                        >添加</el-button
                      >
                    </template>
                    <template slot-scope="scope">
                      <el-button
                        @click.native.prevent="
                          deleteAssert(scope.$index, assertData)
                        "
                        type="text"
                        size="medium"
                        >移除</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-tab-pane>
            <!-- 参数提取 -->
            <el-tab-pane
              style="max-height: 260px; overflow: auto"
              label="参数提取"
             >
              <template height="250">
                <el-table :data="extraction_details" style="width: 100%">
                  <el-table-column label="提取类型" width="300" align="center">
                    <template slot-scope="scope">
                      <el-select
                        v-model="scope.row.extractionType"
                        placeholder="请选择提取类型"
                      >
                        <el-option
                          label="响应文本（正则）"
                          :value="1"
                        ></el-option>
                        <el-option
                          label="响应文本（JSON）"
                          :value="2"
                        ></el-option>
                        <!-- <el-option label="响应状态码" :value="3"></el-option> -->
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="提取表达式" align="center">
                    <template slot-scope="scope">
                      <el-input
                        placeholder="请输入表达式"
                        v-model="scope.row.parameterExtractExpression"
                        clearable
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="变量名称" width="300" align="center">
                    <template slot-scope="scope">
                      <el-input
                        placeholder="请输入变量名称"
                        v-model="scope.row.variableName"
                        clearable
                      ></el-input>
                    </template>
                  </el-table-column>
                  <slot></slot>
                  <el-table-column fixed="right" width="125" align="center">
                    <template slot="header" slot-scope="scope">
                      <el-button
                        @click.native.prevent="
                          addParameterExtraction(
                            scope.$index,
                            extraction_details
                          )
                        "
                        type="primary"
                        size="medium"
                        >添加</el-button
                      >
                    </template>
                    <template slot-scope="scope">
                      <el-button
                        @click.native.prevent="
                          deleteParameterExtraction(
                            scope.$index,
                            extraction_details
                          )
                        "
                        type="text"
                        size="medium"
                        >移除</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-tab-pane>
          </el-tabs>
        </el-form>
        <div style="margin-top: 130px">
          <Response :responseData="responseData" />
        </div>
      </div>
    </el-main>
  </div>
</template>

<script>
import vueJsonEditor from "vue-json-editor";
import {
  request_debug,
  update_interface_use_case,
  get_interface_use_case,
  get_environment_configuration,
} from "@/api/interfaceTesting";
import {
  get_file_list,
  update_request,
  get_request_list,
} from "@/api/interfaceTesting";
import Response from "../interfaceTesting/Response";
import Tables from "../interfaceTesting/Tables";
import { createNamespacedHelpers } from "vuex";
import ExtractParameterList from "./extractParameterList";
export default {
  components: { vueJsonEditor, Response, Tables, ExtractParameterList },
  props: ["request_data", "extractParameterList"],
  data() {
    //不为空的表单校验
    const notNull = (rule, value, callback) => {
      console.log(value);
      if (!value) {
        return callback(new Error("不能为空"));
      } else {
        callback();
      }
    };
    return {
      //使用环境
      isEnvironment: this.request_data.isEnvironment,
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
      //参数提取表单
      extraction_details: this.request_data.extraction_details,
      //断言表单
      assertData: this.request_data.assert_details,
      //项目id
      project_id: localStorage.getItem("project_id"),
      //环境选项
      environment_options: [],
      //请求数据状态码 1是params,2是Json
      dataStateCode: this.request_data.dataState,
      //:rules: rules表单规则校验
      rules: {
        requestAddress: [
          { required: true, trigger: "blur", validator: notNull },
        ],
        request_name: [{ required: true, trigger: "blur", validator: notNull }],
      },
      bodyData: this.request_data.body,
      //请求头数据
      headersTableData: this.request_data.headers,
      //请求params数据
      paramsTableData: this.request_data.params,
      //请求参数form表单
      form: {
        //请求名称
        requestName: this.request_data.request_name,
        //请求类型
        requestType: this.request_data.method,
        //环境（域名）
        environment: this.request_data.environment_id,
        //请求Url
        requestAddress: this.request_data.address,
      },
      //保存
      dialogFormVisible: false, // 保存表单显隐
      currentPage: 1, //初始页
      pagesize: 5, //    每页的数据
    };
  },
  methods: {
    //返回
    back() {
      this.$parent.showInterfaceEdit = false;
      this.$parent.selected();
      if (this.request_data.id) {
        // 获取接口用例列表
        get_interface_use_case({ use_case_id: this.$parent.use_case_id })
          .then((response) => {
            console.log(response, "responseresponseresponseresponse");
            const responseData = response.data;
            responseData.forEach((elem, index) => {
              if (elem.dataState == "2") {
                elem["data"] = elem["body"];
              } else {
                elem["data"] = elem["params"];
              }
            });
            console.log(responseData);
            this.$$parent.tableData = responseData;
          })
          .catch((error) => {
            console.log(error);
          });
      }
      setTimeout(() => {
        this.$parent.disableDefaultBehavior(); //阻止默认行为
      }, 500);
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
        assertExtractExpression: "",
      });
      this.$message({
        message: "添加成功！",
        type: "success",
      });
    },
    //删除参数提取
    deleteParameterExtraction(index, rows) {
      rows.splice(index, 1);
      this.$message({
        message: "移除成功！",
        type: "success",
      });
    },
    // 添加参数提取
    addParameterExtraction(index, rows) {
      this.extraction_details.push({
        //提取类型
        extractionType: "",
        //参数提取表达式
        parameterExtractExpression: "",
        //变量名称
        variableName: "",
      });
      this.$message({
        message: "添加成功！",
        type: "success",
      });
    },
    //判断断言类型切换断言的详情
    assert(val) {
      if (val == 0) {
        this.showAssert = 0;
      } else if (val == 1) {
        this.showAssert = 1;
      } else {
        this.showAssert = 2;
      }
    },
    //获取环境名称
    get_environment_name(val) {
      console.log(val);
    },
    //获取row的id
    getRowKeys(row) {
      return row.id;
    },
    //判断请求数据的状态
    handleClick(tab, event) {
      if (tab.label == "Params") {
        this.dataStateCode = 1;
      } else if (tab.label == "Body") {
        this.dataStateCode = 2;
      }
    },
    //发送请求方法
    sendRequest(formName) {
      console.log(this.value1, "22222222222");
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const header = {};
          this.headersTableData.forEach((elem, index) => {
            if ((elem.key !== "") | (elem.value !== "")) {
              header[elem.key] = elem.value;
            }
          });
          const params = {};
          this.paramsTableData.forEach((elem, index) => {
            if ((elem.key !== "") | (elem.value !== "")) {
              params[elem.key] = elem.value;
            }
          });
          const request_data = {
            isEnvironment: this.isEnvironment,
            project_id: this.project_id,
            environment_id: this.form.environment,
            address: this.form.requestAddress,
            method: this.form.requestType,
            body: new Function("return " + this.bodyData)(),
            headers: header,
            params: params,
            dataState: this.dataStateCode,
          };
          //////////////////////////////////////
          this.assertDatas = [];
          this.assertData.forEach((ele, index) => {
            if (ele.assertType != 3) {
              if (
                ele.assertType != "" &&
                ele.relation != "" &&
                ele.expectancyValue != ""
              ) {
                this.assertDatas.push(ele);
              }
            } else {
              if (ele.assertType != "" && ele.expectancyValue != "") {
                this.assertDatas.push(ele);
              }
            }
          });
          request_data.assert_details = this.assertDatas;
          ////////////////////////////////////////////////
          this.parameterExtractionDatas = [];
          this.extraction_details.forEach((ele, index) => {
            if (
              ele.extractionType != "" &&
              ele.parameterExtractExpression != "" &&
              ele.variableName != ""
            ) {
              this.parameterExtractionDatas.push(ele);
            }
          });
          request_data.extraction_details = this.parameterExtractionDatas;
          ////////////////////////////////////////
          console.log(request_data, "请求数据");
          //发送请求，返回数据
          request_debug(request_data)
            .then((response) => {
              this.responseData = response.data;
              console.log(this.responseData, "响应数据");
              this.responseData.response_data = JSON.stringify(
                this.responseData.response_data
              );
              this.responseData.response_headers = JSON.stringify(
                this.responseData.response_headers
              );
              console.log(this.responseData, "响应数据处理后的样子");
              if(this.responseData.response_code == 200){
                this.$message({
                message: response.message,
                type: "success"
              });
              }else{
                this.$message({
                message: response.message,
                type: "error"
              });
              }
            })
            .catch((error) => {
              console.log(error);
              this.$message({
                message: error.message,
                type: "error",
              });
              this.$bus.$emit("response", {});
              console.log(error);
            });
        } else {
          return false;
        }
      });
    },
    //确定保存
    sureSave(form) {
      const use_case_id = this.$parent.use_case_id;
      if (form.requestName == "") {
        this.$message({
          message: "接口名称不能为空",
          type: "error",
        });
      } else {
        const header = {};
        this.headersTableData.forEach((elem, index) => {
          if ((elem.key !== "") | (elem.value !== "")) {
            header[elem.key] = elem.value;
          }
        });
        const params = {};
        this.paramsTableData.forEach((elem, index) => {
          if ((elem.key !== "") | (elem.value !== "")) {
            params[elem.key] = elem.value;
          }
        });
        const request_data = {
          requestName: form.requestName,
          environment_id: this.form.environment,
          address: this.form.requestAddress,
          method: this.form.requestType,
          body: new Function("return " + this.bodyData)(),
          headers: header,
          params: params,
          dataState: this.dataStateCode,
          use_case_id: use_case_id,
          project_id: this.project_id,
          isEnvironment: this.isEnvironment,
        };
        if (this.request_data.id) {
          request_data.id = this.request_data.id;
        }
        ////////////////////////////
        this.assertDatas = [];
        this.assertData.forEach((ele, index) => {
          if (ele.assertType != 3) {
            if (
              ele.assertType != "" &&
              ele.relation != "" &&
              ele.expectancyValue != ""
            ) {
              this.assertDatas.push(ele);
            }
          } else {
            if (ele.assertType != "" && ele.expectancyValue != "") {
              this.assertDatas.push(ele);
            }
          }
        });
        request_data.assert_details = this.assertDatas;
        ////////////////////////////////////////////////
        this.parameterExtractionDatas = [];
        this.extraction_details.forEach((ele, index) => {
          if (
            ele.extractionType != "" &&
            ele.parameterExtractExpression != "" &&
            ele.variableName != ""
          ) {
            this.parameterExtractionDatas.push(ele);
          }
        });
        request_data.extraction_details = this.parameterExtractionDatas;
        ////////////////////////////////////////
        console.log(request_data, "datattatatatt");
        //发送请求，返回数据
        request_debug(request_data)
          .then((response) => {
            this.responseData = response.data;
            this.responseData.response_data = JSON.stringify(
              this.responseData.response_data
            );
            console.log(this.responseData, "响应数据");
            this.responseData.response_data = JSON.stringify(
              this.responseData.response_data
            );
            this.responseData.response_headers = JSON.stringify(
              this.responseData.response_headers
            );
            request_data.extraction_result =
              this.responseData.extraction_result;
            (request_data.assert_result = this.responseData.assert_result),
              //发送保存用例请求
              update_interface_use_case(request_data)
                .then((response) => {
                  this.$message({
                    message: "保存成功！",
                    type: "success",
                  });
                  // 切换到我的接口列表
                  this.$parent.showInterfaceEdit = false;
                  setTimeout(() => {
                    this.$parent.disableDefaultBehavior(); //阻止默认行为
                  }, 500);
                  // 获取接口列表
                  get_interface_use_case({
                    use_case_id: this.$parent.use_case_id,
                  })
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
                      this.$parent.tableData = responseData;
                      this.$parent.selected();
                    })
                    .catch((error) => {
                      this.$bus.$emit("response", {});
                      console.log(error);
                    });
                })
                .catch((error) => {
                  this.$message({
                    message: "保存参数错误",
                    type: "error",
                  });
                  console.log(error);
                });
          })
          .catch((error) => {
            this.$message({
              message: "请求错误,请运行成功后保存",
              type: "error",
            });
            this.$bus.$emit("response", {});
            console.log(error);
          });
      }
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.pagesize = size;
      console.log(this.pagesize); //每页下拉显示数据
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
      console.log(this.currentPage); //点击第几页
    },
  },
  created() {
    get_environment_configuration({ project_id: this.project_id }).then(
      (response) => {
        this.environment_options = response.data;
      }
    );
  },
};
</script>

<style>
/* jsoneditor右上角默认有一个链接,加css去掉了 */
.jsoneditor-poweredBy {
  display: none;
}
</style>