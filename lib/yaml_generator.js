/**
 * yaml_generator.js
 * This module is a helper to allow the generatuon of the tantulum based serverless.yml file
 * based on the content of the .tantulum.yml
 */
const   args            = require("yargs").argv,
        path            = require('path'),
        chalk           = require('chalk'),
        fs              = require("fs-extra"),
        yaml            = require('js-yaml'),
        spawn           = require( 'child_process' ).spawnSync,
        configyaml      = `${process.cwd()}/.tantalum.yml`,
        serverlessyaml  = `serverless.yml`,
        tantalumyaml    = `serverless-tlm.yml`,
        pluginlist      = require('./serverless-plugins').plugins,
        log             = console.log;



/**
 * Read in the current Tantalum config file
 * @returns {Object} the tantalum JSON config
 */
const readTantalumConfig = () =>{
    const config = yaml.safeLoad(fs.readFileSync(configyaml, 'utf8'));
    return config.tantalum;
};


module.exports = {


    /**
     * Update the serverless.yml file so that it has the definition for the hello_world example
     * this ASSUMES that any generated yaml files have already been merged
     */
    updateHelloWorldYml: (exampleyaml) => {

        // open example and current yml
        const config = yaml.safeLoad(fs.readFileSync(`${process.cwd()}/serverless.yml`, 'utf8'));
        const example = yaml.safeLoad(fs.readFileSync(exampleyaml, 'utf8'));

        // merge
        config['functions'] = example.functions;
        config['resources'] = example.resources;

        // update
        fs.writeFileSync(`${process.cwd()}/serverless.yml`, yaml.safeDump(config), "utf8");

    },


    /**
     * List the required npm modules that need to be installed
     * @param {String} filename -  serverless.yaml filename
     */
    getModuleList: (filename) => {
        const config = yaml.safeLoad(fs.readFileSync(`${process.cwd()}/${filename}`, 'utf8'));
        return config.plugins;
    },

    /**
     * This will update the named .tantalum.yml and replace the default plugin list with the specified one
     * @param {String} filename - the config yaml to update
     * @param {String} plugins  - a comma delimited list of the selected plugins
     */
    updateConfigYaml: (filename, plugins) => {
        const list = plugins.split(",");
        const config = yaml.safeLoad(fs.readFileSync(filename, 'utf8'));
        config.tantalum.plugins = [];
        list.forEach((sp) => {
            const plugin = pluginlist.find((p) => {return p.aws == sp.trim()});
            if(plugin){
                config.tantalum.plugins.push(sp.trim());
            }
        });
        fs.writeFileSync(filename, yaml.safeDump(config), "utf8");
    },


    /**
     * Create our serverless.yml file either create a new one OR if it already exists create a tantalum version for merging
     * @returns {String} the name of the blank serverless.yml
     */
    createServerlessYaml: () => {
        if(fs.pathExistsSync(`${process.cwd()}/${serverlessyaml}`)){
            log(chalk.yellow("[WARN] - serverless.yml already exists, so creating serverless-tlm.yml for merging.."));
            fs.writeFileSync(`${process.cwd()}/${tantalumyaml}`);
            return tantalumyaml;
        } else {
            log(chalk.blue("[INFO] - generating serverless.yml.."));
            fs.writeFileSync(`${process.cwd()}/${serverlessyaml}`);
            return serverlessyaml;
        }
    },

    /**
     * Create a default yaml for populating using the passed in name
     * @param {String} filename - the name of an existing yaml file to update
     * @returns {Boolean} true if DynamoDB required otherwise false
     */
    createDefaultContent: (filename) => {
        
        let dynamoDb = false;
        const projectdir = path.basename(process.cwd());
        const tantalumConfig = readTantalumConfig();
        try{
            // create the service based on the dir name
            const slsyml = {
                service: `${projectdir}-service`,
            };

            // load in any defined serverless plugins ( will auto add the serverless-offline which should be last!)
            slsyml.plugins = [];
            if(tantalumConfig.plugins){
                tantalumConfig.plugins.forEach((sp) => {
                    if(sp == 'dynamodb'){
                        dynamoDb = true;
                    }
                    const plugin = pluginlist.find((p) => {return p.aws == sp});
                    if(plugin){
                        slsyml.plugins.push(plugin.plugin);
                    }
                });
            }
            slsyml.plugins.push("serverless-offline");

            // add the other settings if in config
            if(tantalumConfig.provider){
                slsyml['provider'] = tantalumConfig.provider;
            }
            if(tantalumConfig.stage){
                slsyml['stage'] = tantalumConfig.stage;
            }
            if(tantalumConfig.custom){
                slsyml['custom'] = tantalumConfig.custom;
            }

            // create the serverless config file
            fs.writeFileSync(`${process.cwd()}/${filename}`, yaml.safeDump(slsyml), "utf8");
            return dynamoDb;

        }catch(err) {
            log(chalk.red(`[ERROR] - Unable to generate default yaml file content for ${filename}`));
            log(chalk.red(`[ERROR] - ${err}`));
        }

    },


};