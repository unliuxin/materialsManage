<template>
  <div class="welcome">
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>欢迎</el-breadcrumb-item>
    </el-breadcrumb>

    <!---->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="userInfo">
          <div class="userInfo-top">
            <span>用户信息</span>
            <el-button
              type="primary"
              class="userinfo-el-button"
              size="mini"
              plain
              :loading="true"
            >用户中心</el-button>
            <el-button
              type="primary"
              class="userinfo-el-button user-el-button"
              size="mini"
              plain
              @click="getCode"
            >获取源码</el-button>
          </div>
          <el-divider></el-divider>
          <div class="userInfo-bottom">
            <el-image style="width: 100px; height: 100px" :src="imgurl"></el-image>
            <el-table :data="tableInfo" border style="width: 482px">
              <el-table-column prop="username" label="用户账号" width="120"></el-table-column>
              <el-table-column prop="nickname" label="用户昵称" width="120"></el-table-column>
              <el-table-column prop="department" label="所属部门" width="120"></el-table-column>
              <el-table-column prop="roles" label="用户角色" width="120"></el-table-column>
            </el-table>
          </div>
        </el-card>
        <el-card class="materMan">
          <!--物资管理-->
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="grid-content Material-information">
                <router-link to="/products">
                  <img src="../../../assets/images/1.svg" width="60.8px;" alt />
                </router-link>
                <div>物资资料</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content Material-inventory">
                <router-link to="/stocks">
                  <img src="../../../assets/images/2.svg" width="60.8px;" alt />
                </router-link>
                <div>物资库存</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content Material-storage">
                <router-link to="/inStocks">
                  <img src="../../../assets/images/3.svg" width="60.8px;" alt />
                </router-link>
                <div>物资入库</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content Material-distribution">
                <router-link to="/outStocks">
                  <img src="../../../assets/images/4.svg" width="60.8px;" alt />
                </router-link>
                <div>物资发放</div>
              </div>
            </el-col>
          </el-row>
        </el-card>

        <!--用户登录报表-->
        <el-card class="userEcharts">
          <div id="loginReport" style="width: 650px;height:270px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="rili">
          <el-calendar v-model="rili"></el-calendar>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "Welcome",
  data() {
    return {
      imgurl: "../../../assets/images/admin.jpg",
      userInfo: [],
      tableInfo: [],
      xData: [], //图表x轴数据
      yData: [], //图表y轴全部数据
      mData: [], //图表y轴我的数据
      rili: new Date(),
    };
  },
  created() {
    this.getUserInfo();
    this.getTableInfo();
  },
  mounted() {
    this.getEcharts();
  },
  methods: {
    //获取用户信息
    async getUserInfo(username) {
      const { data: res } = await this.$http.post("loginLog/loginReport", {
        username: username,
      });
      if (res.code !== 200) {
        this.$message.error("请求失败");
      } else {
        this.xData = res.data.all.map((item) => {
          return item.days;
        });
        this.yData = res.data.all.map((item) => {
          return item.count;
        });
        this.mData = res.data.me.map((item) => {
          return item.count;
        });
      }
      this.getEcharts();
    },

    //获取表格里的用户数据
    getTableInfo() {
      this.userInfo = this.$store.state.userInfo;
      var roles = this.userInfo.isAdmin ? "超级管理员" : this.userInfo.roles;
      this.tableInfo.push({
        username: this.userInfo.username,
        nickname: this.userInfo.nickname,
        department: this.userInfo.department,
        roles: roles,
      });
    },
    //获取源码
    getCode() {
      console.log(this.$store.state.userInfo);
    },

    //获取图表数据
    getEcharts() {
      let myChart = this.$echarts.init(document.getElementById("loginReport"));
      var option = {
        title: {
          text: "用户登录统计",
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
            dataView: { readOnly: false },
            magicType: { type: ["line", "bar"] },
            restore: {},
            saveAsImage: {},
          },
          itemSize: 14,
        },
        tooltip: {},
        legend: {
          data: ["全部", "我的"],
        },
        xAxis: {
          data: this.xData,
        },
        yAxis: {},
        series: [
          {
            name: "全部",
            type: "bar",
            data: this.yData,
          },
          {
            name: "我的",
            type: "bar",
            data: this.mData,
          },
        ],
      };
      myChart.setOption(option);
    },
  },
};
</script>

<style scoped>
.el-row {
  margin-top: 15px;
}
.userInfo-top span {
  float: left;
}
.userinfo-el-button {
  float: right;
}
.user-el-button {
  margin-right: 10px;
}
.userInfo-top {
  overflow: hidden;
}

.el-image {
  float: left;
}
.el-table {
  float: right;
}
.userInfo-bottom {
  overflow: hidden;
  margin-top: 20px;
}
.grid-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.grid-content div {
  font-size: 12px;
  margin-top: 10px;
}
.materMan {
  margin-top: 15px;
}
.userEcharts {
  margin-top: 15px;
}
.is-selected {
  color: #1989fa;
}
</style>