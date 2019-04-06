<template>
  <el-container class="container">
		<el-header>
			<!-- 使用头部组件 -->
			<Header />
		</el-header>
		<el-container>
			<el-aside width="200px">
				<!-- 使用侧边栏组件 -->
				<Asider />
			</el-aside>
			<el-main>
				<router-view />
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
// 引入头部组件
import Header from '@/components/header.vue'
// 引入侧边栏组件
import Asider from '@/components/asider.vue'
export default {
	// 登录判断方法1：用生命周期钩子函数(只要是进入home路由，也就是根目录'/'，就需要登录判断，包括home的子路由,其实就是所有路由了)
	// 登录判断方法2：在src/router/index.js 中用导航守卫（或路由守卫）实现登录判断功能
	// beforeCreate () {
	// 	var token = window.localStorage.getItem('token')
	// 	if (!token) {
	// 		this.$message.error('对不起，您还没有登录！')
	// 		this.$router.push({ name: 'login' })
	// 	}
	// },
	// 注册组件
	components: {
		Header,
		Asider
	}
}
</script>

<style>
.container {
	height: 100%;
}
.el-header {
	background-color: #b3c0d1;
	color: #333;
	text-align: center;
	line-height: 60px;
}
.el-aside {
	background-color: #d3dce6;
	color: #333;
	text-align: center;
	line-height: 200px;
	height: 100%;
}
.el-main {
	background-color: #e9eef3;
	color: #333;
	/* 注意： el-main这2个属性要去掉，否则将会被main中的文本元素继承，影响子元素布局 */
	/* text-align: center; */
	/* line-height: 160px; */
}
</style>
