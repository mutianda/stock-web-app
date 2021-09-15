<template>
  <div class="real-time">
    <div class="search-bar">
      <div class="search-item">
        <div class="item-label">名称</div>
        <div class="item-input">
          <el-input v-model="stockName" size="mini"></el-input>
        </div>
      </div>
      <div class="search-item">
        <div class="item-label">名称</div>
        <div class="item-input">
          <el-input v-model="stockName" size="mini"></el-input>
        </div>
      </div>
      <div class="search-item">
        <div class="item-label">名称</div>
        <div class="item-input">
          <el-input v-model="stockName" size="mini"></el-input>
        </div>
      </div>

      <div class="search-item">
        <el-button type="primary" @click="getTable(true)" size="mini"
          >查询</el-button
        >
        <el-button type="success" @click="addOrEdit({}, false)" size="mini"
          >新增</el-button
        >
      </div>
    </div>
    <div class="table-box">
      <el-table
        :data="tableData"
        stripe
        class="custom-table"
        height="90%"
        :border="true"
      >
        <el-table-column prop="share_code" label="股票编码" width="180">
        </el-table-column>
        <el-table-column prop="share_name" label="股票名称" width="180">
        </el-table-column>
        <el-table-column prop="price_rise" label="突破位"> </el-table-column>
        <el-table-column prop="price_down" label="跌破位"> </el-table-column>
        <el-table-column prop="turn_hand" label="换手率"> </el-table-column>
        <el-table-column prop="limit_up" label="涨幅"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button @click="addOrEdit(row, true)" type="warning" size="mini"
              >编辑</el-button
            >
            <el-button @click="remove(row)" type="danger" size="mini"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <common-pagination :pageObj="searchForm" @page-change="pageChange"></common-pagination>
    </div>
    <add-or-edit-modal ref="addOrEditForm" @getTable="getTable" />
  </div>
</template>

<script>
import AddOrEditModal from "@v/components/real-time-modal";

export default {
  name: "index",
  components: { AddOrEditModal },
  data() {
    return {
      stockName: "",
      axios: this.$_api.realTime,
      searchForm: {
        pageNum: 1,
        pageSize: 200,
        total:0
      },
      tableData: []
    };
  },
  provide() {
    return {
      axios: this.axios
    };
  },

  activated() {
    this.getTable();
  },
  methods: {
    pageChange(pageSize,pageNum){
      //咋啦
    },
    getTable(flag) {
      flag && (this.searchForm.pageNum = 1);
      this.axios.getRealTimePush({ ...this.searchForm }).then(res => {
        this.tableData = res.data;
        this.searchForm.total = 1000
      });
    },
    addOrEdit(data = {}, isEdit) {
      this.$refs.addOrEditForm.openModal(data, isEdit);
    },
    remove(row) {
      this.axios
        .removeRealTimePush({ share_code: row.share_code })
        .then(res => {
          this.$message.success("删除成功");
          this.getTable();
        });
    }
  }
};
</script>

<style scoped lang="less">
.real-time {
  display: flex;
  flex-direction: column;
  .search-bar {
    color: #555;
  }
  .table-box {
    height: calc(100% - 70px);
  }
}
</style>
