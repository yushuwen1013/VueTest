<template>
  <div style="background:#EAEAEA; height: 100%">
    <div style="background:#fff">
      <p
        style="width: 1600px;height: 60px;padding-left: 31px;font-size:22px;margin-top: 0px;line-height:55px;"
      >
        <span style>脚本管理</span>
      </p>
    </div>
    <div>
      <el-form :inline="true" class="demo-form-inline" style="margin-left: 35px;">
        <el-form-item label="变量名称">
          <el-input v-model="seareVariableKey" placeholder="请输入变量名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="inquire">查询</el-button>
          <el-button type="primary" size="small" @click="reset">重置</el-button>
        </el-form-item>
        <el-button
          style="float: right;margin-bottom: 20px;margin-right: 50px;"
          type="primary"
          icon="el-icon-plus"
          @click="dialogFormVisible = true"
        >添加</el-button>
      </el-form>
      <el-table :data="tableData" height="600" style="width: 98%;left: 20px;">
        <el-table-column prop="script_name" label="脚本名称"></el-table-column>
        <el-table-column prop="create_time" label="创建时间"></el-table-column>
        <el-table-column prop="description" label="备注"></el-table-column>
        <el-table-column width="300" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="runJmxScript(scope.row)">执行</el-button>
            <el-button size="mini" @click="executiveLogging(scope.row)">执行记录</el-button>
            <el-button size="mini" @click="editJmxScript(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteJmxScript(scope.row)">删除</el-button>
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
        :total="tableData.length"
      >//这是显示总共有多少数据，</el-pagination>
      <el-dialog title="编辑脚本" :visible.sync="dialogFormVisible" width="40%">
        <el-form label-position="right" label-width="80px" :model="form">
          <el-form-item label="脚本名称">
            <el-input v-model="form.script_name"></el-input>
          </el-form-item>
          <el-form-item label="上传脚本">
            <el-upload
              multiple
              accept=".jmx"
              class="upload-demo"
              thumbnail-mode
              :on-change="handleChange"
              :on-remove="remove"
              action
              :file-list="fileList"
              :http-request="uploadfile"
            >
              <el-button size="small" type="primary" class="upload">上传jmx脚本</el-button>
              <div slot="tip" class="el-upload__tip">支持格式：.jmx，单个文件不能超过20MB。</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.description"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="执行记录" :visible.sync="executiveLoggingVisible">
        <el-table :data="executiveLoggingData" style="overflow:auto;" height="300">
          <el-table-column prop="script_name" label="脚本名称"></el-table-column>
          <el-table-column property="create_time" label="执行日期"></el-table-column>
          <el-table-column width="300" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" plain @click="executiveReport(scope.row)">查看执行报告</el-button>
              <!-- <a :href="download_jtl"></a> -->
              <el-button size="mini" type="primary" plain @click="download(scope.row)">下载</el-button>
              <el-button size="mini" type="danger" plain @click="deleteReport(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import QS from "qs";
import { getToken } from "@/utils/auth";
import {
  jmx_script,
  upload_file,
  dowload_file,
  run_jmx_script,
  jmx_script_results,
  jmx_script_results_report
} from "@/api/performanceTesting";
export default {
  data() {
    return {
      download_jtl: process.env.VUE_APP_BASE_API,
      executiveLoggingData: [], //执行记录数据
      executiveLoggingVisible: false, //执行记录弹窗
      // headers: { Authorization: "JWT " + getToken() },
      // url: "http://127.0.0.1:8000/fileUpload/upload/",
      fileList: [], //文件列表
      //jmx脚本表单
      form: {
        script_name: "",
        description: "",
        file_id: null
      },
      dialogFormVisible: false, //新增jmx脚本的表单
      project_id: localStorage.getItem("project_id"), //在local获取project_id
      currentPage: 1, //初始页
      pagesize: 10, //每页的数据
      tableData: [], //脚本列表
      seareVariableKey: "" //搜索框的值
    };
  },
  methods: {
    //删除记录
    deleteReport(row) {
      console.log(row);
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
    //下载jtl文件
    download(row) {
      console.log(row);
      // dowload_file({file_path: row.file}).then(res=>{
      //   console.log("sssssssssssssssssssssssss")
      //  let url = window.URL.createObjectURL(new Blob([res.data]));
      //     let link = document.createElement("a");
      //     link.style.display = "none";
      //     link.href = url;
      //     link.setAttribute("download", "result.jtl"); //指定下载后的文件名，防跳转
      //     document.body.appendChild(link);
      //     link.click();
      // })
      window.open(process.env.VUE_APP_BASE_API + "fileUpload/download_file/?file_path=" + row.file);
    },
    //查看执行报告
    executiveReport(row) {
      console.log(row);
      jmx_script_results_report("get", { jmx_script_result_id: row.id }).then(
        response => {
          console.log(process.env.VUE_APP_BASE_API + response.data);
          window.open(
            process.env.VUE_APP_BASE_API + response.data.substring(1)
          );
        }
      );
    },
    //查看执行记录
    executiveLogging(row) {
      console.log(row);
      this.jmx_id = row.id;
      this.executiveLoggingVisible = true;
      jmx_script_results("get", { jmx_script_id: row.id }).then(response => {
        this.executiveLoggingData = response.data;
        this.executiveLoggingData.forEach(ele => {
          ele.script_name = row.script_name;
        });
        console.log(response.data);
      });
    },
    //执行
    runJmxScript(row) {
      run_jmx_script("post", { id: row.id, project_id: this.project_id }).then(
        response => {
          console.log(response);
        }
      );
    },
    //删除脚本
    deleteJmxScript(row) {
      jmx_script("delete", { id: row.id }).then(response => {
        console.log(response);
        this.$message.success(response.message);
        jmx_script("get", { project_id: this.project_id }).then(response => {
          console.log(response);
          this.tableData = response.data;
        });
      });
    },
    //编辑jmx脚本
    editJmxScript(row) {
      this.dialogFormVisible = true;
      this.form.script_name = row.script_name;
      this.form.description = row.description;
      this.form.id = row.id;
      this.form.file_id = row.file;
      this.fileList = [
        {
          name: row.file_name,
          url: process.env.VUE_APP_BASE_API + row.file_path
        }
      ];
    },
    //移除文件
    remove(file, a, b) {
      console.log(file, a, b);
      // upload_file("delete", { id: this.form.file_id })
      //     .then(res => {
      //       this.$message.success("删除成功");
      //     })
      //     .catch(error => {
      //       // this.$message.error("删");
      //     });
    },
    //上传文件
    uploadfile(file) {
      let formData = new FormData();
      formData.append("file", file.file);
      // 上传文件接口
      upload_file("post", formData)
        .then(res => {
          this.form.file_id = res.data.id;
          this.$message.success("上传成功");
        })
        .catch(error => {
          this.$message.error("上传失败");
        });
    },
    //只能上传一个文件，保留最新的文件
    handleChange(file, fileList) {
      console.log(fileList.length);
      //如果文件列表等于2就删除旧文件，保留最新的文件
      if (fileList.length == 2) {
        // 删除文件接口
        upload_file("delete", { id: this.form.file_id })
          .then(res => {
            this.$message.success("删除成功");
          })
          .catch(error => {
            // this.$message.error("删");
          });
        this.fileList = fileList.slice(-1);
      }
    },
    //确定添加
    confirm() {
      console.log(this.form);
      this.form.project_id = this.project_id;
      if (this.form.script_name != "" && this.form.file_id != "") {
        // 保存脚本接口
        jmx_script("post", this.form)
          .then(response => {
            console.log(response);
            this.$message.success(response.message);
            this.dialogFormVisible = false;
            // 获取jmx脚本列表接口
            jmx_script("get", { project_id: this.project_id }).then(
              response => {
                console.log(response);
                this.tableData = response.data;
              }
            );
          })
          .catch(erroe => {
            this.$message.error(erroe.message);
          });
      } else {
        this.$message.error("脚本名称和文件不能为空");
      }
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
    //查询
    inquire() {
      const request_data = {
        project_id: this.project_id,
        variable_key: this.seareVariableKey
      };
      get_global_variable(request_data).then(response => {
        this.tableData = response.data;
      });
    },
    //重置
    reset() {
      get_global_variable({ project_id: this.project_id }).then(response => {
        this.tableData = response.data;
        this.seareVariableKey = "";
      });
    }
  },
  //组件创建之前发送获取jmx脚本列表的接口
  created() {
    jmx_script("get", { project_id: this.project_id }).then(response => {
      console.log(response);
      this.tableData = response.data;
      // this.$message.success(response.message);
    });
  },
  watch: {
    // 如果dialogFormVisible被修改为false那么就清空form表单和文件列表
    dialogFormVisible(val) {
      if (!val) {
        this.form = {
          script_name: "",
          description: "",
          file_id: null
        };
        this.fileList = [];
      }
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
