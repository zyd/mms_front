/**
 * 时间戳+最多5位随机数
 */
export function generateUid() {
  const timestamp = new Date().getTime()
  let random = ''
  if (window.crypto) { // 非IE下使用密码级别的随机数
    random = window.crypto.getRandomValues(new Uint16Array(1))[0]
  } else { // IE下使用普通random
    random = Math.floor(Math.random() * 100000)
  }
  return timestamp + '' + random
}
