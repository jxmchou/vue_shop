<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>

      <!-- 选择商品分类区域 -->
      <el-row>
        <el-col>
          <span style="color:white;paddingLeft:20px">选择商品分类：</span>
          <!-- 级联选择框区域 -->
          <el-cascader
            v-model="selectKeys"
            :options="cateList"
            :props="cascaderProps"
            @change="handleChange"
            style="width: 30%"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- Tabs 标签页区域 -->
      <el-tabs
        type="border-card"
        v-model="activeName"
        @tab-click="handleTabClick"
      >
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="small"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="items">
                <el-tag
                  v-for="(item, index) in items.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, items.row)"
                  >{{ item }}</el-tag
                >
                <!-- 添加tag标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="items.row.inputVisible"
                  v-model="items.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(items.row)"
                  @blur="handleInputConfirm(items.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(items.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="item">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(item.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(item.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="small"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="items">
                <el-tag
                  v-for="(item, index) in items.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, items.row)"
                  >{{ item }}</el-tag
                >
                <!-- 添加tag标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="items.row.inputVisible"
                  v-model="items.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(items.row)"
                  @blur="handleInputConfirm(items.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(items.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="item">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(item.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(item.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 添加参数的对话框 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框-大部分都复用了添加参数的参数，属性，函数 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 修改按钮添加参数的对话框 -->
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data() {
    return {
      cateList: [], // 商品分类列表数据
      // 级联选择框的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
        expandTrigger: 'hover'
      },
      // 级联选择框双向绑定的数据
      selectKeys: [],
      activeName: 'many', // Tabs 页签默认激活展示的名称
      manyTableData: [], // 动态参数的数据
      onlyTableData: [], // 静态参数的数据
      addDialogVisible: false, // 控制添加对话框的显示与隐藏
      editDialogVisible: false, // 控制修改对话框的显示与隐藏
      // 添加参数的表单数据对象
      addForm: {
        attr_id: ''
      },
      // 修改的表单数据对象
      editForm: {
        attr_id: '', // 属性 ID
        attr_name: ''
      },
      // 添加/修改表单的验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    test() {
      console.log(123)
    },
    // 获取所有商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.cateList = res.data
      //  this.$message.success(res.meta.msg)
    },
    // 封装发送请求数据
    async getParamsData() {
      if (this.selectKeys.length !== 3) {
        this.selectKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // console.log(this.selectKeys.length)
      // 通过所选商品分类id和所在面板，获取对应数据
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // console.log(res)
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示于隐藏
        item.inputVisible = false
        // 文本框输入的值
        item.inputValue = ''
      })
      // console.log(res.data);
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 级联选择框发生变化时调用
    async handleChange() {
      this.getParamsData()
    },
    // Tabs 页签点击事件的处理函数
    handleTabClick() {
      this.getParamsData()
    },
    // 监听添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加参数，添加参数
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败！')
        }
        this.$message.success('添加参数成功！')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    // 点击修改按钮，弹出对话框
    showEditDialog(item) {
      // 可调用接口来做
      this.editForm = item
      this.editDialogVisible = true
      // console.log(this.editForm)
    },
    // 修改按钮点击按钮，添加参数
    editParams() {
      this.$refs.addFormRef.validate(async (value) => {
        if (!value) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        )
        // console.log(res.data)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.editDialogVisible = false
        this.getParamsData()
        this.$message.success(res.meta.msg)
      })
    },
    // 点击删除并询问确认删除
    async removeParams(attrId) {
      try {
        // console.log(typeof attrId.attr_id);
        // 弹框询问是否删除
        await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let { data: res } = await this.$http.delete(
          `categories/${this.cateId}/attributes/${attrId.attr_id}`
        )
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getParamsData()
      } catch (err) {
        this.$message.info('已经取消了删除 ' + err)
      }
    },
    // 文本框失去焦点或按下enter键时触发
    async handleInputConfirm(value) {
      if (value.inputValue.trim().length === 0) {
        value.inputVisible = false
        value.inputValue = ''
        return
      }
      // 成功的操作
      value.attr_vals.push(value.inputValue.trim())
      value.inputValue = ''
      value.inputVisible = false
      this.saveAttrVals(value)
    },
    // 封装保存/删除的接口
    async saveAttrVals(value) {
      // 发送请求保存数据到后台
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${value.attr_id}`,
        {
          attr_name: value.attr_name,
          attr_sel: value.attr_sel,
          attr_vals: value.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    // 点击按钮，展示文本输入框
    showInput(item) {
      item.inputVisible = true
      // 让文本框自动获取焦点
      // nextTick：代表当页面元素重新渲染后，才执行回调函数
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 点击删除tag标签
    async handleClose(i, value) {
      value.attr_vals.splice(i, 1)
      this.saveAttrVals(value)
    }
  },
  computed: {
    // 判断按钮是否禁用 true/false
    isBtnDisabled() {
      if (this.selectKeys.length !== 3) {
        return true
      }
      return false
    },
    // 获取第三级分类的id
    cateId() {
      if (this.selectKeys.length === 3) {
        return this.selectKeys[2]
      }
      return null
    },
    // 动态计算标题
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.el-card{
  width: 100%;
  height: 100%;
}
.el-row {
  margin: 15px 0;
}

.el-tag {
  margin: 10px;
}

.input-new-tag {
  width: 100px;
  margin-left: 10px;
}
</style>
