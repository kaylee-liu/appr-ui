<template>
  <div class="Emap" id="hainan_map"></div>
</template>

<script>
import haiNan from "@/assets/hainan.json";
import { locationCounts } from "@/api/appr/achieveAppear";
const echarts = require("echarts");
export default {
  name: "Emap",
  props: [""],
  data() {
    return {
      hainanJson: haiNan,
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
      for (let i = 0, t = res.data; i < t.length; i++) {
        for (let j = 0, k = this.localOpts; j < k.length; j++) {
          if (t[i].statsName == k[j].value) {
            t[i].name = k[j].name;
            t[i].value = t[i].statsValue;
          }
        }
      }
      this.initMap(res.data);
    });
  },

  methods: {
    initMap(data) {
      let echartObj = echarts.init(document.getElementById("hainan_map"));

      let echartOpt = {
        title: {
          text: "海南省战果上报分布",
          left: "center"
        },
        geo: {
          map: "海南",
          roam: true,
          label: {
            show: true,
            color: "rgba(0,0,0,0.4)"
          },
          itemStyle: {
            borderColor: "rgba(0, 0, 0, 0.2)"
          },
          emphasis: {
            itemStyle: {
              areaColor: null,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        },
        series: [
          {
            type: "scatter",
            coordinateSystem: "geo",
            data: this.convertData(data),
            symbolSize: 50,
            symbol: "pin",
            label: {
              formatter: function(params) {
                return params.value[2];
              },
              show: true,
              color: "#000"
            },
            itemStyle: {
              color: "#F06C00"
            }
          },
          {
            name: "海南省战果上报分布",
            type: "map",
            mapType: "海南", // 自定义扩展图表类型
            geoIndex: 0
          }
        ]
      };
      echarts.registerMap("海南", this.hainanJson);
      echartObj.setOption(echartOpt, true);
    },
    convertData(data) {
      var geoCoordMap = {
        海口: [110.33119, 20.031971],
        三亚: [109.508268, 18.247872],
        儋州: [109.576782, 19.517486],
        五指山: [109.516662, 18.776921],
        琼海: [110.466785, 19.246011],
        文昌: [110.753975, 19.612986],
        万宁: [110.388793, 18.796216],
        东方: [108.653789, 19.10198],
        定安: [110.349235, 19.684966],
        屯昌: [110.102773, 19.362916],
        澄迈: [110.007147, 19.737095],
        临高: [109.687697, 19.908293],
        白沙黎族自治县: [109.452606, 19.224584],
        昌江黎族自治县: [109.053351, 19.260968],
        乐东黎族自治县: [109.175444, 18.74758],
        陵水黎族自治县: [110.037218, 18.505006],
        保亭黎族苗族自治县: [109.70245, 18.636371],
        琼中黎族苗族自治县: [109.839996, 19.03557],
        洋浦经济开发区: [109.212875, 19.775465]
      };
      var res = [];
      for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value)
          });
        }
      }
      return res;
    }
  },

  watch: {}
};
</script>
<style scoped>
.Emap {
  height: 100%;
  width: 100%;
}
</style>