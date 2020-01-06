<template>
  <div class="dashboard-editor-container">
    <section>
      <el-row :gutter="40" class="panel-group">
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-article">
              <svg-icon icon-class="read" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                文章篇数
              </div>
              <count-to :start-val="0" :end-val="articleTotal" :duration="2600" class="card-panel-num" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-message">
              <svg-icon icon-class="message" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                文章访问总次数
              </div>
              <count-to :start-val="0" :end-val="articleVisit" :duration="3000" class="card-panel-num" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-money">
              <svg-icon icon-class="money" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                文章篇数
              </div>
              <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-shopping">
              <svg-icon icon-class="shopping" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                其他
              </div>
              <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num" />
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :lg="8" class="card-panel-col">
          <el-card>
            <Echarts theme="macarons" class="charts" :options="circleData" autoresize />
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="16" class="card-panel-col">
          <el-card>
            <Echarts theme="macarons" class="charts" :options="lineData" autoresize />
          </el-card>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import Echarts from 'vue-echarts/components/ECharts.vue'
import 'echarts/theme/macarons'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import { dashboard } from '@/api'
export default {
  name: 'DashboardAdmin',
  components: {
    CountTo,
    Echarts
  },
  data () {
    return {
      lineDataSet: [],
      circleDataSet: [],
      articleVisit: 0,
      articleTotal: 0
    }
  },
  computed: {
    circleData () {
      return {
        legend: {},
        tooltip: {},
        dataset: { source: this.circleDataSet },
        series: [{
          type: 'pie',
          radius: 90
        }]
      }
    },
    lineData () {
      return {
        title: {
          text: '创作频率'
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
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'time',
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        dataset: {
          source: this.lineDataSet
        },
        series: [
          {
            name: '创建频率',
            type: 'line',
            encode: { x: 'time', y: 'count' }
          }
        ]
      }
    }
  },
  created () {
    this.setLineChartData()
    this.setCircleChartData()
    this.setArticleVisit()
    this.setArticleTotal()
  },
  methods: {
    async setArticleTotal () {
      const res = await dashboard.articleTotal()
      if(res.code===200){
        this.articleTotal = res.data
      }
    },
    async setArticleVisit () {
      const res = await dashboard.artcleVisit()
      if(res.code===200){
        this.articleVisit = res.data[0].total
      }
    },
    async setLineChartData () {
      const res = await dashboard.articleFrequency()
      if(res.code===200){
        this.lineDataSet = res.data
      }
    },
    async setCircleChartData () {
      const res = await dashboard.articleType()
      if(res.code===200){
        this.circleDataSet = res.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
.charts {
  height: 400px;
  width: 100%;
}
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-article {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-article {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
