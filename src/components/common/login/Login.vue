<template>
  <div class="login">
    <h1>医疗物资管理系统</h1>
    <el-card>
      <el-form ref="formRef" :rules="formRules" status-icon :model="formData">
        <h3>系统登录</h3>
        <el-form-item>
          <el-input prefix-icon="el-icon-user" v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input show-password prefix-icon="el-icon-suitcase" v-model="formData.password"></el-input>
        </el-form-item>
        <el-checkbox v-model="checked">记住密码</el-checkbox>
        <el-form-item class="form-commit">
          <el-button type="primary" icon="el-icon-finished" @click="submitFormData">登录</el-button>
          <el-button icon="el-icon-refresh" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <Vcode :canvasWidth="450" :canvasHeight="400" :show="isShow" @success="success" @close="close" />
  </div>
</template>

<script>
import Vcode from "vue-puzzle-vcode";
export default {
  name: "Login",
  components: {
    Vcode,
  },
  data() {
    return {
      isShow: false, //滑块验证码模态框是否出现
      checked: true,
      formData: {
        username: "系统测试人员",
        password: "123456",
      },
      formRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 4, message: "长度在 2 到 4 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 4, max: 6, message: "长度在 4 到 6 个字符", trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  methods: {
    //提交表单
    submitFormData() {
      this.$refs.formRef.validate((valid) => {
        if (!valid) {
          return;
        } else {
          this.isShow = true;
        }
      });
    },
    async success(msg) {
      console.log(msg);
      const { data: res } = await this.$http.post(
        "user/login?username=" +
          this.formData.username +
          "&password=" +
          this.formData.password
      );
      if (res.code !== 200) {
        return this.$message.error("登录失败");
      } else {
        this.$message.success("登录成功");
        window.sessionStorage.setItem("token", res.data);
        this.$router.push("/home");
      }
    },
    //重置表单
    resetForm() {
      this.$refs.formRef.resetFields();
    },

    // 用户点击遮罩层，应该关闭模态框
    close() {
      this.isShow = false;
    },
  },
};
</script>

<style scoped>
.login h1 {
  text-align: center;
  letter-spacing: 2px;
  color: #74b9ff;
}
.el-card {
  width: 430px;
  display: block;
  margin: 0 auto;
  height: 300px;
}
.login {
  background-color: #2d3a4b;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
}
.el-form {
  margin-top: 32px;
}
.el-form h3 {
  margin-bottom: 8px;
}
.el-form-item__content {
  display: flex !important;
  flex-direction: row !important;
}
.form-commit {
  margin-top: 15px;
}
</style>