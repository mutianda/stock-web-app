<template>
  <el-dialog
    title="新增推送"
    :visible="showAddOrEditModal"
    width="330px"
    @close="closeModal"
  >
    <el-form
      :model="addOrEditForm"
      ref="addOrEditForm"
      inline
      label-width="70px"
    >
      <el-form-item label="股票代码">
        <el-input
          v-model="addOrEditForm.share_code"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="股票名称">
        <el-input
          v-model="addOrEditForm.share_name"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="突破位">
        <el-input
          v-model="addOrEditForm.price_rise"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="跌破位">
        <el-input
          v-model="addOrEditForm.price_down"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="换手率">
        <el-input
          v-model="addOrEditForm.turn_hand"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="涨幅">
        <el-input
          v-model="addOrEditForm.limit_up"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeModal">取 消</el-button>
      <el-button type="primary" @click="addOrEditSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "addOrEditModal",

  data() {
    return {
      showAddOrEditModal: false,
      isEdit: false,
      axios: this.$_api.realTime,
      addOrEditForm: {
        user_id: 1,
        share_code: "",
        share_name: "",
        price_rise: "",
        turn_hand: "",
        limit_up: "",
        price_down: ""
      }
    };
  },
  methods: {
    openModal(row, isEdit) {
      this.addOrEditForm = { ...this.addOrEditForm, ...row };
      this.isEdit = isEdit;
      this.showAddOrEditModal = true;
    },
    addOrEditSubmit() {
      this.$refs["addOrEditForm"].validate(valid => {
        if (valid) {
          this.axios[!this.isEdit ? "addRealTimePush" : "editRealTimePush"](
            this.addOrEditForm
          ).then(res => {
            this.$message.success("操作成功");
            this.$emit("getTable");
            this.closeModal();
          });
        } else {
          return false;
        }
      });
    },
    closeModal() {
      this.showAddOrEditModal = false;
      this.addOrEditForm = {
        user_id: 1,
        share_code: "",
        share_name: "",
        price_rise: "",
        turn_hand: "",
        limit_up: "",
        price_down: ""
      };
    }
  }
};
</script>

<style lang="less" >
  /deep/.el-input{
    width: 150px !important;
  }
</style>
