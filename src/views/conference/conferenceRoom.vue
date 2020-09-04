
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('table.conference.meetingRoom')"
        v-model="listQuery.name"
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
          v-for="item in roomStatusList"
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
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >{{ $t('table.add') }}</el-button>
    </div>
    <spinner-loading v-if="listLoading" />
    <el-table
      ref="multipleTable"
      :key="tableKey"
      :data="list"
      highlight-current-row
      style="width: 100%;"
      @cell-dblclick="handleUpdate"
    >
      <!-- @selection-change="handleSelectionChange"
      @sort-change="sortChange"-->
      <el-table-column type="selection" width="55" />
      <!-- 会议室 -->
      <el-table-column :label="$t('table.conference.meetingRoom')" min-width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <!-- 位置用途 -->
      <!-- <el-table-column :label="$t('table.conference.location')" min-width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.location }}{{ scope.row.typeName }}</span>
        </template>
      </el-table-column>-->
      <!-- 终端ip -->
      <el-table-column :label="$t('table.conference.ip')">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
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
      <!-- 隶属部门 -->
      <el-table-column :label="$t('table.conference.department')">
        <template slot-scope="scope">
          <span>{{ scope.row.deptName }}</span>
        </template>
      </el-table-column>
      <!-- 状态 -->
      <el-table-column :label="$t('table.status')">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusTypeFilter">{{ scope.row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <!-- 内置电视 -->
      <el-table-column :label="$t('table.conference.hasTv')" align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.hasTv == 1" class="el-icon-success"></i>
        </template>
      </el-table-column>
      <!-- 内置投影 -->
      <el-table-column :label="$t('table.conference.hasProjector')" align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.hasProjector == 1" class="el-icon-success"></i>
        </template>
      </el-table-column>
      <!-- 视频会议 -->
      <el-table-column :label="$t('table.conference.canVideo')" align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.canVideo == 1" class="el-icon-success"></i>
        </template>
      </el-table-column>
      <!-- 电话会议 -->
      <el-table-column :label="$t('table.conference.canTelephone')" align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.canTelephone == 1" class="el-icon-success"></i>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('table.actions')">
        <template slot-scope="scope">
          <!-- 如果有编辑权限就显示 -->
          <!-- <el-button v-if="user_btn_edit" type="text"  @click="handleUpdate(scope.row)" icon="el-icon-edit">{{ $t('table.edit') }}</el-button> -->
          <el-button type="text" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button type="text" @click="handleDelete(scope.row)">{{ $t('table.delete') }}</el-button>
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

    <!-- 新增会议室 弹出框 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="60%"
      top="10vh"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
        style="width: 90%;"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('table.id')" prop="id">
              <el-input v-model="temp.id" :readonly="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('table.conference.code')" prop="code">
              <el-input v-model="temp.code" placeholder="会议室编码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('table.conference.meetingRoom')" prop="name">
              <el-input v-model="temp.name" placeholder="会议室名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('table.conference.ip')" prop="ip">
              <el-input v-model="temp.ip" placeholder="终端ip" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <!-- TO-DO -->
            <el-form-item :label="$t('table.ownDept')" prop="deptName">
              <el-input
                v-model="temp.deptName"
                placeholder="请选择所属部门"
                @focus="handleSelectDept"
                :readonly="true"
              />
              <input v-model="temp.departId" type="hidden" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- TO-DO -->
            <!-- 先使用静态选择，后面再改成从字典里面取值 -->
            <el-form-item :label="$t('table.type')">
              <el-select
                v-model="temp.type"
                :placeholder="$t('table.select')"
                style="width: 140px"
                class="filter-item"
              >
                <el-option
                  v-for="item in roomTypeList"
                  :key="item.type"
                  :label="item.name"
                  :value="item.type"
                />
              </el-select>

              <!-- <el-radio-group v-model="temp.type">
                <el-radio :label="1">U型</el-radio>
                <el-radio :label="2">回型</el-radio>
                <el-radio :label="3">剧场</el-radio>
                <el-radio :label="4">课桌</el-radio>
                <el-radio :label="5">围桌</el-radio>
                <el-radio :label="6">T型</el-radio>
              </el-radio-group>-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('table.startTime')" prop="startTime">
              <el-time-picker
                v-model="temp.startTime"
                type="time"
                format="HH:mm"
                value-format="timestamp"
                placeholder="开始时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('table.endTime')" prop="endTime">
              <el-time-picker
                v-model="temp.endTime"
                type="time"
                format="HH:mm"
                value-format="timestamp"
                placeholder="结束时间"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('table.conference.device')">
              <el-checkbox
                :label="$t('table.conference.hasTv')"
                true-label="1"
                v-model="temp.hasTv"
              ></el-checkbox>
              <el-checkbox
                :label="$t('table.conference.hasProjector')"
                true-label="1"
                v-model="temp.hasProjector"
              ></el-checkbox>
              <el-checkbox
                :label="$t('table.conference.canVideo')"
                true-label="1"
                v-model="temp.canVideo"
              ></el-checkbox>
              <el-checkbox
                :label="$t('table.conference.canTelephone')"
                true-label="1"
                v-model="temp.canTelephone"
              ></el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('table.conference.capacity')">
              <el-input-number
                v-model="temp.capacity"
                controls-position="right"
                :min="1"
                style="width: 140px"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('table.status')">
              <el-select
                v-model="temp.status"
                :placeholder="$t('table.select')"
                style="width: 140px"
                class="filter-item"
              >
                <el-option
                  v-for="item in roomStatusList"
                  :key="item.type"
                  :label="item.name"
                  :value="item.type"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('table.remark')">
              <el-input
                :autosize="{ minRows: 2, maxRows: 4}"
                v-model="temp.remarks"
                type="textarea"
                placeholder="备注"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          v-if="dialogStatus=='create'"
          type="primary"
          @click="createData"
        >{{ $t('table.confirm') }}</el-button>
        <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <!-- 部门列表 -->
    <v-DeptCheck
      :deptVisible="dialogDeptVisible"
      @getDeptNodeData="getDeptNodeData"
      @closeDialog="closeDialog"
    ></v-DeptCheck>
  </div>
</template>

<script>
import {
  fetchList,
  addObj,
  getObj,
  putObj,
  delObj
} from "@/api/appr/conferenceRoom";
import waves from "@/directive/waves";
import { mapGetters } from "vuex";
import { getToken } from "@/utils/auth";
import { fetchTree } from "@/api/admin/dept";
import {
  checkMultipleSelect,
  isNotEmpty,
  notifySuccess,
  notifyFail,
  messageSuccess,
  formatDate
} from "@/utils/util";
import SpinnerLoading from "@/components/SpinnerLoading";
import DeptCheck from "@/components/DeptCheck";

export default {
  name: "ConferenceRoom",
  components: {
    SpinnerLoading,
    "v-DeptCheck": DeptCheck
  },
  directives: {
    waves
  },
  filters: {
    statusTypeFilter(status) {
      const statusTypeMap = {
        0: "danger",
        1: "success",
        2: "danger"
      };
      return statusTypeMap[status];
    },
    statusFilter(status) {
      const statusMap = {
        0: "不可用",
        1: "可用",
        2: "维修中"
      };
      return statusMap[status];
    },
    timeFilter(time) {
      return formatDate(new Date(time), "hh:mm");
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
        name: undefined,
        sort: "create_time",
        order: "descending"
      },
      // 表单初始化数据
      temp: {
        id: "",
        code: "",
        name: "",
        ip: "",
        departId: "",
        type: "",
        startTime: null,
        endTime: null,
        hasTv: null,
        hasProjector: null,
        canVideo: null,
        canTelephone: null,
        capacity: "",
        status: null,
        remarks: ""
      },
      tempRole: null,
      dialogFormVisible: false,
      dialogDeptVisible: false,
      dialogRoleVisible: false,
      dialogImportVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新建"
      },
      rules: {
        code: [{ required: true, message: "请输入编号", trigger: "change" }],
        name: [{ required: true, message: "请输入名称", trigger: "change" }],
        ip: [{ required: true, message: "请输入ip", trigger: "change" }]
      },
      downloadLoading: false,
      roleData: [],

      // 会议室状态选择
      roomStatusList: [
        { type: "0", name: "不可用" },
        { type: "1", name: "可用" },
        { type: "2", name: "维修中" }
      ],

      // 会议室类型选择
      roomTypeList: [
        { type: "1", name: "U型" },
        { type: "2", name: "回型" },
        { type: "3", name: "剧场" },
        { type: "4", name: "课桌" },
        { type: "5", name: "围桌" },
        { type: "6", name: "T型" }
      ],
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
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
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
    handleModifyStatus(row, status) {
      row.status = status;
      putObj(row).then(() => {
        this.dialogFormVisible = false;
        messageSuccess(this, "操作成功");
      });
    },
    // 重置表单数据
    resetTemp() {
      this.temp = {
        id: "",
        code: "",
        name: "",
        ip: "",
        departId: "",
        deptName: "",
        type: "",
        startTime: null,
        endTime: null,
        hasTv: null,
        hasProjector: null,
        canVideo: null,
        canTelephone: null,
        capacity: "",
        status: null,
        remarks: ""
      };
    },

    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    //选择部门
    handleSelectDept() {
      this.dialogDeptVisible = true;
    },

    getDeptNodeData(data) {
      this.dialogDeptVisible = false;
      this.temp.departId = data.id;
      this.temp.deptName = data.deptName;
    },

    closeDialog(val) {
      this.dialogDeptVisible = val;
    },

    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          addObj(this.temp).then(() => {
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.getList();
            notifySuccess(this, "创建成功");
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.readonly = true;
      this.dialogStatus = "update";
      if (isNotEmpty(this.temp.roleList) && this.temp.roleList.length > 0) {
        this.tempRole = this.temp.roleList[0];
        this.temp.roleId = this.tempRole.id;
        this.temp.roleName = this.tempRole.roleName;
        this.temp.role = [].concat(this.temp.roleId);
      }
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          putObj(tempData, tempData.id).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            notifySuccess(this, "更新成功");
          });
        }
      });
    },
    handleDelete(row) {
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
    }
  }
};
</script>
