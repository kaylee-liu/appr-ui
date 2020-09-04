<template>
  <div class="achieveAnalysis">
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="8">
        <div class="bg left_h">
          <Emap />
        </div>
      </el-col>
      <el-col :span="14">
        <el-row>
          <el-col :span="24">
            <div class="bg top_h">
              <type-analysis />
              <dept-analysis />
            </div>
          </el-col>
          <el-col :span="24">
            <div class="bg table_h">
              <el-table
                ref="multipleTable"
                :data="tableData"
                highlight-current-row
                style="width: 100%;"
              >
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column prop="title" label="战果标题"></el-table-column>
                <el-table-column label="战果类型">
                  <template slot-scope="scope">
                    <span>{{ typeFormat(scope.row.resultType) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="content" label="内容"></el-table-column>
                <el-table-column prop="endTime" label="时间"></el-table-column>
                <el-table-column label="地点">
                  <template slot-scope="scope">
                    <span>{{ locationFormat(scope.row.location) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="状态">
                  <template slot-scope="scope">
                    <span>{{ statusFormat(scope.row.approvalStatus) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column label="操作" width="300">
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="small"
                      v-if="scope.row.approvalStatus == '0' || scope.row.approvalStatus == '3'"
                      @click="achieveSubmit(scope.row)"
                    >上报</el-button>
                    <el-button
                      type="warning"
                      size="small"
                      v-if="scope.row.approvalStatus == '0' || scope.row.approvalStatus == '3'"
                      @click="openUpdate(scope.row)"
                    >修改</el-button>
                    <el-button
                      type="danger"
                      size="small"
                      v-if="scope.row.approvalStatus == '0' || scope.row.approvalStatus == '3'"
                      @click="achieveRemove(scope.row)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import typeAnalysis from "./components/typeAnalysis";
import deptAnalysis from "./components/deptAnalysis";
import Emap from "./components/Emap";
import { getList } from "@/api/appr/achieveAppear";
export default {
  name: "achieveAnalysis",
  props: [""],
  data() {
    return {
      tableData: [],
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        resultType: null,
        location: null,
        queryStartTime: null,
        queryEndTime: null,
        order: "asc"
      },
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
      ],
      typeOpts: [
        { name: "打私", value: "0" },
        { name: "缉毒", value: "1" },
        { name: "反偷渡", value: "2" }
      ],
      statusOps: [
        { name: "待提交", value: "0" },
        { name: "待审核", value: "1" },
        { name: "已转发", value: "2" },
        { name: "已驳回", value: "3" },
        { name: "已撤销", value: "4" },
        { name: "已审核通过", value: "5" },
      ]
    };
  },

  components: {
    typeAnalysis,
    deptAnalysis,
    Emap
  },

  computed: {
    typeFormat() {
      return function(value) {
        if (!value) return "";
        for (let i = 0, t = this.typeOpts; i < t.length; i++) {
          if (value == t[i].value) {
            return t[i].name;
          }
        }
      };
    },
    locationFormat() {
      return function(value) {
        if (!value) return "";
        for (let i = 0, t = this.localOpts; i < t.length; i++) {
          if (value == t[i].value) {
            return t[i].name;
          }
        }
      };
    },
    statusFormat() {
      return function (value) {
        if (!value) return "";
        for (let i = 0, t = this.statusOps; i < t.length; i++) {
          if (value == t[i].value) {
            return t[i].name;
          }
        }
      }
    }
  },

  beforeMount() {},

  mounted() {
    this.querySearch();
  },

  methods: {
    querySearch() {
      this.listQuery.queryStartTime =
        this.timeScope && this.timeScope[0] ? this.timeScope[0] : null;
      this.listQuery.queryEndTime =
        this.timeScope && this.timeScope[1] ? this.timeScope[1] : null;
      let _self = this;
      getList(this.listQuery).then(({ data: res }) => {
        _self.tableData = res.list;
        _self.total = res.total;
      });
    }
  },

  watch: {}
};
</script>
<style scoped>
.bg {
  border-radius: 5px;
  /*border:1px solid #dcdee2;*/
  box-shadow: 1px 1px 10px #bdbdbd;
  width: 100%;
  padding: 1%;
  background: #fff;
  margin-top: 50px;
  padding: 30px 0px;
}
.left_h {
  height: 750px;
}
.top_h {
  height: 300px;
}
.table_h {
  height: 400px;
  padding: 30px 0px;
  overflow: hidden;
  margin-bottom: 30px;
}
</style>