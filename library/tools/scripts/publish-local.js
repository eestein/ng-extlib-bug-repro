'use strict';

const shell = require('shelljs');
const chalk = require('chalk');
const distFolder = 'dist';
const samplesFolder = '../samples';
const libName = '@ng-repro';

// Impede a exibição de mensagens de log no console
shell.config.silent = true;

const version = shell.exec(`node -pe "require('./package.json').version"`).replace(/(\r\n\t|\n|\r\t)/gm, "");

// Reinicia a exibição de mensagens no console para fins de debug
shell.config.silent = false;

shell.echo(chalk.blue('##############################################################'));
shell.echo(chalk.blue('      Iniciando instalação da lib @ng-repro/sdk localmente      '));
shell.echo(chalk.blue(`      v${version}`));
shell.echo(chalk.blue('##############################################################'));
shell.echo('');

// Iniciando remoção da versão antiga
shell.echo(chalk.blue('Iniciando remoção da versão antiga...'));

// Mudando para a pasta samples
if (shell.cd(samplesFolder).code !== 0) {
    shell.echo(chalk.red('Erro: Pasta samples não existe.'));
    shell.exit(1);
}

// Removendo a versão antiga
if (shell.rm('-Rf', `node_modules/${libName}`).code !== 0) {
    shell.echo(chalk.red('Erro: Falha ao remover versão antiga.'));
    shell.exit(1);
}

shell.echo(chalk.green('Remoção da versão antiga finalizada.'));
shell.echo(chalk.white('---------------------------------------'));
shell.echo(chalk.blue(`Iniciando instalação da versão ${version}...`));

let tgzFiles = shell.find('../library/*.tgz');

// Verifica se o arquivo existe
if (tgzFiles.length < 1) {
    shell.echo(chalk.red('Erro: Arquivo da biblioteca não encontrado.'));
    shell.exit(1);
}

// Instala a nova versão
if (shell.exec(`npm install --save ${tgzFiles[0]}`).code !== 0) {
    shell.echo(chalk.red(`Erro: Não foi possível instalar a versão ${version}.`));
    shell.exit(1);
}

shell.echo(chalk.green(`Instalação da versão ${version} finalizada.`));
shell.echo('');
shell.echo(chalk.green('##############################################################'));
shell.echo(chalk.green('      Instalação finalizada. Nova versão pronta para uso.     '));
shell.echo(chalk.green(`      v${version}`));
shell.echo(chalk.green('##############################################################'));
