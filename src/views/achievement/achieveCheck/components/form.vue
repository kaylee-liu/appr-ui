<template>
  <el-dialog :visible.sync="dialogVisible">
    <div class="AppearForm">
      <el-form ref="form" :model="form" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="战果标题">
              <span>{{ form.title }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="战果类型">
              <span>{{ typeFormat(form.resultType) }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="时间">
              <span>{{ form.endTime }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地点">
              <span>{{ locationFormat(form.location) }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="内容">
              <el-input type="textarea" v-model="form.content" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input type="textarea" v-model="form.remark" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="success" @click="agreeCheck()">通 过</el-button>
      <el-button type="danger" @click="disagreeCheck()">驳 回</el-button>
      <el-button type="primary" @click="repeatCheck()">转 发</el-button>
    </span>

    <!-- 选择部门 -->
    <v-DeptCheck
      :deptVisible="dialogDeptVisible"
      @getDeptNodeData="getDeptNodeData"
      @closeDialog="closeDialog"
    ></v-DeptCheck>
  </el-dialog>
</template>

<script>
import { modify } from "@/api/appr/achieveAppear";
import { notifySuccess } from "@/utils/util";
import DeptCheck from "@/components/DeptCheck/index";
export default {
  name: "AppearForm",
  props: {},
  data() {
    return {
      form: {
        title: null,
        resultType: null,
        endTime: null,
        location: null,
        content: null,
        remark: null,
        approvalStatus: "0"
      },
      dialogVisible: false,
      typeOpts: [
        { name: "打私", value: "0" },
        { name: "缉毒", value: "1" },
        { name: "反偷渡", value: "2" }
      ],
      localOpts: [
        { name: "海口", value: "0" },
        { name: "三亚", value: "1" },
        { name: "儋州", value: "2" },
        { name: "五指山", value: "3" },
        { name: "琼海", value: "4" },
        { name: "文昌", value: "5" },
        { name: "万宁", value: "6" },
        { name: "东方", value: "7" },
        { name: "定安", value: "8" },
        { name: "屯昌", value: "9" },
        { name: "澄迈", value: "10" },
        { name: "临高", value: "11" },
        { name: "白沙黎族自治县", value: "12" },
        { name: "昌江黎族自治县", value: "13" },
        { name: "乐东黎族自治县", value: "14" },
        { name: "陵水黎族自治县", value: "15" },
        { name: "保亭黎族苗族自治县", value: "16" },
        { name: "琼中黎族苗族自治县", value: "17" },
        { name: "洋浦经济开发区", value: "18" }
      ],
      dialogDeptVisible: false
    };
  },

  components: {
    "v-DeptCheck": DeptCheck
  },

  computed: {
    typeFormat() {
      return function(value) {
        if (!value) return "";
        for (let i = 0, t = this.typeOpts; i < t.length; i++) {
          if (value == t[i].value) {
            return t[i].name;
          }
        }
      };
    },
    locationFormat() {
      return function(value) {
        if (!value) return "";
        for (let i = 0, t = this.localOpts; i < t.length; i++) {
          if (value == t[i].value) {
            return t[i].name;
          }
        }
      };
    }
  },

  beforeMount() {},

  mounted() {},

  methods: {
    refrashFrom() {
      this.form = {
        title: null,
        resultType: null,
        endTime: null,
        location: null,
        content: null,
        remark: null,
        approvalStatus: "0"
      };
    },

    // 通过
    agreeCheck() {
      modify({ id: this.form.id, approvalStatus: "5" }).then(
        ({ data: res }) => {
          this.refrashFrom();
          this.dialogVisible = false;
          notifySuccess(this, "审核成功");
          this.$emit("refreshTable");
        }
      );
    },

    // 驳回
    disagreeCheck() {
      modify({ id: this.form.id, approvalStatus: "3" }).then(
        ({ data: res }) => {
          this.refrashFrom();
          this.dialogVisible = false;
          notifySuccess(this, "驳回成功");
          this.$emit("refreshTable");
        }
      );
    },

    // 转发
    repeatCheck() {
      this.dialogDeptVisible = true;
    },
    getDeptNodeData(data) {
      
      this.$confirm(`是否发送给 [ ${data.deptName} ] 处理`, "转发确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          modify({ id: this.form.id, forwardingDept: data.id, approvalStatus: '2' }).then(
            ({ data: res }) => {
              this.refrashFrom();
              this.dialogDeptVisible = false;
              notifySuccess(this, "转发成功");
              this.$emit("refreshTable");
            }
          );
        })
        .catch(() => {});
    },
    closeDialog(val) {
      this.dialogDeptVisible = val;
    }
  },

  watch: {}
};
</script>
<style>
.AppearForm .el-date-editor .el-range-input,
.filter-container .el-date-editor .el-range-separator {
  float: left;
}
.AppearForm .el-date-editor .el-range-separator {
  width: 7%;
}
</style>