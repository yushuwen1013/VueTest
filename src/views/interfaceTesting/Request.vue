<template>
  <div>
    <el-form ref="form" :rules="rules" :model="form" label-width="80px" style="height: 400px">
      <!-- 请求类型和地址 -->
      <el-form-item label="请求参数">
        <el-select v-model="form.requestType" placeholder="请选择请求类型" style="width: 147px;">
          <el-option label="GET" value="get"></el-option>
          <el-option label="POST" value="post"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请求地址" prop="requestAddress">
        <el-select v-model="form.environment" clearable placeholder="请选择环境">
          <el-option
            v-for="item in environment_options"
            :key="item.id"
            :label="item.environment_name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-input v-model="form.requestAddress" placeholder="请输入地址" style="width: 500px;"></el-input>
        <el-button style="margin-left: 10px" type="primary" @click="sendRequest('form')">Send</el-button>
        <el-button type="primary" @click="save(form)">Save</el-button>
      </el-form-item>
      <el-tabs type="border-card" @tab-click="handleClick">
        <!-- 请求头 -->
        <el-tab-pane style="max-height: 260px; overflow: auto;" label="Headers">
          <Tables :TableData="headersTableData" />
        </el-tab-pane>
        <!-- 请求Params参数 -->
        <el-tab-pane style="max-height: 260px; overflow: auto;" label="Params">
          <Tables :TableData="paramsTableData" />
        </el-tab-pane>
        <!-- 请求Body Json参数 -->
        <el-tab-pane style="max-height: 260px; overflow: auto;" label="Body">
          <vue-json-editor v-model="bodyData" :showBtns="false" :mode="'code'" lang="zh" />
        </el-tab-pane>
        <!-- 断言 -->
        <el-tab-pane style="max-height: 260px; overflow: auto;" label="断言">
          <!-- <template>
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
          </template>-->
          <template height="250">
            <el-table :data="assertData" style="width: 100%">
              <el-table-column label="断言类型" width="200">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.assertType" placeholder="请选择断言类型">
                    <el-option label="响应内容" :value="1"></el-option>
                    <el-option label="响应体（正则）" :value="2"></el-option>
                    <el-option label="响应体（JSON）" :value="3"></el-option>
                    <el-option label="响应状态码" :value="4"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="提取表达式">
                <template slot-scope="scope">
                  <el-input
                    :disabled="scope.row.assertType==1?true:false"
                    placeholder="请输入表达式"
                    v-model="scope.row.assertExtractExpression"
                    clearable
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="期望关系" width="200">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.relation" placeholder="请选择断言类型">
                    <el-option label="包含" :value="1"></el-option>
                    <el-option label="匹配" :value="2"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="期望值">
                <template slot-scope="scope">
                  <el-input placeholder="请输入期望值" v-model="scope.row.expectancyValue" clearable></el-input>
                </template>
              </el-table-column>
              <slot></slot>
              <el-table-column fixed="right" width="125">
                <template slot="header" slot-scope="scope">
                  <el-button
                    @click.native.prevent="addRow(scope.$index, assertData)"
                    type="primary"
                    size="medium"
                  >添加</el-button>
                </template>
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, assertData)"
                    type="text"
                    size="medium"
                  >移除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-tab-pane>
        <!-- 参数提取 -->
        <el-tab-pane style="max-height: 260px; overflow: auto;" label="参数提取">
          <template>
            <el-radio-group v-model="assertType" @change="assert">
              <el-radio :label="1" border>正则表达式提取</el-radio>
              <el-radio :label="2" border>Json提取</el-radio>
            </el-radio-group>
            <div v-if="showAssert == 0"></div>
            <div v-if="showAssert == 1" style="margin-top: 20px;margin-left: 10px;">
              <el-form label-position="right" label-width="90px" :model="regularExpressionForm">
                <el-form-item label="引用名称">
                  <el-input v-model="regularExpressionForm.name"></el-input>
                </el-form-item>
                <el-form-item label="正则表达式">
                  <el-input v-model="regularExpressionForm.regular_expression"></el-input>
                </el-form-item>
                <el-form-item label="缺省值">
                  <el-input v-model="regularExpressionForm.default_value"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div v-if="showAssert == 2" style="margin-top: 20px;margin-left: 10px;">
              <el-form label-position="right" label-width="90px" :model="jsonExtractForm">
                <el-form-item label="引用名称">
                  <el-input v-model="jsonExtractForm.name"></el-input>
                </el-form-item>
                <el-form-item label="Json路径">
                  <el-input v-model="jsonExtractForm.json_path"></el-input>
                </el-form-item>
                <el-form-item label="缺省值">
                  <el-input v-model="jsonExtractForm.default_value"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div style="margin-top: 55px;">
      <el-divider></el-divider>
      <Response />
    </div>
    <el-dialog title="保存" :visible.sync="dialogFormVisible">
      <el-form ref="saveForm" :model="saveForm" :rules="rules">
        <el-form-item label="接口名称" label-width="80px" prop="request_name">
          <el-input v-model="saveForm.request_name" placeholder="请输入接口名称"></el-input>
        </el-form-item>
        <el-form-item label="保存到：" label-width="80px">
          <el-table
            :row-key="getRowKeys"
            @selection-change="handleSelectionChange"
            :data="saveForm.tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
            style="width: 100%;"
          >
            <el-table-column :reserve-selection="true" prop="id" type="selection" width="55"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="file_name" label="文件名称"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="interfaceNumber" label="接口数量"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="create_time" label="创建时间"></el-table-column>
          </el-table>
          <!-- 分页显示 -->
          <el-pagination
            style="text-align:center"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 15, 20, 40]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="saveForm.tableData.length"
          >//这是显示总共有多少数据，</el-pagination>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureSave(saveForm)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import vueJsonEditor from "vue-json-editor";
import {
  request_debug,
  get_file_list,
  update_request,
  get_environment_configuration
} from "@/api/interfaceTesting";
import Response from "./Response";
import Tables from "./Tables";
import { createNamespacedHelpers } from "vuex";
export default {
  components: { vueJsonEditor, Response, Tables },
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
      //期望值
      expectancyValue: "",
      //断言提取表达式
      assertExtractExpression: "",
      //断言类型选项
      assertTypeOptions: [
        {
          assertType: "1",
          assertTypeLabel: "响应断言"
        },
        {
          assertType: "2",
          assertTypeLabel: "Json断言"
        }
      ],
      //断言关系表达式
      relation: "",
      assertData: [
        {
          //断言类型
          assertType: 1,
          //断言提取表达式
          assertExtractExpression: "",
          //期望值
          expectancyValue: "",
          //关系
          relation: 1,
          //断言提取表达式
          assertExtractExpression: ""
        }
      ],
      //项目id
      project_id: localStorage.getItem("project_id"),
      //断言结果
      assert_result: {},
      //正则表达式提取表单
      regularExpressionForm: {
        name: "",
        regular_expression: "",
        default_value: ""
      },
      //Json提取表单
      jsonExtractForm: {
        name: "",
        json_path: "",
        default_value: ""
      },
      //Json断言表单
      jsonAssertForm: {
        json_path: "",
        json_value: ""
      },
      //根据断言类型显示断言内容
      showAssert: 0,
      //响应断言规则
      responseAssertRules: 1,
      //响应断言的内容
      responseAssertContent: "",
      //断言类型
      assertType: 0, //0是不使用，1是响应断言，2是Json断言
      //环境选项
      environment_options: [],
      //请求数据状态码 1是params,2是Json
      dataStateCode: 2,
      //:rules: rules表单规则校验
      rules: {
        requestAddress: [
          { required: true, trigger: "blur", validator: notNull }
        ],
        request_name: [{ required: true, trigger: "blur", validator: notNull }]
      },
      bodyData: {},
      //请求头数据
      headersTableData: [
        {
          key: "Content-Type",
          value: "application/json",
          description: "请求内容类型"
        }
      ],
      //请求params数据
      paramsTableData: [
        {
          key: "",
          value: "",
          description: ""
        }
      ],
      //请求参数form表单
      form: {
        //请求类型
        requestType: "get",
        //环境（域名）
        environment: "",
        //请求Url
        requestAddress: "/user/login"
      },
      //保存
      dialogFormVisible: false, // 保存表单显隐
      currentPage: 1, //初始页
      pagesize: 5, //    每页的数据
      //保存的表单
      saveForm: {
        request_name: null,
        tableData: [],
        //所选择的文件夹
        multipleSelection: ""
      }
    };
  },
  methods: {
    //删除table
    deleteRow(index, rows) {
      rows.splice(index, 1);
      this.$message({
        message: "移除成功！",
        type: "success"
      });
    },
    // 添加table
    addRow(index, rows) {
      this.assertData.push({
        //断言类型
        assertType: 1,
        //断言提取表达式
        assertExtractExpression: "",
        //期望值
        expectancyValue: "",
        //关系
        relation: 1,
        //断言提取表达式
        assertExtractExpression: ""
      });
      this.$message({
        message: "添加成功！",
        type: "success"
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
      console.log(this.assertData, "22222222222222222222222222222222222222222222")
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
          this.request_data = {
            environment_id: this.form.environment,
            address: this.form.requestAddress,
            method: this.form.requestType,
            body: this.bodyData,
            headers: header,
            params: params,
            dataState: this.dataStateCode,
            assert: assert
          };
          console.log(this.request_data);
          //发送请求，返回数据
          request_debug(this.request_data)
            .then(response => {
              console.log(response.data.data);
              this.$bus.$emit("response", response.data);
              this.assert_result = response.data.assert_result;
              this.$message({
                message: "请求成功！",
                type: "success"
              });
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
    //保存表单
    save(form) {
      this.dialogFormVisible = true;
      //获取文件列表
      this.saveForm.request_name = this.form.requestAddress;
      get_file_list()
        .then(response => {
          this.saveForm.tableData = response.data;
        })
        .catch(error => {
          this.$message({
            message: "获取失败",
            type: "error"
          });
          console.log(error);
        });
    },
    //确定保存
    sureSave(form) {
      const file_id = [];
      if (form.multipleSelection) {
        form.multipleSelection.forEach((elem, index) => {
          file_id.push(elem.id);
        });
      }
      if (form.request_name == "" || file_id.length === 0) {
        this.$message({
          message: "接口名称或文件不能为空",
          type: "error"
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
          requestName: form.request_name,
          environment_id: this.form.environment,
          address: this.form.requestAddress,
          method: this.form.requestType,
          body: this.bodyData,
          headers: header,
          params: params,
          dataState: this.dataStateCode,
          file_id: file_id
        };
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
        console.log(request_data);
        //发送请求，返回数据
        request_debug(request_data)
          .then(response => {
            console.log(response.data.data);
            this.$bus.$emit("response", response.data);
            this.assert_result = response.data.assert_result;
            //发送保存请求
            update_request(request_data)
              .then(response => {
                this.$message({
                  message: "保存成功！",
                  type: "success"
                });
                // 关闭保存弹窗
                this.dialogFormVisible = false;
              })
              .catch(error => {
                this.$message({
                  message: "保存参数错误",
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
      }
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
    //选择文件夹
    handleSelectionChange(val) {
      console.log(val);
      this.saveForm.multipleSelection = val;
    }
  },
  created() {
    get_environment_configuration({ project_id: this.project_id }).then(
      response => {
        this.environment_options = response.data;
      }
    );
  }
};
</script>

<style>
/* jsoneditor右上角默认有一个链接,加css去掉了 */
.jsoneditor-poweredBy {
  display: none;
}
</style>