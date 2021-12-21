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
        <span>用例管理</span>
      </p>
    </div>
    <div>
      <el-card style="width: 25%; float: left; margin-left: 5px; height: 780px" class="box-card">
        <div slot="header" class="clearfix">
          <el-input
            size="mini"
            placeholder="请输入内容"
            suffix-icon="el-icon-search"
            v-model="filterCase"
            style="width: 63%"
          ></el-input>
          <!-- <el-button type="primary"  size="mini" icon="el-icon-folder-add" style="float:right;width:10%" circle></el-button> -->
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-folder-add"
            style="float: right; width: 35%"
            @click="addFile({ id: null })"
          >添加</el-button>
        </div>
        <div style="width: 100%; height: 690px; overflow: auto">
          <el-tree
            :highlight-current="highlight"
            ref="dataConfigTree"
            :data="data"
            node-key="id"
            @node-click="clickNode"
            :filter-node-method="filterNode"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <div class="showfile">
                <span class="tmp" :title="node.data.name">
                  <i
                    v-show="node.data.type == 2 ? true : false"
                    class="el-icon-document"
                    style="color: #e6a23c"
                  ></i>
                  <i v-show="node.data.type == 1 ? true : false" class="el-icon-folder-opened"></i>
                  {{ node.data.name }}
                </span>
              </div>

              <span @click.stop="clickMore(node.data)">
                <el-dropdown
                  trigger="click"
                  @visible-change="changeDropdown"
                  @command="handleCommand"
                >
                  <span class="el-dropdown-link">
                    <i class="el-icon-more"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <div v-show="isCase">
                      <el-dropdown-item :command="['edit', node, data]">编辑</el-dropdown-item>
                      <el-dropdown-item :command="['delete', node, data]">删除</el-dropdown-item>
                      <!-- <el-dropdown-item>螺蛳粉</el-dropdown-item> -->
                    </div>
                    <div v-show="isFile">
                      <el-dropdown-item :command="['addFile', node.data]">新建文件夹</el-dropdown-item>
                      <el-dropdown-item :command="['addUseCase', node.data]">新建用例</el-dropdown-item>
                      <el-dropdown-item :command="['edit', node, data]">编辑</el-dropdown-item>
                      <el-dropdown-item :command="['delete', node, data]">删除</el-dropdown-item>
                    </div>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </span>
          </el-tree>
        </div>
      </el-card>
      <!-- <el-card style="width: 18%; float: left;margin-left: 2px;height:780px;" class="box-card">
        <div slot="header" class="clearfix">
          <el-input
            size="mini"
            placeholder="请输入元素操作名称"
            suffix-icon="el-icon-search"
            v-model="filterAction"
            style="width:100%"
          ></el-input>
        </div>
        <div style="width: 100%;height:690px;overflow-y: auto;">
          <el-tree
            :data="actionData"
            node-key="id"
            ref="action"
            :filter-node-method="filterActionNode"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <el-tooltip placement="left" effect="light">
                <div v-html="toBreak(data.description, data)" slot="content"></div>
                <span class="showname">{{ node.data.action_name }}</span>
              </el-tooltip>
              <span>
                <el-button type="text" size="mini" @click="() => append(data)">添加</el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </el-card>-->
      <el-card style="width: 74%; float: left; margin-left: 2px; height: 780px" class="box-card">
        <div v-show="highlight" slot="header" class="clearfix">
          <el-button
            type="primary"
            style="float: right; margin-right: 10px"
            size="mini"
            @click="saveUseCase(useCase_id, UseCaseData)"
          >保存</el-button>
          <el-button
            type="primary"
            style="float: right; margin-right: 50px"
            size="mini"
            @click="debugRecord(useCase_id)"
          >调试记录</el-button>
          <el-button
            type="primary"
            style="float: right; margin-right: 10px"
            size="mini"
            @click="debug(useCase_id)"
          >调试</el-button>
        </div>
        <div v-show="highlight" style="width: 100%; height: 690px; overflow-y: auto">
          <el-table
            :data="UseCaseData"
            height="690"
            border
            style="width: 100%"
            size="small"
            row-key="id"
          >
            <!-- <el-table-column prop="id" label="id" width="50 ">
            </el-table-column>-->
            <el-table-column prop="description" label="步骤描述" width="180">
              <template slot-scope="scope">
                <el-input
                  placeholder="请输入步骤描述"
                  size="mini"
                  v-model="scope.row.description"
                  clearable
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="action" label="操作" width="180">
              <template slot-scope="scope">
                <el-select clearable v-model="scope.row.action" size="mini" placeholder="请选择元素操作">
                  <el-tooltip placement="left" effect="light">
                    <span class="showname">
                      <el-option
                        v-for="item in actionOptions"
                        :key="item.id"
                        :label="item.action_name"
                        :value="item.action_method"
                        @mouseover.native="hoverAction(item)"
                      ></el-option>
                    </span>
                    <div v-html="toBreak(action_detailed)" slot="content"></div>
                  </el-tooltip>
                  <!-- <el-option
                    v-for="item in actionOptions"
                    :key="item.id"
                    :label="item.action_name"
                    :value="item.action_method"
                  ></el-option>-->
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="element" label="元素" width="180">
              <template slot-scope="scope">
                <div class="block">
                  <!-- <span class="demonstration">单选可搜索</span> -->
                  <el-cascader
                    clearable
                    v-model="scope.row.element"
                    :props="{
                      label: 'element_name',
                      value: 'id',
                      expandTrigger: 'hover',
                    }"
                    size="mini"
                    placeholder="搜索"
                    :options="pageElementOptions"
                    filterable
                  ></el-cascader>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="action_parameter" label="操作参数">
              <template slot-scope="scope">
                <el-input
                  placeholder="请输入参数"
                  size="mini"
                  v-model="scope.row.action_parameter"
                  clearable
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column width="62" label="状态">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.isUse" @change="isUse(scope.$index, scope.row)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column width="70" align="center">
              <template slot="header">
                <el-button type="primary" size="mini" @click="addUsecase">添加</el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  plain
                  @click.native.prevent="deleteUsecase(scope.$index)"
                  size="mini"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <el-drawer title="调试详情" :visible.sync="debugRecordVisible" size="80%">
        <el-card class="box-card" style="width:25%;height:100%;float:left">
          <div slot="header" class="clearfix">
            <span>调试记录</span>
          </div>
          <div>
            <!-- :data="
              debugRecordData.filter(
                (data) =>
                  !searchPageName ||
                  data.page_name
                    .toLowerCase()
                    .includes(searchPageName.toLowerCase())
            )-->
            <el-table
              :header-cell-style="{ height:'20px',padding:'2px'}"
              ref="eltable"
              height="750"
              style="overflow-y: auto"
              :data="
              debugRecordData
            "
              @row-click="btn"
              highlight-current-row
              :cell-style="{ padding: '4px 0' }"
            >
              <el-table-column header-align="center" label="执行时间" prop="create_time"></el-table-column>
              <el-table-column align="right" width="150">
                <template slot-scope="scope">
                  <el-tag
                    size="mini"
                    style="margin-right: 10px;"
                    :type="scope.row.result?'success':'danger'"
                  >{{scope.row.result?"成功":"失败"}}</el-tag>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    size="mini"
                    @click="deleteRecord(scope.$index, scope.row)"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
        <el-card
          class="box-card"
          style="width:74%;height:100%;float:right;margin-right: 10px;overflow-y:auto"
        >
          <div slot="header" class="clearfix">
            <span>步骤内容</span>
          </div>
          <div>
            <el-row>
              <el-descriptions direction="vertical" :column="4" border style="margin-bottom: 10px;">
                <el-descriptions-item label="开始时间">{{stepRow.start_time}}</el-descriptions-item>
                <el-descriptions-item label="结束时间">{{stepRow.end_time}}</el-descriptions-item>
                <el-descriptions-item label="耗时" :span="2">{{stepRow.time_consuming}}</el-descriptions-item>
              </el-descriptions>
              <el-col v-for="(step,index) in stepData" :key="index">
                <el-card
                  style="width:29%;float:left"
                  :body-style="{ padding: '0px', width:'100%' }"
                >
                  <!-- <div style="padding: 14px;">
                    <span>{{step.result}}</span>
                  </div>-->
                  <el-descriptions :column="1" border width="50px">
                    <el-descriptions-item
                      :contentStyle="{ 'text-align': 'center' }"
                      label="步骤"
                    >{{step.id}}</el-descriptions-item>
                    <el-descriptions-item
                      :contentStyle="{ 'text-align': 'center' }"
                      label="步骤描述"
                    >{{step.description}}</el-descriptions-item>
                    <el-descriptions-item
                      :contentStyle="{ 'text-align': 'center' }"
                      label="元素操作"
                    >{{step.action}}</el-descriptions-item>
                    <el-descriptions-item
                      :contentStyle="{ 'text-align': 'center' }"
                      label="操作参数"
                    >{{step.action_parameter}}</el-descriptions-item>
                    <el-descriptions-item
                      :contentStyle="{ 'text-align': 'center' }"
                      label="结果"
                    >{{step.result?"成功":"失败"}}</el-descriptions-item>
                  </el-descriptions>
                </el-card>
                <!--  v-for="(index,1  ) in 5" :key="o" :offset="1" -->
                <el-card style="width:70%" :body-style="{ padding: '0px', width:'100%' }">
                  <!-- <div style="padding: 14px;">
                    <span>{{step.result}}</span>
                  </div>-->
                  <viewer :images="stepData">
                    <!-- <img v-for="src in imgArr" :src="src" :key="src" width="200"> -->
                    <img
                      v-show="step.picture_path"
                      style="height: 300px;"
                      :src="baseURL + 'media/webui/' + step.picture_path"
                      class="image"
                    />
                  </viewer>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-drawer>
    </div>
  </div>
</template>
<script>
import Sortable from "sortablejs";
import { ElementAction } from "@/api/WebUiTest/elementAction";
import {
  UseCase,
  UseCaseStep,
  RunUseCase
} from "@/api/WebUiTest/useCaseManagement";
import { Page, PageElement } from "@/api/WebUiTest/pageElement";
export default {
  data() {
    return {
      //当前选中的调试记录数据
      stepRow: {
        start_time: "",
        end_time: "",
        time_consuming: ""
      },
      baseURL: process.env.VUE_APP_BASE_API, //基础url
      stepData: [], // 步骤数据
      debugRecordData: [], //调试记录数据
      debugRecordVisible: false, //调试记录面板显隐
      action_detailed: "",
      caseStep: false, //用例步骤显隐
      pageElementOptions: [], //页面元素列表
      actionOptions: [], //元素操作列表
      //用例数据列表
      UseCaseData: [
        // {
        //   id: 1,
        //   description: "",
        //   action: "",
        //   element: "",
        //   action_parameter: "",
        //   isUse: true,
        // },
      ],
      filterAction: "", //搜索元素操作方法
      actionData: [], //页面数据
      highlight: false, //选中状态，false为不显示，true显示
      filterCase: "", //搜索用例或文件
      isCase: false, //用例选项开关
      isFile: false, //文件选项开关
      project_id: localStorage.getItem("project_id"), //项目id
      data: [], //用例数据
      useCase_id: "" //用例id
    };
  },
  methods: {
    //选中调试记录触发的事件
    btn(row, col, event) {
      this.stepData = row.case_step_details;
      this.stepRow = row;
      // this.page_id = row.id;
      console.log(row, col, event);
      console.log(this.stepData);
    },
    //删除调试记录
    deleteRecord(index, row) {
      console.log(index, row);
      RunUseCase("delete", { id: row.id })
        .then(res => {
          this.$message.success(res.message);
          this.debugRecordData.splice(index, 1);
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    //调试记录
    debugRecord(id) {
      //发送获取调试记录的接口
      RunUseCase("get", { id }).then(res => {
        this.$message.success(res.message);
        this.debugRecordData = res.data.reverse(); //倒序排列
        this.debugRecordVisible = true;
      });
    },
    //调试
    debug(id) {
      RunUseCase("post", { id }).then(res => {
        this.$message.success(res.message);
      });
    },
    //hover元素操作时的事件
    hoverAction(item) {
      console.log(item);
      this.action_detailed = item;
    },
    //添加用例
    addUsecase() {
      // this.UseCaseData.push({
      //   description: "",
      //   action: "",
      //   element: "",
      //   action_parameter: "",
      //   isUse: true,
      // });
      if (this.UseCaseData.length == 0) {
        this.UseCaseData.push({
          id: 1,
          description: "",
          action: "",
          element: "",
          action_parameter: "",
          isUse: true
        });
      } else {
        const id = Math.max.apply(
          Math,
          this.UseCaseData.map(function(o) {
            return o.id;
          })
        );
        this.UseCaseData.push({
          id: id + 1,
          description: "",
          action: "",
          element: "",
          action_parameter: "",
          isUse: true
        });
      }
    },
    //删除用例
    deleteUsecase(index) {
      // console.log(row);
      this.UseCaseData.splice(index, 1);
    },
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector(".el-table__body-wrapper tbody");
      const _this = this;
      Sortable.create(tbody, {
        draggable: ".el-table__row",
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.UseCaseData.splice(oldIndex, 1)[0];
          _this.UseCaseData.splice(newIndex, 0, currRow);
        }
      });
    },
    //保存
    saveUseCase(useCase_id, UseCaseData) {
      console.log(this.UseCaseData);
      // 验证属性列表
      var result = true;
      var message = [];
      this.UseCaseData.forEach((item, index) => {
        let no = index + 1;
        if (item.description == "") {
          result = result && false;
          message.push("【步骤" + no + "】步骤描述不能为空");
        }
        if (item.action == "") {
          result = result && false;
          message.push("【步骤" + no + "】元素操作不能为空");
        }
        // if (item.element_value == "") {
        //   result = result && false;
        //   message.push("第" + no + "行：元素定位值不能为空");
        // }
      });
      if (!result) {
        var temp = "";
        message.forEach(v => {
          temp += `<li>${v}</li>`;
        });
        return this.$notify({
          title: "元素列表提示",
          dangerouslyUseHTMLString: true,
          type: "error",
          duration: 3000,
          message: `<ul>${temp}</ul>`
        });
      }
      UseCaseStep("post", { id: useCase_id, case_step: UseCaseData }).then(
        res => {
          console.log(res);
          this.$message.success(res.message);
          // this.UseCaseData = res.data;
        }
      );
    },
    //是否使用 xx
    isUse(index, row) {
      console.log(index, row);
      // const request_data = {
      //   id: row.id,
      //   isUse: row.isUse,
      //   project_id: this.project_id
      // };
      // //发送更新状态的接口
      // update_interface_use_case(request_data).then(response => {
      //   if (row.isUse == true) {
      //     this.$message({
      //       message: row.request_name + "已开启！",
      //       type: "success"
      //     });
      //   } else {
      //     this.$message({
      //       message: row.request_name + "已关闭！",
      //       type: "success"
      //     });
      //   }
      // });
    },
    //元素操作提示
    toBreak(val) {
      val =
        "操作名称：" +
        val.action_name +
        "<br/>" +
        "操作方法：" +
        val.action_method +
        "<br/>" +
        val.description;
      return val.split("\n").join("<br/>");
      // console.log(val);
      // return val;
    },
    append(data) {
      console.log(data);
    },
    //_____________________________________________________________________________________
    //文件用例的操作
    handleCommand(command) {
      console.log(command);
      if (command[0] == "addFile") {
        this.addFile(command[1]);
      } else if (command[0] == "addUseCase") {
        this.addUseCase(command[1]);
      } else if (command[0] == "delete") {
        this.delete(command[1], command[2]);
      } else if (command[0] == "edit") {
        this.edit(command[1], command[2]);
      }
    },
    //编辑用例或文件
    edit(node, data) {
      console.log(parent);
      this.$prompt("请输入名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputErrorMessage: "输入不能为空",
        inputValue: data.name,
        // inputValue: row.page_name,
        inputValidator: value => {
          // 点击按钮时，对文本框里面的值进行验证
          if (!value) {
            return "输入不能为空";
          }
        }
      })
        .then(({ value }) => {
          //发送更新用例或文件接口
          UseCase("put", {
            id: node.data.id,
            name: value
          })
            .then(res => {
              data.name = value;
              this.$message.success(res.message);
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消编辑"
          });
        });
    },
    //删除用例或文件
    delete(node, data) {
      this.$confirm("此操作将永久删除该项，以及所有子项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          UseCase("delete", {
            id: node.data.id
          })
            .then(res => {
              if (node.data.id == this.useCase_id) {
                this.useCase_id = "";
              }
              console.log(node);
              const parent = node.parent;
              const children = parent.data.children || parent.data;
              const index = children.findIndex(d => d.id === data.id);
              children.splice(index, 1);
              this.$message.success(res.message);
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //添加用例
    addUseCase(data) {
      console.log(parent);
      this.$prompt("请输入用例名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputErrorMessage: "输入不能为空",
        // inputValue: row.page_name,
        inputValidator: value => {
          // 点击按钮时，对文本框里面的值进行验证
          if (!value) {
            return "输入不能为空";
          }
        }
      })
        .then(({ value }) => {
          //发送新增用例接口
          UseCase("post", {
            name: value,
            type: 2,
            project_id: this.project_id,
            parent: data.id
          })
            .then(res => {
              if (data.id == null) {
                this.data.push(res.data);
              } else {
                if (!data.children) {
                  this.$set(data, "children", []);
                }
                data.children.push(res.data);
              }
              this.$message.success(res.message);
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    //添加文件
    addFile(data) {
      console.log(data);
      this.$prompt("请输入文件名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputErrorMessage: "输入不能为空",
        // inputValue: row.page_name,
        inputValidator: value => {
          // 点击按钮时，对文本框里面的值进行验证
          if (!value) {
            return "输入不能为空";
          }
        }
      })
        .then(({ value }) => {
          //发送新增文件接口
          UseCase("post", {
            name: value,
            type: 1,
            project_id: this.project_id,
            parent: data.id
          })
            .then(res => {
              if (data.id == null) {
                this.data.push(res.data);
              } else {
                if (!data.children) {
                  this.$set(data, "children", []);
                }
                data.children.push(res.data);
              }
              this.$message.success(res.message);
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    //更多弹窗的显隐
    changeDropdown(bool) {
      // console.log(bool);
      if (!bool) {
        this.isCase = false;
        this.isFile = false;
      }
    },
    //点击更多
    clickMore(data) {
      console.log("ssssssssssssa阿萨德ss", data);
      if (data.type == 1) {
        this.isFile = true;
      } else {
        this.isCase = true;
      }
    },
    //点击节点事件
    clickNode(node) {
      // console.log(node);
      if (node.type == 2) {
        this.useCase_id = node.id;
        this.$nextTick(() => {
          this.$refs.dataConfigTree.setCurrentKey(node.id);
        });
      } else {
        // console.log("sssss");
        if (this.useCase_id != "") {
          this.$nextTick(() => {
            this.$refs.dataConfigTree.setCurrentKey(this.useCase_id);
          });
        } else {
          this.$nextTick(() => {
            this.$refs.dataConfigTree.setCurrentKey(1);
          });
        }
      }
    },
    //用例或文件过滤节点
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    //元素操作过滤节点
    filterActionNode(value, data) {
      if (!value) return true;
      return data.action_name.indexOf(value) !== -1;
    }
  },
  watch: {
    filterCase(val) {
      console.log(val);
      this.$refs.dataConfigTree.filter(val);
    },
    filterAction(val) {
      console.log(val);
      this.$refs.action.filter(val);
    },
    useCase_id(val) {
      if (val != "") {
        this.highlight = true;
        this.caseStep = true;
        console.log(val, "usecase_id");
        UseCaseStep("get", { id: val }).then(res => {
          console.log(res);
          this.UseCaseData = res.data;
        });
      } else {
        tthis.UseCaseData = [];
        this.caseStep = false;
        this.highlight = false;
      }
    },
    debugRecordVisible(val) {
      if (!val) {
        this.stepData = [];
        this.stepRow = {
          start_time: "",
          end_time: "",
          time_consuming: ""
        };
      }
    }
  },
  created() {
    //获取文件用例列表
    UseCase("get", { project_id: this.project_id }).then(res => {
      this.data = res.data;
      this.$nextTick(() => {
        this.$refs.dataConfigTree.setCurrentKey(1);
      });
    });
    //获取元素操作列表
    ElementAction("get").then(res => {
      this.actionData = res.data;
      this.actionOptions = res.data;
    });
    //获取页面元素
    PageElement("get", { project_id: this.project_id }).then(res => {
      // this.actionData = res.data;
      this.pageElementOptions = res.data;
    });
  },
  mounted() {
    // 阻止默认行为
    document.body.ondrop = function(event) {
      event.preventDefault();
      event.stopPropagation();
    };
    this.rowDrop();
  }
};
</script>

<style >
/* .el-tree-node__content {
  background-color: #ffffff;
  height: 25px;
} */

/* .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #E4E7ED !important;
} */

/* .el-tree-node:focus > .el-tree-node__content {
  background-color: rgb(158, 213, 250) !important;
} */
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #bac8e5 !important;
}
.el-table__body tr.current-row > td {
  background: #409eff !important;
  color: rgb(255, 255, 255);
}
</style>
<style >
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.el-tree > .el-tree-node {
  min-width: 100%;
  display: inline-block;
}
.showname {
  width: 120px;
  /* width: 70%; */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
}
.showfile {
  width: 200px;
  /* width: 70%; */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
}
</style>