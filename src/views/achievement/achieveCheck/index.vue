<template>
  <div class="achieveCheck app-container">
    <div class="filter-container">
      <el-input
        placeholder="战果标题"
        v-model="listQuery.title"
        style="width: 200px;"
        class="filter-item"
      />
      <el-select
        placeholder="发起地点"
        v-model="listQuery.location"
        style="width: 200px;"
        class="filter-item"
        clearable
      >
        <el-option
          v-for="(item,index) in localOpts"
          :key="index"
          :label="item.name"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        placeholder="战果类型"
        v-model="listQuery.resultType"
        style="width: 200px;"
        class="filter-item"
        clearable
      >
        <el-option
          v-for="(item,index) in typeOpts"
          :key="index"
          :label="item.name"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-date-picker
        class="filter-item"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd"
        v-model="timeScope"
      ></el-date-picker>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="querySearch"
      >{{ $t('table.query') }}</el-button>
    </div>
    <spinner-loading v-if="listLoading" />
    <el-table ref="multipleTable" :data="tableData" highlight-current-row style="width: 100%;">
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
          <el-button type="primary" size="small" @click="achieveSubmit(scope.row)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        v-show="total>0"
        :current-page="listQuery.pageNum"
        :page-sizes="[10,20,30,50]"
        :page-size="listQuery.pageSize"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 表单弹窗组件 -->
    <Check-form ref="checkForm" @refreshTable="refreshTable"></Check-form>
  </div>
</template>

<script>
import CheckForm from "./components/form";
import { getList } from "@/api/appr/achieveAppear";
export default {
  name: "",
  props: [""],
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        resultType: null,
        location: null,
        queryStartTime: null,
        queryEndTime: null,
        order: "asc",
        approvalStatus: "1,2"
      },
      listLoading: false,
      timeScope: [],
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
        { name: "已审核通过", value: "5" }
      ],
      tableData: [],
      total: 0
    };
  },

  components: {
    CheckForm
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
      return function(value) {
        if (!value) return "";
        for (let i = 0, t = this.statusOps; i < t.length; i++) {
          if (value == t[i].value) {
            return t[i].name;
          }
        }
      };
    }
  },

  beforeMount() {},

  mounted() {
    this.querySearch();
  },

  methods: {
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.querySearch();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.querySearch();
    },
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
    },
    achieveSubmit(data) {
      this.$refs.checkForm.dialogVisible = true;
      this.$refs.checkForm.form = {
        title: data.title,
        resultType: data.resultType,
        endTime: data.endTime,
        location: data.location,
        content: data.content,
        remark: data.remark,
        approvalStatus: "0",
        id: data.id
      };
    },
    refreshTable() {
      this.querySearch();
    }
  },

  watch: {}
};
</script>
<style>
.filter-container .el-date-editor .el-range-input,
.filter-container .el-date-editor .el-range-separator {
  float: left;
}
.filter-container .el-date-editor .el-range-separator {
  width: 7%;
}
</style>