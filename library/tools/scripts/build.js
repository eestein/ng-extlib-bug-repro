'use strict';

const shell = require('shelljs');
const chalk = require('chalk');
const packageName = 'ng-repro-sdk';
const distFolder = 'dist';
const es2015Folder = `${distFolder}/esm2015`;
const es5Folder = `${distFolder}/esm5`;
const bundlesFolder = `${distFolder}/bundles`;
const es5OutputFolder = `${distFolder}/package/esm5`;

// Impede a exibição de mensagens de log no console
shell.config.silent = true;

const version = shell.exec(`node -pe "require('./package.json').version"`).replace(/(\r\n\t|\n|\r\t)/gm, "");

shell.echo(chalk.blue('##############################################################'));
shell.echo(chalk.blue('  Iniciando build e instalação da lib @ng-repro/sdk localmente  '));
shell.echo(chalk.blue(`  v${version}`));
shell.echo(chalk.blue('##############################################################'));
shell.echo('');

/**
 * Removendo arquivos da build anterior, se houver
 */
shell.echo(chalk.yellow('Removendo arquivos de build...'));

// Remove a pasta dist
shell.rm('-Rf', `./${distFolder}`);

// Verifica se existe um arquivo .tgz de uma build antiga
let tgzFiles = shell.find('*.tgz');

// Caso exista, remove o arquivo .tgz
if (tgzFiles.length > 0) {
    shell.rm('-Rf', `./${tgzFiles[0]}`);
}

shell.echo(chalk.yellow('Arquivos de build removidos.'));
shell.echo(chalk.white('---------------------------------------'));

// Reinicia a exibição de mensagens no console para fins de debug
shell.config.silent = false;

/**
 * Iniciando compilação
 */
shell.echo(chalk.blue('Iniciando compilação...'));

shell.mkdir('-p', `./${es2015Folder}`);
shell.mkdir('-p', `./${es5Folder}`);
shell.mkdir('-p', `./${bundlesFolder}`);

// TSLint com Codelyzer
// https://github.com/palantir/tslint/blob/master/src/configs/recommended.ts
// https://github.com/mgechev/codelyzer
shell.echo(chalk.blue('Iniciando TSLint...'));

if (shell.exec('tslint -p tslint.json -t stylish src/**/*.ts').code !== 0) {
    shell.echo(chalk.red('Erro: Falha no lint'));
    shell.exit(1);
}

shell.echo(chalk.green('TSLint finalizado.'));
shell.echo(chalk.white('---------------------------------------'));

// Compilação AoT
shell.echo(chalk.blue('Iniciando compilação AoT...'));

if (shell.exec('ngc -p src/tsconfig.lib.json').code !== 0) {
    shell.echo(chalk.red('Erro: Falha na compilação AoT'));
    shell.exit(1);
}

shell.echo(chalk.green('Compilação AoT finalizada.'));
shell.echo(chalk.white('---------------------------------------'));

// Empacotar
shell.echo(chalk.blue('Iniciando empacotamento...'));
shell.echo(chalk.blue('Rollup...'));

if (shell.exec(`rollup -c rollup.es.config.js -i ${distFolder}/${packageName}.js -o ${es2015Folder}/${packageName}.js`).code !== 0) {
    shell.echo(chalk.red('Erro: Falha no rollup'));
    shell.exit(1);
}

shell.echo(chalk.green('Rollup finalizado.'));
shell.echo(chalk.white('---------------------------------------'));

// Gerar versão ES5
shell.echo(chalk.blue('Gerando versão ES5...'));

if (shell.exec(`ngc -p src/tsconfig.es5.json --target es5 -d false --outDir ${es5OutputFolder} --importHelpers true --sourceMap`).code !== 0) {
    shell.echo(chalk.red('Erro: Falha ao gerar versão ES5'));
    shell.exit(1);
}

shell.echo(chalk.green('Build da versão ES5 finalizado.'));

// Fazendo rollup da versão ES5
shell.echo(chalk.blue('Rollup da versão ES5...'));

if (shell.exec(`rollup -c rollup.es.config.js -i ${es5OutputFolder}/${packageName}.js -o ${es5Folder}/${packageName}.js`).code !== 0) {
    shell.echo(chalk.red('Erro: Falha ao gerar versão ES5'));
    shell.exit(1);
}

shell.echo(chalk.green('Rollup da versão ES5 finalizado.'));

// Converter rollup em pacote
shell.echo(chalk.blue('Convertendo rollup em pacote UMD...'));

if (shell.exec(`rollup -c rollup.config.js -i ${es5Folder}/${packageName}.js -o ${bundlesFolder}/${packageName}.umd.js`).code !== 0) {
    shell.echo(chalk.red('Erro: Falha ao converter rollup em pacote'));
    shell.exit(1);
}

shell.echo(chalk.green('Pacote UMD gerado.'));
shell.echo(chalk.green('Versão ES5 gerada.'));
shell.echo(chalk.white('---------------------------------------'));

// Minificando
shell.echo(chalk.blue('Minificando...'));
shell.cd(`${bundlesFolder}`);

if (shell.exec(`uglifyjs ${packageName}.umd.js -c --comments -o ${packageName}.umd.min.js --source-map "filename='${packageName}.umd.min.js.map', includeSources"`).code !== 0) {
    shell.echo(chalk.red('Erro: Falha ao minificar'));
    shell.exit(1);
}

shell.echo(chalk.green('Minificar finalizado.'));
shell.echo(chalk.white('---------------------------------------'));

// Remover arquivos desnecessários para pacote
shell.echo(chalk.blue('Removendo arquivos desnecessários...'));

// Voltando para a raiz
shell.cd('../..');

// Removendo arquivos desnecessários
shell.rm('-Rf', `${distFolder}/package`);
shell.rm('-Rf', `${distFolder}/node_modules`);
shell.rm('-Rf', `${distFolder}/*.js`);
shell.rm('-Rf', `${distFolder}/*.js.map`);
shell.rm('-Rf', `${distFolder}/src/**/*.js`);
shell.rm('-Rf', `${distFolder}/src/**/*.js.map`);

shell.echo(chalk.green('Remoção finalizada.'));
shell.echo(chalk.white('---------------------------------------'));

// Copiar arquivos de metadados
shell.echo(chalk.blue('Copiando arquivos de metadados...'));

if (shell.cp('-Rf', ['package.json', 'LICENSE.md', 'README.MD'], `${distFolder}`).code !== 0) {
    shell.echo(chalk.red('Erro: Falha ao copiar arquivos de metadados'));
    shell.exit(1);
}

shell.echo(chalk.green('Cópia finalizada.'));
shell.echo(chalk.white('---------------------------------------'));
shell.echo(chalk.blue('Iniciando pack da biblioteca...'));

// Faz o pack da biblioteca - gera arquivo tgz
if (shell.exec(`npm pack ./${distFolder}`).code !== 0) {
    shell.echo(chalk.red('Erro: Falha ao gerar pacote tgz.'));
    shell.exit(1);
}

shell.echo(chalk.green('Pack finalizado.'));
shell.echo('');
shell.echo(chalk.green('##############################################################'));
shell.echo(chalk.green('      Build finalizada. Nova versão pronta para instalar.     '));
shell.echo(chalk.green(`      v${version}`));
shell.echo(chalk.green('##############################################################'));
shell.echo('');
