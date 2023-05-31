import './app2.css'
import $ from 'jquery'

const localKey = 'app2.index'
const eventBus = $(window)

// 数据相关都放到 m
const m = {
  data: {
    // 初始化数据
    index: parseInt(localStorage.getItem(localKey)) || 0
  },
  create() { },
  delete() { },
  update(data) {
    Object.assign(m.data, data)
    eventBus.trigger('m:updated')
    localStorage.setItem(localKey, m.data.index)
  },
  get() { }
}

// 试图相关都放到 v
const v = {
  el: null,
  html: (index) => {
    return `
    <div>
      <ol class="tab-bar">
        <li class="${index === 0 ? 'selected' : ''}" data-index="0"><span>title1</span></li>
        <li class="${index === 1 ? 'selected' : ''}" data-index="1"><span>title2</span></li>
      </ol>
      <ol class="tab-content">
        <li class="${index === 0 ? 'active' : ''}">content1</li>
        <li class="${index === 1 ? 'active' : ''}">content2</li>
      </ol>
    </div>
  `},
  init(el) {
    v.el = $(el)
  },
  render(index) {
    if (v.el.children.length !== 0) v.el.empty()
    $(v.html(index)).appendTo(v.el)
  }
}

// 其他都放到 c
const c = {
  init(el) {
    v.init(el)
    v.render(m.data.index)
    c.autoBindEvents()
    eventBus.on('m:updated', () => {
      v.render(m.data.index)
    })
  },
  events: {
    'click .tab-bar li': 'change'
  },
  change(e) {
    const index = parseInt(e.currentTarget.dataset.index)
    m.update({ index: index })
  },
  autoBindEvents() {
    for (let key in c.events) {
      const spaceIndex = key.indexOf(' ')
      v.el.on(key.slice(0, spaceIndex), key.slice(spaceIndex + 1), c[c.events[key]])
    }
  }
}

export default c