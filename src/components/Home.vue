<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" @click="goHome" />
        <span>网抑云后台管理系统</span>
      </div>
      <el-button type="info" @click="goOut">退出</el-button>
    </el-header>
    <!-- 页面主题区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">
          <i class="el-icon-more-outline"></i>
        </div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#373d34"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.order]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="childItem.path"
              v-for="childItem in item.children"
              :key="childItem.id"
              @click="saveNavState(childItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ childItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主题 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      menuList: [], // 左侧菜单数据
      iconsObj: {
        // 左侧菜单图标
        1: 'el-icon-s-custom',
        2: 'el-icon-s-check',
        3: 'el-icon-s-shop',
        4: 'el-icon-s-order',
        5: 'el-icon-s-marketing'
      },
      isCollapse: false, // 控制菜单是否折叠
      activePath: '' // 被激活的连接地址
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    goOut() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    goHome() {
      this.$router.push('/home')
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status === 200) {
        this.menuList = res.data
        // console.log(res.data);
      } else {
        return this.$message.error(res.meta.msg)
      }
    },
    // 点击按钮实现折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存连接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  width: 100%;
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  background-color: #373d34;
  color: #fff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 595px;
      font-size: 26px;
      font-weight: bold;
      background-image: linear-gradient(to right, orange, pink);
      background-clip: text;
      color: transparent;
    }
    img {
      width: 50px;
      height: 50px;
      padding-left: 20px;
      cursor: pointer;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border: 0;
  }
  .toggle-button {
    background-color: #4a5064;
    font-size: 16px;
    line-height: 28px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
}

.el-main {
  background-color: #eaedf1;
}
</style>
