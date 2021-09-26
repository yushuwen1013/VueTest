<template>
    <div style="width: 100%;left: 35px; margin-left: 35px;overflow-y:auto;height: 800px">
        <el-form ref="form" :rules="rules" :model="form" label-width="80px" style="height: 400px;margin-top: 50px;">
        <!-- 请求类型和地址 -->
            <el-form-item label="接口名称" prop="request_name">
                <el-input v-model="form.request_name" placeholder="请输入请求地址" style="width: 500px;"></el-input>
            </el-form-item>
            <el-form-item label="请求类型">
                <el-select v-model="form.requestType" placeholder="请选择请求类型" style="width: 147px;">
                <el-option label="GET" value="get"></el-option>
                <el-option label="POST" value="post"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="请求地址" prop="requestUrl">
                <el-input v-model="form.requestUrl" placeholder="请输入请求地址" style="width: 500px;"></el-input>
                <el-button style="margin-left: 10px" type="primary" @click="sendRequest('form')" >Send</el-button>
            </el-form-item>
        <el-tabs type="border-card" style="height: 400px; overflow: auto;" @tab-click='handleClick'>
            <!-- 请求头 -->
            <el-tab-pane label="Headers">
                <Tables :TableData='headersTableData'/>
            </el-tab-pane>
            <!-- 请求Params参数 -->
            <el-tab-pane label="Params" name="Params">
                <Tables :TableData='paramsTableData'/>
            </el-tab-pane>
            <!-- 请求Body Json参数 -->
            <el-tab-pane label="Body" name="Body">
                <vue-json-editor
                    v-model="bodyData"
                    :showBtns="false"    
                    :mode="'code'"   
                    lang="zh" 
                    />
            </el-tab-pane>
        </el-tabs>
        <div style="margin-top: 35px;margin-left: 35px;">
            <el-button type="primary" @click="Save">保 存</el-button>
            <el-button @click="back" style="margin-left: 35px;">取 消</el-button>
        </div>
        </el-form>
     <el-drawer
        title="接口信息"
        :visible.sync="drawer">
        <span class='span'>接口名称：{{form.request_name}}</span><br><br><br>
        <span class='span'>请求类型：{{form.requestType}}</span><br><br><br>
        <span class='span'>请求地址：{{form.requestUrl}}</span><br><br><br>
        <el-collapse  v-model="activeNames">
        <el-collapse-item title="请求头" name="1"> 
            <json-viewer :value="requestData.headers" :expand-depth="2" copyable sort></json-viewer>
        </el-collapse-item>
        <el-collapse-item title="请求参数" name="2"> 
            <json-viewer :value='(requestData.dataState == "2")?requestData.body:requestData.params' :expand-depth="2" copyable sort></json-viewer>
        </el-collapse-item>
        <el-collapse-item title="响应数据" name="3" visible="false"> 
            <json-viewer :value="resultInfo.data" :expand-depth="2" copyable sort></json-viewer>
        </el-collapse-item>
        </el-collapse>
    </el-drawer>
    </div>
</template>

<script>
import vueJsonEditor from 'vue-json-editor'
import {request_debug,  update_request, get_request_list } from '@/api/interfaceTesting'
import JsonViewer from 'vue-json-viewer'
import Response from '@/views/interfaceTesting/Response'
import Tables from '@/views/interfaceTesting/Tables'
export default {
    name: 'InterfaceEdit',
    components:{vueJsonEditor,Tables,JsonViewer},
    props:["request_data"],
      data() {
        //不为空的表单校验
        const notNull = (rule, value, callback) => {
            console.log(value)
            if (!value) {
                return callback(new Error('不能为空'));
            }else{
                callback()
            }}
      return {
        requestData:{},
        //运行默认展开第三个响应数据
        activeNames: ['3'],
        //响应数据
        resultInfo : {},
        //运行结果展示
        drawer: false,
        //请求数据状态码 1是params,2是Json
        dataStateCode: this.request_data.dataState,
        //:rules: rules表单规则校验
        rules: {
            requestUrl: [{ required: true, trigger: 'blur', validator: notNull }],
            request_name: [{ required: true, trigger: 'blur', validator: notNull }]
        },
        bodyData: this.request_data.body,
        //请求头数据
        headersTableData: this.request_data.headers,
        //请求params数据
        paramsTableData: this.request_data.params,
        form: {
            //请求类型
            requestType: this.request_data.method,
            //请求Url
            requestUrl: this.request_data.url,
            request_name: this.request_data.requestName,
        },
      }
    },
    methods: {
        //返回
        back(){
            this.$parent.showInterfaceEdit = false
        },
        //获取row的id
        getRowKeys(row) {
            return row.id;
        },
        //判断请求数据的状态
        handleClick(tab, event) {
            if(tab.name == 'Params'){
                this.dataStateCode = 1
            }
            else if(tab.name == 'Body'){
                this.dataStateCode = 2
            }
            },
        //发送请求方法
        sendRequest(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    const header = {}
                    this.headersTableData.forEach((elem,index)=>{
                        if(elem.key !== '' | elem.value !== ''){
                            header[elem.key] = elem.value
                        }
                    })
                    const params = {}
                    this.paramsTableData.forEach((elem,index)=>{
                        if(elem.key !== '' | elem.value !== ''){
                            params[elem.key] = elem.value
                        }
                    })
                    const request_data = {
                        url: this.form.requestUrl,
                        method: this.form.requestType,
                        body: this.bodyData,
                        headers: header,
                        params: params,
                        dataState: this.dataStateCode,
                        request_name: this.request_name
                    }
                    this.requestData = request_data
                    console.log(request_data, "++++++++++++++++++++")
                    //发送请求，返回数据
                    request_debug(request_data).then(response=>{
                        console.log(response.data.data)
                        this.resultInfo = response.data
                        this.$message({
                            message: '请求成功！',
                            type: 'success'
                            });
                        //显示右侧弹窗
                        this.drawer = true
                    }).catch(error => {
                        this.$message({
                            message: '参数错误！',
                            type: 'error'
                            });
                        this.$bus.$emit('response',{})
                        console.log(error)
                        })
                
                } else {
                    return false;
                }
                });
            
            },
        //保存
        Save(){
            console.log(this.request_data)
            const header = {}
            this.headersTableData.forEach((elem,index)=>{
                if(elem.key !== '' | elem.value !== ''){
                    header[elem.key] = elem.value
                }
            })
            const params = {}
            this.paramsTableData.forEach((elem,index)=>{
                if(elem.key !== '' | elem.value !== ''){
                    params[elem.key] = elem.value
                }
            })
            const request_data = {
                url: this.form.requestUrl,
                method: this.form.requestType,
                body: this.bodyData,
                headers: header,
                params: params,
                dataState: this.dataStateCode,
                requestName: this.form.request_name
            }
            if(this.request_data.id != undefined){
                request_data.id = this.request_data.id
            }
            request_data.file_id = [this.request_data.file_id]
            console.log(request_data, "+++++++++++++++++++++")
            //发送保存请求
            update_request(request_data).then(response=>{
                console.log(response)
                this.$bus.$emit('response',response.data)
                this.$message({
                    message: '修改成功！',
                    type: 'success'
                    });
                //切换回接口列表页面
                this.$parent.showInterfaceEdit = false
                //获取接口列表
                const file_id = localStorage.getItem('file_id');
                const data = {"file_id": file_id}
                get_request_list(data).then(response=>{
                    const responseData = response.data
                    responseData.forEach((elem, index) => {
                        if(elem.dataState == "2"){
                            elem['data'] = elem['body']
                        }else{
                            elem['data'] = elem['params']
                        }
                        });
                    this.$parent.tableData = responseData
                })
                }).catch(error => {
                    this.$message({
                        message: '参数错误！',
                        type: 'error'
                        });
                    console.log(error)
                    })
        },
        // 初始页currentPage、初始每页数据数pagesize和数据data
        handleSizeChange: function (size) {
                    this.pagesize = size;
                    console.log(this.pagesize)  //每页下拉显示数据
            },
        handleCurrentChange: function(currentPage){
                    this.currentPage = currentPage;
                    console.log(this.currentPage)  //点击第几页
            },
        handleSelectionChange(val) {
            console.log(val)
            this.saveForm.multipleSelection = val;
                },
      }
    }
</script>

<style>
     /* jsoneditor右上角默认有一个链接,加css去掉了 */
   .jsoneditor-poweredBy{
      display: none;
   }
</style>