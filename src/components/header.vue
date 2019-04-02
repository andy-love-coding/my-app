<template>
  <el-row>
    <el-col :span="4">
      <div class="grid-content bg-purple">icon</div>
    </el-col>
    <el-col :span="16">
      <div class="grid-content bg-purple-light head-title">电商后台管理系统</div>
    </el-col>
    <el-col :span="4">
      <div class="grid-content bg-purple logout"><a href="javascript:;" @click.prevent="logout">退出</a></div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  methods: {
    logout () {
      // 清除指定的token
      // window.localStorage.clear();  //这是错误的方式，会清除所有localStorage，会影响其他人
      window.localStorage.removeItem('token')
      this.$message({
        message: '退出成功',
        type: 'success'
      })
      setTimeout(() => {
        // 退出后，回到登录页
        this.$router.push({name: 'login'})
      }, 1000)
    }
  }
}
</script>

<style>
.head-title {
  font-size: 24px;
  color: #fff;
}
.logout {
  text-align: right;
}
.logout a {
  color: #666;
}
</style>
