<template>
  <div class="themeconference">
    <el-form label-width="200px" class="demo-ruleForm">
      <!-- 任务详情 -->
      <div class="assignHeader">
        <el-row>
          <el-col :span="24" class="themeconference-header">
            <img src="/static/img/u485.png" class="imange-header" />
            <span class="header-topname">任务名称:&nbsp;&nbsp;</span>
            <span class="header-toptext">{{ assignmentInfo.name }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" class="header">
            <div class="header-item">
              <span class="header-title">负责人：</span>
              <span class="header-text">{{ assignmentInfo.personName }}</span>
            </div>
            <div class="header-item">
              <span class="header-title">优先级:</span>
              <span class="header-text">{{ assignmentInfo.priority | priorityFilter }}</span>
            </div>
            <div class="header-item">
              <span class="header-title">所属部门:</span>
              <span class="header-text">{{ assignmentInfo.departName }}</span>
            </div>
            <div class="header-item">
              <span class="header-title">完成时间:</span>
              <span class="header-text">{{ assignmentInfo.endTime | timeFilter}}</span>
            </div>
            <div class="header-item">
              <span class="header-title">所属会议:</span>
              <span class="header-text">{{ assignmentInfo.conferenceName }}<a v-if="assignmentInfo.tasksId" @click="taskViewBtn(assignmentInfo.tasksId)">（查看）</a></span>
            </div>
            <div class="header-item">
              <span class="header-title">任务描述:</span>
              <span class="header-text">{{ assignmentInfo.description }}</span>
            </div>
          </el-col>
          <el-col :span="6" v-if="assignmentInfo.status == 3">
            <div class="header-grade" v-if="assignmentInfo.taskDepart">
              <div class="grade">
                <span>任务评分</span>
              </div>
              <div class="textMax">
                <span>{{ assignmentInfo.list | taskScore}}</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 评分标准 -->
      <div class="flow">
        <div class="flow-name">
          <span>评分标准</span>
        </div>
        <div class="flow-content">
          <el-table :data="assignmentInfo.list" style="width:100%">
            <el-table-column prop="name" label="评分标准"></el-table-column>
            <el-table-column prop="min" label="最低标准"></el-table-column>
            <el-table-column prop="unit" label="评分单位"></el-table-column>
            <el-table-column prop="roleId" label="评分角色"></el-table-column>
            <el-table-column label="评分">
              <template slot-scope="scope">
                <el-rate v-if="status == 'update'" v-model="scope.row.markScore" ></el-rate>
                <el-rate v-if="status == 'view'" v-model="scope.row.markScore" disabled></el-rate>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- 任务流程 -->
      <div class="flow">
        <div class="flow-name">
          <span>任务集流程</span>
        </div>
        <el-steps :active="parseInt(assignmentInfo.status) + 1" align-center class="flow-chart">
          <el-step title="新建" :description="assignmentInfo.personName"></el-step>
          <el-step title="执行中" :description="assignmentInfo.personName"></el-step>
          <el-step title="已完成" :description="assignmentInfo.personName"></el-step>
          <el-step title="已评分" :description="assignmentInfo.personName"></el-step>
        </el-steps>
      </div>
      <!-- 完成情况 -->
      <div class="complete">
        <div class="complete-top">
          <span>上报完成情况</span>
        </div>
        <div class="complete-status">
          <!-- 完成情况 -->
          <div class="cena">
            <div class="cena-title">
              <div class="title-font">
                <span style="font-weight:700">完成情况</span>
              </div>
            </div>
            <el-form ref="form" label-position="right" label-width="150px">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="完成程度（%）">
                    <span>{{ tempAssignData.degree }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="完成日期">
                    <span>{{ tempAssignData.completeDate | timeFilter}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="14">
                  <el-form-item label="说明">
                    <span>{{ tempAssignData.completeComment }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </div>
      <!-- 取消 保存按钮 -->
      <div class="btn" v-if="status == 'update'">
        <div class="btnsite">
          <el-button type="primary" @click="submitForm('numberValidateForm')" class="submit">保存</el-button>
        </div>
      </div>
    </el-form>
    <!-- 会议查看弹窗 -->
    <el-dialog
      :title="$t('table.conference.view')"
      :visible.sync="taskView.dialogViewVisible"
      width="70%"
      top="10vh"
    >
      <el-tabs v-model="taskView.activeName">
        <el-tab-pane label="与会人员" name="first">
          <el-table
            ref="multipleTable"
            :key="taskView.tableKey"
            :data="taskView.personList"
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
                  <span v-if="taskView.tempConference">{{ taskView.tempConference.records }}</span>
                  <span v-else>无会议记录</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="会议纪要">
                  <span v-if="taskView.tempConference">{{ taskView.tempConference.outline }}</span>
                  <span v-else>无会议纪要</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="上传的文件">
                  <el-button v-for="(item,index) in taskView.manages" :key="index" type="primary" @click="download(item.id)">
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
            :data="taskView.taskList"
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

<script type="text/ecmascript-6">
import { getTaskDTO, markTask } from "@/api/appr/taskOriginal";
import { getConferenceInfo } from "@/api/appr/conference";
import {
  checkMultipleSelect,
  isNotEmpty,
  notifySuccess,
  notifyFail,
  exportExcel,
  messageSuccess,
  formatDate
} from "@/utils/util";
import SpinnerLoading from "@/components/SpinnerLoading";
import { downloadFile } from "@/api/appr/file"
export default {
  name: "appear",
  data() {
    return {
      status: this.$route.params.status,
      assignmentInfo: {},
      //任务数据模型
      tempAssignData: {
        // 完成程度
        degree: "",
        // 完成日期
        completeDate: "",
        // 说明
        completeComment: "",
        // 评分标准
        list: []
      },
      // 评分临时信息
      tempAssign: 0,
      assignIndex: "",
      assignDialog: false,
      finishList: [],
      degree: "",
      fromtime: "",
      input: "",
      tableKey: 0,
      options: [
        {
          degree: "30%"
        },
        {
          degree: "6%"
        }
      ],
      tableData: [],
      // 会议查看
      taskView: {
        dialogViewVisible:false,
        personList:null,
        tempConference:'',
        taskList:null,
        manages:'',
        tableKey: 0,
        activeName: "first",
      }
    };
  },
  created() {
    this.getAppearId();
  },
  filters: {
    timeFilter(time) {
      if(time){
        return formatDate(new Date(time), "yyyy-MM-dd");
      }
      
    },
    statusFilter(status) {
      const statusMap = {
        0: "启用",
        1: "禁用"
      };
      return statusMap[status];
    },
    // 优先级123
    priorityFilter(priority) {
      const priorityMap = {
        1: "低",
        2: "中",
        3: "高"
      };
      return priorityMap[priority];
    },
    sexFilter(type) {
      const sexMap = {
        0: "男",
        1: "女"
      };
      return sexMap[type];
    },
    taskScore(list) {
      let num = 0;
      list.forEach(element => {
        num += parseInt(element.markScore);
      });
      return num;
    }
  },
  methods: {
    //获取数据
    getAppearId() {
      const themeId = this.$route.params.id;
      this.getAppearInfo(themeId);
    },
    getAppearInfo(id) {
      this.listLoading = true;
      getTaskDTO(id).then(response => {
        this.assignmentInfo = response.data.data;
        if (!!this.assignmentInfo.taskDepart) {
          this.tempAssignData = this.assignmentInfo.taskDepart;
        }
        setTimeout(() => {
          this.listLoading = false;
        }, 500);
      });
    },
    // 删除
    editRow(index, rows) {
      rows.splice(index, 1);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    submitForm() {
      markTask(this.assignmentInfo).then(response => {
        notifySuccess(this, "保存成功");
        this.closeSelectedTag(this.$route);
      });
    },
    closeSelectedTag(view) {
      this.$store.dispatch("delView", view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          const latestView = visitedViews.slice(-1)[0];
          if (latestView) {
            this.$router.push(latestView);
          } else {
            this.$router.push("/");
          }
        }
      });
    },
    isActive(route) {
      return route.fullPath === this.$route.fullPath;
    },
    taskViewBtn(id){
      
      getConferenceInfo(id).then(response => {
        this.taskView.dialogViewVisible = true
          this.taskView.personList = response.data.data.persons;
          this.taskView.tempConference = response.data.data.conference;
          this.taskView.taskList = response.data.data.tasks;
          this.taskView.manages = response.data.data.manages;
        });
    },
    download(id){
      downloadFile(id).then(res => {
        exportExcel(res)
      })
    }
  }
};
</script>
<style lang="stylus">
.el-dialog__body {
  .el-rate__icon {
    font-size: 40px;
  }

  .el-rate__text {
    font-size: 45px;
    vertical-align: middle;
    margin-left: 20px;
  }
}
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.themeconference {
  .themeconference-header {
    padding: 10px 20px;
    margin-bottom: 10px;

    // display inline-block
    .imange-header {
      width: 30px;
      height: 30px;
      position: relative;
      top: 7px;
      margin-right: 10px;
    }

    .header-topname {
      font-weight: 700;
    }

    .header-toptext {
      font-weight: 700;
      margin-right: 5px;
    }
  }

  .header {
    padding: 10px 20px;
    width: 800px;
    display: inline-block;

    .header-item {
      font-size: 14px;
      margin: 10px 1px 0px 45px;
      width: 300px;
      display: inline-block;

      .header-title {
        color: #272727;
      }

      .header-text {
        color: #5A5A5A;
      }
    }
  }

  .header-grade {
    padding: 10px 20px;
    display: inline-block;
    position: relative;
    right: -266px;

    .grade {
      color: #8D8D8D;
      font-size: 14px;
      margin-bottom: 10px;
    }

    .textMax {
      font-weight: 700;
      color: #272727;
    }
  }

  .describe {
    padding: 10px 20px;
    margin: 10px 5px 20px 45px;
    font-size: 14px;
    color: #272727;

    .describe-name {
      display: inline-block;
      position: relative;
      top: -16px;
    }

    .describe-text {
      display: inline-block;
      width: 1030px;
    }
  }

  .flow {
    border: 20px solid #F0F2F5;

    .flow-name {
      padding: 20px 20px 20px 35px;
      font-weight: 700;
      font-size: 16px;
      border-bottom: 2px solid #F0F2F5;
    }

    .flow-content {
      padding: 20px 20px 20px 35px;
    }

    // margin-left 20px
    .flow-chart {
      padding: 20px 0px;
    }
  }

  .complete {
    border: 20px solid #F0F2F5;

    .complete-top {
      padding: 20px 20px 20px 35px;
      font-weight: 700;
      font-size: 16px;
      border-bottom: 2px solid #F0F2F5;
    }

    .complete-status {
      padding: 20px;
      font-size: 14px;

      // border-bottom 2px solid #F0F2F5
      .environment-check {
        font-weight: 400;
        padding: 0px 20px 20px 20px;
      }
    }

    .environment {
      display: inline-block;
      width: 950px;
      padding: 0px 0px 0px 20px;

      .environment-item {
        display: inline-block;
        width: 300px;
        padding-bottom: 10px;

        .environment-title {
          color: #272727;
        }

        .environment-text {
          color: #5A5A5A;
        }
      }

      .tesk {
        display: inline-block;
        padding-bottom: 10px;
        width: 520pxs;

        .tesk-text {
          display: inline-block;
          width: 425px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: #5A5A5A;
        }
      }
    }

    .environment-grade {
      display: inline-block;

      .grade-name {
        padding-bottom: 10px;
        color: #5A5A5A;
      }

      .grade-num {
        font-weight: 700;
        font-size: 16px;
        // color #5A5A5A
      }
    }

    .cena {
      margin-top: 10px;
      display: inline-block;
      width: 100%;
      // padding 20px
      border: 2px solid #F0F2F5;

      .cena-title {
        border-bottom: 2px solid #F0F2F5;

        .title-font {
          font-weight: 700px;
          padding: 15px 20px;
          background-color: #FAFAFA;
        }
      }

      .cena-percent {
        width: 400px;
        display: inline-block;
        padding: 10px 20px;

        .cenaname {
          margin: 10px 0px;
          width: 300px;
        }
      }

      .cena-describe {
        padding: 0px 0px 0px 20px;

        .cena-text {
          width: 706px;
          margin: 10px 0px;
        }
      }
    }

    .scoring {
      display: inline-block;
      width: 100%;
      margin: 40px 0px;
      border: 2px solid #F0F2F5;

      .missionstatus {
        border-bottom: 2px solid #F0F2F5;
        background-color: #FAFAFA;
        padding: 10px 0px 10px 20px;
        font-weight: 700;
      }

      .standard {
        padding: 15px 20px;
        background-color: #FAFAFA;
        border-bottom: 2px solid #F0F2F5;
      }

      .table {
        padding: 15px 20px;
      }

      .newadd {
        border: 2px dashed #F0F2F5;
        margin: 10px 20px;
        width: 950px;
      }
    }

    .datasharing {
      display: inline-block;
      width: 100%;
      margin: 0px 0px 40px 0px;
      border: 2px solid #F0F2F5;

      .datasharing-title {
        // font-weight 700px
        padding: 15px 20px;
        background-color: #FAFAFA;
        border-bottom: 2px solid #F0F2F5;
      }

      .datashar {
        padding: 15px 20px;
      }

      .adddatashar {
        border: 2px dashed #F0F2F5;
        margin: 10px 20px;
        width: 950px;
      }
    }
  }

  .btn {
    border: 2px solid #D8DADC;
    padding: 10px 20px;

    .btnsite {
      width: 200px;
      position: relative;
      right: -719px;

      .cancel {
        margin-right: 20px;
      }
    }
  }
}
</style>