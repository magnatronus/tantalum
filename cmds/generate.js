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
        spawn           = require( 'child_process' ).spawnSync,
        yamlfile        = `${process.cwd()}/.tantalum.yml`,
        log             = console.log;

// Some simple help
exports.command = 'generate';
exports.describe = 'Generate the serverless.yml file and install required plugins.';


/**
 * Exported method to create the Tantulum YML config file
 */
exports.handler = function (argv) {

    log(`[INFO] - Generating Tantalum serverless project in ${process.cwd()}`);
    
    // lets test for the Serverless module - if not there warn the user
    log(chalk.blue("[INFO] - Checking for serverless installation..."));
    try {
        const slscmd = spawn( 'serverless',['--help']);
        console.log( `${slscmd.stdout.toString()}` );
    }
    catch(ex){
        console.log(chalk.red("[WARN] - Unable to access the serverless module. Please check that it is installed, or install using: ") + "$(sudo) npm install -g serverless");
        process.exit(1);
    }
    log(chalk.green("[INFO] - serverless install found..."));


    // Does the .tantulum.yml file exist?
    if(!fs.pathExistsSync(yamlfile)){
        log(chalk.red("[WARN] - Tantalum YAML (.tantulum.yml) not found. Please run tantalum create first....."));
        process.exit(1);
    }


    // generate our default serverless.yml file
    const serverlessyml = ymlhelper.createServerlessYaml();
    log(chalk.blue(`[INFO] - Generating ${serverlessyml}....`));

    // populate and find out of dynamodb install required
    const dynameoDbInstallRequired = ymlhelper.createDefaultContent(serverlessyml);


    // if package.json does not exists create it
    if(!fs.pathExistsSync('package.json')){
        log(chalk.blue(`[INFO] - No package.json found, creating one.....`));
        const newcmd = spawn( 'npm', ['init', '-y']);
        console.log( `${newcmd.stdout.toString()}` );       
    }


    // Install the required serverless offline npm modules
    const moduleList = ymlhelper.getModuleList(serverlessyml);
    log(chalk.blue(`[INFO] - Installing NPM modules ${moduleList.join()}. Please wait.....`));
    const options = ['i', '--save-dev'].concat(moduleList);
    const npmcmd = spawn( 'npm', options);
    console.log( `${npmcmd.stdout.toString()}` );  
    

    // This should be done last
    if(dynameoDbInstallRequired){
        log(chalk.blue("[INFO] - Installing DynamoDB Local NPM. Please wait......"));
        const dyncmd = spawn( 'npm', ['i', '--save-dev', 'dynamo-local']);
        console.log( `${dyncmd.stdout.toString()}` );  
     
        // This last step CAN only be done if serverless.yml was created - if it is done via a merge file the merge should be done first
        if(serverlessyml === "serverless.yml"){
            log(chalk.blue("[INFO] - Running serverless dynamodb install. Please wait......"));
            const cmd = spawn( 'sls', ['dynamodb', 'install']);
            console.log( `${cmd.stdout.toString()}` );
            log(chalk.green("serverless off can now be started with the command 'serverless offline start'"));
        }  else {
            log(chalk.yellow("[INFO] - The serverless merge file that was created(serverless-tlm.yml) needs to be merged into your serverless.yml"));
            log(chalk.yellow("[INFO] - You will then need to run 'serverless dynamodb install' to complete the installation."));
            log(chalk.green("When this has been done serverless off can be started with the command 'serverless offline start'"));
        }      
    }

};