<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="评估标题" v-model="listQuery.assessTitle" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select  v-model="listQuery.assessType" placeholder="评估类型" style="width: 140px" class="filter-item">
        <el-option v-for="item in assessTypeList" :key="item.type" :label="item.name" :value="item.type"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.query') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="addAssess">{{ $t('table.add') }}</el-button>
    </div>
    <spinner-loading v-if="listLoading"/>
    <el-table
      ref="multipleTable"
      :key="tableKey"
      :data="assessList"
      highlight-current-row
      style="width: 100%;">
      <!-- 评估标题 -->
      <el-table-column label="评估标题" min-width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.assessTitle }}</span>
        </template>
      </el-table-column>
      <!-- 评估内容 -->
      <el-table-column label="评估内容">
        <template slot-scope="scope">
          <span>{{ scope.row.assessContent }}</span>
        </template>
      </el-table-column>
      <!-- 评估类型 -->
      <el-table-column label="评估类型">
        <template slot-scope="scope">
          <el-tag type="success | statusTypeMap">{{ scope.row.assessType | assessTypeFilter }}</el-tag>
        </template>
      </el-table-column>
      <!-- 评估时间 -->
      <el-table-column label="评估时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | timeFilter }}</span>
        </template>
      </el-table-column>
      <!-- 备注 -->
      <el-table-column label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button  type="text" @click="updateHeadleAssess(scope.row)" >修改</el-button>
          <el-button  type="text" @click="deleteAssess(scope.row)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <!-- 新增/修改评估弹窗 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogAssessVisible" width="30vw">
      <el-form ref="assessForm" :rules="rules" label-position="right" label-width="100px" style="width: 90%;">
        <el-row>
          <el-col :span="24">
            <el-form-item label="评估标题">
              <el-input v-model="tempAssess.assessTitle"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="评估类型">
              <el-select  v-model="tempAssess.assessType" class="filter-item">
                <el-option v-for="item in assessTypeList" :key="item.type" :label="item.name" :value="item.type"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="评估内容">
              <el-input v-model="tempAssess.assessContent"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input type="textarea" v-model="tempAssess.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAssessVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createAssess">{{ $t('table.confirm') }}</el-button>
        <el-button v-else type="primary" @click="updateAssess">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPageList,addAssess,updateAssess,deleteAssess } from '@/api/appr/assess'
import waves from '@/directive/waves'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import { checkMultipleSelect, isNotEmpty, notifySuccess, notifyFail, messageSuccess, formatDate } from '@/utils/util'
import SpinnerLoading from '@/components/SpinnerLoading'

export default {
  name: 'assessment',
  components: {
    SpinnerLoading
  },
  directives: {
    waves
  },
  filters: {
    // 状态0：1
    statusTypeFilter(status) {
      const statusTypeMap = {
          0: 'success',
          1: 'danger',
        }
        return statusTypeMap[status];
    },
    // 状态0：1
    statusFilter(status) {
     const statusMap = {
        0: '未开始',
        1: '进行中',
        2: '已结束',
        3: '已取消'
      }
      return statusMap[status];
    },
    // 评估类型过滤
    assessTypeFilter (status) {
      const assessStatusMap = {
        0: '鼓励',
        1: '批评'
      }
      return assessStatusMap[status]
    },
    assessStatusTypeFilter (status) {
      const assessStatusTypeMap = {
        0: 'danger',
        1: 'success'
      }
      return assessStatusTypeMap[status]
    },
    timeFilter (time) {
      return formatDate(new Date(time), 'yyyy-MM-dd')
    }
  },
  data () {
    return {
      tableKey: 0,
      total: null,
      listLoading: true,
      roleListLoading: true,
      multipleSelection: [],

      // 查询条件
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        assessTitle: '',
        assessType: '',
        sort: 'create_time',
        order: 'descending'
      },
      // 评估列表
      assessList:[],
      // 新增/修改评估弹窗开关
      dialogAssessVisible:false,
      // 新增/修改评估实体
      tempAssess: {
        assessTitle: '',
        assessContent: '',
        assessType: '',
        remarks: ''
      },


      tempRole: null,
      rules: {
        name: [{ required: true, message: '请输入账号', trigger: 'change' }],
        username: [{ required: true, message: '请输入姓名', trigger: 'change' }],
      },
      // 记录窗口显示与否
      dialogRecordVisible: false,
      // 当前点击记录的行id
      currentRowId: null,

      downloadLoading: false,
      assessTypeList: [
        { type: '0', name: '鼓励' },
        { type: '1', name: '批评' }
      ],
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
    }
  },
  created () {
    this.getList()
  },
  computed: {
    ...mapGetters([
      'elements',
      'permissions'
    ])
  },
  methods: {
    // 获取列表数据
    getList () {
      this.listLoading = true
      fetchPageList(this.listQuery).then(response => {
        this.assessList = response.data.list
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      })
    },
    handleFilter () {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleSizeChange (val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    // 打开新增评估弹窗
    addAssess () {
      this.resetAssess()
      this.dialogStatus = 'create';
      this.dialogAssessVisible = true
    },
    // 初始化新增评估弹窗
    resetAssess () {
      this.tempAssess = {
        assessTitle: '',
        assessContent: '',
        assessType: '',
        remarks: ''
      }
    },
    // 新增评估
    createAssess () {
      addAssess(this.tempAssess).then((response) => {
        this.dialogAssessVisible = false
        notifySuccess(this,'新增成功')
        this.getList()
      })
    },
    // 打开修改评估弹窗
    updateHeadleAssess (row) {
      this.resetAssess()
      this.dialogStatus = 'update';
      this.dialogAssessVisible = true
      this.tempAssess = Object.assign({}, row);
    },
    // 修改评估弹窗
    updateAssess () {
      updateAssess(this.tempAssess).then((response) => {
        this.dialogAssessVisible = false
        notifySuccess(this,'修改成功')
        this.getList()
      })
    },
    // 删除评估弹窗
    deleteAssess (row) {
      this.$confirm('是否删除该评估?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAssess(row.id).then((response) => {
          this.dialogAssessVisible = false
          notifySuccess(this,'删除成功')
          this.getList()
        })
      })
      
    }
  }
}
</script>
