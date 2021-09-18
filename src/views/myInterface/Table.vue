<template>
  <el-table
        :data="tableData"
        stripe
        style="width: 100%">
    <el-table-column
        prop="name"
        label="name"
        width="150">
    </el-table-column>
    <el-table-column
        prop="method"
        label="method"
        width="100">
    </el-table-column>
    <el-table-column
        prop="url"
        label="url"
        width="300">
    </el-table-column>
    <el-table-column
        prop="headers"
        label="headers"
        width="250">
    </el-table-column>
    <el-table-column
        prop="params"
        label="params"
        width="250">
    </el-table-column>
    <el-table-column
        prop="body"
        label="body"
        width="300">
    </el-table-column>
    <el-table-column
    fixed="right"
    label="操作"
    width="150">
    <template slot-scope="scope">
        <el-button @click="viewRequest(scope.row)" type="text" size="small">查看</el-button>
        <el-button type="text" size="small">编辑</el-button>
        <el-button type="text" size="small">删除</el-button>
    </template>
    </el-table-column>
</el-table>
</template>

<script>
export default {
    name: "Table",
    props:['tableData'],
    data() {
        return {
            // tableData: tableData,
        }
        },
    methods:{
        //查看接口
        viewRequest(row) {
            console.log(row);
            this.$router.push({name: 'interfaceTesting', params:{requestData:row}})
        }
    }
}
</script>

<style>

</style>