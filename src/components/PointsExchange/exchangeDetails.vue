<template>
  <div>
    <div>
        <el-input v-model="exchangeContent" placeholder="请输入内容" style="width: 200px;"></el-input>
        <el-button type="primary" icon="el-icon-search">查询</el-button>
    </div>
    <el-table :data="tableData.slice((currage - 1) * pagesize, currage*pagesize)" style="width: 100%" stripe>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="productName" label="产品名称"></el-table-column>
      <el-table-column prop="integralChange" label="积分变动"></el-table-column>
      <el-table-column prop="orderTime" label="下单时间"></el-table-column>
      <el-table-column prop="availableIntegral" label="可用积分"></el-table-column>
    </el-table>
    <div class="pagination-container" v-if="tableData.length>0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5,10]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      exchangeContent: '',
      pagesize: 5,
      currage: 1,
      tableData: [
        {
          productName: '50M流量包',
          integralChange: -750,
          orderTime: '2020-05-20',
          availableIntegral: '890'
        },
        {
          productName: '50M流量包',
          integralChange: -750,
          orderTime: '2020-05-20',
          availableIntegral: '890'
        },
        {
          productName: '50M流量包',
          integralChange: -750,
          orderTime: '2020-05-20',
          availableIntegral: '890'
        },
        {
          productName: '50M流量包',
          integralChange: -750,
          orderTime: '2020-05-20',
          availableIntegral: '890'
        },
        {
          productName: '50M流量包',
          integralChange: -750,
          orderTime: '2020-05-20',
          availableIntegral: '890'
        }
      ]
    }
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.currage = val
    }
  }
}
</script>

<style>
    .exchangeDetailsTitle{
        margin-bottom: 10px;
    }
</style>
