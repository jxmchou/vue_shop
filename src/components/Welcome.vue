<template>
  <el-container class="home-container">
    <div class="box">
      <span>欢迎</span>
      <span>来到</span>
      <span>网抑云</span>
      <span>后台管理系统</span>
    </div>
  </el-container>
</template>

<script>
export default {
  name: 'Welcome'
}
</script>

<style lang="less" scoped>
.home-container {
  width: 100%;
  height: 100%;

  .box{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 111;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    span{
      background-image: linear-gradient(to right, orange, purple);
      background-clip: text;
      color: transparent;
      font-size: 30px;
      padding: 40px 0;
    }
  }
}
</style>
