<template>
  <div style="position: relative">
    <!-- <h4>
      <p style="height: 10px">Response</p>
    </h4> -->
    <template>
      <el-tabs style="margin-left: 10px" v-model="activeName">
        <el-tab-pane label="请求信息">
          <div>
            <span class="el-tag el-tag--success el-tag--small el-tag--dark">{{
              responseData.request_method
            }}</span>
            <span style="font-size: 14px; margin-left: 8px">{{
              responseData.request_url
            }}</span>
            <el-collapse
              style="margin-top: 10px"
              v-model="activeNames"
              @change="handleChange"
            >
              <el-collapse-item title="Headers" name="1">
                <json-viewer
                  :value="responseData.request_headers"
                  :expand-depth="2"
                  copyable
                  sort
                ></json-viewer>
              </el-collapse-item>
              <el-collapse-item
                :title="responseData.dataState == 2 ? 'Body' : 'Params'"
                name="2"
              >
                <json-viewer
                  :value="responseData.request_data"
                  :expand-depth="2"
                  copyable
                  sort
                ></json-viewer>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Body" name="Body">
          <template>
            <div v-if="this.responseData.response_code == 200 ? true : false">
              <el-radio-group v-model="responseDataType">
                <el-radio :label="0">Raw</el-radio>
                <el-radio :label="2">Json</el-radio>
              </el-radio-group>
              <b-ace-editor
              wrap
                style="top: 10px"
                :value="
                  responseData.response_data != ''
                    ? JSON.stringify(
                        JSON.parse(this.responseData.response_data),
                        null,
                        responseDataType
                      )
                    : ''
                "
                lang="json"
                width="100%"
                height="450px"
                readonly
              ></b-ace-editor>
            </div>
            <div v-else>
              <b-ace-editor
                wrap
                style="top: 10px"
                :value="responseData.response_data"
                lang="json"
                width="100%"
                height="450px"
                readonly
              ></b-ace-editor>
            </div>
          </template>
          
        </el-tab-pane>
        <el-tab-pane label="Headers" name="Headers">
          <b-ace-editor
            :value="
              JSON.stringify(
                JSON.parse(this.responseData.response_headers),
                null,
                2
              )
            "
            lang="json"
            width="100%"
            height="450px"
            readonly
          ></b-ace-editor>
        </el-tab-pane>
        <el-tab-pane label="断言结果" name="assertionResults">
          <div>
            <template height="250">
              <el-table
                :data="responseData.assert_result"
                border
                style="width: 100%"
              >
                <el-table-column
                  prop="assertType"
                  label="断言类型"
                  width="180"
                  :show-overflow-tooltip="true"
                  align="center"
                ></el-table-column>
                <el-table-column
                  :show-overflow-tooltip="true"
                  prop="assertExtractExpression"
                  label="提取表达式"
                  width="300"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="resultValue"
                  label="实际值"
                  align="center"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  prop="relation"
                  label="期望关系"
                  width="150"
                  :show-overflow-tooltip="true"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-tag v-show="scope.row.relation" disable-transitions>{{
                      scope.row.relation
                    }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="expectancyValue"
                  label="期望值"
                  :show-overflow-tooltip="true"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="assertion_results"
                  label="断言结果"
                  :show-overflow-tooltip="true"
                  width="150"
                >
                  <template slot-scope="scope">
                    <el-tag
                      :type="scope.row.assertion_results ? 'success' : 'danger'"
                      disable-transitions
                      >{{
                        scope.row.assertion_results ? "成功" : "失败"
                      }}</el-tag
                    >
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </div>
        </el-tab-pane>
        <!-- 参数提取 -->
        <el-tab-pane label="提取结果" name="extraction_result">
          <div>
            <template height="250">
              <el-table
                :data="responseData.extraction_result"
                border
                style="width: 100%"
              >
                <el-table-column
                  prop="extractionType"
                  label="提取类型"
                  width="180"
                  align="center"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  :show-overflow-tooltip="true"
                  prop="parameterExtractExpression"
                  label="提取表达式"
                  width="300"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="variableName"
                  label="变量名称"
                  align="center"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  prop="variableValue"
                  label="实际值"
                  align="center"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  prop="extraction_result"
                  label="提取结果"
                  align="center"
                  width="150"
                  :show-overflow-tooltip="true"
                >
                  <template slot-scope="scope">
                    <el-tag
                      :type="scope.row.extraction_result ? 'success' : 'danger'"
                      disable-transitions
                      >{{
                        scope.row.extraction_result ? "成功" : "失败"
                      }}</el-tag
                    >
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </div>
        </el-tab-pane>
      </el-tabs>
      <h4 style="position: absolute; right: 260px; top: -10px">
        Status:
        <span style="color: #67c23a">{{ responseData.response_code }}</span>
      </h4>
      <h4 style="position: absolute; right: 150px; top: -10px">
        Time:
        <span style="color: #67c23a">{{ responseData.response_time }}</span>
      </h4>
      <h4 style="position: absolute; right: 50px; top: -10px">
        Size:
        <span style="color: #67c23a">{{ responseData.response_size }}</span>
      </h4>
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
    JsonViewer,
  },
  data() {
    return {
      fontSize: 12,
      modal: false,
      readonly: false,
      activeNames: ["1"],
      //响应数据类型
      responseDataType: 2,
      // //显示响应数据类型
      // showResponseDataType: true,
      activeName: "Body",
    };
  },
  methods: {
    handleChange(val) {
      console.log(val);
    },
  },
};
</script>

<style>
</style>