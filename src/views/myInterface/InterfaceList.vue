<template>
    <div style="background:#EAEAEA; height: 1000px">
      <div style="background:#fff">
        <p style="width: 1600px;height: 30px;padding-left: 31px;font-size:22px;">接口列表</p>
        </div>
      <div>
        <el-button style="margin-left: 20px;margin-bottom: 20px;" type="primary" icon="el-icon-back"  @click="back">返回</el-button>
        <el-button style="float: right;margin-right: 20px;margin-bottom: 20px;" type="primary" icon="el-icon-circle-plus-outline">添加</el-button>
        <el-table
            :data="tableData"
            height="600"
            style="width: 100%;left: 20px;">
            <el-table-column
            :show-overflow-tooltip='true'
            max-height='100'
            width="180"
            prop="request_name"
            label="请求名称(requestName)">
            </el-table-column>
            <el-table-column
            :show-overflow-tooltip='true'
            width="150"
            prop="method"
            label="请求类型(method)">
            </el-table-column>
            <el-table-column
            :show-overflow-tooltip='true'
            prop="url"
            label="请求地址(url)">
            </el-table-column>
            <el-table-column
            :show-overflow-tooltip='true'
            prop="headers"
            label="请求头部(headers)">
            </el-table-column>
            <el-table-column
            :show-overflow-tooltip='true'
            prop="data"
            label="请求参数(body)">
            </el-table-column>
            <el-table-column width="250" label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="sendRequest(scope.$index,scope.row)">运行</el-button>
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
      <el-drawer
      title="接口信息"
      :visible.sync="drawer">
        <span class='span'>接口名称：{{requestData.requestName}}</span><br><br><br>
        <span class='span'>请求类型：{{requestData.requestType}}</span><br><br><br>
        <span class='span'>请求地址：{{requestData.requestUrl}}</span><br><br><br>
        <el-collapse  v-model="activeNames">
          <el-collapse-item title="请求头" name="1"> 
            <json-viewer :value="requestData.headers" :expand-depth="2" copyable sort></json-viewer>
          </el-collapse-item>
           <el-collapse-item title="请求参数" name="2"> 
            <json-viewer :value="requestData.body" :expand-depth="2" copyable sort></json-viewer>
          </el-collapse-item>
          <el-collapse-item title="响应数据" name="3" visible="false"> 
              <json-viewer :value="resultInfo.data" :expand-depth="2" copyable sort></json-viewer>
          </el-collapse-item>
        </el-collapse>
    </el-drawer>
    </div>
</template>

<script>
  import { get_request_list, update_request } from '@/api/interfaceTesting'
  import JsonViewer from 'vue-json-viewer'
  import vueJsonEditor from 'vue-json-editor'
  import {request_debug} from '@/api/interfaceTesting'
  export default {
    name:'InterfaceList',
    components: {JsonViewer,vueJsonEditor},
    data() {
      return {
        //默认展开第三个响应数据
        activeNames: ['3'],
        resultInfo : {},
        drawer: false,
        tableData: [{
          request_name: 'WebPro',
          url: 'http://127.0.0.1:8000/user/login',
          method: 'post',
          headers: `{"Content-Type": "application/json"}`,
          body: `{"username": "admin","password": "123456"}`
        }],
        requestData :{
          requestName: 'WebPro',
          requestUrl: 'http://127.0.0.1:8000/user/login',
          requestType: 'post',
          headers: `{"Content-Type": "application/jsonpplication/json"}`,
          body: `{"username": "admin","password": "123456"}`
        }
      }
    },
    methods: {
      //运行  -  发送请求
      sendRequest(index, row){
        console.log(index, row)
        const a = JSON.parse(row.body)
        const request_data = {
            url: row.requestUrl,
            method: row.requestType,
            data: JSON.parse(row.body),
            headers: JSON.parse(row.headers),
            // params: params,
            dateState: 2
        }
        console.log(request_data)
        //发送请求，返回数据
        request_debug(request_data).then(response=>{
            console.log("----------------",response.data.data)
            this.resultInfo = response.data
            this.$message({
                message: '请求成功！',
                type: 'success'
                });
            //右侧弹窗显示信息
            this.drawer = true
        }).catch(error => {
            this.$bus.$emit('response',{})
            console.log(error)
            })
      },
      //返回上一级
      back(){
				this.$router.back()
			},
      //编辑文件
      editFile(index, row) {
        this.$prompt('请输入文件名', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: row.fileName,
            inputErrorMessage: "输入不能为空",
            inputValidator: (value) => {       // 点击按钮时，对文本框里面的值进行验证
                        if(!value.trim()) {
                            return '输入不能为空';
                        }}
          }).then(({ value }) => {
            row.fileName = value
            this.$message({
              type: 'success',
              message: '文件名称是: ' + value,
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });       
          })
      },
      //删除文件
      deleteFile(index, row) {
        console.log(index, row)
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.tableData.splice(index,1)
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        
      },
    },
    created(){
      //请求参数
      const data = {"file_id": 1}
      // 获取接口列表
      get_request_list(data).then(response=>{
            const responseData = response.data
            responseData.forEach((elem, index) => {
                if(elem.dataState == "2"){
                      elem['data'] = elem['body']
                }else{
                      elem['data'] = elem['params']
                }
                });
            console.log(responseData);
            this.tableData = responseData
        }).catch(error => {
            this.$bus.$emit('response',{})
            console.log(error)
            })
    }
  }
</script>

<style>
.span{
  padding-left: 10px;
}
/* 抽屉标题文字的大小 */
.el-collapse-item__header{
  font-size: 17px;
  padding-left: 10px;
}
/* 抽屉超出显示滚动条 */
.el-drawer.rtl{
    overflow: scroll;
}
</style>
