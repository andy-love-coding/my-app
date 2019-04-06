<template>
  <div>
    <!-- 面包屑 -->
    <MybreadCrumb level2="用户管理" level3="用户列表" />

    <!-- 权限列表 -->
    <el-table :data="rightsList" border v-loading="loading" height="500" style="width: 100%">
      <el-table-column type="index"  width="50">
      </el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180">
      </el-table-column>
      <el-table-column prop="path" label="路径" width="180">
      </el-table-column>
      <el-table-column prop="level" label="层级">
        <!-- 在表格列中显示自己的内容，用template -->
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-else-if="scope.row.level === '1'">二级</span>
          <span v-else-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: [],
      loading: true
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    getRightsList () {
      // 得到所有权限数据
      this.$http({
        url: 'rights/list',
        method: 'get'
      }).then(res => {
        var {data, meta} = res.data
        if (meta.status === 200) {
          this.rightsList = data
          this.loading = false
        } else {
          this.$message.error('获取权限列表失败！')
        }
      })
    }
  }
}
</script>

<style>

</style>
