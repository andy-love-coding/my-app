<template>
  <div>
    <!-- 面包屑导航 -->
    <MybreadCrumb level2="商品管理" level3="新增商品" />
    <!-- 提示文本 -->
    <el-alert class="alertM" type="info" title="新增商品信息" center show-icon></el-alert>
    <!-- 步骤条 -->
    <el-steps :active="active" align-center class="stepsM" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- tab标签页 -->
    <el-tabs tab-position="left" @tab-click="tabClick">
      <!-- pane1 基本信息 -->
      <el-tab-pane label="基本信息">
        <el-form label-position="top" label-width="80px" :model="formObj">
          <el-form-item label="商品名称">
            <el-input v-model="formObj.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="formObj.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="formObj.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="formObj.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 商品分类【级联框】 -->
            <el-cascader expand-trigger="hover" :options="options" :props="propsObj" v-model="selectedValues">
            </el-cascader>
          </el-form-item>
        </el-form>
        <el-row><br/><br/></el-row>
      </el-tab-pane>
      <!-- pane2 商品参数 显示在“基本信息”中选择的“商品分类”所对应的“动态参数” -->
      <el-tab-pane label="商品参数">
        <div v-for="item in dynamicParams" :key="item.attr_id">
          <p v-if="item.attr_vals_arr_forRender.length !== 0">{{ item.attr_name }}</p>
          <!-- 使用了两个相同的数组 arr 和 arr_forRender 是为了区分，避免 group 模型选中项 和 checkbox 循环渲染相冲突 -->
          <!-- 如果用同一个数组 arr 的话，checkbox 取消选中一项时，就会影响 arr 的值，arr 又反过来影响 checkbox，导致选择的项消失了 -->
          <el-checkbox-group v-model="item.attr_vals_arr" v-if="item.attr_vals_arr_forRender.length !== 0">
            <el-checkbox v-for="(item1, index) in item.attr_vals_arr_forRender" :key="index" :label="item1" border></el-checkbox>
          </el-checkbox-group>
        </div>
      </el-tab-pane>
      <!-- pane3 商品属性 显示在“基本信息”中选择的“商品分类”所对应的“静态参数” -->
      <el-tab-pane label="商品属性">
        <el-form label-position="top" label-width="80px">
          <el-form-item :label="item.attr_name" v-for="item in staticParams" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <!-- pane4 商品图片 上传商品图片 -->
      <el-tab-pane label="商品图片">
        <el-upload class="upload-demo" :headers="headerObj" action="http://192.168.10.10:8888/api/private/v1/upload" :on-success="uploadSuccess" :on-preview="preview" :on-remove="remove" list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
      <!-- pane5 商品内容 编辑商品介绍，用富文本框 -->
      <el-tab-pane label="商品内容">
        <!-- 使用 vue-quill-editor 富文本编辑框 -->
        <quillEditor v-model="formObj.goods_introduce" />
        <!-- 新增商品按钮 -->
        <br/>
        <el-button type="primary" @click="addGood">新增商品</el-button>
      </el-tab-pane>
    </el-tabs>
    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible="dialogImgVisible" width="50%">
      <img ref="img">
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogImgVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogImgVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 引入vue-quill-editor富文本编辑框
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  data () {
    return {
      active: 1, // 步骤条处在第几步
      formObj: { // 新增商品所需的表单数据
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: '',
        attrs: [],
        pics: [],
        goods_introduce: ''
      },
      // 级联框数据
      options: [], // 用于级联框的 tree 型数据源
      propsObj: { // 用于级联框，设置数据源属性与组件属性的【对应关系】
        label: 'cat_name', // 级联框上显示的文字
        value: 'cat_id', // 选中后，级联框对应的值
        children: 'children' // 级联框的子项
      },
      selectedValues: [], // 用于级联框，双向绑定级联框选中的值，可能的值的形式如：[]、[1]、[1,2]、[1,2,3]
      // 商品分类的 动态参数
      dynamicParams: [],
      // 商品分类的 静态参数
      staticParams: [],
      // 图片上传 所需的数据
      headerObj: { // 图片上传 form 表单的 aciton 请求图片上传 api 时，需要授权 header
        Authorization: window.localStorage.getItem('token')
      },
      dialogImgVisible: false
    }
  },
  methods: {
    // 获取商品分类数据 用作 级联框 的数据源
    getOptions () {
      this.$http({
        url: 'categories',
        method: 'get',
        params: {
          tpye: 3
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
    // tab 点击事件
    tabClick (e) {
      // 设置 tab 与步骤条一致
      this.active = Number(e.index) + 1
      // 如果点击的是“商品参数”，请求 动态参数
      if (e.index === '1') {
        if (this.selectedValues.length > 0) {
          this.$http({
            url: `categories/${this.selectedValues[this.selectedValues.length - 1]}/attributes`,
            method: 'get',
            params: {
              sel: 'many'
            }
          }).then(res => {
            let { data, meta } = res.data
            if (meta.status === 200) {
              // 遍历动态参数，将动态参数的值由字符串 attr_vals("big,nice") 生成一个数组 attr_vals_arr(["big","nice"])
              for (var i = 0; i < data.length; i++) {
                if (data[i].attr_vals.length !== 0) {
                  data[i].attr_vals_arr = data[i].attr_vals.split(',')
                  data[i].attr_vals_arr_forRender = data[i].attr_vals_arr
                }
              }
              this.dynamicParams = data
            } else {
              this.$message.error(meta.msg)
            }
          })
        } else {
          this.$message.error('请先选择分类')
        }
      }
      // 如果点击的是“商品属性”，请求 静态参数(商品属性)
      if (e.index === '2') {
        if (this.selectedValues.length > 0) {
          this.$http({
            url: `categories/${this.selectedValues[this.selectedValues.length - 1]}/attributes`,
            method: 'get',
            params: {
              sel: 'only'
            }
          }).then(res => {
            let { data, meta } = res.data
            if (meta.status === 200) {
              this.staticParams = data
              // console.log(this.staticParams)
            } else {
              this.$message.error(meta.msg)
            }
          })
        } else {
          this.$message.error('前选择分类')
        }
      }
    },
    // 上传图片成功
    uploadSuccess (res, file, fileList) {
      let { data, meta } = res
      if (meta.status === 200) {
        // 上传成功，存储文件名如：tmp_uplaods/xxxxx.jpg 到foromObj对象中，用作将来生成商品的图片
        this.formObj.pics.push({
          pic: data.tmp_path
        })
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 图片预览：点击已上传图片列表时触发，file是添加的图片对象
    preview (file) {
      this.dialogImgVisible = true
      // 动态设置图片预览对话框中的img的src属性
      // 特别注意：第一次点击时，加载对话框了、子元素img加载、打印、set属性同时进行，所以出现bug:"Cannot set property 'src' of undefined"，第二次点击时，img已经加载好了，就没问题
      /* 具体原因：是element-ui的问题，dialog在未打开和打开状态是使用v-if来判断,当未打开的时候,值为false,都知道v-if如果是false的话,他就不会渲染出来,
          你这时候使用jquery去查找dom时肯定找不到,但是为什么在打开状态下也找不到呢?这个问题在于初始化那个函数的时候,element-ui有个渐现的效果,
          里面的dom并不是一下子就有的,而是会有延迟,这个时候你获取dom肯定获取不到,我目前的解决办法是加一个setTimeout,改变执行顺序,这时候就能获取到了,
          【最新发现】vue 提供了绝交方法：$nextTick
      */
      // console.log(this.$refs.img) // undefined
      // this.$refs.img.src = file.response.data.url // 报错：Cannot set property 'src' of undefined
      // setTimeout(() => {
      //   // console.log(this.$refs.img); // 不报错： <img src="http://......234.png" />
      //   this.$refs.img.src = 'http://home.test:8888/' + file.response.data.tmp_path
      // }, 0)
      this.$nextTick(_ => {
        this.$refs.img.src = 'http://home.test:8888/' + file.response.data.tmp_path
      })
    },
    // 移除图片时触发，file是移除的图片对象
    remove (file) {
      var index = this.formObj.pics.findIndex(item => {
        return item.pic === file.response.data.tmp_path
      })
      this.formObj.pics.splice(index, 1) // 移除一个元素
    },
    // 新增商品：将所有数据提交到服务器
    addGood () {
      // 需要提交的数据：good_name、goods_cat、goods_price、goods_number、goods_weight、goods_introduce、pics、attrs
      this.formObj.goods_cat = this.selectedValues.join(',')
      // 拼接attrs
      var newDynamicParams = []
      for (var i = 0; i < this.dynamicParams.length; i++) {
        newDynamicParams.push({
          attr_id: this.dynamicParams[i].attr_id,
          attr_value: this.dynamicParams[i].attr_vals_arr.length > 0 ? this.dynamicParams[i].attr_vals_arr.join(',') : ''
        })
      }
      var newStaticParams = []
      for (var j = 0; j < this.staticParams.length; j++) {
        newStaticParams.push({
          attr_id: this.staticParams[j].attr_id,
          attr_value: this.staticParams[j].attr_vals
        })
      }
      this.formObj.attrs = newStaticParams.concat(newDynamicParams)
      // 数据都准备好了，开始提交
      this.$http({
        url: 'goods',
        method: 'post',
        data: this.formObj
      }).then(res => {
        if (res.data.meta.status === 201) {
          this.$message({
            message: res.data.meta.msg,
            type: 'success'
          })
          this.$router.push({name: 'goods'})
        } else {
          this.$message.error(res.data.meta.msg)
        }
      })
    }
  },
  created () {
    this.getOptions()
  },
  // 注册vue-quill-editor富文本编辑框
  components: {
    quillEditor
  }
}
</script>

<style>
.alertM {
	margin-top: 10px;
}
.stepsM {
	margin: 20px 0;
}
.el-step__title {
	font-size: 12px;
}
.ql-editor {
	height: 350px;
}
</style>
