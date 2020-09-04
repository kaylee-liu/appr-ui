<template>
  <div class="TaskAnnouncement">
    <spinner-loading v-if="listLoading" />

    <!-- 发布任务 -->
    <el-form
      :model="numberValidateForm"
      :rules="rules"
      ref="numberValidateForm"
      class="demo-ruleForm"
    >
      <div class="task-main">
        <!-- 添加任务 -->
        <div class="add">添加任务</div>
        <!-- 任务名 -->
        <el-form-item class="add-item" prop="name">
          <div class="taskname-top">
            <span class="taskname-toptext">{{$t('table.task.name')}}</span>
          </div>
          <el-input class="taskname" placeholder="请输入任务名称" v-model="numberValidateForm.name"></el-input>
        </el-form-item>
        <!-- 责任部门 -->
        <el-form-item class="add-item" prop="departId">
          <div class="taskname-top">
            <span class="taskname-toptext">{{$t('table.task.departId')}}</span>
          </div>
          <el-input
            v-model="numberValidateForm.departName"
            placeholder="请选择所属部门"
            @focus="dialogDeptVisible=true"
          />
          <input v-model="numberValidateForm.departId" type="hidden" />
        </el-form-item>
        <!-- 责任人 -->
        <el-form-item class="add-item" prop="personId">
          <div class="taskname-top">
            <span class="taskname-toptext">{{$t('table.task.personId')}}</span>
          </div>
          <!-- <el-select v-model="numberValidateForm.personId" placeholder="请选择责任人" class="taskname">

          </el-select>-->

          <el-input
            v-model="numberValidateForm.personName"
            placeholder="选择人员"
            @focus="handleSelectPerson"
            :readonly="true"
          />
          <input type="hidden" v-model="numberValidateForm.personId" />
        </el-form-item>
        <!-- 优先级 -->
        <el-form-item class="add-item" prop="priority">
          <div class="taskname-top">
            <span class="taskname-toptext">{{$t('table.task.priority')}}</span>
          </div>
          <el-select v-model="numberValidateForm.priority" placeholder="请选优先级" class="taskname">
            <el-option
              v-for="item in priorityList"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 任务类别 -->
        <el-form-item class="add-item" prop="category">
          <div class="taskname-top">
            <span class="taskname-toptext">{{$t('table.task.category')}}</span>
          </div>
          <el-select v-model="numberValidateForm.category" placeholder="请选择任务类型" class="taskname">
            <el-option
              v-for="item in options"
              :key="item.category"
              :label="item.label"
              :value="item.category"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 生效日期 -->
        <el-form-item class="add-item" prop="startTime">
          <span class="taskname-top taskname-toptext">{{$t('table.startTime')}}</span>
          <el-date-picker
            v-model="numberValidateForm.startTime"
            placeholder="提醒时间"
            type="date"
            class="taskname"
          ></el-date-picker>
        </el-form-item>
        <!-- 结束时间 -->
        <el-form-item class="add-item" prop="endTime">
          <span class="taskname-top taskname-toptext">{{$t('table.endTime')}}</span>
          <el-date-picker
            v-model="numberValidateForm.endTime"
            placeholder="请选择结束时间"
            type="date"
            class="taskname"
          ></el-date-picker>
        </el-form-item>

        <!-- 任务描述 -->
        <el-form-item class="describe" prop="description">
          <span class="tasktext">{{$t('table.task.description')}}</span>
          <el-input
            type="textarea"
            :rows="10"
            placeholder="请输入内容"
            v-model="numberValidateForm.description"
            class="text"
          ></el-input>
        </el-form-item>
      </div>
      <!-- 评分标准 -->
      <div class="scoring">
        <div class="standard">{{$t('table.score.name')}}</div>
        <!-- <el-form :model="numberValidateForm" ref="numberValidateForm" label-width="200px" class="demo-ruleForm"> -->
        <el-table
          :data="list"
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
      </div>

      <el-form-item class="btn">
        <div class="btnsite">
          <!-- 提交 -->
          <!--  @click="submitForm('numberValidateForm')"  -->
          <el-button type="primary" @click="submitForm" class="submit">{{$t('table.task.submit')}}</el-button>
          <!-- 取消 -->
          <el-button
            @click="resetForm('numberValidateForm')"
            class="cancel"
          >{{$t('table.task.cancel')}}</el-button>
          <!-- <el-button  class="cancel">取消</el-button> -->
        </div>
      </el-form-item>
    </el-form>
    <!-- 新增评分标准 弹出框 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="60%"
      top="10vh"
    >
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="right"
        label-width="100px"
        style="width: 90%;"
      >
        <!-- @cell-dblclick="handleUpdate"双击单元格实现编辑 -->
        <!--  @selection-change="handleSelectionChange"数据多选，多页选择数据回显，分页选择保存选中的数据 -->
        <!-- 获取当前的字段名和排序顺序，从而向接口请求排序后的报个数据 -->
        <!-- 评分标准 -->
        <!-- <el-table-column prop="name" :label="$t('table.score.name')" width="230">
          <el-form-item :label="$t('table.conference.code')" prop="code">
                <el-input v-model="temp.code" placeholder="会议室编码"/>
              </el-form-item>
        </el-table-column>-->
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
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <!-- <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button> -->
        <!-- 确认保存 -->

        <el-button
          type="primary"
          v-if="dialogStatus=='create'"
          @click="createData"
        >{{ $t('table.confirm') }}</el-button>
        <el-button type="primary" v-else @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
    
    <!-- 责任人列表 弹出框 -->
    <!-- 选择部门 -->
    <v-DeptCheck :deptVisible="dialogDeptVisible" @getDeptNodeData="getDeptNodeData" @closeDialog="closeDialog"></v-DeptCheck>

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
        :data="personList"
        highlight-current-row
        style="width: 100%;"
        @size-change="handleSizeChange"
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
  </div>
</template>

<script type="text/ecmascript-6">
import { addObj, getObj, putObj, delObj } from "@/api/appr/HomeTaskHall";
import { saveObj } from "@/api/appr/TaskAnnouncement";
import { fetchList as fetchPeopleList } from "@/api/admin/user";
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
import { async } from "q";
import DeptCheck from "@/components/DeptCheck/index";
export default {
  name: "TaskAnnouncement",
  components: {
    SpinnerLoading,
    "v-DeptCheck": DeptCheck
  },
  directives: {
    waves
  },
  created() {
    // this.getList()
    this.user_btn_add = this.permissions["sys:user:add"];
    // this.user_btn_edit = this.permissions['sys:user:edit']
    this.user_btn_del = this.permissions["sys:user:del"];
  },
  watch: {},
  computed: {
    ...mapGetters(["elements", "permissions"])
  },
  mounted() {
    // console.log(queryRecord(),getRecord(),456)
  },
  data() {
    return {
      options: [
        {
          category: "传播"
        },
        {
          category: "协调"
        },
        {
          category: "疏导"
        },
        {
          category: "维稳"
        }
      ],
      // 任务优先级选择
      priorityList: [
        { type: "1", name: "低" },
        { type: "2", name: "中" },
        { type: "3", name: "高" }
      ],
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        name: "",
        sort: "create_date",
        order: "descending"
      },
      personList: null,
      total: null,
      tasklist: [],
      listLoading: false,
      dialogFormVisible: false,
      dialogStatus: "",
      dialogDeptVisible: false,
      dialogRoleVisible: false,
      dialogImportVisible: false,
      dialogPersonVisible: false,
      user_btn_del: false,
      importUrl: "/api/user/v1/user/import",
      headers: {
        Authorization: "Bearer " + getToken()
      },
      uploading: false,
      percentage: 0,
      tempRadio: 0,
      downloadLoading: false,
      roleData: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },

      numberValidateForm: {
        // 责任人
        personId: "",
        personName: "",
        // 优先级
        priority: "",
        //  任务名类别
        category: "",
        //  任务名
        name: "",
        // 生效时间
        startTime: "",
        // 结束时间
        endTime: "",
        // 任务描述
        description: "",
        // 责任部门
        departName: "",
        departId: ""
      },

      tableKey: 0,
      list: [],
      temp: {
        id: "",
        name: "",
        min: "",
        unit: "",
        roleId: ""
      },

      textMap: {
        update: "编辑",
        create: "新建"
      },

      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "change" }],
        departId: [
          { required: true, message: "请选择责任部门", trigger: "change" }
        ],
        personId: [
          { required: true, message: "请选择责任人", trigger: "change" }
        ],
        startTime: [
          { required: true, message: "请选择开始时间", trigger: "change" }
        ],
        endTime: [
          { required: true, message: "请选择结束时间", trigger: "change" }
        ]
        // deptName: [{ required: true, message: "请选择承办单位", trigger: "change" }]
      }
    };
  },

  methods: {
    // 搜索页的
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 删除
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    // 提交
    submitForm() {
      //发第一个请求   确定是正确的  valadata.name .trim() ===false  return code 200  if（response.code = ==200）{
      // 写发送下一个的请求  收集表单数据
      // }
      this.$refs["numberValidateForm"].validate(valid => {
        if (valid) {
          console.log(valid, "valid");
          if (this.list.length <= 0) {
            notifyFail(this, "请填写评分标准！");
            return;
          }
          this.numberValidateForm.list = this.list;
          addObj(this.numberValidateForm).then(data => {
            messageSuccess(this, "操作成功");
            this.resetList();
            this.resetnumberValidateForm();
            this.$nextTick(() => {
              this.$refs["numberValidateForm"].resetFields();
            });
          });
        } else {
          console.log(valid, "error submit!!");
          return false;
        }
      });
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
    // 重置表单数据
    resetnumberValidateForm() {
      this.numberValidateForm = {
        // 责任人
        personId: "",
        personName: "",
        // 优先级
        priority: "",
        //  任务名类别
        category: "",
        //  任务名
        name: "",
        // 生效时间
        startTime: "",
        // 结束时间
        endTime: "",
        // 任务描述
        description: "",
        // 责任部门
        departName: "",
        departId: ""
      };
    },
    resetList() {
      this.list = [];
    },
    resetTemp() {
      this.temp = {
        id: "",
        name: "",
        min: "",
        unit: "",
        roleId: ""
      };
    },
    // 确定保存
    updateData() {
      this.temp.name = this.temp.name;
      // console.log('this.temp.name')
      this.temp.min = this.temp.min;
      this.temp.unit = this.temp.unit;
      this.temp.roleId = this.temp.roleId;
    },
    createData() {
      this.list.push(this.temp);
      this.dialogFormVisible = false;
    },
    // 新增
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    getDeptNodeData(data) {
      this.dialogDeptVisible = false;
      this.numberValidateForm.departId = data.id;
      this.numberValidateForm.departName = data.deptName;
    },
    closeDialog(val) {
      this.dialogDeptVisible = val;
    },
    // 打开责任人选择弹窗
    handleSelectPerson() {
      this.getPersonList();
      this.dialogPersonVisible = true;
    },
    // 点击选择责任人
    handleSelectPersonChange(val) {
      console.log(val);
      if (!!val) {
        this.dialogPersonVisible = false;
        this.numberValidateForm.personName = val.name;
        this.numberValidateForm.personId = val.id;
      }
    },
    // 获取人员列表
    getPersonList() {
      fetchPeopleList(this.listQuery).then(response => {
        // 人员列表
        this.personList = response.data.list;
        this.total = response.data.total;
      });
    },
    handleSizeChange(num) {
      this.listQuery.pageSize = num;
      this.getPersonList();
    },
    handleCurrentChange(num) {
      this.listQuery.pageNum = num;
      this.getPersonList();
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.app-main {
  background-color: #F0F2F5;
}

.TaskAnnouncement {
  background-color: #ffffff;
  color: #606266;
  margin: 20px;

  .demo-ruleForm {
    // background-color
    width: 100%;

    .task-main {
      width: 100%;
      height: 100%;
      // margin 20px
      padding: 20px;

      // background-color pink
      .add {
        width: 100%;
        box-sizing: border-box;
        height: 50px;
        line-height: 50px;
        border-bottom: 2px solid #EBEEF5;
        margin-bottom: 10px;
      }

      .add-item {
        margin-bottom: 10px;
        width: 31%;
        margin-right: 20px;
        display: inline-block;
        font-size: 14px;
        box-sizing: border-box;

        .taskname-top {
          display: flex;
          margin-bottom: 5px;
          // .taskname-toptext
          // margin-bottom 5px
        }

        .taskname {
          font-size: 14px;
          width: 100%;
        }
      }

      .describe {
        // position absolute
        font-size: 14px;

        .tasktext {
          display: block;
          margin-bottom: 5px;
        }

        .text {
          // position relative
          left: 0px;
          top: 0px;
          width: 100%;
          height: 200px;
        }
      }
    }

    .scoring {
      width: 100%;
      height: 100%;
      margin: 20px;
      padding: 20px;

      // background-color pink
      .standard {
        width: 100%;
        // display flex
        box-sizing: border-box;
        height: 50px;
        line-height: 50px;
        border-bottom: 2px solid #EBEEF5;
        margin-bottom: 10px;
      }

      // .demo-ruleForm
      // width 100%
      .newadd {
        width: 100%;
        // height 50px
        // line-height 50px
        // font-size 14px
        text-align: center;
        border: 1px dashed #EBEEF5;
        margin: 10px 0px;
      }
    }

    .btn {
      position: relative;
      border: 1px solid #EBEEF5;
      width: 100%;
      height: 70px;

      .btnsite {
        position: absolute;
        right: 50px;
        bottom: -50px;
        display: flex;
      }
    }
  }
}
</style>
