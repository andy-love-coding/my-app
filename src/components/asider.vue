<template>
  <el-row>
    <!--
      router: 是 Menu Attribute ，是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
      unique-opened: 是 Menu Attribute ，是否只保持一个子菜单的展开，默认 false
      open/close: 是 Menu Methods
     -->
    <el-menu :router="menuOptions.router" :unique-opened="menuOptions.uniqueOpened">
      <el-submenu class="position" index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>用户管理</span>
        </template>
        <el-menu-item index="/users">
          <template>
            <i class="el-icon-menu"></i>
            <span>用户列表</span>
          </template>
        </el-menu-item>
      </el-submenu>
      <el-submenu class="position" index="2">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>权限管理</span>
        </template>
        <el-menu-item index="/users">
          <template>
            <i class="el-icon-menu"></i>
            <span>角色列表</span>
          </template>
        </el-menu-item>
        <el-menu-item index="/users">
          <template>
            <i class="el-icon-menu"></i>
            <span>权限列表</span>
          </template>
        </el-menu-item>
      </el-submenu>
      <el-submenu class="position" index="3">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>商品管理</span>
        </template>
        <el-menu-item index="/users">
          <template>
            <i class="el-icon-menu"></i>
            <span>商品列表</span>
          </template>
        </el-menu-item>
        <el-menu-item index="/users">
          <template>
            <i class="el-icon-menu"></i>
            <span>分类参数</span>
          </template>
        </el-menu-item>
        <el-menu-item index="/users">
          <template>
            <i class="el-icon-menu"></i>
            <span>商品分类</span>
          </template>
        </el-menu-item>
      </el-submenu>
      <el-submenu class="position" index="4">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>订单管理</span>
        </template>
        <el-menu-item index="/users">
          <template>
            <i class="el-icon-menu"></i>
            <span>订单列表</span>
          </template>
        </el-menu-item>
      </el-submenu>
      <el-submenu class="position" index="5">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>数据统计</span>
        </template>
        <el-menu-item index="/users">
          <template>
            <i class="el-icon-menu"></i>
            <span>数据报表</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      menuOptions: {
        router: true,
        uniqueOpened: true
      }
    }
  }
}
</script>

<style>
.el-row {
  height: 100%;
}
.el-row ul {
  height: 100%;
}
.position {
  text-align: left;
}
</style>
