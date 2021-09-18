<template>
  <el-main>
    <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit" >
      <el-tab-pane
      :key="item.name"
      v-for="(item) in editableTabs"
      :label="item.title"
      :name="item.name">
      <Request/>
      </el-tab-pane>
    </el-tabs>
  </el-main>
</template>

<script>
import Pesponse from '../interfaceTesting/Response.vue'
import Request from '../interfaceTesting/Request'
export default {
    components:{Pesponse,Request},
    data() {
      return {
        editableTabsValue: '1',
        editableTabs: [{
          title: 'request 1',
          name: '1',
        }],
        tabIndex: 1
      }
    },
    methods:{
      handleTabsEdit(targetName, action) {
        console.log(targetName,action)
        if (action === 'add') {
          let newTabName = ++this.tabIndex + '';
          this.editableTabs.push({
            title: 'request'+newTabName,
            name: newTabName,
          });
          this.editableTabsValue = newTabName;
        }
        if (action === 'remove') {
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
      },

    }
  }
</script>

<style lang="css" scoped>
.el-select .el-input {
    width: 150px;
  }
.input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
