const process = require('child_process')
const path = require('path')
const fs = require('fs-extra')
const ora = require('ora')

const metalsmith = require('metalsmith')
const handlebars = require('handlebars')
const { prompt } = require('inquirer')
const meta = require('./meta')

/**
 * 根据入参生成模板文件
 * @param {*} metadata
 * @param {*} src
 * @param {*} dest
 */
function create (metadata = {}, src, dest = '.') {
  return new Promise((resolve, reject) => {
    metalsmith(__dirname)
      .metadata(metadata)
      .clean(false)
      .source(src)
      .destination(dest)
      .use((files, metalsmith, done) => {
        const meta = metalsmith.metadata()
        Object.keys(files).forEach(fileName => {
          const t = files[fileName].contents.toString()
          files[fileName].contents = new Buffer(handlebars.compile(t)(meta))
        })
        done()
      }).build(err => {
        err ? reject(err) : resolve()
      })
  })
}

/**
 * 创建对话收集信息，并创建文件
 */
function collect (meta) {
  return prompt(meta)
    .then(data => {
      const keywords = data.keywords
      const keys = keywords.replace(/\s+/g, ' ').trim().split(' ')
      const keyString = (keys.length > 0 && keys[0] !== '') ? `["${keys.join('","')}"]` : '[]'
      return {
        ...data,
        keywords: keyString
      }
    })
}

/**
 * 发布npm package
 * @param {String} destination
 */
function publish (destination) {
  return new Promise((resolve, reject) => {
    process.exec(`npm publish ${destination}`, err => {
      if (err) {
        reject(err)
      };
      resolve(true)
    })
  })
}

async function start () {
  // 收集创建的数据
  const info = await collect(meta)

  // 创建临时文件夹
  const source = path.resolve(__dirname, '../template')
  const destination = path.resolve(`./npm-occupy-template__${new Date().getTime()}`)
  fs.mkdirpSync(destination)

  // 根据数据渲染对应的文件
  await create(info, source, destination)
  const spinner = ora('Publish...\n')
  spinner.start()
  // 发布
  try {
    await publish(destination)
  } catch (error) {
    console.log(error.message)
  } finally {
    spinner.stop()
    fs.removeSync(destination)
  }
}

module.exports = {
  create,
  collect,
  publish,
  start
}
