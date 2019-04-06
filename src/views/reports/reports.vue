<template>
  <div>
    <!-- 面包屑导航 -->
    <MybreadCrumb level2="数据统计" level3="数据报表" />
    <!-- 数据图表: ECharts要操作的dom元素 -->
    <div id="main" style="width: 600px; height: 400px"></div>
  </div>
</template>

<script>
// 引入 ECharts
import echarts from 'echarts'
export default {
  data () {
    return {
      option: {
        title: {
          text: '堆叠区域图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        }
      },
      newOption: {}
    }
  },
  mounted () {
    // 准备好dom，初始化 ECharts 实例
    var myChart = echarts.init(document.getElementById('main'))
    // 显示loading效果
    myChart.showLoading()
    // 请求数据
    this.$http({
      url: 'reports/type/1',
      method: 'get'
    }).then(res => {
      var { data, meta } = res.data
      if (meta.status === 200) {
        this.newOption = { ...this.option, ...data }
        this.newOption.xAxis[0].boundaryGap = false
        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(this.newOption)
        myChart.hideLoading()
        console.log(this.newOption)
      } else {
        this.$message.error(meta.msg)
      }
    })
  }
}
</script>

<style>
</style>
