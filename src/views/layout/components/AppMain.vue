<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import { mapState } from "vuex";
import store from "@/store";
export default {
  name: "AppMain",
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      return this.$route.fullPath;
    },
    // 获取用户信息
    ...mapState({
      userInfo: state => state.user.userInfo,
      course: state => state.course.course,
      sysConfig: state => state.sysConfig.sysConfig
    })
  },
  mounted() {
    this.initWebSocket();
  },
  data() {
    return {
      queueReceiveSetting: {
        // 消息队列配置
        websock: null,
        client: null,
        wsuri: "ws://172.16.124.153:8100/websocket/"
      }
    };
  },
  methods: {
    createMQ(message) {
      this.$notify.info({
        title: "消息",
        message: message,
        showClose: true,
        duration: 0,
        position: "bottom-right"
      });
    },
    initWebSocket() {
      // ws地址
      if (this.queueReceiveSetting.websock) {
        this.queueReceiveSetting.websock.close();
      }
      this.queueReceiveSetting.websock = new WebSocket(
        this.queueReceiveSetting.wsuri + this.userInfo.id
      );
      this.queueReceiveSetting.websock.onopen = res => {
        console.log("开启连接");
      };
      this.queueReceiveSetting.websock.onmessage = res => {
        const query = JSON.parse(res.data);
        const recordMsg = `您有新的会议【${query.message}】需要参加，请及时前往【我的会议】中进行处理，如不处理，默认您可以参加`;
        const taskMsg = `您有新的任务【${query.message}】需要执行，请及时前往【我的任务】中进行查看`;
        if (query.code == '1') {
          this.createMQ(recordMsg);
        } else {
          this.createMQ(taskMsg);
        }
        
      };
      this.queueReceiveSetting.websock.onclose = res => {
        console.log("连接关闭");
      };
      this.queueReceiveSetting.websock.onerror = res => {
        console.log("连接出错");
      };
    }
  }
};
</script>

<style scoped>
.app-main {
  /*84 = navbar + tags-view = 50 +34 */
  min-height: calc(100vh - 84px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>
