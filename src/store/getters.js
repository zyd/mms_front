const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  lastLoginTime: state => state.user.lastLoginTime,
  lastLoginIp: state => state.user.lastLoginIp,
  mobile: state => state.user.mobile,
  tenantName: state => state.user.tenantName,
  email: state => state.user.email,
  userType: state => state.user.userType
}
export default getters
