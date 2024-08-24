const Print: any = function (this: any, dom: any, options: any) {
  if (!(this instanceof Print)) return new Print(dom, options)

  this.options = this.extend(
    {
      noPrint: '.no-print',
    },
    options
  )

  if (typeof dom === 'string') {
    try {
      this.dom = document.querySelector(dom)
    } catch {
      const createDom = document.createElement('div')
      createDom.innerHTML = dom
      this.dom = createDom
    }
  } else {
    this.isDOM(dom)
    this.dom = this.isDOM(dom) ? dom : dom.$el
  }

  this.init()
}
Print.prototype = {
  init() {
    const content = this.getStyle() + this.getHtml()
    this.writeIframe(content)
  },
  extend(obj: { [x: string]: any }, obj2: { [x: string]: any }) {
    for (const k in obj2) {
      obj[k] = obj2[k]
    }
    return obj
  },

  getStyle() {
    let str = ''
    const styles = document.querySelectorAll('style,link')
    for (let i = 0; i < styles.length; i++) {
      str += styles[i].outerHTML
    }
    str +=
      '<style>' +
      (this.options.noPrint ? this.options.noPrint : '.no-print') +
      '{display:none;}</style>'
    str += '<style>html,body{background-color:#fff;}</style>'
    return str
  },

  getHtml() {
    const inputs = document.querySelectorAll('input')
    const textareas = document.querySelectorAll('textarea')
    const selects = document.querySelectorAll('select')

    for (let k = 0; k < inputs.length; k++) {
      if (inputs[k].type == 'checkbox' || inputs[k].type == 'radio') {
        if (inputs[k].checked == true) {
          inputs[k].setAttribute('checked', 'checked')
        } else {
          inputs[k].removeAttribute('checked')
        }
      } else if (inputs[k].type == 'text') {
        inputs[k].setAttribute('value', inputs[k].value)
      } else {
        inputs[k].setAttribute('value', inputs[k].value)
      }
    }

    for (let k2 = 0; k2 < textareas.length; k2++) {
      if (textareas[k2].type == 'textarea')
        textareas[k2].innerHTML = textareas[k2].value
    }

    for (let k3 = 0; k3 < selects.length; k3++) {
      if (selects[k3].type == 'select-one') {
        const child: any = selects[k3].children
        for (const i in child) {
          if (child[i].tagName == 'OPTION') {
            if (child[i].selected == true)
              child[i].setAttribute('selected', 'selected')
            else child[i].removeAttribute('selected')
          }
        }
      }
    }

    return this.dom.outerHTML
  },

  writeIframe(content: string) {
    const iframe: any = document.createElement('iframe')
    const f: any = document.body.appendChild(iframe)
    iframe.id = 'myIframe'
    iframe.setAttribute(
      'style',
      'position:absolute;width:0;height:0;top:-10px;left:-10px;'
    )
    const w: any = f.contentWindow || f.contentDocument
    const doc: any = f.contentDocument || f.contentWindow.document
    doc.open()
    doc.write(content)
    doc.close()
    const _this = this
    iframe.onload = function () {
      _this.toPrint(w)
      setTimeout(function () {
        document.body.removeChild(iframe)
      }, 100)
    }
  },

  toPrint(frameWindow: {
    focus: () => void
    document: { execCommand: (arg0: string, arg1: boolean, arg2: null) => any }
    print: () => void
    close: () => void
  }) {
    try {
      setTimeout(function () {
        frameWindow.focus()
        try {
          if (!frameWindow.document.execCommand('print', false, null))
            frameWindow.print()
        } catch (e) {
          frameWindow.print()
        }
        frameWindow.close()
      }, 10)
    } catch (err) {
      console.log('err', err)
    }
  },
  isDOM:
    typeof HTMLElement === 'object'
      ? function (obj: any) {
          return obj instanceof HTMLElement
        }
      : function (obj: { nodeType: number; nodeName: any }) {
          return (
            obj &&
            typeof obj === 'object' &&
            obj.nodeType === 1 &&
            typeof obj.nodeName === 'string'
          )
        },
}

export default Print
