<template>
  <div class="themeconference">
    <el-form  class="demo-ruleForm">
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
              <span class="header-title">任务描述:</span>
              <span class="header-text"> {{ assignmentInfo.description }}</span>
            </div>
          </el-col>
          <!-- <el-col :span="6">
            <div class="header-grade" v-if="assignmentInfo.taskDepart">
              <div class="grade">
                <span>任务评分</span>
              </div>
              <div class="textMax">
                <span>{{ assignmentInfo.taskDepart.score }}</span>
              </div>
            </div>
          </el-col> -->
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
          </el-table>
        </div>
        
      </div>
      <!-- 任务集流程 -->
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
      <!-- 上报完成情况 -->
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
                <el-col :span="12">
                  <el-form-item label="完成程度（%）">
                    <el-select v-model="tempAssignData.degree" placeholder="请选择完成程度">
                      <el-option
                        v-for="(item,index) in degreeOption"
                        :key="index"
                        :label="item"
                        :value="item"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="完成日期">
                    <el-date-picker v-model="tempAssignData.completeDate" placeholder="完成日期" type="date" ></el-date-picker>
                  </el-form-item> 
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="22">
                  <el-form-item label="说明">
                    <el-input placeholder="请输入简要说明" type="textarea" v-model="tempAssignData.completeComment" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </div>
      <el-form-item class="btn">
        <div class="btnsite">
          <el-button type="primary" @click="submitForm()" class="submit">保存</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import { fetchInfo,postFetch } from "@/api/appr/appear";
import { getTaskDTO } from "@/api/appr/taskOriginal";
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
  name: "themeconference",
  data() {
    return {
      // 任务基础信息
      assignmentInfo: '',
      // 上报任务数据模型
      tempAssignData: {
        // 完成程度
        degree: '',
        // 完成日期
        completeDate: '',
        // 说明
        completeComment: '',
        // 评分标准
        list: []
      },
      // 完成情况
      degreeOption: ["10","20","30","40","50","60","70","80","90","100"],
      themeInfo: {}
    };
  },
  filters: {
    timeFilter(time) {
      return formatDate(new Date(time), "yyyy-MM-dd");
    },
    statusFilter(status) {
      const statusMap = {
        0: "启用",
        1: "禁用"
      };
      return statusMap[status];
    },
    priorityFilter (priority) {
      const priorityMap = {
      1: '低',
      2: '中',
      3: '高',
    }
      return priorityMap[priority]
    },
  },
  created() {
    this.getThemeId();
  },
  methods: {
    //获取数据
    getThemeId() {
      const themeId = this.$route.params.id;
      this.getAssignment(themeId)
    },
    getAssignment(id) {
      getTaskDTO(id).then((response) => {
        this.assignmentInfo = response.data.data
        if (!!this.assignmentInfo.taskDepart) {
          this.tempAssignData = this.assignmentInfo.taskDepart
        }
      })
    },

    closeSelectedTag (view) {
      this.$store.dispatch('delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          const latestView = visitedViews.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView)
          } else {
            this.$router.push('/')
          }
        }
      })
    },
    isActive (route) {
      return route.fullPath === this.$route.fullPath
    },
    // 任务上报最终保存
    submitForm() {
      if (this.assignmentInfo.taskDepart.degree === '100') {
        this.$confirm('当前任务完成度100%，任务上报后将不能继续上报，是否确定？', '任务上报提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.listLoading = true;
          this.assignmentInfo.taskDepart = this.tempAssignData
          this.assignmentInfo.status = '2'
          postFetch(this.assignmentInfo).then(response => {
            this.listLoading = false;
            notifySuccess(this,'保存成功')
            this.closeSelectedTag(this.$route)
          });
        });
      } else {
        this.listLoading = true;
        this.assignmentInfo.taskDepart = this.tempAssignData
        this.assignmentInfo.status = '1'
        postFetch(this.assignmentInfo).then(response => {
          this.listLoading = false;
          notifySuccess(this,'保存成功')
          this.closeSelectedTag(this.$route)
        });
      }
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.themeconference {
  .assignHeader{

  }
  .themeconference-header {
    padding 10px  20px
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
    .header-grade {
      padding: 10px 20px;
      display: inline-block;

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
      border-bottom: 2px solid #F0F2F5;

      .environment-check {
        font-weight: 400;
        padding: 0px 20px 20px 20px;
      }
    }

    .environment {
      display: inline-block;
      width: 1000px;
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
      margin: 0px 0px 20px 0px;
      display: inline-block;
      width: 100%;
      // padding 20px
      border: 2px solid #F0F2F5;

      .cena-title {
        border-bottom: 2px solid #F0F2F5;
        margin-bottom: 20px;
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
      margin: 0px 0px 20px 0px;
      border: 2px solid #F0F2F5;

      .standard {
        // font-weight 700px
        padding: 15px 20px;
        background-color: #FAFAFA;
        border-bottom: 2px solid #F0F2F5;
      }

      .table {
        padding: 15px 20px;
      }

      .newadd {
        border: 2px dashed #F0F2F5;
        margin: 10px auto;
        width: 98%;
        display: block;
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