<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- <div v-for="o in 4" :key="o" class="text item">
        {{ '列表内容 ' + o }}
      </div> -->

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column
          type="index"
          label="#"
          align="center"
        ></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column align="center" label="状态">
          <template v-slot="userList">
            <el-switch
              v-model="userList.row.mg_state"
              @change="userStateChange(userList.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              round
              @click="showEditDialog(scope.row)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                plain
                @click="setRoles(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加用户对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <!-- 内容主题区域 -->
        <el-form
          :model="addFrom"
          :rules="addFromRules"
          ref="addFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addFrom.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addFrom.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addFrom.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addFrom.mobile"></el-input>
          </el-form-item>
        </el-form>

        <!-- 底部按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户对话框 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <el-form
          ref="addFormRef"
          :model="editForm"
          :rules="addFromRules"
          label-width="80px"
        >
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配角色对话框 -->
      <el-dialog
        title="提示"
        :visible.sync="setRolesDialogVisible"
        width="50%"
        @close="setDialogClosed"
      >
        <div>
          <p>当前的用户名称：{{ userInfo.username }}</p>
          <p>当前的角色名称：{{ userInfo.role_name }}</p>
          <p>
            分配的新角色名称：
            <el-select v-model="selectedRoleId" placeholder="请选择">
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRolesDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="savaRolesInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { mixin1 } from '../../common/mixin'
export default {
  name: 'Users',
  data() {
    // 自定义验证邮箱规则 自定义验证手机号规则 mixins 混入
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '', // 查询参数
        pagenum: 1, // 当前页码
        pagesize: 5 // 每页显示条数
      },
      userList: [], // 用户数据
      total: 0, // 用户数量
      addDialogVisible: false, // 控制添加用户对话框的显示/隐藏
      editDialogVisible: false, // 控制修改用户对话框的显示/隐藏
      setRolesDialogVisible: false, // 控制分配权限对话框的显示/隐藏
      editForm: {}, // 通过id返回的用户数据
      // 添加用户表单数据
      addFrom: {
        username: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 添加表单验证规则 mixins混入
      userInfo: {}, // 当前需要分配角色的用户信息
      rolesList: [], // 所有角色的数据列表
      selectedRoleId: '' // 已选中的角色id值
    }
  },
  mixins: [mixin1],
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户数据函数
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('数据获取失败')
      } else {
        this.userList = res.data.users
        this.total = res.data.total
        // console.log(this.userList);
      }
    },
    // 监听 pagesize 每页条数 改变的事件
    handleSizeChange(newSize) {
      // console.log(`每页 ${newSize} 条`);
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 pagenum 页码值 改变的事件
    handleCurrentChange(newPage) {
      // console.log(`当前页: ${newPage}`)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听 Switch 开关状态改变
    async userStateChange(userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200 && res.data.mg_state) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    // 监听添加/修改用户对话框的关闭事件
    addDialogClosed() {
      // resetFields() 表单重置属性
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新用户并校验/修改时也适用
    addUser() {
      // validate(()=>{}) 所有表单校验属性
      this.$refs.addFormRef.validate(async (value) => {
        if (!value) return
        // 成功并发送请求
        let { data: res } = await this.$http.post('users', this.addFrom)
        // console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        // 隐藏对话框
        this.addDialogVisible = false
        // 重新获取用户数据
        this.getUserList()
      })
    },
    // 点击修改按钮弹出对话框
    showEditDialog(item) {
      this.editDialogVisible = true
      // 发送请求方法：通过传值id来获取
      /*  let { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg) */
      // 直接获取页面的数据
      if (!item) return this.$message.error('获取用户数据失败')
      this.editForm = item
      this.$message.success('获取用户数据成功，数据已渲染')
      // console.log(item);
    },
    // 点击确定按钮验证修改的数据是否合格
    editUser() {
      this.$refs.addFormRef.validate(async (value) => {
        if (!value) return
        let { id, mobile, email } = this.editForm
        let { data: res } = await this.$http.put('users/' + id, {
          email,
          mobile
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success(res.meta.msg)
      })
    },
    // 根据id删除对应的用户数据
    async removeUserById(id) {
      try {
        // 弹框询问是否删除
        await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getUserList()
      } catch (err) {
        this.$message.info('已经取消了删除')
      }
    },
    // 展示分配角色对话框
    async setRoles(userInfo) {
      this.userInfo = userInfo
      let { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rolesList = res.data
      this.$message.success(res.meta.msg)
      this.setRolesDialogVisible = true
    },
    // 点击按钮，分配角色
    async savaRolesInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色')
      }
      let { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        { rid: this.selectedRoleId }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.getUserList()
      this.setRolesDialogVisible = false
      this.$message.success(res.meta.msg)
    },
    // 监听分配角色对话框关闭事件
    setDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = ''
    }
  }
}
</script>

<style lang="less" scoped>
  p {
    font-weight: bold;
    font-size: 20px;
  }
</style>
