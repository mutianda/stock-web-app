<template>
  <el-pagination
    v-bind="$attrs"
    v-on="$listeners"
    :total="pagination.total"
    :page-size="pagination.pageSize"
    :current-page="pagination.pageNum"
    @size-change="sizeChange"
    @current-change="currentChange"
  >
  </el-pagination>
</template>

<script>
export default {
  name: "index",
  props: {
    pageConfig: {
      type: Object,
      default() {
        return {
          total: 0,
          pageSize: 10,
          pageNum: 1
        };
      }
    }
  },
  computed: {
    pagination() {
      const page = {
        total: 0,
        pageSize: 10,
        pageNum: 1
      };
      return {
        ...page,
        ...this.pageConfig
      };
    }
  },
  data() {
    return {};
  },
  methods: {
    sizeChange(pageSize) {
      this.$emit("page-change", pageSize, this.pagination.pageNum);
    },
    currentChange(pageNum) {
      this.$emit("page-change", this.pagination.pageSize, pageNum);
    }
  }
};
</script>

<style scoped></style>
