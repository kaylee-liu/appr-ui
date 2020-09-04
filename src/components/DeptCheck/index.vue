<template>
  <div class="DeptCheck">
    <el-dialog
      title="选择部门"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      append-to-body
    >
      <el-row>
        <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
        <el-col :span="24" style="margin-top:10px;">
          <div style="height:500px;overflow:auto;width:100%">
            <el-tree
              ref="depetTree"
              class="filter-tree"
              :data="deptData"
              :filter-node-method="filterNode"
              :props="defaultDeptProps"
              node-key="id"
              highlight-current
              @node-click="getDeptNodeData"
            />
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { fetchTree } from "@/api/admin/dept";
export default {
  name: "DeptCheck",
  props: {
    deptVisible: Boolean,
    title: String
  },
  data() {
    return {
      dialogVisible: false,
      filterText: "",
      deptData: [],
      defaultDeptProps: {
        children: "children",
        label: "deptName"
      }
    };
  },

  components: {},

  computed: {},

  beforeMount() {},

  mounted() {
    fetchTree().then(response => {
      this.deptData = response.data;
      this.filterText = "";
    });
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.deptName.indexOf(value) !== -1;
    },
    getDeptNodeData(data) {
      this.$emit("getDeptNodeData", data);
    },
    handleClose(done) {
      this.$emit("closeDialog", false);
    }
  },

  watch: {
    deptVisible(val) {
      this.dialogVisible = this.deptVisible;
    },
    filterText(val) {
      this.$refs.depetTree.filter(val);
    }
  }
};
</script>
<style lang='' scoped>
</style>