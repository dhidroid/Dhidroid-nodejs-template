#!/usr/bin/env node

import inquirer from 'inquirer';
import * as fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { Command } from 'commander';

const program = new Command();

program
    .name('create-dhidroid-nodeapp')
    .description('CLI to generate enterprise Node.js applications')
    .version('1.0.0')
    .action(init);

program.parse(process.argv);

async function init() {
    console.log(chalk.bold.green('🚀 Welcome to the DhiDroid Node.js Generator!'));

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: 'What is your project name?',
            default: 'my-app',
            validate: (input) => /^[a-z0-9-_]+$/.test(input) || 'Project name should be lowercase and valid folder name',
        },
        {
            type: 'list',
            name: 'database',
            message: 'Which database would you like to use?',
            choices: ['MongoDB', 'PostgreSQL', 'MSSQL'],
        },
        {
            type: 'confirm',
            name: 'docker',
            message: 'Would you like to include Docker configuration?',
            default: true,
        },
        {
            type: 'confirm',
            name: 'gitHooks',
            message: 'Would you like to configure Git hooks (Husky, lint-staged)?',
            default: true,
        },
        {
            type: 'confirm',
            name: 'gitInit',
            message: 'Would you like to initialize a git repository?',
            default: true,
        },
    ]);

    const targetDir = path.join(process.cwd(), answers.projectName);

    if (fs.existsSync(targetDir)) {
        console.error(chalk.red(`Error: Directory ${answers.projectName} already exists.`));
        process.exit(1);
    }

    console.log(chalk.blue(`\n📂 Creating project in ${targetDir}...`));

    // Copy Template
    const templateDir = path.join(__dirname, '../templates/base');
    await fs.copy(templateDir, targetDir);

    // Customize Database
    await customizeDatabase(targetDir, answers.database);

    // Customize Docker
    if (!answers.docker) {
        await fs.remove(path.join(targetDir, 'Dockerfile'));
        await fs.remove(path.join(targetDir, 'docker-compose.yml'));
    }

    // Customize Git Hooks
    if (!answers.gitHooks) {
        await fs.remove(path.join(targetDir, '.husky'));
        // Remove husky from package.json
        const pkgPath = path.join(targetDir, 'package.json');
        const pkg = await fs.readJson(pkgPath);
        delete pkg.scripts.prepare;
        delete pkg['lint-staged'];
        delete pkg.devDependencies.husky;
        delete pkg.devDependencies['lint-staged'];
        await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    }

    // Final touches: Update package.json name
    const pkgPath = path.join(targetDir, 'package.json');
    const pkg = await fs.readJson(pkgPath);
    pkg.name = answers.projectName;

    // Database dependencies update
    if (answers.database === 'MongoDB') {
        // Already set up
    } else if (answers.database === 'PostgreSQL') {
        delete pkg.dependencies.mongoose;
        pkg.dependencies.pg = '^8.11.3';
        pkg.dependencies.typeorm = '^0.3.17'; // Example
        pkg.devDependencies['@types/pg'] = '^8.10.9';
    } else if (answers.database === 'MSSQL') {
        delete pkg.dependencies.mongoose;
        pkg.dependencies.mssql = '^10.0.1';
    }

    await fs.writeJson(pkgPath, pkg, { spaces: 2 });

    // Update config/database.ts content based on DB choice is complex via basic copy-paste.
    // Ideally we would have 'templates/db/postgres/database.ts' etc.
    // For now, we will assume stub implementation or placeholders if selected different DB.

    // Git Init
    if (answers.gitInit) {
        const { execSync } = require('child_process');
        try {
            execSync('git init', { cwd: targetDir, stdio: 'ignore' });
            console.log(chalk.green('Git repository initialized.'));
        } catch (e) {
            console.warn(chalk.yellow('Failed to initialize git repository.'));
        }
    }

    console.log(chalk.bold.green('\n✅ Project created successfully!'));
    console.log(`
To get started:
  ${chalk.cyan(`cd ${answers.projectName}`)}
  ${chalk.cyan('npm install')}
  ${chalk.cyan('npm run dev')}
`);
}

async function customizeDatabase(targetDir: string, dbType: string) {
    const dbConfigPath = path.join(targetDir, 'src/config/database.ts');

    if (dbType === 'PostgreSQL') {
        const pgContent = `
import { Client } from 'pg';
import { config } from './config';
import { logger } from './logger';

export const connectDB = async () => {
  const client = new Client({
    connectionString: config.DATABASE_URL || 'postgresql://user:password@localhost:5432/mydb'
  });
  try {
    await client.connect();
    logger.info('PostgreSQL Connected');
  } catch (error) {
    logger.error('PG Connect Error', error);
    process.exit(1);
  }
};
`;
        await fs.writeFile(dbConfigPath, pgContent);
    } else if (dbType === 'MSSQL') {
        const mssqlContent = `
import sql from 'mssql';
import { config } from './config';
import { logger } from './logger';

export const connectDB = async () => {
  try {
    await sql.connect(config.DATABASE_URL || 'server=localhost;user=sa;password=Password!;database=mydb');
    logger.info('MSSQL Connected');
  } catch (error) {
    logger.error('MSSQL Connect Error', error);
    process.exit(1);
  }
};
`;
        await fs.writeFile(dbConfigPath, mssqlContent);
    }
}
