<template>
  <div>
    <!-- 面包屑导航 -->
    <MybreadCrumb level2="商品管理" level3="商品列表" />
    <!-- 搜索与新增 -->
    <el-row id="search">
      <el-col :span="6">
        <el-input placeholder="请输入内容" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="6">
        &nbsp;&nbsp;
        <el-button type="success" @click="$router.push({name: 'goodsAdd'})" plain>新增商品</el-button>
      </el-col>
    </el-row>
    <!-- 用户列表 -->
    <el-table v-loading="loading" :data="tableData" border style="widht: 100%">
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="500">
      </el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="100">
        <template slot-scope="scope">
          {{ scope.row.goods_price | myRMB }}
        </template>
      </el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="100">
      </el-table-column>
      <el-table-column label="创建时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.add_time | myTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" plain></el-button>
          <el-button type="warning" icon="el-icon-delete" size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="pagenum"
      :page-sizes="pagesizes"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
	data () {
		return {
			loading: false,
			tableData: [],
			query: '',
			pagenum: 1,
      pagesize: 6,
      pagesizes: [6, 10, 20, 30, 40],
      total: 0
		}
	},
	methods: {
    // 获取商品列表数据
		getTableData () {
			this.$http({
				url: 'goods',
				method: 'get',
				params: {
					query: this.query,
					pagenum: this.pagenum,
					pagesize: this.pagesize
				}
			}).then(res => {
				let { data, meta } = res.data
				if (meta.status === 200) {
          this.tableData = data.goods
          this.total = data.total
				} else {
					this.$message.error(meta.msg)
				}
			})
    },
    // 页容量改变事件
    sizeChange (val) {
      this.pagesize = val
      // 重新初始化页码（页码可能变少），防止页码超出范围
      this.pagenum = 1
      this.getTableData()
    },
    // 页码改变事件
    currentChange (val) {
      this.pagenum = val
      this.getTableData()
    }
	},
	created () {
		this.getTableData()
	}
}
</script>

<style>
</style>
