<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表数据 -->
      <el-table :data="orderList" border stripe>
        <el-table-column
          type="index"
          label="#"
          align="center"
        ></el-table-column>
        <el-table-column
          label="订单编号"
          prop="order_number"
          width="300px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
          align="center"
        ></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" align="center">
          <template v-slot="item">
            <el-tag type="success" v-if="item.row.pay_status === 1"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否发货"
          prop="is_send"
          align="center"
        ></el-table-column>
        <el-table-column label="下单时间" prop="create_time" align="center">
          <template v-slot="item">
            {{ item.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="item">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              plain
              @click="showEdit(item.row)"
            >
            </el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              round
              @click="showProgressBox"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 展示物流进度的对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      width="50%"
    >
      <!-- Timeline 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>
  </div>
</template>

<script>
import { orderMixin } from '../../common/mixin'
import cityData from './citydata'
export default {
  name: 'Order',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      addressVisible: false, // 显示/隐藏修改地址对话框
      progressVisible: false, // 显示/隐藏物流进度对话框
      // addressForm
      // addressRules
      cityData,
      progressInfo: [] // 物流进度数据
    }
  },
  mixins: [orderMixin],
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取订单数据接口回调
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表数据失败')
      }
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    // 监听 pagesize 每页条数 改变的事件
    handleSizeChange(newSize) {
      // console.log(`每页 ${newSize} 条`);
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 监听 pagenum 页码值 改变的事件
    handleCurrentChange(newPage) {
      // console.log(`当前页: ${newPage}`)
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 修改地址对话框回调
    showEdit(value) {
      this.addressVisible = true
      console.log(value)
    },
    // 修改对话框关闭回调
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    // 物流进度回调
    async showProgressBox() {
      // console.log(this.result.data);
      this.progressInfo = this.result.data
      this.progressVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
