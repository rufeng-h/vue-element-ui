<template>
  <div id="role-component">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'roles' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-dialog
      :title="'为 ' + curEditingRole.desp + ' 分配权限'"
      :visible.sync="isAuthorizeDlgVisible"
      width="30%"
      :before-close="handleClose"
      ref="dlg"
    >
      <el-tree
        ref="permissionTree"
        :data="permissionList"
        :props="defaultProps"
        accordion
        show-checkbox
        default-expand-all
        node-key="id"
        highlight-current
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAuthorizeDlgVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatePermission">确 定</el-button>
      </span>
    </el-dialog>

    <el-card class="box-card">
      <el-table
        v-loading="isLoading"
        :data="pageData.records"
        border
        style="width: 100%"
        row-key="id"
        stripe
        :expand-row-keys="expandRowKeys"
        :highlight-current-row="true"
        empty-text="--"
      >
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bd-bottom', 'vcenter', i1 === 0 ? 'bd-top' : '']"
              v-for="(p1, i1) of scope.row.permissions"
              :key="p1.id"
            >
              <el-col :span="5">
                <el-tag closable @close="delPermission(scope.row, p1)">{{
                  p1.name
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bd-top', 'vcenter']"
                  :span="5"
                  v-for="(p2, i2) in p1.children"
                  :key="p2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="delPermission(scope.row, p1, p2)"
                      >{{ p2.name }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-row>
                      <el-col :span="4" v-for="p3 in p2.children" :key="p3.id">
                        <el-tag
                          type="warning"
                          closable
                          @close="delPermission(scope.row, p1, p2, p3)"
                        >
                          {{ p3.name }}</el-tag
                        >
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="desp" label="描述"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              @change="changeStatus"
              v-model="scope.row.status"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="最后更新"></el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
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
            <!--  需要相关权限   -->
            <el-tooltip content="分配权限" placement="top" effect="light">
              <el-button
                type="warning"
                size="small"
                icon="el-icon-setting"
                @click="showPermissionDlg(scope.row)"
              ></el-button>
            </el-tooltip>
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
import { setUtil } from '../../utils'
export default {
  name: "Roles",
  async created () {
    this.isLoading = true
    try {
      this.getRoleList()
      this.getPermissionList()
    } finally {
      this.isLoading = false
    }
  },
  data () {
    return {
      curEditingRole: {},
      checkedKeys: [],
      halfCheckedKeys: [],
      defaultProps: {
        label: 'name',
        children: 'children',
      },
      expandRowKeys: [],
      permissionList: [],
      isAuthorizeDlgVisible: false,
      isLoading: true,
      pageData: {
        current: 1,
        size: 10,
      },
    }
  },
  methods: {
    async getRoleList () {
      const { data: { data: pageData } } = await this.$axios.get(`/api/role/withPermissions?pageNum=${this.pageData.current}&pageSize=${this.pageData.size}`)
      pageData.records = pageData.records.map(this.treefy)
      this.pageData = pageData
    },
    async getPermissionList () {
      const { data: { data: data } } = await this.$axios.get('/api/permission/list')
      this.permissionList = data
    },
    /* 将角色对应权限转化为树形结构 */
    treefy (role) {
      const permissions = {}
      role.permissions.forEach(item => permissions[item.id] = item)
      Object.values(permissions).forEach(item => {
        if (item.parentId !== 0) {
          if (permissions[item.parentId]['children'] === undefined) {
            permissions[item.parentId]['children'] = []
          }
          permissions[item.parentId]['children'].push(item)
        }
      })
      role.permissions = Object.values(permissions).filter(item => item.parentId === 0)
      return role
    },
    /* 修改角色状态 */
    changeStatus () {
      console.log(this.pageData)
    },
    /* 点击tag，修改角色权限 */
    async delPermission (role, p1, p2, p3) {
      /* 删除三级权限 */
      const toDel = []
      if (p3) {
        toDel.push(p3.id)
        if (p2.children.length === 1) {
          toDel.push(p2.id)
          if (p1.children.length === 1) {
            toDel.push(p1.id)
          }
        }
      }
      /* 删除2级权限 */
      else if (p2) {
        p2.children.forEach(v => toDel.push(v.id))
        toDel.push(p2.id)
        if (p1.children.length === 1) {
          toDel.push(p1.id)
        }
      } else {
        p1.children.forEach(v1 => { v1.children.forEach(v2 => toDel.push(v2.id)); toDel.push(v1.id) })
        toDel.push(p1.id)
      }
      const msg = p3 ? '此操作将永久删除该角色对应的权限, 是否继续?' : '此操作将永久删除该角色对应的权限及其子权限, 是否继续?'
      const ret = await this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (ret !== 'confirm') {
        return this.$message.info("操作取消")
      }
      const { data: res } = await this.$axios.post('/api/role/unauthorize', { roleId: role.id, permissionIds: toDel })
      if (res) {
        this.$message.success("操作成功")
        this.getRoleList()
      }
    },

    /* 分配权限 */
    showPermissionDlg (role) {
      this.curEditingRole = role;
      [this.checkedKeys, this.halfCheckedKeys] = this.checkKeys()
      console.log(this.checkedKeys)
      console.log(this.halfCheckedKeys)
      this.isAuthorizeDlgVisible = true
      /* 也可以在open回调中 */
      this.$nextTick(() => this.$refs.permissionTree.setCheckedKeys(this.checkedKeys))
    },
    async updatePermission () {
      try {
        const checkedKeys = this.$refs.permissionTree.getCheckedKeys()
        const halfChekedKeys = this.$refs.permissionTree.getHalfCheckedKeys()
        const newCheckedKeys = [...checkedKeys, ...halfChekedKeys]
        const oldCheckedKeys = [...this.checkedKeys, ...this.halfCheckedKeys]
        const toDel = setUtil.diff(oldCheckedKeys, newCheckedKeys)
        const toAdd = setUtil.diff(newCheckedKeys, oldCheckedKeys)
        console.log(newCheckedKeys)
        console.log(oldCheckedKeys)

        this.isLoading = true
        let refresh = false
        if (toDel.length !== 0) {
          const { data: res } = await this.$axios.post('/api/role/unauthorize', { roleId: this.curEditingRole.id, permissionIds: toDel })
          this.$message.success("撤销权限成功")
          refresh = res !== undefined
        }

        if (toAdd.length !== 0) {
          const { data: res } = await this.$axios.post('/api/role/authorize', { roleId: this.curEditingRole.id, permissionIds: toAdd })
          this.$message.success("新增权限成功")
          refresh = res !== undefined
        }

        if (refresh) {
          this.getRoleList()
        }
      }
      finally {
        this.isAuthorizeDlgVisible = false
        this.isLoading = false
      }
    },
    checkKeys () {
      const [checkedKeys, halfCheckedKeys] = [[], []]
      const getLeafNodes = permission => {
        if (permission.children) {
          halfCheckedKeys.push(permission.id)
          permission.children.forEach(getLeafNodes)
        } else {
          checkedKeys.push(permission.id)
        }
      }
      if (this.curEditingRole.permissions) {
        this.curEditingRole.permissions.forEach(getLeafNodes)
      }
      return [checkedKeys, halfCheckedKeys]
    },
    /* 处理pageSize变化 */
    async handleSizeChange (size) {
      this.pageData.size = size
      await this.getRoleList()
    },
    /*当前页改变*/
    async handleCurrentChange (current) {
      this.pageData.current = current
      await this.getRoleList()
    },
    /* 下一页 */
    async nextPage () {
      this.pageData.current++
      await this.getRoleList()
    },

    async prevPage () {
      this.pageData.current--
      await this.getRoleList()
    },
    handleClose (done) {
      done()
    },
  },
}
</script>

<style scoped lang="less">
.el-card {
  margin-top: 20px;
}

.el-tag {
  margin: 8px;
}

.bd-bottom {
  border-bottom: 1px solid #eee;
}

.bd-top {
  border-top: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}

.el-pagination {
  margin-top: 15px;
}
</style>
