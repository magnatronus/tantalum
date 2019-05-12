/**
 * create.js
 * CLI command to create a new Tantalum YML config file in the current directory
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
        defaultyaml     = `${__dirname}/../config/tantalum.yml`,
        yamlfile        = `${process.cwd()}/.tantalum.yml`,
        log             = console.log;

// Some simple help
exports.command = "create [-p]";
exports.describe = 'Create a .tantalum.yml config file in the current directory for use with the generate command.  The -p flag can be used to limit the added plug-ins e.g. -p=sns,s3';

/**
 * Exported method to create the Tantulum YML config file
 */
exports.handler = function (argv) {


    // If a config file already exists abort the action and inform the user
    if(fs.pathExistsSync(yamlfile)){
        log(chalk.red("[WARN] - Tantalum YAML file already exists, check and update if required then run tantalum generate or delete the .tantalum.yml and try afgain...."));
        process.exit(1);
    } else {

        // create the default yml config
        log(chalk.blue("[INFO] - Creating default Tantalum config file"));
        fs.copyFileSync(defaultyaml, yamlfile);

        // if options specified overide the defaults
        if( argv.p ){
            const list = argv.p;
            log(chalk.blue(`[INFO] - Modifying config file plugin list with ${list} `));
            ymlhelper.updateConfigYaml(yamlfile, list);
        }


        log(chalk.green("[INFO] - Tantalum config file created"));
        process.exit(1);
    }

};