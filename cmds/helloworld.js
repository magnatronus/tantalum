/**
 * helloworld.js
 * CLI command to create an example serverless offline project
 * 
 * @module create
 * 
 * @license
 * MIT. Please see the LICENSE file included with this package
 *
 */
const   args            = require("yargs").argv,
        chalk           = require('chalk'),
        fs              = require("fs-extra"),
        ymlhelper       = require('../lib/yaml_generator'),
        projectfiles    = `${__dirname}/../example/`,
        yamlexample     = `${__dirname}/../example/hello_world.yml`
        yamlfile        = `${process.cwd()}/.tantalum.yml`,
        log             = console.log;

// Some simple help
exports.command = "helloworld";
exports.describe = 'create a simple helloworld server offline project using API Gateway, DynamoDB, S3 and SNS. See generated readme.MD for more details after install.';

/**
 * Exported method to create the Tantulum YML config file
 */
exports.handler = function (argv) {

    log(chalk.green("[INFO] - Copying hello_world project files. Please wait....."));
    fs.copySync(projectfiles, `${process.cwd()}/`);

    log(chalk.green("[INFO] - Updating serverless.yml. Please wait....."));
    ymlhelper.updateHelloWorldYml(yamlexample);

    log(chalk.green("[INFO] - HelloWorld example installed."));

};