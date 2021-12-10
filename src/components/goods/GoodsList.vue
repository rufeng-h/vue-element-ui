<template>
  <div id="goodsList-component">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'goodsList' }"
        >商品管理</el-breadcrumb-item
      >
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            clearable
            v-model="query"
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table
        v-loading="isLoading"
        :data="pageData.records"
        border
        style="width: 100%"
        stripe
        row-key="goodsId"
        :expand-row-keys="expandRowKeys"
        :highlight-current-row="true"
        empty-text="--"
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column type="expand"></el-table-column>
        <el-table-column prop="goodsName" label="商品名称"> </el-table-column>
        <el-table-column prop="goodsPrice" label="价格">
          <template slot-scope="scope">
            {{ scope.row.goodsPrice | moneyFormat }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="商品详情">
          <template slot-scope="scope">
            <div v-html="scope.row.goodsIntroduce"></div>
          </template>
        </el-table-column> -->
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="最后更新"></el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--   分页区域   -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @next-click="nextPage"
        @prev-click="prevPage"
        :current-page="pageData.current"
        :page-sizes="[1, 2, 5, 10, 15, 20]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'GoodsList',
  created () {
    this.getGoodsList()
  },
  data () {
    return {
      isLoading: false,
      expandRowKeys: [],
      query: '',
      pageData: {
        current: 1,
        size: 10,
      },
    }
  },

  methods: {

    async getGoodsList () {
      try {
        this.isLoading = true
        const { data: { data: data } } = await this.$axios.get("/api/goods/list", {
          params:
          {
            query: this.query,
            pageNum: this.pageData.current,
            pageSize: this.pageData.size
          }
        })
        this.pageData = data
      }
      finally {
        this.isLoading = false
      }
    },

    /* 处理pageSize变化 */
    async handleSizeChange (size) {
      this.pageData.size = size
      await this.getGoodsList()
    },
    /*当前页改变*/
    async handleCurrentChange (current) {
      this.pageData.current = current
      await this.getGoodsList()
    },
    /* 下一页 */
    async nextPage () {
      this.pageData.current++
      await this.getGoodsList()
    },

    async prevPage () {
      this.pageData.current--
      await this.getGoodsList()
    },
    handleClose (done) {
      done()
    },
    goAddPage () {
      this.$router.push({ name: 'goodsAdd' })
    },
  }
}
</script>

<style scoped lang="less">
.el-breadcrumb {
  margin-bottom: 15px;
}
.box-card {
  box-shadow: rgba(56, 62, 159, 0.8) 0 0 1px 1px;
}

.el-pagination {
  margin-top: 15px;
}

.el-table {
  margin-top: 15px;
}
</style>
