import defaultConfig from '@/config'

const title = defaultConfig.title || 'Ops~'

const getPageTitle = pageTitle => {
  if (pageTitle) {
    return `${title} - ${pageTitle}`
  }
  return `${title}`
}
export { getPageTitle }
