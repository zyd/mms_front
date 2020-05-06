import request from '@/utils/request'

export function save(data) {
  return request({
    url: '/drugPrice/save',
    method: 'post',
    data
  })
}
export function updatePrice(data) {
  return request({
    url: '/drugPrice/updatePrice',
    method: 'put',
    data
  })
}
export function getList(params) {
  return request({
    url: '/drugPrice/list',
    method: 'get',
    params
  })
}
export function getSelectList(params) {
  return request({
    url: '/drugPrice/selectList',
    method: 'get',
    params
  })
}
export function del(id) {
  return request({
    url: '/drugPrice/delete',
    method: 'delete',
    params: { id }
  })
}
