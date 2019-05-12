/**
 * tantalum.js
 * This is the main entry point for the Tantalum CLI.
 * 
 * @module tantalum
 * 
 * @copyright
 * Copyright 2019 by Steve Rogers, SpiralArm Consulting Ltd . All Rights Reserved
 *  
 * @license
 * MIT. Please see the LICENSE file included with this package
 * 
 */
const chalk = require('chalk'),
      fs = require('fs-extra'),
      pkg = require('../package.json'),
      log = console.log;


log(chalk.green("Tantalum CLI, ") + chalk.gray(`version ${pkg.version}`));
log("Please report all bugs and direct all enquiries to " + chalk.green(pkg.author.email));
log(chalk.yellow("Copyright (c) 2019 SpiralArm Consulting Ltd. All Rights Reserved."));

require('yargs')
    .commandDir('../cmds')
    .demandCommand()
    .help()
    .argv;