<template>
  <div id="categoryAttr-component">
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form ref="ruleForm" :model="attrForm" :rules="attrFormRules">
        <el-form-item :label="titleText" label-width="80px" prop="name"
          ><el-input v-model="attrForm.name" prop="name"></el-input
        ></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttribute">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form ref="editRuleForm" :model="editForm" :rules="attrFormRules">
        <el-form-item :label="titleText" label-width="80px" prop="name">
          <el-input v-model="editForm.name" prop="name"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="80px" prop="status">
          <el-radio-group v-model="editForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateAttribute">确 定</el-button>
      </span>
    </el-dialog>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'goodsCategoryAttr' }"
        >商品管理</el-breadcrumb-item
      >
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意：只允许为三级分类设置属性"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 商品分类级联选择框 -->
      <el-row :gutter="20" style="margin: 15px 0">
        <el-col :span="24"
          ><span style="margin-right: 15px">选择分类参数</span>
          <el-cascader
            :options="categoryList"
            :props="cascaderProps"
            v-model="selectedCateIds"
            @change="getAttrbuteList"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab面板 -->
      <el-tabs v-model="tabActiveName" @tab-click="getAttrbuteList">
        <el-tab-pane label="动态参数" name="many"
          ><el-button
            type="primary"
            :disabled="isAddBtnDisabed"
            icon="el-icon-circle-plus"
            size="small"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table
            :data="manyTableData"
            row-key="id"
            :expand-row-keys="expandRowKeys"
            border
            stripe
          >
            <el-table-column type="index"></el-table-column>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <div class="attr-tag-container">
                  <el-tag
                    v-for="(item, idx) in scope.row.attrValArr"
                    :key="item"
                    type="warning"
                    @close="delAttrVal(scope.row, idx)"
                    closable
                    >{{ item }}
                  </el-tag>
                  <el-tooltip
                    manual
                    :value="scope.row.inputValue.length === 1"
                    v-if="scope.row.inputVisible"
                    placement="bottom"
                    content="属性名至少2个字符"
                    effect="light"
                    :disabled="scope.row.inputValue.length !== 1"
                  >
                    <el-input
                      ref="tagInput"
                      style="width: 120px"
                      v-model="scope.row.inputValue"
                      size="small"
                      @keyup.enter.native="addAttrVal(scope.row)"
                      @blur="addAttrVal(scope.row)"
                    >
                    </el-input>
                  </el-tooltip>
                  <el-button
                    v-else
                    plain
                    type="primary"
                    size="small"
                    icon="el-icon-circle-plus"
                    @click="showAttrValInput(scope.row)"
                    >添加参数值</el-button
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column label="参数名称" prop="name"></el-table-column>
            <el-table-column
              prop="updateTime"
              label="最后更新"
              sortable
            ></el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
              sortable
            ></el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <i
                  v-if="scope.row.status === 1"
                  class="el-icon-success"
                  style="color: lightgreen"
                ></i>
                <i v-else class="el-icon-error" style="color: red"></i>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  :disabled="scope.row.status === 0"
                  icon="el-icon-error"
                  type="danger"
                  size="mini"
                  @click="delAttribute(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only"
          ><el-button
            type="primary"
            :disabled="isAddBtnDisabed"
            icon="el-icon-circle-plus"
            size="small"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <div class="attr-tag-container">
                  <el-tag
                    v-for="(item, idx) in scope.row.attrValArr"
                    :key="item"
                    type="warning"
                    @close="delAttrVal(scope.row, idx)"
                    closable
                    >{{ item }}
                  </el-tag>
                  <el-tooltip
                    manual
                    :value="scope.row.inputValue.length === 1"
                    v-if="scope.row.inputVisible"
                    placement="bottom"
                    content="属性名至少2个字符"
                    effect="light"
                    :disabled="scope.row.inputValue.length !== 1"
                  >
                    <el-input
                      ref="tagInput"
                      style="width: 120px"
                      v-model="scope.row.inputValue"
                      size="small"
                      @keyup.enter.native="addAttrVal(scope.row)"
                      @blur="addAttrVal(scope.row)"
                    >
                    </el-input>
                  </el-tooltip>
                  <el-button
                    v-else
                    plain
                    type="primary"
                    size="small"
                    icon="el-icon-circle-plus"
                    @click="showAttrValInput(scope.row)"
                    >添加参数值</el-button
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column label="参数名称" prop="name"></el-table-column>
            <el-table-column label="参数值" prop="attrVals"></el-table-column>
            <el-table-column
              prop="updateTime"
              label="最后更新"
              sortable
            ></el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
              sortable
            ></el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <i
                  v-if="scope.row.status === 1"
                  class="el-icon-success"
                  style="color: lightgreen"
                ></i>
                <i v-else class="el-icon-error" style="color: red"></i>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  :disabled="scope.row.status === 0"
                  icon="el-icon-error"
                  type="danger"
                  size="mini"
                  @click="delAttribute(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'CategoryAttr',
  data () {
    return {
      expandRowKeys: [],
      tabActiveName: 'many',
      editDialogVisible: false,
      /* 当前正在编辑的属性 */
      curEditAttr: {},
      editForm: {},
      categoryList: [],
      selectedCateIds: [],
      manyTableData: [],
      onlyTableData: [],
      cascaderProps: {
        expandTrigger: 'hover',
        multiple: false,
        value: 'catId',
        label: 'catName',
        children: 'children',
        filerable: true
      },
      addDialogVisible: false,
      attrForm: {},
      attrFormRules: {
        name: [
          { required: true, trigger: 'blur', message: '请填写完整' },
          { min: 2, max: 10, trigger: 'blur', message: "长度在3到10个字符" }
        ]
      }
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    /* 为每个参数设置输入框、属性字符串split的数组等 */
    wrapperAttr (item) {
      item.attrValArr = item.attrVals ? item.attrVals.split(',') : []
      item.inputVisible = false
      item.inputValue = ''
    },
    async getCategoryList () {
      const { data: { data: data } } = await this.$axios.get('/api/category/treeAll')
      this.categoryList = data
    },
    async getAttrbuteList () {
      if (this.curCategoryId === null) {
        return
      }
      const { data: { data: data } } = await this.$axios.get(`/api/attribute?categoryId=${this.curCategoryId}&attrSel=${this.tabActiveName}`)
      data.forEach(this.wrapperAttr)
      this.tabActiveName === 'only' ? this.onlyTableData = data : this.manyTableData = data
    },
    async addAttribute () {
      this.$refs.ruleForm.validate(async (isValid) => {
        if (!isValid) return
        this.attrForm.categoryId = this.curCategoryId
        this.attrForm.attrSel = this.tabActiveName
        const { data: { data: item } } = await this.$axios.post('/api/attribute/add', this.attrForm)
        if (item) {
          this.$message.success("添加成功")
          this.addDialogVisible = false
          this.wrapperAttr(item)
          this.tabActiveName === 'many' ? this.manyTableData.push(item) : this.onlyTableData.push(item)
          this.$refs.ruleForm.resetFields()
        }
      })
    },
    async updateAttribute () {
      this.$refs.editRuleForm.validate(async (isValid) => {
        if (!isValid) return
        const { data: { data: item } } = await this.$axios.post("api/attribute/update", this.editForm)
        if (item) {
          this.$message.success("修改成功")
          this.wrapperAttr(item)
          Object.assign(this.curEditAttr, item)
          this.editDialogVisible = false
          this.$refs.editRuleForm.resetFields()
        }
      })
    },
    showEditDialog (attr) {
      this.editDialogVisible = true
      this.editForm = Object.assign({}, attr)
      this.curEditAttr = attr
    },
    async delAttribute (attr) {
      const ret = await this.$confirm(`确认删除 ${attr.name} 吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((e) => e)
      if (ret !== 'confirm') {
        return this.$message.info("操作取消")
      }
      const { data: { data: item } } = await this.$axios.post('/api/attribute/delete', attr)
      if (item) {
        this.$message.success("删除成功!")
        Object.assign(attr, item)
      }
    },
    async delAttrVal (attr, idx) {
      const ret = await this.$confirm(`确认删除 ${attr.name} 下的 ${attr.attrValArr[idx]} 吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((e) => e)
      if (ret !== 'confirm') {
        return this.$message.info("操作取消")
      }
      const tmp = attr.attrValArr.slice()
      tmp.splice(idx, 1)
      console.log(attr)
      const newVals = tmp.join(',')
      const data = { id: attr.id, categoryId: attr.categoryId, attrVals: newVals }
      const { data: res } = await this.$axios.post('/api/attribute/update', data)
      if (res) {
        this.$message.success("删除成功")
        attr.attrValArr.splice(idx, 1)
        attr.attrVals = newVals
      }
    },
    showAttrValInput (attr) {
      attr.inputVisible = true
      this.$nextTick(() =>
        this.$refs.tagInput.focus())
    },
    async addAttrVal (attr) {
      if (attr.inputValue === '') {
        return attr.inputVisible = false
      }
      if (attr.inputValue.length === 1) {
        return this.$refs.tagInput.focus()
      }
      /* 是否重复 */
      const newArr = [...attr.attrValArr, attr.inputValue]
      if (new Set(newArr).size !== newArr.length) {
        return this.$message.warning("不能添加相同值!")
      }
      const newVals = newArr.join(',')
      const data = { id: attr.id, categoryId: attr.categoryId, attrVals: newVals }
      const { data: res } = await this.$axios.post('/api/attribute/update', data)
      if (res) {
        this.$message.success("添加成功")
        attr.attrVals = newVals
        attr.attrValArr.push(attr.inputValue)
        attr.inputValue = ''
        attr.inputVisible = false
      }
    },
    handleClose (done) {
      done()
    }
  },
  computed: {
    isAddBtnDisabed () {
      return this.selectedCateIds.length === 0
    },
    /* 对话框标题 */
    titleText () {
      return this.tabActiveName === 'only' ? '静态属性' : '动态参数'
    },

    /* 当前选中的分类id */
    curCategoryId () {
      if (this.selectedCateIds.length === 0) {
        return null
      }
      return this.selectedCateIds[this.selectedCateIds.length - 1]
    }
  }
}
</script>

<style scoped lang="less">
.el-breadcrumb {
  margin-bottom: 15px;
}

.el-table {
  margin-top: 8px;
}

.attr-tag-container {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-around;
  flex-wrap: wrap;

  > .el-tag {
    margin: 5px 10px;
  }
}
</style>
