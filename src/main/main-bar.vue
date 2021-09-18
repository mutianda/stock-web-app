<template>
  <div class="menu-bar" v-if="value">
    <div v-for="(item, index) in menuList" :key="index" class="menu-item" @click="handleSelect(item.name)" :class="{'active-menu':activeRouter==item.name}">

        <img :src="item.activeIcon"v-if="activeRouter==item.name"  class="menu-icon">
        <img :src="item.unactiveIcon"v-else  class="menu-icon">

      <div class="menu-name">
        {{item.title}}
      </div>
    </div>

  </div>

</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    menuList() {
      return this.$store.state.common.routerList.filter(item => !item.hidePage).map(item=>{
        item.activeIcon = require(`../assets/img/${item.icon[0]}.png`)
        item.unactiveIcon = require(`../assets/img/${item.icon[1]}.png`)
        return item
      })
    },
    activeRouter() {
      return this.$route.name;
    }
  },
  mounted() {
    console.log(this.menuList, this.$route.name);
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(this.$route);
      console.log(key);
      this.$router.push({
        name: key
      });
    },
  }
};
</script>

<style scoped lang="less">
  .menu-bar{
    width: 100%;
    display: flex;
    align-items: center;
    justify-items: center;
    color: #888;
    .menu-item{
      flex: 1;
      &.active-menu{
        color: red;

      }
      .menu-icon{
        width: 22px;
        height: 22px;
        margin: 0 auto;
      }
      .menu-name{
        font-size: 8px;
      }

    }
  }


</style>
