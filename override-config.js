const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const includePaths = [resolveApp('src'), resolveApp('docs'), resolveApp('libs')];

module.exports = (config, env) => {
  if (env === 'test') {
    return config;
  }

  Object.assign(config.resolve.alias, {'material-ui-slider': resolveApp('src')})

  //移出ModuleScopePlugin插件的目录检测
  config
    .resolve
    .plugins
    .forEach((plugin, idx) => {
      if (plugin.hasOwnProperty('appSrc')) {
        plugin['appSrc'] = includePaths;
      } else if (plugin.hasOwnProperty('appSrcs')) {
        plugin['appSrcs'] = includePaths;
      }
    })

  //解决Rules多目录include
  config
    .module
    .rules
    .forEach(rule => {
      if (rule.hasOwnProperty('include')) {
        rule['include'] = includePaths;
      } else if (rule.hasOwnProperty('oneOf')) {
        rule
          .oneOf
          .forEach(oneOfRule => {
            if (oneOfRule.hasOwnProperty('include')) {
              oneOfRule['include'] = includePaths;
            }
            if (oneOfRule.loader && oneOfRule.loader.includes('file-loader')) {
              oneOfRule
                .exclude
                .push(/\.md$/)
            }
          })
        //添加md文件读取
        rule
          .oneOf
          .push({
            test: /\.md$/,
            loader: require.resolve('raw-loader'),
            include: includePaths,
            options: {
              name: 'static/media/[name].[hash:8].[ext]'
            }
          })
      }
    })

  return config;
}
