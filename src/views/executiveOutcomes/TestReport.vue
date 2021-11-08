<template>
  <div style="height: 100%; position: relative">
    <div style="margin-left: 20px; margin-bottom: 15px; margin-top: 15px;text-align:center;">
      <el-button
        style="float: left;margin-bottom: 10px;"
        type="primary"
        size="small"
        @click="back"
      >返回</el-button>
    </div>
    <el-card class="box-card" style="margin-left: 10px; width: 98%; height: 35%">
      <!-- <div slot="header" class="clearfix">
        <span>任务测试报告</span>
      </div>-->
      <div>
        <div style="width: 30%; float: left">
          <el-descriptions :column="1" border>
            <el-descriptions-item
              :contentStyle="{ 'text-align': 'center' }"
              label="任务名称"
            >{{detailsData.task_name}}</el-descriptions-item>
            <el-descriptions-item
              :contentStyle="{ 'text-align': 'center' }"
              label="用例数量"
            >{{detailsData.useCaseNumber}}</el-descriptions-item>
            <el-descriptions-item
              :contentStyle="{ 'text-align': 'center' }"
              label="开始时间"
            >{{detailsData.start_time}}</el-descriptions-item>
            <el-descriptions-item
              :contentStyle="{ 'text-align': 'center' }"
              label="结束时间"
            >{{detailsData.end_time}}</el-descriptions-item>
            <el-descriptions-item
              :contentStyle="{ 'text-align': 'center' }"
              label="耗时"
            >{{detailsData.time_consuming}}</el-descriptions-item>
            <el-descriptions-item
              :contentStyle="{ 'text-align': 'center' }"
              label="通过率"
            >{{(detailsData.interface_case[1]/detailsData.interface_case[0]).toFixed(4)*100 + '%'}}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div style="width: 34%; float: left">
          <div id="interfaceCaseChart" :style="{ left: '50px', width: '400px', height: '300px' }"></div>
        </div>
        <div style="width: 34%; float: left">
          <div id="businessCaseChart" :style="{ left: '50px', width: '400px', height: '300px' }"></div>
        </div>
      </div>
    </el-card>
    <el-card class="box-card" style="margin-left: 10px; width: 98%; height: 500px">
      <!-- <div slot="header" class="clearfix">
        <span>请选择用例</span>
      </div>-->
      <!-- <el-tabs activeName="second">
        <el-tab-pane label="单接口用例" name="second">单接口用例</el-tab-pane>
        <el-tab-pane label="业务用例" name="third">业务用例</el-tab-pane>
      </el-tabs>-->
      <el-tabs activeName="first">
        <!-- <el-tab-pane label="单接口用例" name="first">
            <div
              @click="slide(item, index)"
              v-for="(item, index) in wpList"
              :key="item.id"
              style="width: 200px; height:40px; line-height: 40px;"
              :class="{active:active == item.file_name}">
              <i class="el-icon-folder" style="margin-right: 10px;"></i>
              {{ item.file_name }}
            </div>
        </el-tab-pane>-->
        <el-tab-pane label="单接口用例" name="first">
          <div style="width: 35%">
            <!-- <el-input placeholder="输入关键字进行过滤" v-model="filterInterfaceText"></el-input> -->
            <el-tree
              style="height:400px;overflow:auto;"
              :data="detailsData.interface_case_result"
              node-key="id"
              ref="myInterfaceData"
              :default-expanded-keys="[1]"
              @node-click="showInterfaceDetails"
            >
              <span class="custom-tree-node" slot-scope="{ node }">
                <span :title="node.data.file_name">
                  <i :class="node.data.children ?'el-icon-folder':'el-icon-tickets'"></i>
                  {{ node.data.children ? node.data.file_name: node.data.request_name}}
                  <i
                    v-show="node.data.children"
                    :style="node.data.file_result == '成功'?'color: #67C23A':'color: #F56C6C'"
                    :class="node.data.file_result == '成功'?'el-icon-success':'el-icon-error'"
                  ></i>
                  <i
                    v-show="!node.data.children"
                    :style="node.data.response_result == '断言成功' ||node.data.response_result == '成功' ?'color: #67C23A':'color: #F56C6C'"
                    :class="node.data.response_result == '断言成功' ||node.data.response_result == '成功' ?'el-icon-success':'el-icon-error'"
                  ></i>
                </span>
              </span>
            </el-tree>
          </div>
        </el-tab-pane>
        <el-tab-pane label="业务用例" name="second">
          <div>
            <!-- <el-input placeholder="输入关键字进行过滤" v-model="filterUseCaseText"></el-input> -->
            <el-tree
              style="height:500px;overflow:auto;"
              :data="detailsData.business_case_result"
              node-key="id"
              ref="myUseCaseData"
              :default-expanded-keys="[1]"
              @node-click="showBusinessCaseDetails"
            >
              <span class="custom-tree-node" slot-scope="{ node }">
                <span :title="node.data.file_name">
                  <i :class="node.data.children ?'el-icon-folder':'el-icon-tickets'"></i>
                  {{ node.data.use_case_info.use_case_name}}
                  <i
                    :style="node.data.use_case_info.execution_result == '断言成功'||node.data.use_case_info.execution_result == '成功' ?'color: #67C23A':'color: #F56C6C'"
                    :class="node.data.use_case_info.execution_result == '断言成功'||node.data.use_case_info.execution_result == '成功' ?'el-icon-success':'el-icon-error'"
                  ></i>
                </span>
              </span>
            </el-tree>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 调试界面 -->
    <el-drawer title="调试结果" :visible.sync="debuggingDrawer" size="90%">
      <div style="background: #eaeaea">
        <div style="float: left;width:22%">
          <el-card
            class="box-card"
            style="
                              margin-left: 10px;
                              height: 820px;
                              position: relative;
                            "
          >
            <div slot="header" class="clearfix">
              <span>用例信息</span>
            </div>
            <el-descriptions :column="1" border width="50px">
              <el-descriptions-item :contentStyle="{ 'text-align': 'center' }" label="用例名称">
                {{
                debuggingForm.use_case_name
                }}
              </el-descriptions-item>
              <el-descriptions-item :contentStyle="{ 'text-align': 'center' }" label="接口数量">
                {{
                debuggingForm.number
                }}
              </el-descriptions-item>
              <el-descriptions-item :contentStyle="{ 'text-align': 'center' }" label="执行时间">
                {{
                debuggingForm.execution_time
                }}
              </el-descriptions-item>
              <el-descriptions-item
                :contentStyle="{ 'text-align': 'center' }"
                label="耗时"
              >{{debuggingForm.time_consuming}}</el-descriptions-item>
              <el-descriptions-item
                :contentStyle="{ 'text-align': 'center' }"
                label="结果"
              >{{debuggingForm.execution_result}}</el-descriptions-item>
            </el-descriptions>
            <el-divider content-position="left">接口执行顺序</el-divider>
            <div style="height: 460px; overflow: auto">
              <el-tree
                height="30px"
                highlight-current
                ref="debuggingResultConfigTree"
                :data="debuggingResult"
                @node-click="selectInterface"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
              >
                <span class="custom-tree-node" slot-scope="{ node }">
                  <span class="tmp" :title="node.data.request_name">
                    <i class="el-icon-folder"></i>
                    {{ node.data.request_name }}
                  </span>
                  <span>
                    <el-tag
                      :type="
                                        node.data.response_result ==
                                          '断言失败' ||
                                        node.data.response_result == '失败'
                                          ? 'danger'
                                          : 'success'
                                      "
                    >{{ node.data.response_result }}</el-tag>
                  </span>
                </span>
              </el-tree>
            </div>
          </el-card>
        </div>
        <div style="float: left;width:77%">
          <el-card
            float:right
            class="box-card"
            style="
                              margin-left: 20px;
                              height: 820px;
                              position: relative;
                            "
          >
            <div slot="header" class="clearfix">
              <span>响应信息</span>
            </div>
            <Response :responseData="debuggingResponseData" />
          </el-card>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
const echarts = require("echarts/lib/echarts");
require("echarts/lib/component/title");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/legend");
require("echarts/lib/chart/pie");
import Response from "../interfaceTesting/Response";
export default {
  name: "TestReport",
  components: { Response },
  props: ["detailsData"],
  data() {
    return {
      //调试状态，加载中
      debuggingState: false,
      //调试结果列表
      debuggingResult: [],
      //调试用例信息
      debuggingForm: {
        use_case_name: "",
        number: "",
        execution_time: ""
      },
      //调试弹窗显隐
      debuggingDrawer: false,
      //调试响应数据
      debuggingResponseData: {
        request_headers: "",
        request_data: "",
        request_url: "",
        request_method: "",
        response_code: "",
        response_data: "",
        response_headers: "{}",
        dataState: "",
        assert_result: []
      }
      // myUseCaseData: this.detailsData.business_case_result, //业务用例数据
      // myInterfaceData: this.detailsData.interface_case_result, //单接口用例数据
    };
  },
  mounted() {
    this.interfaceCaseChart();
    this.businessCaseChart();
  },
  methods: {
    //调试结果页面点击选中接口
    selectInterface(node) {
      this.$refs.debuggingResultConfigTree.setCurrentKey(node.id);
      console.log(node, "node");
      this.debuggingResponseData = {
        assert_result: node.assert_result,
        dataState: node.dataState,
        extraction_result: node.extraction_result,
        request_data: node.request_data,
        request_headers: node.request_headers,
        request_method: node.request_method,
        request_url: node.request_url,
        response_code: node.response_code,
        response_data: node.response_data,
        response_headers: node.response_headers,
        response_result: node.response_result,
        response_size: node.response_size,
        response_time: node.response_time
      };
      this.debuggingResponseData.response_data = JSON.stringify(
        this.debuggingResponseData.response_data
      );
      this.debuggingResponseData.response_headers = JSON.stringify(
        this.debuggingResponseData.response_headers
      );
      // console.log(
      //   typeof this.responseData.response_headers,
      //   typeof this.responseData.response_data
      // );
    },
    //点击用例弹出用例详情
    showBusinessCaseDetails(node) {
      console.log(node);
      this.debuggingDrawer = true;
      this.debuggingForm = node.use_case_info;
      this.debuggingResult = node.result;
      this.$nextTick(() => {
        this.$refs.debuggingResultConfigTree.setCurrentKey(
          this.debuggingResult[0].id
        );
        this.debuggingResponseData = {
          assert_result: this.debuggingResult[0].assert_result,
          dataState: this.debuggingResult[0].dataState,
          extraction_result: this.debuggingResult[0].extraction_result,
          request_data: this.debuggingResult[0].request_data,
          request_headers: this.debuggingResult[0].request_headers,
          request_method: this.debuggingResult[0].request_method,
          request_url: this.debuggingResult[0].request_url,
          response_code: this.debuggingResult[0].response_code,
          response_data: this.debuggingResult[0].response_data,
          response_headers: this.debuggingResult[0].response_headers,
          response_result: this.debuggingResult[0].response_result,
          response_size: this.debuggingResult[0].response_size,
          response_time: this.debuggingResult[0].response_time
        };
        this.debuggingResponseData.response_data = JSON.stringify(
          this.debuggingResponseData.response_data
        );
        this.debuggingResponseData.response_headers = JSON.stringify(
          this.debuggingResponseData.response_headers
        );
      });
    },
    showInterfaceDetails(node) {
      console.log(node);
    },
    //返回
    back() {
      this.$parent.isShowTestReport = false;
    },
    //单接口图表
    interfaceCaseChart() {
      var interfaceCaseChart = echarts.init(
        document.getElementById("interfaceCaseChart")
      ); //获取容器元素
      var option = {
        title: {
          text: "单接口用例结果数据统计",
          // subtext: "数据",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left"
        },
        series: [
          {
            name: "用例执行结果",
            type: "pie",
            radius: "50%",
            data: [
              // { value: 1048, name: "总共" },
              {
                value: this.detailsData.interface_case[2],
                label: {
                  formatter: "失败: {d}%"
                }
              },
              {
                value: this.detailsData.interface_case[1],
                label: {
                  formatter: "成功: {d}%"
                }
              }

              // { value: 484, name: "Union Ads" },
              // { value: 300, name: "Video Ads" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      //防止越界，重绘canvas
      window.onresize = interfaceCaseChart.resize;
      interfaceCaseChart.setOption(option); //设置option
    },
    //业务接口图表
    businessCaseChart() {
      var businessCaseChart = echarts.init(
        document.getElementById("businessCaseChart")
      ); //获取容器元素
      var option = {
        title: {
          text: "业务用例结果数据统计",
          // subtext: "数据",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left"
        },
        series: [
          {
            name: "用例执行结果",
            type: "pie",
            radius: "50%",
            data: [
              // { value: 1048, name: "总共" },
              {
                value: this.detailsData.business_case[2],
                label: {
                  formatter: "失败: {d}%"
                }
              },
              {
                value: this.detailsData.business_case[1],
                label: {
                  formatter: "成功: {d}%"
                }
              }
              // { value: 484, name: "Union Ads" },
              // { value: 300, name: "Video Ads" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      //防止越界，重绘canvas
      window.onresize = businessCaseChart.resize;
      businessCaseChart.setOption(option); //设置option
    }
  }
};
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.el-tree-node__content {
  background-color: #ffffff;
  height: 40px;
}

.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: rgb(209, 209, 209) !important;
}
</style>