<template>
  <div>
    <!-- 面包屑导航 -->
    <MybreadCrumb level2="订单管理" level3="订单列表" />
    <!-- 订单列表 -->
    <el-table :data="ordersList" style="width: 100%" height="530">
    <el-table-column type="index" width="50">
    </el-table-column>
    <el-table-column prop="order_number" label="订单编号" width="200">
    </el-table-column>
    <el-table-column prop="order_price" label="订单价格" width="120">
    </el-table-column>
    <el-table-column label="是否付款" width="120">
      <template slot-scope="scope">
        <el-tag type="danger" v-if="scope.row.order_pay === '0'">未付款</el-tag>
        <el-tag type="danger" v-else>已付款</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="is_send" label="是否发货" width="100">
    </el-table-column>
    <el-table-column prop="create_time" label="下单时间" width="180">
      <template slot-scope="scope">
        {{ scope.row.create_time | myTime }}
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
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
      ordersList: [],
      query: '',
      pagenum: 1,
      pagesize: 10,
      pagesizes: [10, 20, 30, 40],
      total: 0
    }
  },
  methods: {
    getOrdersList () {
      this.$http({
        url: 'orders',
        method: 'get',
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      }).then(res => {
        let { data, meta } = res.data
        if (meta.status === 200) {
          this.ordersList = data.goods
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
      this.getOrdersList()
    },
    // 页码改变事件
    currentChange (val) {
      this.pagenum = val
      this.getOrdersList()
    }
	},
	created () {
		this.getOrdersList()
	}
}
</script>

<style>
</style>
