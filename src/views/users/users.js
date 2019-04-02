export default {
  data () {
    return {
      dataList: [], // 用户列表数据
      pagenum: 1,
      pagesize: 2,
      query: '', // 查询关键字
      pagesizes: [2, 4, 6, 8, 10],
      total: 0, // 用户列表总条数
      addVisible: false, // 新增用户面板显示与否，默认不显示
      addLabelWidth: '120px', // 新增或编辑用户面板的表单宽度
      form: { // 新增或编辑用户面板的表单数据
        username: '',
        password: '',
        email: '',
        mobile: '',
        id: '' // 编辑的使用才用 id
      },
      rules2: { // 新增用户面板的：验证规则
        username: [{
          required: true,
          message: '请输入用户名！',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }]
      },
      editVisible: false, // 编辑用户面板显示与否，默认不显示
      rules3: { // 编辑用户面板的：验证规则
        username: [{
          required: true,
          message: '请输入用户名！',
          trigger: 'blur'
        }]
      },
      loading: true,
      roleVisible: false, // 分配用户角色的面板显示与否，默认不显示
      rolelabelWiddth: '150px',
      currentUser: { // 分配角色面板的 当前用户
        username: '',
        id: '',
        rid: ''
      },
      rolesList: [{ // 角色列表
        rolename: 'aaa',
        id: 500
      }, {
        rolename: 'bbb',
        id: 600
      }]
    }
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    // 请求用户列表数据
    getDataList () {
      this.$http({
        url: 'users',
        method: 'get',
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          query: this.query
        }
      }).then(res => {
        var { data, meta } = res.data
        if (meta.status === 200) {
          this.dataList = data.users
          // 设置数据总条数,用于分页控件
          this.total = data.total
        } else {
          this.$message.error(meta.msg)
        }
        // 模式网络延时，然后再关闭 loading 效果
        setTimeout(() => {
          this.loading = false
        }, 300)
      })
    },
    // 页码改变事件
    pageNumChange (val) {
      // 页码改变时，重新赋值数据
      this.pagenum = val
      // 重新获取数据(因为这是服务器端分页)
      this.getDataList()
    },
    // 页容量改变事件
    pageSizeChange (val) {
      // 页容量改变时，更新数据，从而驱动页面渲染
      this.pagesize = val
      // 改变页容量时，要初始化当前页码，以免造成页码超出范围（如最大页码为5，当前页页码却为10）
      this.pagenum = 1
      this.getDataList()
    },
    // 搜索方法
    search () {
      this.pagenum = 1
      this.getDataList()
    },
    // 开关事件,修改用户状态
    switchChange (row) {
      // 修改用户状态接口put：users/:uId/state/:type
      //  :uId：是要修改的用户的id(也就是row.id)
      //  :type：是要修改的用户的状态（也就是row.mg_state)
      this.$http({
        url: `users/${row.id}/state/${row.mg_state}`,
        method: 'put'
      }).then(res => {
        var { meta } = res.data
        if (meta.status === 200) {
          this.$message({
            message: '修改状态成功',
            type: 'success'
          })
        } else {
          this.$message.error(meta.msg)
        }
      })
    },
    // 删除用户事件
    del (id) {
      // 接口delete：users/:id
      this.$confirm('确定要删除吗?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: 'users/' + id,
          method: 'delete'
        }).then(res => {
          var { meta } = res.data
          if (meta.status === 200) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            this.getDataList()
          } else {
            this.$message.error('删除失败')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 打开新增用户面板（对话框）
    add () {
      this.form.username = ''
      this.form.password = ''
      this.form.email = ''
      this.form.mobile = ''
      this.addVisible = true
    },
    // 提交新增用户请求
    addSubmit (formName) {
      // 先验证前台表单数据（使用 this.rule2 规则）
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 前台表单验证通过
          this.$http({
            url: 'users',
            method: 'post',
            data: {
              username: this.form.username,
              password: this.form.password,
              email: this.form.email,
              mobile: this.form.mobile
            }
          }).then(res => {
            var { meta } = res.data
            if (meta.status === 201) {
              // 新增用户成功
              this.$message({
                message: meta.msg,
                type: 'success'
              })
            } else {
              // 新增用户失败
              this.$message.error(meta.msg)
            }
            // 关闭面板
            this.addVisible = false
            // 清空面板内容（特别注意：此处for循环遍历对象，key前面要加var声明，否则报错）
            for (var key in this.form) {
              this.form[key] = ''
            }
            // 重新渲染列表（必须在请求的回调函数中执行，因为请求是异步的）
            this.getDataList()
          })
        } else {
          // this.$message.error('请正确填写表单数据！')
        }
      })
    },
    // 打开编辑用户面板（与新增面板相同）
    edit (row) {
      this.form.username = row.username
      this.form.email = row.email
      this.form.mobile = row.mobile
      this.form.id = row.id
      this.editVisible = true
    },
    // 提交编辑用户请求
    editSubmit (formName) {
      // 先进行前台表单规则验证
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 前台验证通过
          this.$http({
            url: 'users/' + this.form.id,
            method: 'put',
            data: {
              email: this.form.email,
              mobile: this.form.mobile
            }
          }).then(res => {
            var { data, meta } = res.data
            if (meta.status === 200) {
              // 编辑成功
              this.$message({
                message: meta.msg,
                type: 'success'
              })
            } else {
              // 编辑失败
              this.$message.error(meta.msg)
            }
            // 关闭面板
            this.editVisible = false
            // 编辑成功后，重新请求列表并不划算（消耗服务器），应该只进行前端渲染
            // this.getDataList() // 不划算
            for (var key in this.dataList) {
              // 因此，遍历前端已经拿到的数据，进行定点修改更新
              if (this.dataList[key].id === data.id) {
                this.dataList[key].email = data.email
                this.dataList[key].mobile = this.form.mobile
              }
            }
          })
        }
      })
    },
    // 打开角色分配面板
    openRole (row) {
      // 先查询用户信息，给当前用户数据赋值，渲染面板
      this.$http({
        url: `users/${row.id}`,
        method: 'get'
      }).then(res => {
        var { data, meta } = res.data
        if (meta.status === 200) {
          this.currentUser.id = data.id
          this.currentUser.rid = data.rid
          this.currentUser.username = data.username
        } else {
          this.$message.error('获取用户权限信息失败！')
        }
      })
      // 打开角色分配面板
      this.roleVisible = true
      // 获取角色列表数据
      this.getRolesList()
    },
    // 获取角色列表(面板中要使用)
    getRolesList () {
      this.$http({
        url: 'roles',
        method: 'get'
      }).then(res => {
        var { data, meta } = res.data
        if (meta.status === 200) {
          this.rolesList = data
        } else {
          this.$message.error('获取角色列表失败！')
        }
      })
    },
    // 提交用户角色分配请求
    setRole () {
      this.$http({
        url: `users/${this.currentUser.id}/role`,
        method: 'put',
        data: {
          rid: this.currentUser.rid
        }
      }).then(res => {
        var { meta } = res.data
        if (meta.status === 200) {
          this.$message({
            message: meta.msg,
            type: 'success'
          })
        } else {
          this.$message.error(meta.msg)
        }
        // 需在回调的最后，关闭面板
        this.roleVisible = false
      })
    }
  }
}