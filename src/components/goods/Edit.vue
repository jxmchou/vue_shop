<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert
        title="修改商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      ></el-alert>

      <!-- Steps 步骤条  
      引导用户按照流程完成任务的分步导航条，可根据实际应用场景设定步骤，步骤不得少于 2 步。 -->
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

      <!-- tab栏区域 -->
      <el-form
        :model="editFormById"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="editFormById.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                type="number"
                v-model="editFormById.goods_price"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                type="number"
                v-model="editFormById.goods_weight"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                type="number"
                v-model="editFormById.goods_number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="editFormById.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
                style="width: 30%"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染动态参数item数据  -->
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="itemVals"
                  v-for="(itemVals, index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action：图片要上传的后台api接口地址 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="editFormById.goods_introduce"></quill-editor>
            <!-- 修改商品按钮 -->
            <el-button type="primary" class="buttonEdit" @click="Edit"
              >修改商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 预览图片对话框 -->
    <el-dialog title="预览图片" :visible.sync="urlDialogVisible" width="50%">
      <img class="previewImg" :src="previewPath" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'Edit',
  data() {
    return {
      editId: this.$route.query.value,
      editFormById: {},
      activeIndex: '0', // 控制侧边导航
      editFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      cateList: [],
      cateProps: {
        // checkStrictly: true,
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      manyTableData: [], // 动态参数的数据
      onlyTableData: [], // 静态属性的数据
      // 需要上传的图片的后台接口地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的headers请求头对象，获取token
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片的真实路径
      previewPath: '',
      // 隐藏/显示预览图片对话框
      urlDialogVisible: false
    }
  },
  created() {
    this.getcateList()
    this.getEditById()
  },

  methods: {
    // 根据商品ID获取数据回调
    async getEditById() {
      // console.log(this.editId)
      const { data: res } = await this.$http.get(`goods/${this.editId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('根据商品ID未获得数据')
      }
      this.editFormById = res.data
      this.editFormById.goods_cat = []
    },
    // 获取商品分类数据回调
    async getcateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // this.$message.success(res.meta.msg)
      // console.log(res.data)
      this.cateList = res.data
    },
    // 级联选择器改变时回调
    handleChange() {
      if (this.editFormById.goods_cat.length !== 3) {
        this.editFormById.goods_cat = []
      }
    },
    // 点击 Tabs 标签切换时的回调
    beforeTabLeave(news, old) {
      if (old === '0' && this.editFormById.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // 点击 Tabs 获取对应接口的回调
    async tabClicked() {
      // 获取动态参数的接口
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: 'many' } }
        )
        // console.log(res.data);
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: 'only' } }
        )
        // console.log(res.data);
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.onlyTableData = res.data
      }
    },
    // 点击/处理图片预览效果回调
    handlePreview(file) {
      // console.log(file);
      this.previewPath = file.response.data.url
      this.urlDialogVisible = true
    },
    // 处理移除图片的操作回调
    handleRemove(file) {
      // 1. 获取将要删除的图片临时路径
      const filePath = file.response.data.tmp_path
      // 2. 从 pics 数组中找到对应的索引值
      const index = this.editForm.pics.findIndex((item) => {
        item.pic === filePath
      })
      // 3. 调用 splice 方法，删除该图片信息
      this.editForm.pics.splice(index, 1)
      // console.log(index,this.editForm.pics);
    },
    // 上传完成后的回调
    handleSuccess(response) {
      // console.log(response);
      // 1. 拼接得到一个图片信息对象
      const picInfo = {
        pic: response.data.tmp_path
      }
      // 2. 将图片信息对象，push 到 pics 数组中
      this.editForm.pics.push(picInfo)
      // console.log(this.editForm);
    },
    // 修改商品回调
    Edit() {
      this.$refs.editFormRef.validate(async (value) => {
        if (!value) {
          return this.$message.error('请填写必要的表单内容')
        }
        // 处理动态参数
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.editFormById.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.editFormById.attrs.push(newInfo)
        })
        // 发送请求修改商品接口
        // 商品名称是唯一的
        console.log(this.editId)
        let {
          goods_name,
          goods_price,
          goods_number,
          goods_weight
          
        } = this.editFormById
        console.log(this.editFormById.goods_cat,typeof this.editFormById.goods_cat);
        const { data: res } = await this.$http.put(`goods/${this.editId}`, {
          goods_name,
          goods_price,
          goods_number,
          goods_weight
        })
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('修改商品失败！')
        }
        this.$message.success('修改商品成功！')
        this.$router.push('/home/goods')
      })
    }
  },
  computed: {
    // 获取第三级分类的id
    cateId() {
      if (this.editFormById.goods_cat.length === 3) {
        return this.editFormById.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 5px 10px !important;
}
.previewImg {
  width: 100%;
}
.buttonEdit {
  margin-top: 15px;
}
</style>
