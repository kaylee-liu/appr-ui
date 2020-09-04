<template>
  <div>
    <div class="note" :style="note">
      <div class="myScoreTitle">我的积分</div>
      <div class="myScore">4320</div>
      <a class="animated fadeIn hi detailsLink" @click="exchangeDetails()">
        <i class="el-icon-goods"></i> 兑换明细
      </a>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick" class="scoreTab">
      <el-tab-pane :label="tab.title" :name="tab.name" v-for="(tab, index) of tabs" :key="index">
        <ul>
          <li v-for="(change, i) of tab.pointsChange" :key="i"  @click="open">
            <div class="refuelingKit" :class="change.bgColor">
              <p>{{change.tradeName}}</p>
              <p>{{change.tradeNubmer}}</p>
            </div>
            <p>{{change.tradeName+change.tradeNubmer}}</p>
            <p>
              积分
              <span>{{change.integral}}</span>
            </p>
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>
    <!-- 兑换明细 -->
    <el-dialog :visible.sync="exchangeDetailsDialog" :modal-append-to-body="false" append-to-body>
      <el-page-header @back="goBack" content="兑换明细" class="exchangeDetailsTitle"></el-page-header>
      <exchangeDetails />
    </el-dialog>
  </div>
</template>

<script>
import exchangeDetails from '@/components/PointsExchange/exchangeDetails'
export default {
  components: {
    exchangeDetails
  },
  data () {
    return {
      note: {
        backgroundImage:
          'url(' + require('../../assets/pointsExchange_bg.png') + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100%'
      },
      activeName: 'first',
      tabs: [
        {
          title: '个人积分兑换',
          name: 'first',
          pointsChange: [
            {
              tradeName: '流量加油包',
              tradeNubmer: '30M',
              integral: '420',
              bgColor: 'bgBlue'
            },
            {
              tradeName: '流量加油包',
              tradeNubmer: '50M',
              integral: '750',
              bgColor: 'bgGreen'
            },
            {
              tradeName: '流量加油包',
              tradeNubmer: '30M',
              integral: '420',
              bgColor: 'bgOrange'
            },
            {
              tradeName: '流量加油包',
              tradeNubmer: '50M',
              integral: '750',
              bgColor: 'bgRed'
            }
          ]
        },
        {
          title: '部门积分兑换',
          name: 'second',
          pointsChange: [
            {
              tradeName: '流量加油包',
              tradeNubmer: '100M',
              integral: '900',
              bgColor: 'bgBlue'
            },
            {
              tradeName: '流量加油包',
              tradeNubmer: '50M',
              integral: '750',
              bgColor: 'bgOrange'
            }
          ]
        }
      ],
      exchangeDetailsDialog: false
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    // 兑换明细弹框
    exchangeDetails () {
      let _this = this
      _this.exchangeDetailsDialog = true
    },
    goBack () {
      let _this = this
      _this.exchangeDetailsDialog = false
    },
    open () {
      this.$confirm('是否确认兑换该商品?', '兑换', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '兑换成功!'
        })
      })
      // .catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   })
      // })
    }
  },
  computed: {
    fullTrade () {
      return this.change.tradeName + this.change.tradeNubmer
    }
  }
}
</script>

<style>
.note {
  color: #fff;
  text-align: center;
  position: relative;
}
.myScore {
  font-size: 36px;
  font-weight: normal;
}
.myScoreTitle {
  font-size: 21px;
  font-weight: normal;
  padding: 0;
  margin: 0;
}
.scoreTab .el-tabs__item {
  font-weight: bold;
}
.scoreTab ul {
  height: 300px;
  overflow-y: auto;
}
.scoreTab ul,
li {
  list-style: none;
  padding: 0;
  margin: 0;
}
.scoreTab ul li {
  float: left;
  width: 20%;
  padding: 2%;
  margin: 2.3%;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  height: 240px;
}
.scoreTab ul li .refuelingKit {
  background: #5b7af9;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  font-size: 18px;
}
.scoreTab ul li .refuelingKit p {
  padding: 0px;
  margin: 0px;
}
.scoreTab ul li span {
  color: red;
  padding-left: 10px;
  font-size: 18px;
}
.scoreTab ul li .bgBlue {
  background: #5b7af9;
}
.scoreTab ul li .bgGreen {
  background: #67c23a;
}
.scoreTab ul li .bgOrange {
  background: #ff8d32;
}
.scoreTab ul li .bgRed {
  background: #ff3131;
}
.detailsLink {
  position: absolute;
  right: 20px;
  bottom: 0px;
  font-size: 14px;
}
</style>
