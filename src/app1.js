import './app1.css'
import $ from 'jquery'

const eventBus = $(window)
// 数据相关都放到 m
const m = {
  data: {
    // 初始化数据
    n: parseInt(localStorage.getItem('n'))
  },
  create() { },
  delete() { },
  update(data) {
    Object.assign(m.data, data)
    eventBus.trigger('m:updated')
    localStorage.setItem('n', m.data.n)
  },
  get() { }
}

// 试图相关都放到 v
const v = {
  el: null,
  html: `
    <div>
      <div class="output">
        <span id="number">{{n}}</span>
      </div>
      <div class="actions">
        <button id="add1">+1</button>
        <button id="minus1">-1</button>
        <button id="mul2">*2</button>
        <button id="divide2">÷2</button>
      </div>
    </div>
  `,
  init(el) {
    v.el = $(el)
  },
  render(n) {
    if (v.el.children.length !== 0) v.el.empty()
    $(v.html.replace('{{n}}', n)).appendTo(v.el)
  }
}

// 其他都放到 c
const c = {
  init(el) {
    v.init(el)
    v.render(m.data.n)
    c.autoBindEvents()
    eventBus.on('m:updated', () => {
      v.render(m.data.n)
    })
  },
  events: {
    'click #add1': 'add',
    'click #minus1': 'minus',
    'click #mul2': 'mul',
    'click #divide2': 'divide'
  },
  add() {
    m.update({ n: m.data.n + 1 })
  },
  minus() {
    m.update({ n: m.data.n - 1 })
  },
  mul() {
    m.update({ n: m.data.n * 2 })
  },
  divide() {
    m.update({ n: m.data.n / 2 })
  },
  autoBindEvents() {
    for (let key in c.events) {
      const spaceIndex = key.indexOf(' ')
      v.el.on(key.slice(0, spaceIndex), key.slice(spaceIndex + 1), c[c.events[key]])
    }
  }
}

export default c