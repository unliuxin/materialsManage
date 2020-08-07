<template>
  <div class="home">
    <el-container>
      <el-header class="home-header">
        <div class="home-header-logo">
          <h1>物资管理系统</h1>
        </div>
        <div class="home-header-Info">
          <div class="user_avatar_search user_avatar_i">
            <i class="el-icon-search"></i>
          </div>
          <div class="user_avatar_bell user_avatar_i">
            <el-badge is-dot class="item">
              <i class="el-icon-bell"></i>
            </el-badge>
          </div>
          <div class="user_avatar_message user_avatar_i">
            <el-badge is-dot class="item" type="primary">
              <i class="el-icon-message"></i>
            </el-badge>
          </div>
          <el-dropdown>
            <el-avatar class="user_avatar_img">
              <img src="../../assets/images/admin.jpg" alt />
            </el-avatar>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span icon="el-icon-s-home">系统首页</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span icon="el-icon-s-tools">系统设置</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span @click="loginout" icon="el-icon-caret-right">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside :width="isCollapse ?'64px' :'200px'">
          <div class="collage" @click="conkcollapse">|||</div>
          <el-menu
            background-color="#272c33"
            text-color="#fff"
            active-text-color="#FFF"
            router
            :default-active="activepath"
            :collapse-transition="false"
            unique-opened
            :collapse="isCollapse"
          >
            <subMenu :sumenulist="menulist"></subMenu>
          </el-menu>
        </el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import subMenu from "./homeChild/subMenu";
export default {
  name: "Home",
  data() {
    return {
      isCollapse: false, //控制左侧导航展开和伸缩
      menulist: [],
      activepath:''//点击二级菜单获取的下标
    };
  },
  components: {
    subMenu,
  },
  created() {
    this.getMenuLists();
    this.activepath = window.sessionStorage.getItem('activepath')
  },
  methods: {
    //获取左侧菜单栏数据
    async getMenuLists() {
      const { data: res } = await this.$http.get("user/findMenu");
      if (res.code !== 200) {
        return this.$message.error("获取左侧菜单栏数据失败");
      } else {
        this.menulist = res.data;
      }
      console.log(res);
    },
    conkcollapse() {
      this.isCollapse = !this.isCollapse;
    },
    //退出登录
    loginout() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.home-header {
  background-color: #272c33;
  overflow: hidden;
  padding: 0 50px;
}
.home-header-logo {
  float: left;
}
.home-header-Info {
  float: right;
  display: flex;
  align-items: center;
  height: 60px;
}
.home-header-logo h1 {
  color: blanchedalmond;
  height: 60px;
  line-height: 60px;
  padding: 0;
  margin: 0;
}
.el-menu {
  border-right: none !important;
  background: #272c33 !important;
}
.el-submenu__title {
  background: #272c33 !important;
}
.collapse_button {
  background: #28283b;
  color: white;
  text-align: center;
  letter-spacing: 2px;
  padding: 5px 0;
  cursor: pointer;
}
.collapse_button span {
  padding-left: 12px;
}
.user_avatar_i {
  width: 50px;
  font-size: 23px;
  color: #fff;
}
.user_avatar_i span {
  color: red;
  font-size: 10px;
  position: absolute;
  text-align: center;
  display: inline-grid;
  font-weight: 900;
}

.el-aside {
  height: 100vh;
  background: #272c33;
}
.collage {
  text-align: center;
  background: #2d3436;
  color: white;
}
</style>