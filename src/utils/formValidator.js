import { validateMobile, validateEmail, validatePhone } from '@/utils/validate'

export const checkMobile = (rule, value, callback) => {
  if (value) {
    if (!validateMobile(value)) {
      callback(new Error('请输入正确的手机号'))
    } else {
      callback()
    }
  } else {
    if (rule.required) {
      callback(new Error('请输入手机号'))
    } else {
      callback()
    }
  }
}

export const checkEmail = (rule, value, callback) => {
  if (value) {
    if (!validateEmail(value)) {
      callback(new Error('请输入正确的邮箱'))
    } else {
      callback()
    }
  } else {
    if (rule.required) {
      callback(new Error('请输入邮箱'))
    } else {
      callback()
    }
  }
}

export const validatePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (value.length < 6) {
    callback(new Error('密码不能小于6位'))
  } else {
    callback()
  }
}

export const checkPhone = (rule, value, callback) => {
  if (value) {
    if (!validatePhone(value)) {
      callback(new Error('请输入正确的联系电话'))
    } else {
      callback()
    }
  } else {
    if (rule.required) {
      callback(new Error('请输入联系电话'))
    } else {
      callback()
    }
  }
}
