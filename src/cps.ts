/* eslint-disable unicorn/import-style */
/* eslint-disable unicorn/no-process-exit */
/* eslint-disable promise/catch-or-return */
import * as commander from 'commander';
import * as path from 'path';

import { CppProjectSupport } from './tools/cpp-project-support';


const cli = new commander.Command();

const defaultCpsFile    = path.join(process.cwd(),"cps.yml");
const defaultImport     = path.join(path.dirname(defaultCpsFile),".cps","pkg");
const defaultHeader     = path.join(path.dirname(defaultImport),"include");
const defaultBuild      = path.join(defaultCpsFile,"build");

cli.name("cps")
   .description("Deliver C/C++ project support")
   .version("0.0.4")

cli.command("init")
    .description("Init a C/C++ project")
    .addOption(new commander.Option("-n, --name <name>","name of project").default("",""))
    .addOption(new commander.Option("-v, --version <version>","version of project").default("",""))
    .addOption(new commander.Option("-t, --template <template>","project template").default("",""))
    .addOption(new commander.Option("-p, --package-manager <pkg_mng>","which pkg manager (currently just conan)").default("conan","conan"))
    .addOption(new commander.Option("-d, --destination <dst>","destination of project").default("",""))
    .addOption(new commander.Option("-b, --build-system <build>","build system of project").default("cmake","cmake"))
    .addOption(new commander.Option("-a, --all","also install required tools if missing").default(true,"true"))
    .action((options) => {
       CppProjectSupport.createTerminalBased().apiInitProject(
        options.name,
        options.version,
        options.packageManager,
        options.template,
        options.buildSystem,
        options.destination,
        options.all
       ).then( () => process.exit()); 
    })


cli.command("install")
    .description("Install packages to C/C++ project")
    .addOption(new commander.Option("--project <cpsFile>","project file").default("",""))
    .addOption(new commander.Option("--profile <profile>","conan profile").default("",""))
    .addOption(new commander.Option("--build-type <buildType>","Debug or Release").default("",""))
    .addOption(new commander.Option("--buildDst <buildFolder>","install destination").default("",""))
    .addOption(new commander.Option("--import","import package content e.g. headers to build").default(true,"yes import"))
    .addOption(new commander.Option("--importDst <buildFolder>","import destination").default("",""))
    .addOption(new commander.Option("--header","create Header directory").default(true,"yes"))
    .addOption(new commander.Option("--headerDst","header destination").default("",defaultHeader))
    .addOption(new commander.Option("--includeTest","include Test").default(true,""))
    .action(( option) => {
        CppProjectSupport.createTerminalBased().apiInstallPkgs(
            option.project,
            option.profile,
            option.buildType,
            option.buildDst,
            option.import,
            option.importDst,
            option.header,
            option.headerDst,
            option.includeTest
        ).then( () => process.exit());
    });

cli.parseAsync();
            