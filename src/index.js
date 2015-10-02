/* Copyright (c) 2015 Intel Corporation. All rights reserved.
* Use of this source code is governed by a MIT-style license that can be
* found in the LICENSE file.
*/

/* global process */
/* global console */
/* global __dirname */
/* global module */

/**
 *
 */

"use strict";

var path=require("path");
var fs=require("fs");
var cvmFolder=".cvm";
var rimraf=require("rimraf");

var isWin=(process.platform === "win32");

function getUserHome() {
  return process.env[isWin ? "USERPROFILE" : "HOME"];
}

function getCVMPath() {
    return path.join(getUserHome(),cvmFolder);
}



var CVMPath=getCVMPath();
var CLIBanner=""+
"Cordova Version Manager"+
"\n"+
"Usage: cvm task args\n"+
"============================\n\n";

var cliCommands="Available Tasks:\n\n"+
"       list - list available covdova versions installed\n"+
"       install [5.1.1] - Install a cordova version\n"+
"       uninstall [5.1.1] - Uninstall a cordova version\n"+
"       use [5.1.1] - Switch to a specific version of cordova\n"+
"       version - Show current version of Cordova\n"+
"       remote - List available remote versions of cordova to install\n\n"+
"       --- remember to add the following to your shell profile --\n"+
"       export PATH=\"$HOME/.cvm:$PATH\"";






var CVMCLI = {
    run:function(cliArgs){
        var version,thePath,exec,child;
        //parse the command line arguments

        //Check setup

        if(!cliArgs||cliArgs.length===0){
            return console.log(CLIBanner+cliCommands);
        }
        else {
            var cmd=cliArgs[0].toLowerCase();
            if(!this.checkCVMSetup()){
                return;
            }
            if(cmd==="list"){


                var items=this.cvminstalls();
                if(items.length===0){
                    console.log("No versions installed");
                }
                else {
                    items.forEach(function(version){
                        console.log(version);
                    });
                }
                return;
            }
            else if(cmd==="install"){
                version=cliArgs[1];
                thePath=path.join(CVMPath,version);
                if(fs.existsSync(thePath)){
                    console.log("Version already installed");
                    return;
                }
                else {
                    fs.mkdirSync(thePath);
                    console.log("Installing Cordova "+version);
                    exec = require("child_process").exec;

                    child = exec("npm install cordova@"+version+" --prefix "+thePath ,
                        function (error, stdout) {
                         if (error !== null) {
                            console.log("exec error: " + error);
                            rimraf(thePath,function(){
                                console.log("Folder removed");
                            });
                         }
                         else {
                            console.log("Cordova "+version+" installed");
                            console.log(stdout);
                         }
                    });
                }
            }
            else if(cmd==="uninstall"){
                version=cliArgs[1];
                thePath=path.join(CVMPath,version);
                if(!fs.existsSync(thePath)){
                    console.log("Version not found");
                    return;
                }
                else {
                    rimraf(thePath,function(){
                        console.log("Cordova "+version+" uninstalled");
                    });
                }
            }
            else if(cmd==="use"){
                version=cliArgs[1];
                //Check if version exists
                thePath=path.join(CVMPath,version);
                 if(version==="system"){
                    version="";
                }
                else if(!fs.existsSync(thePath))
                {
                    console.log("Invalid version specificied");
                    return;
                }

                fs.writeFileSync(path.join(getUserHome(),".cvmrc"),version);
            }
            else if(cmd==="version"){
                exec = require("child_process").exec;
                    child = exec("cordova --version" ,
                        function(error,stdout){
                            if(error){
                                console.log("Error "+error);
                            }
                            else {
                                console.log(stdout);
                            }
                        }
                    );
            }
            else if(cmd==="remote") {
                exec = require("child_process").exec;
                child = exec("npm view cordova versions" ,
                    function(error,stdout){
                        if(error){
                            console.log("Error "+error);
                        }
                        else {
                            console.log("Cordova versions available\n");
                            var out=stdout.replace("[","").replace("]","");
                            out=out.replace(/["']/g,"")
                            console.log(out);
                        }
                    }
                );
            }
            else {
                return console.log(CLIBanner+cliCommands);
            }
        }
    },
    checkCVMSetup:function(){
        if(!fs.existsSync(CVMPath)){
            //create cvm path
            fs.mkdirSync(CVMPath);
            fs.openSync(path.join(getUserHome(),".cvmrc"),"w");
            fs.createReadStream(path.join(__dirname,"..","broker","cordova")).pipe(fs.createWriteStream(path.join(getCVMPath(),"cordova")));
            fs.chmodSync(path.join(getCVMPath(),"cordova"), "755");

            if(isWin){
                //Add the cmd file
                fs.createReadStream(path.join(__dirname,"..","broker","cordova.cmd")).pipe(fs.createWriteStream(path.join(getCVMPath(),"cordova.cmd")));
                fs.chmodSync(path.join(getCVMPath(),"cordova.cmd"), "755");

            }
            console.log("cvm system configuration complete");
            console.log("Please add the following line to your shell profile");
            console.log("export PATH='$HOME/.cvm:$PATH'");
        }
        return true;
    },
    cvminstalls:function(){
        return fs.readdirSync(CVMPath).filter(function(file) {
            return fs.statSync(path.join(CVMPath, file)).isDirectory();
        });
    }
};



module.exports=CVMCLI;