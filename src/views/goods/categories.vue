<template>
  <div>
    <!-- 面包屑导航 -->
    <MybreadCrumb level2="商品管理" level3="商品分类" />
    <!-- 添加分类 -->
    <el-card>
      <el-button type="success" @click="openAddCat" plain>添加分类</el-button>
    </el-card>

    <!-- 商品分类列表：需要安装element-tree-grid第三方插件 -->
    <!--
      :data：用来设置数据源（tree型结构的数据）
      el-table-tree-column：表示能够展开的表格的标签
        prop：（必选）用来控制当前行显示的属性（展示的文字）
        label： （必选）表头展示的文字
        treekey：（必选）设置当前行唯一标识，通常绑定此项的id（设置此key后，其子项目才能展开）
        parentKey：（必选）用来设置当前项的父id，绑定此项的父id（设置此key后，其子项目才能折叠起来）
        levelKey：（必选）设置当前项的级别，绑定此项在tree数据中的级别字段（设置此key后，父项展开子项才会有缩进）
    -->
    <!-- 给tabel绑定分页的数据，而不是总数据。因总数据太多了，得到总数据后，用客户端分页的方式来一页一页对总数据进行展示 -->
    <el-table :data="pageDataList" border>
      <!-- 注意第一列用的是：el-table-tree-column -->
      <el-table-tree-column file-icon="icon icon-file" folder-icon="icon icon-folder" treeKey="cat_id" parentKey="cat_pid" levelKey="cat_level" prop="cat_name" label="商品分类" width="220">
			</el-table-tree-column>
      <el-table-column label="级别" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有效" width="180">
        <template slot-scope="scope">
          {{ scope.row.cat_deleted === false ? '有效' : '无效'}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件：客户端分页(不必再请求服务器了) -->
    <el-pagination @current-change="pageNumChange" @size-change="pageSizeChange" :current-page="pageNum" :page-size="pageSize" :page-sizes="pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 新增分类面板 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <!--
          el-cascader：级联组件根元素
            属性：
              options：tree型数据源
              v-model：双向绑定级联框选中的值，可能的值的形式如：[]、[1]、[1,2]
              clearable：可以清空选中的数据
              change-on-select：bool值，为 true 时表示 可以选中任意一级选项（如: 可选一级分类，也可以选二级分类）
              props：绑定一个对象，设置数据源属性与组件属性的对应关系，如{label: 'name', value: 'id'}
            事件：
              change：选项改变的事件
        -->
        <el-form-item label="选择父类" :label-width="formLabelWidth">
          {{ selectedValues }}
          <el-cascader placeholder="若不选择，则默认是一级分类" :change-on-select="true" clearable :props="propsObj" :options="options" v-model="selectedValues">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCat">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入和注册：element-tree-grid
import ElTreeGrid from 'element-tree-grid'
import Vue from 'vue'
Vue.component(ElTreeGrid.name, ElTreeGrid)
export default {
  data () {
		return {
			dataList: [], // 总的数据
			pageDataList: [], // 客户端分页的数据（分页的数据）
			pageNum: 1,
			pageSize: 6,
			pageSizes: [6, 12, 18, 24],
      total: 0,
      // 以下是新增分类面板所需的数据
      dialogFormVisible: false,
			formLabelWidth: '80px',
			form: { // 新增分类表单的值，name 双向绑定给分类名称
				name: ''
			},
			options: [], // 用于级联框的 tree 型数据源
			propsObj: { // 用于级联框，设置数据源属性与组件属性的【对应关系】
				label: 'cat_name', // 级联框上显示的文字
				value: 'cat_id', // 选中后，级联框对应的值
				children: 'children' // 级联框的子项
			},
			selectedValues: [] // 双向绑定级联框选中的值，可能的值的形式如：[]、[1]、[1,2]
		}
  },
	methods: {
		// 获取总数据
		getDataList () {
			this.$http({
				url: 'categories',
				method: 'get'
			}).then(res => {
				let { data, meta } = res.data
				if (meta.status === 200) {
					this.dataList = data
					this.total = data.length
					// 获取总数据后，计算一下分页数据
					this.getPageDataList()
				} else {
					this.$message.error(meta.msg)
				}
			})
		},
		// 获取分页数据
		getPageDataList () {
			var startIndex = (this.pageNum - 1) * this.pageSize
			var endIndex = this.pageNum * this.pageSize - 1
      // 截取总数据的一部分，作为分页数据
      // slice()函数截取数组从 startIndex 到 endIndex 之前的元素，包括 startIndex，但不包括 endIndex
			this.pageDataList = this.dataList.slice(startIndex, endIndex + 1)
		},
		// 页码改变事件
		pageNumChange (val) {
			this.pageNum = val
			this.getPageDataList()
		},
		// 页容量改变事件
		pageSizeChange (val) {
			this.pageSize = val
			this.pageNum = 1 // 页容量改变时，要重新初始化页码，以防止页码超出范围
			this.getPageDataList()
    },
    // 打开“新增分类”面板
		openAddCat () {
			this.dialogFormVisible = true
			this.getOptions()
		},
    // 获取级联框商品分类数据（获取2级分类即可）
		getOptions () {
			this.$http({
				url: 'categories',
				method: 'get',
				params: {
					type: '2'
				}
			}).then(res => {
				let { data, meta } = res.data
				if (meta.status === 200) {
					this.options = data
				} else {
					this.$message.error(meta.msg)
				}
			})
		},
		// 新增分类
		addCat () {
      // 父id，取数组最后一个；若数组为空（即没有选择父级分类），则默认为一级分类，则取0
      // selectedOptions 可能的值为：
      //   []：空数组，没有选择父级分类，表示新增一级分类
      //   [1]：选中了一级分类，表示新增二级分类
      //   [1,2]：选择了一级分类和二级分类，其父级取二级分类，表示新增三级分类
			var pid = this.selectedValues.length > 0 ? this.selectedValues[this.selectedValues.length - 1] : 0
			var level = this.selectedValues.length
			this.$http({
				url: 'categories',
				method: 'post',
				data: {
					cat_pid: pid,
					cat_name: this.form.name,
					cat_level: level
				}
			}).then(res => {
				let { meta } = res.data
				if (meta.status === 201) {
					this.$message({
						message: meta.msg,
						type: 'success'
					})
				} else {
					this.$message.error(meta.msg)
				}
				this.dialogFormVisible = false
        this.form.name = ''
        this.getDataList()
      })
    }
	},
	created () {
		this.getDataList()
	}
}
</script>

<style>

</style>
