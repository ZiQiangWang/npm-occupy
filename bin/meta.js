module.exports = [
  {
    type: 'input',
    name: 'package',
    message: 'package name',
    validate: function (input) {
      const done = this.async()
      if (input === '') {
        done('package name required')
        return
      }

      done(null, true)
    }
  },
  {
    type: 'input',
    name: 'description',
    message: 'description'
  },
  {
    type: 'input',
    name: 'keywords',
    message: 'keywords'
  },
  {
    type: 'input',
    name: 'author',
    message: 'author'
  },
  {
    type: 'input',
    name: 'license',
    message: 'license',
    default: 'ISC'
  }
]
