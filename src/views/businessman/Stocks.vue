<template>
  <div class="stocks">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>物资管理</el-breadcrumb-item>
      <el-breadcrumb-item>库存维护</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="rowech">
      <el-row :gutter="20" class="linerow">
        <el-col :span="12">
          <el-card>
            <div id="barEchart" style="width: 600px;height:400px;"></div>
          </el-card>
        </el-col>
        <el-col :span="12" style="margin-top: 15px;">
          <el-card>
            <div id="preEchart" style="width: 600px;height:400px;"></div>
          </el-card>
        </el-col>
      </el-row>
      <el-row class="barrow">
        <el-card>
          <el-col :span="24">
            <el-form ref="form" :model="queryInfo" label-width="80px">
              <el-form-item>
                <el-cascader
                  v-model="categorykeys"
                  :options="catetorys"
                  :props="{ expandTrigger: 'hover' }"
                  clearable
                ></el-cascader>
              </el-form-item>
              <el-form-item>
                <el-input clearable @clear="search" v-model="queryInfo.name" placeholder="物资名称"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button size="mini" type="primary" @click="search" icon="el-icon-search">查询</el-button>
              </el-form-item>
            </el-form>
            <el-table height="530" border :data="tableData" style="width: 100%">
              <el-table-column prop="imageUrl" label="图片" align="center" width="80" padding="0px">
                <template slot-scope="scope">
                  <el-popover placement="right" trigger="hover">
                    <img
                      :src="'https://www.zykhome.club/'+scope.row.imageUrl"
                      style="height: 200px;width: 200px"
                    />
                    <img
                      slot="reference"
                      :src="'https://www.zykhome.club/'+scope.row.imageUrl"
                      :alt="scope.row.imgUrl"
                      style="height: 21px;width: 21px;cursor: pointer"
                    />
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="名称" width="140"></el-table-column>
              <el-table-column prop="model" label="规格" width="120"></el-table-column>
              <el-table-column prop="stock" label="库存">
                <template slot-scope="scope">
                  <el-tag size="mini" closable>{{scope.row.stock}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="unit" label="单位"></el-table-column>
            </el-table>
          </el-col>
        </el-card>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "Stocks",
  data() {
    return {
      queryInfo: {
        pageSize: 9,
        pageNum: 1,
      },
      total: 0,
      barData: [], //条形统计图数据
      preData: [], //饼状统计图数据
      barxAxisData: [],
      tableData: [],
      legendData: [],
      seriesData: [],
      selected: {},
      catetorys: [],
      categorykeys: [],
    };
  },
  created() {
    this.getData();
    this.getCatetorys();
  },
  mounted() {
    this.getbarEchart();
    this.getpreEchart();
  },
  methods: {
    async getData() {
      const { data: res } = await this.$http.get("product/findProductStocks", {
        params: this.queryInfo,
      });
      if (res.code !== 200) {
        return this.$message.error("获取数据失败");
      } else {
        this.total = res.data.total;
        this.tableData = res.data.rows;
        this.barData = res.data.rows.map((item) => {
          return item.stock;
        });
        this.barxAxisData = res.data.rows.map((item) => {
          return item.name;
        });

        //重新绘制统计图
        this.getbarEchart();
        this.findAllProductStocks();
      }
    },

    /**
     * 物资所有的库存信息
     */
    async findAllProductStocks() {
      const { data: res } = await this.$http.get("product/findAllStocks", {
        params: this.queryInfo,
      });
      if (res.code !== 200) {
        return this.$message.error("获取物资所有库存失败");
      } else {
        this.legendData = [];
        this.selected = {};
        this.seriesData = [{}];
        var $this = this;
        //构建饼图的数据对象
        res.data.forEach(function (e) {
          $this.legendData.push(e.name);
          $this.seriesData.push({ name: e.name, value: e.stock });
        });

        //重新绘制表格
        this.getpreEchart();
      }
    },

    //加载物资类别
    async getCatetorys() {
      const { data: res } = await this.$http.get(
        "productCategory/categoryTree"
      );
      if (res.code !== 200) {
        return this.$message.error("获取物资类别失败");
      } else {
        this.catetorys = res.data.rows;
      }
    },

    //搜索
    search() {},

    //条形统计图
    getbarEchart() {
      var barArt = this.$echarts.init(document.getElementById("barEchart"));
      var baroption = {
        title: {
          text: "库存条形图",
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
            dataView: { readOnly: false }, //  缩放
            magicType: { type: ["bar"] }, ///　　折线  直方图切换
            restore: {}, // 重置
            saveAsImage: {}, // 导出图片
          },
        },
        tooltip: {},
        legend: {
          data: ["库存量"],
        },
        xAxis: {
          data: this.barxAxisData,
        },
        yAxis: {},
        series: [
          {
            name: "库存量",
            type: "bar",
            showBackground: true,
            data: this.barData,
            itemStyle: {
              normal: {
                //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                color: function (params) {
                  // build a color map as your need.
                  var colorList = [
                    "#0780cf ",
                    "#fa6d1d ",
                    "#ac2026 ",
                    "#701866 ",
                    "#d22e8d ",
                    "#FE8463",
                    "#a195c5 ",
                    "#FAD860",
                    "#F3A43B",
                    "#60C0DD",
                    "#D7504B",
                    "#a195c5  ",
                    "#F4E001",
                    "#F0805A",
                    "#63b2ee",
                  ];
                  return colorList[params.dataIndex];
                }, //以下为是否显示，显示位置和显示格式的设置了
                label: {
                  show: true,
                  position: "top",
                  //                             formatter: '{c}'
                  formatter: "{b}\n{c}",
                },
              },
            },
          },
        ],
      };
      barArt.setOption(baroption);
    },

    //饼状统计图
    getpreEchart() {
      var preArt = this.$echarts.init(document.getElementById("preEchart"));
      var preOption = {
        title: {
          text: "库存占比图",

          left: "left",
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {}, // 导出图片
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          right: 10,
          top: 20,
          bottom: 20,
          data: this.legendData,
          selected: this.selected,
        },
        series: [
          {
            name: "物资名称",
            type: "pie",
            radius: "55%",
            center: ["40%", "50%"],
            data: this.seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      preArt.setOption(preOption);
    },
  },
};
</script>

<style scoped>
.rowech {
  display: flex;
}
.el-row {
  margin-top: 15px;
}
.linerow {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.barrow {
  flex: 1;
}
.el-col-12 {
  width: 98% !important;
}
.el-form {
  display: flex;
}
</style>