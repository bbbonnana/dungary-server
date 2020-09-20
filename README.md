# Dungary后端

## 数据字典设计

* **管理员**

  * 角色

    **`普通管理员`**（增改店铺、食品）和**`超级管理员`**（可删除店铺、食品）

  * 用户名

    6-12位正常字符，可包含_但不开头结尾，不能连用

  * 密码

    6-16位字符

* **用户**

  * 角色

    **`普通用户`**和**`VIP用户`**（享满减）

  * 用户名密码同上

  * 昵称

    6-16位正常字符

* **店铺**

  * 店铺名

    无特殊符号 1-14位字符

  * 店铺地址

    腾讯位置服务
    
  * 店铺头像

    不大于5MB，支持jpg、jpeg、png

  * 营业时间

    通过时间控件控制

  * 店铺分类

    可在总分类中选择多个分类

  * 店铺描述

  * 店铺评价（见评价Model）

* **食品**

  * 食品名
  * 所属店铺
  * 规格
  * 待定

* **订单**

* **营销策略**

* **评价**

## 接口响应设计

```js
{
  message: '操作成功',
  data: [{}],
  success: true
}
{
  message: '没有用户权限',
  success: false,
  code: 'F300'
  data: [{}]
}
```

> code字段
>
> F开头表示失败状态

```json
{
  "F000": "未知应用错误",
  "F100": "数据格式有误",
  "F200": "不满足业务逻辑要求（如：已存在该用户）"
  "F300": "权限校验需要验证",
  "F301": "权限校验不通过",
  "F400": "数据库错误"
}
```

