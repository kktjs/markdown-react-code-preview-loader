import path from 'path';
import webpack from 'webpack';
import lessModules from '@kkt/less-modules';
import rawModules from '@kkt/raw-modules';
import scopePluginOptions from '@kkt/scope-plugin-options';
import { LoaderConfOptions, WebpackConfiguration } from 'kkt';
import pkg from './package.json';
// import { mdCodeModulesLoader } from 'markdown-react-code-preview-loader';

export default (conf: WebpackConfiguration, env: 'development' | 'production', options: LoaderConfOptions) => {
  conf = lessModules(conf, env, options);
  conf = rawModules(conf, env, options);
  conf = scopePluginOptions(conf, env, {
    ...options,
    allowedFiles: [path.resolve(process.cwd(), 'README.md'), path.resolve(process.cwd(), 'src')],
  });
  conf.plugins!.push(
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(pkg.version),
    }),
  );

  if (Array.isArray(conf.module?.rules)) {
    conf.module?.rules.forEach((ruleItem) => {
      if (typeof ruleItem === 'object' && ruleItem !== null) {
        if (ruleItem.oneOf) {
          ruleItem.oneOf.unshift({
            test: /.md$/,
            use: [
              {
                loader: 'markdown-react-code-preview-loader',
                options: {},
              },
            ],
          });
        }
      }
    });
  }

  conf.module!.exprContextCritical = false;
  /** https://github.com/kktjs/kkt/issues/446 */
  conf.ignoreWarnings = [{ module: /node_modules[\\/]parse5[\\/]/ }];

  if (process.env.NODE_ENV === 'production') {
    conf.output = { ...conf.output, publicPath: './' };
  }
  return conf;
};
