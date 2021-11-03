<template>
  <div style="height: 100%;position: relative">
    <div style="margin-left: 20px;margin-bottom: 15px;">
      <el-button type="primary" size="small" @click="back">返回</el-button>
      <el-button type="primary" size="small" @click="save(updateForm)">保存</el-button>
    </div>
    <el-card class="box-card" style="float:left;margin-left: 10px;width: 40%;height:700px;">
      <div slot="header" class="clearfix">
        <span>添加任务</span>
      </div>
      <div>
        <el-form :model="updateForm">
          <el-form-item label="任务名称" label-width="80px" size='small'>
            <el-input v-model="updateForm.task_name" autocomplete="off" placeholder="请输入变量名"></el-input>
          </el-form-item>
          <el-form-item label="起始日期" label-width="80px" size='small'>
            <template>
              <div class="block">
                <span class="demonstration"></span>
                <el-date-picker
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-model="updateForm.fromDate"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="间隔时间" label-width="80px" size='small'>
            <el-input
              v-model.number="updateForm.interval_time.day"
              autocomplete="off"
              style="width:80px;"
              @keyup.native="prevent($event, 'day')"
            >
              <span slot="suffix">天</span>
            </el-input>
            <el-input
              v-model.number="updateForm.interval_time.hour"
              autocomplete="off"
              style="width:80px;margin-left: 10px;"
              @keyup.native="prevent($event, 'hour')"
            >
              <span slot="suffix">时</span>
            </el-input>
            <el-input
              v-model.number="updateForm.interval_time.minute"
              autocomplete="off"
              style="width:80px;margin-left: 10px;"
              @keyup.native="prevent($event, 'minute')"
            >
              <span slot="suffix">分</span>
            </el-input>
            <el-input
              v-model.number="updateForm.interval_time.second"
              autocomplete="off"
              style="width:80px;margin-left: 10px;"
              @keyup.native="prevent($event, 'second')"
            >
              <span slot="suffix">秒</span>
            </el-input>
          </el-form-item>
          <el-form-item label="描述" label-width="80px" size='small'>
            <el-input v-model="updateForm.description" autocomplete="off" placeholder="请输入描述"></el-input>
          </el-form-item>
          <el-form-item label="是否发送邮件" label-width="80px" size='small'>
            <el-input v-model="updateForm.description" autocomplete="off" placeholder="请输入描述"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card" style="float:right;margin-left: 10px;width: 58%;height:700px;">
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
              <el-input placeholder="输入关键字进行过滤" v-model="filterInterfaceText"></el-input>
              <el-tree
                :data="myInterfaceData"
                show-checkbox
                node-key="id"
                ref="myInterfaceData"
                :default-expanded-keys="[1]"
                :filter-node-method="filterInterfaceData"
              >
                <span class="custom-tree-node" slot-scope="{ node }">
                  <span class="tmp" :title="node.data.file_name">
                    <i :class="node.data.children ?'el-icon-folder':'el-icon-tickets'"></i>
                    {{ node.data.children ? node.data.file_name: node.data.request_name}}
                  </span>
                </span>
              </el-tree>
            </div>
          </el-tab-pane>
          <el-tab-pane label="业务用例" name="second">
            <div>
              <el-input placeholder="输入关键字进行过滤" v-model="filterUseCaseText"></el-input>
              <el-tree
                :data="myUseCaseData"
                show-checkbox
                node-key="id"
                ref="myUseCaseData"
                :default-expanded-keys="[1]"
                :filter-node-method="filterUseCaseData"
              >
                <span class="custom-tree-node" slot-scope="{ node }">
                  <span class="tmp" :title="node.data.file_name">
                    <i :class="node.data.children ?'el-icon-folder':'el-icon-tickets'"></i>
                    {{ node.data.use_case_name}}
                  </span>
                </span>
              </el-tree>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-card>
  </div>
</template>

<script>
import { update_task } from "@/api/interfaceTesting";
import { get_all_file, get_use_case } from "@/api/interfaceTesting";
export default {
  data() {
    return {
      filterUseCaseText: "", //过滤业务用例
      filterInterfaceText: "", //过滤单接口用例
      //项目id
      project_id: localStorage.getItem("project_id"),
      myUseCaseData: [], //业务用例数据
      active: "",
      myInterfaceData: [], //单接口用例数据
      updateForm: {
        task_name: "", // 任务名称
        fromDate: "", // 起始日期
        interval_time: {
          //间隔时间
          day: 0,
          hour: 0,
          minute: 0,
          second: 0
        },
        description: "", // 描述
        project_id: localStorage.getItem("project_id") // 项目id
      }
    };
  },
  methods: {
    //禁止输入小数和负数
    prevent(e, value) {
      var keynum = window.event ? e.keyCode : e.which; //获取键盘码
      if (keynum == 189 || keynum == 190 || keynum == 109 || keynum == 110) {
        this.$message.warning("禁止输入小数以及负数");
      }
      if(e.target.value == ''){
        this.updateForm.interval_time[value] = 0
      }
    },
    //保存任务
    save(updateForm) {
      const interface_case = [];
      this.$refs.myInterfaceData.getCheckedNodes().forEach(element => {
        if (!element.children) {
          interface_case.push(element.id);
        }
      });
      const business_case = [];
      this.$refs.myUseCaseData.getCheckedNodes().forEach(element => {
        business_case.push(element.id);
      });
      if (interface_case.length == 0 || interface_case.length == 0) {
      }
      const request_data = {
        task_name: updateForm.task_name, //任务名称Str
        fromDate: updateForm.fromDate == ''? []: updateForm.fromDate, //起始日期Str
        interval_time: updateForm.interval_time, //间隔时间Str
        description: updateForm.description, //描述Str
        interface_case, //单接口用例数组
        business_case, //业务用例数组
        project_id: this.$parent.project_id //项目id
      };
      //发送保存任务请求
      update_task(request_data).then(response => {
        console.log(response);
      });
      console.log(request_data, "request_data");
    },
    //过滤单接口用例
    filterInterfaceData(value, data) {
      if (!value) return true;
      return data.file_name.indexOf(value) !== -1;
    },
    //过滤业务用例
    filterUseCaseData(value, data) {
      if (!value) return true;
      return data.use_case_name.indexOf(value) !== -1;
    },
    // slide(item, index) {
    //   this.active = item.file_name;
    // },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    back() {
      this.$parent.isShowEditTasks = false;
    }
  },
  created() {
    //获取全部文件接口列表
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
    //获取用例列表
    get_use_case({ project_id: this.project_id })
      .then(response => {
        console.log(response.data);
        this.myUseCaseData = response.data;
      })
      .catch(error => {
        this.$message({
          message: "获取失败",
          type: "error"
        });
        console.log(error);
      });
  },
  watch: {
    filterInterfaceText(val) {
      this.$refs.myInterfaceData.filter(val);
    },
    filterUseCaseText(val) {
      this.$refs.myUseCaseData.filter(val);
    },
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