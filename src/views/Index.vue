<template>
  <div>
    <h1>主页内容</h1>
    <h2>导航</h2>
    <m-header></m-header>
    <!-- 子路由的出口-->
    <router-view></router-view>
  </div>
</template>

<script>
import MHeader from '../common/MHeader.vue';
export default {
  components: {
    MHeader
  },
}
</script>

<style lang="scss" scoped>

</style>