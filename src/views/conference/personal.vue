<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('table.conference.subject')"
        v-model="listQuery.subject"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.status"
        :placeholder="$t('table.status')"
        style="width: 140px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in conferenceStatusList"
          :key="item.type"
          :label="item.name"
          :value="item.type"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >{{ $t('table.query') }}</el-button>
    </div>
    <spinner-loading v-if="listLoading" />
    <el-table
      ref="multipleTable"
      :key="tableKey"
      :data="list"
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column type="selection" width="55" />
      <!-- 会议主题 -->
      <el-table-column :label="$t('table.conference.subject')" min-width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.subject }}</span>
        </template>
      </el-table-column>
      <!-- 主持人 -->
      <el-table-column :label="$t('table.conference.host')" min-width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.host }}</span>
        </template>
      </el-table-column>
      <!-- 会议室 -->
      <el-table-column :label="$t('table.conference.meetingRoom')">
        <template slot-scope="scope">
          <span>{{ scope.row.roomName }}</span>
        </template>
      </el-table-column>
      <!-- 开始时间 -->
      <el-table-column :label="$t('table.startTime')">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime | timeFilter }}</span>
        </template>
      </el-table-column>
      <!-- 结束时间 -->
      <el-table-column :label="$t('table.endTime')">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime | timeFilter }}</span>
        </template>
      </el-table-column>
      <!-- 状态 -->
      <el-table-column :label="$t('table.status')">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusTypeFilter">{{ scope.row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <!-- 组织单位 -->
      <el-table-column :label="$t('table.conference.organizer')">
        <template slot-scope="scope">
          <span>{{ scope.row.organizer }}</span>
        </template>
      </el-table-column>
      <!-- 参与单位 -->
      <!-- <el-table-column :label="$t('table.conference.participatingUnit')">
        <template slot-scope="scope">
          <span>{{ scope.row.participatingUnits }}</span>
        </template>
      </el-table-column>-->
      <!-- 与会人数 -->
      <el-table-column :label="$t('table.conference.participantCount')">
        <template slot-scope="scope">
          <span>{{ scope.row.participantCount }}</span>
        </template>
      </el-table-column>
      <!-- 参会意愿 -->
      <el-table-column label="参会意愿">
        <template slot-scope="scope">
          <span>{{ scope.row.isAble | isAble}}</span>
        </template>
      </el-table-column>isAble
      <el-table-column label="参会意愿">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.status !== '2'" @click="checkAble(scope.row)">是否参会</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-show="total>0"
        :current-page="listQuery.pageNum"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.pageSize"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 是否参加会议弹窗 -->
    <el-dialog title="参会意愿" :visible.sync="isAbleDialog" width="40vw">
      <el-form :model="ableForm" label-width="120px">
        <el-form-item label="是否参会">
          <el-col :span="20" :offset="2">
            <el-radio-group v-model="ableForm.isAble">
              <el-radio-button value="0" label="0">参会</el-radio-button>
              <el-radio-button value="1" label="1">不参会</el-radio-button>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="不参会原因" v-if="ableForm.isAble == 1">
          <el-col :span="20" offset="2">
            <el-input
              type="textarea"
              v-model="ableForm.unableReason"
              :autosize="{ minRows: 3, maxRows: 6}"
            ></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAbleDialog = false">取 消</el-button>
        <el-button type="primary" @click="setCheckAble">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPersonalList, setIsAble } from "@/api/appr/conference";
import waves from "@/directive/waves";
import { mapGetters } from "vuex";
import { getToken } from "@/utils/auth";
import {
  isNotEmpty,
  notifySuccess,
  notifyFail,
  messageSuccess,
  formatDate
} from "@/utils/util";
import SpinnerLoading from "@/components/SpinnerLoading";
import ConferenceRecord from "./conferenceRecord.vue";

export default {
  name: "Conference",
  components: {
    SpinnerLoading,
    ConferenceRecord
  },
  directives: {
    waves
  },
  filters: {
    statusTypeFilter(status) {
      const statusTypeMap = {
        0: "success",
        1: "success",
        2: "danger",
        3: "danger"
      };
      return statusTypeMap[status];
    },
    statusFilter(status) {
      const statusMap = {
        0: "未开始",
        1: "进行中",
        2: "已结束",
        3: "已取消"
      };
      return statusMap[status];
    },
    timeFilter(time) {
      return formatDate(new Date(time), "yyyy-MM-dd hh:mm");
    },
    isAble(able) {
      const ableStatus = {
        0: "参会",
        1: "不参会"
      };
      return ableStatus[able];
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      roleListLoading: true,
      multipleSelection: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        subject: "",
        sort: "create_time",
        status: "",
        order: "descending",
        queryType: "personal"
      },
      tempRole: null,

      downloadLoading: false,
      treeDeptData: [],
      roleData: [],

      conferenceStatusList: [
        { type: "0", name: "未开始" },
        { type: "1", name: "进行中" },
        { type: "2", name: "已结束" },
        { type: "3", name: "已取消" }
      ],

      defaultDeptProps: {
        children: "children",
        label: "deptName"
      },
      isAbleDialog: false,
      ableForm: {
        conferenceId: "",
        isAble: "",
        unableReason: ""
      }
    };
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters(["elements", "permissions"])
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true;
      fetchPersonalList(this.listQuery).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        setTimeout(() => {
          this.listLoading = false;
        }, 500);
      });
    },
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    // 打开是否参会弹窗
    checkAble(row) {
      this.isAbleDialog = true;
      this.ableForm.conferenceId = row.id;
      this.ableForm.isAble = row.isAble;
      this.ableForm.unableReason = row.unableReason;
    },
    setCheckAble() {
      if (this.ableForm.isAble == '0') {
        this.ableForm.unableReason = ''
      }
      setIsAble(this.ableForm).then(res => {
        if (res.data.data) {
          notifySuccess(this,'保存成功')
          this.isAbleDialog = false;
          this.getList()
        } else {
          notifyFail(this,'保存失败')
        }
      });
    }
  }
};
</script>
