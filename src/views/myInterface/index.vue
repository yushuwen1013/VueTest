<template>
    <div style="background:#EAEAEA; height: 1000px">
      <div style="background:#fff">
        <p style="width: 1600px;height: 30px;padding-left: 31px;font-size:22px;">接口目录</p>
        </div>
      <div>
        <el-button style="margin-left: 20px;margin-bottom: 20px;" type="primary" icon="el-icon-plus"  @click="addTab(editableTabsValue)">添加</el-button>
        <el-tabs v-model="editableTabsValue" type="border-card" closable @tab-remove="removeTab" tab-position="left" style="height: 800px;">
          <el-tab-pane
            v-for="(item) in editableTabs"
            :key="item.name"
            :label="item.title"
            :name="item.name">
            <Table :tableData='tableData'/>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    
</template>

<script>
  import Table from './Table'
  export default {
    components:{Table},
    data() {
      return {
        tableData: [{
          name: '登录',
          method: 'get',
          url: 'http://127.0.0.1:8000/user/login',
          body: `{"sss": "sdsd"}`,
          params: "{}"
        }],
        editableTabsValue: '2',
        editableTabs: [{
          title: 'Tab 1',
          name: '1',
          content: 'Tab 1 content'
        }],
        tabIndex: 1
      }
    },
    methods: {
      //添加目录
      addTab(targetName) {
        this.$prompt('请输入目录名', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputErrorMessage: "输入不能为空",
            inputValidator: (value) => {       // 点击按钮时，对文本框里面的值进行验证
                        if(!value.trim()) {
                            return '输入不能为空';
                        }}
          }).then(({ value }) => {
            this.$message({
              type: 'success',
              message: '文件名称是: ' + value,
            });
            let newTabName = ++this.tabIndex + '';
            this.editableTabs.push({
              title: value,
              name: newTabName,
            });
            this.editableTabsValue = newTabName;
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });       
          })
        
        
      },
      //删除目录
      removeTab(targetName) {
        this.$confirm('此操作将永久删除该目录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
