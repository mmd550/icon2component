#! /usr/bin/env node
"use strict";

const { exec } = require("child_process");
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

function message(...message) {
  const prefix = "☺☺☺";

  console.log(prefix, ...message);
}

async function execute(command) {
  return new Promise(function (resolve) {
    exec(command, (err, stdout) => {
      resolve(stdout);
      if (err) {
        message(`exec error: ${err}\n`, "command: ", command);
      }
    });
  });
}

async function bootstrap(){
  const commandsHandlers = getCommands();
  if (/(-c)|(create)|(make)/.test(argv["_"][0])) {
    await commandsHandlers.createIconComponents();
    return;
  }
}

function getCommands() {
  async function createIconComponents(){
    const sourceDir = argv["_"][1]
    const outDir = argv["outdir"] || argv["outDir"] || argv["out-dir"]
    if (!outDir|| !sourceDir) {
      message("Please provide source and output paths\n","example: iconlite create --out-dir <out-dir> <source-dir>");
      return;
    }

    const configPath = __dirname.slice(0,-3)+".svgrrc.js"

    await execute(`svgr --config-file ${configPath} --out-dir ${outDir} -- ${sourceDir}`)
  }

  return {createIconComponents}
}

bootstrap()