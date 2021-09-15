<template>
  <div class="modal-view">
    <div class="info-box">
      <el-timeline>
        <el-timeline-item
          :timestamp="item.f58"
          :hide-timestamp="true"
          placement="top"
          v-for="(item, index) in tableData"
          :key="index"
        >
          <el-card class="item-card">
            <div
              class="item-desc"
              :style="{ color: item.pushType == 'up' ? 'red' : 'green' }"
            >
              <i
                class="el-icon-delete"
                style="cursor: pointer"
                @click="removeRealTimePush(item)"
              ></i>
              {{ item.desc }}
            </div>
            <div class="item-detail">
              <div :style="{ color: item.pushType == 'up' ? 'red' : 'green' }">
                name:{{ item.f58 }}
              </div>
              <div>price：{{ item.f43 }}</div>
              <div>up：{{ item.price_rise }}</div>
              <div>percent：{{ item.f170 }}%</div>
              <div>turn-hand：{{ item.f168 }}%</div>
              <div>down：{{ item.price_down }}</div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
    <slot name="btn"></slot>
  </div>
</template>

<script>
export default {
  name: "addOrEditModal",
  props: {
    tableData: {
      type: Array,
      default: []
    }
  },

  data() {
    return {};
  },
  methods: {
    removeRealTimePush(item) {
      this.$_api.realTime
        .removeRealTimePush({ share_code: row.share_code })
        .then(res => {});
    }
  }
};
</script>

<style scoped lang="less">
.modal-view {
  .info-box {
    width: 470px;
    margin-left: 20px;
    max-height: 300px;
    text-align: center;
    overflow-y: auto;
    -webkit-app-region: drag;
    /deep/.el-card__body {
      width: 100%;
      display: flex;
      padding: 5px;
      align-items: center;
      justify-items: center;
      opacity: 0.5;
      .item-desc {
        width: 50px;
        font-size: 18px;
      }
      .item-detail {
        flex: 1;
        display: flex;
        text-align: left;
        flex-wrap: wrap;
        div {
          width: 100px;
        }
      }
    }
  }
}
</style>
