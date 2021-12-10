<template>
  <div id="goodsAdd-component">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'goodsAdd' }"
        >商品管理</el-breadcrumb-item
      >
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="warning"
        effect="dark"
        show-icon
        center
        :closable="false"
      >
      </el-alert>
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules">
        <el-tabs tab-position="left" v-model="activeIndex">
          <el-tab-pane label="基本信息" name="0" :disabled="disableTabs[0]">
            <el-form-item prop="goodsName" label="商品名称">
              <el-input v-model="addForm.goodsName"></el-input>
            </el-form-item>
            <el-form-item prop="goodsPrice" label="商品价格">
              <el-input v-model="addForm.goodsPrice" type="number"></el-input>
            </el-form-item>
            <el-form-item prop="goodsNumber" label="商品数量">
              <el-input v-model="addForm.goodsNumber" type="number"></el-input>
            </el-form-item>
            <el-form-item prop="goodsWeight" label="商品重量">
              <el-input v-model="addForm.goodsWeight" type="number"></el-input>
            </el-form-item>
            <el-form-item prop="goodsCate" label="商品分类">
              <el-cascader
                v-model="addForm.goodsCate"
                :props="cascaderProps"
                clearable
                filterable
                placeholder="搜索"
              ></el-cascader>
            </el-form-item>
            <el-row type="flex" justify="center">
              <el-button @click="goNextTab(0)">下一步</el-button>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1" :disabled="disableTabs[1]">
            <el-form-item v-for="item in manyTableData" :key="item.id">
              {{ item.name }}
              <el-checkbox-group v-model="item.attrValArr">
                <el-checkbox
                  size="small"
                  border
                  :label="val"
                  v-for="val in item.attrValArr"
                  :key="val"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-row type="flex" justify="center">
              <el-button @click="goPrevTab(1)">上一步</el-button>
              <el-button @click="goNextTab(1)">下一步</el-button>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2" :disabled="disableTabs[2]">
            <el-form-item
              :label="item.name"
              v-for="item in onlyTableData"
              :key="item.id"
            >
              <el-input v-model="item.attrVals"></el-input>
            </el-form-item>
            <el-row type="flex" justify="center">
              <el-button @click="goPrevTab(2)">上一步</el-button>
              <el-button @click="goNextTab(2)">下一步</el-button>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3" :disabled="disableTabs[3]">
            <el-upload
              :auto-upload="false"
              action=""
              accept="image/png, image/jpeg"
              with-credentials
              :on-change="fileChange"
              :on-preview="handlePreview"
              :before-remove="beforeRemove"
              :file-list="fileList"
              multiple
              list-type="picture"
              drag
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将图片拖到此处，或<em>点击上传</em>
              </div>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
            <hr />
            <el-row type="flex" justify="center">
              <el-button @click="goPrevTab(3)">上一步</el-button>
              <el-button @click="goNextTab(3)">下一步</el-button>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4" :disabled="disableTabs[4]">
            <quillEditor v-model="addForm.goodsIntro"></quillEditor>
            <el-row type="flex" justify="center">
              <el-button @click="goPrevTab(4)">上一步</el-button>
              <el-button @click="goNextTab(4)">下一步</el-button>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="完成" name="5" :disabled="disableTabs[5]">
            <el-row type="flex" justify="center">
              <el-button @click="goPrevTab(5)">上一步</el-button>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-form>

      <el-dialog title="查看图片" :visible.sync="dialogVisible">
        <img :src="imgSrc" alt="" style="max-width: 600px" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'goodsAdd',
  data () {
    return {
      dialogVisible: false,
      imgSrc: '',
      /* 当前已经拿到数据的attr id */
      loadedCateId: undefined,
      disableTabs: [false, true, true, true, true, true],
      cascaderProps: {
        checkStrictly: false,
        expandTrigger: 'hover',
        value: 'catId',
        label: 'catName',
        filerable: true,
        lazy: true,
        lazyLoad: this.lazyLoadCas
      },
      activeIndex: '0',
      addForm: {
        goodsName: 'gggg',
        goodsPrice: 0,
        goodsNumber: 0,
        goodsWeight: 0,
        goodsCate: [],
        goodsIntro: '',
      },
      manyTableData: [],
      onlyTableData: [],
      addFormRules: {
        goodsName: [{
          required: true, trigger: 'blur', message: '请输入商品名'
        }],
        goodsPrice: [
          { required: true, trigger: 'blur', message: '请输入商品价格' }
        ],
        goodsNumber: [
          { required: true, trigger: 'blur', message: '请输入商品数量' }
        ],
        goodsWeight: [
          { required: true, trigger: 'blur', message: '请输入商品重量' }
        ],
        goodsCate: [
          {
            required: true, message: '请选择分类', trigger: 'change', type: 'array'
          }
        ],
      },
      tabValidators: [
        /* tab0 校验 */
        function () {
          let canGo = false
          this.$refs.addFormRef.validate(v => {
            canGo = v
          })
          return canGo
        },
        // TODO
        /* tab1校验  TODO*/
        function () {
          console.log("tab1校验")
          return true
        },
        // TODO
        /* tab2校验 TODO */
        function () {
          return true
        },
        // TODO
        /* tab3 */
        function () {
          return true
        },
        function () {
          return true
        },
        function () {
          return true
        }
      ],
      /* 进入每个页面前的初始化 */
      tabInitors: [
        async function () { },
        async function () {
          if (this.formCateId === this.loadedCateId) return
          const params = { categoryId: this.formCateId, attrSel: 'many' }
          const { data: { data: data } } = await this.$axios.get('/api/attribute', { params })
          data.forEach(this.wrapperAttr)
          this.manyTableData = data
        },
        async function () {
          if (this.formCateId === this.loadedCateId) return
          const params = { categoryId: this.formCateId, attrSel: 'only' }
          const { data: { data: data } } = await this.$axios.get('/api/attribute', { params })
          this.onlyTableData = data
          console.log(this.onlyTableData)
        },
        async function () { },
        async function () { },
        async function () { },
      ],
      fileList: []
    }
  },
  methods: {
    async fileChange (file, fileList) {
      const data = new FormData()
      data.append("file", file.raw)
      const res = await this.$axios.post("/api/file/upload", data, { 'Content-Type': 'multipart/form-data' })
      if (res) {
        file.uri = res.data.data.uri
      } else {
        fileList.pop()
      }
    },
    handlePreview (file) {
      this.dialogVisible = true
      this.imgSrc = file.uri
    },
    async beforeRemove (file) {
      const res = await this.$axios.delete('/api/file/remove', { params: { uri: file.uri } })
      if (res) {
        return true
      }
      return false
    },
    /* 为每个参数设置输入框、属性字符串split的数组等 */
    wrapperAttr (item) {
      item.attrValArr = item.attrVals ? item.attrVals.split(',') : []
    },
    async goNextTab (curTab) {
      // if (this.tabValidators[curTab].call(this)) {
      this.disableTabs[curTab + 1] = false
      this.disableTabs[curTab] = true
      await this.tabInitors[curTab + 1].call(this)
      this.activeIndex = curTab + 1 + ''
      // } else {
      //   this.$notify({
      //     title: '警告',
      //     message: '请填写完整',
      //     type: 'warning',
      //     position: 'bottom-left'
      //   })
      // }
    },
    goPrevTab (curTab) {
      this.disableTabs[curTab - 1] = false
      this.disableTabs[curTab] = true
      this.activeIndex = curTab - 1 + ''
    },
    /* 动态加载分类 */
    async lazyLoadCas (node, resolve) {
      if (node.data && node.data.leaf) {
        return resolve()
      }
      const pid = node.root ? 0 : node.data.catId
      const { data: { data: data } } = await this.$axios.get(`/api/category/list?pid=${pid}`)
      return resolve(data)
    },
  },
  computed: {
    formCateId () {
      return this.addForm.goodsCate[this.addForm.goodsCate.length - 1]
    },
  },
  components: {
    quillEditor
  },
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

.el-steps {
  margin-top: 15px;
  margin-bottom: 15px;
}

/deep/ .el-step__title {
  font-size: 10px;
}

/deep/ .el-cascader {
  width: 100%;
}

/deep/ .el-dialog__body {
  text-align: center;
  padding-bottom: 30px;
}

/deep/ .ql-container {
  min-height: 300px;
  margin-bottom: 20px;
}
</style>

