<template>
  <div style="background: #eaeaea; height: 100%">
    <div v-show="isShowTestReport">
      <TestReport ref="TestReport" :detailsData="detailsData" />
    </div>
    <div v-show="!isShowTestReport">
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
            <el-input placeholder="请输入任务名称" suffix-icon="el-icon-search" v-model="seareTaskName"></el-input>
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
          <el-table-column :show-overflow-tooltip="true" prop="task_name" label="任务名称"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="interface_case" label="单接口用例">
            <template slot-scope="scope">
              <el-tag size="mini">
                {{
                "总共:" + JSON.parse(scope.row.interface_case)[0]
                }}
              </el-tag>
              <el-tag size="mini" type="success">
                {{
                "成功:" + JSON.parse(scope.row.interface_case)[1]
                }}
              </el-tag>
              <el-tag size="mini" type="danger">
                {{
                "失败:" + JSON.parse(scope.row.interface_case)[2]
                }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="business_case" label="业务用例">
            <template slot-scope="scope">
              <el-tag size="mini">
                {{
                "总共:" + JSON.parse(scope.row.business_case)[0]
                }}
              </el-tag>
              <el-tag type="success" size="mini">
                {{
                "成功:" + JSON.parse(scope.row.business_case)[1]
                }}
              </el-tag>
              <el-tag type="danger" size="mini">
                {{
                "失败:" + JSON.parse(scope.row.business_case)[2]
                }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="start_time" label="开始时间"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="end_time" label="结束时间"></el-table-column>
          <!-- <el-table-column
          :show-overflow-tooltip="true"
          prop="description"
          label="描述"
          ></el-table-column>-->
          <el-table-column :show-overflow-tooltip="true" prop="status" label="状态" width="100px">
            <template slot-scope="scope">
              <!-- <el-tag :type="scope.row.task_status ? 'success' : 'error'">
                {{
                scope.row.task_status ? "正常" : "暂停"
                }}
              </el-tag>-->
              <el-tag :type="scope.row.task_status ? 'success' : 'error'">{{scope.row.status}}</el-tag>
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
import TestReport from "./TestReport.vue";
import {
  get_executive_outcomes,
  delete_executive_outcomes,
  get_task
} from "@/api/interfaceTesting";
export default {
  components: { TestReport },
  data() {
    return {
      detailsData: {
        business_case: [0, 0, 0],
        interface_case: [0, 0, 0]
      }, //任务详情信息
      isShowTestReport: false, //是否显示测试报告
      project_id: localStorage.getItem("project_id"), //项目id
      currentPage: 1, //初始页
      pagesize: 10, //    每页的数据
      taskData: [], //任务数据
      seareTaskName: "" //搜索框的值
    };
  },
  methods: {
    //查看详情
    viewDetails(index, row) {
      this.isShowTestReport = true;
      //报告详情数据
      this.detailsData = {
        business_case: JSON.parse(row.business_case),
        create_time: row.create_time,
        description: row.description,
        end_time: row.end_time,
        executive_outcomes: JSON.parse(row.executive_outcomes),
        interface_case_result: JSON.parse(row.executive_outcomes)
          .interface_case_result,
        business_case_result: JSON.parse(row.executive_outcomes)
          .business_case_result,
        id: row.id,
        interface_case: JSON.parse(row.interface_case),
        project_id: row.project_id,
        start_time: row.start_time,
        status: row.status,
        task_name: row.task_name,
        time_consuming: row.time_consuming,
        useCaseNumber:
          JSON.parse(row.business_case)[0] + JSON.parse(row.interface_case)[0]
      };
      this.$nextTick(() => {
        //响应数据
        this.$refs.TestReport.responseData = {
          request_headers: "",
          request_data: "",
          request_url: "",
          request_method: "",
          response_code: "",
          response_data: "",
          response_headers: "{}",
          dataState: "",
          assert_result: []
        };
        //调用子组件TestReport的重置图表
        this.$refs.TestReport.allCaseChart();
        this.$refs.TestReport.interfaceCaseChart();
        this.$refs.TestReport.businessCaseChart();
      });

      console.log(this.detailsData);
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
        })
          .then(() => {
            //删除执行结果
            delete_executive_outcomes({ id: selectionTask }).then(response => {
              console.log(response);
              get_executive_outcomes({ project_id: this.project_id }).then(
                response => {
                  this.taskData = response.data;
                }
              );
              this.$message({
                message: "删除成功",
                type: "success"
              });
            });
          })
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
    }
    // //查询
    // inquire() {
    //   const request_data = {
    //     project_id: this.project_id,
    //     task_name: this.seareTaskName
    //   };
    //   get_executive_outcomes(request_data).then(response => {
    //     this.taskData = response.data;
    //   });
    // },
    // //重置
    // reset() {
    //   get_executive_outcomes({ project_id: this.project_id }).then(response => {
    //     this.taskData = response.data;
    //   });
    // }
  },
  created() {
    get_executive_outcomes({ project_id: this.project_id }).then(response => {
      this.taskData = response.data.reverse();
    });
  },
  watch: {
    seareTaskName(newVal) {
      const request_data = {
        project_id: this.project_id,
        task_name: newVal
      };
      get_executive_outcomes(request_data).then(response => {
        this.taskData = response.data;
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
