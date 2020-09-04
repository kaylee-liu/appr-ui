<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 查询 -->
      <el-input
        placeholder="请输入项目名称"
        v-model="listQuery.name"
        style="width: 200px;"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >{{ $t('table.search') }}</el-button>
      <span
        class="totalScore"
        style="margin-left:20px;font-size:20px;color:red"
      >任务累计积分 {{ totalScore }}</span>
      <spinner-loading v-if="listLoading" />
    </div>
    <el-table
      ref="multipleTable"
      :key="tableKey"
      :data="list"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
      style="width: 100%"
    >
      <!-- 状态 -->
      <el-table-column :label="$t('table.status')">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusTypeFilter">{{ scope.row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.task.name')">
        <!-- 名称 -->
        <template slot-scope="scope">
          <div>
            <span style="font-size:16px; font-weight:700">{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <!-- 开始时间 -->
      <el-table-column :label="$t('table.startTime')">
        <template slot-scope="scope">
          <div>
            <span>{{ scope.row.startTime | timeFilter }}</span>
          </div>
        </template>
      </el-table-column>
      <!-- 结束时间 -->
      <el-table-column :label="$t('table.endTime')">
        <template slot-scope="scope">
          <div>
            <span>{{ scope.row.endTime | timeFilter }}</span>
          </div>
        </template>
      </el-table-column>
      <!-- 当前进度 -->
      <el-table-column :label="$t('table.task.plan')">
        <template slot-scope="scope">
          <el-progress :percentage="parseInt(scope.row.taskDepart ? scope.row.taskDepart.degree : 0)" class="progressbar"></el-progress>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('table.actions')">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status == '0' || scope.row.status == '1' "
            type="primary"
            @click="toTheme(scope.row.id)"
          >上报</el-button>
          <el-button @click="viewTask(scope.row)">{{ $t('table.task.view') }}</el-button>
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
import {
  fetchList,
  fetchPageList,
  addObj,
  getObj,
  putObj,
  delObj,
  userTaskScoreSum
} from "@/api/appr/HomeTaskHall";
import waves from "@/directive/waves";
import { mapGetters } from "vuex";
import { getToken } from "@/utils/auth";
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
  name: "myTask",
  components: {
    SpinnerLoading,
    
  },
  directives: {
    waves
  },
  filters: {
    statusTypeFilter(status) {
      const statusTypeMap = {
        0: "",
        1: "info",
        2: "danger",
        3: "success"
      };
      return statusTypeMap[status];
    },
    // 状态0：1
    statusFilter(status) {
      const statusMap = {
        0: "新建",
        1: "执行中",
        2: "已完成",
        3: "已评分"
      };
      return statusMap[status];
    },
    timeFilter(time) {
      return formatDate(new Date(time), "yyyy-MM-dd");
    }
  },
  computed: {
    ...mapGetters(["elements", "permissions"])
  },
  data() {
    return {
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        name: "",
        queryType: "personal"
      },
      total: 0,
      totalScore: 0,
      // List: [],
      // tempList:[]
      status: "",
      tableData: [],
      user_btn_del: false,
      list: null,
      tableKey: 0,
      temp: {
        status: null,
        name: "",
        startTime: null,
        percentage: null
      },
      defaultDeptProps: {
        children: "children",
        label: "deptName"
      }
    };
  },
  mounted() {
    this.getList();
    this.getTotalScore();
    // this.user_btn_add = this.permissions['sys:user:add']
    // this.user_btn_edit = this.permissions['sys:user:edit']
    // this.user_btn_del = this.permissions['sys:user:del']
  },
  methods: {
    format(percentage) {
      return percentage === 100 ? "满" : `${percentage}%`;
    },
    //前端搜索功能需要区分是否检索,因为对应的字段的索引不同
    handleFilter() {
      if (this.tableDataName == "") {
        this.$message.warning("查询条件不能为空！");
        return;
      }
      this.List = [];
      //页面数据改变重新统计数据数量和当前页
      this.listQuery.pageNum = 1;
      this.getList();
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
      this.pageSize = pageSize;
      this.getList();
    },
    handleCurrentChange1: function(currentPage) {
      //页码切换
      this.listQuery.pageNum = currentPage;
      this.getList();
    },
    nodeCollapse(data) {
      this.oExpandedKey[data.id] = false;
      // 如果有子节点
      this.treeRecursion(this.oTreeNodeChildren[data.id], oNode => {
        this.oExpandedKey[oNode.id] = false;
      });
      this.setExpandedKeys();
    },
    setExpandedKeys() {
      const oTemp = this.oExpandedKey;
      this.aExpandedKeys = [];
      for (const sKey in oTemp) {
        if (oTemp[sKey]) {
          this.aExpandedKeys.push(parseInt(sKey));
        }
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    nodeExpand(data) {
      const aChildren = data.children;
      if (aChildren.length > 0) {
        this.oExpandedKey[data.id] = true;
        this.oTreeNodeChildren[data.id] = aChildren;
      }
      this.setExpandedKeys();
    },
    // 获取列表
    getList() {
      this.listLoading = true;
      fetchPageList(this.listQuery).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        setTimeout(() => {
          this.listLoading = false;
        }, 500);
      });
    },
    deleteRow(row) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delObj(row.id).then(() => {
            this.dialogFormVisible = false;
            notifySuccess(this, "删除成功");
          });
          const index = this.list.indexOf(row);
          this.list.splice(index, 1);
        })
        .catch(() => {});
    },
    // deleteRow(index, rows) {
    //   rows.splice(index, 1)
    // },

    handleFilter() {
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    sortChange(column, prop, order) {
      this.listQuery.sort = column.prop;
      this.listQuery.order = column.order;
      this.getList();
    },
    toTheme(id) {
      this.$router.push({
        path: `/themeconference/${id}`
      });
    },
    viewTask(row) {
      this.$router.push({
        path: `/appearInfo/${row.id}/view`
      });
    },
    // 获取总分
    getTotalScore() {
      userTaskScoreSum().then(res => {
        this.totalScore = res.data.data;
      });
    }
  }
};
</script>