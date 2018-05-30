
const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = (config, env) => {
  if(env==='test'){
    return config;
  }
  //移出ModuleScopePlugin插件的目录检测
  config.resolve.plugins.forEach((plugin,idx)=>{
    if(plugin.hasOwnProperty('appSrc') && plugin.hasOwnProperty('allowedFiles'))
      config.resolve.plugins.splice(idx,1);
  }) 

  //解决Rules多目录include
  config.module.rules.forEach(rule=>{
    if(rule.hasOwnProperty('include'))
    {
      rule['include']= [ resolveApp('src'),resolveApp('site'),resolveApp('libs')]
    }else if(rule.hasOwnProperty('oneOf')){
      rule.oneOf.forEach(one=>{
        if(one.hasOwnProperty('include'))
        {
          one['include']= [ resolveApp('src'),resolveApp('site'),resolveApp('libs')]
        }
      })
    }
  }) 
  return config;
}
