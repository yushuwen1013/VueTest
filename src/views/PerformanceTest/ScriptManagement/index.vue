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
        <el-table-column prop="date" label="脚本名称"></el-table-column>
        <el-table-column prop="name" label="创建时间"></el-table-column>
        <el-table-column prop="address" label="备注"></el-table-column>
        <el-table-column width="225" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" :type="scope.row">编辑</el-button>
            <el-button size="mini" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="编辑脚本" :visible.sync="dialogFormVisible" width="40%">
        <el-form label-position="right" label-width="80px" :model="formLabelAlign">
          <el-form-item label="脚本名称">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="上传脚本">
            <!-- <el-upload
              ref="upload"
              class="upload-demo"
              drag
              action="#"
              multiple
              :limit="1"
              :auto-upload="false"
              :http-request="upload"
             >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">只能上传jmx文件，且不超过500kb</div>
            </el-upload>-->
            <el-upload
              class="upload-demo"
              drag
              :action="url"
              multiple
              :limit="1"
              :headers='headers'
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="formLabelAlign.type"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitUpload">确 定</el-button>
        </div>
      </el-dialog>
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
    </div>
  </div>
</template>

<script>
import {
  update_global_variable,
  get_global_variable,
  delete_global_variable
} from "@/api/interfaceTesting";
export default {
  data() {
    return {
      headers:{'Authorization': 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNjM2NzQxODE1LCJlbWFpbCI6IiIsIm9yaWdfaWF0IjoxNjM2NzEzMDE1fQ.-GvbtSI3k116V8LBWo9ADq82Grhux0HVLGp0JsiiPak'},
      // url: `${process.env.VUE_APP_BASE_API}/fileUpload/upload/`,
      url: 'http://127.0.0.1:8000/fileUpload/upload/',
      formLabelAlign: {
        name: "",
        region: "",
        type: ""
      },
      dialogFormVisible: false,
      project_id: localStorage.getItem("project_id"),
      currentPage: 1, //初始页
      pagesize: 10, //    每页的数据
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],
      seareVariableKey: "" //搜索框的值
    };
  },
  methods: {
    // 点击上传：手动上传到服务器，此时会触发组件的http-request
    submitUpload() {
      this.$refs.upload.submit();
    },
    // upload(param) {
    //   const formData = new FormData(); //FormData对象，添加参数只能通过append('key', value)的形式添加
    //   formData.append("file", param.file); //添加文件对象
    //   formData.append("uploadType", this.rulesType);
    // const url = `${this.myBaseURL}/operation/ruleImport/importData`; //上传地址
    // console.log(formData)
    // axios
    //   .post(url, formData)
    //   .then(res => {
    //     const {
    //       data: { code, mark }
    //     } = res;
    //     if (code === 0) {
    //       param.onSuccess(); // 上传成功的文件显示绿色的对勾
    //       this.uploadMark = mark;
    //     }
    //     return this.countData(this.uploadMark); //根据mark值调用统计结果接口
    //   })
    //   .then(res => {
    //     //调用统计结果的响应，没有这一步可以省略了
    //     const {
    //       data: { code, data }
    //     } = res;
    //     if (code === 0) {
    //       console.log("结果", data);
    //     }
    //   })
    //   .catch(err => {
    //     console.log("失败", err);
    //     param.onError(); //上传失败的文件会从文件列表中删除
    //   });
    // },
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
  created() {}
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
