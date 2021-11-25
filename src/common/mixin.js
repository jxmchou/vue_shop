export const mixin1 = {
  data() {
    // 自定义验证邮箱规则
    var checkEmail = (rule, value, cb) => {
      let regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb() // 合法邮箱
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 自定义验证手机号规则
    var checkMobile = (rule, value, cb) => {
      let regMobile =
        /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
      if (regMobile.test(value)) {
        return cb() // 合法手机号
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 添加表单验证规则
      addFromRules: {
        username: [
          // 用户名
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          // 密码
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          // 邮箱
          { required: true, message: '请输入邮箱账号', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
          // {type:'email', message: '长度在 6 到 15 个字符',  trigger: ['blur', 'change']}
        ],
        mobile: [
          // 手机号
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
          // { min: 11, max: 11, message: '长度在 11 个字符', trigger: 'blur' }
        ],
        role_name: [
          { required: true, message: '请输入要修改的职位', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        roleName: [
          // 角色名称
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          // 角色描述
          { required: true, message: '请输入角色的描述', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {}
}

export const cate = {
  data() {
    return {
      addFromRules: {
        cat_name: [
          // 分类名称描述
          { required: true, message: '请输入分类的名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 为 tree-table 指定列的定义
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        {
          label: '是否有效',
          type: 'template', // 将当前列定义为模板列
          template: 'isok', // 当前这一列使用的模板名称
          align: 'center',
          headerAlign: 'center'
        },
        {
          label: '排序',
          type: 'template', // 将当前列定义为模板列
          template: 'order', // 当前这一列使用的模板名称
          align: 'center',
          headerAlign: 'center'
        },
        {
          label: '操作',
          type: 'template', // 将当前列定义为模板列
          template: 'opt', // 当前这一列使用的模板名称
          align: 'center',
          headerAlign: 'center'
        }
      ]
    }
  }
}

export const orderMixin = {
  data() {
    return {
      addressForm: {
        address1: [],
        address2: ''
      },
      addressRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      result: {
        data: [
          {
            time: '2018-05-10 09:39:00',
            ftime: '2018-05-10 09:39:00',
            context: '已签收,感谢使用顺丰,期待再次为您服务',
            location: ''
          },
          {
            time: '2018-05-10 08:23:00',
            ftime: '2018-05-10 08:23:00',
            context:
              '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
            location: ''
          },
          {
            time: '2018-05-10 07:32:00',
            ftime: '2018-05-10 07:32:00',
            context: '快件到达 [北京海淀育新小区营业点]',
            location: ''
          },
          {
            time: '2018-05-10 02:03:00',
            ftime: '2018-05-10 02:03:00',
            context:
              '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
            location: ''
          },
          {
            time: '2018-05-09 23:05:00',
            ftime: '2018-05-09 23:05:00',
            context: '快件到达 [北京顺义集散中心]',
            location: ''
          },
          {
            time: '2018-05-09 21:21:00',
            ftime: '2018-05-09 21:21:00',
            context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
            location: ''
          },
          {
            time: '2018-05-09 13:07:00',
            ftime: '2018-05-09 13:07:00',
            context: '顺丰速运 已收取快件',
            location: ''
          },
          {
            time: '2018-05-09 12:25:03',
            ftime: '2018-05-09 12:25:03',
            context: '卖家发货',
            location: ''
          },
          {
            time: '2018-05-09 12:22:24',
            ftime: '2018-05-09 12:22:24',
            context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
            location: ''
          },
          {
            time: '2018-05-08 21:36:04',
            ftime: '2018-05-08 21:36:04',
            context: '商品已经下单',
            location: ''
          }
        ],
        meta: { status: 200, message: '获取物流信息成功！' }
      }
    }
  }
}
