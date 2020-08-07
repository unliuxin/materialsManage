<template>
  <div>
    <el-submenu :index="item.id+''" v-for="item in sumenulist" :key="item.id">
      <template slot="title">
        <i :class="item.icon"></i>
        <span>{{item.menuName}}</span>
      </template>
      <subMenu :menulist="item.children"></subMenu>
      <el-menu-item
        v-for="item2 in item.children"
        :key="item2.id"
        :route="item2.url"
        :index="'/'+item2.url"
        @click="getActivePath(item2.url)"
      >
        <i :class="item2.icon"></i>
        <span :index="item2.url+''">{{item2.menuName}}</span>
      </el-menu-item>
    </el-submenu>
  </div>
</template>

<script>
export default {
  name: "subMenu",
  data() {
    return {};
  },
  props: {
    sumenulist: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  created() {},
  methods: {
    getActivePath(path) {
      window.sessionStorage.setItem("activepath", path);
      this.activepath = path;
    },
  },
};
</script>

<style>
.el-menu--collapse span,
.el-menu--collapse i.el-submenu__icon-arrow {
  height: 0;
  width: 0;
  overflow: hidden;
  visibility: hidden;
  display: inline-block;
}
</style>