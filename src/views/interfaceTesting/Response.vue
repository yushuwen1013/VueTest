<template>
  <div style="position: relative;">
    <h4>
      <p style="height: 10px;">Response</p>
    </h4>
    <template>
      <el-tabs style="margin-left: 10px;" v-model="activeName">
        <el-tab-pane label="请求信息">
          <div>
            <span
              class="el-tag el-tag--success el-tag--small el-tag--dark"
            >{{responseData.request_method}}</span>
            <span style="font-size: 14px; margin-left: 8px;">{{responseData.request_url}}</span>
            <el-collapse style="margin-top: 10px;" v-model="activeNames" @change="handleChange">
              <el-collapse-item title="Headers" name="1">
                <json-viewer :value="responseData.request_headers" :expand-depth="2" copyable sort></json-viewer>
              </el-collapse-item>
              <el-collapse-item :title="responseData.dataState==2?'Body': 'Params'" name="2">
                <json-viewer :value="responseData.request_data" :expand-depth="2" copyable sort></json-viewer>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Body" name="Body">
          <template>
            <el-radio-group v-model="responseDataType">
              <el-radio :label="0">Raw</el-radio>
              <el-radio :label="2">Json</el-radio>
            </el-radio-group>
            <!-- <el-input
              readonly
              style="margin-top: 10px;"
              v-if="showResponseDataType"
              type="textarea"
              :rows="8"
              placeholder="响应数据"
              v-model="responseData.response_data"
            ></el-input>-->
            <!-- <json-viewer
              v-else
              style="max-height:400px;overflow:auto;"
              :value="JSON.parse(responseData.response_data)"
              :expand-depth="2"
              copyable
              sort
            ></json-viewer>-->
            <b-ace-editor
              style="top: 10px"
              :value="responseData.response_data != ''? JSON.stringify(
            JSON.parse(this.responseData.response_data),null, responseDataType): ''"
              lang="json"
              width="100%"
              height="300"
              readonly
            ></b-ace-editor>
          </template>
        </el-tab-pane>
        <el-tab-pane label="Headers" name="Headers">
          <!-- <json-viewer
            style="max-height:400px;overflow:auto;"
            :value="responseData.response_headers"
            :expand-depth="2"
            copyable
            sort
          ></json-viewer>-->
          <b-ace-editor
            :value="JSON.stringify(
            JSON.parse(this.responseData.response_headers),null, 2)"
            lang="json"
            width="100%"
            height="300"
            readonly
          ></b-ace-editor>
        </el-tab-pane>
        <el-tab-pane label="断言结果" name="assertionResults">
          <div>
            <template height="250">
              <el-table :data="responseData.assert_result" border style="width: 100%">
                <el-table-column prop="assertType" label="断言类型" width="180" align="center"></el-table-column>
                <el-table-column
                  prop="assertExtractExpression"
                  label="提取表达式"
                  width="300"
                  align="center"
                ></el-table-column>
                <el-table-column prop="resultValue" label="实际值" align="center"></el-table-column>
                <el-table-column prop="relation" label="期望关系" width="150" align="center">
                  <template slot-scope="scope">
                    <el-tag v-show="scope.row.relation" disable-transitions>{{scope.row.relation}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="expectancyValue" label="期望值"></el-table-column>
                <el-table-column prop="assertion_results" label="断言结果" width="150">
                  <template slot-scope="scope">
                    <el-tag
                      :type="scope.row.assertion_results? 'success' : 'danger'"
                      disable-transitions
                    >{{scope.row.assertion_results? "成功": "失败"}}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="参数提取结果" name="assertionResults">
          <div>
            <template height="250">
              <el-table :data="responseData.assert_result" border style="width: 100%">
                <el-table-column prop="assertType" label="断言类型" width="180" align="center"></el-table-column>
                <el-table-column
                  prop="assertExtractExpression"
                  label="提取表达式"
                  width="300"
                  align="center"
                ></el-table-column>
                <el-table-column prop="resultValue" label="实际值" align="center"></el-table-column>
                <el-table-column prop="relation" label="期望关系" width="150" align="center">
                  <template slot-scope="scope">
                    <el-tag v-show="scope.row.relation" disable-transitions>{{scope.row.relation}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="expectancyValue" label="期望值"></el-table-column>
                <el-table-column prop="assertion_results" label="断言结果" width="150">
                  <template slot-scope="scope">
                    <el-tag
                      :type="scope.row.assertion_results? 'success' : 'danger'"
                      disable-transitions
                    >{{scope.row.assertion_results? "成功": "失败"}}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </div>
        </el-tab-pane> -->
      </el-tabs>
      <h4 style="position: absolute;right:40px;top:25px;">Status：{{responseData.response_code}}</h4>
    </template>
  </div>
</template>

<script>
import JsonViewer from "vue-json-viewer";
import vueJsonEditor from "vue-json-editor";
export default {
  props: ["responseData"],
  name: "Response",
  components: {
    vueJsonEditor,
    JsonViewer
  },
  data() {
    return {
      fontSize: 12,
      modal: false,
      readonly: false,
      tableData: [
        {
          assertType: 2,
          assertExtractExpression: "code",
          assertion_results: true,
          expectancyValue: "400",
          relation: 1,
          resultValue: 400
        }
      ],
      activeNames: ["1"],
      //响应数据类型
      responseDataType: 0,
      // //显示响应数据类型
      // showResponseDataType: true,
      activeName: "Body"
    };
  },
  methods: {
    handleChange(val) {
      console.log(val);
    }
  },
  // watch: {
  //   responseDataType(newVal) {
  //     console.log(newVal, "111111111111");
  //     if (this.responseData.response_data != "") {
  //       if (newVal == 1) {
  //         this.responseData.response_data = JSON.stringify(
  //           JSON.parse(this.responseData.response_data),
  //           null,
  //           0
  //         );
  //       } else {
  //         this.responseData.response_data = JSON.stringify(
  //           JSON.parse(this.responseData.response_data),
  //           null,
  //           2
  //         );
  //       }
  //     }
  //   }
  // },
  // mounted() {
  //   if (this.responseData.response_data != "") {
  //     if (this.responseDataType == 1) {
  //       this.responseData.response_data = JSON.stringify(
  //         JSON.parse(this.responseData.response_data),
  //         null,
  //         0
  //       );
  //     } else {
  //       this.responseData.response_data = JSON.stringify(
  //         JSON.parse(this.responseData.response_data),
  //         null,
  //         2
  //       );
  //     }
  //   }
  // }
};
</script>

<style>
</style>