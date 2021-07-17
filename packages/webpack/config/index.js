const paths = require('@automs/tools/libs/paths')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const ModuleScopePlugin = require('../plugins/ModuleScopePlugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const { transformer, formatter } = require('../libs/index')

const webpackConfig = mode => {
  const isEnvDevelopment = mode === 'development'
  const isEnvProduction = mode === 'production'
  const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'
  const imageInlineSizeLimit = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || '10000', 10)

  const publicPath = isEnvProduction ? paths.appPublishUrl : isEnvDevelopment && '/'

  const config = {
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',

    // 在第一个错误出现时抛出失败结果，而不是容忍它
    bail: isEnvProduction,

    // source-map
    devtool:
      isEnvProduction && shouldUseSourceMap
        ? 'source-map'
        : isEnvDevelopment
        ? 'cheap-module-source-map'
        : false,

    // 入口文件
    entry: [paths.appIndexJs],

    // 出口文件
    output: {
      // 打包前清空打包目录
      clean: true,

      path: isEnvProduction ? paths.appBuild : void 0,

      // 此选项决定了每个输出 bundle 的名称。这些 bundle 将写入到 output.path 选项指定的目录下。
      filename: isEnvProduction ? 'js/[name].[chunkhash:8].js' : isEnvDevelopment && 'js/bundle.js',

      // 此选项决定了非初始（non-initial）chunk 文件的名称。
      chunkFilename: isEnvProduction
        ? 'js/[name].[chunkhash:8].chunk.js'
        : isEnvDevelopment && 'js/[name].chunk.js',

      publicPath: publicPath,

      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: isEnvProduction
        ? info => path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, '/')
        : isEnvDevelopment && (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
    },

    module: {
      strictExportPresence: true,

      rules: [
        // Disable require.ensure as it's not a standard language feature.
        { parser: { requireEnsure: false } },

        // Handle node_modules packages that contain sourcemaps
        shouldUseSourceMap && {
          enforce: 'pre',
          exclude: /@babel(?:\/|\\{1,2})runtime/,
          test: /\.(js|mjs|jsx|ts|tsx|css)$/,
          use: 'source-map-loader',
        },

        {
          // "oneOf" will traverse all following loaders until one will
          // match the requirements. When no loader matches it will fall
          // back to the "file" loader at the end of the loader list.
          oneOf: [
            // "url" loader works like "file" loader except that it embeds assets
            // smaller than specified limit in bytes as data URLs to avoid requests.
            // A missing `test` is equivalent to a match.
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: imageInlineSizeLimit,
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },

            // "postcss" loader applies autoprefixer to our CSS.
            // "css" loader resolves paths in CSS and adds assets as dependencies.
            // "style" loader turns CSS into JS modules that inject <style> tags.
            // In production, we use MiniCSSExtractPlugin to extract that CSS
            // to a file, but in development "style" loader enables hot editing
            // of CSS.
            // By default we support CSS Modules with the extension .module.css
            // {
            //   test: cssRegex,
            //   exclude: cssModuleRegex,
            //   use: getStyleLoaders({
            //     importLoaders: 1,
            //     sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
            //     modules: {
            //       compileType: 'icss',
            //     },
            //   }),
            //   // Don't consider CSS imports dead code even if the
            //   // containing package claims to have no side effects.
            //   // Remove this when webpack adds a warning or an error for this.
            //   // See https://github.com/webpack/webpack/issues/6571
            //   sideEffects: true,
            // },
            // // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
            // // using the extension .module.css
            // {
            //   test: cssModuleRegex,
            //   use: getStyleLoaders({
            //     importLoaders: 1,
            //     sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
            //     modules: {
            //       compileType: 'module',
            //       getLocalIdent: getCSSModuleLocalIdent,
            //     },
            //   }),
            // },
            // // Opt-in support for SASS (using .scss or .sass extensions).
            // // By default we support SASS Modules with the
            // // extensions .module.scss or .module.sass
            // {
            //   test: sassRegex,
            //   exclude: sassModuleRegex,
            //   use: getStyleLoaders(
            //     {
            //       importLoaders: 3,
            //       sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
            //       modules: {
            //         compileType: 'icss',
            //       },
            //     },
            //     'sass-loader',
            //   ),
            //   // Don't consider CSS imports dead code even if the
            //   // containing package claims to have no side effects.
            //   // Remove this when webpack adds a warning or an error for this.
            //   // See https://github.com/webpack/webpack/issues/6571
            //   sideEffects: true,
            // },
            // // Adds support for CSS Modules, but using SASS
            // // using the extension .module.scss or .module.sass
            // {
            //   test: sassModuleRegex,
            //   use: getStyleLoaders(
            //     {
            //       importLoaders: 3,
            //       sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
            //       modules: {
            //         compileType: 'module',
            //         getLocalIdent: getCSSModuleLocalIdent,
            //       },
            //     },
            //     'sass-loader',
            //   ),
            // },
            // // "file" loader makes sure those assets get served by WebpackDevServer.
            // // When you `import` an asset, you get its (virtual) filename.
            // // In production, they would get copied to the `build` folder.
            // // This loader doesn't use a "test" so it will catch all modules
            // // that fall through the other loaders.
            // {
            //   loader: require.resolve('file-loader'),
            //   // Exclude `js` files to keep "css" loader working as it injects
            //   // its runtime that would otherwise be processed through "file" loader.
            //   // Also exclude `html` and `json` extensions so they get processed
            //   // by webpacks internal loaders.
            //   exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            //   options: {
            //     name: 'static/media/[name].[hash:8].[ext]',
            //   },
            // },
            // // ** STOP ** Are you adding a new loader?
            // // Make sure to add the new loader(s) before the "file" loader.
          ],
        },
      ].filter(Boolean),
    },

    plugins: [
      new FriendlyErrorsWebpackPlugin({
        additionalTransformers: [transformer],
        additionalFormatters: [formatter],
      }),
    ],

    optimization: {
      // 告知 webpack 使用 TerserPlugin 或其它在 optimization.minimizer 定义的插件压缩 bundle。
      minimize: isEnvProduction,

      minimizer: [
        // This is only used in production mode
        new TerserPlugin({
          terserOptions: {
            parse: {
              // We want terser to parse ecma 8 code. However, we don't want it
              // to apply any minification steps that turns valid ecma 5 code
              // into invalid ecma 5 code. This is why the 'compress' and 'output'
              // sections only apply transformations that are ecma 5 safe
              // https://github.com/facebook/create-react-app/pull/4234
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              // https://github.com/facebook/create-react-app/issues/2376
              // Pending further investigation:
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
              // Disabled because of an issue with Terser breaking valid code:
              // https://github.com/facebook/create-react-app/issues/5250
              // Pending further investigation:
              // https://github.com/terser-js/terser/issues/120
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            // Added for profiling in devtools
            keep_classnames: false,
            keep_fnames: false,
            output: {
              ecma: 5,
              comments: false,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true,
            },
            sourceMap: shouldUseSourceMap,
          },
        }),

        // This is only used in production mode
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: ['default', { discardComments: { removeAll: true } }],
          },
        }),
      ],

      // Automatically split vendor and commons
      // https://twitter.com/wSokra/status/969633336732905474
      // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
      splitChunks: {
        chunks: 'all',
        name: isEnvDevelopment,
      },

      // Keep the runtime chunk separated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      // https://github.com/facebook/create-react-app/issues/5358
      runtimeChunk: {
        name: entrypoint => `runtime-${entrypoint.name}`,
      },

      // 在编译时每当有错误时，就会 emit asset。这样可以确保出错的 asset 被 emit 出来。
      // 关键错误会被 emit 到生成的代码中，并会在运行时报错。
      emitOnErrors: true,
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.scss', '.css'],

      alias: {
        '@/components': path.join(paths.appSrc, 'components'),
        '@/containers': path.join(paths.appSrc, 'containers'),
        '@/utils': path.join(paths.appSrc, 'utils'),
        '@/libs': path.join(paths.appSrc, 'libs'),
        '@/assets': path.join(paths.appSrc, 'assets'),
        '@/conf': path.join(paths.appSrc, 'conf'),
        '@/hooks': path.join(paths.appSrc, 'hooks'),
      },

      plugins: [
        // Prevents users from importing files from outside of src/ (or node_modules/).
        // This often causes confusion because we only process files within src/ with babel.
        // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
        // please link the files into your node_modules/ and let module-resolution kick in.
        // Make sure your source files are compiled, as they will not be processed in any way.
        new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
      ],
    },

    resolveLoader: {
      plugins: [],
    },

    // Turn off performance processing because we utilize
    // our own hints via the FileSizeReporter
    performance: false,
  }

  return config
}

module.exports = webpackConfig
