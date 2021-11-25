<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格数据区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="rolesList">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in rolesList.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5" class="center">
                <el-tag
                  closable
                  @close="removeRolesById(rolesList.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环渲染二级嵌套 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRolesById(rolesList.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRolesById(rolesList.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column
          type="index"
          label="#"
          align="center"
        ></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="角色操作" align="center">
          <template v-slot="rolesList">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(rolesList.row)"
              >编辑</el-button
            >
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              round
              @click="removeUserById(rolesList.row.id)"
              >删除</el-button
            >
            <!-- 分配权限按钮 -->

            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              plain
              @click="showSetRolesDialog(rolesList.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加角色对话框 -->
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
          label-width="80px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addFrom.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addFrom.roleDesc"></el-input>
          </el-form-item>
        </el-form>

        <!-- 底部按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
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
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRoles">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配权限的对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRolesDialogVisible"
        width="50%"
        @close="setRolesDialogCloesd"
      >
        <!-- 树形控件 -->
        <el-tree
          :props="treeProps"
          :data="rightsList"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defKeys"
          ref="treeRef"
        >
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRolesDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRoles"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { mixin1 } from '../../common/mixin'
export default {
  name: 'Roles',
  data() {
    return {
      rolesList: [], // 所有角色的数据列表
      addDialogVisible: false, // 控制添加用户对话框的显示/隐藏
      editDialogVisible: false, // 控制修改用户对话框的显示/隐藏
      setRolesDialogVisible: false, // 控制分配权限对话框的显示/隐藏
      // 添加用户表单数据
      addFrom: {
        roleName: '',
        roleDesc: ''
      },
      editForm: {}, // 通过id返回的用户数据
      rightsList: [], // 所有权限的数据
      treeProps: {
        // 树形控件的绑定对象
        label: 'authName',
        children: 'children'
      }
      ,defKeys:[] // 默认选中的数据
      ,roleId:'' // 当前即将分配权限的id
    }
  },
  mixins: [mixin1],
  created() {
    // 调用获取角色函数
    this.getRolesList()
  },
  methods: {
    // 获取角色函数回调
    async getRolesList() {
      let { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rolesList = res.data
      // console.log(this.rolesList[0].children);
    },
    // 监听添加/修改用户对话框的关闭事件
    addDialogClosed() {
      // resetFields() 表单重置属性
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新用户并校验/修改时也适用
    addRoles() {
      // validate(()=>{}) 所有表单校验属性
      this.$refs.addFormRef.validate(async (value) => {
        if (!value) return
        // 成功并发送请求
        let { data: res } = await this.$http.post('roles', this.addFrom)
        // console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        // this.addFrom = res.data
        this.$message.success(res.meta.msg)
        // 隐藏对话框
        this.addDialogVisible = false
        // 重新获取用户数据
        this.getRolesList()
      })
    },
    // 点击修改按钮弹出对话框
    showEditDialog(item) {
      this.editDialogVisible = true
      // 直接获取页面的数据
      if (!item) return this.$message.error('获取用户数据失败')
      this.editForm = item
      this.$message.success('获取用户数据成功，数据已渲染')
    },
    // 点击确定按钮验证修改的数据是否合格
    editRoles() {
      this.$refs.addFormRef.validate(async (value) => {
        if (!value) return
        let { id, roleName, roleDesc } = this.editForm
        let { data: res } = await this.$http.put('roles/' + id, {
          roleName,
          roleDesc
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.editDialogVisible = false
        this.getRolesList()
        this.$message.success(res.meta.msg)
      })
    },
    // 点击删除按钮，删除数据
    async removeUserById(id) {
      try {
        // 弹框询问是否删除
        await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let { data: res } = await this.$http.delete('roles/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getRolesList()
      } catch (err) {
        this.$message.info('已经取消了删除 ' + err)
      }
    },
    // 根据id删除对应的权限
    async removeRolesById(role, rightId) {
      try {
        // 弹框询问是否删除
        await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let { data: res } = await this.$http.delete(
          `roles/${role.id}/rights/${rightId}`
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        // role 形参代表的是当前等级权限的整个数据
        role.children = res.data
      } catch (err) {
        this.$message.info('已经取消了删除 ' + err)
      }
    },
    // 展示分配权限对话框
    async showSetRolesDialog(roles) {
      this.roleId = roles.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rightsList = res.data
      // 递归获取三级节点的id roles 代表第一个父级节点数据
      this.getLeafKeys(roles,this.defKeys)
      this.setRolesDialogVisible = true
      this.$message.success(res.meta.msg)
    },
    // 通过递归，获取角色下三级权限的id，并保存在 defKeys 数组中
    getLeafKeys(node,arr){
      // 如果当前node 节点不包含 children 属性，则是三级节点
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item=>{
        this.getLeafKeys(item,arr)
      })
    },
    // 监听分配权限的关闭事件
    setRolesDialogCloesd(){
      this.defKeys = []
    },
    // 点击确定为角色分配权限
    async allotRoles(roleId){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      let {data:res}= await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getRolesList()
      this.setRolesDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
.center {
  text-align: center;
}
</style>
