<template>
  <div id="home-component">
    <el-container>
      <el-header>
        <div>
          <img src="../assets/logo.png" alt="" />
          <span>电商后台管理系统</span>
        </div>
        <div>
          <span>欢迎{{ userInfo.name }}</span>
          <el-button type="info" @click="logout">退出</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside :width="isCollapseMenu ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleCollapseMenu">|||</div>
          <el-menu
            background-color="#373d41"
            text-color="#ffffff"
            :default-active="curActiveMenu"
            :collapse="isCollapseMenu"
            :collapse-transition="false"
            :unique-opened="true"
          >
            <el-submenu
              v-for="menu in menuList"
              :key="menu.id"
              :index="menu.id + ''"
            >
              <template slot="title">
                <i :class="'el-icon-' + menu.icon"></i>
                <span>{{ menu.name }}</span>
              </template>
              <el-menu-item
                v-for="subMenu in menu.children"
                :index="subMenu.id + ''"
                :router="{ name: subMenu.path }"
                :key="subMenu.id"
                @click="goRouter"
              >
                <template slot="title">
                  <i :class="'el-icon-' + subMenu.icon"></i>
                  <span>{{ subMenu.name }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view
            :userInfo="userInfo"
            :hasAuthority="hasAuthority"
          ></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import VueRouter from "vue-router"

const { isNavigationFailure, NavigationFailureType } = VueRouter

export default {
  name: "Home",
  async created () {
    await this.getUserInfo()
    await this.initMenuList()
  },
  updated () {
    this.traceUrl()
  },
  data () {
    return {
      userInfo: {},
      menuList: [],
      isCollapseMenu: false,
      curActiveMenu: null,
    }
  },
  methods: {
    hasAuthority (authority) {
      return this.userInfo.authorities && this.userInfo.authorities.has(authority)
    },
    traceUrl () {
      /* 以下实现菜单高亮和url路径同步变化 */
      let url =
        this.$router.mode === "hash"
          ? location.hash.substring(2)
          : location.pathname.substring(1)
      this.menuList.forEach((menu) =>
        menu.children.forEach((subMenu) => {
          if (subMenu.path === url) {
            this.curActiveMenu = subMenu.id + ""
          }
        })
      )
    },
    logout () {
      this.$axios.get("/logout")
      this.$router.push({ name: "index" })
    },
    async getUserInfo () {
      const { data: res } = await this.$axios(
        "/api/admin/auth"
      )
      this.userInfo = res.data
      this.userInfo.authorities = new Set(this.userInfo.authorities.map(a => a.authority))
    },
    async initMenuList () {
      const res = await this.$axios.get("/api/home/menuList")
      if (!res) {
        this.$router.push({ name: 'login' })
        return
      }
      this.menuList = res.data.data
    },
    toggleCollapseMenu () {
      this.isCollapseMenu = !this.isCollapseMenu
    },
    goRouter (menuItem) {
      this.$router.push(menuItem.$attrs.router).catch((failure) => {
        if (isNavigationFailure(failure, NavigationFailureType.duplicated)) {
          this.$message.info("已经在当前页面..")
        }
      })
    },
  },
};
</script>

<style scoped lang="less">
.el-header {
  color: white;
  font-size: 1.3em;
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;

  > div {
    height: 100%;
    display: flex;
    align-items: center;

    > span {
      margin-left: 15px;
      margin-right: 15px;
    }

    > img {
      height: 100%;
    }
  }
}

.el-aside {
  background-color: #373d41;

  > .el-menu {
    background-color: #373d41;
    border-right: none;
  }

  > .toggle-button {
    color: white;
    background-color: #696f75;
    font-size: 0.8em;
    text-align: center;
    letter-spacing: 0.5em;
    line-height: 24px;
    cursor: pointer;
  }
}

.el-main {
  background-color: #eee;
}
#home-component {
  height: 100%;
}

.el-container {
  height: 100%;
}
</style>
