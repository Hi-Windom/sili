#!/usr/bin/env node
import inquirer from "inquirer";
import download from "download-git-repo";
import handlebars from "handlebars";
import chalk from "chalk";
import ora from "ora";
import fs from "fs";
import path from "path";
const spinnerDownloadTemplate = ora("正在下载模板, 请稍后...");
inquirer
  .prompt([
    {
      name: "description",
      message: "请输入主题描述",
      default: "",
    },
    {
      name: "name",
      message: "请输入主题名称",
      default: "theme-name",
    },
    {
      name: "template",
      type: "rawlist",
      message: "请选择主题模板",
      choices: ["simple", "full"],
      default: "simple",
    },
  ])
  .then((answers) => {
    // console.log(answers)
    spinnerDownloadTemplate.start();
    const downloadPath = path.join(process.cwd(), "out", answers.name);
    download(
      `bitbucket:hi-windom/sili-t-${answers.template}#main`,
      downloadPath,
      { clone: false },
      function (err) {
        if (err) {
          spinnerDownloadTemplate.fail(err.toString());
          console.log(chalk.red(err));
        }
        {
          spinnerDownloadTemplate.succeed("Success");
          const packagePath = path.join(downloadPath, "package.json");
          // 判断是否有package.json, 要把输入的数据回填到模板中
          if (fs.existsSync(packagePath)) {
            const content = fs.readFileSync(packagePath).toString();
            // handlebars 模板处理引擎
            const template = handlebars.compile(content);
            const param = {
              name: answers.name,
              description: answers.description,
            };
            const result = template(param);
            fs.writeFileSync(packagePath, result);
            console.log(chalk.green("主题初始化成功！"));
          }
        }
      }
    );
  })
  .catch((error) => {
    console.error(error);
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
