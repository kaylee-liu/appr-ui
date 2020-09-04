<template>
  <div class="navbar">
    <Hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburger-container"
    />

    <breadcrumb class="breadcrumb-container" />
    <!-- before  -->
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <a
        class="animated fadeIn hi"
        @click="pointsExchange()"
        >积分兑换
        </a>
        <a
          class="animated fadeIn hi"
          style="cursor: pointer;"
          @click="getScoreList()"
        >总积分【{{totalScore}}】</a>

        <el-popover placement="top" width="160" v-model="visible">
          <p>签到积分【{{signScore}}】</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible = false">取消</el-button>
            <el-button
              type="primary"
              size="mini"
              v-if="isSign"
              @click="visible = false"
              disabled
            >已签到</el-button>
            <el-button type="primary" size="mini" v-else @click="setSignIn">签到</el-button>
          </div>
          <svg-icon class="edit-svg" icon-class="signIn" slot="reference" />
        </el-popover>

        <el-tooltip content="记分规则" effect="dark" placement="bottom">
          <span @click="showScoring">
            <svg-icon class="help-svg" icon-class="help" />
          </span>
        </el-tooltip>

        <el-tooltip :content="$t('navbar.enjoy')" effect="dark" placement="bottom">
          <span @click="shareQrcode">
            <svg-icon class="edit-svg" icon-class="enjoy" />
          </span>
        </el-tooltip>

        <el-tooltip :content="$t('navbar.screenfull')" effect="dark" placement="bottom">
          <screenfull class="screenfull right-menu-item" />
        </el-tooltip>

        <!-- <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select class="international right-menu-item"/>
        </el-tooltip>-->

        <!-- <el-tooltip :content="$t('navbar.theme')" effect="dark" placement="bottom">
          <theme-picker class="theme-switch right-menu-item"/>
        </el-tooltip>-->
      </template>

      <!-- <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img :src="userInfo.avatarUrl" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/personal/message">
            <el-dropdown-item>
              个人资料
            </el-dropdown-item>
          </router-link>
          <router-link to="/personal/password">
            <el-dropdown-item>
              修改密码
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>-->
    </div>
    <!-- 生成二维码的弹窗 -->
    <el-dialog :visible.sync="qrcodeDialog" width="440px">
      <vue-qr ref="qrCode" :logoSrc="config.logo" :text="config.value" :size="400" :margin="0"></vue-qr>
      <el-button @click="downloadQrcode">下载</el-button>
    </el-dialog>

    <!-- 明细 -->
    <el-dialog :visible.sync="scoreDialog">
      <el-table :data="scoreList" style="font-size:16px">
        <el-table-column label="明细">
          <template slot-scope="scope">
            <span>{{ scope.row }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 积分兑换 -->
    <el-dialog :visible.sync="pointsExchangeDialog">
      <PointsExchange />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import PointsExchange from '@/components/PointsExchange'
import Lock from '@/components/Lock'
import VueQr from 'vue-qr'
import { isSignIn, signIn, signInScore } from '@/api/appr/signIn'
import { getUserCode, getMyScoreAll, scoreList } from '@/api/appr/score'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker,
    Lock,
    VueQr,
    PointsExchange
  },
  data () {
    return {
      avatarUrl: '',
      totalScore: '0',
      qrcodeDialog: false,
      config: {
        value: '', // 显示的值、跳转的地址
        logo: '../../../static/img/little.gif' // 中间logo的地址
      },
      visible: false,
      isSign: null,
      signScore: '0',
      scoreDialog: false,
      scoreList: null,
      pointsExchangeDialog: false
    }
  },
  created () {
    this.userInfo.sex = parseInt(this.userInfo.sex)
  },
  computed: {
    ...mapGetters(['sidebar', 'name', 'avatar', 'device']),
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  mounted () {
    this.getSignStatus()
  },
  methods: {
    getSignStatus () {
      signInScore().then(res => {
        this.signScore = res.data.data
      })
      isSignIn().then(res => {
        this.isSign = res.data.data
      })
      getMyScoreAll().then(res => {
        this.totalScore = res.data.data
      })
    },
    toggleSideBar () {
      this.$store.dispatch('toggleSideBar')
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    // 生成分享二维码
    shareQrcode () {
      getUserCode().then(res => {
        const name = res.data.data.name
        const deptName = res.data.data.deptName
        const identifier = res.data.data.roles
        const score = res.data.data.score
        this.config.value = `姓名： ${name} ，部门： ${deptName} ，角色： ${identifier} ，累计积分： ${score} `
        this.qrcodeDialog = true
      })
    },
    downloadQrcode () {
      this.downloadImg()
    },
    downloadImg () {
      var oQrcode = this.$refs.qrCode.$el
      var url = oQrcode.src
      var a = document.createElement('a')
      var event = new MouseEvent('click') // 下载图名字
      a.download = `${this.$store.state.user.userInfo.name}的二维码` // url
      a.href = url // 合成函数，执行下载
      a.dispatchEvent(event)
    },
    setSignIn () {
      signIn().then(res => {
        if (res.data) {
          this.$message({
            message: '签到成功',
            type: 'success'
          })
          this.getSignStatus()
        }
      })
    },
    // 获取明细列表
    getScoreList () {
      scoreList().then(res => {
        this.scoreDialog = true
        this.scoreList = res.data.data
      })
    },
    // 积分兑换
    pointsExchange () {
      let _this = this
      _this.pointsExchangeDialog = true
    },
    showScoring () {
      this.$notify({
        title: '计分规则',
        dangerouslyUseHTMLString: true,
        message: '<p>总积分体现贡献度，由下列积分项构成：<p/> <p>1.签到积分：每日可以签到一次，每次计1分。<p/> <p> 2.任务积分：由领导小组下发任务，完成任务后将进行评分。<p/> <p>3.例会积分：目前例会情况主要为日报功能，各单位填写日报后将进行评分。<p/> <p>4.数据共享积分：希望各单位之间多进行数据共享，填写共享内容后将进行评分。<p/> <p>5.措施建议：各单位对社管平台提出措施及建议，填写内容后将进行评分。<p/> <p>6.积分奖励：领导小组对有突出贡献的单位进行嘉奖',
        duration: 0
      })
    }
  },
  logout () {
    this.$store.dispatch('LogOut').then(() => {
      location.reload() // In order to re-instantiate the vue-router object to avoid bugs
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .edit-svg {
    display: inline-block;
    cursor: pointer;
    fill: #5a5e66 !important;
    width: 20px !important;
    height: 20px !important;
    vertical-align: 10px !important;
    margin-right: 15px;
  }
  .help-svg {
    display: inline-block;
    cursor: pointer;
    fill: #5a5e66 !important;
    width: 20px !important;
    height: 20px !important;
    vertical-align: 10px !important;
    margin-right: 15px;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .lock {
      height: 20px;
    }
    .screenfull {
      height: 20px;
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
    .hi {
      vertical-align: 15px;
      margin-right: 5px;
    }
  }
}
</style>
