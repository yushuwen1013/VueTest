<template>
  <div style="background: #eaeaea; height: 850px">
    <div style="background: #fff">
      <p
        style="
            height: 50px;
            font-size: 22px;
            margin-top: 0px;
            line-height: 55px;
            text-align: center;
            margin-bottom: 10px;
          "
      >
        <span>元素操作</span>
      </p>
    </div>
    <div>
      <el-card
        style="width: 99.3%; float: left; margin-right: 5px;margin-left: 5px;height:780px;position: relative;"
        class="box-card"
      >
        <el-table
          :data="actionData.slice((currentPage - 1) * pagesize,currentPage * pagesize)"
          style="width: 100%"
          height="710"
        >
          <el-table-column prop="action_name" label="操作名称" width="300"></el-table-column>
          <el-table-column prop="action_method" label="操作方法" width="300"></el-table-column>
          <el-table-column prop="description" label="描述"></el-table-column>
          <el-table-column fixed="right" width="200" align="center">
            <template slot="header">
              <el-button type="primary" size="mini" @click="actionVisible=true">添加</el-button>
            </template>
            <template slot-scope="scope">
              <el-button type="primary" plain size="mini" @click="editAction(scope.row)">编辑</el-button>
              <el-button type="danger" plain size="mini" @click="deleteAction(scope.row)">删除</el-button>
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
          :total="actionData.length"
        >//这是显示总共有多少数据，</el-pagination>
      </el-card>
    </div>
    <el-dialog title="元素操作" :visible.sync="actionVisible" width="40%">
      <el-form :model="actionForm" :rules="rules" ref="actionForm">
        <el-form-item label="操作名称" label-width="120px" prop="action_name">
          <el-input v-model="actionForm.action_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="操作方法" label-width="120px" prop="action_method">
          <el-input v-model="actionForm.action_method" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" label-width="120px">
          <!-- <el-input v-model="actionForm.description" autocomplete="off"></el-input> -->
          <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 8}" placeholder="请输入操作描述" v-model="actionForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="actionVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAction(actionForm)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { ElementAction } from "@/api/WebUiTest/elementAction";
export default {
  data() {
    return {
      //元素操作表单校验
      rules: {
        action_name: [
          { required: true, message: "请输入操作名称", trigger: "blur" }
          //   { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        action_method: [
          { required: true, message: "请输入操作方法", trigger: "blur" }
          //   { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      actionVisible: false, //元素操作表单显隐
      actionData: [], //元素操作数据
      actionForm: {
        //元素操作表单
        action_name: "",
        action_method: "",
        description: ""
      },
      currentPage: 1, //初始页
      pagesize: 10 //    每页的数据
    };
  },
  methods: {
    //添加元素操作
    addAction(form) {
      this.$refs.actionForm.validate(valid => {
        if (valid) {
          ElementAction("post", form).then(res => {
            this.$message.success(res.message);
            this.actionVisible = false;
            ElementAction("get").then(res => {
              this.actionData = res.data;
            });
          });
        }
      });
    },
    //编辑元素操作
    editAction(row) {
      this.actionForm = {
        id: row.id,
        action_name: row.action_name,
        action_method: row.action_method,
        description: row.description
      };
      this.actionVisible = true;
    },
    //删除元素操作
    deleteAction(row) {
      this.$confirm("此操作将永久删除该元素操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          ElementAction("delete", { id: row.id }).then(res => {
            this.$message.success(res.message);
            ElementAction("get").then(res => {
              this.actionData = res.data;
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function(size) {
      this.pagesize = size;
      console.log(this.pagesize); //每页下拉显示数据
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      console.log(this.currentPage); //点击第几页
    }
  },
  watch: {
    actionVisible(value) {
      if (!value) {
        this.actionForm = {
          //元素操作表单
          action_name: "",
          action_method: "",
          description: ""
        };
      }
    }
  },
  created() {
    ElementAction("get").then(res => {
      this.actionData = res.data;
    });
  }
};
</script>

<style>
</style>