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
        <span>页面元素</span>
      </p>
    </div>
    <div>
      <el-card
        style="
          width: 25%;
          float: left;
          margin-right: 5px;
          margin-left: 5px;
          height: 780px;
        "
        class="box-card"
      >
        <div>
          <el-table
            size="small"
            ref="eltable"
            height="750"
            style="overflow-y: auto"
            :data="
              pageData.filter(
                (data) =>
                  !searchPageName ||
                  data.page_name
                    .toLowerCase()
                    .includes(searchPageName.toLowerCase())
              )
            "
            @row-click="btn"
            highlight-current-row
            :cell-style="{ padding: '4px 0' }"
          >
            <el-table-column header-align="center" prop="page_name">
              <!--  必须添加slot-scope="scope"，不使用输入框无法输入  -->
              <template slot="header" slot-scope="scope">
                {{ scope.row }}
                <el-input
                  size="small"
                  placeholder="请输入页面名称"
                  suffix-icon="el-icon-search"
                  v-model="searchPageName"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column align="right" width="90">
              <template slot="header">
                <el-button type="primary" size="mini" @click="addPage"
                  >添加</el-button
                >
              </template>
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-edit"
                  circle
                  size="mini"
                  @click="editPage(scope.$index, scope.row)"
                ></el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  size="mini"
                  @click="deletePage(scope.$index, scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <el-card style="width: 74%; float: left; height: 780px" class="box-card">
        <div>
          <el-table
            size="small"
            :data="
              elementData.slice(
                (currentPage - 1) * pagesize,
                currentPage * pagesize
              )
            "
            height="710"
            style="width: 100%; overflow-y: auto"
          >
            <el-table-column label="元素名称" align="center" width="250">
              <template slot-scope="scope">
                <el-input
                size="mini"
                  placeholder="请输元素名称"
                  v-model="scope.row.element_name"
                  clearable
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="定位方式" align="center" width="200">
              <template slot-scope="scope">
                <el-select
                size="mini"
                  v-model="scope.row.locate_mode"
                  placeholder="请选择定位方式"
                >
                  <el-option label="id" value="id"></el-option>
                  <el-option label="name" value="name"></el-option>
                  <el-option
                    label="cssSelector"
                    value="cssSelector"
                  ></el-option>
                  <el-option label="xpath" value="xpath"></el-option>
                  <el-option label="className" value="className"></el-option>
                  <el-option label="linkText" value="linkText"></el-option>
                  <el-option label="tagName" value="tagName"></el-option>
                  <el-option
                    label="pariailLinkText"
                    value="pariailLinkText"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="元素定位值" align="center">
              <template slot-scope="scope">
                <el-input
                size="mini"
                  placeholder="请输元素定位值"
                  v-model="scope.row.element_value"
                  clearable
                ></el-input>
              </template>
            </el-table-column>
            <slot></slot>
            <el-table-column fixed="right" width="150" align="center">
              <template slot="header">
                <el-button
                  @click.native.prevent="addElement()"
                  type="primary"
                  size="mini"
                  >添加</el-button
                >
                <el-button type="primary" size="mini" @click="savePageElement"
                  >保存</el-button
                >
              </template>
              <template slot-scope="scope">
                <!-- <el-button
                  @click.native.prevent="deleteElement(scope.$index, scope.row)"
                  type="text"
                  size="medium"
                >保存</el-button>-->
                <el-button
                  @click.native.prevent="deleteElement(scope.$index, scope.row)"
                  type="text"
                  size="medium"
                  >删除</el-button
                >
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
            :total="elementData.length"
            >//这是显示总共有多少数据，</el-pagination
          >
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import { Page, PageElement } from "@/api/WebUiTest/pageElement";
export default {
  data() {
    return {
      currentPage: 1, //初始页
      pagesize: 10, //    每页的数据
      searchPageName: "", //搜索框页面名称
      pageData: [], //页面数据
      elementData: [], //页面元素数据
      page_id: "", //页面id
      project_id: localStorage.getItem("project_id"), //项目id
    };
  },
  methods: {
    select() {
      this.a = false;
      console.log(this.page_id);
      this.pageData.forEach((ele, index) => {
        console.log(index, ele, "sssssss");
        if (ele.id == this.page_id) {
          console.log(this.page_id, index);
          this.$nextTick(() => {
            this.$refs.eltable.setCurrentRow(this.pageData[index]);
            this.page_id = this.pageData[index].id;
            this.elementData = this.pageData[index].page_element;
            this.a = true;
          });
        }
      });
      return this.a;
    },
    //选中页面触发的事件
    btn(row, col, event) {
      this.elementData = row.page_element;
      this.page_id = row.id;
      console.log(row, col, event);
    },
    //添加页面
    addPage() {
      this.$prompt("请输入页面名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputErrorMessage: "输入不能为空",
        inputValidator: (value) => {
          // 点击按钮时，对文本框里面的值进行验证
          console.log(value);
          if (!value.trim()) {
            return "输入不能为空";
          }
        },
      })
        .then(({ value }) => {
          //接口参数
          const createData = { page_name: value, project_id: this.project_id };
          //发送新增页面接口
          Page("post", createData)
            .then((response) => {
              Page("get", { project_id: this.project_id })
                .then((res) => {
                  this.pageData = res.data;
                  this.select();
                })
                .catch((error) => {
                  this.$error.success(res.error);
                });
            })
            .catch((error) => {
              this.$message.error(error.message);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    //编辑页面
    editPage(index, row) {
      this.$prompt("请输入页面名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputErrorMessage: "输入不能为空",
        inputValue: row.page_name,
        inputValidator: (value) => {
          // 点击按钮时，对文本框里面的值进行验证
          console.log(value);
          if (!value.trim()) {
            return "输入不能为空";
          }
        },
      })
        .then(({ value }) => {
          //接口参数
          const createData = { id: row.id, page_name: value };
          //发送新增页面接口
          Page("post", createData)
            .then((response) => {
              Page("get", { project_id: this.project_id })
                .then((res) => {
                  this.pageData = res.data;
                  this.select();
                })
                .catch((error) => {
                  this.$error.success(res.error);
                });
            })
            .catch((error) => {
              this.$message.error(error.message);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    //删除页面
    deletePage(index, row) {
      this.$confirm(
        "此操作将永久删除该页面，以及该页面下的所有元素, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          //删除页面接口
          Page("delete", { id: row.id })
            .then((response) => {
              this.$message.success(response.message);
              Page("get", { project_id: this.project_id })
                .then((res) => {
                  this.pageData = res.data;
                  if (this.pageData.length == 0) {
                    this.elementData = [];
                    this.page_id = "";
                  } else {
                    this.$nextTick(() => {
                      this.$refs.eltable.setCurrentRow(this.pageData[0]);
                      this.page_id = this.pageData[0].id;
                      this.elementData = this.pageData[0].page_element;
                    });
                  }
                })
                .catch((error) => {
                  this.$error.success(res.error);
                });
            })
            .catch((error) => {
              this.$message.error(error.message);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //添加元素
    addElement() {
      if (this.page_id == "") {
        this.$message.error("请选择页面后在添加！");
      } else {
        if (this.elementData.length == 0) {
          this.elementData.push({
            id: 1,
            element_name: "",
            locate_mode: "xpath",
            element_value: "",
          });
        } else {
          this.elementData.push({
            id: this.elementData.slice(-1)[0].id + 1,
            element_name: "",
            locate_mode: "xpath",
            element_value: "",
          });
        }
      }
    },
    //保存元素
    savePageElement() {
      if (this.page_id == "") {
        this.$message.error("请选择页面后再保存！");
      } else {
        // 验证属性列表
        var result = true;
        var message = [];
        this.elementData.forEach((item, index) => {
          let no = index + 1;
          if (item.element_name == "") {
            result = result && false;
            message.push("第" + no + "行：元素名称不能为空");
          }
          if (item.locate_mode == "") {
            result = result && false;
            message.push("第" + no + "行：定位方式不能为空");
          }
          if (item.element_value == "") {
            result = result && false;
            message.push("第" + no + "行：元素定位值不能为空");
          }
        });
        if (!result) {
          var temp = "";
          message.forEach((v) => {
            temp += `<li>${v}</li>`;
          });
          return this.$notify({
            title: "元素列表提示",
            dangerouslyUseHTMLString: true,
            type: "error",
            duration: 3000,
            message: `<ul>${temp}</ul>`,
          });
        }
        //接口参数
        const createData = { id: this.page_id, page_element: this.elementData };
        // 发送新增页面接口
        Page("put", createData)
          .then((response) => {
            this.$message.success(response.message);
          })
          .catch((error) => {
            this.$message.error(error.message);
          });
      }
    },
    //删除元素
    deleteElement(index, row) {
      // console.log(index, row);
      this.elementData.splice(index, 1);
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.pagesize = size;
      console.log(this.pagesize); //每页下拉显示数据
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
      console.log(this.currentPage); //点击第几页
    },
  },
  created() {
    //页面创建之前获取页面数据
    Page("get", { project_id: this.project_id })
      .then((res) => {
        this.pageData = res.data;
        if (this.pageData.length != 0) {
          this.page_id = this.pageData[0].id;
          this.select();
        }
      })
      .catch((error) => {
        this.$error.success(res.error);
      });
  },
};
</script>

<style>
.el-table__body tr.current-row > td {
  background: #409eff !important;
  color: rgb(255, 255, 255);
}
</style>