/* Copyright (c) 2015 Intel Corporation. All rights reserved.
* Use of this source code is governed by a MIT-style license that can be
* found in the LICENSE file.
*/

/* global beforeEach */
/* global describe */
/* global it */
"use strict";
var assert = require("assert");
var chai = require("chai");
var cli = require("../src/index");
var spawn = require("child_process").spawn;


/**
 * We spawn off processes to test the CLI arguments
 */

chai.should();
describe("cvm", function(){
  beforeEach(function(){

  });
  describe("Object functions", function(){
    it("should have a run function", function(){
      cli.should.have.property("run");
    });
    it("should have a checkCVMSetup function", function(){
      cli.should.have.property("checkCVMSetup");
    });
    it("should have a cvminstalls function", function(){
      cli.should.have.property("cvminstalls");
    });
    it("should not have a foobar function", function(){
      cli.should.not.have.property("foobar");
    });
  });
  describe("run function",function(){
    //The length should be long with the banner
    it("Should return the banner and commands with no arguments",function(done){
      //var ret=
      var banner=spawn("../bin/cvm",[],{});
      var buffer=null;
      banner.stdout.on("data",function(data){
        buffer+=data;
      });
      banner.stderr.on("data",function(err){
        assert.ok(false,"Error "+err);
        done();
      });
      banner.on("close",function(){
        buffer.indexOf("Cordova Version Manager").should.not.equal(-1);
        done();
      });
      //msg.indexOf("Usage: xdkcli task args").should.not.equal(-1);
    });
    it("Should return the banner and commands with invalid arguments",function(done){
      //var ret=
      var banner=spawn("../bin/cvm",["foobar"],{});
      var buffer=null;
      banner.stdout.on("data",function(data){
        buffer+=data;
      });
      banner.stderr.on("data",function(err){
        assert.ok(false,"Error "+err);
        done();
      });
      banner.on("close",function(){
        buffer.indexOf("Cordova Version Manager").should.not.equal(-1);
        done();
      });
    });
    it("Should return the templates",function(done){
      var banner=spawn("../bin/cvm",["list"],{});
      var buffer=null;
      banner.stdout.on("data",function(data){
        buffer+=data;
      });
      banner.stderr.on("data",function(err){
        assert.ok(false,"Error "+err);
        done();
      });
      banner.on("close",function(){

        buffer.indexOf("Usage: cvm task args").should.equal(-1);
        done();

      });
    });
    it("Should fail trying to install an invalid version",function(done){
      var banner=spawn("../bin/cvm",["install","9.0.2.1.0"],{});
      var buffer=null;
      banner.stdout.on("data",function(data){
        buffer+=data;
      });
      banner.stderr.on("data",function(data){
        console.log(data);
        done();
      });
      banner.on("close",function(){

        buffer.indexOf("Usage: cvm task args").should.equal(-1);
        done();

      });
    });
    it("Should install version 0.1.1",function(done){
      var banner=spawn("../bin/cvm",["install","0.1.1"],{});
      var buffer=null;
      this.timeout(0);
      banner.stdout.on("data",function(data){
        buffer+=data;
      });
      banner.stderr.on("data",function(data){
        console.log(data);
        done();
      });
      banner.on("close",function(){
        buffer.indexOf("Cordova 0.1.1 installed").should.not.equal(-1);
        done();

      });
    });
    it("Should uninstall version 0.1.1",function(done){
      var banner=spawn("../bin/cvm",["uninstall","0.1.1"],{});
      var buffer=null;
      this.timeout(0);
      banner.stdout.on("data",function(data){
        buffer+=data;
      });
      banner.stderr.on("data",function(data){
        console.log(data);
        done();
      });
      banner.on("close",function(){
        buffer.indexOf("Cordova 0.1.1 uninstalled").should.not.equal(-1);
        done();

      });
    });
    it("Should list versions",function(done){
      var banner=spawn("../bin/cvm",["remote"],{});
      var buffer=null;
      this.timeout(0);
      banner.stdout.on("data",function(data){
        buffer+=data;
      });
      banner.stderr.on("data",function(data){
        console.log(data);
        done();
      });
      banner.on("close",function(){
        buffer.indexOf("5.1.1").should.not.equal(-1);
        buffer.indexOf("0.0.0-fake").should.not.equal(-1);
        done();

      });
    });
  });
});
