<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup name="App">
import { store } from '@/pinia'
// export default {
//   name: 'App',
// created() {
//   debugger
//   if (sessionStorage.getItem('_store_')) {
//     store.$state = (Object.assign({}, store.state, JSON.parse(sessionStorage.getItem('_store_'))))
//   }
//   window.addEventListener('beforeunload', () => {
//     debugger
//     sessionStorage.setItem('_store_', JSON.stringify(store.state))
//   })
// },
// beforeUnmount() {
//   alert(1)
// }
// }
</script>

<style lang="scss">
// 引入初始化样式
@import '@/style/main.scss';
@import '@/style/base.scss';
@import '@/style/mobile.scss';
#app {
  background: #eee;
  height: 100vh;
  overflow: hidden;
  font-weight: 400 !important;
}
.el-button{
  font-weight: 400 !important;
}
</style>
