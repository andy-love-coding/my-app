<template>
  <div>
    <!-- 面包屑导航 -->
    <MybreadCrumb level2="商品管理" level3="分类参数" />
    <!-- 警告提示框 -->
    <el-alert class="alertM" title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon></el-alert>
    <!-- 商品分类级联框 -->
    <el-cascader class="cascaderM" expand-trigger="hover" :options="options" :props="propsObj" v-model="seletedValues" @change="change" clearable ></el-cascader>
    <!-- tab -->
    <el-tabs class="tabsM" v-model="active">
      <!-- 动态参数 -->
      <el-tab-pane label="动态参数" name="many" ref="btn">
        <el-button type="primary" :disabled="disabled">添加动态参数</el-button>
        <el-table class="dynamicTableM" :data="dynamicData" stripe border style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag v-for="(item, index) in scope.row.temp_vals" :key="index" closable @close="tagClose(scope.row,item)">
                {{ item }}
              </el-tag>
              <el-input v-if="inputVisible" class="input-new-tag" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index">
          </el-table-column>
          <el-table-column prop="attr_name" label="商品参数">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 静态属性（静态参数）-->
      <el-tab-pane label="静态属性" name="only">
        <el-button type="primary" :disabled="disabled">添加静态属性</el-button>
        <el-table class="staticTableM" :data="staticData" stripe border style="width: 100%">
          <el-table-column type="index">
          </el-table-column>
          <el-table-column prop="attr_name" label="属性名称">
          </el-table-column>
          <el-table-column prop="attr_vals" label="属性值">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      options: [],
      seletedValues: [],
      propsObj: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      active: 'many', // 定义 tab 活跃的项
      disabled: true,
      // 静态参数所用的数据
      dynamicData: [],
      inputVisible: false,
      inputValue: '',
      // 静态属性所用的数据
      staticData: []
    }
  },
  methods: {
    // 获取商品分类数据 用于级联框
    getOptions () {
      this.$http({
        url: 'categories',
        method: 'get'
      }).then(res => {
        let { data, meta } = res.data
        if (meta.status === 200) {
          this.options = data
        } else {
          this.$message.error(meta.msg)
        }
      })
    },
    // 商品分类级联框改变事件
    change () {
      if (this.seletedValues.length === 3) {
        // 当选中了第三级商品分类时，就激活“添加动态参数”和“添加静态属性”的按钮
        this.disabled = false
        // 请求 动态参数
        this.getAttributes('many', data => {
          this.dynamicData = data
          this.dynamicData.forEach(item => {
            // 在vue中，如果要动态设置数据的属性（如后来添加的新属性），必须用$set()方法来设置，属性值更新时页面才会渲染； 否则不会渲染
            // item.temp_vals = item.attr_vals.split(',') // 这种方式设置的动态属性，数据更新时页面不会渲染
            this.$set(item, 'temp_vals', item.attr_vals ? item.attr_vals.split(',') : [])
          })
        })
        // 请求 静态属性（静态参数）
        this.getAttributes('only', data => {
          this.staticData = data
        })
      } else {
        // 若还没有选中第三级商品分类时，使“添加动态参数”和“添加静态属性”的按钮保持禁用
        this.disabled = true
      }
    },
    // 封装请求分类参数的方法
    getAttributes (selValue, callback) {
      this.$http({
        url: `categories/${this.seletedValues[this.seletedValues.length - 1]}/attributes`,
        method: 'get',
        params: {
          sel: selValue
        }
      }).then(res => {
        let { data, meta } = res.data
        if (meta.status === 200) {
          callback(data) // 成功的回调函数
        } else {
          this.$message.error(meta.msg)
        }
      })
    },
    // 关闭tag标签：请求服务器删除某个动态参数的某一项
    tagClose (row, item) {
      // 1.0 前端删除
      row.temp_vals.splice(row.temp_vals.indexOf(item), 1)
      // 2.0再更新服务器数据
      this.$http({
        url: `categories/${this.seletedValues[2]}/attributes/${row.attr_id}`,
        method: 'put',
        data: {
          attr_name: row.attr_name,
          attr_sel: 'many',
          attr_vals: row.temp_vals.join(',')
        }
      }).then(res => {
        let { meta } = res.data
        if (meta.status === 200) {
          // console.log(res)
          // row.temp_vals.push('我是测试添加的，不会到服务器，哈哈哈') // 看看动态属性(temp_vals)能不能渲染，答案是“可以的”
          this.$message({
            message: meta.msg,
            type: 'success'
          })
        } else {
          this.$message.error(meta.msg)
          this.change() // 3.0若服务器添加数据失败，则重新请求服务器数据，重新渲染
        }
      })
    },
    // tag失焦 新增某个动态参数的一项：handleInputConfirm()这个函数会执行2次，第1次keyup触发，第2次是onblur触发
    handleInputConfirm (row) {
      this.inputVisible = false
      // 保证添加1次（第1次inputValue有值，则添加动态参数到服务器，并置空inputValue；当第2次执行时，inputValue为空则什么也干不了）
      if (this.inputValue) {
        // 1.0先更新客户端数据
        row.temp_vals.push(this.inputValue)
        // 2.0再更新服务器数据
        this.$http({
          url: `categories/${this.seletedValues[2]}/attributes/${row.attr_id}`,
          method: 'put',
          data: {
            attr_name: row.attr_name,
            attr_sel: 'many',
            attr_vals: row.temp_vals.join(',')
          }
        }).then(res => {
          let { meta } = res.data
          if (meta.status === 200) {
            this.$message({
            message: meta.msg,
            type: 'success'
          })
          } else {
            this.$message.error(meta.msg)
            this.change() // 3.0若服务器添加数据失败，则重新请求服务器数据，重新渲染
          }
        })
      }
      this.inputValue = ''
      // console.log('如果按enter键，我会执行2次，第1次由enter键keyup触发，第2次由onblur触发')
    },
    showInput () {
      this.inputVisible = true
      // $nextTick将自己的回调函数 延迟到下次 DOM 更新循环之后执行，这样就能保证回调函数执行时，DOM都更新好了
      // console.log(this.$refs.saveTagInput); // undefined
      // 因为el-input默认隐藏（v-if），dom还没更新，还没渲染出来，所以为undefined
      this.$nextTick(_ => {
        // console.log(this.$refs.saveTagInput); // VueComponent{_uid: 82, _isVue: true, $options: {…}, _renderProxy: Proxy, _self: VueComponent,…}
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  },
  created () {
    this.getOptions()
  }
}
</script>

<style>
.alertM,
.cascaderM,
.tabsM,
.dynamicTableM,
.staticTableM {
  margin-top: 10px;
}
.el-cascader {
  width: 300px;
}
.el-tag {
	margin-right: 10px;
}
.button-new-tag {
	margin-left: 10px;
	height: 32px;
	line-height: 30px;
	padding-top: 0;
	padding-bottom: 0;
}
.input-new-tag {
	width: 90px;
	margin-left: 10px;
	vertical-align: bottom;
}
</style>
