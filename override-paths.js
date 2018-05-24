
const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = (paths)=>{
  paths.appSrc = resolveApp('site');
  paths.appIndexJs = resolveApp('site/index.jsx');
  paths.appBuild = resolveApp('dist/site');
  return paths;
}