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
      name: "author",
      message: "请输入主题作者",
      validate: (i) => {
        if (i != "") {
          return true;
        } else {
          return false;
        }
      },
    },
    {
      name: "repoURL",
      message: "请输入主题仓库URL",
      validate: (i) => {
        if (i == "") {
          return false;
        }
        try {
          // tslint:disable-next-line: no-unused-expression
          new URL(i);
        } catch (err) {
          return "\nURL无效\n";
        }
        let res = "\n";
        if (!i.startsWith("https://github.com/")) res += "https://github.com/ 开头是必要的\n";
        if (i.endsWith(".git")) res += "不能是以 .git 结尾\n";
        if (res != "\n") {
          return res;
        } else {
          return true;
        }
      },
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
              author: answers.author,
              repoURL: answers.repoURL,
            };
            const result = template(param);
            fs.writeFileSync(packagePath, result);
            console.log(chalk.green("package.json初始化成功！"));
          }
          const themeJsonPath = path.join(downloadPath, "theme.json");
          if (fs.existsSync(themeJsonPath)) {
            const content = fs.readFileSync(themeJsonPath).toString();
            // handlebars 模板处理引擎
            const template = handlebars.compile(content);
            const param = {
              name: answers.name,
              author: answers.author,
              repoURL: answers.repoURL,
            };
            const result = template(param);
            fs.writeFileSync(themeJsonPath, result);
            console.log(chalk.green("theme.json初始化成功！"));
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
