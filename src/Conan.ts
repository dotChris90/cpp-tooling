/* eslint-disable class-methods-use-this */
/* eslint-disable unicorn/prefer-ternary */
/* eslint-disable unicorn/prefer-string-slice */
/* eslint-disable no-plusplus */
/* eslint-disable arrow-body-style */
/* eslint-disable unicorn/no-array-for-each */
/* eslint-disable unicorn/prefer-negative-index */
/* eslint-disable unicorn/prefer-spread */
/* eslint-disable unicorn/import-style */
import * as fse from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

import {Executor} from './executor';
import { InvalidDirError } from './Error/wrong-dir-error';

export class Conan {

    private exec : Executor;
    
    constructor(
        exec : Executor
    ) {
        this.exec = exec;
    }

    public createNewPkg(
        pkgName: string,
        version: string, 
        templateName = "default",
        outputDir = "") : Promise<void> {
        const outputDir2 = (outputDir === "") ? path.join(process.cwd(),pkgName) : outputDir;
        const cmd = "conan";
        const args = [
            "new",
            `${pkgName}/${version}`,
            "-m",
            templateName
        ];
        return this.exec.execAsync(cmd, args, outputDir2);
    }

    public getProfiles(

    ) : string[] {
        const cmd = "conan";
        const args = [
            "profile",
            `list`,
        ];
        const profiles = this.exec.execSyncGetFormatStdout(cmd, args);
        return (["default"].concat(profiles.filter(text => text !== 'default')));
    }

    public async getProjectPackagesRecursive(
        conanfileDir : string,

    ) : Promise<string[]> {
        const packageDot = path.join(
            fse.mkdtempSync(path.join(os.tmpdir(), 'cpp-tooling-')),
            "package.dot"
        );
        const cmd = "conan";
        const args = [
            "info",
            `${conanfileDir}`,
            "-g",
            `${packageDot}`
        ];
        this.exec.execSync(cmd,args);
        const diagraph = fse.readFileSync(packageDot).toString().split("\n");
        fse.removeSync(packageDot);
        diagraph.splice(0,1);
        diagraph.splice(diagraph.length-1,1);
        diagraph.splice(diagraph.length-1,1);
        const packages = new Set<string>();
        diagraph.forEach( line => {
            const buffer = line.split("->");
            const leftPackage = buffer[0].trim();
            const rightPackage = buffer[1].trim();
            packages.add(leftPackage);
            packages.add(rightPackage);
        });
        const packagesArray = Array.from(packages.values());
        const idx = packagesArray.findIndex(package_idx => {
            return package_idx.startsWith('"conanfile.py (')
        });
        packagesArray.splice(idx,1);
        for (let jdx = 0; jdx < packagesArray.length; jdx++) {
            packagesArray[jdx] = packagesArray[jdx].replace('"','').replace('"','');
        }
        return packagesArray;
    }
    
    public async geneneratePackageTree(
        conanfile: string, 
        dstFile: string) : Promise<void> {
        const cmd = "conan";
        const args = [
            "info",
            conanfile,
            "-g",
            `${dstFile}`
        ];
        return this.exec.execAsync(cmd, args);
    }

    public install(
        buildProfile: string,
        hostProfile: string,
        buildType: string,
        conanfileDir : string,
        installDir : string) : Promise<void> {
        
        if (!fse.readdirSync(conanfileDir).includes("conanfile.py")) {
            throw new InvalidDirError("conanfileDir does not contain conanfile.py.");
        }
        if (!fse.existsSync(installDir)) {
            throw new InvalidDirError("installDir does not exist.");
        }

        const cmd = "conan";
        const args = [
            "install",
            `-pr:h=${hostProfile}`,
            `-pr:b=${buildProfile}`,
            `-s build_type=${buildType}`,
            conanfileDir,
            '--build=missing'
        ];
        return this.exec.execAsync(cmd, args, installDir);
    }

    public installAsDeployment(
        buildProfile: string,
        hostProfile: string,
        buildType: string,
        conanfileDir : string,
        installDir : string) : Promise<void> {

        if (!fse.readdirSync(conanfileDir).includes("conanfile.py")) {
            throw new InvalidDirError("conanfileDir does not contain conanfile.py.");
        }
        if (!fse.existsSync(installDir)) {
            throw new InvalidDirError("installDir does not exist.");
        }
    
        const cmd = "conan";
        const args = [
            "install", 
            "-g",
            "deploy",
            `-pr:h=${hostProfile}`,
            `-pr:b=${buildProfile}`,
            `-s build_type=${buildType}`,
            conanfileDir,
            '--build=missing'
        ];
        return this.exec.execAsync(cmd, args, installDir);
    }

    public installPackageAsDeployment(
        pkgName: string,
        version: string,
        installDir: string) : Promise<void> {
        
        if (!fse.existsSync(installDir)) {
            throw new InvalidDirError("installDir does not exist.");
        }

        const cmd = "conan";
        const args = [
            "install",
            "-g",
            "deploy",
            `${pkgName}/${version}@_/_`,
            "--build=missing"
        ];
        return this.exec.execAsync(cmd,args,installDir);
    }

    public build(
        conanfileDir : string, 
        buildDir: string) : Promise<void> {
    
        if (!fse.existsSync(conanfileDir)) {
            throw new InvalidDirError("conanfileDir does not exist.");
        }
        if (!fse.existsSync(buildDir)) {
            throw new InvalidDirError("buildDir does not exist.");
        }

        const cmd = "conan";
        const args = [
            "build",
            conanfileDir
        ];
        return this.exec.execAsync(cmd, args, buildDir);
    }

    public create(
        buildProfile: string,
        hostProfile: string,
        buildType: string,
        conanfileDir : string) : Promise<void> {

        if (!fse.existsSync(conanfileDir)) {
            throw new InvalidDirError("conanfileDir does not exist.");
        }
    
        const cmd = "conan";
        const args = [
            "create",
            `-pr:h=${hostProfile}`,
            `-pr:b=${buildProfile}`,
            `-s build_type=${buildType}`,
            conanfileDir,
            '--build=missing'
        ];

        const workDir = process.cwd();

        return this.exec.exec(cmd, args, workDir);
    }

    public async getPkgDependencies(
        pkgName : string, 
        version : string) : Promise<string[]> {
        
        const cmd = "conan";
        const args = [
                "info",
                `${pkgName}/${version}@_/_`,
                "-n",
                "requires"
            ];

        const workDir = process.cwd();
        
        const out = this.exec.execSyncGetFormatStdout(cmd,args,workDir);   
        let pkgIdx = out.indexOf(`${pkgName}/${version}`) + 2; 
        const packages = [];
        while (pkgIdx < out.length) {
            if (!out[pkgIdx+1].startsWith(' ')) {
                packages.push(out[pkgIdx].trim().trimEnd());
                break;
            } 
            packages.push(out[pkgIdx].trim().trimEnd());
            pkgIdx++;
        }                        
        return packages;
    }

    public async getProjectRequirementsSync(projDir : string) {

        let pkgName = this.getNameSync(".",projDir);
        let version = this.getVersionSync(".",projDir);
        let cmd = "conan";
        let args = [
                "info",
                ".",
                "-n",
                "requires"
            ];
        let out = await this.exec.execWithResult(cmd,args,projDir);   
        let pkgIdx = out.indexOf(`conanfile.py (${pkgName}/${version})`) + 2; 
        let packages = [];
        while (pkgIdx < out.length) {
            packages.push(out[pkgIdx].trim().trimEnd());
            pkgIdx++;
        }                        
        return packages;
    }

    public inspectPkg(
        pkgName : string,
        version : string) : string[] {
        const cmd = "conan";
        const args = [
            "inspect",
            `${pkgName}/${version}@_/_`
        ];
        const workDir = process.cwd();
        return this.exec.execSyncGetFormatStdout(cmd,args,workDir);
    }

    public inspectConanfile(
        conanfileDir : string) : string[] {
        const cmd = "conan";
        const args = [
            "inspect",
            `${conanfileDir}`
        ];
        const workDir = process.cwd();
        return this.exec.execSyncGetFormatStdout(cmd,args,workDir);
    }

    public async getPkgNameAsync(
        conanFile : string) : Promise<string> {

        const cmd = "conan";
        const args = [
            "inspect",
            "-a",
            "name",
            `${conanFile}`,
        ];
        const workDir = process.cwd();
        const pkgNameArray = await this.exec.execAsyncGetFormatStdout(cmd, args, workDir);
        const pkgName= pkgNameArray[0].substring(6);
        return pkgName;
    }

    public async getPkgVersionAsync(
        conanfileDir : string) : Promise<string> {
        const cmd = "conan";
        const args = [
            "inspect",
            "-a",
            "version",
            `${conanfileDir}`,
        ];
        const workDir = process.cwd();
        const versionArray = await this.exec.execAsyncGetFormatStdout(cmd, args, workDir);
        const version = versionArray[0].substring(9);
        return `${version}`;
    }
    
    public search(
        pattern : string,
        query = "") : string[] {
        const cmd = "conan";
        let args : string[] = [];
        if (query === "") {
            args = [
                "search",
                `${pattern}`,
                "-r",
                "all"
            ];
        }
        else {
            args = [
                "search",
                `${pattern}`,
                `-q '${query}'`,
                "-r",
                "all"
            ];
        }
        
        const result = this.exec.execSyncGetFormatStdout(cmd,args);
        const results2 = [];
        for(let idx = 3;idx <result.length;idx++)
            results2.push(result[idx]);
        return results2;
    }

    public getTemplates() : string[] {
        const templateDir = path.join(
                os.homedir(),
                ".conan",
                "templates",
                "command",
                "new"
        );
        return fse.readdirSync(templateDir);
    }

    public isPkgLocalPresent(
        packageName : string) : boolean  {
        const cmd = "conan";
        const args = [
            "search",
            `${packageName}`
        ];
        const anwser = this.exec.execSyncGetFormatStdout(cmd,args).join("\n");
        return !(anwser.startsWith("There are no packages matching the"));
    }

    public async getPackageTargets(
        packageName : string,
        outFile : string
    ) : Promise<Map<string,string[]>> {
        let conanfilePath = path.join(fse.mkdtempSync(path.join(os.tmpdir(), 'targetDetermination-')),"conanfile.py");
        let randomPkgName = path.basename(path.dirname(conanfilePath));

       let outMap : Map<string,string[]> = new  Map<string,string[]>();
       let conanfileContent = `from json import tool
from conans import ConanFile
from conans import tools
from conan.tools.cmake import CMakeToolchain, CMake, CMakeDeps
from conan.tools.layout import cmake_layout
        
class AbcConan(ConanFile):
        
    name = "BLABLABLA"
    version = "0.0.1"
    license = "<Put the package license here>"
    author = "<Put your name here> <And your email here>"
    url = "<Package recipe repository url here, for issues about the package>"
    description = "<Description of Abc here>"
    topics = ("<Put some tag here>", "<here>", "<and here>")
    settings = "os", "compiler", "build_type", "arch"
    options = {"shared": [True, False], "fPIC": [True, False]}
    default_options = {"shared": False, "fPIC": True}
    exports_sources = "CMakeLists.txt", "src/*"
        
    def config_options(self):
        if self.settings.os == "Windows":
            del self.options.fPIC
        
    def requirements(self):
        self.requires("BLUBLU")
        
    def layout(self):
        cmake_layout(self)
        
    def generate(self):
        tc = CMakeToolchain(self)
        tc.generate()
        cmake = CMakeDeps(self)
        cmake.generate()
        
    def build(self):
        cmake = CMake(self)
        cmake.configure()
        cmake.build()
        
    def package(self):
        cmake = CMake(self)
        cmake.install()
        
    def package_info(self):
        self.cpp_info.libs = tools.collect_libs(self)`.replace("BLABLABLA",randomPkgName)
                                                      .replace("BLUBLU",packageName);
            fse.writeFileSync(conanfilePath,conanfileContent);
            let buildDir = path.join(path.dirname(conanfilePath),"build");
            fse.mkdirpSync(buildDir);

            let cmd = "conan";
            let args = [
                "install",
                "-pr:h=default",
                "-pr:b=default",
                ".."
            ];
            await this.exec.exec(cmd,args,buildDir);
            let targetFiles = fse.readdirSync(path.join(buildDir,"generators"))
                                 .filter(file => file.endsWith("Targets.cmake"));
            
            let targets = [];    
            
            for(var idx = 0; idx < targetFiles.length;idx++) {
                
                let targetFile = targetFiles[idx];
                targetFile = path.basename(targetFile);
                targetFile = targetFile.substring(0,targetFile.length-"Targets.cmake".length);
        
                let cmakefileContent = `cmake_minimum_required(VERSION 3.15)
project(abc CXX)
find_package(BLABLA REQUIRED)`.replace("BLABLA",targetFile);

                let cmakefilePath = path.join(path.dirname(buildDir),"CMakeLists.txt");
                fse.writeFileSync(cmakefilePath,cmakefileContent);
                args = [
                    "build",
                    ".."
                ];
                let target_jdx = "";
                let targets_idx : string[] = [];
                let results = await this.exec.execWithResult(cmd,args,buildDir);
                for(var jdx =0; jdx < results.length; jdx++) {
                    if (results[jdx].startsWith('-- Conan: Target declared ')) {
                        target_jdx = results[jdx].replace('-- Conan: Target declared ','')
                                                 .replaceAll("'","");
                        targets_idx.push(target_jdx);
                        targets.push(target_jdx);
                    }
                    else if (results[jdx].startsWith('-- Conan: Component target declared ')) {
                        target_jdx = results[jdx].replace('-- Conan: Component target declared ','')
                                                 .replaceAll("'","");
                        targets_idx.push(target_jdx);
                        targets.push(target_jdx);
                    }
                    else {
                        // pass
                    }
                }
                outMap.set(targetFile,targets_idx);
            }

            let targets_txt_content = `targets of package '${packageName}' \n`;
            if (outFile != "") {
                let targets_txt_file = outFile;

                for(var idx = 0; idx < targets.length;idx++) {
                    targets_txt_content = targets_txt_content + "- " + targets[idx] + " \n";
                }
                
                fse.writeFileSync(targets_txt_file,targets_txt_content);
            }
            // tidy up --> remove tmp conan package dir
            fse.removeSync(path.dirname(conanfilePath));

            return outMap;
    }

    public async getProjectTargets(
        prjRoot : string,
        outDir : string = "",
    ) : Promise<Map<string,string[]>> {
        let outMap : Map<string,string[]> = new Map<string,string[]>();
        let packages = await this.getProjectPackagesRecursive(prjRoot);
        for (var idx = 0; idx < packages.length;idx++) {
            let package_idx = packages[idx];
            let outMap_ = new Map<string,string[]>();
            if (outDir != "") {
                let outFile = path.join(outDir,"targets_" + package_idx.replaceAll("/","_").replaceAll(".","_") + ".txt");
                outMap_ = await this.getPackageTargets(package_idx,outFile);
            }
            else {
                outMap_ = await this.getPackageTargets(package_idx,"");
            }
            outMap = new Map([...Array.from(outMap.entries()), ...Array.from(outMap_.entries())]);
        };
        return outMap;
    }

}