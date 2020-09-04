<template>
  <div class="app-container">
    <div class="filter-container">
      <span>{{$t('table.conference.subject')}}:</span>
      <el-input
        placeholder="输入名称查询"
        v-model="listQuery.subject"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <span>&nbsp;&nbsp;{{$t('table.status')}}:</span>
      <el-select
        v-model="listQuery.status"
        :placeholder="$t('table.select')"
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
      <!-- @cell-dblclick="handleUpdate"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange">-->
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
      <!-- 操作 -->
      <el-table-column :label="$t('table.actions')">
        <template slot-scope="scope">
          <!-- 如果有编辑权限就显示 -->
          <!-- <el-button v-if="user_btn_edit" type="text"  @click="handleUpdate(scope.row)" icon="el-icon-edit">{{ $t('table.edit') }}</el-button> -->
          <!-- 判断会议状态，进行中可以记录，未开始、已结束和已取消只能查看，未开始的可以取消 -->
          <el-button
            v-if="scope.row.status == 1 "
            type="text"
            @click="handleRecord(scope.row)"
          >{{ $t('table.conference.record') }}</el-button>
          <el-button
            v-if="scope.row.status == 1 "
            type="text"
            @click="handleEnd(scope.row)"
          >{{ $t('table.conference.end') }}</el-button>
          <el-button
            v-if="scope.row.status == 0 || scope.row.status == 2"
            type="text"
            @click="handleView(scope.row)"
          >{{ $t('table.conference.view') }}</el-button>
          <el-button
            v-if="scope.row.status == 0"
            type="text"
            @click="handleCancel(scope.row)"
          >{{ $t('table.conference.cancel') }}</el-button>
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

    <!-- 会议记录弹窗 -->
    <el-dialog
      :title="$t('table.conference.record')"
      :visible.sync="dialogRecordVisible"
      v-if="dialogRecordVisible"
      width="70%"
      top="10vh"
    >
      <conference-record :currentRowId="currentRowId" @closeMoule="closeMoule"></conference-record>
    </el-dialog>

    <!-- 会议查看弹窗 -->
    <el-dialog
      :title="$t('table.conference.view')"
      :visible.sync="dialogViewVisible"
      v-if="dialogViewVisible"
      width="70%"
      top="10vh"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="与会人员" name="first">
          <el-table
            ref="multipleTable"
            :key="tableKey"
            :data="personList"
            style="width: 100%;"
            max-height="400"
          >
            <el-table-column label="姓名">
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="性别">
              <template slot-scope="scope">
                <span>{{ scope.row.sex | sexFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column label="部门">
              <template slot-scope="scope">
                <span>{{ scope.row.deptName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="电话号码">
              <template slot-scope="scope">
                <span>{{ scope.row.phone }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="会议记录" name="second">
          <el-form>
            <el-row>
              <el-col :span="24">
                <el-form-item label="会议记录">
                  <span v-if="tempConference">{{ tempConference.records }}</span>
                  <span v-else>无会议记录</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="会议纪要">
                  <span v-if="tempConference">{{ tempConference.outline }}</span>
                  <span v-else>无会议纪要</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="上传的文件">
                  <el-button
                    v-for="(item,index) in manages"
                    :key="index"
                    type="primary"
                    @click="download(item.id)"
                  >
                    {{item.name}}
                    <i class="el-icon-upload el-icon--right"></i>
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="任务安排" name="third">
          <el-table
            ref="taskTable"
            :data="taskList"
            highlight-current-row
            style="width: 100%;"
            max-height="400"
            @selection-change="handleTaskSelectionChange"
          >
            <!-- 任务名 -->
            <el-table-column label="任务名称">
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <!-- 负责部门 -->
            <el-table-column label="责任部门">
              <template slot-scope="scope">
                <span>{{ scope.row.departName }}</span>
              </template>
            </el-table-column>
            <!-- 负责人 -->
            <el-table-column label="责任人">
              <template slot-scope="scope">
                <span>{{ scope.row.personName }}</span>
              </template>
            </el-table-column>
            <!-- 优先级 -->
            <el-table-column label="优先级">
              <template slot-scope="scope">
                <span>{{ scope.row.priority | priorityFilter }}</span>
              </template>
            </el-table-column>

            <!-- 生效时间 -->
            <el-table-column label="生效时间">
              <template slot-scope="scope">
                <span>{{ scope.row.startTime | timeFilter }}</span>
              </template>
            </el-table-column>
            <!-- 结束时间 -->
            <el-table-column label="结束时间">
              <template slot-scope="scope">
                <span>{{ scope.row.endTime | timeFilter }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  fetchPageList,
  cancel,
  addObj,
  getObj,
  putObj,
  delObj,
  changeStatus,
  getConferenceInfo,
  getParticipantList
} from "@/api/appr/conference";
import waves from "@/directive/waves";
import { mapGetters } from "vuex";
import { getToken } from "@/utils/auth";
import { downloadFile } from "@/api/appr/file";
import {
  checkMultipleSelect,
  isNotEmpty,
  exportExcel,
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
    sexFilter(type) {
      const sexMap = {
        0: "男",
        1: "女"
      };
      return sexMap[type];
    },
    // 优先级转换
    priorityFilter(priority) {
      const priorityMap = {
        1: "低",
        2: "中",
        3: "高"
      };
      return priorityMap[priority];
    }
  },
  data() {
    // 校验手机号码
    const checkPhone = (rule, value, callback) => {
      if (!/^1[34578]\d{9}$/.test(value)) {
        callback(new Error("请输入正确的手机号码!"));
      } else {
        callback();
      }
    };
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
        status: "",
        order: "descending"
      },
      // 查看与会人员列表
      personList: null,
      tempConference: "",
      taskList: null,
      manages: "",
      activeName: "first",
      tempRole: null,
      rules: {
        name: [{ required: true, message: "请输入账号", trigger: "change" }],
        username: [
          { required: true, message: "请输入姓名", trigger: "change" }
        ],
        phone: [
          { required: true, message: "请输入手机号码", trigger: "change" },
          { validator: checkPhone, trigger: "change" }
        ]
      },
      // 记录窗口显示与否
      dialogRecordVisible: false,
      // 当前点击记录的行id
      currentRowId: null,

      downloadLoading: false,
      treeDeptData: [],
      roleData: [],

      // 查看窗口显示与否
      dialogViewVisible: false,

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
      aExpandedKeys: [],
      user_btn_add: false,
      user_btn_edit: false,
      user_btn_del: false,
      user_btn_import: false,
      user_btn_export: false,
      importUrl: "/api/user/v1/user/import",
      headers: {
        Authorization: "Bearer " + getToken()
      },
      uploading: false,
      percentage: 0,
      tempRadio: 0
    };
  },
  created() {
    this.getList();
    this.user_btn_add = this.permissions["sys:user:add"];
    this.user_btn_edit = this.permissions["sys:user:edit"];
    this.user_btn_del = this.permissions["sys:user:del"];
  },
  computed: {
    ...mapGetters(["elements", "permissions"])
  },
  methods: {
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

    // 取消会议
    handleCancel(row) {
      this.$confirm("确定要取消吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          cancel(row.id).then(() => {
            notifySuccess(this, "取消成功");
            this.getList();
          });
        })
        .catch(() => {});
    },
    // 记录
    handleRecord(row) {
      this.currentRowId = row.id;
      this.dialogRecordVisible = true;
    },
    // 查看
    handleView(row) {
      this.personList = null;
      this.tempConference = null;
      this.taskList = null;
      this.activeName = "first";
      this.dialogViewVisible = true;
      if (row.status === "0") {
        getParticipantList({ conferenceId: row.id }).then(response => {
          this.personList = response.data.list;
        });
      } else {
        getConferenceInfo(row.id).then(response => {
          this.personList = response.data.data.persons;
          this.tempConference = response.data.data.conference;
          this.taskList = response.data.data.tasks;
          this.manages = response.data.data.manages;
        });
      }
    },
    // 结束
    handleEnd(row) {
      changeStatus({ conferenceId: row.id, status: "2" }).then(response => {
        if (response.data.data) {
          notifySuccess(this, "操作成功");
          this.getList();
        } else {
          notifyFail(this, "操作失败");
        }
      });
    },
    closeMoule() {
      this.dialogRecordVisible = false;
      this.getList();
    },
    download(id) {
      downloadFile(id).then(res => {
        exportExcel(res);
      });
    }
  }
};
</script>
