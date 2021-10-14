<template>
  <div style="width:800px">
    <el-table :data="tableData"
      border
      row-key="id"
      align="left">
     <el-table-column v-for="(item, index) in col"
        :key="item.id"
        :prop="col[index].prop"
        :label="item.label"> 
      </el-table-column>
      <el-table-column width="275" label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary">运行</el-button>
                <el-button size="mini" >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteInterface(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
    </el-table>
    <!-- <pre style="text-align: left">
      {{col}}
    </pre> -->
    <hr>
    <pre style="text-align: left">
      {{tableData}}
    </pre>
  </div>
</template>
<script>
import Sortable from 'sortablejs'
export default {
  data() {
    return {
      col: [
        {
          label: '编号',
          prop: 'code'
        },
        {
          label: '日期',
          prop: 'date'
        },
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '地址',
          prop: 'address'
        }
      ],
      tableData: [
        {
          code: "1",
          id: '1',
          date: '2016-05-02',
          name: '王小虎1',
          address: '上海市普陀区金沙江路 100 弄'
        },
        { code: "2",
          id: '2',
          date: '2016-05-04',
          name: '王小虎2',
          address: '上海市普陀区金沙江路 200 弄'
        },
        {
          code: "3",
          id: '3',
          date: '2016-05-01',
          name: '王小虎3',
          address: '上海市普陀区金沙江路 300 弄'
        },
        {
          code: "4",
          id: '4',
          date: '2016-05-03',
          name: '王小虎4',
          address: '上海市普陀区金沙江路 400 弄'
        }
      ]
    }
  },
  mounted() {
  // 阻止默认行为
	document.body.ondrop = function (event) {
             event.preventDefault();
             event.stopPropagation();
     };
    this.rowDrop()
    // this.columnDrop()
  },
  methods: {
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tableData.splice(oldIndex, 1)[0]
          _this.tableData.splice(newIndex, 0, currRow)
        }
      })
    },
    deleteInterface(index, row){
          console.log(index, row)
    }
  },
  watch:{
    tableData:{
      handler(newValue){
            const data = []
            console.log('tableData被修改了',newValue,)
            newValue.forEach((element, index) => {
                    element.code  =  index+1
                    data.push(element)
            });
            console.log(data)
					}
    }
  }
}
</script>
