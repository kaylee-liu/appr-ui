<template>
  <div class="app-container">
    <spinner-loading v-if="listLoading" />
    <div class="filter-container">
      <!-- <el-form :model="numberValidateForm" ref="numberValidateForm"> -->
      <el-form>
        <el-input
          v-model="listQuery.subject"
          style="width: 200px;"
          :placeholder="$t('table.task.name')"
          class="filter-item"
          @keyup.enter.native="doFilter"/>
        <el-select
          v-model="listQuery.status"
          style="width: 200px;"
          placeholder="请选择"
          class="filter-item"
          @change="doFilter">
          <el-option v-for="item in options" :key="item.type" :label="item.name" :value="item.type"></el-option>
        </el-select>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="doFilter"
          v-waves 
          >{{$t('table.query')}}</el-button>
        <!-- 重置 -->
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-refresh"
          @click="resetForm('numberValidateForm')"
        >{{$t('table.reset')}}</el-button>
      </el-form>
    </div>
    <el-table 
      :data="tempList" 
      :key="tableKey"
      highlight-current-row
      style="width: 100%"
      ref="numberValidateForm"
      @selection-change="handleSelectionChange">
      <!-- 任务名称 -->
      <el-table-column :label="$t('table.task.name')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <!-- 负责部门=》责任部门代替-->
      <el-table-column :label="$t('table.task.departName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.departName }}</span>
        </template>
      </el-table-column>
      <!-- 负责人=》主持人代替 -->
      <el-table-column :label="$t('table.task.personName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.personName }}</span>
        </template>
      </el-table-column>
      <!-- 截止时间 =》结束时间代替-->
      <el-table-column :label="$t('table.task.endTime')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime | timeFilter}}</span>
        </template>
      </el-table-column>
      <!-- 状态 -->
      <el-table-column :label="$t('table.status')" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusTypeFilter">{{ scope.row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column width="200" label="操作" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 2" type="text" icon="el-icon-edit" @click="toAppear(scope.row.id)">评分</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange1"
        @current-change="handleCurrentChange1"
        :current-page="listQuery.pageNum"
        :page-sizes="[10, 20, 50]"
        @next-click="next"
        :page-size="listQuery.pageSize"
        @prev-click="after"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { fetchPageList } from '@/api/appr/HomeTaskHall'
import waves from "@/directive/waves";
import {
  checkMultipleSelect,
  isNotEmpty,
  notifySuccess,
  notifyFail,
  messageSuccess,
  formatDate
} from "@/utils/util";
import SpinnerLoading from "@/components/SpinnerLoading";
export default {
  name: "assignmentgather",
   components: {
    SpinnerLoading
  },
  directives: {
    waves
  },
  data() {
    return {
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        subject: "",
        status: "",
        name: undefined,
      },
      total: 0,
      tableKey: 0,
      multipleSelection: [],
      filterTableDataEnd: [],
      numberValidateForm: {
        tableDataName: "",
        status: ""
      },
      tempList: [],
      options: [{ type: "0", name: "新建" }, 
        { type: "1", name: "执行中" },
        { type: "2", name: "已完成" },
        { type: "3", name: "已评分" }],
      status: "",
      tableData: []
    };
  },
  filters: {
      // 状态0：1
    statusTypeFilter(status) {
      const statusTypeMap = {
          0: '',
          1: 'info',
          2: 'danger',
          3: 'success'
        }
        return statusTypeMap[status];
    },
    // 状态0：1
    statusFilter(status) {
     const statusMap = {
        0: '新建',
        1: '执行中',
        2: '已完成',
        3: '已评分'
      }
      return statusMap[status];
    },
    timeFilter(time) {
      return formatDate(new Date(time), "yyyy-MM-dd");
    }
  },
  mounted() {
    this.getList();
    this.total = this.tableData.length;
  },
  methods: {
    //前端搜索功能需要区分是否检索,因为对应的字段的索引不同
    //用两个变量接收currentChangePage函数的参数
    doFilter() {
      if (this.tableDataName == "") {
        this.$message.warning("查询条件不能为空！");
        return;
      }
      this.tempList = [];
      //页面数据改变重新统计数据数量和当前页\
      this.listQuery.pageNum= 1;
      this.getList();
    },
    resetnumberValidateForm() {
      this.numberValidateForm = {
        tableDataName: "",
        status: ""
      };
    },
    // 取消，重置
    resetForm(numberValidateForm) {
      //  this.resetTemp()
      // this.$refs[numberValidateForm].resetFields()
      this.resetnumberValidateForm();
      this.$nextTick(() => {
        this.$refs["numberValidateForm"].resetFields();
      });
    },
    next(data) {
      this.listQuery.pageNum = data;
      this.getList();
    },
    after(data) {
      this.listQuery.pageNum = data;
      this.getList();
    },
    handleSizeChange1: function(pageSize) {
      //每页条数切换
      this.listQuery.pageSize = pageSize;
      this.getList();
    },
    handleCurrentChange1: function(currentPage) {
      //页码切换
      this.listQuery.pageNum = currentPage;
      this.getList();
    },
      // 搜索页的
    handleSelectionChange (data) {
      this.multipleSelection = data
    },
    getList() {
      this.listLoading = true;
      fetchPageList(this.listQuery).then(response => {
        this.tempList = response.data.list;
        this.total = response.data.total;
        setTimeout(() => {
          this.listLoading = false;
        }, 500);
      });
    },
    currentChangePage(list, currentPage) {
      let from = (currentPage - 1) * this.pageSize;
      let to = currentPage * this.pageSize;
      this.tableData = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.tableData.push(list[from]);
        }
      }
    },
    toAppear(id) {
      this.$router.push({
        path: `/appearGather/${id}/update`
      });
    }
  }
};
</script>