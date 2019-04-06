<template>
  <el-card>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'index'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{level3}}</el-breadcrumb-item>
    </el-breadcrumb>
  </el-card>
</template>

<script>
export default {
  name: 'MybreadCrumb', // 定义一个变量，作为导入组件、使用组件时的 组件名称，提前把组件名称设置好
  props: ['level2', 'level3'] // 定义组件的参数，将来导入组件时需从外部传入的参数变量
}
</script>

<style>
</style>
