<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-form :model="numberValidateForm" ref="numberValidateForm"> -->
      <el-form>
        <el-input :placeholder="$t('table.task.name')" v-model="listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
        <el-select v-model="listQuery.status" :placeholder="$t('table.status')" style="width: 140px" class="filter-item" @change="handleFilter">
          <el-option v-for="item in conferenceStatusList" :key="item.type" :label="item.name" :value="item.type"/>
        </el-select>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.query') }}</el-button>
      </el-form>
    </div>
    <!-- <div class="filter-container">
      <el-input placeholder="输入任务名查询" v-model="listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.query') }}</el-button>
      <el-button v-if="user_btn_add" class="filter-item" icon="el-icon-check" plain @click="handleCreate">{{ $t('table.add') }}</el-button>
      <el-button v-if="user_btn_del" class="filter-item" icon="el-icon-delete" plain @click="handleDeletes">{{ $t('table.del') }}</el-button>
    </div> -->
    <spinner-loading v-if="listLoading"/>
    <el-table
      ref="multipleTable"
      :key="tableKey"
      :data="list"
      highlight-current-row
      style="width: 100%;"
      @cell-dblclick="handleUpdate"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange">
      <!-- @cell-dblclick="handleUpdate"双击单元格实现编辑 -->
      <!--  @selection-change="handleSelectionChange"数据多选，多页选择数据回显，分页选择保存选中的数据 -->
      <!-- 获取当前的字段名和排序顺序，从而向接口请求排序后的报个数据 -->
      <el-table-column type="selection"/>
      <!-- 编号 -->
      <!-- <el-table-column :label="$t('table.task.number')" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column> -->
      <!-- 任务名 -->
      <el-table-column :label="$t('table.task.name')">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <!-- 发布人 -->
      <!-- <el-table-column :label="$t('table.task.createUser')">
        <template slot-scope="scope">
          <span>{{ scope.row.createUser}}</span>
        </template>
      </el-table-column> -->
      <!-- 责任人 -->
      <el-table-column :label="$t('table.task.personId')">
        <template slot-scope="scope">
          <span>{{ scope.row.personName }}</span>
        </template>
      </el-table-column>
      <!-- 协助人 -->
      <!-- <el-table-column :label="$t('table.task.assistingperson')">
        <template slot-scope="scope">
          <span>{{ scope.row.assistingperson }} </span>
        </template>
      </el-table-column> -->
      <!-- 所属项目 -->
      <!-- <el-table-column :label="$t('table.task.project')">
        <template slot-scope="scope">
          <span>{{ scope.row.project }}</span>
        </template>
      </el-table-column> -->
      <!-- 任务部门 -->
      <el-table-column :label="$t('table.task.departId')">
        <template slot-scope="scope">
          <span>{{ scope.row.departName }}</span>
        </template>
       </el-table-column>
        <!-- 优先级 -->
      <el-table-column :label="$t('table.task.priority')">
        <template slot-scope="scope">
          <el-tag :type="scope.row.priority | priorityTypeFilter">{{ scope.row.priority | priorityFilter }}</el-tag>
        </template>
       </el-table-column>
       <!-- 状态 -->
       <el-table-column :label="$t('table.status')">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusTypeFilter">{{ scope.row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <!-- 开始时间 -->
      <el-table-column :label="$t('table.startTime')">
        <template slot-scope="scope">
          <span>{{scope.row.startTime | timeFilter  }}</span>
        </template>
       </el-table-column>
       <!-- 结束时间 -->
       <el-table-column :label="$t('table.endTime')">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime | timeFilter }}</span>
        </template>
       </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('table.actions')" class-name="status-col">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-view" @click="viewTask(scope.row)">{{ $t('table.task.view') }}</el-button>
          <el-button v-if="user_btn_del" type="text" icon="el-icon-delete"  @click="handleDelete(scope.row)">{{ $t('table.del') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

     <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="listQuery.pageNum"
          :page-sizes="[10, 20, 50]"
          @next-click="next"
          :page-size="listQuery.pageSize"
          @prev-click="after"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
  </div>
</template>

<script>
import { fetchList, fetchPageList, addObj, getObj, putObj, delObj, deleteTask } from '@/api/appr/HomeTaskHall'
import waves from '@/directive/waves'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import { checkMultipleSelect, isNotEmpty, notifySuccess, notifyFail, messageSuccess, formatDate } from '@/utils/util'
import SpinnerLoading from '@/components/SpinnerLoading'

export default {
  name: 'HomeTaskHall',
  components: {
    SpinnerLoading
  },
  directives: {
    waves
  },
  filters: {
    // 状态0：1
    statusTypeFilter (status) {
      const statusTypeMap = {
        0: 'success',
        1: 'success',
        2: 'danger',
        3: 'danger'
      }
      return statusTypeMap[status]
    },
    // 优先级123
    priorityTypeFilter (priority) {
      const priorityMap = {
        1: 'success',
        2: 'danger',
        3: 'warning'
      }
      return priorityMap[priority]
      },
    // 状态0：1
    statusFilter (status) {
      const statusMap = {
        0: '新建',
        1: '执行中',
        2: '已完成',
        3: '已评分'
      }
      return statusMap[status]
    },
    // 优先级123
    priorityFilter (priority) {
      const priorityMap = {
      1: '低',
      2: '中',
      3: '高',
    }
      return priorityMap[priority]
    },
    timeFilter (time) {
      return formatDate(new Date(time), 'yyyy-MM-dd')
      }
    },
  data () {
    // 校验手机号码
    const checkPhone = (rule, value, callback) => {
      if (!(/^1[34578]\d{9}$/.test(value))) {
        callback(new Error('请输入正确的手机号码!'))
      } else {
        callback()
      }
    }
    return {
      tableKey: 0,
      // list 数据列表
      list: null,
      total: null,
      listLoading: true,
      roleListLoading: true,
      multipleSelection: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
      },
      tempRole: null,
      rules: {
        name: [{ required: true, message: '请输入账号', trigger: 'change' }],
        username: [{ required: true, message: '请输入姓名', trigger: 'change' }],
      },
      downloadLoading: false,
      // 部门列表treeDeptData
      treeDeptData: [],
      // 角色列表roleData
      roleData: [],
      // temp初始化表单
      conferenceStatusList: [
        { type: '0', name: '新建' },
        { type: '1', name: '执行中' },  
        { type: '2', name: '已完成' },
        { type: '3', name: '已评分' }
      ],
      // 部门列表传的参数
      defaultDeptProps: {
        children: 'children',
        label: 'deptName'
      },
      aExpandedKeys: [],
      user_btn_add: false,
      user_btn_edit: false,
      user_btn_del: false,
      user_btn_import: false,
      user_btn_export: false,
      importUrl: '/api/user/v1/user/import',
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      uploading: false,
      percentage: 0,
      tempRadio: 0,
      temp: {
        number:1,
        name:'',
        personId:'',
        createUser:'',
        priority:'',
        assistingperson:'',
        project:'',
        departId:'',
        startTime: null,
        endTime: null,
        status: '',
      },
    }
  },
  created () {
    this.getList()
    this.user_btn_add = this.permissions['sys:user:add']
    this.user_btn_edit = this.permissions['sys:user:edit']
    this.user_btn_del = this.permissions['sys:user:del']
  },
  computed: {
    ...mapGetters([
      'elements',
      'permissions'
    ])
  },
  methods: {
    nodeCollapse (data) {
      this.oExpandedKey[data.id] = false
      // 如果有子节点
      this.treeRecursion(this.oTreeNodeChildren[data.id], (oNode) => {
        this.oExpandedKey[oNode.id] = false
      })
      this.setExpandedKeys()
    },
    setExpandedKeys () {
      const oTemp = this.oExpandedKey
      this.aExpandedKeys = []
      for (const sKey in oTemp) {
        if (oTemp[sKey]) {
          this.aExpandedKeys.push(parseInt(sKey))
        }
      }
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    nodeExpand (data) {
      const aChildren = data.children
      if (aChildren.length > 0) {
        this.oExpandedKey[data.id] = true
        this.oTreeNodeChildren[data.id] = aChildren
      }
      this.setExpandedKeys()
    },
    getList () {
      this.listLoading = true
      fetchPageList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      })
    },

  //前端搜索功能需要区分是否检索,因为对应的字段的索引不同
    handleFilter() {
      if (this.tableDataName == "") {
        this.$message.warning("查询条件不能为空！");
        return;
      }
      this.List = [];
      //页面数据改变重新统计数据数量和当前页
      this.listQuery.pageNum= 1;
      this.getList();
    },
    next(data) {
      this.listQuery.pageNum = data;
      this.getList();
    },
    after(data) {
      this.listQuery.pageNum = data;
      this.getList();
    },
    handleSizeChange1: function(pageSize) {
      //每页条数切换
      this.listQuery.pageSize = pageSize;
      this.getList();
    },
    handleCurrentChange1: function(currentPage) {
      //页码切换
      this.listQuery.pageNum = currentPage;
      this.getList();
    },
    // 自定义方法接收成功的提醒
    handleModifyStatus (row, status) {
      row.status = status
      putObj(row).then(() => {
        this.dialogFormVisible = false
        messageSuccess(this, '操作成功')
      })
    },
    // 新增
    handleCreate () {
      this.role = []
      this.roleData = []
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.clearValidate()
        // this.$refs['dataForm'].clearValidate()
      })
    },
    // 编辑页与新增页的创建
    createData () {
       this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addObj(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.getList()
            notifySuccess(this, '创建成功')
          })
        }
      })
    },
    // 编辑功能
    handleUpdate (row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.readonly = true
      this.dialogStatus = 'update'
      if (isNotEmpty(this.temp.roleList) && this.temp.roleList.length > 0) {
        this.tempRole = this.temp.roleList[0]
        this.temp.roleId = this.tempRole.id
        this.temp.roleName = this.tempRole.roleName
        this.temp.role = [].concat(this.temp.roleId)
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 数据得更新修改
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          putObj(tempData).then(() => {
            this.dialogFormVisible = false
            this.getList()
            notifySuccess(this, '更新成功')
          })
        }
      })
    },
    handleDelete (row) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTask(row.id).then(() => {
          this.dialogFormVisible = false
          this.getList()
          notifySuccess(this, '删除成功')
        })
      }).catch(() => {})
    },
    
    // 搜索页的
    handleSelectionChange (data) {
      this.multipleSelection = data
    },
    sortChange (column, prop, order) {
      this.listQuery.sort = column.prop
      this.listQuery.order = column.order
      this.getList()
    },
    // 协助人
    handleSelectDept () {
      fetchTree().then(response => {
        this.treeDeptData = response.data
        this.dialogDeptVisible = true
      })
    },
    getDeptNodeData (data) {
      this.dialogDeptVisible = false
      this.temp.deptId = data.id
      this.temp.deptName = data.deptName
    },
    handleSelectRole () {
      allRoles().then(response => {
        this.roleData = response.data.data
        this.dialogRoleVisible = true
        this.roleListLoading = false
      })
    },
    // 选中角色
    handleSingleRoleSelection (row) {
      this.tempRadio = this.roleData.indexOf(row)
    },
    // 表格变化
    handleSingleRoleCurrentChange (row) {
      this.tempRole = row
    },
    handleSingleRoleSelectionChange (index, row) {
      this.tempRole = row
    },
    updateRoleData () {
      this.dialogRoleVisible = false
      if (isNotEmpty(this.tempRole)) {
        this.temp.roleId = this.tempRole.id
        this.temp.role = [].concat(this.tempRole.id)
        this.temp.roleName = this.tempRole.roleName
      }
    },
    viewTask (row) {
      this.$router.push({
        path: `/appearInfo/${row.id}/view`
      });
    }
  }
}
</script>