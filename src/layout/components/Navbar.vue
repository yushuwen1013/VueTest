<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu" style="margin-left: 100px;">
      <div>
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <img :src="url" class="user-avatar" />
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item>首页</el-dropdown-item>
            </router-link>
            <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
            </a>-->
            <el-dropdown-item divided @click.native="logout">
              <span style="display:block;">退 出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="right-menu">
      <el-select v-model="project_id" placeholder="请选择项目" size="small">
        <el-option
          v-for="item in tableData"
          :key="item.id"
          :label="item.project_name"
          :value="item.id"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import { get_project_list } from "@/api/interfaceTesting";
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      url: "http://127.0.0.1:8000/media/head.jpg",
      project_id: localStorage.getItem("project_id"), //项目id
      tableData: [] //项目table
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"])
  },
  created() {
    //获取项目列表
    get_project_list().then(response => {
      this.tableData = response.data;
      if (this.project_id == null) {
        localStorage.setItem(
          "project_id",
          JSON.stringify(this.tableData[0].id)
        );
      }
      this.project_id = parseInt(localStorage.getItem("project_id"));
    });
  },
  watch: {
    project_id(newValue, oldvalue) {
      console.log(newValue, oldvalue, "信息头的选择项目");
      localStorage.setItem("project_id", JSON.stringify(newValue));
      if (newValue != oldvalue) {
        this.$router.go(0);
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
