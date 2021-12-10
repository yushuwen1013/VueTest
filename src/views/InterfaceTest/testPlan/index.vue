<template>
  <div style="background:#EAEAEA; height: 100%">
    <div style="background:#fff">
      <p
        style="width: 1600px;height: 60px;padding-left: 31px;font-size:22px;margin-top: 0px;line-height:55px;"
      >
        <span style>定时任务</span>
      </p>
    </div>
    <div v-show="isShowEditTasks">
      <EditTasks ref="EditTasks" :updateForm="updateForm" />
    </div>
    <div v-show="!isShowEditTasks">
      <el-form :inline="true" class="demo-form-inline" style="margin-left: 35px;">
        <el-input
          v-model="seareTaskName"
          placeholder="请输入任务名称"
          suffix-icon="el-icon-search"
          style="width:250px"
        ></el-input>
        <el-button
          style="float: right;margin-bottom: 20px;margin-right: 50px;"
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="addTasks"
        >添加</el-button>
      </el-form>
      <el-table
        height="600"
        :data="taskData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        style="width: 98%;left: 20px;"
        :header-cell-style="{background:'#DCDFE6',color:'#303133'}"
      >
        <el-table-column :show-overflow-tooltip="true" prop="task_name" label="任务名称"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="timer_type" label="定时类型">
          <template slot-scope="scope">
            <span v-show="scope.row.timer_type == 1?true:false">
              <el-tag>定点执行</el-tag>
            </span>
            <span v-show="scope.row.timer_type == 2?true:false">
              <el-tag>间隔执行</el-tag>
            </span>
            <span v-show="scope.row.timer_type == 3?true:false">
              <el-tag>cron</el-tag>
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column :show-overflow-tooltip="true" prop="fromDate" label="起始日期">
          <template slot-scope="scope">
            <span>{{scope.row.fromDate.substring(2,21)}}—{{scope.row.fromDate.substring(25,44)}}</span>
          </template>
        </el-table-column>-->
        <!-- <el-table-column :show-overflow-tooltip="true" prop="interval_time" label="间隔时间">
          <template slot-scope="scope">
            <el-tag>
              <span
                v-show="JSON.parse(scope.row.interval_time).day != 0"
              >{{JSON.parse(scope.row.interval_time).day + "天"}}</span>
              <span
                v-show="JSON.parse(scope.row.interval_time).hour != 0"
              >{{JSON.parse(scope.row.interval_time).hour + "小时"}}</span>
              <span
                v-show="JSON.parse(scope.row.interval_time).minute != 0"
              >{{JSON.parse(scope.row.interval_time).minute + "分钟"}}</span>
              <span
                v-show="JSON.parse(scope.row.interval_time).second != 0"
              >{{JSON.parse(scope.row.interval_time).second + "秒"}}</span>
            </el-tag>
          </template>
        </el-table-column>-->
        <el-table-column :show-overflow-tooltip="true" prop="description" label="描述"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="create_time" label="创建时间"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="task_status" label="状态" width="70px">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.task_status?'success':'error'"
            >{{scope.row.task_status?'正常':'暂停'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="300" label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="立即执行一次" placement="top-start">
              <el-button size="mini" type="success" plain @click="executeTask(scope.row)">执行</el-button>
            </el-tooltip>
            <el-button
              size="mini"
              @click="switchStakeState(scope.row)"
            >{{scope.row.task_status?'暂停':'恢复'}}</el-button>
            <el-button size="mini" @click="clickEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteTask(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页显示 -->
      <el-pagination
        style="text-align:center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="taskData.length"
      >//这是显示总共有多少数据，</el-pagination>
    </div>
  </div>
</template>

<script>
import EditTasks from "./EditTasks";
import {
  update_task,
  get_task,
  delete_task,
  execute_task,
  switch_stake_state
} from "@/api/interfaceTesting";
export default {
  components: { EditTasks },
  data() {
    return {
      isShowEditTasks: false,
      project_id: localStorage.getItem("project_id"),
      updateForm: {
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
        business_case: [], //选中的业务用例
        interface_case: [], //选中的接口用例
        project_id: localStorage.getItem("project_id") // 项目id
      }, //任务表单
      dialogFormVisible: false, //添加或编辑弹窗
      currentPage: 1, //初始页
      pagesize: 10, //    每页的数据
      taskData: [],
      seareTaskName: "" //搜索框的值
    };
  },
  methods: {
    //初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function(size) {
      this.pagesize = size;
      console.log(this.pagesize); //每页下拉显示数据
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      console.log(this.currentPage); //点击第几页
    },
    //执行任务
    executeTask(row) {
      console.log(row);
      execute_task({ task_id: row.id })
        .then(response => {
          console.log(response.data);
          this.$message({
            message: response.message,
            type: "success"
          });
        })
        .catch(error => {
          this.$message({
            message: "执行失败",
            type: "error"
          });
          console.log(error);
        });
    },
    //切换任务状态
    switchStakeState(row) {
      console.log(row.task_status);
      switch_stake_state({
        task_id: row.id,
        task_status: row.task_status
      })
        .then(response => {
          console.log(response);
          get_task({ project_id: this.project_id }).then(response => {
            this.taskData = response.data;
          });
        })
        .catch(error => {
          get_task({ project_id: this.project_id }).then(response => {
            this.taskData = response.data;
          });
          this.$message.error(error.message);
        });
    },
    //删除任务
    deleteTask(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该任务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //删除任务接口
          const id = { id: row.id };
          delete_task(id)
            .then(response => {
              console.log(response.data);
              get_task({ project_id: this.project_id }).then(response => {
                this.taskData = response.data;
              });
            })
            .catch(error => {
              this.$message({
                message: "删除失败",
                type: "error"
              });
              console.log(error);
            });
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //添加任务
    addTasks() {
      this.isShowEditTasks = true;
      this.$nextTick(() => {
        //调用子组件EditTasks的选中用例方法
        this.$refs.EditTasks.selectedInterface();
      });
    },
    //点击编辑
    clickEdit(row) {
      console.log(row, "ssssssssss");
      // 编辑任务的表单
      this.updateForm = {
        id: row.id, // 任务id
        task_name: row.task_name, // 任务名称
        task_status: row.task_status, //定时任务
        timingDetails: row.timing_details, //定时详情
        timer_type: row.timer_type, //定时类型
        description: row.description, // 描述
        sendmailStatus: JSON.parse(row.sendmailStatus), //发送邮件1-是，2-否，3-失败时发送
        mailAddress: row.mail_address, //邮件地址
        business_case: JSON.parse(row.business_case), //选中的业务用例
        interface_case: JSON.parse(row.interface_case), //选中的接口用例
        project_id: localStorage.getItem("project_id") // 项目id
      };
      if (this.updateForm.timer_type == 1) {
        this.updateForm.timingDetails.fromDate = "";
        this.updateForm.timingDetails.interval_time = {
          //间隔时间
          day: 0,
          hour: 1,
          minute: 0,
          second: 0
        };
        this.updateForm.timingDetails.cron_expression = "* * 1 * * * *";
      } else if (this.updateForm.timer_type == 2) {
        this.updateForm.timingDetails.cron_expression = "* * 1 * * * *";
        this.executionTime = "";
      } else if (this.updateForm.timer_type == 3) {
        this.updateForm.timingDetails.fromDate = "";
        this.updateForm.timingDetails.interval_time = {
          //间隔时间
          day: 0,
          hour: 1,
          minute: 0,
          second: 0
        };
        this.updateForm.timingDetails.executionTime = "";
      }
      console.log(this.updateForm, "父组件的form");
      //最后在执行
      this.$nextTick(() => {
        //显示编辑任务面板
        this.isShowEditTasks = true;
        //调用子组件EditTasks的选中用例方法
        this.$refs.EditTasks.selectedInterface();
      });
    },
    //查询
    inquire() {
      const request_data = {
        project_id: this.project_id,
        task_name: this.seareTaskName
      };
      get_task(request_data).then(response => {
        this.taskData = response.data;
      });
    },
    //重置
    reset() {
      get_task({ project_id: this.project_id }).then(response => {
        this.taskData = response.data;
      });
    }
  },
  created() {
    get_task({ project_id: this.project_id }).then(response => {
      this.taskData = response.data;
    });
  },
  watch: {
    seareTaskName(newVal) {
      const request_data = {
        project_id: this.project_id,
        task_name: this.seareTaskName
      };
      get_task(request_data).then(response => {
        this.taskData = response.data;
        this.currentPage = 1;
      });
    }
  }
};
</script>

<style>
.el-tooltip__popper {
  max-width: 20%;
}
.el-tooltip__popper,
.el-tooltip__popper.is-dark {
  background: rgb(48, 65, 86) !important;
  color: #fff !important;
  line-height: 24px;
}
.app-main[data-v-078753dd] {
  background: rgb(234, 234, 234);
  height: 100%;
}
</style>
