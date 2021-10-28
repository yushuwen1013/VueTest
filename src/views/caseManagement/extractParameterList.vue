<template>
  <el-table :data="extractParameterList" max-height="300">
    <el-table-column width="150" :show-overflow-tooltip="true" property="variableName" label="Key"></el-table-column>
    <el-table-column property="variableValue" :show-overflow-tooltip="true" label="Value"></el-table-column>
    <el-table-column width="80" label="操作">
      <template slot-scope="scope">
        <el-button size="mini" type="primary" plain @click="copyKey(scope.$index, scope.row)">复制</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import {
  get_extract_parameter
} from "@/api/interfaceTesting";
export default {
  name: "ExtractParameterList.vue",
  props: ['extractParameterList'],
  data() {
    return {
    //   //提取到的参数列表
    //   extractParameterList: []
    };
  },
  methods: {
    //复制Key
    copyKey(index, rows) {
      let data = rows.variableName;
      let oInput = document.createElement("input");
      oInput.value = data;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象;
      console.log(oInput.value);
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message({
        message: "已成功复制Key到剪切板",
        type: "success"
      });
      oInput.remove();
    }
  },
};
</script>

<style>
</style>