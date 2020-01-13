const fs = require('fs')
const path = require('path')

module.exports = (app) => {
  const currentWorkDir = process.cwd()
  fs.readdirSync(currentWorkDir + '/app/routes').forEach((file) => {
    let extname = path.extname(file)
    let basename = path.basename(file, extname)
    if (~file.indexOf('.js') && basename !== 'index') {
      app.use('/api/' + basename, require(currentWorkDir + '/app/routes/' + file))
    }
  })
}