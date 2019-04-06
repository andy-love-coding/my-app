<template>
  <div>
    <!-- 面包屑导航 -->
    <MybreadCrumb level2="权限管理" level3="角色列表" />

    <!-- 新增角色区域 -->
    <el-row class="addRole">
      <el-button type="primary" plain>新增角色</el-button>
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="loading" border :data="rolesList" style="widht: 100%">
      <!-- 在表格最前面加一个列可以展开的内容，即 tpye="expand" -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 1.0 遍历角色的一级权限，children 是角色包含的树形结构的权限数据  -->
          <el-row v-for="item1 in scope.row.children" :key="item1.id">
            <el-col :span="4">
              <el-tag @close="tagClose(scope.row.children,item1,scope.row.id)" closable>{{ item1.authName }}</el-tag>
            </el-col>
            <el-col :span="20">
              <!-- 2.0 遍历角色的二级权限 -->
              <el-row v-for="item2 in item1.children" :key="item2.id">
                <el-col :span="4">
                  <el-tag @close="tagClose(item1.children,item2,scope.row.id)" type="success" closable>{{ item2.authName }}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-row>
                    <el-col>
                      <!-- 3.0 在tag中角色的三级权限（tag未来生成span标签） -->
                      <el-tag class="tagM" @close="tagClose(item2.children,item3,scope.row.id)" v-for="item3 in item2.children" :key="item3.id" type="warning" closable>
                        {{ item3.authName }}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length<=0">
            <template>还没有分配权限</template>
          </el-row>
        </template>
      </el-table-column>
      <!-- 以上 expand 是表格的展开内容；以下是表格为未展开时的内容 -->
      <el-table-column type="index" widht="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="250">
      </el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="250">
      </el-table-column>
      <el-table-column label="操作">
        <!-- 给模板绑定数据源scope -->
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
          <el-button type="warning" icon="el-icon-check" @click="openSetRights(scope.row)" size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 给角色分配权限面板 -->
    <el-dialog title="设置权限" :visible.sync="setRightsVisible">
      <!--
        el-tree: 树形组件根元素
          属性：
            data: 用来设置当前组件的数据源
            node-key: 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的(通常是节点的id)
            props: 用来设置当前 tree 组件的节点，是一个对象
              lable：指定节点的标签（即节点显示的文字），其为节点对象的某个属性值
              children：指定子树，其为节点对象的某个属性值
            default-checked-keys: 默认勾选的节点的 key(通常是节点的id) 的数组
          方法：
            getCheckedKeys: 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
            halfCheckedKeys: 若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点的 key 所组成的数组
          事件：
            node-click: 节点被点击时的回调
       -->
      <el-tree ref="tree" show-checkbox default-expand-all :default-checked-keys='defaultCheckedKeys' node-key='id' :data="rightsTree" :props="defaultProps"></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRightsVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoleRights">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
		return {
			loading: false,
      rolesList: [],
      rightsTree: [],
      setRightsVisible: false,
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      defaultCheckedKeys: [],
      currentRoleId: ''
		}
	},
	created () {
		this.getRolesList()
	},
	methods: {
		// 获取角色列表
		getRolesList () {
			this.$http({
				url: 'roles',
				method: 'get'
			}).then(res => {
				let { data, meta } = res.data
				if (meta.status === 200) {
					this.rolesList = data
				} else {
					this.$message.error(meta.msg)
				}
			})
    },
    // 关闭标签，删除指定角色指定权限
		// 程序漏洞：在只删除上级权限时，其实没有在数据库层面关联删除其子集权限
		tagClose (items, item, rid) {
      // 本地删除权限，删除后自动渲染页面
			items.splice(items.indexOf(item), 1)
			// 本地删除后再更新服务器，请求删除角色权限接口delete：roles/:roleId/rights/:rightId
			this.$http({
				url: `roles/${rid}/rights/${item.id}`,
				method: 'delete'
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
			})
		},
    // 获取权限树tree，用于分配权限面板中使用
    getRightsTree () {
      this.$http({
        url: 'rights/tree',
        method: 'get'
      }).then(res => {
        let {data, meta} = res.data
        if (meta.status === 200) {
          this.rightsTree = data
        } else {
          this.$message.error(meta.msg)
        }
      })
    },
    // 打开分配权限面板,并初始化：默认勾选的权限
    openSetRights (roleRow) {
      this.defaultCheckedKeys = []
      this.getRightsTree()
      // 注意，只用添加三级权限即可，因为一级二级添加的话，会导致三级全选，而只选三级的话，一级二级会自动关联
      roleRow.children.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            this.defaultCheckedKeys.push(item3.id)
          })
        })
      })
      this.currentRoleId = roleRow.id
      // 打开分配权限的面板
      this.setRightsVisible = true
    },
    // 给角色分配权限
    setRoleRights (id) {
      // 获取选中的节点的 key(权限节点id) 数组
      var checkedKeys = this.$refs.tree.getCheckedKeys()
      // 获取半选中的节点的 key(权限节点id) 数组
      var halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      // 全选中和半选中节点的 key(权限节点id) 合并成 权限id数组
      var rightsArr = halfCheckedKeys.concat(checkedKeys).join(',')
      this.$http({
        url: 'roles/' + this.currentRoleId + '/rights',
        method: 'post',
        data: {
          rids: rightsArr
        }
      }).then(res => {
        var {meta} = res.data
        if (meta.status === 200) {
          // 需要重新获取角色列表（以便更新角色的默认权限）
          this.getRolesList()
          this.$message({
            message: meta.msg,
            type: 'success'
          })
        } else {
          this.$message.error(meta.msg)
        }
      })
      this.setRightsVisible = false
    }
	}
}
</script>

<style>
.addRole {
	margin: 10px 0;
}
.tagM {
	margin: 0px 5px 5px 5px;
}
</style>
