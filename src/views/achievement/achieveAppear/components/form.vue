<template>
  <el-dialog :visible.sync="dialogVisible" :title="isAdd ? '新增' : '修改'">
    <div class="AppearForm">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="战果标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="战果类型">
          <el-select v-model="form.resultType">
            <el-option
              v-for="(item,index) in typeOpts"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker v-model="form.endTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="地点">
          <el-select v-model="form.location">
            <el-option
              v-for="(item,index) in localOpts"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="form.content"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible=false">取 消</el-button>
      <el-button type="primary" v-if="isAdd" @click="getFormData">确 定</el-button>
      <el-button type="primary" v-else @click="upDateFormData">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addWorkResult, modify } from "@/api/appr/achieveAppear";
import { notifySuccess } from "@/utils/util";
export default {
  name: "AppearForm",
  props: {
    isAdd: {
      type: Boolean
    }
  },
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
      ]
    };
  },

  components: {},

  computed: {},

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
    getFormData() {
      let _self = this;
      addWorkResult(this.form).then(({ data: res }) => {
        if (res.data) {
          this.refrashFrom();
          this.dialogVisible = false;
          notifySuccess(_self, "新增成功");
          this.$emit("refreshTable");
        }
      });
    },
    upDateFormData() {
      modify(this.form).then(({ data: res }) => {
        this.refrashFrom();
        this.dialogVisible = false;
        notifySuccess(this, "修改成功");
        this.$emit("refreshTable");
      });
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