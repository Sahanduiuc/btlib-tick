
path = require('path');
YAML = require('yamljs');
sprintf = require('sprintf-js');
underscore = require('underscore');


module.exports = function(grunt) {

  var getFiles = function(string, regex, index) {
    index || (index = 1);
    var matches = [];
    var match;
    while (match = regex.exec(string)) {
      matches.push(match[index]);
    }
    return matches;
  };

  var yaml = 'sys/system.yaml';
  var system = grunt.file.readYAML(yaml);

  var cshell = function(system){
    var shell = underscore.reduce(system.sys,function(memo,v,k){
      u = k.charAt(0).toUpperCase() + k.slice(1);
      memo[sprintf.sprintf('start%s',u)] = {command:sprintf.sprintf('yak -c sys/system.cfg start %s',k)};
      memo[sprintf.sprintf('stop%s',u)] = {command:sprintf.sprintf('yak -c sys/system.cfg stop %s',k)};
      memo[sprintf.sprintf('restart%s',u)] = {command:sprintf.sprintf('yak -c sys/system.cfg restart %s',k)};
      memo[sprintf.sprintf('console%s',u)] = {command:sprintf.sprintf('yak -c sys/system.cfg console %s',k)};
      memo[sprintf.sprintf('clean%s',u)] = {command:sprintf.sprintf('rm -f yak/log/%s/*',k)};
      return memo;
      },{
      info:{ command:'yak -c sys/system.cfg info'},
      cleanLog:{ command:'rm -rf yak/log/*'},
      startAll:{ command:'yak -c sys/system.cfg start *'},
      stopAll:{  command:'yak -c sys/system.cfg stop *'},
      restartAll:{ command:'yak -c sys/system.cfg restart *'}
    });
    return shell;
  };

  var cwatch = function(system){
    var o = {spawn:false,atBegin:true,interrupt:true};
    var watch = underscore.reduce(system.sys,function(memo,v,k){
      var u = k.charAt(0).toUpperCase() + k.slice(1);
      var f = underscore.reduce(v['process'],function(m,v){ return m.concat(v['file']) },[]);
      f = underscore.uniq(f);
      var g = underscore.reduce(f,function(m,v){
        var data0 = grunt.file.read(v);
        var f0 = getFiles(data0,/\\l (.*)\n/g);
        var f1 = getFiles(data0,/.b.l "(.*)"/g);
        var f2 = f1.concat(f0);
        return m.concat(f2)
      },[]);
      f = f.concat(g);f = underscore.uniq(f);
      memo[sprintf.sprintf('console%s',u)] = {files:f,tasks:[sprintf.sprintf('shell:stop%s',u),sprintf.sprintf('shell:clean%s',u),sprintf.sprintf('shell:console%s',u)],options:o};
      memo[sprintf.sprintf('silent%s',u)] = {files:f,tasks:[sprintf.sprintf('shell:stop%s',u),sprintf.sprintf('shell:clean%s',u),sprintf.sprintf('shell:start%s',u)],options:o};
      return memo;
      },{
        y2sbl:{files:['sys/system.yaml'],tasks:['file-creator:y2sbl']},
        y2yak:{files:['sys/system.yaml'],tasks:['file-creator:y2yak']},
        y2json:{files:['sys/system.yaml'],tasks:['file-creator:y2json']},
        y2watch:{files:['sys/system.yaml'],tasks:['file-creator:y2watch']},
        y2shell:{files:['sys/system.yaml'],tasks:['file-creator:y2shell']},
        y2concurrent:{files:['sys/system.yaml'],tasks:['file-creator:y2concurrent']},
        config:{files:['sys/system.yaml'],tasks:['file-creator:y2sbl','file-creator:y2yak','file-creator:y2json','file-creator:y2watch','file-creator:y2shell','file-creator:y2concurrent']},
        main:{files:['main.q','tick.q'],tasks:['shell:stopMain','shell:cleanMain','shell:consoleMain'],options:o},
        silent:{files:['main.q','tick.q'],tasks:['shell:stopMain','shell:cleanMain','shell:startMain'],options:o},
        test:{files:['test/test.q','tick.q'],tasks:['shell:stopTest','shell:cleanTest','shell:consoleTest'],options:o}
      }); return watch;
  };

  var cconcurrent = function(system){
    var silentTasks = underscore.map(system.sys,function(v,k){
      var u = k.charAt(0).toUpperCase() + k.slice(1);
      return sprintf.sprintf('watch:silent%s',u);
      });
    var consoleTasks = underscore.map(system.sys,function(v,k){
      var u = k.charAt(0).toUpperCase() + k.slice(1);
      return sprintf.sprintf('watch:console%s',u);
      });
    var concurrent = {
      // config:{options:{logConcurrentOutput: true},tasks:['watch:y2json','watch:y2yak','watch:y2sbl','watch:y2watch','watch:y2shell','watch:y2concurrent']},
      silent:{options:{logConcurrentOutput: true},tasks:silentTasks},
      console:{options:{logConcurrentOutput: true},tasks:consoleTasks},
      test:{options:{logConcurrentOutput: true},tasks:['watch:test']}
    };return concurrent;
  };

  var cyak = function(system){
    var str = '';
    str = str + sprintf.sprintf('basePort = %s\n\n',system.env.sys.basePort);
    underscore.each(system.sys,function(v,group){
      str = str + sprintf.sprintf('[group:%s]\n',group);
      if(underscore.has(v,'basePort')){ str = str + sprintf.sprintf('\tbasePort = %s\n',v['basePort']);}
      underscore.each(v['process'],function(p){
          str = str + sprintf.sprintf('\t[[%s.%s]]\n',group,p.name);
          str = str + '\ttype = q\n';
          str = str + sprintf.sprintf('\tport=\'$%s\'\n',p.port);
          str = str + sprintf.sprintf('\tcommand=\'q %s -name %s.%s\'\n',p.file,group,p.name);
          str = str + sprintf.sprintf('\tlogPath=\'yak/log/%s\'\n',group);
          str = str + '\n';
      });
    });
    return str;
  };

  var csbl = function(system){
    var str = '';
    var sbl = underscore.reduce(system.sys,function(memo,v,group){
      var basePort = system.env.sys.basePort;
      if(underscore.has(v,'basePort')){basePort = v['basePort'];}
      return memo+underscore.reduce(v['process'],function(m,v){
        var port = eval(sprintf.sprintf(v['port'].replace('basePort','%s'),basePort));
        var str = sprintf.sprintf('/ %s.%s:%s:%s::\n',group,v['name'],system.env.sys.host,port);
        return m+str;
      },'')
    },'');
    var test = underscore.reduce(system.test,function(memo,v,group){
      var basePort = system.env.test.basePort;
      if(underscore.has(v,'basePort')){basePort = v['basePort'];}
      return memo+underscore.reduce(v['process'],function(m,v){
        var port = eval(sprintf.sprintf(v['port'].replace('basePort','%s'),basePort));
        var str = sprintf.sprintf('/ %s.%s:%s:%s::\n',group,v['name'],system.env.sys.host,port);
        return m+str;
      },'')
    },'');
    str = str + sbl;
    str = str + test;
    return str;
  }

  var shell = cshell(system);

  // Project configuration.
  grunt.initConfig({
    pkg:grunt.file.readJSON('package.json'),
    shell:shell,
    watch:cwatch(system),
    concurrent:cconcurrent(system),
    "file-creator": {
      y2json: {
        "sys/system.json": function(fs, fd, done) {
          var str = JSON.stringify(system,null,2);
          fs.writeSync(fd,str);
          done();
        }
      },
      y2yak: {
        "sys/system.cfg": function(fs, fd, done) {
          var str = cyak(system);
          fs.writeSync(fd,str);
          done();
        }
      },
      y2sbl:{
        "sys/system.sbl":function(fs,fd,done){
          var str = csbl(system);
          fs.writeSync(fd,str);
          done();
        }
      },
      y2watch:{
        "grunt/watch.yaml": function(fs, fd, done) {
          var watch = cwatch(system);
          fs.writeSync(fd,YAML.stringify(watch));
          done();
        }
      },
      y2shell:{
        "grunt/shell.yaml": function(fs, fd, done) {
          var shell  = cshell(system);
          fs.writeSync(fd,YAML.stringify(shell));
          done();
        }
      },
      y2concurrent:{
        "grunt/concurrent.yaml": function(fs, fd, done) {
          var concurrent = cconcurrent(system);
          fs.writeSync(fd,YAML.stringify(concurrent));
          done();
        }
      }
    }

  });



  // Load the Grunt plugins.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-file-creator');

  grunt.registerTask('y2json', ['file-creator:y2json']);
  grunt.registerTask('y2yak', ['file-creator:y2yak']);
  grunt.registerTask('y2sbl', ['file-creator:y2sbl']);
  grunt.registerTask('y2watch', ['file-creator:y2watch']);
  grunt.registerTask('y2shell', ['file-creator:y2shell']);
  grunt.registerTask('y2concurrent', ['file-creator:y2concurrent']);



  grunt.registerTask('wy2yak', ['watch:y2yak']);
  grunt.registerTask('wy2json', ['watch:y2json']);
  grunt.registerTask('wy2sbl', ['watch:y2sbl']);
  grunt.registerTask('config', ['watch:config']);

  // Register the default tasks.

  underscore.each(shell,function(v,k){grunt.registerTask(k, [sprintf.sprintf('shell:%s',k)]);});

  grunt.registerTask('default', ['concurrent:silent']);
  grunt.registerTask('silent', ['concurrent:silent']);
  grunt.registerTask('console', ['concurrent:console']);
  grunt.registerTask('test', ['concurrent:test']);

};
