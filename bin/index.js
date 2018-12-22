#! /usr/bin/env node

const pkg = require('../package.json')
const program = require('commander')
const { start } = require('./helper')

program.version(pkg.version, '-v, --version')
  .usage('Occupy npm package name')
  .action(() => {
    start()
  })

program.parse(process.argv)
