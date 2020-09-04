<template>
  <div class="dashboard-editor-container">
    <!-- <panel-group @handleSetLineChartData="handleSetLineChartData"/> -->
    <panel-group />

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="chart-wrapper">
          <bar-chart-month />
        </div>
      </el-col>
      <!-- <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <bar-chart-Year />
        </div>
      </el-col>-->
    </el-row>

    <el-row>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="personName" label="排行" align="center">
          <template slot-scope="scope">
            <i v-if="scope.$index == 0" class="oneNum"></i>
            <i v-else-if="scope.$index == 1" class="twoNum"></i>
            <i v-else-if="scope.$index == 2" class="threeNum"></i>
            <span v-else>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="personName" label="姓名" align="center"></el-table-column>
        <el-table-column prop="deptName" label="部门" align="center"></el-table-column>
        <el-table-column prop="score" label="分数" align="center"></el-table-column>
      </el-table>
    </el-row>

    <!-- <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"/>
    </el-row>-->
  </div>
</template>

<script>
import PanelGroup from "./components/PanelGroup";
import LineChart from "./components/LineChart";
import BarChartMonth from "./components/BarChartMonth";
import BarChartYear from "./components/BarChartYear";
import { personScoreList } from "@/api/appr/score";
const lineChartData = {
  // 双曲线的数据
  // 后面改成从后台获取
  newVisitis: {
    expectedData: [20, 12, 8, 13, 10, 9],
    actualData: [10, 15, 9, 15, 6, 14]
  }
};

export default {
  name: "DashboardAdmin",
  components: {
    PanelGroup,
    LineChart,
    BarChartMonth,
    BarChartYear
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      tableData: null
    };
  },
  created() {
    this.getPersonList();
  },
  methods: {
    getPersonList() {
      personScoreList().then(res => {
        this.tableData = res.data.data;
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
.oneNum,
.twoNum,
.threeNum {
  display: inline-block;
  background: url("../../assets/one.png") no-repeat;
  width: 30px;
  height: 30px;
  background-size: 100% 100%;
}
.twoNum {
  background: url("../../assets/two.png") no-repeat;
  background-size: 100% 100%;
}
.threeNum {
  background: url("../../assets/three.png") no-repeat;
  background-size: 100% 100%;
}
</style>
