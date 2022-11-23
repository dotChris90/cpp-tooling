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
    .addOption(new commander.Option("-v, --version <version>","version of project").default("","empty version"))
    .addOption(new commander.Option("-t, --template <template>","project template").default("default","default template (conan)"))
    .addOption(new commander.Option("-p, --package-manager <pkg_mng>","which pkg manager (currently just conan)").default("conan","conan the only choice currently"))
    .addOption(new commander.Option("-d, --destination <dst>","destination of project").default("","empty path"))
    .addOption(new commander.Option("-b, --build-system <build>","build system of project").default("cmake","cmake the only choice currently"))
    .addOption(new commander.Option("-a, --all","also install required tools if missing"))
    .action((options) => {
       const cpsObj = new CppProjectSupport(new TerminalInput(),new TerminalOutput());
       cpsObj.apiInitProject(); 
    })

cli.parse();
            