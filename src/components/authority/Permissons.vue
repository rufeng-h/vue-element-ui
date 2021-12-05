<template>
  <div id="permission-component">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'permissions' }"
        >权限管理</el-breadcrumb-item
      >
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table
        v-loading="isLoading"
        :data="pageData.records"
        border
        style="width: 100%"
        row-key="id"
        stripe
        :highlight-current-row="true"
        empty-text="--"
        :cell-style="{ padding: '5px' }"
      >
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="value" label="描述"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.status"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="level"
          label="级别"
          :filters="filters.levelFilter"
          :filter-method="filters.levelHandler"
        >
          <template slot-scope="scope"
            ><el-tag
              :type="
                scope.row.level === 1
                  ? 'primary'
                  : scope.row.level === 2
                  ? 'success'
                  : 'warning'
              "
              >{{ scope.row.level }}级权限</el-tag
            ></template
          >
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column
          v-if="hasAuthority('ROLE_super_admin')"
          fixed="right"
          label="操作"
        >
          <template>
            <el-button
              type="primary"
              size="medium"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              type="danger"
              size="medium"
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
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Permissions",
  async created () {
    this.isLoading = true
    try {
      await this.getPermissionList()
    } finally {
      this.isLoading = false
    }
  },
  props: ['userInfo', 'hasAuthority'],
  data () {
    return {
      filters: {
        levelFilter: [],
        levelHandler (value, row) {
          return row.level === value
        }
      },
      isLoading: false,
      pageData: {
        current: 1,
        size: 10,
      },
    }
  },
  methods: {
    async getPermissionList () {
      const { data: { data: data } } = await this.$axios.get(`/api/permission/list?pageNum=${this.pageData.current}&pageSize=${this.pageData.size}`)
      this.pageData = data
      /* 更新过滤选项 */
      const set = new Set(this.pageData.records.map(v => v.level))
      this.filters.levelFilter = [...set].map(v => { return { text: v + "级权限", 'value': v } })
      console.log(this.filters.levelFilter)
    },
    /* 处理pageSize变化 */
    async handleSizeChange (size) {
      this.pageData.size = size
      await this.getPermissionList()
    },
    /*当前页改变*/
    async handleCurrentChange (current) {
      this.pageData.current = current
      await this.getPermissionList()
    },
    /* 下一页 */
    async nextPage () {
      this.pageData.current++
      await this.getPermissionList()
    },

    async prevPage () {
      this.pageData.current--
      await this.getPermissionList()
    },
  }
}
</script>

<style scoped lang="less">
.el-breadcrumb {
  font-size: 0.9em;
  margin-bottom: 15px;
}
.el-pagination {
  margin-top: 15px;
}
</style>
