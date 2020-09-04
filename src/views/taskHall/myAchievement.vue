<template>
  <div class="achievement">
    <!-- 例会情况 -->
    <div class="scoring">
      <div class="standard">
        <span style="font-weight:700">例会情况</span>
        <span style="margin-left:20px;font-size:18px;color:red">共计评分 {{ meetingTemp.myScore }} 分</span>
      </div>
      <div class="filter-container">
        <el-input
          placeholder="例会主题"
          v-model="meetingTemp.listQuery.subject"
          style="width: 200px;"
          class="filter-item"
        />

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
          @click="getMeetingList"
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
            <el-rate v-model="scope.row.score" disabled></el-rate>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click.native.prevent="openConference(scope.row)" type="text">修改</el-button>
            <el-button @click.native.prevent="delConference(scope.row)" type="text">移除</el-button>
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
      <el-button @click="addDomain()" class="newadd">+新增例会</el-button>
    </div>

    <!-- 数据共享 -->
    <div class="datasharing">
      <div class="datasharing-title">
        <span style="font-weight:700">数据共享</span>
        <span style="margin-left:20px;font-size:18px;color:red">共计评分 {{ dataShareTemp.myScore }} 分</span>
      </div>
      <!-- {{scope.row.filename}} -->
      <el-table :data="dataShareTemp.dataShareList" style="width:100%" class="datashar">
        <el-table-column prop="dataName" label="数据名称"></el-table-column>
        <el-table-column prop="dataSize" label="数据量"></el-table-column>
        <el-table-column prop="startTime" label="开始时间">
          <template slot-scope="scope">{{ scope.row.startTime | timeFilter}}</template>
        </el-table-column>
        <el-table-column prop="deptName" label="共享部门"></el-table-column>
        <el-table-column label="评分">
          <template slot-scope="scope">
            <el-rate v-model="scope.row.score" disabled></el-rate>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click.native.prevent="openDataShare(scope.row)" type="text">修改</el-button>
            <el-button @click.native.prevent="deleteRow(scope.row)" type="text">移除</el-button>
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
      <el-button @click="adddatashar" class="adddatashar">+新增共享</el-button>
    </div>

    <!-- 措施建议 -->
    <div class="proposal">
      <div class="proposal-title">
        <span style="font-weight:700">措施建议</span>
        <span style="margin-left:20px;font-size:18px;color:red">共计评分 {{ propTemp.myScore }} 分</span>
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
            <el-rate v-model="scope.row.score" disabled></el-rate>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click.native.prevent="openProp(scope.row)" type="text">修改</el-button>
            <el-button @click.native.prevent="deleteProp(scope.row)" type="text">移除</el-button>
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
      <el-button @click="addProp" class="addProp">+新增措施建议</el-button>
    </div>

    <!-- 新增例会弹窗 -->
    <el-dialog :title="dialogTitle[titleStatus]" :visible.sync="meetingTemp.meetingDialog">
      <el-form
        ref="dataForm"
        :rules="meetingRules"
        :model="meetingTemp.conferenceTemp"
        label-position="right"
        label-width="100px"
        style="width: 90%;"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="例会日期" prop="meetingDate">
              <el-date-picker
                v-model="meetingTemp.conferenceTemp.meetingDate"
                type="date"
                placeholder="选择日期"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="例会主题" prop="subject">
              <el-input v-model="meetingTemp.conferenceTemp.subject" placeholder="例会主题" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="召开人" prop="personId">
              <el-input v-model="meetingTemp.conferenceTemp.personId" placeholder="召开人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="召开部门" prop="deptName">
              <el-input
                v-model="meetingTemp.conferenceTemp.deptName"
                @focus="handleSelectDept"
                placeholder="召开部门"
              />
              <input v-model="meetingTemp.conferenceTemp.departId" type="hidden" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="会议纪要" prop="outline">
              <el-input
                v-model="meetingTemp.conferenceTemp.outline"
                type="textarea"
                placeholder="会议纪要"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item>
            <el-button @click="meetingTemp.meetingDialog = false">{{ $t('table.cancel') }}</el-button>
            <el-button
              v-if="titleStatus == 'create'"
              type="primary"
              @click="saveConference"
            >{{ $t('table.confirm') }}</el-button>
            <el-button v-else type="primary" @click="updateConference">{{ $t('table.confirm') }}</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>

    <!-- 选择部门 -->
    <v-DeptCheck :deptVisible="meetingTemp.dialogDeptVisible" @getDeptNodeData="getDeptNodeData" @closeDialog="closeDialog"></v-DeptCheck>

    <!-- 新增共享文件弹窗 -->
    <el-dialog :title="dialogTitle[titleStatus]" :visible.sync="dataShareTemp.dataShareDialog">
      <el-form ref="dataShareForm" label-position="right" label-width="100px" style="width: 90%;">
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="dataShareTemp.conferenceTemp.startTime"
                type="date"
                placeholder="选择日期"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据名称">
              <el-input v-model="dataShareTemp.conferenceTemp.dataName" placeholder="数据名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="数据量">
              <el-input v-model="dataShareTemp.conferenceTemp.dataSize" placeholder="数据量" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="共享部门">
              <el-input
                v-model="dataShareTemp.conferenceTemp.deptName"
                @focus="handleSelectDept"
                placeholder="共享部门"
              />
              <input v-model="dataShareTemp.conferenceTemp.departId" type="hidden" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="共享方式">
              <el-input v-model="dataShareTemp.conferenceTemp.shareWay" placeholder="共享方式" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="数据描述">
              <el-input
                v-model="dataShareTemp.conferenceTemp.dataContent"
                type="textarea"
                placeholder="数据描述"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dataShareTemp.dataShareDialog = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          v-if="titleStatus == 'create'"
          type="primary"
          @click="saveDataShare"
        >{{ $t('table.confirm') }}</el-button>
        <el-button v-else type="primary" @click="updateDataShare">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <!-- 新增措施建议弹窗 -->
    <el-dialog :title="dialogTitle[titleStatus]" :visible.sync="propTemp.propDialog">
      <el-form ref="propForm" label-position="right" label-width="100px" style="width: 90%;">
        <el-row>
          <el-col :span="24">
            <el-form-item label="措施建议">
              <el-input
                v-model="propTemp.propTempObj.suggest"
                type="textarea"
                :autosize="{ minRows: 6, maxRows: 12}"
                placeholder="措施建议"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="propTemp.propDialog = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          v-if="titleStatus == 'create'"
          type="primary"
          @click="saveProp"
        >{{ $t('table.confirm') }}</el-button>
        <el-button v-else type="primary" @click="updateProp">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  myPage,
  addMeeting,
  updateMeeting,
  deleteMeeting,
  getMyScore as getMyMeetingScore
} from "@/api/appr/meeting";
import {
  myPage as dataSharePage,
  addDataShare,
  updateDataShare,
  deleteDataShare,
  getMyScore as getMyDataShareScore
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
      titleStatus: "",
      dialogTitle: {
        create: "新增",
        updata: "修改"
      },
      meetingTemp: {
        myScore: 0,
        listQuery: {
          subject: undefined,
          startDate: undefined,
          endDate: undefined,
          pageNum: 1,
          pageSize: 10
        },
        meetingListTotal: 0,
        meetingList: [],
        meetingDialog: false,

        conferenceTemp: {
          meetingDate: "",
          subject: "",
          personId: "",
          outline: "",
          deptName: "",
          taskId: "",
          departId: "",
          score: 0
        },
        dialogDeptVisible: false
      },
      dataShareTemp: {
        myScore: 0,
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          sort: "create_time",
          order: "descending"
        },
        dataShareListTotal: 0,
        dataShareList: [],
        dataShareDialog: false,
        conferenceTemp: {
          dataName: "",
          shareWay: "",
          dataSize: "",
          deptId: "",
          deptName: "",
          dataContent: "",
          startTime: "",
          score: 0
        }
      },
      propTemp: {
        myScore: 0,
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          sort: "create_time",
          order: "descending"
        },
        propListTotal: 0,
        propList: [],
        propDialog: false,
        propTempObj: {
          suggest: ""
        }
      },
      meetingRules: {
        meetingDate: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        subject: [
          { required: true, message: "请输入例会主题", trigger: "blur" }
        ],
        personId: [
          { required: true, message: "请选择召开人", trigger: "blur" }
        ],
        deptName: [
          { required: true, message: "请选择召开部门", trigger: "change" }
        ],
        outline: [
          { required: true, message: "请输入会议纪要", trigger: "blur" }
        ]
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
    this.getMeetingScore();
    this.getDataShareScore();
    this.getSuggestScore();
  },

  methods: {
    // 获取例会列表
    getMeetingList() {
      myPage(this.meetingTemp.listQuery).then(res => {
        this.meetingTemp.meetingList = res.data.list;
        this.meetingTemp.meetingListTotal = res.data.total;
      });
    },
    // 获取例会总分
    getMeetingScore() {
      getMyMeetingScore().then(res => {
        this.meetingTemp.myScore = res.data;
      });
    },
    // 打开新增例会弹窗
    addDomain() {
      this.titleStatus = "create";
      this.meetingTemp.conferenceTemp = {
        meetingDate: "",
        subject: "",
        personId: "",
        outline: "",
        deptName: "",
        taskId: "",
        departId: ""
      };
      this.meetingTemp.meetingDialog = true;
    },
    // 保存新增例会
    saveConference() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const temp = Object.assign({}, this.meetingTemp.conferenceTemp);
          addMeeting(temp)
            .then(res => {
              if (res.data.data) {
                notifySuccess(this, "新增成功");
                this.meetingTemp.meetingDialog = false;
                this.getMeetingList();
              } else {
                notifyFail(this, "新增失败");
                this.meetingTemp.meetingDialog = false;
              }
            })
            .catch(err => {
              notifyFail(this, "新增失败");
              this.meetingTemp.meetingDialog = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
    // 打开修改例会弹窗
    openConference(row) {
      this.titleStatus = "update";
      this.meetingTemp.meetingDialog = true;
      this.meetingTemp.conferenceTemp = {
        meetingDate: row.meetingDate,
        subject: row.subject,
        personId: row.personId,
        outline: row.outline,
        departId: row.departId,
        deptName: row.departName,
        taskId: row.taskId,
        id: row.id
      };
    },
    updateConference() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          updateMeeting(this.meetingTemp.conferenceTemp)
            .then(res => {
              if (res.data.data) {
                notifySuccess(this, "修改成功");
                this.meetingTemp.meetingDialog = false;
                this.getMeetingList();
              } else {
                notifyFail(this, "修改失败");
              }
            })
            .catch(err => {
              notifyFail(this, "修改失败");
            });
        }
      });
    },
    // 删除例会
    delConference(row) {
      deleteMeeting(row.id)
        .then(res => {
          if (res.data.data) {
            notifySuccess(this, "删除成功");
            this.getMeetingList();
          } else {
            notifyFail(this, "删除失败");
          }
        })
        .catch(err => {
          notifyFail(this, "删除失败");
        });
    },
    // 获取部门树数据
    handleSelectDept() {
      this.meetingTemp.dialogDeptVisible = true;
    },
    closeDialog(val) {
      this.meetingTemp.dialogDeptVisible = val;
    },
    getDeptNodeData(data) {
      this.meetingTemp.dialogDeptVisible = false;
      this.meetingTemp.conferenceTemp.departId = data.id;
      this.meetingTemp.conferenceTemp.deptName = data.deptName;
      this.dataShareTemp.conferenceTemp.deptId = data.id;
      this.dataShareTemp.conferenceTemp.deptName = data.deptName;
    },

    //获取数据共享列表
    getDataShareList() {
      dataSharePage(this.dataShareTemp.listQuery).then(res => {
        this.dataShareTemp.dataShareList = res.data.list;
        this.dataShareTemp.dataShareListTotal = res.data.total;
      });
    },
    getDataShareScore() {
      getMyDataShareScore().then(res => {
        this.dataShareTemp.myScore = res.data;
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
    //打开新增共享文件弹窗
    adddatashar() {
      this.titleStatus = "create";
      this.dataShareTemp.conferenceTemp = {
        dataName: "",
        dataSize: "",
        deptId: "",
        deptName: "",
        dataContent: "",
        startTime: "",
        shareWay: ""
      };
      this.dataShareTemp.dataShareDialog = true;
    },
    // 保存新增共享文件
    saveDataShare() {
      const temp = Object.assign({}, this.dataShareTemp.conferenceTemp);
      addDataShare(temp)
        .then(res => {
          if (res.data.data) {
            notifySuccess(this, "新增成功");
            this.dataShareTemp.dataShareDialog = false;
            this.getDataShareList();
          } else {
            notifyFail(this, "新增失败");
            this.dataShareTemp.dataShareDialog = false;
          }
        })
        .catch(err => {
          notifyFail(this, "新增失败");
          this.dataShareTemp.dataShareDialog = false;
        });
    },
    // 打开修改共享文件弹窗
    openDataShare(row) {
      this.titleStatus = "update";
      this.dataShareTemp.dataShareDialog = true;
      this.dataShareTemp.conferenceTemp = {
        dataName: row.dataName,
        dataSize: row.dataSize,
        deptId: row.deptId,
        deptName: row.deptName,
        dataContent: row.dataContent,
        startTime: row.startTime,
        shareWay: row.shareWay,
        id: row.id
      };
    },
    // 修改共享文件
    updateDataShare() {
      updateDataShare(this.dataShareTemp.conferenceTemp)
        .then(res => {
          if (res.data.data) {
            notifySuccess(this, "修改成功");
            this.dataShareTemp.dataShareDialog = false;
            this.getDataShareList();
          } else {
            notifyFail(this, "修改失败");
          }
        })
        .catch(err => {
          notifyFail(this, "修改失败");
        });
    },
    deleteRow(row) {
      deleteDataShare(row.id)
        .then(res => {
          if (res.data.data) {
            notifySuccess(this, "删除成功");
            this.getDataShareList();
          } else {
            notifyFail(this, "删除失败");
          }
        })
        .catch(err => {
          notifyFail(this, "删除失败");
        });
    },

    // 获取措施建议列表
    getProposalList() {
      suggestPage(this.propTemp.listQuery).then(res => {
        this.propTemp.propList = res.data.list;
        this.propTemp.propListTotal = res.data.total;
      });
    },
    getSuggestScore() {
      getSuggestScore().then(res => {
        this.propTemp.myScore = res.data;
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
    //打开新增共享文件弹窗
    addProp() {
      this.titleStatus = "create";
      this.propTemp.propTempObj = {
        suggest: ""
      };
      this.propTemp.propDialog = true;
    },
    // 保存新增共享文件
    saveProp() {
      const temp = Object.assign({}, this.propTemp.propTempObj);
      addSuggest(temp)
        .then(res => {
          if (res.data.data) {
            notifySuccess(this, "新增成功");
            this.propTemp.propDialog = false;
            this.getProposalList();
          } else {
            notifyFail(this, "新增失败");
            this.propTemp.propDialog = false;
          }
        })
        .catch(err => {
          notifyFail(this, "新增失败");
          this.propTemp.propDialog = false;
        });
    },
    // 打开修改共享文件弹窗
    openProp(row) {
      this.titleStatus = "update";
      this.propTemp.propDialog = true;
      this.propTemp.propTempObj = {
        id: row.id,
        suggest: row.suggest
      };
    },
    // 修改共享文件
    updateProp() {
      updateSuggest(this.propTemp.propTempObj)
        .then(res => {
          if (res.data.data) {
            notifySuccess(this, "修改成功");
            this.propTemp.propDialog = false;
            this.getProposalList();
          } else {
            notifyFail(this, "修改失败");
          }
        })
        .catch(err => {
          notifyFail(this, "修改失败");
        });
    },
    deleteProp(row) {
      deleteSuggest(row.id)
        .then(res => {
          if (res.data.data) {
            notifySuccess(this, "删除成功");
            this.getProposalList();
          } else {
            notifyFail(this, "删除失败");
          }
        })
        .catch(err => {
          notifyFail(this, "删除失败");
        });
    }
  },
  watch: {}
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

  .newadd {
    border: 2px dashed #f0f2f5;
    margin: 10px auto;
    width: 98%;
    display: block;
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

  .adddatashar {
    border: 2px dashed #f0f2f5;
    margin: 10px auto;
    width: 98%;
    display: block;
  }
}

.pagination-container {
  padding-left: 20px;
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
