<template>
  <div class="app-container">
    <spinner-loading v-if="listLoading" />

    <el-row>
      <el-col :span="16" style="margin-top:10px;">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="right"
          label-width="100px"
          style="width: 90%;"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('table.conference.subject')" prop="subject">
                <el-input v-model="temp.subject" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('table.conference.timeRange')" prop="timeRange">
                <el-date-picker
                  v-model="temp.timeRange"
                  type="datetimerange"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  :default-time="['09:00:00', '18:00:00']"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <!-- 点击弹出选择会议室窗口 -->
              <el-form-item :label="$t('table.conference.meetingRoom')" prop="roomId">
                <el-input
                  v-model="temp.roomName"
                  placeholder="选择会议室"
                  @focus="handleSelectRoom"
                  :readonly="true"
                />
                <input type="hidden" v-model="temp.roomId" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <!-- 点击弹出选择人员窗口 -->
              <el-form-item :label="$t('table.conference.host')" prop="personId">
                <el-input
                  v-model="temp.host"
                  placeholder="选择人员"
                  @focus="handleSelectPerson"
                  :readonly="true"
                />
                <input type="hidden" v-model="temp.personId" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- TO-DO -->
              <el-form-item :label="$t('table.conference.organizer')" prop="deptName">
                <el-input
                  v-model="temp.deptName"
                  placeholder="请选择部门"
                  @focus="handleSelectDept"
                  :readonly="true"
                />
                <input v-model="temp.departId" type="hidden" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('table.conference.repeatType')">
                <el-radio-group v-model="temp.repeatType">
                  <el-radio :label="1">单次会议</el-radio>
                  <el-radio :label="2">每周固定会议</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('table.conference.content')" prop="content">
                <el-input
                  :autosize="{ minRows: 6, maxRows: 8}"
                  v-model="temp.content"
                  type="textarea"
                  placeholder="输入会议内容"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <!-- 多选人员 -->
              <el-form-item :label="$t('table.conference.participant')" prop="personId">
                <el-input
                  v-model="temp.participants"
                  placeholder="选择人员"
                  @focus="handleSelectPersons"
                  :readonly="true"
                />
                <input type="hidden" v-model="temp.participantIds" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <!-- 设置是否公开，默认不公开 -->
              <el-form-item :label="$t('table.conference.setting')">
                <el-checkbox
                  :label="$t('table.conference.notOpen')"
                  true-label="0"
                  false-label="1"
                  v-model="temp.isOpen"
                ></el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="end">
            <el-col :span="6">
              <el-button @click="resetForm">{{ $t('table.cancel') }}</el-button>
              <el-button type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <el-col :span="8" style="margin-top:10px;"></el-col>
    </el-row>

    <!-- 选择会议室 -->
    <el-dialog
      :title="$t('table.conference.availableRoom') + ' (' +$t('table.conference.lastTime') + ': '+ currentTime +')'"
      :visible.sync="dialogRoomVisible"
      width="70%"
    >
      <div v-for="(groupedRoom,index) in groupedRoomList" :key="index">
        <el-row>
          <el-col :span="5" :offset="1" v-for="(item,index) in groupedRoom" :key="index">
            <el-card :body-style="{ padding: '0px' }" style="cursor: pointer; margin:0 0 20px 0; ">
              <div class="cardContent">
                <span class="roomName">{{ item.name }}</span>
                <span class="capacity">1-{{ item.capacity }}人</span>
              </div>
              <div class="cardContent">
                <p>{{$t('table.conference.mediaDevice')}} :</p>
                <div class="mediaIcons">
                  <!-- <img v-if="item.hasTv == 1" src class="image" alt="电视" title="电视" />
                  <img v-if="item.hasProjector == 1" src class="image" alt="投影" title="投影" />
                  <img v-if="item.canVideo == 1" src class="image" alt="视频会议" title="视频会议" />
                  <img v-if="item.canTelephone == 1" src class="image" alt="电话会议" title="电话会议" />-->
                  <i v-if="item.hasTv == 1" class="el-icon-monitor" alt="电视" title="电视"></i>
                  <i
                    v-if="item.hasProjector == 1"
                    class="el-icon-data-analysis"
                    alt="投影"
                    title="投影"
                  ></i>
                  <i v-if="item.canVideo == 1" class="el-icon-video-camera" alt="视频会议" title="视频会议"></i>
                  <i
                    v-if="item.canTelephone == 1"
                    class="el-icon-microphone"
                    alt="电话会议"
                    title="电话会议"
                  ></i>
                </div>
              </div>
              <div class="action clearfix" @click="getSelectedRoom(item)">
                <span>{{$t('table.conference.orderNow')}}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <!-- 部门列表 -->
    <v-DeptCheck
      :deptVisible="dialogDeptVisible"
      @getDeptNodeData="getDeptNodeData"
      @closeDialog="closeDialog"
    ></v-DeptCheck>

    <!-- 人员列表 单选 -->
    <el-dialog :title="$t('table.select')" :visible.sync="dialogPersonVisible">
      <div class="filter-container">
        <el-input
          placeholder="请输入项目名称"
          v-model="listQuery.name"
          style="width: 200px;"
          @keyup.enter.native="getPersonList"
        />
        <el-button
          v-waves
          type="primary"
          icon="el-icon-search"
          @click="getPersonList"
        >{{ $t('table.search') }}</el-button>
      </div>
      <el-table
        ref="singleTable"
        :key="personTableKey"
        :data="personList"
        highlight-current-row
        style="width: 100%;"
        @current-change="handleSelectPersonChange"
      >
        <el-table-column :label="$t('login.identifier')" min-width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.identifier }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.name')" min-width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.sex')">
          <template slot-scope="scope">
            <span>{{ scope.row.sex | sexFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.ownDept')">
          <template slot-scope="scope">
            <span>{{ scope.row.deptName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.phone')">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
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
    </el-dialog>

    <!-- 人员列表 多选 -->
    <el-dialog :title="$t('table.select')" :visible.sync="dialogPersonsVisible" @open="openDialog">
      <div class="filter-container">
        <el-input
          placeholder="请输入项目名称"
          v-model="listQuery.name"
          style="width: 200px;"
          @keyup.enter.native="getPersonList"
        />
        <el-button
          v-waves
          type="primary"
          icon="el-icon-search"
          @click="getPersonList"
        >{{ $t('table.search') }}</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :key="personsTableKey"
        :data="personList"
        highlight-current-row
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column :label="$t('login.identifier')" min-width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.identifier }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.name')" min-width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.sex')">
          <template slot-scope="scope">
            <span>{{ scope.row.sex | sexFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.ownDept')">
          <template slot-scope="scope">
            <span>{{ scope.row.deptName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.phone')">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
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

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleSelectPersons">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="confirmSelectPersons">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchPageList,
  addObj,
  getObj,
  putObj,
  delObj
} from "@/api/appr/conference";
import {
  fetchList as fetchRoomList,
  verifyAvailable
} from "@/api/appr/conferenceRoom";
import { fetchList as fetchPeopleList } from "@/api/admin/user";
import waves from "@/directive/waves";
import { mapGetters } from "vuex";
import { fetchTree } from "@/api/admin/dept";
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
import DeptCheck from "@/components/DeptCheck/index";
export default {
  name: "ConferenceApply",
  components: {
    SpinnerLoading,
    "v-DeptCheck": DeptCheck
  },
  directives: {
    waves
  },
  filters: {
    timeFilter(time) {
      return formatDate(new Date(time), "yyyy-MM-dd hh:mm");
    },
    sexFilter(type) {
      const sexMap = {
        0: "男",
        1: "女"
      };
      return sexMap[type];
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
      personTableKey: 0,
      personsTableKey: 1,
      personList: null,
      total: null,
      listLoading: false,

      listQuery: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        sort: "create_date",
        order: "descending"
      },

      temp: {
        subject: "",
        timeRange: "",
        startTime: null,
        endTime: null,
        roomName: "",
        roomId: "",
        host: "",
        personId: "",
        departId: "",
        participants: "",
        participantIds: "",
        repeatType: 1,
        content: "",
        isOpen: "0"
      },

      // 可用会议室
      roomList: [],

      // 分组好的会议室
      groupedRoomList: [],

      currentTime: formatDate(new Date(), "yyyy-MM-dd hh:mm"),

      // 已选人员数组
      multipleSelection: [],

      // 已选人员数组拷贝
      tempSet: [],

      // 是否弹窗打开
      isOpenDialog: false,

      rules: {
        subject: [{ required: true, message: "请输入名称", trigger: "change" }],
        timeRange: [
          { required: true, message: "请选择会议时间", trigger: "change" }
        ],
        roomId: [
          { required: true, message: "请选择会议室", trigger: "change" }
        ],
        personId: [
          { required: true, message: "请选择主持人", trigger: "change" }
        ]
        // deptName: [{ required: true, message: "请选择承办单位", trigger: "change" }]
      },
      downloadLoading: false,
      dialogRoomVisible: false,
      dialogDeptVisible: false,
      dialogPersonVisible: false,
      dialogPersonsVisible: false,
      treeDeptData: [],
      roleData: [],
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
    // 获取可用会议室
    this.getRoomList();
  },
  computed: {
    ...mapGetters(["elements", "permissions"])
  },
  methods: {
    // 获取当前时间
    getCurrentTime() {
      return formatDate(new Date(), "yyyy-MM-dd hh:mm");
    },

    // 获取可用会议室列表
    getRoomList() {
      let params = {
        pageNum: 1,
        pageSize: 100,
        status: 1
      };

      fetchRoomList(params).then(response => {
        this.roomList = response.data.list;

        // 数据分为四个一组
        this.groupedRoomList = [];
        for (var i = 0, len = this.roomList.length; i < len; i += 4) {
          this.groupedRoomList.push(this.roomList.slice(i, i + 4));
        }
      });
    },

    // 获取人员列表
    getPersonList() {
      fetchPeopleList(this.listQuery).then(response => {
        // 人员列表
        this.personList = response.data.list;
        this.total = response.data.total;
      });
    },
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.getPersonList();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getPersonList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getPersonList();
    },
    handleModifyStatus(row, status) {
      row.status = status;
      putObj(row).then(() => {
        this.dialogFormVisible = false;
        messageSuccess(this, "操作成功");
      });
    },
    resetTemp() {
      this.temp = {
        subject: "",
        timeRange: "",
        roomName: "",
        roomId: "",
        host: "",
        personId: "",
        departId: "",
        participants: "",
        participantIds: "",
        repeatType: 1,
        content: "",
        isOpen: "0"
      };
    },
    handleCreate() {
      this.role = [];
      this.roleData = [];
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    // 重置表单
    resetForm() {},

    createData() {
      this.$refs["dataForm"].validate(valid => {
        console.log(this.temp);
        if (valid) {
          if (this.temp.timeRange && this.temp.timeRange.length == 2) {
            this.temp.startTime = this.temp.timeRange[0];
            this.temp.endTime = this.temp.timeRange[1];
          }

          addObj(this.temp).then(() => {
            notifySuccess(this, "申请成功");
            this.$router.push("/conference/conferenceList");
          });
        }
      });
    },

    handleSelectRoom() {
      if (this.temp.timeRange && this.temp.timeRange.length == 2) {
        this.dialogRoomVisible = true;
      } else {
        this.$message.error("请先选择日期");
      }
    },

    // 预定会议室点击事件处理
    getSelectedRoom(row) {
      // 这里需要验证所选时段下该会议室是否被其它未取消的会议占用
      // 如果被占用，提示出会议时间
      // 此处不应显示会议名称，有信息泄露风险
      let startTimeString = formatDate(
        this.temp.timeRange[0],
        "yyyy/MM/dd hh:mm:ss"
      );
      let endTimeString = formatDate(
        this.temp.timeRange[1],
        "yyyy/MM/dd hh:mm:ss"
      );

      verifyAvailable(row.id, startTimeString, endTimeString).then(response => {
        console.log(response);
        if (response.data) {
          this.$message({
            dangerouslyUseHTMLString: true,
            message:
              "<strong>所选会议室已被其它会议预订</strong><p><strong>会议时间：" +
              response.data +
              "</strong></p>",
            type: "error",
            duration: 5000
          });
        } else {
          this.temp.roomName = row.name;
          this.temp.roomId = row.id;
          this.dialogRoomVisible = false;
        }
      });
    },

    //选择部门
    handleSelectDept() {
      fetchTree().then(response => {
        this.treeDeptData = response.data;
        this.dialogDeptVisible = true;
      });
    },

    getDeptNodeData(data) {
      this.dialogDeptVisible = false;
      this.temp.departId = data.id;
      this.temp.deptName = data.deptName;
    },

    closeDialog(val) {
      this.dialogDeptVisible = val;
    },

    // 选择单个人员弹窗
    handleSelectPerson() {
      console.log(this.dialogPersonVisible);
      this.listQuery.name = "";
      this.getPersonList();
      this.dialogPersonVisible = true;
    },

    // 点击选择人员
    handleSelectPersonChange(val) {
      console.log(val);
      if (!!val) {
        this.dialogPersonVisible = false;
        this.temp.host = val.name;
        this.temp.personId = val.id;
      }
    },

    // 多选人员弹窗
    handleSelectPersons() {
      this.listQuery.name = "";
      this.getPersonList();
      this.dialogPersonsVisible = true;

      console.log("handleSelectPersons");
      console.log(this.multipleSelection);

      console.log(this.personList);
    },

    // 弹窗打开事件回调
    openDialog() {
      this.isOpenDialog = true;
    },

    // 点击多选人员
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;

      // 人员回显
      // 判断是否是打开弹窗
      // 因为ele ui的弹出表格会默认清空选择状态，所以采用了这个比较迂回的办法

      if (this.isOpenDialog) {
        this.multipleSelection.forEach(row => {
          if (!this.tempSet.includes(row.id)) {
            this.tempSet.push(row.id);
          }
        });

        if (this.tempSet.length > 0) {
          this.personList.forEach((row, index) => {
            this.$refs.multipleTable.toggleRowSelection(
              this.personList[index],
              this.tempSet.includes(row.id)
            );
          });
        }

        this.isOpenDialog = false;
      } else {
        this.tempSet = [];
        this.multipleSelection.forEach(row => {
          this.tempSet.push(row.id);
        });
      }

      // 显示人员姓名
      let participantNames = [];

      this.multipleSelection.forEach(row => {
        if (!participantNames.includes(row.name)) {
          participantNames.push(row.name);
        }
      });

      this.temp.participantIds = this.tempSet.join(",");
      this.temp.participants = participantNames.join("， ");
    },

    // 取消选择多选人员
    cancleSelectPersons() {
      this.dialogPersonsVisible = false;
      this.multipleSelection = [];
    },

    // 确认多选人员
    confirmSelectPersons() {
      this.dialogPersonsVisible = false;
    }
  }
};
</script>

<style>
.cardContent {
  margin: 15px;
}

.cardContent span {
  font-size: 16px;
}

.roomName {
  font-weight: 600;
}

.cardContent p {
  font-size: 13px;
}

.mediaIcons {
  height: 40px;
}

.mediaIcons i {
  color: #409eff;
  width: 30px;
  height: 30px;
  margin: 5px 0 0 0;
  font-size: 25px;
}

.capacity {
  float: right;
}

.action {
  height: 60px;
  width: 100%;
  text-align: center;
  background-image: url("../../../static/img/orderRoom_bg.png");
  background-color: #666699;
}

.action span {
  color: #ffffff;
  font-size: 16px;
  display: block;
  margin: 30px 0 0 0;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>
