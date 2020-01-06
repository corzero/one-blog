const getters = {
  // app
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  logoTitle: state => state.app.logoTitle,
  // user
  token: state => state.user.token,
  user: state => state.user,
  baseFolder: state => state.user.baseFolder,
  // music
  musicItem: state => state.music.current,
  musicList: state => state.music.list
}
export default getters
