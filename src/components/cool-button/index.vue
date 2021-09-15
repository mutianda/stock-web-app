<template>
  <div :class="[prefixCls + 'box']" :style="buttonStyle">
    <span :class="[prefixCls + 'title']">
      <slot></slot>
    </span>
  </div>
</template>

<script>
const prefixCls = "cool-button-";
export default {
  name: "index",
  props: {
    type: {
      type: String,
      default: "success"
    },
    size: {
      type: String,
      default: "mini"
    }
  },
  data() {
    return {
      prefixCls: prefixCls
    };
  },
  computed: {
    buttonStyle() {
      let backgroundColor = "";
      switch (this.type) {
        case "success":
          backgroundColor = "green";
          break;
        case "danger":
          backgroundColor = "red";
          break;
      }
      const fontSize =
        this.size == "mini" ? "12px" : this.size == "small" ? "14px" : "16px";
      return {
        backgroundColor,
        fontSize
      };
    }
  }
};
</script>

<style scoped lang="less">
.cool-button-box {
  width: 100px;
  height: 20px;
  color: #fff;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  -webkit-transition: 0.1s;
  transition: 0.1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}
</style>
