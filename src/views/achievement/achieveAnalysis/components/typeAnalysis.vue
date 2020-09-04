<template>
  <div class="chart typeAnalysis" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from "echarts"; // echarts theme
import { debounce } from "@/utils";
import { typeCounts } from "@/api/appr/achieveAppear";
require("echarts/theme/macarons");
export default {
  name: "typeAnalysis",
  props: {
    width: {
      type: String,
      default: "50%"
    },
    height: {
      type: String,
      default: "100%"
    }
  },
  data() {
    return {
      chart: null,
      typeOpts: [
        { name: "打私", value: "0" },
        { name: "缉毒", value: "1" },
        { name: "反偷渡", value: "2" }
      ]
    };
  },

  components: {},

  computed: {},

  beforeMount() {},

  mounted() {
    typeCounts().then(({ data: res }) => {
      let nameArr = [];
      for (let i = 0, t = res.data; i < t.length; i++) {
        for (let j = 0, k = this.typeOpts; j < k.length; j++) {
          if (t[i].statsName == k[j].value) {
            t[i].name = k[j].name;
            t[i].value = t[i].statsValue;
            nameArr.push(t[i].name);
          }
        }
      }
      this.initChart(res.data, nameArr);
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
          text: "战果类型统计",
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
.chart {
  float: left;
}
</style>