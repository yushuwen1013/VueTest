<template>
  <div style="background: #eaeaea; height: 100%">
    <router-view></router-view>
    <div>
      <div style="background: #fff">
        <p
          style="
            width: 1600px;
            height: 60px;
            padding-left: 31px;
            font-size: 22px;
            margin-top: 0px;
            line-height: 55px;
          "
        >
          <span style>执行结果</span>
        </p>
      </div>
      <div>
        <el-form :inline="true" class="demo-form-inline" style="margin-left: 35px;float: left">
          <el-form-item>
            <el-input placeholder="请输入任务id" suffix-icon="el-icon-search" v-model="seareTaskName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="danger"
              style="margin-left: 50px"
              plain
              size="small"
              @click="deleteSelection"
            >删除选中</el-button>
          </el-form-item>
        </el-form>
        <el-table
          height="600"
          :data="
            taskData.slice((currentPage - 1) * pagesize, currentPage * pagesize)
          "
          style="width: 98%; left: 20px"
          ref="table"
          :header-cell-style="{ background: '#DCDFE6', color: '#303133' }"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="id" width="70px" label="报告id"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="task_name" label="任务名称"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="用例">
            <template slot-scope="scope">
              <el-tag size="mini">
                {{
                "总共:" + (scope.row.use_case_error + scope.row.use_case_success)
                }}
              </el-tag>
              <el-tag size="mini" type="success">
                {{
                "成功:" + scope.row.use_case_success
                }}
              </el-tag>
              <el-tag size="mini" type="danger">
                {{
                "失败:" + scope.row.use_case_error
                }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="create_time" label="开始时间"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="end_time" label="结束时间"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="status" label="状态" width="100px">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status == '执行完成' ? 'success' : 'error'">
                {{
                scope.row.status
                }}
              </el-tag>
              <!-- <el-tag :type="scope.row.task_status ? 'success' : 'error'">{{scope.row.status}}</el-tag> -->
            </template>
          </el-table-column>
          <el-table-column width="200" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="viewDetails(scope.$index, scope.row)">查看详情</el-button>
              <el-button size="mini" type="danger" @click="deleteTask(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页显示 -->
        <el-pagination
          style="text-align: center"
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
  </div>
</template>

<script>
import { get_all_file, get_use_case } from "@/api/interfaceTesting";
import {
  get_executive_outcomes,
  delete_executive_outcomes,
  get_task
} from "@/api/interfaceTesting";
import { Report } from "@/api/WebUiTest/timedTask";
export default {
  data() {
    return {
      project_id: localStorage.getItem("project_id"), //项目id
      currentPage: 1, //初始页
      pagesize: 10, //    每页的数据
      taskData: [], //任务数据
      seareTaskName: "" //搜索框的值
    };
  },
  methods: {
    // 查看详情
    viewDetails(index, row) {
      this.$router.push({
        path: "/webui/ExecutiveOutcomes/testReport",
        query: {
          id: row.id
        }
      });
    },
    //删除选中的任务
    deleteSelection() {
      console.log(this.$refs.table.selection);
      const selectionTask = [];
      this.$refs.table.selection.forEach(ele => {
        selectionTask.push(ele.id);
      });
      if (selectionTask.length == 0) {
        this.$message({
          message: "请选中任务报告后再点击删除",
          type: "error"
        });
      } else {
        this.$confirm("此操作将永久删除选中的全部报告, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          //删除报告
          Report("delete", { id: selectionTask })
            .then(response => {
              Report("get", { project_id: this.project_id }).then(res => {
                this.taskData = res.data.reverse();
              });
              this.$message.success(response.message);
            })
            .catch(error => {
              this.$message.error(error.message);
            });
        });
      }
      console.log(selectionTask);
    },
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
      this.$confirm("此操作将永久删除该报告, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //删除执行结果
          const id = { id: row.id };
          Report("delete", id)
            .then(response => {
              Report("get", { project_id: this.project_id }).then(res => {
                this.taskData = res.data.reverse();
              });
              this.$message.success(response.message);
            })
            .catch(error => {
              this.$message.error(error.message);
              // console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  created() {
    Report("get", { project_id: this.project_id }).then(response => {
      this.taskData = response.data.reverse();
    });
  },
  watch: {
    seareTaskName(newVal) {
      const request_data = {
        project_id: this.project_id,
        task_name: newVal
      };
      Report("get", request_data).then(response => {
        this.taskData = response.data.reverse();
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
