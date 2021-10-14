<template>
  <div class="custom-tree-container" style="width: 300px;height:100%">
    <el-select v-model="value" placeholder="请选择">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <div class="block">
      <p>使用 scoped slot</p>
      <el-tree
        :data="data"
        @node-click="getInterfaceUseCaseList"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>
            <i class="el-icon-folder"></i>
            {{ node.label }}
          </span>
          <span>
            <el-button type="text" size="mini" @click="() => append(data)">添加</el-button>
            <el-button type="text" size="mini" @click="() => remove(node, data)">删除</el-button>
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
let id = 1000;

export default {
  data() {
    const data = [
      {
        id: 1,
        label: "登录",
        children: [
          {
            id: 4,
            label: "用例1",
          },
          {
            id: 5,
            label: "用例2",
          }
        ]
      }
    ];
    return {
      data: JSON.parse(JSON.stringify(data)),
      data: JSON.parse(JSON.stringify(data)),
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: ""
    };
  },

  methods: {
    getInterfaceUseCaseList(data) {
      console.log(data, "22222222222");
    },
    append(data) {
      console.log(data);
      const newChild = { id: id++, label: "testtest", children: [] };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },

    remove(node, data) {
      console.log(node, data);
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    }
  }
};
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>