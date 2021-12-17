<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive include='InterfaceTesting'>
				<router-view :key="key" />
			</keep-alive>
      <!-- <router-view :key="key" /> -->
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
/* //滚动条的宽度 */
::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}

/* //滚动条的滑块 */

::-webkit-scrollbar-thumb {
  background-color: #a1a3a9;
  border-radius: 3px;
}
</style>
