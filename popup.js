const grid = document.getElementById('grid')
const search = document.getElementById('search')
const tabs = document.getElementById('tabs')
const empty = document.getElementById('empty')
const columns = document.getElementById('columns')

let bookmarks = []
let usage = {}
let currentTab = 'all'
let currentKeyword = ''

/* ========== 分类定义 ========== */

const CATEGORIES = [
  {
    id: 'social',
    label: '社交',
    icon: '💬',
    keywords: [
      'weibo', 'zhihu', 'douban', 'tieba', 'xiaohongshu', 'rednote',
      'twitter', 'x.com', 'facebook', 'instagram', 'reddit', 'tiktok',
      'linkedin', 'telegram', 'discord', 'whatsapp', 'pinterest',
      'bbs', 'forum', '社区', '论坛', '贴吧', '知乎', '豆瓣', '微博'
    ]
  },
  {
    id: 'video',
    label: '视频',
    icon: '🎬',
    keywords: [
      'youtube', 'bilibili', 'bili', 'netflix', 'twitch', 'iqiyi',
      'youku', 'tencent video', 'v.qq', 'mgtv', 'sohu video',
      'dailymotion', 'vimeo', 'niconico', 'acfun',
      '视频', '直播', '影视', '动漫'
    ]
  },
  {
    id: 'dev',
    label: '开发',
    icon: '💻',
    keywords: [
      'github', 'gitlab', 'bitbucket', 'stackoverflow', 'stackexchange',
      'npmjs', 'npm', 'docker', 'kubernetes', 'developer',
      'leetcode', 'codesandbox', 'codepen', 'jsfiddle',
      'python', 'javascript', 'typescript', 'node', 'react',
      'vue', 'angular', 'api', 'dev.to', 'medium',
      'git', 'linux', 'ubuntu', 'terminal', 'bash',
      'json', 'yaml', 'markdown', 'vscode', 'visual studio',
      'android studio', 'xcode', 'intellij', 'pycharm',
      'github.com', 'gitee', 'coding.net', '阿里云', '腾讯云',
      '开发', '编程', '代码', '程序', '部署', '云'
    ]
  },
  {
    id: 'shopping',
    label: '购物',
    icon: '🛒',
    keywords: [
      'taobao', 'tmall', 'jd.com', 'jingdong', 'pinduoduo',
      'amazon', 'ebay', 'aliexpress', 'shopee', 'lazada',
      'suning', 'dangdang', 'vipshop', 'meituan',
      '淘宝', '天猫', '京东', '拼多多', '苏宁', '当当',
      '购物', '商城', '买', '团购', '优惠', '折扣'
    ]
  },
  {
    id: 'news',
    label: '资讯',
    icon: '📰',
    keywords: [
      'news', 'cnn', 'bbc', 'reuters', 'bloomberg', 'nytimes',
      'theguardian', 'wsj', 'hacker news', 'techcrunch',
      'theverge', '36kr', 'huxiu', 'ifanr', 'geekpark',
      'solidot', 'ithome', 'cnbeta', '驱动之家',
      '新浪', '搜狐', '网易', '腾讯新闻', '凤凰网',
      '新闻', '资讯', '日报', '头条', '快报', '晚报',
      'blog', '博客', '周刊'
    ]
  },
  {
    id: 'ai',
    label: 'AI',
    icon: '🤖',
    keywords: [
      'chatgpt', 'openai', 'claude', 'gemini', 'copilot',
      'perplexity', 'huggingface', 'gradio', 'anthropic',
      'midjourney', 'stable diffusion', 'dall-e',
      'langchain', 'llama', 'mistral', 'deepseek',
      'kimi', 'doubao', '豆包', '文心一言', '通义千问',
      '智谱', 'minimax', '月之暗面',
      'artificial intelligence', 'machine learning',
      'ai', 'gpt', 'llm', '大模型', '人工智能', '机器学习'
    ]
  },
  {
    id: 'tool',
    label: '工具',
    icon: '🔧',
    keywords: [
      'notion', 'feishu', '飞书', 'yuque', '语雀',
      'google', 'drive', 'docs', 'slides', 'sheets',
      'office', 'word', 'excel', 'powerpoint', 'onenote',
      'evernote', 'obsidian', 'roam', 'logseq',
      'trello', 'jira', 'asana', 'notion',
      'slack', 'zoom', 'meet', 'teams', '钉钉',
      'figma', 'canva', 'sketch', 'adobe', 'photoshop',
      'dropbox', 'onedrive', 'icloud', '百度网盘',
      '腾讯文档', '金山文档', '石墨文档',
      '密码', 'manager', 'authenticator',
      '翻译', 'translate', '词典', 'dict',
      '工具', '在线', '转换', '计算', '生成'
    ]
  }
]

/* ========== 分类函数 ========== */

function classifyBookmark(item) {
  const text = (item.title + ' ' + item.url).toLowerCase()
  for (const cat of CATEGORIES) {
    for (const kw of cat.keywords) {
      if (text.includes(kw.toLowerCase())) return cat.id
    }
  }
  return 'other'
}

function classifyAll() {
  const groups = { all: bookmarks }
  for (const cat of CATEGORIES) {
    groups[cat.id] = []
  }
  groups.other = []

  bookmarks.forEach(b => {
    const catId = classifyBookmark(b)
    if (groups[catId]) {
      groups[catId].push(b)
    } else {
      groups.other.push(b)
    }
  })

  return groups
}

/* ========== 域名渐变配色 ========== */

const GRADIENTS = [
  'linear-gradient(135deg, #f97316, #ef4444)',
  'linear-gradient(135deg, #8b5cf6, #3b82f6)',
  'linear-gradient(135deg, #06b6d4, #10b981)',
  'linear-gradient(135deg, #ec4899, #8b5cf6)',
  'linear-gradient(135deg, #f59e0b, #f97316)',
  'linear-gradient(135deg, #14b8a6, #06b6d4)',
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #d946ef, #ec4899)',
  'linear-gradient(135deg, #0ea5e9, #06b6d4)',
  'linear-gradient(135deg, #84cc16, #10b981)',
  'linear-gradient(135deg, #f43f5e, #d946ef)',
  'linear-gradient(135deg, #eab308, #f59e0b)',
  'linear-gradient(135deg, #a855f7, #6366f1)',
  'linear-gradient(135deg, #22c55e, #14b8a6)',
  'linear-gradient(135deg, #f97316, #eab308)',
  'linear-gradient(135deg, #3b82f6, #0ea5e9)',
]

function getDomainGradient(domain) {
  let hash = 0
  for (let i = 0; i < domain.length; i++) {
    hash = domain.charCodeAt(i) + ((hash << 5) - hash)
  }
  const idx = Math.abs(hash) % GRADIENTS.length
  return GRADIENTS[idx]
}

/* ========== 存储 & 列切换 ========== */

chrome.storage.local.get(['usage', 'columns'], (data) => {
  usage = data.usage || {}
  const saved = data.columns || '2'
  columns.value = saved
  updateColumns(saved)
})

function updateColumns(count) {
  grid.style.gridTemplateColumns = `repeat(${count},minmax(0,1fr))`
}

columns.addEventListener('change', () => {
  const value = columns.value
  updateColumns(value)
  chrome.storage.local.set({ columns: value })
})

/* ========== 书签数据 ========== */

function flatten(nodes) {
  nodes.forEach(node => {
    if (node.url) bookmarks.push(node)
    if (node.children) flatten(node.children)
  })
}

function sortBookmarks(list) {
  return [...list].sort((a, b) => {
    return (usage[b.url] || 0) - (usage[a.url] || 0)
  })
}

function getFiltered() {
  let list
  if (currentTab === 'all') {
    list = bookmarks
  } else {
    list = groups[currentTab] || []
  }

  if (currentKeyword) {
    list = list.filter(item =>
      item.title.toLowerCase().includes(currentKeyword) ||
      item.url.toLowerCase().includes(currentKeyword)
    )
  }

  return sortBookmarks(list)
}

let groups = {}

chrome.bookmarks.getTree(tree => {
  flatten(tree)
  bookmarks = sortBookmarks(bookmarks)
  groups = classifyAll()
  document.getElementById('total-count').textContent = `共 ${bookmarks.length} 个`
  renderTabs()
  render(getFiltered())
})

/* ========== 标签渲染 ========== */

function renderTabs() {
  tabs.innerHTML = ''

  // 全部
  tabs.appendChild(createTabBtn('全部', '⭐', bookmarks.length, 'all'))

  // 分类标签
  for (const cat of CATEGORIES) {
    const count = (groups[cat.id] || []).length
    if (count > 0) {
      tabs.appendChild(createTabBtn(cat.label, cat.icon, count, cat.id))
    }
  }

  // 其他
  const otherCount = (groups.other || []).length
  if (otherCount > 0) {
    tabs.appendChild(createTabBtn('其他', '📂', otherCount, 'other'))
  }
}

function createTabBtn(label, icon, count, id) {
  const btn = document.createElement('button')
  btn.className = 'tab-btn' + (id === currentTab ? ' active' : '')
  btn.dataset.id = id
  btn.textContent = `${icon} ${label}`
  const badge = document.createElement('span')
  badge.className = 'tab-count'
  badge.textContent = count
  btn.appendChild(badge)
  btn.addEventListener('click', () => switchTab(id))
  return btn
}

function switchTab(id) {
  currentTab = id
  document.querySelectorAll('.tab-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.id === id)
  )
  render(getFiltered())
}

/* ========== 标签栏滚轮滑动 ========== */

tabs.addEventListener('wheel', (e) => {
  e.preventDefault()
  tabs.scrollBy({
    left: e.deltaY > 0 ? 60 : -60,
    behavior: 'smooth'
  })
}, { passive: false })

/* ========== 渲染卡片 ========== */

function render(list) {
  if (list.length === 0) {
    grid.innerHTML = ''
    empty.style.display = 'block'
    return
  }

  empty.style.display = 'none'

  const fragment = document.createDocumentFragment()

  list.forEach(item => {
    const domain = new URL(item.url).hostname
    const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`

    const card = document.createElement('div')
    card.className = 'card'

    const img = document.createElement('img')
    img.className = 'icon'
    img.src = favicon
    img.loading = 'lazy'

    // 图标加载失败 → 精美默认图标
    img.addEventListener('error', function onError() {
      img.removeEventListener('error', onError)
      img.style.display = 'none'

      const fallback = document.createElement('span')
      fallback.className = 'default-icon'
      fallback.style.background = getDomainGradient(domain)

      const letter = document.createElement('span')
      letter.className = 'di-letter'
      letter.textContent = domain.charAt(0).toUpperCase()
      fallback.appendChild(letter)

      // 如果域名以数字开头，改用 🔗
      if (/^\d/.test(domain.charAt(0))) {
        letter.textContent = '🔗'
        letter.style.fontSize = '16px'
      }

      img.parentNode.insertBefore(fallback, img.nextSibling)
    })

    const info = document.createElement('div')
    info.className = 'info'

    const name = document.createElement('div')
    name.className = 'name'
    name.textContent = item.title

    const domainEl = document.createElement('div')
    domainEl.className = 'domain'
    domainEl.textContent = domain

    info.appendChild(name)
    info.appendChild(domainEl)
    card.appendChild(img)
    card.appendChild(info)

    card.addEventListener('click', () => {
      usage[item.url] = (usage[item.url] || 0) + 1
      chrome.storage.local.set({ usage })
      chrome.tabs.create({ url: item.url })
    })

    fragment.appendChild(card)
  })

  grid.innerHTML = ''
  grid.appendChild(fragment)
}

/* ========== 搜索 ========== */

let searchTimer = null
search.addEventListener('input', e => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    currentKeyword = e.target.value.toLowerCase()
    render(getFiltered())
  }, 120)
})