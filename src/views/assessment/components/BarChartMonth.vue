<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts"; // echarts theme
import { debounce } from "@/utils";
import { getDeptScore } from "@/api/appr/analyse";
require("echarts/theme/macarons");

const animationDuration = 6000;

export default {
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "300px"
    }
  },
  data() {
    return {
      chart: null,
      xchart: [],
      ychart: []
    };
  },
  mounted() {
    this.getChartData();
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    window.addEventListener("resize", this.__resizeHandler);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener("resize", this.__resizeHandler);
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    getChartData() {
      getDeptScore().then(res => {
        const dataList = res.data.data;
        dataList.forEach(element => {
          this.xchart.push(element.deptName);
          this.ychart.push(element.score);
          this.initChart();
        });
      });
    },
    initChart() {

      let that = this;
      this.chart = echarts.init(this.$el, "macarons");
      
      this.chart.setOption({
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        title: {
          text: "累计积分排行",
          top: "top",
          left: "center"
        },
        grid: {
          top: 40,
          left: "2%",
          right: "2%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: this.xchart,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "评分",
            type: "bar",
            stack: "vistors",
            barWidth: "60%",
            data: this.ychart,
            animationDuration,
            itemStyle: {
              normal: {
                //不同时段柱子设置不同颜色
                color: function(params) {
                  if (
                    Number(params.dataIndex) <= 4 
                  ) {
                    return "red"
                  } else {
                    return "#3398DB"
                  }
                }
              }
            }
          }
        ]
      });
    }
  }
};
</script>
