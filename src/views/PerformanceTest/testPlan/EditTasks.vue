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
          <el-form-item label="任务名称" label-width="80px" size="small">
            <el-input v-model="updateForm.task_name" autocomplete="off" placeholder="请输入变量名"></el-input>
          </el-form-item>
          <el-form-item label="定时任务" label-width="80px" size="small">
            <el-switch v-model="updateForm.task_status"></el-switch>
          </el-form-item>
          <el-form-item label="定时类型" label-width="80px" size="small">
            <el-radio-group v-model="updateForm.timer_type">
              <el-tooltip content="到达设置的执行时间执行一次" placement="bottom" effect="light">
                <el-radio :label="1">定点执行</el-radio>
              </el-tooltip>
              <el-tooltip content="根据间隔时间循环执行" placement="bottom" effect="light">
                <el-radio :label="2">间隔执行</el-radio>
              </el-tooltip>
              <el-tooltip placement="bottom" effect="light">
                <div slot="content">
                  当前时间与所有指定的时间约束匹配时触发，类似于Linux cron定时任务程序。
                  <br />second（int | str） - second（0-59）
                  <br />minute（int | str） - 分钟（0-59）
                  <br />hour （int | str） - 小时（0-23）
                  <br />day（int | str） - （1-31）日
                  <br />month（int | str） - 月（1-12）
                  <br />day_of_week（int | str） - 工作日的数字或名称（0-6或星期一，星期二，星期三，星期四，星期五，星期五，星期日）
                  <br />day_of_week（int | str） - 工作日的数字或名称（0-6或星期一，星期二，星期三，星期四，星期五，星期五，星期日）
                  <br />year：4位数字的年份。
                </div>
                <el-radio :label="3">cron</el-radio>
              </el-tooltip>
            </el-radio-group>
            <span style="margin-left: 20px;" class="el-icon-question" @click="help"></span>
          </el-form-item>
          <el-form-item
            v-show="updateForm.timer_type == 2"
            label="起始日期"
            label-width="80px"
            size="small"
          >
            <template>
              <div class="block">
                <span class="demonstration"></span>
                <el-date-picker
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-model="fromDate"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </div>
            </template>
          </el-form-item>
          <el-form-item
            v-show="updateForm.timer_type == 2"
            label="间隔时间"
            label-width="80px"
            size="small"
          >
            <el-input
              v-model.number="interval_time.day"
              autocomplete="off"
              style="width:80px;"
              @keyup.native="prevent($event, 'day')"
            >
              <span slot="suffix">天</span>
            </el-input>
            <el-input
              v-model.number="interval_time.hour"
              autocomplete="off"
              style="width:80px;margin-left: 10px;"
              @keyup.native="prevent($event, 'hour')"
            >
              <span slot="suffix">时</span>
            </el-input>
            <el-input
              v-model.number="interval_time.minute"
              autocomplete="off"
              style="width:80px;margin-left: 10px;"
              @keyup.native="prevent($event, 'minute')"
            >
              <span slot="suffix">分</span>
            </el-input>
            <el-input
              v-model.number="interval_time.second"
              autocomplete="off"
              style="width:80px;margin-left: 10px;"
              @keyup.native="prevent($event, 'second')"
            >
              <span slot="suffix">秒</span>
            </el-input>
          </el-form-item>
          <el-form-item
            v-show="updateForm.timer_type == 3"
            label="cron表达式"
            label-width="90px"
            size="small"
          >
            <el-input v-model="cron_expression" autocomplete="off" placeholder="请输入cron表达式"></el-input>
          </el-form-item>
          <el-form-item
            v-show="updateForm.timer_type == 1"
            label="执行时间"
            label-width="80px"
            size="small"
          >
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="executionTime"
              type="datetime"
              placeholder="选择日期时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="描述" label-width="80px" size="small">
            <!-- <el-input v-model="updateForm.description" autocomplete="off" placeholder="请输入描述"></el-input> -->
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入描述"
              v-model="updateForm.description"
            ></el-input>
          </el-form-item>
          <el-form-item label="发送邮件" label-width="80px" size="small">
            <template>
              <el-radio-group v-model="updateForm.sendmailStatus">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
                <el-radio :label="3">失败时发送</el-radio>
              </el-radio-group>
            </template>
            <el-input
              v-show="updateForm.sendmailStatus == 1 || updateForm.sendmailStatus == 3?true:false"
              type="textarea"
              :rows="3"
              placeholder="请输入邮箱地址用 ; 隔开"
              v-model="updateForm.mailAddress"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card" style="float:right;margin-left: 10px;width: 58%;height:700px;">
      <div slot="header" class="clearfix">
        <span>请选择脚本</span>
      </div>
      <template>
        <el-tabs @tab-click="handleClick" activeName="jmx">
          <el-tab-pane label="Jmx脚本" name="jmx">
            <div>
              <el-input placeholder="输入关键字进行过滤" v-model="filterJmxScript"></el-input>
              <el-tree
                style="height:500px;overflow:auto;"
                :data="myJmxScript"
                show-checkbox
                node-key="id"
                ref="myJmxScript"
                :default-expanded-keys="[1]"
                :filter-node-method="filterUseCaseData"
                :draggable="true"
                :allow-drop="allowDrop"
                @check-change="handleClick"
              >
                <span class="custom-tree-node" slot-scope="{ node }">
                  <span class="tmp" :title="node.data.file_name">
                    <i :class="node.data.children ?'el-icon-folder':'el-icon-tickets'"></i>
                    {{ node.data.script_name}}
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
import { update_task, get_task } from "@/api/performanceTesting";
import { get_all_file, get_use_case } from "@/api/interfaceTesting";
import { jmx_script } from "@/api/performanceTesting";
export default {
  props: ["updateForm"],
  data() {
    return {
      executionTime: "",
      cron_expression: "",
      //间隔时间
      interval_time: {
        //间隔时间
        day: 0,
        hour: 0,
        minute: 0,
        second: 0
      },
      fromDate: "",
      // timer_type: 2, //定时任务类型 1：定点执行一次，2：间隔执行 3：cron
      filterJmxScript: "", //过滤业务用例
      //项目id
      project_id: localStorage.getItem("project_id"),
      myJmxScript: [] //业务用例数据
    };
  },
  methods: {
    //跳转帮助
    help() {
      window.open(
        "http://note.youdao.com/noteshare?id=c6290ca3b7c22996847de66d5f0a6e60&sub=571EBF4ADEB3489D835FD3099D55E479"
      );
    },
    // 停止拖拽时节点可放置的位置
    allowDrop(moveNode, inNode, type) {
      console.log(moveNode, inNode, type);
      // 停止拖拽后树节点位置不发生改变
      // return type == 'next';
      // 一级拖动到一级
      if (moveNode.level == 1 && inNode.level == 1) {
        // 四种情况
        if (moveNode.nextSibling == undefined) {
          return type == "prev";
        } else if (inNode.nextSibling == undefined) {
          return type == "next";
        } else if (moveNode.nextSibling.id !== inNode.id) {
          return type == "prev";
        } else {
          return type == "next";
        }
      }
    },
    //禁止输入小数和负数
    prevent(e, value) {
      var keynum = window.event ? e.keyCode : e.which; //获取键盘码
      if (keynum == 189 || keynum == 190 || keynum == 109 || keynum == 110) {
        this.$message.warning("禁止输入小数以及负数");
      }
      if (e.target.value == "") {
        this.interval_time[value] = 0;
      }
    },
    save(updateForm) {
      console.log(updateForm);
    },
    //保存任务
    save(updateForm) {
      console.log(this.$refs.myJmxScript.getCheckedNodes());
      // console.log(updateForm);
      if (
        updateForm.timer_type == 2 &&
        this.interval_time.day == 0 &&
        this.interval_time.hour == 0 &&
        this.interval_time.minute == 0 &&
        this.interval_time.second < 60
      ) {
        this.$message({
          message: "间隔时间不能小于1分钟",
          type: "error"
        });
      } else {
        const jmx_script = [];
        this.$refs.myJmxScript.getCheckedNodes().forEach(element => {
          jmx_script.push(element.id);
        });
        if (jmx_script.length == 0) {
          this.$message({
            message: "用例不能为空,请勾选用例后再保存！",
            type: "error"
          });
        } else {
          const request_data = {
            task_name: updateForm.task_name, //任务名称Str
            task_status: updateForm.task_status, //任务状态
            description: updateForm.description, //描述Str
            sendmailStatus: updateForm.sendmailStatus, //发送邮件状态
            mail_address: updateForm.mailAddress, //邮箱地址
            jmx_script, //jmx数组
            project_id: this.$parent.project_id, //项目id
            timer_type: updateForm.timer_type //定时类想
          };
          //如果任务表单有id那么就在请求数据里加id
          if (updateForm.id) {
            request_data.id = updateForm.id;
          }
          if (request_data.timer_type == 2) {
            request_data.timing_details = {
              fromDate: this.fromDate == null ? [] : this.fromDate, //起始日期
              interval_time: this.interval_time //间隔时间Str
            };
          } else if (request_data.timer_type == 1) {
            request_data.timing_details = {
              executionTime: this.executionTime //执行时间
            };
          } else if (request_data.timer_type == 3) {
            request_data.timing_details = {
              cron_expression: this.cron_expression //执行时间
            };
          }
          console.log(request_data);
          // 发送保存任务请求
          update_task(request_data)
            .then(response => {
              this.$parent.isShowEditTasks = false;
              get_task({ project_id: this.project_id }).then(response => {
                this.$parent.taskData = response.data;
              });
              this.$message({
                message: response.message,
                type: "success"
              });
            })
            .catch(error => {
              this.$message({
                message: error.message,
                type: "error"
              });
            });
          console.log(request_data, "request_data");
        }
      }
    },
    //过滤业务用例
    filterUseCaseData(value, data) {
      if (!value) return true;
      return data.script_name.indexOf(value) !== -1;
    },
    //选择节点
    handleClick(data, checked, node) {
      if (checked) {
        //关键
        this.$refs.myJmxScript.setCheckedNodes([data]);
      }
    },
    // handleClick(tab, event) { 
    //   console.log(tab, event);
    // },
    //返回
    back() {
      this.$parent.isShowEditTasks = false;
      this.$parent.updateForm = {
        task_name: "", // 任务名称
        task_status: true, //定时任务
        timer_type: 2, //定时任务类型 1：定点执行一次，2：间隔执行 3：cron
        timingDetails: {
          //定时详情
          fromDate: "", // 起始日期
          interval_time: {
            //间隔时间
            day: 0,
            hour: 1,
            minute: 0,
            second: 0
          },
          executionTime: "",
          cron_expression: "* * 1 * * * *"
        },
        description: "", // 描述
        sendmailStatus: 1, //发送邮件1-是，2-否，3-失败时发送
        mailAddress: "", //邮件地址
        jmx_script: [], //选中的jmx脚本
        project_id: localStorage.getItem("project_id") // 项目id
      }; //任务表单
    },
    //选中jmx脚本的方法
    selectedInterface() {
      //获取用例列表
      jmx_script("get", { project_id: this.project_id }).then(response => {
        console.log(response);
        this.myJmxScript = response.data;
      });
      console.log("我要选中啦", this.updateForm);
      this.interval_time = this.updateForm.timingDetails.interval_time;
      this.fromDate = this.updateForm.timingDetails.fromDate;
      this.executionTime = this.updateForm.timingDetails.executionTime;
      this.cron_expression = this.updateForm.timingDetails.cron_expression;
      console.log(this.interval_time, this.fromDate, "22222222");
      //选中业务用例
      this.$refs.myJmxScript.setCheckedKeys(this.updateForm.jmx_script);
    }
  },
  watch: {
    filterJmxScript(val) {
      this.$refs.myJmxScript.filter(val);
    },
    "updateForm.isSendmail": {
      handler(val) {
        console.log(val);
      }
    }
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