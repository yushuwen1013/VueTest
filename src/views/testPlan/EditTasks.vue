<template>
  <div>
    <div style="margin-left: 20px;margin-bottom: 15px;">
      <el-button type="primary" size="small" @click="back">返回</el-button>
      <el-button type="primary" size="small" @click="back">保存</el-button>
    </div>
    <el-card class="box-card" style="float:left;height: 725px;margin-left: 10px;width: 40%;">
      <div slot="header" class="clearfix">
        <span>添加任务</span>
      </div>
      <div>
        <el-form :model="updateForm" label-position="top">
          <el-form-item label="任务名称" label-width="80px">
            <el-input v-model="updateForm.task_name" autocomplete="off" placeholder="请输入变量名"></el-input>
          </el-form-item>
          <el-form-item label="起始日期" label-width="80px">
            <template>
              <div class="block">
                <span class="demonstration"></span>
                <el-date-picker
                  v-model="updateForm.fromDate"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="间隔时间" label-width="80px">
            <el-input
              v-model.number="updateForm.interval_time.day"
              autocomplete="off"
              style="width:100px;"
            >
              <span slot="suffix">天</span>
            </el-input>
            <el-input
              v-model.number="updateForm.interval_time.hour"
              autocomplete="off"
              style="width:100px;margin-left: 10px;"
            >
              <span slot="suffix">时</span>
            </el-input>
            <el-input
              v-model.number="updateForm.interval_time.minute"
              autocomplete="off"
              style="width:100px;margin-left: 10px;"
            >
              <span slot="suffix">分</span>
            </el-input>
            <el-input
              v-model.number="updateForm.interval_time.second"
              autocomplete="off"
              style="width:100px;margin-left: 10px;"
            >
              <span slot="suffix">秒</span>
            </el-input>
          </el-form-item>
          <el-form-item label="描述" label-width="80px">
            <el-input v-model="updateForm.description" autocomplete="off" placeholder="请输入描述"></el-input>
          </el-form-item>
          <el-form-item label="是否发送邮件" label-width="80px">
            <el-input v-model="updateForm.description" autocomplete="off" placeholder="请输入描述"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card" style="float:left;height: 725px;margin-left: 10px;width: 58%;">
      <div slot="header" class="clearfix">
        <span>请选择用例</span>
      </div>
      <template>
        <el-tabs @tab-click="handleClick" activeName="first">
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
            <div>
              <el-tree
                :data="myInterfaceData"
                show-checkbox
                node-key="id"
                ref="myInterfaceData"
                :default-expanded-keys="[1]"
              >
                <span class="custom-tree-node" slot-scope="{ node }">
                  <span class="tmp" :title="node.data.file_name">
                    <i class="el-icon-folder"></i>
                    <!-- {{ node.data.file_name }} -->
                    {{ node.data.children ? node.data.file_name: node.data.request_name}}
                  </span>
                  <span>
                    <el-button type="text" size="mini" @click="() => editFile(node)">编辑</el-button>
                    <el-button type="text" size="mini" @click="() => deleteFile(node)">删除</el-button>
                  </span>
                </span>
              </el-tree>
            </div>
          </el-tab-pane>
          <el-tab-pane label="业务用例" name="second">业务用例</el-tab-pane>
        </el-tabs>
      </template>
    </el-card>
  </div>
</template>

<script>
import {
  get_request_list,
  update_request,
  delete_request,
  get_all_file
  
} from "@/api/interfaceTesting";
import {
  get_file_list,
  create_file,
  delete_file
} from "@/api/interfaceTesting";
export default {
  data() {
    return {
      //项目id
      project_id: localStorage.getItem("project_id"),
      wpList: [
        {
          file_name: "食品饮料"
        },
        {
          file_name: "鲜花"
        }
      ],
      active: "",
      myInterfaceData: [],
      updateForm: {
        task_name: "", // 任务名称
        fromDate: "", // 起始日期
        interval_time: {
          //间隔时间
          day: "",
          hour: "",
          minute: "",
          second: ""
        },
        description: "", // 描述
        project_id: localStorage.getItem("project_id") // 项目id
      }
    };
  },
  methods: {
    //编辑文件
    editFile(node) {
      console.log(this.$refs.myInterfaceData.getCheckedNodes())
      console.log(node, "2222222222222");
    },
    slide(item, index) {
      this.active = item.file_name;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    back() {
      this.$parent.isShowEditTasks = false;
    }
  },
  created() {
    //获取文件列表
    get_all_file({ project_id: this.project_id })
      .then(response => {
        console.log(response.data);
        this.wpList = response.data;
        this.myInterfaceData = response.data;
      })
      .catch(error => {
        this.$message({
          message: "获取失败",
          type: "error"
        });
        console.log(error);
      });
  }
};
</script>

<style>
/* .active {
  font-size: 16px;

  color: red;
} */
.active {
  background: #dcdfe6;
  /* border: 1px solid #fd7522; */
  /* color: #fff; */
}
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