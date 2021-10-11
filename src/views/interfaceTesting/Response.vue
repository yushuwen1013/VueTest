<template>
  <div style='position: relative;'>
    <h4>
      <p style="height: 10px;">Response</p>
    </h4>
    <template >
      <el-tabs style="margin-left: 10px;" v-model="activeName">
        <el-tab-pane label="Body" name="Body">
          <template>
            <el-radio-group v-model="responseDataType" @change='ResponseDataType'>
              <el-radio  :label="1">Raw</el-radio>
              <el-radio  :label="2">Json</el-radio>
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
              sort>
            </json-viewer>
          </template>
        </el-tab-pane>
        <el-tab-pane label="Headers" name="Headers">
           <json-viewer
              style="max-height:200px;overflow:auto;"
              :value="response.response_headers"
              :expand-depth="2"
              copyable
              sort>
            </json-viewer>
        </el-tab-pane>
        <el-tab-pane label="断言结果" name="assertionResults">
           <h5>断言类型：{{response.assert_result.assertion_type}}</h5>
           <h5>断言结果：{{response.assert_result.assertion_results}}</h5>
           <h5>断言内容：{{response.assert_result.assertion_content}}</h5>
        </el-tab-pane>
      </el-tabs>
      <h4 style='position: absolute;right:40px;top:25px;'>Status：{{response.response_code}}</h4>
      <h4 style='position: absolute;right:200px;top:25px;'>断言结果：{{response.assert_result.assertion_results}}</h4>
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
      responseDataType: 1,
      showResponseDataType: true,
      activeName: "Body",
      response: {
        response_code: "",
        response_data : "{}",
        response_headers : "{}",
        assert_result: {
          assertion_type: "",
          assertion_results: "",
          assertion_content: ""
        }
      }
    };
  },
  methods: {
    //切换响应数据
    ResponseDataType(val){
        if(val == 1){
            this.showResponseDataType = true
        }else{
          this.showResponseDataType = false
        }
    },
  },
  mounted() {
    this.$bus.$on("response", data => {
      console.log("Pesponse，收到了数据", data);
      this.response.response_data = JSON.stringify(data.response_data)
      this.response.response_headers = data.response_headers
      this.response.response_code = data.response_code
      if(data.assert_result != undefined){
        this.response.assert_result = data.assert_result
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