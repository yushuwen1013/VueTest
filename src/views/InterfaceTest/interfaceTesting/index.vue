<template>
  <el-main style="position: relative;">
    <!-- <el-button @click="addTab(editableTabsValue)" type="primary" icon="el-icon-plus"></el-button> -->
    <el-tabs v-model="editableTabsValue" type="border-card" closable @tab-remove="removeTab">
      <el-tab-pane
        :key="item.name"
        v-for="(item) in editableTabs"
        :label="item.title"
        :name="item.name"
      >
        <Request />
      </el-tab-pane>
    </el-tabs>
    <el-button
      @click="addTab(editableTabsValue)"
      size="mini"
      type="primary"
      icon="el-icon-plus"
      style="position: absolute;right:40px;top:26px;"
    >添加</el-button>
  </el-main>
</template>

<script>
import Pesponse from "./Response";
import Request from "./Request";
export default {
  name: "InterfaceTesting",
  components: { Pesponse, Request },
  data() {
    return {
      activeIndex: "1",
      activeIndex: "2",
      editableTabsValue: "1",
      editableTabs: [
        {
          title: "Request",
          name: "1"
        }
      ],
      tabIndex: 1
    };
  },
  methods: {
    addTab(targetName) {
      let newTabName = ++this.tabIndex + "";
      this.editableTabs.push({
        title: "New Request",
        name: newTabName
      });
      this.editableTabsValue = newTabName;
      // localStorage.setItem("editableTabs", JSON.stringify(this.editableTabs));
    },
    removeTab(targetName) {
      console.log(this.editableTabs, "this.editableTabs");
      if (this.editableTabs.length == 1) {
        this.$notify.error({
          title: "删除失败",
          message: "最后一条不能被删除"
        });
      } else {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }
    }
  },
  created() {
    // if (localStorage.getItem("editableTabs") == null) {
    //   this.editableTabs = [
    //     {
    //       title: "Request",
    //       name: "1"
    //     }
    //   ];
    // } else {
    //   this.editableTabs = JSON.parse(localStorage.getItem("editableTabs"));
    // }
  }
};
</script>

<style lang="css" scoped>
.el-select .el-input {
  width: 150px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
