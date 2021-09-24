<template>
  <div class="deit">
    <div class="crumbs">
        <div class="cantainer">
          <el-table style="width: 100%;"
          :data="userList.slice((currentPage-1)*pagesize,currentPage*pagesize)"  
          >
              <!-- <el-table-column type="index" width="50">    
              </el-table-column>
              <el-table-column label="日期" prop="date" width="180">    
              </el-table-column>
              <el-table-column label="用户姓名" prop="name" width="180">    
              </el-table-column>
              <el-table-column label="邮箱" prop="email" width="180">    
              </el-table-column>
              <el-table-column label="地址" prop="address" width="200">    
              </el-table-column>     -->
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
              <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[5, 10, 15, 20, 40]" 
                  :page-size="pagesize"         
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="userList.length">    //这是显示总共有多少数据，
          </el-pagination>
        </div>
    </div>
  </div>
  
</template>

<script>
import { get_file_list, create_file, delete_file } from '@/api/interfaceTesting'
  export default {
    data() {
      return {
        currentPage:1, //初始页
        pagesize:10,    //    每页的数据
        userList: [
          {
            data: "那么",
            name: "ssssssss",
            email: "ssssss",
            address: "sssssssssss"
          }
        ]
      }
    },
    methods: {
      // 初始页currentPage、初始每页数据数pagesize和数据data
        handleSizeChange: function (size) {
                this.pagesize = size;
                console.log(this.pagesize)  //每页下拉显示数据
        },
        handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
                console.log(this.currentPage)  //点击第几页
        },
    },
    // mounted() {
    //   var num = 1;//1、声明循环变量   
    //   const a = [] 
    //   while (num<=125){//2、判断循环条件;
    //       a.unshift(this.userList[0])
    //       num += 1
    //   }
    //   this.userList = a
    // },
    created() {
        //获取文件列表
        get_file_list().then(response=>{
            console.log(response.data)
            this.userList = response.data
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

<style lang="scss" scoped>
</style>
