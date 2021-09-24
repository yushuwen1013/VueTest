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
      </div>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        seareFileName: "",
        activeName: 'second'
      };
    },
    methods: {
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
