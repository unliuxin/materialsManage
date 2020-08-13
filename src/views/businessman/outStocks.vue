<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>物资管理</el-breadcrumb-item>
      <el-breadcrumb-item>出库记录</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-form ref="formRef" :model="queryMap" label-width="80px">
        <el-form-item label="发放单号">
          <el-input v-model="queryMap.outNum"></el-input>
        </el-form-item>
        <el-form-item label="发放类型">
          <el-select v-model="queryMap.type" placeholder="发放类型">
            <el-option label="全部类型" value></el-option>
            <el-option label="政府领取" value="0"></el-option>
            <el-option label="医院领取" value="1"></el-option>
            <el-option label="小区领取" value="2"></el-option>
            <el-option label="个人领取" value="3"></el-option>
            <el-option label="其他领取" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryMap.status" placeholder="已发放">
            <el-option label="已发放" :value="0"></el-option>
            <el-option label="回收站" :value="1"></el-option>
            <el-option label="待审核" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
          <el-button>重置</el-button>
          <el-button type="success">发放</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column label="#" prop="id" width="80"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="outNum" label="发放单号" width="180"></el-table-column>
        <el-table-column prop="type" label="发放类型" width="100">
          <template v-slot:default="scope">
            <el-tag effect="plain" size="mini" type="success" v-if="scope.row.type===0">政府领取</el-tag>
            <el-tag effect="plain" size="mini" type="danger" v-else-if="scope.row.type===1">医院领取</el-tag>
            <el-tag effect="plain" size="mini" type="warning" v-else-if="scope.row.type===2">小区领取</el-tag>
            <el-tag effect="plain" size="mini" type="info" v-else-if="scope.row.type===3">个人领取</el-tag>
            <el-tag effect="plain" size="mini" v-else-if="scope.row.type===4">其他领取</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="紧急程度" width="100">
          <template v-slot:default="scope">
            <el-rate show-score disabled v-model="scope.row.priority"></el-rate>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="发放地点" width="180"></el-table-column>
        <el-table-column prop="productNumber" label="总数" width="100"></el-table-column>
        <el-table-column prop="phone" label="联系方式" width="180"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template v-slot:default="scope">
            <el-tag size="mini" type="danger" effect="plain" v-if="scope.row.status==1">回收</el-tag>
            <el-tag size="mini" effect="plain" v-if="scope.row.status==0">已放</el-tag>
            <el-tag size="mini" effect="plain" type="warning" v-if="scope.row.status==2">审核中</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作员" width="180"></el-table-column>
        <el-table-column prop="createTime" label="发放时间" width="180"></el-table-column>
        <el-table-column label="操作" width="180">
          <el-link icon="el-icon-view" :underline="false">明细</el-link>
          <el-link icon="el-icon-delete" :underline="false">删除</el-link>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "outStocks",
  data() {
    return {
      total: 0,
      tableData: [],
      queryMap: { pageNum: 1, pageSize: 7, status: 0 },
    };
  },
  created() {
    this.getoutStockslist();
  },

  methods: {
    //查询
    search() {
        this.queryMap.pageNum = 1
        this.getoutStockslist()
    //   console.log(this.queryMap);
    },

    //请求表格数据
    async getoutStockslist() {
      const { data: res } = await this.$http.get("outStock/findOutStockList", {
        params: this.queryMap,
      });
      console.log(res);
      if (res.code !== 200) {
        return this.$message.error("获取列表失败");
      } else {
        this.total = res.data.total;
        this.tableData = res.data.rows;
      }
    },
  },
};
</script>

<style scoped>
.el-card {
  margin-top: 15px;
}
.el-form {
  display: flex;
}
.danhao {
  color: blue;
}
</style>