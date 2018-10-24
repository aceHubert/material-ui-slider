
const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = (paths)=>{
  paths.appSrc = resolveApp('docs');
  paths.appIndexJs = resolveApp('docs/index.jsx');
  paths.appBuild = resolveApp('dist/docs');
  return paths;
}