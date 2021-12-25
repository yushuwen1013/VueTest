<template>
  <div style="position: relative" ref="test" v-loading="loading">
    <div
      style="
        height: 4%;
        margin-left: 20px;
        margin-bottom: 10px;
        margin-top: 10px;
        text-align: center;
      "
    >
      <el-button
        style="float: left; margin-bottom: 10px"
        type="primary"
        size="small"
        @click="back"
        >返回</el-button
      >
    </div>
    <div style="float: left; width: 100%">
      <el-card class="box-card" style="margin-left: 10px; height: 250px">
        <div style="width: 40%; float: left">
          <el-descriptions :column="1" border size="mini">
            <el-descriptions-item
              :contentStyle="{ 'text-align': 'center' }"
              label="任务名称"
              >{{ detailsData.task_name }}</el-descriptions-item
            >
            <el-descriptions-item
              :contentStyle="{ 'text-align': 'center' }"
              label="用例数量"
            >
              <template>
                <el-tag size="mini">
                  {{
                    "总共:" +
                    (detailsData.use_case_error + detailsData.use_case_success)
                  }}
                </el-tag>
                <el-tag size="mini" type="success">
                  {{ "成功:" + detailsData.use_case_success }}
                </el-tag>
                <el-tag size="mini" type="danger">
                  {{ "失败:" + detailsData.use_case_error }}
                </el-tag>
              </template>
            </el-descriptions-item>
            <el-descriptions-item
              :contentStyle="{ 'text-align': 'center' }"
              label="开始时间"
              >{{ detailsData.create_time }}</el-descriptions-item
            >
            <el-descriptions-item
              :contentStyle="{ 'text-align': 'center' }"
              label="结束时间"
              >{{ detailsData.end_time }}</el-descriptions-item
            >
            <el-descriptions-item
              :contentStyle="{ 'text-align': 'center' }"
              label="耗时"
              >{{ detailsData.time_consuming + "s" }}</el-descriptions-item
            >
            <el-descriptions-item
              :contentStyle="{ 'text-align': 'center' }"
              label="通过率"
              >{{
                (
                  detailsData.use_case_success /
                  (detailsData.use_case_error + detailsData.use_case_success)
                ).toFixed(4) *
                  100 +
                "%"
              }}</el-descriptions-item
            >
          </el-descriptions>
        </div>
        <div style="float: left; width: 50%">
          <div
            id="allCaseChart"
            :style="{ left: '100px', width: '400px', height: '250px' }"
          ></div>
        </div>
      </el-card>
    </div>
    <div style="float: left; width: 100%">
      <el-card
        class="box-card"
        style="margin-left: 10px;float: left; height: 500px; overflow-y: auto; width: 35%"
      >
        <div slot="header" class="clearfix">
          <span>用例列表</span>
          <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
        </div>
        <el-tree
          :highlight-current="highlight"
          ref="dataConfigTree"
          :data="data"
          node-key="id"
          @node-click="clickNode"
          :filter-node-method="filterNode"
        >
          <span class="custom-tree-node" slot-scope="{ node }">
            <div class="showfile">
              <span class="tmp" :title="node.data.name">
                <i
                  v-show="node.data.type == 2 ? true : false"
                  class="el-icon-document"
                  style="color: #e6a23c"
                ></i>
                <i
                  v-show="node.data.type == 1 ? true : false"
                  class="el-icon-folder-opened"
                ></i>
                {{ node.data.name }}
              </span>
            </div>
            <span>
              <i style="color: #67c23a" class="el-icon-success"></i>
              <i style="color: #f56c6c" class="el-icon-error"></i>
            </span>
          </span>
        </el-tree>
      </el-card>
      <el-card
        class="box-card"
        style="margin-left: float: left;10px; height: 500px; overflow-y: auto;width: 64%"
      >
        <!-- <div slot="header" class="clearfix">
          <span>步骤内容</span>
        </div> -->
        <div>
          <el-row>
            <el-descriptions
              direction="vertical"
              :column="4"
              border
              style="margin-bottom: 10px"
              size="mini"
            >
              <el-descriptions-item label="开始时间">{{
                stepRow.start_time
              }}</el-descriptions-item>
              <el-descriptions-item label="结束时间">{{
                stepRow.end_time
              }}</el-descriptions-item>
              <el-descriptions-item label="耗时" :span="1">{{
                stepRow.time_consuming
              }}</el-descriptions-item>
            </el-descriptions>
            <el-col v-for="(step, index) in stepData" :key="index">
              <el-card
                style="width: 50%; float: left"
                :body-style="{ padding: '0px', width: '100%' }"
              >
                <el-descriptions
                  :column="1"
                  border
                  labelStyle="width:70px"
                  size="mini"
                >
                  <el-descriptions-item
                    :contentStyle="{ 'text-align': 'center' }"
                    label="步骤"
                    >{{ step.id }}</el-descriptions-item
                  >
                  <el-descriptions-item
                    :contentStyle="{ 'text-align': 'center' }"
                    label="步骤描述"
                    >{{ step.description }}</el-descriptions-item
                  >
                  <el-descriptions-item
                    :contentStyle="{ 'text-align': 'center' }"
                    label="元素操作"
                    >{{ step.action }}</el-descriptions-item
                  >
                  <el-descriptions-item
                    :contentStyle="{ 'text-align': 'center' }"
                    label="操作参数"
                    >{{ step.action_parameter }}</el-descriptions-item
                  >
                  <el-descriptions-item
                    :contentStyle="{ 'text-align': 'center' }"
                    label="结果"
                  >
                    <el-tag :type="step.result ? 'success' : 'danger'">{{
                      step.result ? "成功" : "失败"
                    }}</el-tag>
                  </el-descriptions-item>
                </el-descriptions>
              </el-card>
              <el-card
                style="width: 50%"
                :body-style="{ padding: '0px', width: '100%' }"
              >
                <viewer :images="stepData">
                  <img
                    v-show="step.picture_path"
                    style="height: 220px"
                    :src="baseURL + 'media/webui/' + step.picture_path"
                    class="image"
                  />
                </viewer>
              </el-card>
              <el-descriptions :column="1" border width="50px">
                <el-descriptions-item
                  label-class-name="my-content"
                  content-class-name="my-content"
                  v-if="!step.result"
                  :contentStyle="{ 'text-align': 'center' }"
                  label="错误信息"
                >
                  {{ step.err_info }}
                </el-descriptions-item>
              </el-descriptions>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>

    <!-- 调试界面 -->
    <!-- <el-drawer title="调试结果" :visible.sync="stepVisible" size="90%">
      <el-card
        class="box-card"
        style="margin-left: 10px; height: 820px; overflow-y: auto"
      >
        <div slot="header" class="clearfix">
          <span>步骤内容</span>
        </div>
        <div>
          <el-row>
            <el-descriptions
              direction="vertical"
              :column="4"
              border
              style="margin-bottom: 10px"
              size="mini"
            >
              <el-descriptions-item label="开始时间">{{
                stepRow.start_time
              }}</el-descriptions-item>
              <el-descriptions-item label="结束时间">{{
                stepRow.end_time
              }}</el-descriptions-item>
              <el-descriptions-item label="耗时" :span="1">{{
                stepRow.time_consuming
              }}</el-descriptions-item>
            </el-descriptions>
            <el-col v-for="(step, index) in stepData" :key="index">
              <el-card
                style="width: 20%; float: left"
                :body-style="{ padding: '0px', width: '100%' }"
              >
                <el-descriptions :column="1" border labelStyle="width:70px" size="mini">
                  <el-descriptions-item
                    :contentStyle="{ 'text-align': 'center', 'width': '50px' }"
                    label="步骤"
                    >{{ step.id }}</el-descriptions-item
                  >
                  <el-descriptions-item
                    :contentStyle="{ 'text-align': 'center' }"
                    label="步骤描述"
                    >{{ step.description }}</el-descriptions-item
                  >
                  <el-descriptions-item
                    :contentStyle="{ 'text-align': 'center' }"
                    label="元素操作"
                    >{{ step.action }}</el-descriptions-item
                  >
                  <el-descriptions-item
                    :contentStyle="{ 'text-align': 'center' }"
                    label="操作参数"
                    >{{ step.action_parameter }}</el-descriptions-item
                  >
                  <el-descriptions-item
                    :contentStyle="{ 'text-align': 'center' }"
                    label="结果"
                  >
                    <el-tag :type="step.result ? 'success' : 'danger'">{{
                      step.result ? "成功" : "失败"
                    }}</el-tag>
                  </el-descriptions-item>
                </el-descriptions>
              </el-card>
              <el-card
                style="width: 70%"
                :body-style="{ padding: '0px', width: '100%' }"
              >
                <viewer :images="stepData">
                  <img
                    v-show="step.picture_path"
                    style="height: 300px"
                    :src="baseURL + 'media/webui/' + step.picture_path"
                    class="image"
                  />
                </viewer>
              </el-card>
              <el-descriptions :column="1" border width="50px">
                <el-descriptions-item
                  label-class-name="my-content"
                  content-class-name="my-content"
                  v-if="!step.result"
                  :contentStyle="{ 'text-align': 'center' }"
                  label="错误信息"
                >
                  {{ step.err_info }}
                </el-descriptions-item>
              </el-descriptions>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-drawer> -->
  </div>
</template>

<script>
const echarts = require("echarts/lib/echarts");
require("echarts/lib/component/title");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/legend");
require("echarts/lib/chart/pie");
import Response from "@/views/InterfaceTest/interfaceTesting/Response";
import { get_test_report } from "@/api/interfaceTesting";
import { ReportDetails } from "@/api/WebUiTest/timedTask";
import { UseCase } from "@/api/WebUiTest/useCaseManagement";
export default {
  name: "TestReport",
  components: { Response },
  data() {
    return {
      stepVisible: false,
      stepData: [], // 步骤数据
      //当前选中的调试记录数据
      stepRow: {
        start_time: "",
        end_time: "",
        time_consuming: "",
      },
      useCase_id: "", //用例id
      data: [], //用例数据
      filterCase: "", //搜索用例或文件
      highlight: false, //选中状态，false为不显示，true显示
      baseURL: process.env.VUE_APP_BASE_API, //基础url
      //_______________
      //项目id
      project_id: localStorage.getItem("project_id"),
      loading: true,
      //任务详情信息
      detailsData: {},
      //调试结果列表
      debuggingResult: [],
      //调试用例信息
      debuggingForm: {
        use_case_name: "",
        number: "",
        execution_time: "",
      },
      //调试弹窗显隐
      debuggingDrawer: false,
    };
  },
  mounted() {
    const id = { id: this.$route.query.id };
    ReportDetails("get", id)
      .then((response) => {
        this.detailsData = response.data;
        this.allCaseChart();
        this.data = this.detailsData.use_case_tree;
        this.$nextTick(() => {
          this.$refs.dataConfigTree.setCurrentKey(1);
        });
        console.log(this.detailsData, "detailsDatadetailsData");
        this.loading = false;
      })
      .catch((error) => {
        this.loading = false;
      });
  },
  methods: {
    //点击节点事件
    clickNode(node) {
      console.log(node);
      if (node.type == 2) {
        this.useCase_id = node.id;
        this.$nextTick(() => {
          this.$refs.dataConfigTree.setCurrentKey(node.id);
          this.stepVisible = true;
        });
      } else {
        // console.log("sssss");
        if (this.useCase_id != "") {
          this.$nextTick(() => {
            this.$refs.dataConfigTree.setCurrentKey(this.useCase_id);
            // this.stepVisible = true
          });
        } else {
          this.$nextTick(() => {
            this.$refs.dataConfigTree.setCurrentKey(1);
            // this.stepVisible = true
          });
        }
      }
    },
    //用例或文件过滤节点
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    //返回
    back() {
      this.$router.back(-1);
    },
    //全部用例
    allCaseChart() {
      var allCaseChart = echarts.init(document.getElementById("allCaseChart")); //获取容器元素
      var option = {
        title: {
          text: "用例结果数据统计",
          // subtext: "数据",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "用例执行结果",
            type: "pie",
            radius: "50%",
            data: [
              // { value: 1048, name: "总共" },
              {
                value: this.detailsData.use_case_error,
                label: {
                  formatter: "失败:{c} ({d}%)",
                },
              },
              {
                value: this.detailsData.use_case_success,
                label: {
                  formatter: "成功:{c} ({d}%)",
                },
              },
              // { value: 484, name: "Union Ads" },
              // { value: 300, name: "Video Ads" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      //防止越界，重绘canvas
      window.onresize = allCaseChart.resize;
      allCaseChart.setOption(option); //设置option
    },
  },
  watch: {
    useCase_id(val) {
      console.log(val);
      console.log(this.detailsData.executive_outcomes, "ssssss");
      if (val != "") {
        this.highlight = true;

        // UseCaseStep("get", { id: val }).then(res => {
        //   this.UseCaseData = res.data;
        // });
        this.detailsData.executive_outcomes.forEach((ele) => {
          console.log(ele);
          if (ele.id == val) {
            this.stepRow = ele;
            this.stepData = ele.case_step_details;
            return;
          }
        });
      } else {
        // this.UseCaseData = [];
        this.highlight = false;
      }
    },
  },
  created() {
    // //获取文件用例列表
    // UseCase("get", { project_id: this.project_id }).then(res => {
    //   this.data = res.data;
    //   this.$nextTick(() => {
    //     this.$refs.dataConfigTree.setCurrentKey(1);
    //   });
    // });
  },
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
.el-tree > .el-tree-node {
  min-width: 100%;
  display: inline-block;
}
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #bac8e5 !important;
}
.el-table__body tr.current-row > td {
  background: #409eff !important;
  color: rgb(255, 255, 255);
}

.my-content {
  background: #fde2e2;
}
</style>