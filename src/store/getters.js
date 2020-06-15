const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  corpId: state => state.user.corpId,
  corpName: state => state.user.corpName,
  userId: state => state.user.userId
}

export default getters
