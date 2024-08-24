const { relative } = require('path')

const blockName = 'vue-filename-injector'
module.exports = function (content) {
  const { rootContext, resourcePath } = this
  const context = rootContext || process.cwd()
  const filePath = relative(context, resourcePath).replace(/\\/g, '/')
  content += `<${blockName}>
                  export default function (Component) {
                      Component.__source = ${JSON.stringify(filePath)}
                  }
              </${blockName}>`
  return content
}
