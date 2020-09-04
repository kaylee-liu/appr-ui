<template>
  <div>
    <el-row :gutter="30">
  <el-col :span="12"><div class="grid-content bg-purple"><trainingContentEvaluation /></div></el-col>
  <el-col :span="12"><div class="grid-content bg-purple"><trainerEvaluation /></div></el-col>
</el-row>
    <el-row :gutter="30">
      <el-col :span="24">
        <div class="grid-content bg-purple"><trainingEffectEvaluation /></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import trainingContentEvaluation from './echarts/trainingContentEvaluationl'
import trainerEvaluation from './echarts/trainerEvaluation'
import trainingEffectEvaluation from './echarts/trainingEffectEvaluation'
export default {
  components: {
    trainingContentEvaluation,
    trainerEvaluation,
    trainingEffectEvaluation
  }
}
</script>

<style scoped>
  .el-row {
    padding: 10px;
  }
  .el-col {
    border-radius: 4px;
    padding-top: 10px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    border: 1px solid #dcdfe6;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
