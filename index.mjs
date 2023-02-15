#!/usr/bin/env node
import inquirer from 'inquirer';
import download from "download-git-repo";

inquirer
  .prompt([
    {
        name: 'description',
        message: '请输入主题描述',
        default: ''
    },
    {
        name: 'author',
        message: '请输入主题作者',
        default: 'author-name'
    },
    {
        name: 'name',
        message: '请输入主题名称',
        default: 'theme-name'
    },
    {
        name: 'template',
        type: 'rawlist',
        message: '请选择主题模板',
        choices: ['simple', 'full'],
        default: 'simple'
    }
])
  .then((answers) => {
    // console.log(answers)
    download(`bitbucket:hi-windom/sili-t-${answers.template}#main`,
      `out/${answers.name}`,
      { clone: false },
      function (err) {
        console.log(err ? err : "Success");
      }
    )
  })
  .catch((error) => {
    console.error(error)
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
