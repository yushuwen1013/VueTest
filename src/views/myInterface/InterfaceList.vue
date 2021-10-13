<template>
  <div>
    <InterfaceEdit v-if="showInterfaceEdit" :request_data="request_data" />
    <div v-else>
      <div style="background:#EAEAEA; height: 100%">
        <div style="background:#fff">
          <p
            style="width: 1600px;height: 60px;padding-left: 31px;font-size:22px;margin-top: 0px;line-height:55px;"
          >
            <span style>接口列表</span>
          </p>
        </div>
        <div>
          <el-form :inline="true" class="demo-form-inline" style="margin-left: 35px;">
            <el-button
              style="margin-bottom: 20px;"
              type="primary"
              icon="el-icon-back"
              @click="back"
            >返回</el-button>
            <el-form-item label="接口名称" style="margin-left: 70px;">
              <el-input v-model="seareRequestName" placeholder="请输入接口名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="inquire">查询</el-button>
              <el-button type="primary" @click="reset">重置</el-button>
            </el-form-item>
            <el-button
              style="float: right;margin-bottom: 20px;margin-right: 50px;"
              type="primary"
              icon="el-icon-plus"
              @click="addRequest"
            >添加</el-button>
          </el-form>
          <el-table
            :header-cell-style="{background:'#DCDFE6',color:'#303133'}"
            :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
            height="600"
            style="width: 100%;left: 20px;"
          >
            <el-table-column
              :show-overflow-tooltip="true"
              max-height="100"
              width="180"
              prop="request_name"
              label="请求名称"
            ></el-table-column>
            <el-table-column :show-overflow-tooltip="true" width="150" prop="method" label="请求类型"></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="environment, environment_url"
              label="请求环境"
            >
              <template
                slot-scope="scope"
              >{{scope.row.environment_name}}：{{scope.row.environment_url}}</template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="address" label="请求地址"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="headers" label="请求头部"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="data" label="请求参数"></el-table-column>
            <el-table-column width="250" label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="sendRequest(scope.$index,scope.row)"
                >运行</el-button>
                <el-button size="mini" @click="editInterface(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteInterface(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
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
            :total="tableData.length"
          >//这是显示总共有多少数据，</el-pagination>
        </div>
        <el-drawer title="接口信息" :visible.sync="drawer">
          <span class="span">接口名称：{{requestData.request_name}}</span>
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
            <el-collapse-item title="响应数据" name="4" visible="false">
              <json-viewer :value="resultInfo.response_data" :expand-depth="2" copyable sort></json-viewer>
            </el-collapse-item>
          </el-collapse>
        </el-drawer>
      </div>
    </div>
  </div>
</template>

<script>
import {
  get_request_list,
  update_request,
  delete_request
} from "@/api/interfaceTesting";
import JsonViewer from "vue-json-viewer";
import vueJsonEditor from "vue-json-editor";
import { request_debug } from "@/api/interfaceTesting";
import InterfaceEdit from "./interfaceEdit";
export default {
  name: "InterfaceList",
  components: { JsonViewer, vueJsonEditor, InterfaceEdit },
  data() {
    return {
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
      tableData: [],
      requestData: {}
    };
  },
  methods: {
    //查询
    inquire() {
      const file_id = localStorage.getItem("file_id");
      get_request_list({
        file_id: file_id,
        request_name: this.seareRequestName
      })
        .then(response => {
          this.tableData = response.data;
        })
        .catch(error => {
          this.$message({
            message: "查询失败",
            type: "error"
          });
          console.log(error);
        });
    },
    //重置
    reset() {
      this.seareRequestName = "";
      const file_id = localStorage.getItem("file_id");
      get_request_list({ file_id }).then(response => {
        this.tableData = response.data;
      });
    },
    //添加
    addRequest() {
      const file_id = localStorage.getItem("file_id");
      this.request_data = {
        requestName: "",
        url: "",
        method: "get",
        body: {},
        headers: [{}],
        params: [{}],
        dataState: 2,
        file_id: file_id,
        assert_details: { assert_type: 0 },
        assert_result: {}
      };
      this.showInterfaceEdit = true;
    },
    //运行  -  发送请求
    sendRequest(index, row) {
      console.log(row);
      if (row.assert_details == null) {
        var assert_details = {
          assert_type: 0
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
        assert: assert_details
      };
      this.requestData = request_data;
      //发送请求，返回数据
      request_debug(request_data)
        .then(response => {
          this.resultInfo = response.data;
          this.assert_result = response.data.assert_result;
          console.log(this.assert_result, "5555555555555");
          if (this.assert_result == undefined) {
            this.assert_result = false;
          }
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
    //返回上一级
    back() {
      this.$router.back();
    },
    //编辑接口
    editInterface(index, row) {
      const headers = [];
      const params = [];
      const sHeaders = new Function("return " + row.headers)();
      const sParams = new Function("return " + row.params)();
      Object.keys(sHeaders).forEach(elem => {
        headers.push({ key: elem, value: sHeaders[elem] });
      });
      Object.keys(sParams).forEach(elem => {
        params.push({ key: elem, value: sParams[elem] });
      });
      if (row.assert_details == null) {
        var assert_details = {
          assert_type: 0
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
        assert_result: assert_result
      };
      console.log("==============", this.request_data);
      this.showInterfaceEdit = true;
    },
    //删除接口
    deleteInterface(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该接口, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delete_request({ id: row.id })
            .then(response => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              const file_id = localStorage.getItem("file_id");
              const data = { file_id: file_id };
              // 获取接口列表
              get_request_list(data).then(response => {
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
              });
            })
            .catch(erro => {
              console.log(erro);
              this.$message({
                type: "error",
                message: erro
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
      console.log(this.pagesize); //每页下拉显示数据
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      console.log(this.currentPage); //点击第几页
    }
  },
  created() {
    //请求参数
    // console.log(this.$route.params, "--------------")
    const file_id = localStorage.getItem("file_id");
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
        this.tableData = responseData;
      })
      .catch(error => {
        this.$bus.$emit("response", {});
        console.log(error);
      });
  }
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
