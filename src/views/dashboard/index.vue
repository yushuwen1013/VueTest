<template>
  <div>
    
    <div class="contentsss" ref="test">
      <div id="myChart" :style="{ width: '1500px', height: '460px' }"></div>
    </div>
    <button @click="export2Excel">导出</button>
  </div>
</template>

<script>
const echarts = require("echarts/lib/echarts");
require("echarts/lib/component/title");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/legend");
require("echarts/lib/chart/pie");
export default {
  data() {
    return {
      html: ""
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
          text: "Referer of a Website",
          subtext: "Fake Data",
          left: "center"
        },
        tooltip: {
          trigger: "item"
        },
        legend: {
          orient: "vertical",
          left: "left"
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: "50%",
            data: [
              { value: 1048, name: "Search Engine" },
              { value: 735, name: "Direct" },
              { value: 580, name: "Email" },
              { value: 484, name: "Union Ads" },
              { value: 300, name: "Video Ads" }
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
      window.onresize = myChart.resize;
      myChart.setOption(option); //设置option
    },
    export2Excel() {
      var a = document.createElement("a");
      var url = window.URL.createObjectURL(
        new Blob([this.gethtml()], {
          type: ""
        })
      );
      a.href = url;
      a.download = "file.html";
      a.click();
      window.URL.revokeObjectURL(url);
    },
    gethtml() {
      const template = this.$refs.test.innerHTML;
      let html = `<!DOCTYPE html>
                  <html>
                  <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width,initial-scale=1.0">
                  <title>动态表单测试</title>
                  <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css" />
                    
                  </head>
                  <body>
                  <div class="resume_preview_page" style="margin:0 auto;width:1200px">
                  ${template}
                  </div>
                  </body>
                  </html>`;
      return html;
    }
  }
};
</script>

<style >
</style>