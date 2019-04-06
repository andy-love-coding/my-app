<template>
  <el-row>
    <!--
      router: 是 Menu Attribute ，是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
      unique-opened: 是 Menu Attribute ，是否只保持一个子菜单的展开，默认 false
      open/close: 是 Menu Methods
     -->
    <el-menu :router="menuOptions.router" :unique-opened="menuOptions.uniqueOpened">
      <el-submenu class="position" v-for="(item1, index) in menus" :key="item1.id" :index="index.toString()">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{ item1.authName }}</span>
        </template>
        <!-- 加'/',把inxex由相对路径，变成绝对路径 -->
        <el-menu-item v-for="item2 in item1.children" :key="item2.id" :index="'/' + item2.path">
          <template>
            <i class="el-icon-menu"></i>
            <span>{{ item2.authName }}</span>
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
      },
      menus: []
    }
  },
  created () {
    this.getMenus()
  },
  methods: {
    getMenus () {
      this.$http({
        url: 'menus',
        method: 'get'
      }).then(res => {
        var { data, meta } = res.data
        if (meta.status === 200) {
          this.menus = data
        } else {
          this.$message.error(meta.msg)
        }
      })
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
