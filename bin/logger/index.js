function success(...message) {
  const prefix = '🙂👍 '

  console.log(prefix, ...message)
}

function log(...message) {
  console.log(...message)
}

function error(...message) {
  const prefix = '☹️👎 '

  console.log(prefix, ...message)
}

module.exports = { error, success, log }
