import dotenv from "dotenv";
dotenv.config();

import { readFile, writeFile, mkdir, readdir, stat, unlink } from 'fs/promises';
import { createWriteStream } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import archiver from 'archiver';
import { join } from 'path';
import chalk from 'chalk';

const execAsync = promisify(exec);

const bumpVersion = (version) => {
  const [major, minor, patch] = version.split('.').map(Number);
  const nextPatch = patch + 1;
  const nextMinor = nextPatch > 9 ? minor + 1 : minor;
  const nextMajor = nextMinor > 9 ? major + 1 : major;
  const newPatch = nextPatch > 9 ? 0 : nextPatch;
  const newMinor = nextMinor > 9 ? 0 : nextMinor;
  return [nextMajor, newMinor, newPatch].join('.');
};

const createZipBuild = async (packageName, version) => {
  const buildsDir = join(process.cwd(), 'builds');
  
  try {
    await mkdir(buildsDir, { recursive: true });
  } catch (err) {
  }

  const zipFileName = `${packageName}-${version}.zip`;
  const zipPath = join(buildsDir, zipFileName);

  return new Promise((resolve, reject) => {
    const output = createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(chalk.green(`✓ Build ZIP created: ${zipFileName} (${archive.pointer()} bytes)`));
      resolve(zipPath);
    });

    archive.on('error', reject);
    archive.pipe(output);

    archive.glob('**/*', {
      ignore: [
        'node_modules/**',
        '.git/**',
        'README.md',
        '.gitignore',
        'package.json',
        'package-lock.json',
        'builds/**',
        '.env',
        '*.log',
        '.DS_Store',
        'Thumbs.db'
      ]
    });

    archive.finalize();
  });
};

const cleanOldBuilds = async (packageName) => {
  const buildsDir = join(process.cwd(), 'builds');
  
  try {
    const files = await readdir(buildsDir);
    const buildFiles = files
      .filter(file => file.startsWith(`${packageName}-`) && file.endsWith('.zip'))
      .map(async (file) => {
        const filePath = join(buildsDir, file);
        const stats = await stat(filePath);
        return {
          name: file,
          path: filePath,
          mtime: stats.mtime
        };
      });

    const resolvedFiles = await Promise.all(buildFiles);
    
    resolvedFiles.sort((a, b) => b.mtime - a.mtime);

    const filesToDelete = resolvedFiles.slice(3);
    
    for (const file of filesToDelete) {
      await unlink(file.path);
      console.log(chalk.yellow(`🗑️  Removed old build: ${file.name}`));
    }

    if (filesToDelete.length > 0) {
      console.log(chalk.blue(`Kept ${Math.min(3, resolvedFiles.length)} most recent builds`));
    }
  } catch (err) {
    console.error(chalk.red('Error cleaning old builds:'), err);
  }
};

const updateManifestVersion = async (newVersion) => {
  const manifestPath = join(process.cwd(), 'manifest.json');
  
  try {
    const manifestContent = await readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);
    
    const oldVersion = manifest.version;
    manifest.version = newVersion;
    
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
    console.log(`Manifest version: ${chalk.cyanBright(oldVersion)} → ${chalk.greenBright(newVersion)}`);
    
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(chalk.yellow('⚠️  manifest.json not found, skipping manifest update'));
      return false;
    }
    throw err;
  }
};

const updateVersionCommitAndPush = async () => {
  try {
    console.log(chalk.blue('Starting version bump...'));

    const pkgPath = join(process.cwd(), 'package.json');
    const pkgJson = await readFile(pkgPath, 'utf-8');
    const pkg = JSON.parse(pkgJson);

    const oldVersion = pkg.version;
    const newVersion = bumpVersion(oldVersion);
    pkg.version = newVersion;

    await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`Package version: ${chalk.cyanBright(oldVersion)} → ${chalk.greenBright(newVersion)}`);

    const manifestUpdated = await updateManifestVersion(newVersion);

    console.log(chalk.blue('Creating build ZIP...'));
    await createZipBuild(pkg.name, newVersion);

    console.log(chalk.blue('Cleaning old builds...'));
    await cleanOldBuilds(pkg.name);

    await execAsync('git add package.json');
    if (manifestUpdated) {
      await execAsync('git add manifest.json');
    }
    
    await execAsync(`git commit -m "chore: bump version to ${newVersion}"`);
    await execAsync(`git push origin ${process.env.BRANCH || 'master'}`);

    console.log(chalk.green(`✅ Version bumped, build created, committed, and pushed to "${process.env.BRANCH || 'master'}" branch`));
  } catch (err) {
    console.error(chalk.red('Error updating version:'), err);
  }
};

updateVersionCommitAndPush();