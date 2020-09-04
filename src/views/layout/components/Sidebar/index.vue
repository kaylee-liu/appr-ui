<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#003165"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item :menu="menu" :is-collapse="isCollapse"/>
      <el-col  :span="24">
     <!-- <div class="header-img">
       <img class="imgu9" src="/static/img/u9.png">
     </div> -->
    <!-- <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#0D4C81"
      text-color="#bfcbd9"
      active-text-color="#fff"
      @open="handleOpen"
      @close="handleClose">
      <el-submenu index="1"  class='container-item'>
        <template slot="title">
          <img class="u7-img" src="/static/img/u7.png" >
          <span>任务管理</span>
           <i class="el-submenu__icon-arrow el-icon-arrow-down"></i>
        </template>
          <router-link to="/HomeTaskHall">
            <el-menu-item class='el-menu-item ' index="1-4-1">任务大厅</el-menu-item>
          </router-link>
          <router-link to="/TaskAnnouncement">
          <el-menu-item class='el-menu-item ' index="1-2">发布任务</el-menu-item>
           </router-link>
          <router-link to="/myTask">
          <el-menu-item class='el-menu-item ' index="1-3">我的任务</el-menu-item>
           </router-link>
      </el-submenu>
       <el-submenu class='container-item' index="2">
        <template slot="title">
          <img class="u14-img" src="/static/img/u14.png">
          <span>评分管理</span>
        </template>
          <router-link to="/reporttask">
            <el-menu-item class='el-menu-item' index="2-1">任务上报</el-menu-item>
          </router-link>
      </el-submenu>
      <el-submenu class='container-item' index="3">
        <template slot="title">  
          <i class="el-icon-location"></i>
          <span>任务考核</span>
        </template>
        <router-link to="/assignmentgather">
          <el-menu-item class='el-menu-item'  index="3-1">任务考核</el-menu-item>
        </router-link>
      </el-submenu>
    </el-menu> -->
  </el-col>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import { validatenull } from '@/utils/validate'
import { initMenu, setUrlPath } from '@/utils/util'

export default {
  components: { SidebarItem },
  created () {
    if (validatenull(this.menu)) {
      this.$store.dispatch('GetMenu').then(data => {
        initMenu(this.$router, data)
      })
    }
  },
  computed: {
    ...mapGetters(['menu', 'tag', 'isCollapse']),
    nowTagValue: function () {
      return setUrlPath(this.$route)
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    // .scrollbar-wrapper
    //   div
    //     .el-menu-vertical-demo
    //       .container-item
    //         .el-menu-item
    //             background pink
    #app
      .sidebar-container
        width 255px
        background #0D4C81 !important
        .container-item
          .u7-img
            width 14px
            height 13px
          .u14-img
            width 14px
            height 13px
          .el-menu-item
            background #023D75 !important
            &.is-active
              background-color #003263 !important
        .header-img
          width 255px
          height 65px
          .imgu9
            width 150px
            height 42px
</style>
