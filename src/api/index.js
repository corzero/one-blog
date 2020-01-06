import axios from '@/utils/request'
const user = {
  register: data => axios.post('/register', data),
  login: data => axios.post('/login', data),
  logout: data => axios.post('logout'),
  getInfo: () => axios.get('/user'),
  getDetail: id => axios.get(`/userDetail/${id}`),
  updateInfo: data => axios.put('/user', data)
}
const dashboard = {
  artcleVisit: () => axios.get('/articleVisit'),
  articleFrequency: () => axios.get('/articleFrequency'),
  websitVisit: () => axios.get('/websitVisit'),
  articleTotal: () => axios.get('/articleTotal'),
  articleType: () => axios.get('/articleType')
}
const article = {
  getList: query => axios.get(`/article${query}`),
  getOne: id => axios.get(`/article/${id}`),
  create: data => axios.post(`/article`, data),
  update: data => axios.put('/article', data),
  delete: ids => axios.delete('/article', { data: { ids: ids }}),
  recover: ids => axios.post('/recover', ids)
}
const music = {
  getRandomAlbum: () => axios.get('/randomAlbum'),
  getRandomSong: () => axios.get('/randomSong'),
  getSingerList: () => axios.get('/singerList'),
  getAlbumList: sid => axios.get(`/albumList/${sid}`),
  getSongList: aid => axios.get(`/songList/${aid}`),
  getOneSinger: sid => axios.get(`/singer/${sid}`),
  getOneAlbum: aid => axios.get(`/album/${aid}`),
  deleteSinger: ids => axios.delete('/singer', { data: { ids: ids }}),
  deleteAlbum: ids => axios.delete('/album', { data: { ids: ids }}),
  deleteSong: ids => axios.delete('/song', { data: { ids: ids }})
}
const category = {
  getWithTag: () => axios.get('/categoryTag'),
  getList: () => axios.get('/category'),
  create: data => axios.post('/category', data),
  update: data => axios.put('/category', data),
  delete: ids => axios.delete('/category', { data: { ids: ids }})
}
const tag = {
  getList: cid => axios.get(`/tag/${cid}`),
  create: data => axios.post('/tag', data),
  update: data => axios.put('/tag', data),
  delete: ids => axios.delete('/tag', { data: { ids: ids }})
}
const upload = {
  img: data =>
    axios.post('/upload/img', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  avatar: data =>
    axios.post('/upload/avatar', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  audio: data =>
    axios.post('/upload/audio', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  video: data =>
    axios.post('/upload/video', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  base: data =>
    axios.post('/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
}
const script = {
  getList: () => axios.get('/script'),
  create: data => axios.post('/script', data),
  update: data => axios.put('/script', data),
  delete: ids => axios.delete('/script', { data: { ids: ids }}),
  status: (ids, status) => axios.put('/scriptStatus', { ids, status })
}
const storage = {
  upload: (data, option) => axios.post('/storage', data, option),
  merge: data => axios.post('/merge', data),
  getList: data => axios.post('/storageList', data),
  queryFolder: id => axios.get(`/queryFolder/${id}`),
  createFolder: data => axios.post('/createFolder', data),
  rename: data => axios.put('/storageRename', data),
  setTrash: (ids, type) => axios.put('/storage', { ids, type }),
  delete: (ids, type) =>
    axios.delete('/deleteStorage', { data: { ids, type }}),
  download: ids => axios.post('/downloadStorage', { ids })
}
export {
  user,
  dashboard,
  article,
  music,
  category,
  tag,
  upload,
  script,
  storage
}
