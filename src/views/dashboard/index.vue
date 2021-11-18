<template>
  <div>
    <div>
      <el-select v-model="project_id" placeholder="请选择项目">
        <el-option
          v-for="item in tableData"
          :key="item.id"
          :label="item.project_name"
          :value="item.id"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import { get_project_list } from "@/api/interfaceTesting";
export default {
  data() {
    return {
      project_id: "",
      tableData: []
    };
  },
  created() {
    get_project_list().then(response => {
      this.tableData = response.data;
      this.project_id = localStorage.getItem("project_id");
      console.log(this.project_id);
      if (this.project_id == null) {
        localStorage.setItem(
          "project_id",
          JSON.stringify(this.tableData[0].id)
        );
      }
      this.project_id = parseInt(localStorage.getItem("project_id"));
    });
  },
  watch: {
    project_id(newValue) {
      localStorage.setItem("project_id", JSON.stringify(newValue));
    }
  }
};
</script>

<style >
</style>