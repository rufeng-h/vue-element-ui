<template>
  <div id="users-component">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'users' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            v-model="query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchUser"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="isUserAddDlgVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!--   添加用户对话框   -->
      <el-dialog
        title="添加用户"
        :visible.sync="isUserAddDlgVisible"
        width="50%"
        :before-close="handleClose"
      >
        <!-- 添加表单    -->
        <el-form
          :model="userAddForm"
          :rules="userAddFormRules"
          ref="ruleAddForm"
          label-width="100px"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="用户名" prop="username">
                <el-input
                  v-model="userAddForm.username"
                  type="text"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="userAddForm.email" type="email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="userAddForm.mobile" type="tel"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="QQ" prop="qq">
                <el-input v-model="userAddForm.qq" type="text"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="性别" prop="gender">
                <el-select v-model="userAddForm.gender" placeholder="请选择">
                  <el-option
                    v-for="item in ['male', 'female']"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年龄" prop="age">
                <el-input
                  v-model="userAddForm.age"
                  type="number"
                  min="18"
                  max="100"
                  maxlength="5"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="13">
              <el-form-item label="分配角色" prop="roles">
                <el-select
                  :disabled="isSuperAdmin"
                  v-model="userAddForm.roles"
                  placeholder="请选择"
                  multiple
                >
                  <el-option
                    v-for="item in roleList"
                    :key="item.id"
                    :label="item.desp"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="超级管理员">
                <el-checkbox v-model="isSuperAdmin"></el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="简介" prop="introduction">
            <el-input
              v-model="userAddForm.introduction"
              type="textarea"
              placeholder="介绍下自己吧"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isUserAddDlgVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!--   修改用户对话框   -->
      <el-dialog
        title="修改用户"
        :visible.sync="isUserEditDlgVisible"
        width="50%"
        :before-close="handleClose"
      >
        <!-- 修改表单    -->
        <el-form
          :model="userEditForm"
          :rules="userEditFormRules"
          ref="ruleEditForm"
          label-width="100px"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="用户名" prop="username">
                <el-input
                  disabled
                  v-model="userEditForm.username"
                  type="text"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="userEditForm.email" type="email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="userEditForm.mobile" type="tel"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="QQ" prop="qq">
                <el-input v-model="userEditForm.qq" type="text"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="性别" prop="gender">
                <el-select
                  v-model="userEditForm.gender"
                  placeholder="请选择"
                  disabled
                >
                  <el-option
                    v-for="item in ['male', 'female']"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年龄" prop="age">
                <el-input
                  disabled
                  v-model="userEditForm.age"
                  type="number"
                  min="18"
                  max="100"
                  maxlength="5"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="13">
              <el-form-item label="分配角色" prop="roles">
                <el-select
                  :disabled="isSuperAdmin"
                  v-model="userEditForm.roles"
                  placeholder="请选择"
                  multiple
                >
                  <el-option
                    v-for="item in roleList"
                    :key="item.id"
                    :label="item.desp"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="超级管理员">
                <el-checkbox v-model="isSuperAdmin"></el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="简介" prop="introduction">
            <el-input
              v-model="userEditForm.introduction"
              type="textarea"
              placeholder="介绍下自己吧"
            ></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="isUserEditDlgVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateUser">确 定</el-button>
        </span>
      </el-dialog>
      <!--      用户列表区域 -->
      <el-table
        v-loading="isLoading"
        :data="pageData.records"
        border
        style="width: 100%"
        stripe
        :highlight-current-row="true"
        empty-text="--"
      >
        <!--   行展开 TODO 样式     -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline>
              <el-form-item label="用户名">
                <span>{{ props.row.username }}</span>
              </el-form-item>
              <el-form-item label="性别">
                <span>{{ props.row.gender }}</span>
              </el-form-item>
              <el-form-item label="手机">
                <span>{{ props.row.mobile }}</span>
              </el-form-item>
              <el-form-item label="邮箱">
                <span>{{ props.row.email }}</span>
              </el-form-item>
              <el-form-item label="注册时间">
                <span>{{ props.row.createTime }}</span>
              </el-form-item>
              <el-form-item label="上次登录">
                <span>{{ props.row.lastLoginTime }}</span>
              </el-form-item>
              <el-form-item label="简介">
                <span>{{ props.row.introduction }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <!-- <el-table-column prop="id" label="用户id"></el-table-column> -->
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="gender" label="性别"></el-table-column>
        <el-table-column prop="age" label="年龄"></el-table-column>
        <el-table-column prop="roles" label="角色">
          <template slot-scope="scope">
            <span>{{ scope.row.roles.map((v) => v.desp).join('，') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="200"
        ></el-table-column>
        <el-table-column prop="qq" label="QQ" width="150"></el-table-column>
        <el-table-column
          prop="introduction"
          label="简介"
          width="300"
        ></el-table-column>
        <el-table-column
          prop="lastLoginTime"
          label="上次登录"
          width="200"
          sortable
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="注册时间"
          width="200"
        ></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-switch :value="scope.row.status === 1" disabled></el-switch>
          </template>
          <!--    测试！      -->
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              @click="showEditDlg(scope.row)"
              type="primary"
              size="small"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="deleteUser(scope.row)"
            ></el-button>
            <!--  需要相关权限   -->
            <el-tooltip content="设置用户角色" placement="top" effect="light">
              <el-button
                type="warning"
                size="small"
                icon="el-icon-setting"
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

export default {
  created () {
    this.getUserList()
    this.getRoles()
  },
  name: "Users",
  data () {
    const uniqueCheck = (column, chs) => {
      return (rule, value, callback) => {
        this.$axios.get(`/api/user/check?column=${column}&value=${value}`).then(res => {
          if (res.data.data.isValid) {
            callback()
          } else {
            callback(new Error(chs + "已存在"))
          }
        })
      }
    }
    return {
      isSuperAdmin: false,
      pageData: {
        current: 1,
        size: 10,
      },
      /* 数据库角色列表 */
      roleList: [],
      query: "",
      isLoading: false,
      isUserAddDlgVisible: false,
      isUserEditDlgVisible: false,

      userAddForm: {
        username: '',
        mobile: '',
        email: '',
        introduction: '',
        qq: '',
        gender: '',
        age: '',
        roles: [],
      },
      userEditForm: {
        username: '',
        mobile: '',
        email: '',
        introduction: '',
        qq: '',
        gender: '',
        age: '',
        roles: [],
      },
      userAddFormRules: {
        'username': [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在2到10个字符', trigger: 'blur' },
          {
            validator: uniqueCheck("username", "用户名"), trigger: 'blur',
          }
        ],
        'gender': [
          { required: true, message: "请选择性别", trigger: 'blur' }
        ],
        roles: [{ required: true, message: "请分配角色" }],
        'age': [{
          required: true, validator: (rule, value, callback) => {
            if (value >= 18 && value <= 100) {
              callback()
            } else {
              callback(new Error("请输入正确的年龄"))
            }
          }
        }],
        'qq': [{
          validator: (rule, value, callback) => {
            if (value) {
              uniqueCheck("qq", "QQ")(rule, value, callback)
            } else {
              callback()
            }
          }
        }],
        'email': [
          {
            required: true, trigger: 'blur',
            pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/, message: "请输入正确的邮箱"
          },
          { validator: uniqueCheck("email", "邮箱"), trigger: 'blur' }],
        'mobile': [{
          pattern: /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
          , trigger: 'blur', required: true, message: '请输入正确的手机号'
        },
        { validator: uniqueCheck("mobile", "手机"), trigger: 'blur', }],
      },
      userEditFormRules: {
        /* 验证 */
        'qq': [{
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (value !== this.curEditingUser.qq) {
              uniqueCheck("qq", "QQ")(rule, value, callback)
            } else {
              callback()
            }
          }
        }],
        'email': [
          {
            required: true, trigger: 'blur',
            pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/, message: "请输入正确的邮箱"
          },
          {
            validator: (rule, value, callback) => {
              if (value !== this.curEditingUser.email) {
                uniqueCheck("email", "邮箱")(rule, value, callback)
              } else {
                callback()
              }
            }, trigger: 'blur'
          }
        ],
        'mobile':
          [
            {
              pattern: /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
              , trigger: 'blur', required: true, message: '请输入正确的手机号'
            },
            {
              validator: (rule, value, callbak) => {
                if (value !== this.curEditingUser.mobile) uniqueCheck("mobile", "手机")(rule, value, callbak)
                else callbak()
              }, trigger: 'blur'
            }
          ],
        roles: [{ required: true, message: "请分配角色" }],
      },
      curEditingUser: {},
    }

  },
  methods: {

    /* 获取数据库所有角色 */
    async getRoles () {
      const { data: res } = await this.$axios.get('/api/role/list')
      this.roleList = res.data
    },
    /* 添加用户开始 */
    async addUser () {
      await this.$refs.ruleAddForm.validate(async isValid => {
        if (!isValid) return
        const { data: res } = await this.$axios.post("/api/user/add", this.userAddForm)
        if (res) {
          this.$message.success("添加成功")
          this.isUserAddDlgVisible = false
          this.getUserList()
          this.$refs.ruleAddForm.resetFields()
        }
      })
    },
    /* 添加用户结束 */
    async getUserList () {
      try {
        this.isLoading = true
        const { data: res } = await this.$axios.post(
          `/api/user/list?pageSize=${this.pageData.size}&pageNum=${this.pageData.current}`)
        this.pageData = res.data
      } finally {
        this.isLoading = false
      }
    },
    async searchUser () {
      if (!this.query) {
        this.$message.warning("请输入查询参数!")
        return
      }
      try {
        this.isLoading = true
        const { data: res } = await this.$axios.get(`/api/user/search?query=${this.query}`)
        this.pageData = res.data
      } finally {
        this.isLoading = false
      }
    },
    async deleteUser (user) {
      const { data: res } = await this.$axios.delete(`/api/user/${user.id}`)
      const users = this.pageData.records
      user.status = 0
      for (let i = 0; i < users.length; i++) {
        if (users[i].id === user.id) {
          // users.splice(i, 1);
          this.$message.success(res.message)
          return
        }
      }
    },
    /* 修改用户 */
    showEditDlg (user) {
      this.userEditForm = Object.assign({}, user)
      this.userEditForm.roles = user.roles.map(role => role.id)
      this.isUserEditDlgVisible = true
      this.curEditingUser = user
    },
    async updateUser () {
      await this.$refs.ruleEditForm.validate(async v => {
        if (!v) return
        const { data: res } = await this.$axios.post('/api/user/update', this.userEditForm)
        if (res) {
          this.$message.success("修改成功")
          this.isUserEditDlgVisible = false
          this.$refs.ruleEditForm.resetFields()
          await this.getUserList()
        }
      })
    },
    /* 修改用户结束 */

    /* 处理pageSize变化 */
    async handleSizeChange (size) {
      this.pageData.size = size
      await this.getUserList()
    },
    /*当前页改变*/
    async handleCurrentChange (current) {
      this.pageData.current = current
      await this.getUserList()
    },
    /* 下一页 */
    async nextPage () {
      this.pageData.current++
      await this.getUserList()
    },

    async prevPage () {
      this.pageData.current--
      await this.getUserList()
    },
    handleClose (done) {
      done()
    }
  }
}
</script>

<style scoped lang="less">
.el-breadcrumb {
  font-size: 0.9em;
  margin-bottom: 15px;
}

.box-card {
  box-shadow: rgba(56, 62, 159, 0.8) 0 0 1px 1px;
}

.el-table {
  margin-top: 20px;
}

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.el-pagination {
  margin-top: 15px;
}
</style>
