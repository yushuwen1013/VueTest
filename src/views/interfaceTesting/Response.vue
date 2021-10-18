<template>
  <div style="position: relative;">
    <h4>
      <p style="height: 10px;">Response</p>
    </h4>
    <template>
      <el-tabs style="margin-left: 10px;" v-model="activeName">
        <el-tab-pane label="请求信息">
          <span
            v-show="response.request_method"
            class="el-tag el-tag--success el-tag--small el-tag--dark"
          >{{response.request_method}}</span>
          <span style="font-size: 14px; margin-left: 8px;">{{response.request_url}}</span>
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="Headers" name="1">
              <json-viewer :value="response.request_headers" :expand-depth="2" copyable sort></json-viewer>
            </el-collapse-item>
            <el-collapse-item :title="response.dataState==2?'Body': 'Params'" name="2">
              <json-viewer :value="response.request_data" :expand-depth="2" copyable sort></json-viewer>
            </el-collapse-item>
          </el-collapse>
          <br />
          <br />
        </el-tab-pane>
        <el-tab-pane label="Body" name="Body">
          <template>
            <el-radio-group v-model="responseDataType" @change="ResponseDataType">
              <el-radio :label="1">Raw</el-radio>
              <el-radio :label="2">Json</el-radio>
            </el-radio-group>
            <el-input
              readonly
              style="margin-top: 10px;"
              v-if="showResponseDataType"
              type="textarea"
              :rows="8"
              placeholder="响应数据"
              v-model="response.response_data"
            ></el-input>
            <json-viewer
              v-else
              style="max-height:200px;overflow:auto;"
              :value="JSON.parse(response.response_data)"
              :expand-depth="2"
              copyable
              sort
            ></json-viewer>
          </template>
        </el-tab-pane>
        <el-tab-pane label="Headers" name="Headers">
          <json-viewer
            style="max-height:200px;overflow:auto;"
            :value="response.response_headers"
            :expand-depth="2"
            copyable
            sort
          ></json-viewer>
        </el-tab-pane>
        <el-tab-pane label="断言结果" name="assertionResults">
          <h5>断言类型：{{response.assert_result.assertion_type}}</h5>
          <h5>断言结果：{{response.assert_result.assertion_results}}</h5>
          <h5>断言内容：{{response.assert_result.assertion_content}}</h5>
        </el-tab-pane>
      </el-tabs>
      <h4 style="position: absolute;right:40px;top:25px;">Status：{{response.response_code}}</h4>
      <h4
        style="position: absolute;right:200px;top:25px;"
      >断言结果：{{response.assert_result.assertion_results}}</h4>
    </template>
  </div>
</template>

<script>
import JsonViewer from "vue-json-viewer";
import vueJsonEditor from "vue-json-editor";
export default {
  name: "Response",
  components: {
    vueJsonEditor,
    JsonViewer
  },
  data() {
    return {
      activeNames: ['1'],
      //响应数据类型
      responseDataType: 1,
      //显示响应数据类型
      showResponseDataType: true,
      activeName: "Body",
      //响应数据
      response: {
        request_headers:"",
        request_data: "",
        request_url: "",
        request_method: "",
        response_code: "",
        response_data: "{}",
        response_headers: "{}",
        dataState: "",
        assert_result: {
          assertion_type: "",
          assertion_results: "",
          assertion_content: ""
        }
      }
    };
  },
  methods: {
    handleChange(val) {
        console.log(val);
      },
    //切换响应数据
    ResponseDataType(val) {
      if (val == 1) {
        this.showResponseDataType = true;
      } else {
        this.showResponseDataType = false;
      }
    }
  },
  mounted() {
    this.$bus.$on("response", data => {
      console.log("Pesponse，收到了数据", data);
      this.response = data
      this.response.request_headers = data.request_headers
      this.response.request_data = data.request_data;
      this.response.request_method = data.request_method;
      this.response.request_url = data.request_url;
      this.response.response_data = JSON.stringify(data.response_data);
      this.response.response_headers = data.response_headers;
      this.response.response_code = data.response_code;
      this.response.dataState = data.dataState
      if (data.assert_result != undefined) {
        this.response.assert_result = data.assert_result;
      }else{
        this.response.assert_result  =  {
          assertion_type: "",
          assertion_results: "",
          assertion_content: ""
        }
      }
    });
  },
  beforeDestroy() {
    this.$bus.$off("response");
  }
};
</script>

<style>
</style>