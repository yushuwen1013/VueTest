<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column label="Key" show-overflow-tooltip>
      <template slot-scope="scope">
        <el-input v-model="scope.row.key" placeholder="请输入key"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="Value" show-overflow-tooltip>
      <template slot-scope="scope">
        <el-input v-model="scope.row.value" placeholder="请输入value"></el-input>
      </template>
    </el-table-column>
    <slot></slot>
    <el-table-column fixed="right" width="125">
      <template slot="header" slot-scope="scope">
        <el-button
          @click.native.prevent="addRow(scope.$index, tableData)"
          type="primary"
          size="medium"
        >添加</el-button>
      </template>
      <template slot-scope="scope">
        <el-button
          @click.native.prevent="deleteRow(scope.$index, tableData)"
          type="text"
          size="medium"
        >移除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "Tables",
  props: ["TableData"],
  data() {
    return {
      tableData: this.TableData
    };
  },
  methods: {
    //删除table
    deleteRow(index, rows) {
      console.log(index, "sssssssssssss", rows.length);
      rows.splice(index, 1);
      this.$message({
        message: "移除成功！",
        type: "success"
      });
      // if(rows.length !== 1){
      //     rows.splice(index, 1);
      //     this.$message({
      //         message: '移除成功！',
      //         type: 'success',
      //         });
      // }
      // else{
      //     this.$message({
      //         message: '最后一条数据不能被移除哦！',
      //         type: 'error',
      //         });
      // }
    },
    //添加table
    addRow(index, rows) {
      this.tableData.push({
        key: "",
        value: "",
        description: ""
      });
      this.$message({
        message: "添加成功！",
        type: "success"
      });
    }
  }
};
</script>

<style>
</style>