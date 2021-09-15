<template>
  <div :class="[prefixCls + 'mask']" v-if="show">
    <div
      :class="[prefixCls + 'box']"
      :style="modalStyle"
      @dragstart="handleMoveStart"
      draggable="true"
      @touchstart="mousedown"
      @touchend="mouseup"
      @dragend="handleMoveEnd"
    >
      <div :class="[prefixCls + 'header']">
        <slot name="header">
          <div :class="[prefixCls + 'title']">
            {{ title }}
          </div>
        </slot>
        <i
          class="el-icon-close close-icon"
          @click="closeModal"
          draggable="false"
        ></i>
      </div>
      <div :class="[prefixCls + 'content']">
        <slot></slot>
      </div>
      <div :class="[prefixCls + 'bottom']">
        <slot name="bottom"></slot>
      </div>
    </div>
  </div>
</template>

<script>
const prefixCls = "cool-modal-";
export default {
  name: "index",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "弹窗"
    },
    width: {
      type: [Number, String],
      default: "30%"
    },
    footHide: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      prefixCls: prefixCls,
      dragDetail: {
        dragStart: {
          x: 0,
          y: 0
        },
        dragEnd: {
          x: 0,
          y: 0
        }
      },
      style: {
        top: 500,
        left: 500
      }
    };
  },
  computed: {
    modalStyle() {
      return {
        top: this.style.top + "px",
        left: this.style.left + "px",
        width: this.width
      };
    }
  },
  methods: {
    handleMoveStart(e) {
      const { clientX, clientY } = e;
      this.dragDetail.dragStart.x = e.clientX;
      this.dragDetail.dragStart.y = e.clientY;
    },
    handleMoveEnd(e) {
      this.dragDetail.dragEnd.x = e.clientX;
      this.dragDetail.dragEnd.y = e.clientY;
      const { clientX, clientY } = e;
      this.style.top += this.dragDetail.dragEnd.y - this.dragDetail.dragStart.y;
      this.style.left +=
        this.dragDetail.dragEnd.x - this.dragDetail.dragStart.x;
    },
    mousedown(e) {
      if (e.type == "touchstart") {
        const ev = e.changedTouches[0];
        this.dragDetail.dragStart.x = ev.screenX;
        this.dragDetail.dragStart.y = ev.screenY;
      }
    },
    mouseup(e) {
      if (e.type == "touchend") {
        const ev = e.changedTouches[0];
        if (ev) {
          const { screenX, screenY } = ev;
          this.dragDetail.dragEnd.x = screenX;
          this.dragDetail.dragEnd.y = screenY;
          this.style.top +=
            this.dragDetail.dragEnd.y - this.dragDetail.dragStart.y;
          this.style.left +=
            this.dragDetail.dragEnd.x - this.dragDetail.dragStart.x;
        }
      }
    },
    closeModal() {
      this.$emit("update:show", false);
    }
  }
};
</script>

<style scoped lang="less">
.cool-modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(1, 1, 1, 0.1);
  color: #111;
  z-index: 999999;
  .cool-modal-box {
    position: absolute;
    height: auto;
    transform: translate(-50%, -50%);
    background: #fff;
    cursor: move;
    .cool-modal-header {
      height: 50px;
      line-height: 50px;
      text-align: center;
      background: #eee;
      border-bottom: 0.1px solid #eee;
      position: relative;
      .close-icon {
        color: #aaa;
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
        font-size: 18px;
      }
    }
    .cool-modal-content {
      color: #111;
      padding: 14px;
    }
    .cool-modal-bottom {
      height: 60px;
      line-height: 60px;
      text-align: center;
    }
  }
}
</style>
