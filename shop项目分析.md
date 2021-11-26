# vue_stop

## 下载相关依赖
```
npm install
```

### 为开发编译和热重载
```
npm run serve
```

### 为生产编译和缩小

```
npm run build
```

### 自定义配置

See [对应官网](https://cli.vuejs.org/zh/guide/).

## 登录功能实现

> **git status**		查看当前终端是否干净
> git checkout -b login		创建login登录分支
> **git branch**		查看所有分支
> 
> 如果报错则是less版本过高，下载更低版本即可
> `npm i less@3.9.0 --save -dev`
> `npm i less-loader@4.1.0 --save -dev`
### 解构赋值

> let { name } = this.data	==> 	let name = this.data.name
> let { data:res } = await this.`$http`.post('login',this.loginForm)	==>	let res = await this.$http.post("login",this.loginForm).data
> 当一个对象中又有对象时，可以用 属性:属性
### router 路由守卫
> 全局前置守卫：初始化时执行、每次路由切换前执行	**router.afterEach((to,from,next)=>{})**
> 全局后置守卫：初始化时执行、每次路由切换后执行	router.afterEach((to,from)=>{})
> 独享守卫	beforeEnter(to,from,next){}
```js
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next() 函数，放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
```

> `sessionStorage` 暂时存储
> `setItem()`：存入；`getItem()`：获取；`removeItem()`：删除单个；`clear()`：删除所有

### 登录功能总结

> **git status**：查看终端状态
> **git add .** ：提交所有修改数据
> **git commit -m "完成了登录功能" ** ：提交时，显示的情况
> **git branch** ：查看分支	**git checkout master** ：切换分支	**git merge login** ：合并分支
> **git push** ：推送数据到码云
> 提交新的login分支到码云：git checkout login	git branch	**git push -u origin login**

## 主页Home/用户管理/列表布局和功能

> `letter-spacing`: 0.2em;	**CSS样式**	letterSpacing 属性设置字符之间的空白。
>
> `redirect`: '/home/welcome',		**路由重定向**，当访问home自动跳转welcome页面

### 插槽

> **具名插槽**	**新：**`v-slot`  旧：`slot-scope`
>
> <template v-slot:default="slotProps">
> {{ slotProps.user.firstName }}
> </template>
> 
> <template v-slot="slotProps">
> {{ slotProps.user.firstName }}
> </template>
>
><template v-slot="userList">
><el-switch v-model="userList.row.mg_state"></el-switch>
></template>
>
> 注意默认插槽的缩写语法不能和**具名插槽**混用，因为它会导致作用域不明确；
>
> **父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。**

### mixin(混入)

1. 功能：可以把多个组件共用的配置提取成一个混入对象

2. 使用方式：

    第一步定义混合：

    ```
    export mixin1 = {
        data(){....},
        methods:{....}
        ....
    }
    ```
    
    第二步使用混入：
    
    ​	导入混入：`import {mixin1} from '路径'`
    ​	全局混入：```Vue.mixin(xxx)```
    ​	局部混入：```mixins:['xxx']	```

### 用户管理总结

>   **git branch** 查看状态	**git checkout -b user** 先创建user分支，在切换
>**git status** 查看文件状态	**git add .** 提交至本地		**git common -m "完成了用户管理功能"**
>**git push -u origin user** 本地分支推送至码云	**git cehckout master git merge user** 合并分支
>   **git pull** 解决报错  **git push** 提交总代码



## Home/角色管理

>   接口文档 	1.5.7. 删除角色指定权限
>
>   删除细节：`role.children = res.data` 解决删除页面重新渲染问题 返回的data, 是当前角色下最新的权限数据

## 项目优化及总结处理

>   接口文档地址：https://gitee.com/mchou/shop_api
