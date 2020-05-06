import request from '@/utils/request'

export function save(data) {
  return request({
    url: '/outstore/save',
    method: 'post',
    data
  })
}
export function getList(params) {
  return request({
    url: '/outstore/list',
    method: 'get',
    params
  })
}
export function getOutstore(id) {
  return request({
    url: '/outstore/' + id,
    method: 'get'
  })
}
export function del(id) {
  return request({
    url: '/outstore/delete',
    method: 'delete',
    params: { id }
  })
}
export function exportExcel(id) {
  return request({
    url: 'outstore/exportExcel',
    method: 'get',
    responseType: 'blob', // 二进制流
    params: { id }
  })
}
