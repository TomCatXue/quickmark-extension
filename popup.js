const grid = document.getElementById('grid')
const search = document.getElementById('search')
const empty = document.getElementById('empty')
const columns = document.getElementById('columns')

let bookmarks = []
let usage = {}

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

chrome.bookmarks.getTree(tree => {
  flatten(tree)
  document.getElementById('total-count').textContent = `共 ${bookmarks.length} 个`
  bookmarks = sortBookmarks(bookmarks)
  render(bookmarks)
})

let searchTimer = null
search.addEventListener('input', e => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    const keyword = e.target.value.toLowerCase()
    const filtered = bookmarks.filter(item => {
      return (
        item.title.toLowerCase().includes(keyword) ||
        item.url.toLowerCase().includes(keyword)
      )
    })
    render(sortBookmarks(filtered))
  }, 120)
})