#!/usr/bin/env node

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'fs-extra';
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';
import { execa } from 'execa';
import validateNpmPackageName from 'validate-npm-package-name';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Template repository URL
const TEMPLATE_REPO = 'https://github.com/fabfog/hexagonal-react.git';
const TEMPLATE_BRANCH = 'main';

// For local testing: set LOCAL_TEMPLATE env var to the path of your template
const USE_LOCAL_TEMPLATE = process.env.LOCAL_TEMPLATE;
const LOCAL_TEMPLATE_PATH = USE_LOCAL_TEMPLATE
  ? path.resolve(USE_LOCAL_TEMPLATE)
  : path.resolve(__dirname, '../..');

async function ensurePnpmInstalled() {
  try {
    await execa('pnpm', ['--version'], { stdio: 'ignore' });
  } catch (error) {
    console.log(chalk.red('\n❌ Error: pnpm is not installed\n'));
    console.log(chalk.yellow('This project requires pnpm to work correctly.\n'));
    console.log(chalk.cyan('Install pnpm using one of these methods:\n'));
    console.log(chalk.gray('  # Using npm'));
    console.log(chalk.white('  npm install -g pnpm\n'));
    console.log(chalk.gray('  # Using Homebrew (macOS)'));
    console.log(chalk.white('  brew install pnpm\n'));
    console.log(chalk.gray('  # Using standalone script'));
    console.log(chalk.white('  curl -fsSL https://get.pnpm.io/install.sh | sh -\n'));
    console.log(chalk.gray('For more installation options, visit:'));
    console.log(chalk.blue('  https://pnpm.io/installation\n'));
    process.exit(1);
  }
}

async function main() {
  console.log(
    chalk.bold.cyan('\n🏗️  Create Hexagonal React Monorepo\n')
  );

  // Check if pnpm is installed
  await ensurePnpmInstalled();

  // Get project name from command line arg or prompt
  let projectName = process.argv[2];

  if (!projectName) {
    const response = await prompts({
      type: 'text',
      name: 'projectName',
      message: 'Project name:',
      initial: 'my-hexagonal-app',
      validate: (value) => {
        const validation = validateNpmPackageName(value);
        if (!validation.validForNewPackages) {
          const errors = [
            ...(validation.errors || []),
            ...(validation.warnings || []),
          ];
          return errors[0] || 'Invalid package name';
        }
        return true;
      },
    });

    if (!response.projectName) {
      console.log(chalk.red('\n❌ Project creation cancelled\n'));
      process.exit(1);
    }

    projectName = response.projectName;
  }

  // Validate project name
  const validation = validateNpmPackageName(projectName);
  if (!validation.validForNewPackages) {
    const errors = [
      ...(validation.errors || []),
      ...(validation.warnings || []),
    ];
    console.log(chalk.red(`\n❌ Invalid project name: ${errors[0]}\n`));
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), projectName);

  // Check if directory exists
  if (fs.existsSync(targetDir)) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: `Directory ${chalk.cyan(projectName)} already exists. Overwrite?`,
      initial: false,
    });

    if (!overwrite) {
      console.log(chalk.red('\n❌ Project creation cancelled\n'));
      process.exit(1);
    }

    await fs.remove(targetDir);
  }

  // Clone or copy template
  const spinner = ora(USE_LOCAL_TEMPLATE ? 'Copying template...' : 'Cloning template...').start();
  try {
    if (USE_LOCAL_TEMPLATE) {
      // Copy from local directory
      await fs.copy(LOCAL_TEMPLATE_PATH, targetDir, {
        filter: (src) => {
          // Exclude node_modules, .git, dist, .turbo, etc.
          const basename = path.basename(src);
          return !['node_modules', '.git', 'dist', '.turbo', '.next', 'create-hexagonal-react'].includes(basename);
        },
      });
      spinner.succeed('Template copied from local directory');
    } else {
      // Clone from GitHub
      await execa('git', [
        'clone',
        '--depth',
        '1',
        '--branch',
        TEMPLATE_BRANCH,
        TEMPLATE_REPO,
        targetDir,
      ]);

      // Remove .git directory
      await fs.remove(path.join(targetDir, '.git'));
      // Remove create-hexagonal-react directory
      await fs.remove(path.join(targetDir, 'create-hexagonal-react'));

      spinner.succeed('Template cloned');
    }
  } catch (error) {
    spinner.fail('Failed to clone/copy template');
    console.error(chalk.red(error.message));
    process.exit(1);
  }

  // Replace project name in files
  spinner.start('Customizing project...');
  try {
    await replaceProjectName(targetDir, projectName);
    spinner.succeed('Project customized');
  } catch (error) {
    spinner.fail('Failed to customize project');
    console.error(chalk.red(error.message));
    process.exit(1);
  }

  // Initialize git
  spinner.start('Initializing git...');
  try {
    await execa('git', ['init'], { cwd: targetDir });
    await execa('git', ['add', '.'], { cwd: targetDir });
    await execa(
      'git',
      ['commit', '-m', 'Initial commit from create-hexagonal-react'],
      { cwd: targetDir }
    );
    spinner.succeed('Git initialized');
  } catch (error) {
    spinner.fail('Failed to initialize git');
    console.error(chalk.red(error.message));
  }

  // Install dependencies
  const { install } = await prompts({
    type: 'confirm',
    name: 'install',
    message: 'Install dependencies?',
    initial: true,
  });

  if (install) {
    spinner.start('Installing dependencies...');
    try {
      await execa('pnpm', ['install'], {
        cwd: targetDir,
        stdio: 'inherit',
      });
      spinner.succeed('Dependencies installed');
    } catch (error) {
      spinner.fail('Failed to install dependencies');
      console.error(
        chalk.yellow(
          `\n⚠️  Please install dependencies manually:\n  cd ${projectName}\n  pnpm install\n`
        )
      );
    }
  }

  // Success message
  console.log(chalk.bold.green('\n✅ Project created successfully!\n'));
  console.log(chalk.cyan('Next steps:\n'));
  console.log(`  cd ${chalk.bold(projectName)}`);
  if (!install) {
    console.log(`  ${chalk.bold('pnpm install')}`);
  }
  console.log(`  ${chalk.bold('pnpm dev')}\n`);
  console.log(chalk.gray('Apps will be available at:'));
  console.log(chalk.gray('  • Next.js: http://localhost:3001'));
  console.log(chalk.gray('  • Vite:    http://localhost:3002\n'));
  console.log(chalk.yellow('📝 Demo code:\n'));
  console.log(chalk.gray('  The project includes a task manager demo to showcase the architecture.'));
  console.log(chalk.gray(`  You can play with it and then remove it with: ${chalk.bold('pnpm remove:demo')}\n`));
  console.log(chalk.yellow('🚀 Generate code:\n'));
  console.log(chalk.gray(`  Create new entities, commands, queries, and more with: ${chalk.bold('pnpm gen')}\n`));
}

async function replaceProjectName(targetDir, newName) {
  const filesToUpdate = [
    'package.json',
    'README.md',
    'apps/app-next/package.json',
    'apps/app-vite/package.json',
    'apps/app-vite/index.html',
  ];

  for (const file of filesToUpdate) {
    const filePath = path.join(targetDir, file);
    if (await fs.pathExists(filePath)) {
      let content = await fs.readFile(filePath, 'utf-8');
      content = content.replace(/@dxbox\/hexagonal-react/g, newName);
      await fs.writeFile(filePath, content, 'utf-8');
    }
  }
}

main().catch((error) => {
  console.error(chalk.red('\n❌ An error occurred:\n'));
  console.error(error);
  process.exit(1);
});
