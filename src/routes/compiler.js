// reference: https://github.com/yamafaktory/babel-react-rollup-starter/blob/master/config/dev.js
const rollup = require('rollup')
const uglify = require('rollup-plugin-uglify')
const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const nodeGlobals = require('rollup-plugin-node-globals')
const nodeResolve = require('rollup-plugin-node-resolve')
const replace = require('rollup-plugin-replace')

const {consoleClear, readFilePromised} = require('../utilities')

async function build(inputOptions, outputOptions) {
  const bundle = await rollup.rollup(inputOptions)
  const {code, map} = await bundle.generate(outputOptions)
  return code
}

module.exports = async (ctx, next) => {
  consoleClear()
  try {
    const test = await readFilePromised('./src/public/js/main2.js', {encoding: 'utf-8'})
    const code = await build({
      input: './src/public/js/main2.js',
      plugins: [
        babel({
          babelrc: false,
          exclude: 'node_modules/**',
          presets: [ [ 'es2015', { modules: false } ], 'stage-0', 'react' ],
          plugins: [ 'external-helpers' ]
        }),
        commonjs({
          exclude: 'node_modules/process-es6/**',
          namedExports: {
            'node_modules/react/index.js': ['createElement', 'Component'],
            'node_modules/react-dom/index.js': ['render']
          }
        }),
        nodeGlobals(),
        replace({ 'process.enve.NODE_ENV': JSON.stringify('development') }),
        nodeResolve({
          browser: true,
          main: true
        }),
        uglify({
          compress: {
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            warnings: false }
        })
      ]
    }, {
      format: 'iife'
    })
    ctx.body = code
  } catch(error) {
    ctx.body = require('../utilities').stringifyPretty(error)
    console.log(error)
  }
}
