<template>
  <div style="background:#EAEAEA; height: 100%">
    <div style="background:#fff">
      <p
        style="width: 1600px;height: 60px;padding-left: 31px;font-size:22px;margin-top: 0px;line-height:55px;"
      >
        <span style>执行结果</span>
      </p>
    </div>
    <div v-show="isShowEditTasks">
      <EditTasks ref="EditTasks" :updateForm="updateForm" />
    </div>
    <div v-show="!isShowEditTasks">
      <el-form :inline="true" class="demo-form-inline" style="margin-left: 35px;">
        <el-form-item label="任务名称">
          <el-input v-model="seareTaskName" placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="inquire">查询</el-button>
          <el-button type="primary" size="small" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        height="600"
        :data="taskData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        style="width: 98%;left: 20px;"
        :header-cell-style="{background:'#DCDFE6',color:'#303133'}"
      >
        <el-table-column :show-overflow-tooltip="true" prop="task_name" label="任务名称"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="interface_case" label="单接口用例">
          <template slot-scope="scope">
            <el-tag>{{'总共:'+ JSON.parse(scope.row.interface_case)[0]}}</el-tag>
            <el-tag type="success">{{'成功:'+JSON.parse(scope.row.interface_case)[1]}}</el-tag>
            <el-tag type="danger">{{'失败:'+JSON.parse(scope.row.interface_case)[2]}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="business_case" label="业务用例">
          <template slot-scope="scope">
            <el-tag>{{'总共:'+ JSON.parse(scope.row.business_case)[0]}}</el-tag>
            <el-tag type="success">{{'成功:'+JSON.parse(scope.row.business_case)[1]}}</el-tag>
            <el-tag type="danger">{{'失败:'+JSON.parse(scope.row.business_case)[2]}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="start_time" label="开始时间"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="end_time" label="结束时间"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="description" label="描述"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="status" label="状态" width="70px">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.task_status?'success':'error'"
            >{{scope.row.task_status?'正常':'暂停'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="200" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="deleteTask(scope.$index, scope.row)">查看详情</el-button>
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
  get_executive_outcomes,
  delete_executive_outcomes
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
        fromDate: "", // 起始日期
        interval_time: {
          //间隔时间
          day: 0,
          hour: 0,
          minute: 0,
          second: 0
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
    //删除任务
    deleteTask(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该任务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //删除执行结果
          const id = { id: row.id };
          delete_executive_outcomes(id)
            .then(response => {
              console.log(response.data);
              get_executive_outcomes({ project_id: this.project_id }).then(
                response => {
                  this.taskData = response.data;
                }
              );
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
    //点击编辑
    clickEdit(row) {
      console.log(row);
      console.log(JSON.parse(row.business_case));
      // 编辑任务的表单
      this.updateForm = {
        id: row.id, // 任务id
        task_name: row.task_name, // 任务名称
        task_status: row.task_status, //定时任务
        fromDate: JSON.parse(row.fromDate), // 起始日期
        interval_time: JSON.parse(row.interval_time),
        description: row.description, // 描述
        sendmailStatus: JSON.parse(row.sendmailStatus), //发送邮件1-是，2-否，3-失败时发送
        mailAddress: row.mail_address, //邮件地址
        business_case: JSON.parse(row.business_case), //选中的业务用例
        interface_case: JSON.parse(row.interface_case), //选中的接口用例
        project_id: localStorage.getItem("project_id") // 项目id
      };
      console.log(this.updateForm, "父组件的form");
      //显示编辑任务面板
      this.isShowEditTasks = true;
      //最后在执行
      this.$nextTick(() => {
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
      get_executive_outcomes(request_data).then(response => {
        this.taskData = response.data;
      });
    },
    //重置
    reset() {
      get_executive_outcomes({ project_id: this.project_id }).then(response => {
        this.taskData = response.data;
      });
    }
  },
  created() {
    get_executive_outcomes({ project_id: this.project_id }).then(response => {
      this.taskData = response.data;
    });
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
