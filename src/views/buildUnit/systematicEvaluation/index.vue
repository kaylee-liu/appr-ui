<template>
  <div class="achieveAppear app-container">
    <div class="filter-container">
      <el-input
        placeholder="请输入单位名称"
        v-model="companyName"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="querySearch">查询</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="add">新建</el-button>
    </div>
    <el-table :data="tableData.slice((currage - 1) * pagesize, currage*pagesize)" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="unitName" label="单位名称"></el-table-column>
      <el-table-column prop="evaluationCriteria1" label="评估标准1"></el-table-column>
      <el-table-column prop="evaluationCriteria2" label="评估标准2"></el-table-column>
      <el-table-column prop="evaluationCriteria3" label="评估标准3"></el-table-column>
      <el-table-column label="操作" width="260">
        <template slot-scope="scope">
          <el-button type="warning" size="small" @click="openUpdate(scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="peopleRemove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container" v-if="tableData.length>0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
      ></el-pagination>
    </div>
    <!-- 表单弹窗组件 -->
    <Appear-form ref="appearForm" :isAdd="isAdd" @refreshTable="refreshTable"></Appear-form>
  </div>
</template>

<script>
import AppearForm from './components/form'
export default {
  data () {
    return {
      trainingName: '',
      companyName: '',
      pagesize: 10,
      currage: 1,
      tableData: [
        {
          unitName: '中国电科',
          evaluationCriteria1: '评估标准1',
          evaluationCriteria2: '评估标准2',
          evaluationCriteria3: '评估标准3'
        },
        {
          unitName: '中国电科',
          evaluationCriteria1: '评估标准1',
          evaluationCriteria2: '评估标准2',
          evaluationCriteria3: '评估标准3'
        },
        {
          unitName: '中国电科',
          evaluationCriteria1: '评估标准1',
          evaluationCriteria2: '评估标准2',
          evaluationCriteria3: '评估标准3'
        },
        {
          unitName: '中国电科',
          evaluationCriteria1: '评估标准1',
          evaluationCriteria2: '评估标准2',
          evaluationCriteria3: '评估标准3'
        },
        {
          unitName: '中国电科',
          evaluationCriteria1: '评估标准1',
          evaluationCriteria2: '评估标准2',
          evaluationCriteria3: '评估标准3'
        }
      ],
      isAdd: true
    }
  },
  components: {
    AppearForm
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.currage = val
    },
    // 新增
    add () {
      this.isAdd = true
      this.$refs.appearForm.dialogVisible = true
    },
    // 点击修改按钮
    openUpdate (data) {
      this.isAdd = false
      this.$refs.appearForm.dialogVisible = true
      this.$refs.appearForm.form = {
        unitName: data.unitName,
        evaluationCriteria1: data.evaluationCriteria1,
        evaluationCriteria2: data.evaluationCriteria2,
        evaluationCriteria3: data.evaluationCriteria3,
        id: data.id
      }
    },

    // 点击删除按钮
    peopleRemove (item) {
      this.tableData.splice(item, 1)
    }
  }
}
</script>

<style>
</style>
