
const cli = require('./cli.config')
const setting = require('./setting.config')
const theme = require('./theme.config')
const url = require('./url.config')
const httpCode = require('./httpCode.config')
const stateCode = require('./stateCode.config')
const event = require('./event.config')
module.exports = {
  ...cli,
  ...setting,
  ...theme,
  ...url,
  ...httpCode,
  ...stateCode,
  ...event,
}
