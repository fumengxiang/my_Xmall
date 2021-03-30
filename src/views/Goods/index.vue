<template>
  <div class="goods">
    <div class="nav">
      <div class="w">
        <!-- 其中href="jsvascript:; 表示组织a标签的默认事件" :class 绑定点击当前的按钮的样式 -->
        <a
          @click="handleSort(i)"
          :class="{active:i===isIndex}"
          href="javascript:;"
          v-for="(navItem,i) in navList"
          :key="i"
        >{{navItem.title}}</a>
        <div class="price-interval">
          <!-- 双向绑定输入框的数据，进行价格的过滤 -->
          <input type="number" class="input" placeholder="价格" v-model="min">
          <span style="margin: 0 5px">-</span>
          <input type="number" placeholder="价格" v-model="max">
          <el-button type="primary" size="small" style="margin-left: 10px;" @click="reset">确定</el-button>
        </div>
      </div>
    </div>
    <div>
      <div class="goods-box w">
        <mall-goods v-for="goods in allGoods" :key="goods.id" :goods="goods"></mall-goods>
      </div>
      <div class="w">
        <el-pagination
          style="float:right;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[8, 20, 40, 80]"
          :page-size="pageSize"
          layout="total,sizes, prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import MallGoods from "@/components/MallGoods";
export default {
  components: {
    MallGoods
  },
  data() {
    return {
      max: "",
      min: "",
      navList: [
        { title: "综合排序" },
        { title: "价格由低到高" },
        { title: "价格由高到低" }
      ],
      isIndex: 0,
      currentPage: 1,
      pageSize: 20,
      sort: "",
      total: 0,
      allGoods: []
    };
  },
  // 监听路由的变化
  watch: {
    $route: "getAllGoods"
  },
  created() {
    this.getAllGoods();
  },
  methods: {
    // 传入的是新改变的每页的页数
    handleSizeChange(val) {
      // 改变页数，从新请求数据
      this.pageSize = val;
      this.getAllGoods();
    },
    // 传入的是当前的页数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAllGoods();
    },
    async getAllGoods() {
        const url = this.$route.query.cid ? `/api/goods/allGoods?page=${this.currentPage}&size=${
            this.pageSize
          }&sort=${this.sort}&priceGt=${this.min}&priceLte=${this.max}&cid=${this.$route.query.cid}`: `/api/goods/allGoods?page=${this.currentPage}&size=${
            this.pageSize
          }&sort=${this.sort}&priceGt=${this.min}&priceLte=${this.max}`
      try {
        const res = await this.$http.get(
          url
        );

        this.allGoods = res.data.data;
        this.total = res.data.total;
      } catch (error) {
        console.log(error);
      }
    },
    // 排序
    priceSort(v) {
      this.sort = v;
      // 再次获取数据
      this.getAllGoods();
    },
    // 重置数据的显示
    reset() {
      this.currentPage = 1;
      this.sort = "";
      this.getAllGoods();
    },
    handleSort(i) {
      // 处理点击激活的样式
      this.isIndex = i;
      switch (i) {
        case 0:
          //   综合排序
          this.reset();
          break;
        case 1:
          this.priceSort(1);
          //   正序
          break;
        case 2:
          this.priceSort(-1);
          //   倒序
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/mixin";
@import "../../assets/style/theme";

.nav {
  height: 60px;
  line-height: 60px;
  > div {
    display: flex;
    align-items: center;
    a {
      padding: 0 30px 0 0;
      height: 100%;
      @extend %block-center;
      font-size: 12px;
      color: #999;
      &.active {
        color: #5683ea;
      }
      &:hover {
        color: #5683ea;
      }
    }
    input {
      @include wh(80px, 30px);
      border: 1px solid #ccc;
    }
    input + input {
      margin-left: 10px;
    }
  }
  .price-interval {
    padding: 0 15px;
    @extend %block-center;
    input[type="number"] {
      border: 1px solid #ccc;
      text-align: center;
      background: none;
      border-radius: 5px;
    }
  }
}

.goods-box {
  overflow: hidden;
  > div {
    float: left;
    border: 1px solid #efefef;
  }
}

.no-info {
  padding: 100px 0;
  text-align: center;
  font-size: 30px;
  display: flex;
  flex-direction: column;
  .no-data {
    align-self: center;
  }
}

.img-item {
  display: flex;
  flex-direction: column;
}

.el-pagination {
  align-self: flex-end;
  margin: 3vw 10vw 2vw;
}

.section {
  padding-top: 8vw;
  margin-bottom: -5vw;
  width: 1218px;
  align-self: center;
}

.recommend {
  display: flex;
  > div {
    flex: 1;
    width: 25%;
  }
}
</style>
