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
    .version('1.1.0')
    .action(init);

program.parse(process.argv);

async function init() {
    console.log(chalk.bold.green('🚀 Welcome to the DhiDroid Node.js Generator!'));

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: 'Project name:',
            default: 'dhidroid-project',
            validate: (input) => /^[a-z0-9-_]+$/.test(input) || 'Project name should be lowercase and valid folder name',
        },
        {
            type: 'list',
            name: 'framework',
            message: 'Select framework:',
            choices: ['Enterprise Node.js'],
        },
        {
            type: 'list',
            name: 'variant',
            message: 'Select variant:',
            choices: [
                { name: 'TypeScript + MongoDB', value: 'MongoDB' },
                { name: 'TypeScript + PostgreSQL', value: 'PostgreSQL' },
                { name: 'TypeScript + MSSQL', value: 'MSSQL' },
            ],
        },
        {
            type: 'confirm',
            name: 'docker',
            message: 'Add Docker Configuration?',
            default: true,
        },
        {
            type: 'confirm',
            name: 'gitHooks',
            message: 'Add Git Hooks (Husky)?',
            default: true,
        },
        {
            type: 'confirm',
            name: 'gitInit',
            message: 'Initialize Git repository?',
            default: true,
        },
    ]);

    const targetDir = path.join(process.cwd(), answers.projectName);
    const dbChoice = answers.variant; // Map variant back to DB choice logic

    if (fs.existsSync(targetDir)) {
        console.error(chalk.red(`Error: Directory ${answers.projectName} already exists.`));
        process.exit(1);
    }

    console.log(chalk.blue(`\n📂 Scaffolding project in ${targetDir}...`));

    // Copy Template
    const templateDir = path.join(__dirname, '../templates/base');
    await fs.copy(templateDir, targetDir);

    // Customize Database
    await customizeDatabase(targetDir, dbChoice);

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

    // Final touches
    const pkgPath = path.join(targetDir, 'package.json');
    const pkg = await fs.readJson(pkgPath);
    pkg.name = answers.projectName;

    // Database dependencies update
    if (dbChoice === 'MongoDB') {
        // Already set up
    } else if (dbChoice === 'PostgreSQL') {
        delete pkg.dependencies.mongoose;
        pkg.dependencies.pg = '^8.11.3';
        pkg.dependencies.typeorm = '^0.3.17';
        pkg.devDependencies['@types/pg'] = '^8.10.9';
    } else if (dbChoice === 'MSSQL') {
        delete pkg.dependencies.mongoose;
        pkg.dependencies.mssql = '^10.0.1';
    }

    await fs.writeJson(pkgPath, pkg, { spaces: 2 });

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

    console.log(chalk.bold.green('\n✅ Done. Now run:\n'));
    console.log(`  cd ${answers.projectName}`);
    console.log(`  npm install`);
    console.log(`  npm run dev\n`);
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
