# @dhidroid/create-dhidroid-nodeapp

![CI](https://github.com/dhidroid/Dhidroid-nodejs-template/actions/workflows/ci.yml/badge.svg)
![NPM Version](https://img.shields.io/npm/v/@dhidroid/create-dhidroid-nodeapp)
![License](https://img.shields.io/npm/l/@dhidroid/create-dhidroid-nodeapp)

A robust, scalable, and production-ready Node.js backend generator. Scaffolds enterprise-level projects with TypeScript, Express, and MongoDB/SQL.

## Usage

Run the generator directly with npx:

```bash
npx @dhidroid/create-dhidroid-nodeapp@latest
```

Follow the interactive prompts to configure your project (Database, Docker, git hooks, etc).

## Features
- **Prompt-Based**: Asks for Project Name, Database (Mongo/PG/MSSQL), Docker, Git.
- **Templates**: Uses a base template (formerly the single-instance app) and modifies it on the fly.
- **Database Support**: Automatically switches database drivers and connection logic based on selection.
- **DevOps**: Conditionally includes Docker files and Husky git hooks.

## Documentation

Full documentation is available [here](https://dhidroid.github.io/Dhidroid-nodejs-template/).
