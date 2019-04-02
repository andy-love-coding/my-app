<template>
<!--
使用element中的Form表单
el-form：表单根元素
  属性：
    model：给整个表单绑定数据源
    status-icon：输入框添加了这个，表示校验结果的反馈图标
    rules：用来给表单元素验证的对象
    ref：vue中操作dom元素的方式
    label-position: 设置表单对其方式
el-form-item：表单元素项
  属性：
    label：当前向的标题
    prop：设置验证规则对应的是哪个表单项（‘规则名’必须与绑定的‘数据属性名’相同）
el-input：input元素
  属性：
    type：input类型（同html类型一致）
    v-model：双向绑定数据源
    auto-complete：自动补全
el-button：按钮
  属性：
    type：按钮类型，不同类型有不同的样式
-->
<div class="login-wrap">
  <el-form :model="user" label-position="top" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm login-form">
    <h2>用户登录</h2>
    <el-form-item label="用户名" prop="username">
      <el-input type="text" v-model="user.username" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="user.password" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button class="login-btn" type="primary" @click="login('ruleForm2')">登录</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  data () {
    return {
      user: {
        username: '',
        password: ''
      },
      rules2: {
        username: [
          { required: true, message: '请输入用户名！', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码！', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login (formName) {
      // console.log(this) // this 指向 VueComponent
      // 前台先验证（使用验证规则）
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 前端验证通过
          this.$http.post('login', this.user).then(res => {
            var { data, meta } = res.data
            if (meta.status === 200) {
              // 登录成功
              this.$message({
                message: meta.msg,
                type: 'success'
              })
              // 保存登录token到loaclStorage
              window.localStorage.setItem('token', data.token)
              this.$router.push({name: 'index'})
            } else {
              // 登录失败
              this.$message.error(meta.msg)
            }
          })
        } else {
          // 前端验证失败(前端已有提示，无需再提示了)
          // this.$message.error('请填写正确的数据！')
        }
      })
    }
  }
}
</script>

<style>
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-wrap .login-form {
  background-color: #fff;
  width: 400px;
  padding: 30px;
  border-radius: 5px;
}
.login-wrap .login-form .login-btn {
  width: 100%;
}
</style>
