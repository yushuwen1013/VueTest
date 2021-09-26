<template>
<div style="background:#EAEAEA; height: 100%">
      <div style="background:#fff">
        <p style="width: 1600px;height: 30px;padding-left: 31px;font-size:22px;">变量管理</p>
      </div>
      <div>
       <el-form :inline="true" class="demo-form-inline" style="margin-left: 35px;">
          <el-form-item label="文件名称">
            <el-input v-model="seareFileName" placeholder="请输入文件名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="inquire">查询</el-button>
            <el-button type="primary" @click="reset">重置</el-button>
          </el-form-item>
          <el-button style="float: right;margin-bottom: 20px;margin-right: 50px;" type="primary" icon="el-icon-plus"  @click="addFile">添加</el-button>
        </el-form>
        <el-table
            height="600"
            @row-dblclick='showInterfaceList'
            :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" 
            style="width: 100%;left: 20px;">
            <el-table-column
            :show-overflow-tooltip='true'
            prop="file_name"
            label="变量名(Key)">
            </el-table-column>
            <el-table-column
            :show-overflow-tooltip='true'
            prop="interfaceNumber"
            label="变量值(Value)">
            </el-table-column>
            <el-table-column
            :show-overflow-tooltip='true'
            prop="create_time"
            label="备注">
            </el-table-column>
            <el-table-column width="200" label="操作">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="editFile(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="deleteFile(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
      </div>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [{
          file_name: "s",
          interfaceNumber: "sss",
          create_time: "sss"

        }],
        seareFileName: "",
        activeName: 'second'
      };
    },
    methods: {
      deleteFile(){

      },
      editFile(){

      },
      //查询
      inquire(){
      },
      //重置
      reset(){
      },
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>

<style>
</style>
