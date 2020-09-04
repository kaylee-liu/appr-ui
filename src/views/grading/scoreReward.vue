<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('table.scoreReward.reason')"
        v-model="listQuery.reason"
        style="width: 200px;"
        class="filter-item"
      />
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
      :data="scoreRewardList"
      highlight-current-row
      style="width: 100%;"
    >
      <!-- 受奖人 -->
      <el-table-column :label="$t('table.scoreReward.recipientUserName')" min-width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.recipientUserName }}</span>
        </template>
      </el-table-column>
      <!-- 受奖部门 -->
      <el-table-column :label="$t('table.scoreReward.departName')">
        <template slot-scope="scope">
          <span>{{ scope.row.departName }}</span>
        </template>
      </el-table-column>
      <!-- 奖励时间 -->
      <el-table-column :label="$t('table.scoreReward.rewardTime')">
        <template slot-scope="scope">
          <span>{{ scope.row.rewardTime | timeFilter }}</span>
        </template>
      </el-table-column>
      <!-- 受奖理由 -->
      <el-table-column :label="$t('table.scoreReward.reason')">
        <template slot-scope="scope">
          <span>{{ scope.row.reason }}</span>
        </template>
      </el-table-column>
      <!-- 颁奖人员 -->
      <el-table-column :label="$t('table.scoreReward.rewardUserName')">
        <template slot-scope="scope">
          <span>{{ scope.row.rewardUserName }}</span>
        </template>
      </el-table-column>
      <!-- 分值 -->
      <el-table-column :label="$t('table.scoreReward.score')">
        <template slot-scope="scope">
          <el-rate v-model="scope.row.score" disabled></el-rate>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('table.actions')">
        <template slot-scope="scope">
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

    <!-- 新增积分奖励 弹出框 -->
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
            <el-form-item :label="$t('table.scoreReward.recipientUserName')">
              <el-input
                v-model="temp.recipientUserName"
                :readonly="true"
                @focus="handleSelectPerson"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('table.scoreReward.departName')">
              <el-input v-model="temp.departName" :readonly="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('table.scoreReward.rewardTime')">
              <el-date-picker v-model="temp.rewardTime" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('table.scoreReward.score')" prop="score">
              <el-rate v-model="temp.score"></el-rate>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('table.scoreReward.reason')">
              <el-input
                :autosize="{ minRows: 2, maxRows: 4}"
                v-model="temp.reason"
                type="textarea"
                placeholder="受奖理由"
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

    <!-- 人员列表 单选 -->
    <el-dialog :title="$t('table.select')" :visible.sync="dialogPersonVisible">
      <div class="filter-container">
        <el-input
          placeholder="请输入人员名称"
          v-model="personQuery.name"
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
          v-show="personTotal>0"
          :current-page="personQuery.pageNum"
          :page-sizes="[10,20,30,50]"
          :page-size="personQuery.pageSize"
          :total="personTotal"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange_person"
          @current-change="handleCurrentChange_person"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, addObj, putObj, delObj } from "@/api/appr/scoreReward";
import { fetchList as fetchPeopleList } from "@/api/admin/user";
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
  name: "scoreReward",
  components: {
    SpinnerLoading
  },
  directives: {
    waves
  },
  filters: {
    timeFilter(time) {
      return formatDate(new Date(time), "yyyy-MM-dd");
    },
  },
  data() {
    return {
      tableKey: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        reason: undefined,
        sort: "create_time",
        order: "descending"
      },
      personQuery: {
        pageNum: 1,
        pageSize: 10,
        name: "",
        sort: "create_date",
        order: "descending"
      },
      scoreRewardList: null,
      total: null,
      personTotal: null,
      listLoading: true,
      dialogFormVisible: false,
      dialogPersonVisible: false,
      textMap: {
        update: "编辑",
        create: "新建"
      },
      dialogStatus: "",
      temp: {
        recipientUserName: "",
        recipientId: "",
        departName: "",
        recipientDept: "",
        reason: "",
        score: "",
        rewardTime: ""
      },
      rules: {
        time: [{ required: true, message: "请输入受奖时间", trigger: "change" }]
        //name: [{ required: true, message: "请选择受奖人", trigger: "change" }],
        // score: [{ required: true, message: "请选择分数", trigger: "change" }]
      },
      personList: null
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取列表数据
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.scoreRewardList = response.data.list;
        this.total = response.data.total;
        setTimeout(() => {
          this.listLoading = false;
        }, 500);
      });
    },
    // 列表查询
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
    // 打开新增弹窗
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 重置表单数据
    resetTemp() {
      this.temp = {
        recipientUserName: "",
        recipientId: "",
        departName: "",
        recipientDept: "",
        reason: "",
        score: "",
        rewardTime: ""
      };
    },
    // 新增
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          addObj(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            notifySuccess(this, "创建成功");
          });
        }
      });
    },
    // 修改
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          debugger;
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
            this.getList();
          });
        })
        .catch(() => {});
    },
    // 获取人员列表
    getPersonList() {
      fetchPeopleList(this.personQuery).then(response => {
        // 人员列表
        this.personList = response.data.list;
        this.personTotal = response.data.total;
      });
    },
    handleSelectPerson() {
      this.getPersonList();
      this.dialogPersonVisible = true;
    },
    handleSizeChange_person(num) {
      this.personQuery.pageSize = num;
      this.getPersonList();
    },
    handleCurrentChange_person(num) {
      this.personQuery.pageNum = num;
      this.getPersonList();
    },
    handleSelectPersonChange(val) {
      console.log(val);
      if (!!val) {
        this.dialogPersonVisible = false;
        this.temp.recipientUserName = val.name;
        this.temp.recipientId = val.id;
        this.temp.departName = val.deptName;
        this.temp.recipientDept = val.deptId;
      }
    },
    // 修改按钮
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    }
  }
};
</script>

<style>
.el-rate {
  display: inline-block;
}
</style>