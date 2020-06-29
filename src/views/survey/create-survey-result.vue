<template>
  <div>
    <div class="filter-container">
      <el-select v-model="listQuery.surveyId" placeholder="问卷名称" clearable style="width: 300px" class="filter-item">
        <el-option v-for="item in surveyName" :key="item.id" :label="item.surveyName" :value="item.id" />
      </el-select>
      <el-button v-waves style="margin-left: 15px;" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>
    <div v-if="isShow" class="chart-container">
      <chart :chart-data="chartData" height="100%" width="100%" />
    </div>
  </div>
</template>

<script>
import Chart from '@/components/Charts/mixChart'
import { querySurveyResult, queryAllSurvey } from '@/api/login'

export default {
  name: 'CreateSurveyResult',
  components: { Chart },
  data() {
    return {
      listQuery: {
        surveyId: undefined,
        surveyName: ''
      },
      surveyName: [],
      chartData: undefined,
      chart: null,
      isShow: false
    }
  },
  created() {
    queryAllSurvey()
      .then(response => {
        this.surveyName = response.data
      })
      .catch(e => {
        console.log(e)
      })
  },
  methods: {
    handleFilter() {
      const that = this
      querySurveyResult(this.listQuery.surveyId)
        .then(response => {
          console.log(response)
          that.chartData = response.data
          that.isShow = true
        }).catch(e => {
          console.log(e)
        })
    }
    // initChart() {
    //   this.chart = echarts.init(document.getElementById('chart'))
    //   const xData = (function() {
    //     const data = []
    //     for (let i = 1; i < 13; i++) {
    //       data.push(i + 'month')
    //     }
    //     return data
    //   }())
    //   this.chart.setOption({
    //     backgroundColor: '#344b58',
    //     title: {
    //       text: 'statistics',
    //       x: '20',
    //       top: '20',
    //       textStyle: {
    //         color: '#fff',
    //         fontSize: '22'
    //       },
    //       subtextStyle: {
    //         color: '#90979c',
    //         fontSize: '16'
    //       }
    //     },
    //     tooltip: {
    //       trigger: 'axis',
    //       axisPointer: {
    //         textStyle: {
    //           color: '#fff'
    //         }
    //       }
    //     },
    //     grid: {
    //       left: '5%',
    //       right: '5%',
    //       borderWidth: 0,
    //       top: 150,
    //       bottom: 95,
    //       textStyle: {
    //         color: '#fff'
    //       }
    //     },
    //     legend: {
    //       x: '5%',
    //       top: '10%',
    //       textStyle: {
    //         color: '#90979c'
    //       },
    //       data: ['female', 'male', 'average']
    //     },
    //     calculable: true,
    //     xAxis: [{
    //       type: 'category',
    //       axisLine: {
    //         lineStyle: {
    //           color: '#90979c'
    //         }
    //       },
    //       splitLine: {
    //         show: false
    //       },
    //       axisTick: {
    //         show: false
    //       },
    //       splitArea: {
    //         show: false
    //       },
    //       axisLabel: {
    //         interval: 0
    //
    //       },
    //       data: xData
    //     }],
    //     yAxis: [{
    //       type: 'value',
    //       splitLine: {
    //         show: false
    //       },
    //       axisLine: {
    //         lineStyle: {
    //           color: '#90979c'
    //         }
    //       },
    //       axisTick: {
    //         show: false
    //       },
    //       axisLabel: {
    //         interval: 0
    //       },
    //       splitArea: {
    //         show: false
    //       }
    //     }],
    //     dataZoom: [{
    //       show: true,
    //       height: 30,
    //       xAxisIndex: [
    //         0
    //       ],
    //       bottom: 30,
    //       start: 0,
    //       end: 90,
    //       handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
    //       handleSize: '110%',
    //       handleStyle: {
    //         color: '#d3dee5'
    //
    //       },
    //       textStyle: {
    //         color: '#fff' },
    //       borderColor: '#90979c'
    //
    //     }, {
    //       type: 'inside',
    //       show: true,
    //       height: 15,
    //       start: 1,
    //       end: 35
    //     }],
    //     series: [{
    //       name: 'female',
    //       type: 'bar',
    //       stack: 'total',
    //       barMaxWidth: 35,
    //       barGap: '10%',
    //       itemStyle: {
    //         normal: {
    //           color: 'rgba(255,144,128,1)',
    //           label: {
    //             show: true,
    //             textStyle: {
    //               color: '#fff'
    //             },
    //             position: 'insideTop',
    //             formatter(p) {
    //               return p.value > 0 ? p.value : ''
    //             }
    //           }
    //         }
    //       },
    //       data: [
    //         709,
    //         1917,
    //         2455,
    //         2610,
    //         1719,
    //         1433,
    //         1544,
    //         3285,
    //         5208,
    //         3372,
    //         2484,
    //         4078
    //       ]
    //     },
    //
    //       {
    //         name: 'male',
    //         type: 'bar',
    //         stack: 'total',
    //         itemStyle: {
    //           normal: {
    //             color: 'rgba(0,191,183,1)',
    //             barBorderRadius: 0,
    //             label: {
    //               show: true,
    //               position: 'top',
    //               formatter(p) {
    //                 return p.value > 0 ? p.value : ''
    //               }
    //             }
    //           }
    //         },
    //         data: [
    //           327,
    //           1776,
    //           507,
    //           1200,
    //           800,
    //           482,
    //           204,
    //           1390,
    //           1001,
    //           951,
    //           381,
    //           220
    //         ]
    //       }, {
    //         name: 'average',
    //         type: 'line',
    //         stack: 'total',
    //         symbolSize: 10,
    //         symbol: 'circle',
    //         itemStyle: {
    //           normal: {
    //             color: 'rgba(252,230,48,1)',
    //             barBorderRadius: 0,
    //             label: {
    //               show: true,
    //               position: 'top',
    //               formatter(p) {
    //                 return p.value > 0 ? p.value : ''
    //               }
    //             }
    //           }
    //         },
    //         data: [
    //           1036,
    //           3693,
    //           2962,
    //           3810,
    //           2519,
    //           1915,
    //           1748,
    //           4675,
    //           6209,
    //           4323,
    //           2865,
    //           4298
    //         ]
    //       }
    //     ]
    //   })
    // }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .filter-container{
    position: relative;
    margin: 20px 0 10px 20px;
    display: flex;
    flex-direction: row;
    width: 500px;
  }
  .chart-container{
    position: relative;
    width: 100%;
    height: calc(100vh - 84px);
  }
</style>
