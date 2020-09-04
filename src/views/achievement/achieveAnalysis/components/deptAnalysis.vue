<template>
  <div class="chart deptAnalysis" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from "echarts"; // echarts theme
import { debounce } from "@/utils";
import { locationCounts } from "@/api/appr/achieveAppear";
require("echarts/theme/macarons");
export default {
  name: "deptAnalysis",
  props: {
    width: {
      type: String,
      default: "50%"
    },
    height: {
      type: String,
      default: "100%"
    },
  },
  data() {
    return {
      chart: null,
      localOpts: [
        { name: "海口", value: "0" },
        { name: "三亚", value: "1" },
        { name: "儋州", value: "2" },
        { name: "五指山", value: "3" },
        { name: "琼海", value: "4" },
        { name: "文昌", value: "5" },
        { name: "万宁", value: "6" },
        { name: "东方", value: "7" },
        { name: "定安", value: "8" },
        { name: "屯昌", value: "9" },
        { name: "澄迈", value: "10" },
        { name: "临高", value: "11" },
        { name: "白沙黎族自治县", value: "12" },
        { name: "昌江黎族自治县", value: "13" },
        { name: "乐东黎族自治县", value: "14" },
        { name: "陵水黎族自治县", value: "15" },
        { name: "保亭黎族苗族自治县", value: "16" },
        { name: "琼中黎族苗族自治县", value: "17" },
        { name: "洋浦经济开发区", value: "18" }
      ]
    };
  },

  components: {},

  computed: {},

  beforeMount() {},

  mounted() {
    locationCounts().then(({ data: res }) => {
      let nameArr = [];
      for (let i = 0, t = res.data; i < t.length; i++) {
        for (let j = 0, k = this.localOpts; j < k.length; j++) {
          if (t[i].statsName == k[j].value) {
            t[i].name = k[j].name;
            t[i].value = t[i].statsValue;
            nameArr.push(t[i].name)
          }
        }
      }
      this.initChart(res.data,nameArr);
    });
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    window.addEventListener("resize", this.__resizeHandler);
  },

  methods: {
    initChart(data,nameArr) {
      this.chart = echarts.init(this.$el, "macarons");
      this.chart.setOption({
        title: {
          text: "部门战果统计",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        color: ["#3aa1ff", "#36cbcb", "#4ecb73", "#fbd437", "#f2637b"],
        legend: {
          orient: "horizontal",
          x: "center",
          y: "bottom",
          data: nameArr
        },
        series: [
          {
            name: "战果类型",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: "outside",
                formatter: "{b}: {d}%"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "18",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: true,
                length: 20,
                length2: 20,
                lineStyle: {
                  color: "#333"
                }
              }
            },
            data: data
          }
        ]
      });
    }
  },

  watch: {},

  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener("resize", this.__resizeHandler);
    this.chart.dispose();
    this.chart = null;
  }
};
</script>
<style scoped>
.chart{
  float: left;
}
</style>