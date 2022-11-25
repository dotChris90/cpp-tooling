/* eslint-disable unicorn/no-process-exit */
/* eslint-disable promise/catch-or-return */
import * as commander from 'commander';
import { TerminalInput } from './input-output/terminal-input';
import { TerminalOutput } from './input-output/terminal-output';
import { CppProjectSupport } from './tools/cpp-project-support';

const cli = new commander.Command();

cli.name("cps")
   .description("Deliver C/C++ project support")
   .version("0.0.4")

cli.command("init")
    .description("Init a C/C++ project")
    .addOption(new commander.Option("-n, --name <name>","name of project").default("","empty name"))
    .addOption(new commander.Option("-v, --version <version>","version of project"))
    .addOption(new commander.Option("-t, --template <template>","project template"))
    .addOption(new commander.Option("-p, --package-manager <pkg_mng>","which pkg manager (currently just conan)"))
    .addOption(new commander.Option("-d, --destination <dst>","destination of project"))
    .addOption(new commander.Option("-b, --build-system <build>","build system of project"))
    .addOption(new commander.Option("-a, --all","also install required tools if missing"))
    .action((options) => {
       const cpsObj = new CppProjectSupport(new TerminalInput(),new TerminalOutput());
       
       const name       = (options.name === undefined)          ? ""            : options.name;
       const version    = (options.version === undefined)       ? ""            : options.version;
       const template   = (options.template === undefined)      ? ""            : options.template;
       const pkgMng     = "conan";
       const dest       = (options.destination === undefined)   ? "" : options.destination;
       const build      = "cmake";
       const all        = (options.all === undefined)           ? true          : options.all;
       cpsObj.apiInitProject(
        name,
        version,
        pkgMng,
        template,
        build,
        dest,
        all
       ).then( () => process.exit()); 
    })

cli.parseAsync();
            