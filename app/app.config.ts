export default defineAppConfig({
  seo: {
    title: 'Bcamy 的知识库',
    description: '算法、数据结构与文化社科的深度沉淀',
  },

  header: {
    title: 'Bcamy 的知识库',
    logo: false,
    showLinkIcon: true
  },

  socials: {
    github: 'linmoh',
    x: 'BcamyLin',
    codeforces: 'https://codeforces.com/profile/LINMOHAN',
    bilibili: 'https://space.bilibili.com/2126856300',
    zhihu: 'https://www.zhihu.com/people/lin-56-61-20'
  },

  github: {
    branch: 'main',
    url: 'https://github.com/linmoh/notes',
    rootDir: 'content',
    edit: true
  },

  css: [
    'katex/dist/katex.min.css'
  ]
})