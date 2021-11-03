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
      <EditTasks />
    </div>
    <div v-show="!isShowEditTasks">
      <el-form :inline="true" class="demo-form-inline" style="margin-left: 35px;">
        <el-form-item label="任务名称">
          <el-input v-model="seareVariableKey" placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="inquire">查询</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-form-item>
        <el-button
          style="float: right;margin-bottom: 20px;margin-right: 50px;"
          type="primary"
          icon="el-icon-plus"
          @click="isShowEditTasks = true"
        >添加</el-button>
      </el-form>
      <el-table
        height="600"
        :data="taskData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        style="width: 98%;left: 20px;"
        :header-cell-style="{background:'#DCDFE6',color:'#303133'}"
      >
        <el-table-column :show-overflow-tooltip="true" prop="task_name" label="任务名称"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="fromDate" label="起始日期"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="interval_time" label="间隔时间"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="description" label="描述"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="task_status" label="状态"></el-table-column>
        <el-table-column width="275" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="clickEdit(scope.row)">执行</el-button>
            <el-button size="mini" @click="clickEdit(scope.row)">暂停</el-button>
            <el-button size="mini" @click="clickEdit(scope.row)">修改</el-button>
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
    <!-- <el-dialog title="添加任务" :visible.sync="dialogFormVisible" fullscreen>
      <div>
        <div style="float:left;width:600px">
          <el-form :model="updateForm">
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
                style="width:100px;margin-left: 10px;"
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
          </el-form>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addVariable">确 定</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>

<script>
import EditTasks from "./EditTasks";
import { update_task, get_task, delete_task } from "@/api/interfaceTesting";
export default {
  components: { EditTasks },
  data() {
    return {
      isShowEditTasks: false,
      project_id: localStorage.getItem("project_id"),
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
      },
      dialogFormVisible: false, //添加或编辑弹窗
      currentPage: 1, //初始页
      pagesize: 10, //    每页的数据
      taskData: [],
      seareVariableKey: "" //搜索框的值
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
    //点击编辑
    clickEdit(row) {
      this.dialogFormVisible = true;
      this.updateForm = {
        key: row.key,
        value: row.value,
        description: row.description,
        project_id: localStorage.getItem("project_id"),
        id: row.id
      };
    },
    // //确定添加变量
    // addVariable() {
    //   console.log(this.updateForm);
    //   if (
    //     this.updateForm.task_name.trim() == "" ||
    //     this.updateForm.task_name.trim() == ""
    //   ) {
    //     this.$message({
    //       message: "key和value不能为空",
    //       type: "error"
    //     });
    //   } else {
    //     update_task(this.updateForm)
    //       .then(response => {
    //         get_task({ project_id: this.project_id }).then(response => {
    //           this.taskData = response.data;
    //         });
    //         this.updateForm = {
    //           key: "",
    //           value: "",
    //           description: "",
    //           project_id: localStorage.getItem("project_id")
    //         };
    //         this.$message({
    //           message: response.data,
    //           type: "success"
    //         });
    //         this.dialogFormVisible = false;
    //       })
    //       .catch(error => {
    //         console.log(error);
    //         this.$message({
    //           message: error.message,
    //           type: "error"
    //         });
    //         console.log(error);
    //       });
    //   }
    // },
    //查询
    inquire() {
      const request_data = {
        project_id: this.project_id,
        variable_key: this.seareVariableKey
      };
      get_task({ project_id: this.project_id }).then(response => {
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
