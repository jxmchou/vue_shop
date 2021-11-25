<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入分类id"
            v-model="cateList.cat_id"
            clearable
            @clear="getCateList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchCate"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格数据区域 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <!-- 勾选模板 -->
        <template v-slot:isok="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: aqua"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序模板 -->
        <template v-slot:order="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作模板 -->
        <template v-slot:opt="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCate(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeCateById(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 9, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加分类对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addCateDialogClosed"
      >
        <!-- 内容区域 -->
        <el-form
          ref="addCateFormRef"
          :model="addFrom"
          :rules="addFromRules"
          label-width="100px"
        >
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addFrom.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <!-- 
              options 代表父级分类的数据 parentCateList
              props 代表配置对象 value 等
             -->
            <el-cascader
              v-model="selectKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChange"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑/修改分类对话框 -->
      <el-dialog
        title="修改分类对话框"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editCateDialogClosed"
      >
        <el-form
          :model="editCateList"
          :rules="addFromRules"
          ref="editCateFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="editCateList.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCateDialog">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { cate } from '../../common/mixin'
export default {
  name: 'Cate',
  data() {
    return {
      // 默认的查询商品参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [], // 商品分类的全部数据列表
      total: 0, // 默认总条数
      addDialogVisible: false, // 控制添加用户对话框的显示/隐藏
      editDialogVisible: false, // 控制修改用户对话框的显示/隐藏
      setRolesDialogVisible: false, // 控制分配权限对话框的显示/隐藏
      // 添加分类的默认参数
      addFrom: {
        cat_pid: 0, // 分类父 ID
        cat_name: '', // 分类名称
        cat_level: 0 // 分类层级 0 表示一级分类
      },
      // 为 tree-table 指定列的定义 cate mixins混入 columns 属性
      parentCateList: [], // 只有父级分类的数据
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
        expandTrigger: 'hover'
      },
      // 选中的父级分类的id数组
      selectKeys: [],
      // 编辑分类返回的数据
      editCateList: {
        // cat_id:0,
        // cat_name:''
      }
    }
  },
  mixins: [cate],
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类的数据列表数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      //  console.log(res.data.result);
      this.cateList = res.data.result
      this.total = res.data.total
      //  this.$message.success(res.meta.msg)
    },
    // 监听 pagesize 每页条数 改变的事件
    handleSizeChange(newSize) {
      // console.log(`每页 ${newSize} 条`);
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum 页码值 改变的事件
    handleCurrentChange(newPage) {
      // console.log(`当前页: ${newPage}`)
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击添加弹出对话框
    showAddCateDialog() {
      this.getParentCateList()
      this.addDialogVisible = true
      this.$message.success('获取父级分类列表数据成功')
    },
    // 获取父级分类数据的回调
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.parentCateList = res.data
    },
    // 级联选择器发生变化的回调
    parentCateChange() {
      if (this.selectKeys.length > 0) {
        // 当前元素父级分类的id
        this.addFrom.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        // 当前分类名称的等级（0,1,2） => 观察可得：selectKeys.length
        this.addFrom.cat_level = this.selectKeys.length
        return
      } else {
        this.addFrom.cat_pid = 0
        this.addFrom.cat_level = 0
      }
    },
    // 点击按钮，添加新的分类
    addCate() {
      // validate(()=>{}) 所有表单校验属性
      this.$refs.addCateFormRef.validate(async (value) => {
        if (!value) return
        const { data: res } = await this.$http.post('categories', this.addFrom)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getCateList()
        this.addDialogVisible = false
      })
    },
    // 监听添加对话框关闭，重置表单数据
    addCateDialogClosed() {
      // resetFields() 表单重置属性
      this.$refs.addCateFormRef.resetFields()
      this.selectKeys = []
      this.addFrom.cat_pid = 0
      this.addFrom.cat_level = 0
    },
    // 通过id获取修改数据
    async editCate(item) {
      const { data: res } = await this.$http.put('categories/' + item.cat_id, {
        cat_name: item.cat_name
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editCateList = res.data
      this.editDialogVisible = true
      this.$message.success(res.meta.msg)
    },
    // 监听修改对话框关闭，重置表单数据
    editCateDialogClosed() {
      this.$refs.editCateFormRef.resetFields()
    },
    // 点击按钮，修改分类名称并校验
    editCateDialog() {
      this.$refs.editCateFormRef.validate(async (value) => {
        if (!value) return
        let { cat_id, cat_name } = this.editCateList
        const { data: res } = await this.$http.put('categories/' + cat_id, {
          cat_name
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.getCateList()
        this.editDialogVisible = false
        this.$message.success(res.meta.msg)
      })
    },
    // 点击删除按钮，询问是否删除
    async removeCateById(cat_id) {
      try {
        // 弹框询问是否删除
        await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let { data: res } = await this.$http.delete('categories/' + cat_id)
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getCateList()
      } catch (err) {
        this.$message.info('已经取消了删除 ' + err)
      }
    },
    async searchCate() {
      let searchId = this.cateList.cat_id
      const { data: res } = await this.$http.get('categories/' + searchId)
      this.cateList = []
      this.cateList = [res.data]
      console.log(this.cateList)
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  font-size: 16px;
}
.treeTable {
  margin-top: 20px;
}
.el-cascader {
  width: 100%;
}
</style>
