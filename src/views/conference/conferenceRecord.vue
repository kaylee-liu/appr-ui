<template>
  <div class="app-container" v-loading="listLoading">
    <el-steps :active="activeStep" finish-status="success">
      <el-step title="与会人员"></el-step>
      <el-step title="会议记录"></el-step>
      <el-step title="任务安排"></el-step>
    </el-steps>

    <!-- 步骤内容 -->
    <div v-if="activeStep == 0" class="stepContainer">
      <el-table
        ref="multipleTable"
        :key="tableKey"
        :data="personList"
        highlight-current-row
        style="width: 100%;"
        max-height="400"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="姓名" min-width="110">
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
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status | personStatusTypeFilter"
            >{{ scope.row.status | personStatusFilter }}</el-tag>
          </template>
        </el-table-column>
      </el-table>

      <div class="step_buttons">
        <el-button type="primary" @click="next">下一步</el-button>
      </div>
    </div>
    <div v-if="activeStep == 1" class="stepContainer">
      <el-form
        ref="recordForm"
        :model="recordTemp"
        label-position="right"
        label-width="100px"
        style="width: 90%;"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="会议记录">
              <el-input
                :autosize="{ minRows: 4, maxRows: 6}"
                v-model="recordTemp.records"
                type="textarea"
                placeholder="请输入会议记录"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="会议纪要">
              <el-input
                :autosize="{ minRows: 4, maxRows: 6}"
                v-model="recordTemp.outline"
                type="textarea"
                placeholder="请输入会议纪要"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-upload
              :action="uploadUrl"
              :headers="headers"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :on-success="handleUploadSuccess"
              :before-upload="beforeUploadUpload"
              :on-progress="handleUploadProgress"
              multiple
              :limit="10"
              :file-list="fileList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">单文件不能超过50MB</div>
            </el-upload>
          </el-col>
        </el-row>
      </el-form>

      <div class="step_buttons">
        <el-button @click="previous">返回</el-button>
        <el-button type="primary" @click="next">下一步</el-button>
      </div>
    </div>
    <div v-if="activeStep == 2" class="stepContainer">
      <!-- 操作按钮栏 -->
      <el-row>
        <!-- <el-col :span="10">
            <span style="color:#f00">*</span>任务集计划完成时间:&nbsp;&nbsp;
            <el-date-picker v-model="recordTemp.completeTime" type="date" placeholder="选择日期">
            </el-date-picker>
        </el-col>-->
        <el-col :span="6">
          <el-button type="primary" @click="showCreateTaskDialog">添加任务</el-button>
          <!-- <el-button type="primary" @click="showSelectTaskDialog">选择任务</el-button> -->
        </el-col>
      </el-row>
      <!-- 已选任务列表 -->
      <el-table
        ref="selectedTaskTable"
        :data="selectedTaskList"
        highlight-current-row
        style="width: 100%;"
      >
        <!-- 任务名 -->
        <el-table-column label="任务名称" min-width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <!-- 负责部门 -->
        <el-table-column label="责任部门" min-width="110">
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

        <!-- 操作 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDeleteTask(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="step_buttons">
        <el-button @click="previous">返回</el-button>
        <el-button type="primary" @click="saveRecord">保存</el-button>
      </div>
    </div>

    <!-- 选择任务列表弹窗 -->
    <el-dialog title="选择任务" :visible.sync="dialogTaskListVisible" append-to-body>
      <el-table
        ref="taskTable"
        :data="taskList"
        highlight-current-row
        style="width: 100%;"
        max-height="400"
        @selection-change="handleTaskSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <!-- 任务名 -->
        <el-table-column label="任务名称" min-width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <!-- 负责部门 -->
        <el-table-column label="责任部门" min-width="110">
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
        <el-button @click="cancleSelectTasks">取消</el-button>
        <el-button type="primary" @click="confirmSelectTasks">确定</el-button>
      </div>
    </el-dialog>

    <!-- 新增任务任务列表弹窗 -->
    <el-dialog title="新增任务" :visible.sync="dialogTaskVisible" width="60%" append-to-body>
      <el-form
        ref="taskDataForm"
        :model="taskTemp"
        label-position="right"
        label-width="100px"
        style="width: 100%;"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="任务名称" prop="name">
              <el-input v-model="taskTemp.name" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="责任部门" prop="departId">
              <el-input
                v-model="taskTemp.departName"
                placeholder="选择部门"
                @focus="handleSelectDepart"
                :readonly="true"
              />
              <input type="hidden" v-model="taskTemp.departId" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="责任人" prop="personId">
              <el-input
                v-model="taskTemp.personName"
                placeholder="选择人员"
                @focus="handleSelectPerson"
                :readonly="true"
              />
              <input type="hidden" v-model="taskTemp.personId" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="优先级" prop="priority">
              <el-select
                v-model="taskTemp.priority"
                placeholder="请选择"
                style="width: 140px"
                class="filter-item"
              >
                <el-option
                  v-for="item in priorityList"
                  :key="item.type"
                  :label="item.name"
                  :value="item.type"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务类别" prop="category">
              <el-select
                v-model="taskTemp.category"
                placeholder="请选择"
                style="width: 140px"
                class="filter-item"
              >
                <el-option
                  v-for="item in categoryList"
                  :key="item.type"
                  :label="item.name"
                  :value="item.type"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="生效时间" prop="startTime">
              <el-date-picker v-model="taskTemp.startTime" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker v-model="taskTemp.endTime" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="任务描述">
              <el-input
                :autosize="{ minRows: 4, maxRows: 6}"
                v-model="taskTemp.description"
                type="textarea"
                placeholder="请输入会议纪要"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-table
              :data="taskTemp.list"
              style="width:100%"
              :header-cell-style="{background:'#FAFAFA',color:'#262626'}"
              ref="multipleTable"
              :key="tableKey"
              @selection-change="handleSelectionChange"
            >
              <!-- @cell-dblclick="handleUpdate"双击单元格实现编辑 -->
              <!--  @selection-change="handleSelectionChange"数据多选，多页选择数据回显，分页选择保存选中的数据 -->
              <!-- 获取当前的字段名和排序顺序，从而向接口请求排序后的报个数据 -->
              <!-- 评分标准 -->
              <el-table-column prop="name" :label="$t('table.score.name')"></el-table-column>
              <!-- 最低要求 -->
              <el-table-column prop="min" :label="$t('table.score.min')"></el-table-column>
              <!-- 评分单位 -->
              <el-table-column prop="unit" :label="$t('table.score.unit')"></el-table-column>
              <!-- 评分角色 -->
              <el-table-column prop="roleId" :label="$t('table.score.roleId')"></el-table-column>
              <!-- 操作 -->
              <el-table-column :label="$t('table.actions')">
                <!-- fixed="right" 列固定在右侧 -->
                <template slot-scope="scope">
                  <!-- 移除 -->
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, list)"
                    type="text"
                  >{{$t('table.task.record')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button v-waves @click="handleCreate" class="newadd">+新增评分标准</el-button>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTaskVisible = false">取消</el-button>
        <el-button type="primary" @click="createTaskData">确定</el-button>
      </div>

      <!-- 新增评分标准 弹出框 -->
      <el-dialog title="新增" :visible.sync="dialogPfVisible" append-to-body>
        <el-form
          ref="dataForm"
          :model="temp"
          label-position="right"
          label-width="100px"
          style="width: 90%;"
        >
          <el-row>
            <!-- 评分标准 -->
            <el-form-item :label="$t('table.score.name')" prop="name">
              <el-input v-model="temp.name" placeholder="请输入评分标准" />
            </el-form-item>
            <!-- 最低要求 -->
            <el-form-item :label="$t('table.score.min')" prop="min">
              <el-input v-model="temp.min" placeholder="请输入最低标准" />
            </el-form-item>
            <!-- 评分单位 -->
            <el-form-item :label="$t('table.score.unit')" prop="unit">
              <el-input v-model="temp.unit" placeholder="请输入评分单位" />
            </el-form-item>
            <!-- 评分角色 -->
            <el-form-item :label="$t('table.score.roleId')" prop="roleId">
              <el-input v-model="temp.roleId" placeholder="请输入评分角色" />
            </el-form-item>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <!-- 取消 -->
          <el-button @click="dialogPfVisible = false">{{ $t('table.cancel') }}</el-button>
          <el-button type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        </div>
      </el-dialog>

      <!-- 人员列表 单选 -->
      <el-dialog :title="$t('table.select')" :visible.sync="dialogPersonVisible" append-to-body>
        <div class="filter-container">
          <el-input
            placeholder="输入姓名"
            v-model="personListQuery.name"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="getPersonList"
          />
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="getPersonList"
          >{{ $t('table.query') }}</el-button>
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
            :current-page="personListQuery.pageNum"
            :page-sizes="[10,20,30,50]"
            :page-size="personListQuery.pageSize"
            :total="total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="addPersonSizeChange"
            @current-change="addPersonCurrentChange"
          />
        </div>
      </el-dialog>
    </el-dialog>

    <!-- 部门列表 -->
    <v-DeptCheck :deptVisible="dialogDepartVisible" @getDeptNodeData="getDepartNodeData" @closeDialog="closeDialog"></v-DeptCheck>
  </div>
</template>

<script>
import {
  getParticipantList,
  saveRecord,
  getConferenceInfo
} from "@/api/appr/conference";
import { pageList as getTaskList, addTask } from "@/api/appr/taskOriginal";
import { fetchList as fetchPeopleList } from "@/api/admin/user";
import Waves from "@/directive/waves";
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
import { log } from "util";
import DeptCheck from "@/components/DeptCheck/index";
export default {
  name: "ConferenceRecord",
  props: ["currentRowId"],
  components: {
    SpinnerLoading,
    "v-DeptCheck": DeptCheck
  },
  directives: {
    Waves
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
    },
    // 优先级转换
    priorityFilter(priority) {
      const priorityMap = {
        1: "低",
        2: "中",
        3: "高"
      };
      return priorityMap[priority];
    },
    // 人员状态转换
    personStatusTypeFilter(status) {
      const personStatusTypeMap = {
        0: "success",
        1: "danger"
      };
      return personStatusTypeMap[status];
    },
    // 人员状态转换
    personStatusFilter(status) {
      const personStatusMap = {
        0: "启用",
        1: "禁用"
      };
      return personStatusMap[status];
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
      // 激活的步骤
      activeStep: 0,

      // 与会人员tableKey
      tableKey: 0,

      // 会议任务tableKey
      taskTableKey: 1,

      // 人员tableKey
      personTableKey: 1,

      // 从后端获取的人员列表
      personList: null,
      total: null,

      listQuery: {},
      listLoading: true,
      personListQuery: {
        name: null,
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        sort: "create_date",
        order: "descending"
      },
      // 会议记录临时数组
      recordTemp: {
        records: "",
        outline: ""
        // completeTime: null
      },

      // 新增任务临时数组
      taskTemp: {
        list: []
      },

      // 可用会议室
      roomList: [],

      // 分组好的会议室
      groupedRoomList: [],

      currentTime: formatDate(new Date(), "yyyy-MM-dd hh:mm"),

      // 已选人员数组
      multipleSelection: [],

      // 文件上传路径
      uploadUrl: "/api/appr/appr/file/upload",
      // 请求头部授权标识
      headers: {
        Authorization: "Bearer " + getToken()
      },
      uploading: false,
      percentage: 0,
      // 文件上传列表
      fileList: [],

      // 后台获取的任务列表
      taskList: null,

      // 已勾选任务数组
      multipleTaskSelection: [],

      // 已安排任务列表
      selectedTaskList: [],

      // 选择任务窗口显示状态
      dialogTaskListVisible: false,

      // 新增任务窗口显示状态
      dialogTaskVisible: false,

      // 选择部门窗口显示状态
      dialogDepartVisible: false,

      // 选择人员窗口显示状态
      dialogPersonVisible: false,

      // 任务类型选择
      categoryList: [
        { type: "1", name: "传播" },
        { type: "2", name: "疏导" },
        { type: "3", name: "协调" },
        { type: "4", name: "维稳" }
      ],

      // 任务优先级选择
      priorityList: [
        { type: "1", name: "低" },
        { type: "2", name: "中" },
        { type: "3", name: "高" }
      ],
      // 记录回显信息
      conferenceInfo: "",
      // 添加任务时,记录评分标准
      temp: {
        name: "",
        min: "",
        unit: "",
        roleId: ""
      },
      dialogPfVisible: false
    };
  },
  created() {
    console.log("open conference record dialog");
    this.getParticipants();
    // this.conferenceInfo()
  },
  computed: {
    ...mapGetters(["elements", "permissions"])
  },
  methods: {
    // 上一步
    previous() {
      if (this.activeStep > 0) {
        this.activeStep--;
      }
    },
    // 下一步
    next() {
      if (this.activeStep < 2) {
        this.activeStep++;
      }
    },

    // 获取当前时间
    getCurrentTime() {
      return formatDate(new Date(), "yyyy-MM-dd hh:mm");
    },

    // step 0

    // 获取与会人员列表
    getParticipants() {
      if (this.currentRowId) {
        getParticipantList({ conferenceId: this.currentRowId }).then(
          response => {
            this.personList = response.data.list;
            getConferenceInfo(this.currentRowId).then(response => {
              this.conferenceInfo = response.data.data;
              this.conferenceInfo.persons.forEach(item => {
                this.personList.forEach(row => {
                  if (item.id === row.id) {
                    this.$refs.multipleTable.toggleRowSelection(row);
                  }
                });
              });
              this.recordTemp.records = this.conferenceInfo.conference.records;
              this.recordTemp.outline = this.conferenceInfo.conference.outline;
              this.fileList = this.conferenceInfo.manages;
              this.selectedTaskList = this.conferenceInfo.tasks;
              this.listLoading = false;
            });
          }
        );
      }
    },

    // 处理多选选择事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // step 1

    // 上传前
    beforeUploadUpload(file) {
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        this.$message.error("上传附件大小不能超过 50MB!");
      }
      return isLt50M;
    },
    handleUploadProgress(event, file, fileList) {
      this.uploading = true;
      this.percentage = parseInt(file.percentage.toFixed(0));
    },
    // 上传成功
    handleUploadSuccess(response, file, fileList) {
      this.fileList = fileList;
      this.uploading = false;
      notifySuccess(this, "上传成功");
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    resetTemp() {
      this.recordTemp = {
        records: "",
        outline: ""
      };
    },

    // step 2

    showSelectTaskDialog() {
      this.dialogTaskListVisible = true;
      this.getTasks();
    },

    showCreateTaskDialog() {
      this.dialogTaskVisible = true;
    },

    // 保存任务
    createTaskData() {
      this.$refs["taskDataForm"].validate(valid => {
        if (valid) {
          // 需要获取添加后的id
          this.taskTemp.tasksId = this.currentRowId;
          if (this.taskTemp.list.length <= 0) {
            notifyFail(this, "请填写评分标准！");
            return;
          }
          addTask(this.taskTemp).then(response => {
            console.log("response", response);
            this.selectedTaskList = response.data;
            this.dialogTaskVisible = false;
            notifySuccess(this, "创建成功");
          });
        }
      });
    },
    // 删除任务
    handleDeleteTask(row) {
      this.selectedTaskList.splice(row.$index, 1);
    },

    //选择部门弹窗
    handleSelectDepart() {
      this.dialogDepartVisible = true;
    },

    getDepartNodeData(data) {
      this.dialogDepartVisible = false;
      this.taskTemp.departId = data.id;
      this.taskTemp.departName = data.deptName;
    },
    closeDialog(val) {
      this.dialogDepartVisible = val;
    },

    // 选择单个人员弹窗
    handleSelectPerson() {
      this.getPersonList();
      this.dialogPersonVisible = true;
    },

    // 获取人员列表
    getPersonList() {
      fetchPeopleList(this.personListQuery).then(response => {
        // 人员列表
        this.personList = response.data.list;
        this.total = response.data.total;
      });
    },
    // 点击选择责任人
    handleSelectPersonChange(val) {
      console.log(val);
      if (!!val) {
        this.dialogPersonVisible = false;
        this.taskTemp.personName = val.name;
        this.taskTemp.personId = val.id;
      }
    },

    handlePersonSizeChange(val) {
      this.personListQuery.pageSize = val;
      this.getPersonList();
    },
    handlePersonChange(val) {
      this.personListQuery.pageNum = val;
      this.getPersonList();
    },

    // 获取任务列表
    getTasks() {
      if (this.currentRowId) {
        getTaskList().then(response => {
          this.taskList = response.data.list;
        });
      }
    },

    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getTasks();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getTasks();
    },
    addPersonSizeChange(val) {
      this.personListQuery.pageSize = val;
      this.getPersonList();
    },
    addPersonCurrentChange(val) {
      this.personListQuery.pageNum = val;
      this.getPersonList();
    },

    // 点击多选任务
    handleTaskSelectionChange(val) {
      console.log(val);
      this.multipleTaskSelection = val;
    },

    // 取消多选任务
    cancleSelectTasks() {
      this.dialogTaskListVisible = false;
      this.multipleTaskSelection = [];
    },

    // 确认多选任务
    // 合并已选和现选的列表
    confirmSelectTasks() {
      this.dialogTaskListVisible = false;
      let tempArray = [...this.multipleTaskSelection, ...this.selectedTaskList];
      console.log("this.multipleTaskSelection", this.multipleTaskSelection);
      console.log("selectedTaskList", this.selectedTaskList);
      console.log("tempArray", tempArray);
      this.selectedTaskList = Array.from(new Set(tempArray)); //or this.selectedTaskList = [...new Set(tempArray)]

      console.log("selectedTaskList", this.selectedTaskList);
    },

    // 添加任务时,设置评分
    // 新增
    handleCreate() {
      this.resetTemp();
      this.dialogPfVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    resetTemp() {
      this.temp = {
        name: "",
        min: "",
        unit: "",
        roleId: ""
      };
    },
    createData() {
      this.taskTemp.list.push(this.temp);
      this.dialogPfVisible = false;
    },
    // 保存会议记录
    saveRecord() {
      // 实际与会人员id数组
      let signInIdSet = this.multipleSelection.map(v => {
        return v.id;
      });
      // 上传附件id数组
      let fileIdSet = this.fileList.map(f => {
        if (!!f.response) {
          return f.response.data;
        } else {
          return f.id;
        }
      });

      // 选择的任务id数组
      let selectedTaskIdSet = this.selectedTaskList.map(x => {
        return x.id;
      });

      console.log("selectedTaskIdSet", selectedTaskIdSet);

      let record = {
        conferenceId: this.currentRowId,
        signInIdSet: signInIdSet,
        fileIdSet: fileIdSet,
        recordTemp: this.recordTemp,
        selectedTaskIdSet: selectedTaskIdSet
      };
      record = JSON.stringify(record);
      // 以json字符串的形式将数据传入后台，后台再解析出数据
      saveRecord(window.btoa(encodeURIComponent(record))).then(response => {
        console.log("response", response);
        this.$message({
          message: "保存成功",
          type: "success"
        });
        this.$emit("closeMoule");
      });
    }
  },
  watch: {
  }
};
</script>

<style scoped>
.app-container {
  padding-top: 0;
}

.el-steps {
  margin: 0 0 20px 0;
}

.step_buttons {
  width: 100%;
  margin: 20px 0 0 0;
  text-align: center;
}

.stepContainer {
  margin: 10px 0 0 0;
}

.newadd {
  width: 100%;
  text-align: center;
  border: 1px dashed #ebeef5;
  margin: 10px 0px;
}
</style>
