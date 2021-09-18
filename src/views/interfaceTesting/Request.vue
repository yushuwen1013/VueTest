<template>
    <div>
        <el-form ref="form" :rules="rules" :model="form" label-width="80px" style="height: 400px">
        <!-- 请求类型和地址 -->
        <el-form-item label="请求类型">
            <el-select v-model="form.requestType" placeholder="请选择请求类型" style="width: 147px;">
            <el-option label="GET" value="get"></el-option>
            <el-option label="POST" value="post"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="请求地址" prop="requestUrl">
            <el-input v-model="form.requestUrl" placeholder="请输入请求地址" style="width: 832px;"></el-input>
            <el-button type="primary" @click="sendRequest('form')" >Send</el-button>
            <el-button type="primary" @click="saveRequest">保存</el-button>
        </el-form-item>
        <el-tabs type="border-card" style="max-height: 350px; overflow: auto;" @tab-click='handleClick'>
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
            <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
        </el-tabs>
    </el-form>
    <el-divider></el-divider>
    <div>
        <h2>Response 啦啦啦</h2>
        <Response/>
    </div>
    </div>
</template>

<script>
import vueJsonEditor from 'vue-json-editor'
import {request_debug} from '@/api/interfaceTesting'
import Response from './Response'
import Tables from './Tables'
export default {
    components:{vueJsonEditor,Response,Tables},
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
        //请求数据状态码 1是params,2是Json
        dataStateCode: 2,
        //:rules: rules表单规则校验
        rules: {
            requestUrl: [{ required: true, trigger: 'blur', validator: notNull }]
        },
        bodyData: {},
        //请求头数据
        headersTableData: [{
            key: "Content-Type",
            value: 'application/json',
            description: '请求内容类型'
        }],
        //请求params数据
        paramsTableData: [{
            key: '',
            value: '',
            description: ''
        }],
        form: {
          //请求类型
          requestType: 'get',
          //请求Url
          requestUrl: 'http://127.0.0.1:8000/user/login',
        },
      }
    },
    methods: {
        //判断请求数据的状态
        handleClick(tab, event) {
            if(tab.name == 'Params'){
                this.dataStateCode = 1
            }else{
                this.dataStateCode = 2
            }
            },
        //发送请求方法
        sendRequest(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var header = {}
                    this.headersTableData.forEach((elem,index)=>{
                        if(elem.key !== '' | elem.value !== ''){
                            header[elem.key] = elem.value
                        }
                    })
                    var params = {}
                    this.paramsTableData.forEach((elem,index)=>{
                        if(elem.key !== '' | elem.value !== ''){
                            params[elem.key] = elem.value
                        }
                    })
                    this.request_data = {
                        url: this.form.requestUrl,
                        method: this.form.requestType,
                        data: this.bodyData,
                        headers: header,
                        params: params,
                        dateState: this.dataStateCode
                    }
                    console.log(this.request_data)
                    //发送请求，返回数据
                    request_debug(this.request_data).then(response=>{
                        console.log(response.data.data)
                        // const response_data = eval('(' + response.data + ')')
                        // console.log(response_data)
                        // console.log("ssssssssssssssssssssss")
                        this.$bus.$emit('response',response.data.data)
                        this.$message({
                            message: '请求成功！',
                            type: 'success'
                            });
                    }).catch(error => {
                        console.log(error)
                        })
                
                } else {
                    
                    return false;
                }
                });
            
            },
        //保存这条请求记录
        saveRequest(){
            console.log("ssssssss")
            this.$message({
                message: '这是一条悲伤消息提示，因为这个功能没实现',
                })
            },
            },
        
    }
</script>

<style>
     /* jsoneditor右上角默认有一个链接,加css去掉了 */
   .jsoneditor-poweredBy{
      display: none;
   }
</style>