<template>
  <div style="height: 100%; position: relative">
    <div style="margin-left: 20px; margin-bottom: 15px; margin-top: 15px;text-align:center;">
      <el-button style="float: left;margin-bottom: 10px;" type="primary" size="small" @click="back"
        >返回</el-button
      >
    </div>
    <el-card
      class="box-card"
      style="margin-left: 10px; width: 98%; height: 35%"
    >
      <!-- <div slot="header" class="clearfix">
        <span>任务测试报告</span>
      </div> -->
      <div>
        <div style="width: 30%; float: left">
          <el-descriptions :column="1" border>
            <el-descriptions-item
              :contentStyle="{ 'text-align': 'center' }"
              label="任务名称"
            >
              阿萨
            </el-descriptions-item>
            <el-descriptions-item
              :contentStyle="{ 'text-align': 'center' }"
              label="接口数量"
            >
              阿萨
            </el-descriptions-item>
            <el-descriptions-item
              :contentStyle="{ 'text-align': 'center' }"
              label="执行时间"
            >
              阿萨
            </el-descriptions-item>
            <el-descriptions-item
              :contentStyle="{ 'text-align': 'center' }"
              label="执行时间"
            >
              阿萨
            </el-descriptions-item>
            <el-descriptions-item
              :contentStyle="{ 'text-align': 'center' }"
              label="耗时"
              >阿萨</el-descriptions-item
            >
            <el-descriptions-item
              :contentStyle="{ 'text-align': 'center' }"
              label="结果"
              >阿萨德</el-descriptions-item
            >
          </el-descriptions>
        </div>
        <div style="width: 34%; float: left">
          <template>
            <div
              id="myChart"
              :style="{ left: '50px', width: '400px', height: '300px' }"
            ></div>
          </template>
        </div>
      </div>
    </el-card>
    <el-card
      class="box-card"
      style="margin-left: 10px; width: 98%; height: 500px"
    >
      <!-- <div slot="header" class="clearfix">
        <span>请选择用例</span>
      </div> -->
      <el-tabs activeName="second" @tab-click="handleClick">
        <el-tab-pane label="单接口用例" name="second">单接口用例</el-tab-pane>
        <el-tab-pane label="业务用例" name="third">业务用例</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
const echarts = require("echarts/lib/echarts");
require("echarts/lib/component/title");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/legend");
require("echarts/lib/chart/pie");
export default {
  name: "TestReport",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
    };
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    drawLine() {
      var myChart = echarts.init(document.getElementById("myChart")); //获取容器元素
      var option = {
        title: {
          text: "业务用例结果数据统计",
          subtext: "数据",
          left: "center",
        },
        tooltip: {
          trigger: "item",
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
              { value: 735, name: "成功" },
              { value: 580, name: "失败" },
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
      window.onresize = myChart.resize;
      myChart.setOption(option); //设置option
    },
  },
};
</script>

<style>
</style>