/* eslint-disable unicorn/import-style */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
import * as fse from 'fs-extra';
import * as path from 'path';
import '@dotchris90/utils-extensions';
import { CPSConfig } from '../config/cps-config';
import { Option } from '../config/option';
import { Package } from '../config/package';
import { InvalidPathError } from '../Error/wrong-dir-error';
import { Executable } from '../config/executable';
import { Library } from '../config/library';

export class CPSConfigManager {
    
    protected filePath : string;

    protected config : CPSConfig;

    constructor(filePath : string) {
        this.filePath = filePath;
    }

    protected rmDuplicateOptions() : void {
        this.config.options= this.config.options.copyAsSet().copyAsArray();
    }

    protected rmDuplicatePkgs() : void {
        this.config.packages= this.config.packages.copyAsSet().copyAsArray();
    }

    protected rmDuplicateExes() : void {
        this.config.executables= this.config.executables.copyAsSet().copyAsArray();
    }

    protected rmDuplicateLibs() : void {
        this.config.libraries= this.config.libraries.copyAsSet().copyAsArray();
    }

    protected rmDuplicates() : void {
        this.rmDuplicateExes();
        this.rmDuplicateLibs();
        this.rmDuplicateOptions();
        this.rmDuplicatePkgs();
    }

    public generateCPSFile() : void {
        const cpsFile = path.join(
            __filename,
            "..",
            "..",
            "Templates",
            "cps.yml"
            );
        const content = fse.readFileSync(cpsFile,{encoding:'utf8'});
        fse.writeFileSync(this.filePath,content);
    }

    public getCPSFileLocation() : string {
        return this.filePath;
    }

    public getTargetNames() : string[] {
        const targets = [];
        for(const lib of this.config.libraries)
            targets.push(lib.name);
        for(const exe of this.config.executables)
            targets.push(exe.name);
        return targets;
    }

    public getTarget(name : string) : Library | Executable {
        let targetFound = false;
        let target : Library | Executable;
        for(const lib of this.config.libraries)
            if (lib.name === name) {
                targetFound = true;
                target = lib;
                break;
            }
        if (!targetFound) {
            for(const exe of this.config.executables)
                if (exe.name === name) {
                    target = exe;
                    break;
                }
        }
        return target;
    }

    public parse() : void {
        if (fse.existsSync(this.filePath)) {
            this.config = CPSConfig.createFromYMLFile(this.filePath);
            this.rmDuplicates();
        }
        else {
            throw new InvalidPathError(`config file ${this.filePath} does not exist`);
        }
    }

    public parseFromFile(filePath : string) : void {
        if (fse.existsSync(filePath)) {
            this.filePath = filePath;
            this.parse();
        }
        else {
            throw new InvalidPathError(`config file ${filePath} does not exist`);
        }
    }

    public writeToFile(filePath : string) : void {
        CPSConfig.writeToYMLFile(filePath,this.config);
    }

    public addOption(
        name : string,
        values : string[],
        defaultValue : string) : void {
            
        const option = new Option();
        option.name = name;
        option.values = values;
        option.default = defaultValue;

        let isPresent = false;

        for(const opt of this.config.options) {
            if (opt.name === name) {
                isPresent = true;
                break;
            }
            else {
                // pass 
            }
        }
        if (!isPresent)
            this.config.options.push(option);
    }

    public addPkg(
        name : string, 
        version : string,
        type = "conan",
        options = new Map<string,string>()) : void {
            
        const newPackage = new Package();
        newPackage.name = name;
        newPackage.version = version;
        newPackage.type = type;
        newPackage.options = options;

        let isPresent = false;

        for(const pkg of this.config.packages) {
            if (pkg.name === name) {
                isPresent = true;
                break;
            }
            else {
                // pass 
            }
        }
        if (!isPresent)
            this.config.packages.push(newPackage);
    }

    public addExe(
        name : string, 
        srcs : string[],
        req : string[]) : void {
            
        const exe = new Executable();
        exe.name = name;
        exe.req = req;
        exe.src = srcs;

        let isPresent = false;

        for(const exeIdx of this.config.executables) {
            if (exeIdx.name === name) {
                isPresent = true;
                break;
            }
            else {
                // pass 
            }
        }
        if (!isPresent)
            this.config.executables.push(exe);
    }

    public addSrcs2Target(
        name : string,
        srcs : string[]) : void {
            const target = this.getTarget(name);
            for(const src of srcs)
                target.src.push(src);
            target.src = target.src.copyAsSet().copyAsArray();
        }

    public rmSrcsFromTarget(
        name : string,
        srcs : string[]) : void {
            const target = this.getTarget(name);
            const srcSet = target.src.copyAsSet();
            srcSet.delArray(srcs);
            target.src = srcSet.copyAsArray();
    }

    public addSrcs2Exe(
        name : string,
        srcs : string[]) : void {
        
        for(const exeIdx of this.config.executables) {
            if (exeIdx.name === name)
                for(const srcIdx of srcs) {
                    if (!exeIdx.src.includes(srcIdx))
                        exeIdx.src.push(srcIdx);
                break;
            }
            else {
                // pass 
            }
        }
    }

    public addReqs2Exe(
        name : string,
        reqs : string[]) : void {
        
        for(const exeIdx of this.config.executables) {
            if (exeIdx.name === name)
                for(const reqIdx of reqs) {
                    if (!exeIdx.req.includes(reqIdx))
                        exeIdx.req.push(reqIdx);
                break;
            }
            else {
                // pass 
            }
        }
    }

    public rmExe(name : string) : void {
        for(let idx = 0; idx < this.config.executables.length;idx++)
            if (this.config.executables[idx].name === name) {
                this.config.executables.splice(idx,1); 
                break;
            }
    }

    public rmSrcsFromExe(
        name : string,
        srcs : string[]) : void {
            for(const exeIdx of this.config.executables)
                if (exeIdx.name === name) {
                    const srcsSet = exeIdx.src.copyAsSet();
                    srcsSet.delArray(srcs);
                    exeIdx.src = srcsSet.copyAsArray();
                }   
    }
    
    public rmReqsFromExe(
        name : string,
        reqs : string[]) : void {
            for(const exeIdx of this.config.executables)
                if (exeIdx.name === name) {
                    const reqsSet = exeIdx.req.copyAsSet();
                    reqsSet.delArray(reqs);
                    exeIdx.req = reqsSet.copyAsArray();
                }   
    }     
    
    public addLib(
        name : string, 
        srcs : string[],
        incs : string[],
        reqs : string[]) : void {
            
        const lib = new Library();
        lib.name = name;
        lib.req = reqs;
        lib.src = srcs;
        lib.inc = incs;

        let isPresent = false;

        for(const libIdx of this.config.libraries) {
            if (libIdx.name === name) {
                isPresent = true;
                break;
            }
            else {
                // pass 
            }
        }
        if (!isPresent)
            this.config.libraries.push(lib);
    }

    public addSrcs2lib(
        name : string,
        srcs : string[]) : void {
        
        for(const libIdx of this.config.libraries) {
            if (libIdx.name === name)
                for(const srcIdx of srcs) {
                    if (!libIdx.src.includes(srcIdx))
                        libIdx.src.push(srcIdx);
                break;
            }
            else {
                // pass 
            }
        }
    }

    public addReqs2Lib(
        name : string,
        reqs : string[]) : void {
        
        for(const libIdx of this.config.libraries) {
            if (libIdx.name === name)
                for(const reqIdx of reqs) {
                    if (!libIdx.req.includes(reqIdx))
                        libIdx.req.push(reqIdx);
                break;
            }
            else {
                // pass 
            }
        }
    }

    public addIncs2Lib(
        name : string,
        incs : string[]) : void {
        
        for(const libIdx of this.config.libraries) {
            if (libIdx.name === name)
                for(const incIdx of incs) {
                    if (!libIdx.req.includes(incIdx))
                        libIdx.req.push(incIdx);
                break;
            }
            else {
                // pass 
            }
        }
    }

    public rmLib(name : string) : void {
        for(let idx = 0; idx < this.config.libraries.length;idx++)
            if (this.config.libraries[idx].name === name) {
                this.config.libraries.splice(idx,1); 
                break;
            }
    }

    public rmSrcsFromLib(
        name : string,
        srcs : string[]) : void {
            for(const libIdx of this.config.libraries)
                if (libIdx.name === name) {
                    const srcsSet = libIdx.src.copyAsSet();
                    srcsSet.delArray(srcs);
                    libIdx.src = srcsSet.copyAsArray();
                }   
    }

    public rmIncsFromLib(
        name : string,
        incs : string[]) : void {
            for(const libIdx of this.config.libraries)
                if (libIdx.name === name) {
                    const incSet = libIdx.inc.copyAsSet();
                    incSet.delArray(incs);
                    libIdx.inc = incSet.copyAsArray();
                }   
    }
    
    public rmReqsFromLib(
        name : string,
        reqs : string[]) : void {
            for(const libIdx of this.config.libraries)
                if (libIdx.name === name) {
                    const reqsSet = libIdx.req.copyAsSet();
                    reqsSet.delArray(reqs);
                    libIdx.req = reqsSet.copyAsArray();
                }   
    }     

    public rmOption(
        name : string) : void {
            let index = -1;
            for(let idx = 0; idx < this.config.options.length;idx++) {
                if (this.config.options[idx].name === name) {
                    index = idx;
                    break;
                }
            }
            if (index !== -1) {
                this.config.options.splice(index,1);
            }
        }
    

        
    public rmPkg(
        name : string) : void {
            let index = -1;
            for(let idx = 0; idx < this.config.packages.length;idx++) {
                if (this.config.packages[idx].name === name) {
                    index = idx;
                    break;
                }
            }
            if (index !== -1) {
                this.config.packages.splice(index,1);
            }
        }
}