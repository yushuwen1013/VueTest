<template>
  <div style="width: 100%;left: 35px; margin-left: 35px;overflow-y:auto;height: 800px">
    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      label-width="80px"
      style="height: 400px;margin-top: 50px;"
    >
      <!-- 请求类型和地址 -->
      <el-form-item label="接口名称" prop="request_name">
        <el-input v-model="form.request_name" placeholder="请输入请求地址" style="width: 500px;"></el-input>
      </el-form-item>
      <el-form-item label="请求类型">
        <el-select v-model="form.requestType" placeholder="请选择请求类型" style="width: 147px;">
          <el-option label="GET" value="get"></el-option>
          <el-option label="POST" value="post"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请求地址" prop="requestAddress">
        <el-select v-model="form.environment.environment_id" clearable placeholder="请选择环境">
          <el-option
            v-for="item in environment_options"
            :key="item.id"
            :label="item.environment_name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-input v-model="form.requestAddress" placeholder="请输入请求地址" style="width: 500px;"></el-input>
        <el-button style="margin-left: 10px" type="primary" @click="sendRequest('form')">Send</el-button>
      </el-form-item>
      <el-tabs type="border-card" style="height: 400px; overflow: auto;" @tab-click="handleClick">
        <!-- 请求头 -->
        <el-tab-pane label="Headers">
          <Tables :TableData="headersTableData" />
        </el-tab-pane>
        <!-- 请求Params参数 -->
        <el-tab-pane label="Params" name="Params">
          <Tables :TableData="paramsTableData" />
        </el-tab-pane>
        <!-- 请求Body Json参数 -->
        <el-tab-pane label="Body" name="Body">
          <vue-json-editor v-model="bodyData" :showBtns="false" :mode="'code'" lang="zh" />
        </el-tab-pane>
        <!-- 断言 -->
        <el-tab-pane label="断言">
          <template>
            <el-radio-group v-model="assertType" @change="assert">
              <el-radio :label="0" border>关闭</el-radio>
              <el-radio :label="1" border>响应断言</el-radio>
              <el-radio :label="2" border>Json断言</el-radio>
            </el-radio-group>
            <div v-if="showAssert == 0"></div>
            <div v-if="showAssert == 1" style="margin-top: 20px;margin-left: 10px;">
              <template>
                <el-radio v-model="responseAssertRules" :label="1">包含</el-radio>
                <el-radio v-model="responseAssertRules" :label="2">匹配</el-radio>
              </template>
              <el-input
                style="margin-top: 20px;"
                type="textarea"
                :rows="5"
                placeholder="请输如响应断言内容"
                v-model="responseAssertContent"
              ></el-input>
            </div>
            <div v-if="showAssert == 2" style="margin-top: 20px;margin-left: 10px;">
              <el-form label-position="top" label-width="80px" :model="jsonAssertForm">
                <el-form-item label="Json路径">
                  <el-input v-model="jsonAssertForm.json_path"></el-input>
                </el-form-item>
                <el-form-item label="预期值">
                  <el-input v-model="jsonAssertForm.json_value"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
      <div style="margin-top: 35px;margin-left: 35px;">
        <el-button type="primary" @click="Save">保 存</el-button>
        <el-button @click="back" style="margin-left: 35px;">取 消</el-button>
      </div>
    </el-form>
    <el-drawer title="接口信息" :visible.sync="drawer">
      <span class="span">接口名称：{{form.request_name}}</span>
      <br />
      <br />
      <span class="span">请求类型：{{resultInfo.request_method}}</span>
      <br />
      <br />
      <span class="span">请求地址：{{resultInfo.request_url}}</span>
      <br />
      <br />
      <el-collapse v-model="activeNames">
        <el-collapse-item title="请求头" name="1">
          <json-viewer :value="resultInfo.request_headers" :expand-depth="2" copyable sort></json-viewer>
        </el-collapse-item>
        <el-collapse-item title="请求参数" name="2">
          <json-viewer :value="resultInfo.request_data" :expand-depth="2" copyable sort></json-viewer>
        </el-collapse-item>
        <el-collapse-item title="断言结果" name="3" v-show="assert_result">
          <h5>断言类型：{{assert_result.assertion_type}}</h5>
          <h5>断言结果：{{assert_result.assertion_results}}</h5>
          <h5>断言内容：{{assert_result.assertion_content}}</h5>
        </el-collapse-item>
        <el-collapse-item title="响应数据" name="4">
          <json-viewer :value="resultInfo.response_data" :expand-depth="2" copyable sort></json-viewer>
        </el-collapse-item>
      </el-collapse>
    </el-drawer>
  </div>
</template>

<script>
import vueJsonEditor from "vue-json-editor";
import {
  request_debug,
  update_interface_use_case,
  get_interface_use_case,
  get_environment_configuration
} from "@/api/interfaceTesting";
import JsonViewer from "vue-json-viewer";
import Response from "@/views/interfaceTesting/Response";
import Tables from "@/views/interfaceTesting/Tables";
export default {
  name: "interfaceUseCaseEdit",
  components: { vueJsonEditor, Tables, JsonViewer },
  props: ["request_data"],
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
      //断言结果
      assert_result: this.request_data.assert_result,
      //Json断言表单
      jsonAssertForm: {
        json_path: this.request_data.assert_details.json_path,
        json_value: this.request_data.assert_details.json_value
      },
      //根据断言类型显示断言内容
      showAssert: this.request_data.assert_details.assert_type,
      //响应断言规则
      responseAssertRules: this.request_data.assert_details
        .response_assert_rules,
      //响应断言的内容
      responseAssertContent: this.request_data.assert_details
        .response_assert_content,
      //断言类型
      assertType: this.request_data.assert_details.assert_type, //0是不使用，1是响应断言，2是Json断言
      //环境选项
      environment_options: [],
      requestData: {},
      //运行默认展开第三个响应数据
      activeNames: ["3", "4"],
      //响应数据
      resultInfo: {},
      //运行结果展示
      drawer: false,
      //请求数据状态码 1是params,2是Json
      dataStateCode: this.request_data.dataState,
      //:rules: rules表单规则校验
      rules: {
        requestAddress: [
          { required: true, trigger: "blur", validator: notNull }
        ],
        request_name: [{ required: true, trigger: "blur", validator: notNull }]
      },
      bodyData: this.request_data.body,
      //请求头数据
      headersTableData: this.request_data.headers,
      //请求params数据
      paramsTableData: this.request_data.params,
      form: {
        //请求类型
        requestType: this.request_data.method,
        //环境
        environment: {
          environment_id: this.request_data.environment_id,
          environment_name: this.request_data.environment_name
        },
        //请求Url
        requestAddress: this.request_data.address,
        //请求名称
        request_name: this.request_data.requestName
      }
    };
  },
  methods: {
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
    //返回
    back() {
      this.$parent.showInterfaceEdit = false;
      setTimeout(() => {
        this.$parent.disableDefaultBehavior(); //阻止默认行为
      }, 500);
    },
    //获取row的id
    getRowKeys(row) {
      return row.id;
    },
    //判断请求数据的状态
    handleClick(tab, event) {
      if (tab.name == "Params") {
        this.dataStateCode = 1;
      } else if (tab.name == "Body") {
        this.dataStateCode = 2;
      }
    },
    //发送请求方法
    sendRequest(formName) {
      this.$refs[formName].validate(valid => {
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
          const assert = {
            assert_type: this.assertType
          };
          if (assert.assert_type == 1) {
            assert.response_assert_rules = this.responseAssertRules;
            assert.response_assert_content = this.responseAssertContent;
          } else if (assert.assert_type == 2) {
            assert.json_path = this.jsonAssertForm.json_path;
            assert.json_value = this.jsonAssertForm.json_value;
          }
          console.log(assert);
          const request_data = {
            environment_id: this.form.environment.environment_id,
            address: this.form.requestAddress,
            method: this.form.requestType,
            body: this.bodyData,
            headers: header,
            params: params,
            dataState: this.dataStateCode,
            assert: assert
          };
          this.requestData = request_data;
          console.log(request_data, "++++++++++++++++++++");
          //发送请求，返回数据
          request_debug(request_data)
            .then(response => {
              console.log(response.data.data);
              this.resultInfo = response.data;
              this.assert_result = response.data.assert_result;
              console.log(response.data.assert_result, "22222222222222222");
              if (this.assert_result == undefined) {
                this.assert_result = false;
              }
              this.$message({
                message: "请求成功！",
                type: "success"
              });
              //显示右侧弹窗
              this.drawer = true;
            })
            .catch(error => {
              this.$message({
                message: "参数错误！",
                type: "error"
              });
              this.$bus.$emit("response", {});
              console.log(error);
            });
        } else {
          return false;
        }
      });
    },
    //保存
    Save() {
      const use_case_id = localStorage.getItem("use_case_id");
      console.log(this.request_data);
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
        environment_id: this.form.environment.environment_id,
        address: this.form.requestAddress,
        method: this.form.requestType,
        body: this.bodyData,
        headers: header,
        params: params,
        dataState: this.dataStateCode,
        requestName: this.form.request_name
      };
      if (this.request_data.id != undefined) {
        request_data.id = this.request_data.id;
      }
      request_data.use_case_id = use_case_id;
      var assert_details = {
        assert_type: this.assertType
      };
      if (this.assert_result == undefined) {
        this.assert_result = {};
      }
      if (this.assertType == 1) {
        assert_details.response_assert_rules = this.responseAssertRules;
        assert_details.response_assert_content = this.responseAssertContent;
        request_data.assert_details = assert_details;
        request_data.assert_result = this.assert_result;
      } else if (this.assertType == 2) {
        assert_details.json_path = this.jsonAssertForm.json_path;
        assert_details.json_value = this.jsonAssertForm.json_value;
        request_data.assert_details = assert_details;
        request_data.assert_result = this.assert_result;
      }
      console.log(request_data, "+++++++++++++++++++++");
      //发送请求
      request_debug(request_data)
        .then(response => {
          console.log(response.data.data);
          this.resultInfo = response.data;
          //发送保存请求
          update_interface_use_case(request_data)
            .then(response => {
              console.log(response);
              this.$bus.$emit("response", response.data);
              this.$message({
                message: "保存成功！",
                type: "success"
              });
              //返回后阻止默认行为
              setTimeout(() => {
                this.$parent.disableDefaultBehavior(); //阻止默认行为
              }, 500);
              //切换回接口列表页面
              this.$parent.showInterfaceEdit = false;
              //获取接口列表
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
                this.$parent.tableData = responseData;
              });
            })
            .catch(error => {
              this.$message({
                message: "参数错误！",
                type: "error"
              });
              console.log(error);
            });
        })
        .catch(error => {
          this.$message({
            message: "请求错误,请运行成功后保存",
            type: "error"
          });
          this.$bus.$emit("response", {});
          console.log(error);
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
    handleSelectionChange(val) {
      console.log(val);
      this.saveForm.multipleSelection = val;
    }
  },
  created() {
    get_environment_configuration().then(response => {
      this.environment_options = response.data;
    });
  }
};
</script>

<style>
/* jsoneditor右上角默认有一个链接,加css去掉了 */
.jsoneditor-poweredBy {
  display: none;
}
</style>