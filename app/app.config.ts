export default defineAppConfig({
  // 1. 全局 SEO 配置（浏览器标签页后缀）
  seo: {
    title: 'Bcamy 的知识库', // 默认标题
    description: '算法、数据结构与文化社科的深度沉淀',
  },

  // 2. 顶部导航栏配置（左上角名字）
  header: {
    title: 'Bcamy 的知识库', // 网页左上角显示的文字
    logo: false,             // 如果没有 SVG logo，设为 false 直接显示文字
    showLinkIcon: true
  },

  // 3. 社交链接（显示在页脚或 Header）
  socials: {
    github: 'linmoh', // 填入你的 GitHub 账号
    x: 'BcamyLin',
    codeforces: 'https://codeforces.com/profile/LINMOHAN',
    bilibili: 'https://space.bilibili.com/2126856300',
    zhihu: 'https://www.zhihu.com/people/lin-56-61-20'
  },

  // 4. Github 联动（开启“编辑此页”功能）
  github: {
    branch: 'main',
    url: 'https://github.com/linmoh/notes',
    rootDir: 'content',
    edit: true
  }
})