<template>
    <div style="background:#EAEAEA; height: 1000px">
      <div style="background:#fff">
        <p style="width: 1600px;height: 30px;padding-left: 31px;font-size:22px;">文件列表</p>
        </div>
      <div>
        <el-button style="margin-left: 20px;margin-bottom: 20px;" type="primary" icon="el-icon-plus"  @click="addFile">添加</el-button>
        <el-table
            @row-dblclick='showInterfaceList'
            :data="tableData"
            height="600"
            style="width: 100%;left: 20px;">
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
import { get_file_list, create_file, delete_file } from '@/api/interfaceTesting'
export default {
    data() {
      return {
        tableData: [],
        editableTabsValue: '2',
        editableTabs: [{
          title: 'Tab 1',
          name: '1',
          content: 'Tab 1 content'
        }],
        tabIndex: 1
      }
    },
    methods: {
      //添加文件
      addFile() {
        this.$prompt('请输入文件名', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputErrorMessage: "输入不能为空",
            inputValidator: (value) => {       // 点击按钮时，对文本框里面的值进行验证
                        console.log(value)
                        if(!value.trim()) {
                            return '输入不能为空';
                        }}
          }).then(({ value }) => {
            //接口参数
            const createData = {"fileName": value}
            //发送新增文件接口
            create_file(createData).then(response=>{
                get_file_list().then(response=>{
                    this.tableData = response.data
                })
                }).catch(error => {
                    this.$message({
                        message: '新增失败',
                        type: 'error'
                        });
                    console.log(error)
                    })
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
      //编辑文件
      editFile(index, row) {
        this.$prompt('请输入文件名', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: row.file_name,
            inputErrorMessage: "输入不能为空",
            inputValidator: (value) => {       // 点击按钮时，对文本框里面的值进行验证
                        if(!value.trim()) {
                            return '输入不能为空';
                        }}
          }).then(({ value }) => {
            const data = {
                "fileName": value,
                "id": row.id
            }
            create_file(data).then(response=>{
                get_file_list().then(response=>{
                    this.tableData = response.data
                })
                }).catch(error => {
                    this.$message({
                        message: '修改失败',
                        type: 'error'
                        });
                    console.log(error)
                    })
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
            //删除文件接口
            const id = {"id": row.id}
            delete_file(id).then(response=>{
                console.log(response.data)
                get_file_list().then(response=>{
                    this.tableData = response.data
                })
                }).catch(error => {
                    this.$message({
                        message: '删除失败',
                        type: 'error'
                        });
                    console.log(error)
                    })
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
      //双击进入接口列表
      showInterfaceList(row, column){
          this.$router.push({ name: 'InterfaceList', params: { userId: 123 }})
      },
    },
    // 创建之前发送请求
    created() {
        //获取文件列表
        get_file_list().then(response=>{
            console.log(response.data)
            this.tableData = response.data
        }).catch(error => {
            this.$message({
                message: '获取失败',
                type: 'error'
                });
            console.log(error)
            })
    }
  }
</script>

<style lang="css">
 .el-tooltip__popper{
    max-width:20%;
  }
  .el-tooltip__popper,.el-tooltip__popper.is-dark{
    background:rgb(48, 65, 86) !important;
    color: #fff !important;
    line-height: 24px;
  }
</style>
