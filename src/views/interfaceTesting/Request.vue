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
            <el-input v-model="form.requestUrl" placeholder="请输入请求地址" style="width: 500px;"></el-input>
            <el-button style="margin-left: 10px" type="primary" @click="sendRequest('form')" >Send</el-button>
            <el-button type="primary" @click="save(form)">Save</el-button>
        </el-form-item>
        <el-tabs type="border-card" style="max-height: 300px; overflow: auto;" @tab-click='handleClick'>
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
        </el-form>
        <el-divider></el-divider>
        <div>
            <Response/>
        </div>
        <el-dialog title="保存" :visible.sync="dialogFormVisible">
        <el-form ref="saveForm" :model="saveForm" :rules="rules">
          <el-form-item label="接口名称" label-width="120px" prop="request_name">
            <el-input v-model="saveForm.request_name"  placeholder="请输入接口名称"></el-input>
          </el-form-item>
          <el-form-item label="保存到：" label-width="120px">
           <el-table
            :row-key="getRowKeys" 
            @selection-change="handleSelectionChange"
            ref="multipleTable"
            :data="saveForm.tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" 
            style="width: 100%;left: 20px;">
            <el-table-column
                :reserve-selection="true"
                prop="id"
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
            :show-overflow-tooltip='true'
            prop="file_name"
            label="文件名称">
            </el-table-column>
            <el-table-column
            :show-overflow-tooltip='true'
            prop="interfaceNumber"
            label="接口数量">
            </el-table-column>
            <el-table-column
            :show-overflow-tooltip='true'
            prop="create_time"
            label="创建时间">
            </el-table-column>
        </el-table>
        <!-- 分页显示 -->
        <el-pagination
                  style = text-align:center
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[5, 10, 15, 20, 40]" 
                  :page-size="pagesize"         
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="saveForm.tableData.length">    //这是显示总共有多少数据，
          </el-pagination>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureSave(saveForm)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import vueJsonEditor from 'vue-json-editor'
import {request_debug, get_file_list, update_request} from '@/api/interfaceTesting'
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
            requestUrl: [{ required: true, trigger: 'blur', validator: notNull }],
            request_name: [{ required: true, trigger: 'blur', validator: notNull }]
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
        //保存
        dialogFormVisible: false, // 保存表单显隐
        currentPage:1, //初始页
        pagesize:5,    //    每页的数据
        saveForm:{   //保存的表单
            request_name: null,
            tableData: [],
            multipleSelection: "",
        },
        
      }
    },
    methods: {
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
                    this.request_data = {
                        url: this.form.requestUrl,
                        method: this.form.requestType,
                        body: this.bodyData,
                        headers: header,
                        params: params,
                        dataState: this.dataStateCode
                    }
                    console.log(this.request_data)
                    //发送请求，返回数据
                    request_debug(this.request_data).then(response=>{
                        console.log(response.data.data)
                        // const response_data = eval('(' + response.data + ')')
                        // console.log(response_data)
                        // console.log("ssssssssssssssssssssss")
                        this.$bus.$emit('response',response.data)
                        this.$message({
                            message: '请求成功！',
                            type: 'success'
                            });
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
        //保存表单
        save(form){
            this.dialogFormVisible = true
            //获取文件列表
            this.saveForm.request_name = this.form.requestUrl
            get_file_list().then(response=>{
                this.saveForm.tableData = response.data
                }).catch(error => {
                    this.$message({
                        message: '获取失败',
                        type: 'error'
                        });
                    console.log(error)
                    })
                },
        //确定保存
        sureSave(form){
            console.log(form)
            const file_id = []
            if(form.multipleSelection){
                form.multipleSelection.forEach((elem, index)=>{
                file_id.push(elem.id)
                    });
                }
            if(form.request_name == '' || file_id.length === 0){
                console.log("-----------")
                this.$message({
                    message: '接口名称和文件不能为空',
                    type: 'error'
                    });
            }else{
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
                    requestName: form.request_name,
                    url: this.form.requestUrl,
                    method: this.form.requestType,
                    body: this.bodyData,
                    headers: header,
                    params: params,
                    dataState: this.dataStateCode,
                    file_id: file_id
                }
                console.log(request_data)
                //发送保存请求
                update_request(request_data).then(response=>{
                    console.log(response)
                    this.$bus.$emit('response',response.data)
                    this.$message({
                        message: '保存成功！',
                        type: 'success'
                        });
                    // 关闭保存弹窗
                    this.dialogFormVisible = false
                    }).catch(error => {
                        this.$message({
                            message: '参数错误！',
                            type: 'error'
                            });
                        console.log(error)
                        })
            }
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
      },
    }
</script>

<style>
     /* jsoneditor右上角默认有一个链接,加css去掉了 */
   .jsoneditor-poweredBy{
      display: none;
   }
</style>