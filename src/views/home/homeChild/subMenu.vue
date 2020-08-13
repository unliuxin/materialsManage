<template>
  <div>
    <template v-for="item in sumenulist">
      <el-submenu
        :disabled="item.disabled"
        :index="item.id+''"
        v-if="item.children.length>0"
        :key="item.id"
      >
        <template slot="title">
          <i :class="item.icon"></i>
          <span>{{item.menuName}}</span>
        </template>
        <subMenu :sumenulist="item.children"></subMenu>
      </el-submenu>
      <el-menu-item
        v-else
        :disabled="item.disabled"
        
        :key="item.id"
        :route="item.url"
        :index="'/'+item.url"
        @click="getActivePath(item.url)"
      >
        <i :class="item.icon"></i>
        <span :index="item.url+''">{{item.menuName}}</span>
      </el-menu-item>
    </template>
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