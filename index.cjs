#!/usr/bin/env node
const { program } = require("commander");
const download = require("download-git-repo");
program
  .name("sili")
  .description("开发思源笔记汐洛分支主题的脚手架")
  .version("1.0.0");
program
  .command("init")
  .description("init a theme")
  .option("-n, --name <N>", "主题名称")
  .option("-f, --full", "创建包含js、跨平台示例以及其他内容的完整主题模板")
  .action((N) => {
    const name = N.name ? N.name : "demo";
    const full = N.full ? true : false;
    console.log(name, full);
    download(
      full
        ? "bitbucket:hi-windom/sili-t-full#main"
        : "bitbucket:hi-windom/sili-t-simple#main",
      `out/${name}`,
      { clone: false },
      function (err) {
        console.log(err ? err : "Success");
      }
    );
  });

program.parse(process.argv);
