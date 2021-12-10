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
            <el-input placeholder="请输入报告id" suffix-icon="el-icon-search" v-model="seareTaskName"></el-input>
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
          :data="
            executiveLoggingData.slice((currentPage - 1) * pagesize, currentPage * pagesize)
          "
          style="width: 98%; left: 20px"
          ref="table"
          :header-cell-style="{ background: '#DCDFE6', color: '#303133' }"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="id" width="70px" label="报告id"></el-table-column>
          <el-table-column prop="script_name" label="脚本名称"></el-table-column>
          <el-table-column property="create_time" label="执行日期"></el-table-column>
          <el-table-column width="300" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" plain @click="executiveReport(scope.row)">查看执行报告</el-button>
              <el-button size="mini" type="primary" plain @click="download(scope.row)">下载</el-button>
              <el-button size="mini" type="danger" plain @click="deleteReport(scope.row)">删除</el-button>
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
          :total="executiveLoggingData.length"
        >//这是显示总共有多少数据，</el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { get_all_file, get_use_case } from "@/api/interfaceTesting";
import {
  jmx_script,
  upload_file,
  dowload_file,
  run_jmx_script,
  jmx_script_results,
  jmx_script_results_report
} from "@/api/performanceTesting";
import {
  get_executive_outcomes,
  delete_executive_outcomes,
  get_task
} from "@/api/interfaceTesting";
export default {
  data() {
    return {
      executiveLoggingData: [], //执行记录数据
      project_id: localStorage.getItem("project_id"), //项目id
      currentPage: 1, //初始页
      pagesize: 10, //    每页的数据
      seareTaskName: "" //搜索框的值
    };
  },
  methods: {
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
          jmx_script_results("delete", { jmx_script_result_id: selectionTask })
            .then(response => {
              this.$message.success(response.message);
              jmx_script_results("get", { jmx_script_id: this.jmx_id }).then(
                response => {
                  this.executiveLoggingData = response.data;
                  this.executiveLoggingData.forEach(ele => {
                    ele.script_name = row.script_name;
                  });
                }
              );
            })
            .catch(error => {
              this.$message.error(error.message);
            });
        });
      }
      console.log(selectionTask);
    },
    //查看执行报告
    executiveReport(row) {
      console.log(row);
      jmx_script_results_report("get", { jmx_script_result_id: row.id }).then(
        response => {
          console.log(process.env.VUE_APP_BASE_API + response.data);
          if (response.data == "脚本执行失败") {
            this.$message.error(response.data);
          } else {
            window.open(
              process.env.VUE_APP_BASE_API + response.data.substring(1)
            );
          }
        }
      );
    },
    // 下载jtl文件
    download(row) {
      window.open(
        process.env.VUE_APP_BASE_API +
          "fileUpload/download_file/?file_path=" +
          row.file
      );
    },
    //删除记录
    deleteReport(row) {
      jmx_script_results("delete", { jmx_script_result_id: row.id })
        .then(response => {
          this.$message.success(response.message);
          jmx_script_results("get", { jmx_script_id: this.jmx_id }).then(
            response => {
              this.executiveLoggingData = response.data;
              this.executiveLoggingData.forEach(ele => {
                ele.script_name = row.script_name;
              });
            }
          );
        })
        .catch(error => {
          this.$message.error(error.message);
        });
    },
    //初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function(size) {
      this.pagesize = size;
      console.log(this.pagesize); //每页下拉显示数据
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      console.log(this.currentPage); //点击第几页
    }
  },
  created() {
    jmx_script_results("get", { project_id: this.project_id }).then(
      response => {
        this.executiveLoggingData = response.data.reverse();
      }
    );
  },
  watch: {
    seareTaskName(newVal) {
      const request_data = {
        project_id: this.project_id,
        script_name: newVal
      };
      jmx_script_results("get", request_data).then(response => {
        this.executiveLoggingData = response.data.reverse();
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
