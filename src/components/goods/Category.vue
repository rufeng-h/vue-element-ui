<template>
  <div id="category-component">
    <!-- 新增分类对话框 -->
    <el-dialog
      title="添加新分类"
      :visible.sync="isCatAddDlgVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form ref="ruleForm" :model="catAddForm" :rules="catAddFormRules">
        <el-form-item label="分类名称" label-width="80px" prop="catName">
          <el-input v-model="catAddForm.catName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" label-width="80px" prop="pidList">
          <el-cascader
            change-on-select
            v-model="catAddForm.pidList"
            :options="casCatList"
            :props="cascaderProps"
            placeholder="不选择默认为1级分类"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isCatAddDlgVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>

    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'goodsCategories' }"
        >商品管理</el-breadcrumb-item
      >
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            v-model="query"
            clearable
            @clear="getCategoryList"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="isCatAddDlgVisible = true"
            >添加新分类</el-button
          >
        </el-col>
      </el-row>
      <el-table
        v-loading="isLoading"
        :data="pageData.records"
        border
        style="width: 100%"
        row-key="catId"
        stripe
        :highlight-current-row="true"
        :tree-props="{ hasChildren: true, children: 'children' }"
        empty-text="--"
      >
        <el-table-column prop="catName" label="名称"></el-table-column>
        <el-table-column prop="catLevel" label="级别">
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.catLevel === 0
                  ? 'primary'
                  : scope.row.catLevel === 1
                  ? 'success'
                  : 'warning'
              "
              >{{ scope.row.catLevel + 1 }}级</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="catName" label="是否有效">
          <template slot-scope="scope">
            <i
              v-if="scope.row.catDeleted === 0"
              class="el-icon-success"
              style="color: lightgreen"
            ></i>
            <i v-else class="el-icon-error" style="color: red"></i>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <el-button
              icon="el-icon-error"
              type="danger"
              size="mini"
              @click="delCategory(scope.row)"
              >删除</el-button
            >
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
        :page-size="pageData.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created () {
    this.getCategoryList()
    this.getCasCatList()
  },

  name: 'goodsCategories',
  data () {
    return {
      query: '',
      casCatList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        multiple: false,
        value: 'catId',
        label: 'catName',
        children: 'children',
        filerable: true
      },
      catAddForm: {
        catName: '',
        pidList: [],
      },
      catAddFormRules: {
        catName:
          [
            {
              required: true, trigger: 'blur', message: '请输入分类名称'
            },
            {
              min: 3, max: 10, trigger: 'blur', message: '长度在3到10个字符'
            }
          ],
      },
      isCatAddDlgVisible: false,
      isLoading: false,
      pageData: {
        current: 0,
        size: 5,
      },
    }
  },
  methods: {
    /**
      * 获取1级和2级分类tree，级联选择器数据
      */
    async getCasCatList () {
      this.isLoading = true
      try {
        const { data: { data: data } } = await this.$axios.get("/api/category/treeLevel2")
        this.casCatList = data
      } finally {
        this.isLoading = false
      }
    },
    async getCategoryList () {
      try {
        this.isLoading = true
        const { data: { data: data } } = await this.$axios.get(`/api/category/tree`,
          { params: { pageNum: this.pageData.current, pageSize: this.pageData.size } })
        this.pageData = data
      } finally {
        this.isLoading = false
      }
    },
    async addCategory () {
      this.$refs.ruleForm.validate(async (isValid) => {
        if (!isValid) return
        this.isLoading = true
        try {
          const params = { name: this.catAddForm.catName }
          const pidList = this.catAddForm.pidList
          if (pidList.length !== 0) {
            params.level = pidList.length
            params.pid = pidList.slice(-1)[0]
          }
          const { data: res } = await this.$axios.post("/api/category/add", {}, { params: params })
          if (res) {
            this.$message.success("添加成功")
            this.isCatAddDlgVisible = false
            this.$refs.ruleForm.resetFields()
            this.getCategoryList()
            this.getCasCatList()
          }
        } finally {
          this.isLoading = false
        }
      })
    },
    async delCategory (category) {
      const toDel = []
      const getChildrenId = (cate) => {
        toDel.push(cate.catId)
        if (cate.children) {
          cate.children.forEach(getChildrenId)
        }
      }
      getChildrenId(category)
      const msg = category.children ? `确认删除 ${category.catName} 及其子分类 共${toDel.length}条记录` : `确认删除${category.catName}分类吗`
      const ret = await this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((e) => e)
      if (ret !== 'confirm') {
        return this.$message.info("操作取消")
      }

      const { data: res } = await this.$axios.post('api/category/delete', toDel)
      if (res) {
        this.$message.success("操作成功")
        this.getCategoryList()
        this.isCatAddDlgVisible = false
      }
    },
    /* 处理pageSize变化 */
    async handleSizeChange (size) {
      this.pageData.size = size
      await this.getCategoryList()
    },
    /*当前页改变*/
    async handleCurrentChange (current) {
      this.pageData.current = current
      await this.getCategoryList()
    },
    /* 下一页 */
    async nextPage () {
      this.pageData.current++
      await this.getCategoryList()
    },

    async prevPage () {
      this.pageData.current--
      await this.getCategoryList()
    },
    handleClose (done) {
      done()
    }
  }
}
</script>

<style scoped lang="less">
.el-breadcrumb {
  margin-bottom: 15px;
}

.el-pagination {
  margin-top: 15px;
}

.el-table {
  margin-top: 15px;
}
</style>

