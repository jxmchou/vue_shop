<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加数据/查询模块 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- tab表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column
          type="index"
          align="center"
          label="#"
        ></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          align="center"
          width="105px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          prop="add_time"
          align="center"
          width="160px"
        >
          <template v-slot="item">
            {{ item.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120px">
          <template v-slot="item">
            <!-- 编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              plain
              @click="editById(item.row.goods_id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              round
              @click="removeById(item.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'List',
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodsList: [],
      // 总数据条数
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }

      this.$message.success(res.meta.msg)
      // console.log(res.data.goods)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 监听 pagesize 每页条数 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 监听 pagenum 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 点击删除按钮，询问是否删除
    async removeById(goodsId) {
      try {
        // 弹框询问是否删除
        await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let { data: res } = await this.$http.delete(`goods/${goodsId}`)
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getGoodsList()
      } catch (err) {
        this.$message.info('已经取消了删除 ' + err)
      }
    },
    // 添加商品跳转路由
    goAddGoods() {
      this.$router.push('/goods/add')
    },
    // 编辑商品跳转路由
    async editById(value){
      this.$router.push({path:'/goods/edit',query:{ value}})
      this.$message.info('编辑功能暂时没有')
      // const {data:res} = await this.$http.get(`goods/${value.goods_id}`)
      // console.log(res.data.goods_cat,typeof res.data.goods_cat);
      // const {data:res1} = await this.$http.put(`goods/${value.goods_id}`,{
      //   goods_name:value.goods_name,
      //   goods_price:value.goods_price,
      //   goods_number:value.goods_number,
      //   goods_weight:value.goods_weight
      // })
      // console.log(res1);
    }
  }
}
</script>

<style lang="less" scope></style>
