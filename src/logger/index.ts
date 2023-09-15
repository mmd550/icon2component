function success(...message: string[]) {
  const prefix = "🙂👍 ";

  console.log(prefix, ...message);
}

function log(...message: string[]) {
  console.log(...message);
}

function error(...message: string[]) {
  const prefix = "☹️👎 ";

  console.log(prefix, ...message);
}

const logger = { error, success, log };

export default logger;
