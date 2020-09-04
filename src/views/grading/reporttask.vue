<template>
  <div class="achievement">
    <!-- 设置自动评分按钮 -->
    <div style="width:90%;margin:10px auto;text-align:right">
      <el-button type="primary" @click="setAutoScore">自动评分</el-button>
    </div>

    <!-- 例会情况 -->
    <div class="scoring">
      <div class="standard">
        <span style="font-weight:700">例会情况</span>
      </div>
      <div class="filter-container">
        <el-input
          placeholder="例会主题"
          v-model="meetingTemp.listQuery.subject"
          style="width: 200px;"
          class="filter-item"
        />
        <el-input
          v-model="meetingTemp.listQuery.departName"
          @focus="meetingTemp.dialogDeptVisible = true"
          placeholder="召开部门"
          style="width: 200px;"
          class="filter-item"
        />
        <input v-model="meetingTemp.listQuery.departId" type="hidden" />
        <el-date-picker
          v-model="meetingTemp.listQuery.startDate"
          placeholder="开始时间"
          type="date"
          class="filter-item"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
        <el-date-picker
          v-model="meetingTemp.listQuery.endDate"
          placeholder="结束时间"
          type="date"
          class="filter-item"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="meetingFilter"
        >{{ $t('table.query') }}</el-button>
      </div>
      <el-table :data="meetingTemp.meetingList" style="width:100%" class="table">
        <el-table-column label="例会日期">
          <template slot-scope="scope">{{ scope.row.meetingDate | timeFilter}}</template>
        </el-table-column>
        <el-table-column prop="subject" label="例会主题"></el-table-column>
        <el-table-column prop="personId" label="召开人"></el-table-column>
        <el-table-column prop="departName" label="召开部门"></el-table-column>
        <el-table-column prop="outline" label="会议纪要"></el-table-column>
        <el-table-column label="评分">
          <template slot-scope="scope">
            <el-rate v-model="scope.row.score" @change="setMeetingScore(scope.row)"></el-rate>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          @size-change="meetingSizeChange"
          @current-change="meetingCurrentChange"
          :current-page="meetingTemp.listQuery.pageNum"
          :page-sizes="[10, 20, 50]"
          :page-size="meetingTemp.listQuery.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="meetingTemp.meetingListTotal"
        ></el-pagination>
      </div>
    </div>
    <!-- 数据共享 -->
    <div class="datasharing">
      <div class="datasharing-title">
        <span style="font-weight:700">数据共享</span>
      </div>
      <!-- {{scope.row.filename}} -->
      <el-table :data="dataShareTemp.dataShareList" style="width:100%" class="datashar">
        <el-table-column prop="dataName" label="数据名称"></el-table-column>
        <el-table-column prop="dataSize" label="数据量"></el-table-column>
        <el-table-column prop="startTime" label="开始时间">
          <template slot-scope="scope">{{ scope.row.startTime | timeFilter}}</template>
        </el-table-column>
        <el-table-column prop="deptName" label="共享部门"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-rate v-model="scope.row.score" @change="setDataShareScore(scope.row)"></el-rate>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          @size-change="dataShareSizeChange"
          @current-change="dataShareCurrentChange"
          :current-page="dataShareTemp.listQuery.pageNum"
          :page-sizes="[10, 20, 50]"
          :page-size="dataShareTemp.listQuery.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="dataShareTemp.dataShareListTotal"
        ></el-pagination>
      </div>
    </div>

    <!-- 措施建议 -->
    <div class="proposal">
      <div class="proposal-title">
        <span style="font-weight:700">措施建议</span>
      </div>
      <!-- {{scope.row.filename}} -->
      <el-table :data="propTemp.propList" style="width:100%" class="dataProp">
        <el-table-column prop="suggest" label="措施建议"></el-table-column>
        <el-table-column prop="userName" label="填报人"></el-table-column>
        <el-table-column prop="createTime" label="填报时间">
          <template slot-scope="scope">{{ scope.row.createTime | timeFilter}}</template>
        </el-table-column>
        <el-table-column prop="departName" label="填报部门"></el-table-column>
        <el-table-column label="评分">
          <template slot-scope="scope">
            <el-rate v-model="scope.row.score" @change="setPropScore(scope.row)"></el-rate>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          @size-change="propSizeChange"
          @current-change="propCurrentChange"
          :current-page="propTemp.listQuery.pageNum"
          :page-sizes="[10, 20, 50]"
          :page-size="propTemp.listQuery.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="propTemp.propListTotal"
        ></el-pagination>
      </div>
    </div>

    <!-- 选择部门 -->
    <v-DeptCheck
      :deptVisible="meetingTemp.dialogDeptVisible"
      @getDeptNodeData="getDeptNodeData"
      @closeDialog="closeDialog"
    ></v-DeptCheck>

    <!-- 自动评分配置弹窗 -->
    <el-dialog title="自动评分配置" :visible.sync="autoScoreDialog" abel-width="120px">
      <el-form v-model="scoreForm">
        <el-row>
          <el-col :span="10"></el-col>
        </el-row>
        <el-form-item label="例会评分分数">
          <el-rate v-model="scoreForm.meetingScore"></el-rate>
        </el-form-item>
        <el-form-item label="数据共享评分">
          <el-rate v-model="scoreForm.dataShareScore"></el-rate>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="autoScoreDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveAutoScore">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  pageList,
  updateMeeting,
  getAutoScore,
  fitAutoScore
} from "@/api/appr/meeting";
import {
  pageList as dataSharePage,
  addDataShare,
  updateDataShare,
  deleteDataShare
} from "@/api/appr/dataShare";
import {
  suggestPage,
  addSuggest,
  updateSuggest,
  deleteSuggest,
  getSuggestScore
} from "@/api/appr/suggest";
import { fetchTree } from "@/api/admin/dept";
import {
  checkMultipleSelect,
  isNotEmpty,
  notifySuccess,
  notifyFail,
  messageSuccess,
  formatDate
} from "@/utils/util";
import DeptCheck from "@/components/DeptCheck/index";
export default {
  name: "MyAchievement",
  props: [""],
  filters: {
    timeFilter(time) {
      return formatDate(new Date(time), "yyyy-MM-dd");
    }
  },
  data() {
    return {
      meetingTemp: {
        listQuery: {
          subject: undefined,
          startDate: undefined,
          endDate: undefined,
          departId: undefined,
          pageNum: 1,
          pageSize: 10
        },
        meetingListTotal: 0,
        meetingList: [],
        treeDeptData: [],
        dialogDeptVisible: false,
        aExpandedKeys: [],
      },
      dataShareTemp: {
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          sort: "create_time",
          order: "descending"
        },
        dataShareList: [],
        dataShareListTotal: 0
      },
      propTemp: {
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          sort: "create_time",
          order: "descending"
        },
        propList: [],
        propListTotal: 0
      },
      autoScoreDialog: false,
      scoreForm: {
        dataShareScore: "",
        meetingScore: ""
      }
    };
  },

  components: {
    "v-DeptCheck": DeptCheck
  },

  computed: {},

  beforeMount() {},

  mounted() {},

  created() {
    this.getMeetingList();
    this.getDataShareList();
    this.getProposalList();
  },

  methods: {
    // 获取例会列表
    getMeetingList() {
      pageList(this.meetingTemp.listQuery).then(res => {
        this.meetingTemp.meetingList = res.data.list;
        this.meetingTemp.meetingListTotal = res.data.total;
      });
    },
    // 列表查询
    meetingFilter() {
      this.meetingTemp.listQuery.pageNum = 1;
      this.getMeetingList();
    },
    // 例会列表分页事件
    meetingSizeChange(pageSize) {
      this.meetingTemp.listQuery.pageSize = pageSize;
      this.getMeetingList();
    },
    meetingCurrentChange: function(currentPage) {
      //页码切换
      this.meetingTemp.listQuery.pageNum = currentPage;
      this.getMeetingList();
    },
    // 设置例会评分
    setMeetingScore(row) {
      var rowTemp = Object.assign({}, row);
      updateMeeting(rowTemp)
        .then(res => {
          if (res.data.data) {
            notifySuccess(this, "评分成功");
          } else {
            notifyFail(this, "评分失败");
          }
        })
        .catch(err => {
          notifyFail(this, "评分失败");
        });
    },
    setDataShareScore(row) {
      var rowTemp = Object.assign({}, row);
      updateDataShare(rowTemp)
        .then(res => {
          if (res.data.data) {
            notifySuccess(this, "评分成功");
          } else {
            notifyFail(this, "评分失败");
          }
        })
        .catch(err => {
          notifyFail(this, "评分失败");
        });
    },
    setPropScore(row) {
      var rowTemp = Object.assign({}, row);
      updateSuggest(rowTemp)
        .then(res => {
          if (res.data.data) {
            notifySuccess(this, "评分成功");
          } else {
            notifyFail(this, "评分失败");
          }
        })
        .catch(err => {
          notifyFail(this, "评分失败");
        });
    },
    getDeptNodeData(data) {
      this.meetingTemp.dialogDeptVisible = false;
      this.meetingTemp.listQuery.departId = data.id;
      this.meetingTemp.listQuery.departName = data.deptName;
    },
    closeDialog(val) {
      this.meetingTemp.dialogDeptVisible = val;
    },
    //获取数据共享列表
    getDataShareList() {
      dataSharePage(this.dataShareTemp.listQuery).then(res => {
        this.dataShareTemp.dataShareList = res.data.list;
        this.dataShareTemp.dataShareListTotal = res.data.total;
      });
    },
    // 例会列表分页事件
    dataShareSizeChange(pageSize) {
      this.dataShareTemp.listQuery.pageSize = pageSize;
      this.getDataShareList();
    },
    dataShareCurrentChange: function(currentPage) {
      //页码切换
      this.dataShareTemp.listQuery.pageNum = currentPage;
      this.getDataShareList();
    },

    // 获取措施建议列表
    getProposalList() {
      suggestPage(this.propTemp.listQuery).then(res => {
        this.propTemp.propList = res.data.list;
        this.propTemp.propListTotal = res.data.total;
      });
    },
    // 例会列表分页事件
    propSizeChange(pageSize) {
      this.propTemp.listQuery.pageSize = pageSize;
      this.getProposalList();
    },
    propCurrentChange: function(currentPage) {
      //页码切换
      this.propTemp.listQuery.pageNum = currentPage;
      this.getProposalList();
    },

    // 设置自动评分
    setAutoScore() {
      getAutoScore().then(res => {
        this.autoScoreDialog = true;
        this.scoreForm.dataShareScore = res.data.data[1];
        this.scoreForm.meetingScore = res.data.data[0];
      });
    },
    // 保存自动评分
    saveAutoScore() {
      fitAutoScore({
        dataShareScore: this.scoreForm.dataShareScore,
        meetingScore: this.scoreForm.meetingScore
      }).then(res => {
        notifySuccess(this, "设置成功");
        this.autoScoreDialog = false;
      });
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.scoring {
  width: 90%;
  margin: 20px auto;
  border: 2px solid #f0f2f5;

  .standard {
    // font-weight 700px
    padding: 15px 20px;
    background-color: #fafafa;
    border-bottom: 2px solid #f0f2f5;
  }

  .table {
    padding: 15px 20px;
  }
}

.datasharing {
  width: 90%;
  margin: 20px auto;
  border: 2px solid #f0f2f5;

  .datasharing-title {
    // font-weight 700px
    padding: 15px 20px;
    background-color: #fafafa;
    border-bottom: 2px solid #f0f2f5;
  }

  .datashar {
    padding: 15px 20px;
  }
}

.pagination-container {
  padding-left: 20px;
  padding-bottom: 30px;
}

.proposal {
  width: 90%;
  margin: 20px auto;
  border: 2px solid #f0f2f5;

  .proposal-title {
    // font-weight 700px
    padding: 15px 20px;
    background-color: #fafafa;
    border-bottom: 2px solid #f0f2f5;
  }

  .dataProp {
    padding: 15px 20px;
  }

  .addProp {
    border: 2px dashed #f0f2f5;
    margin: 10px auto;
    width: 98%;
    display: block;
  }
}
</style>
