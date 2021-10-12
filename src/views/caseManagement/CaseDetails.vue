<template>
  <div>
    <interfaceUseCaseEdit
      v-if="showInterfaceEdit"
      :request_data="request_data"
    />
    <div v-else>
      <div style="background: #eaeaea; height: 100%">
        <div style="background: #fff">
          <p
            style="
              width: 1600px;
              height: 60px;
              padding-left: 31px;
              font-size: 22px;
              margin-top: 0px;
              line-height: 55px;
            "
          >
            <span style>用例名称：WebPro</span>
          </p>
        </div>
        <div>
          <el-form
            :inline="true"
            class="demo-form-inline"
            style="margin-left: 35px"
          >
            <el-button
              style="margin-bottom: 20px"
              type="primary"
              icon="el-icon-back"
              @click="back"
              >返回</el-button
            >
            <el-button
              style="float: right; margin-bottom: 20px; margin-right: 50px"
              type="primary"
              icon="el-icon-plus"
              @click="addRequest"
              >添加接口</el-button
            >
            <el-button
              style="float: right; margin-bottom: 20px; margin-right: 10px"
              type="primary"
              icon="el-icon-plus"
              >导入接口</el-button
            >
            <el-button
              style="float: right; margin-bottom: 20px; margin-right: 10px"
              type="primary"
              >查看结果</el-button
            >
            <el-button
              style="float: right; margin-bottom: 20px; margin-right: 10px"
              type="primary"
              @click="requestDefaultsFormVisible = true"
              >请求默认值</el-button
            >
            <el-button
              style="float: right; margin-bottom: 20px; margin-right: 10px"
              type="primary"
              >执行用例</el-button
            >
          </el-form>
          <el-table
            :data="
              tableData.slice(
                (currentPage - 1) * pagesize,
                currentPage * pagesize
              )
            "
            height="600"
            style="width: 100%; left: 20px"
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
              width="100"
              prop="method"
              label="请求类型"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="environment, environment_url"
              label="请求环境"
            >
              <template slot-scope="scope"
                >{{ scope.row.environment_name }}：{{
                  scope.row.environment_url
                }}</template
              >
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
                  >运行</el-button
                >
                <el-button
                  size="mini"
                  @click="editInterface(scope.$index, scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="delete_interface_use_case(scope.$index, scope.row)"
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
        <el-drawer title="接口信息" :visible.sync="drawer">
          <span class="span">接口名称：{{ requestData.request_name }}</span>
          <br />
          <br />
          <span class="span">请求类型：{{ resultInfo.request_method }}</span>
          <br />
          <br />
          <span class="span">请求地址：{{ resultInfo.request_url }}</span>
          <br />
          <br />
          <el-collapse v-model="activeNames">
            <el-collapse-item title="请求头" name="1">
              <json-viewer
                :value="resultInfo.request_headers"
                :expand-depth="2"
                copyable
                sort
              ></json-viewer>
            </el-collapse-item>
            <el-collapse-item title="请求参数" name="2">
              <json-viewer
                :value="resultInfo.request_data"
                :expand-depth="2"
                copyable
                sort
              ></json-viewer>
            </el-collapse-item>
            <el-collapse-item title="断言结果" name="3" v-show="assert_result">
              <h5>断言类型：{{ assert_result.assertion_type }}</h5>
              <h5>断言结果：{{ assert_result.assertion_results }}</h5>
              <h5>断言内容：{{ assert_result.assertion_content }}</h5>
            </el-collapse-item>
            <el-collapse-item title="响应数据" name="4" visible="false">
              <json-viewer
                :value="resultInfo.response_data"
                :expand-depth="2"
                copyable
                sort
              ></json-viewer>
            </el-collapse-item>
          </el-collapse>
        </el-drawer>
        <el-dialog
          title="请求默认值"
          :visible.sync="requestDefaultsFormVisible"
        >
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
              <template>
                <el-radio-group
                  v-model="requestDefaultsForm.assertType"
                  @change="assert"
                >
                  <el-radio :label="0">关闭</el-radio>
                  <el-radio :label="1">响应断言</el-radio>
                  <el-radio :label="2">Json断言</el-radio>
                </el-radio-group>
                <div v-if="requestDefaultsForm.assertType == 0"></div>
                <div
                  v-if="requestDefaultsForm.assertType == 1"
                  style="margin-top: 20px; margin-left: 10px"
                >
                  <template>
                    <el-radio
                      v-model="requestDefaultsForm.responseAssertRules"
                      :label="1"
                      >包含</el-radio
                    >
                    <el-radio
                      v-model="requestDefaultsForm.responseAssertRules"
                      :label="2"
                      >匹配</el-radio
                    >
                  </template>
                  <el-input
                    style="margin-top: 20px"
                    type="textarea"
                    :rows="5"
                    placeholder="请输如响应断言内容"
                    v-model="requestDefaultsForm.responseAssertContent"
                  ></el-input>
                </div>
                <div
                  v-if="requestDefaultsForm.assertType == 2"
                  style="margin-top: 20px; margin-left: 10px"
                >
                  <el-form
                    label-position="top"
                    label-width="80px"
                    :model="requestDefaultsForm.jsonAssertForm"
                  >
                    <el-form-item label="Json路径">
                      <el-input
                        v-model="requestDefaultsForm.jsonAssertForm.json_path"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="预期值">
                      <el-input
                        v-model="requestDefaultsForm.jsonAssertForm.json_value"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                </div>
              </template>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="requestDefaultsFormVisible = false"
              >取 消</el-button
            >
            <el-button
              type="primary"
              @click="updateRequestDefaults(requestDefaultsForm)"
              >确 定</el-button
            >
          </div>
        </el-dialog>
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
import JsonViewer from "vue-json-viewer";
import vueJsonEditor from "vue-json-editor";
import {
  request_debug,
  update_interface_use_case_serial_number,
  get_request_defaults,
} from "@/api/interfaceTesting";
import interfaceUseCaseEdit from "./interfaceUseCaseEdit";
import { isJSON } from "@/utils/validate";
export default {
  name: "InterfaceList",
  components: { JsonViewer, vueJsonEditor, interfaceUseCaseEdit },
  data() {
    return {
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
        //响应断言规则
        responseAssertRules: 1,
        //响应断言的内容
        responseAssertContent: "",
        //Json断言表单
        jsonAssertForm: {
          json_path: "",
          json_value: "",
        },
        //断言类型
        assertType: 0, //0是不使用，1是响应断言，2是Json断言
      },
      //请求默认值显隐
      requestDefaultsFormVisible: false,
      //断言结果
      assert_result: {},
      seareRequestName: "", //搜索值
      currentPage: 1, //初始页
      pagesize: 10, //    每页的数据
      //编辑页面使用的数据
      request_data: {},
      showInterfaceEdit: false,
      //默认展开第三个响应数据
      activeNames: ["3", "4"],
      resultInfo: {},
      drawer: false,
      tableData: [], //接口用例数据
      requestData: {},
    };
  },
  methods: {
    //更新接口默认值
    updateRequestDefaults(RequestDefaults) {
      //在localStorage中提取用例id
      const use_case_id = localStorage.getItem("use_case_id");
      //请求参数
      const request_data = {
        method: RequestDefaults.requestType,
        address: RequestDefaults.requestAddress,
        headers: RequestDefaults.headers,
        assert_details: RequestDefaults.assert_details,
        environment_id: RequestDefaults.environment,
        id: use_case_id,
      };
      //assert_details 断言详情
      var assert_details = {
        assert_type: this.requestDefaultsForm.assertType,
      };
      //如果断言类型是1断言详情就写响应断言的内容，2就写Json断言的内容
      if (this.requestDefaultsForm.assertType == 1) {
        assert_details.response_assert_rules =
          this.requestDefaultsForm.responseAssertRules;
        assert_details.response_assert_content =
          this.requestDefaultsForm.responseAssertContent;
        request_data.assert_details = assert_details;
      } else if (this.requestDefaultsForm.assertType == 2) {
        assert_details.json_path =
          this.requestDefaultsForm.jsonAssertForm.json_path;
        assert_details.json_value =
          this.requestDefaultsForm.jsonAssertForm.json_value;
        request_data.assert_details = assert_details;
      }
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
      const use_case_id = localStorage.getItem("use_case_id");
      //把headers参数json格式转换为对象
      const headers = [];
      const sHeaders = new Function(
        "return " + this.requestDefaultsForm.headers
      )();
      Object.keys(sHeaders).forEach((elem) => {
        headers.push({ key: elem, value: sHeaders[elem] });
      });
      //根据断言类型发送对应的断言详情
      if (this.requestDefaultsForm.assertType == 0) {
        var assert_details = {
          assert_type: 0,
        };
      } else if (this.requestDefaultsForm.assertType == 1) {
        var assert_details = {
          assert_type: 1,
          response_assert_rules: this.requestDefaultsForm.responseAssertRules,
          response_assert_content:
            this.requestDefaultsForm.responseAssertContent,
        };
      } else {
        var assert_details = {
          assert_type: 2,
          json_path: this.requestDefaultsForm.jsonAssertForm.json_path,
          json_value: this.requestDefaultsForm.jsonAssertForm.json_value,
        };
      }
      //请求参数
      this.request_data = {
        requestName: "",
        address: this.requestDefaultsForm.requestAddress,
        method: this.requestDefaultsForm.requestType,
        environment_id: this.requestDefaultsForm.environment,
        body: {},
        headers: headers,
        params: [{}],
        dataState: 2,
        use_case_id: use_case_id,
        assert_details: assert_details,
        assert_result: {},
      };
      console.log(this.request_data.assert_details);
      //显示接口编辑页面
      this.showInterfaceEdit = true;
    },
    //运行  -  发送请求
    sendRequest(index, row) {
      console.log(row);
      if (row.assert_details == null) {
        var assert_details = {
          assert_type: 0,
        };
      } else {
        assert_details = new Function("return " + row.assert_details)();
      }
      const request_data = {
        environment_id: row.environment_id,
        address: row.address,
        method: row.method,
        body: new Function("return " + row.body)(),
        headers: new Function("return " + row.headers)(),
        params: new Function("return " + row.params)(),
        dataState: row.dataState,
        request_name: row.request_name,
        assert: assert_details,
      };
      this.requestData = request_data;
      //发送请求，返回数据
      request_debug(request_data)
        .then((response) => {
          this.resultInfo = response.data;
          this.assert_result = response.data.assert_result;
          console.log(this.assert_result, "5555555555555");
          if (this.assert_result == undefined) {
            this.assert_result = false;
          }
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
    //返回上一级
    back() {
      this.$parent.showCaseDetails = false;
    },
    //编辑接口
    editInterface(index, row) {
      const headers = [];
      const params = [];
      const sHeaders = new Function("return " + row.headers)();
      const sParams = new Function("return " + row.params)();
      Object.keys(sHeaders).forEach((elem) => {
        headers.push({ key: elem, value: sHeaders[elem] });
      });
      Object.keys(sParams).forEach((elem) => {
        params.push({ key: elem, value: sParams[elem] });
      });
      if (row.assert_details == null) {
        var assert_details = {
          assert_type: 0,
        };
        var assert_result = {};
      } else {
        (assert_details = new Function("return " + row.assert_details)()),
          (assert_result = new Function("return " + row.assert_result)());
      }
      this.request_data = {
        id: row.id,
        requestName: row.request_name,
        environment_id: row.environment_id,
        environment_name: row.environment_name,
        address: row.address,
        method: row.method,
        body: new Function("return " + row.body)(),
        headers: headers,
        params: params,
        dataState: row.dataState,
        file_id: row.request_file_id,
        assert_details: assert_details,
        assert_result: assert_result,
      };
      console.log(this.request_data.assert_details);
      // console.log("==============", this.request_data);
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
            const use_case_id = localStorage.getItem("use_case_id");
            const data = { use_case_id: use_case_id };
            // 获取用例接口列表
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
      // console.log(this.pagesize); //每页下拉显示数据
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
      // console.log(this.currentPage); //点击第几页
    },
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector(".el-table__body-wrapper tbody");
      const _this = this;
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tableData.splice(oldIndex, 1)[0];
          _this.tableData.splice(newIndex, 0, currRow);
        },
      });
    },
  },
  created() {
    const use_case_id = localStorage.getItem("use_case_id");
    const data = { use_case_id: use_case_id };
    // 获取用例接口列表
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
        this.$bus.$emit("response", {});
        console.log(error);
      });
    //获取环境信息
    get_environment_configuration().then((response) => {
      this.requestDefaultsForm.environment_options = response.data;
    });
    //获取请求默认值
    get_request_defaults(data).then((response) => {
      this.requestDefaultsForm.requestType =
        response.data.request_defaults_method;
      this.requestDefaultsForm.headers = response.data.request_defaults_headers;
      this.requestDefaultsForm.environment =
        response.data.request_defaults_environment_id;
      this.requestDefaultsForm.requestAddress =
        response.data.request_defaults_address;
      const assert_details = new Function(
        "return " + response.data.request_defaults_assert_details
      )();
      this.requestDefaultsForm.assertType = assert_details.assert_type;
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
  },
  mounted() {
    // 阻止默认行为
    document.body.ondrop = function (event) {
      event.preventDefault();
      event.stopPropagation();
    };
    this.rowDrop();
  },
  watch: {
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
      // deep:true
    },
  },
};
</script>

<style>
.span {
  padding-left: 10px;
}
/* 抽屉标题文字的大小 */
.el-collapse-item__header {
  font-size: 17px;
  padding-left: 10px;
}
/* 抽屉超出显示滚动条 */
.el-drawer.rtl {
  overflow: scroll;
}
</style>
