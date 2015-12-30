
path = require('path');
YAML = require('yamljs');
sprintf = require('sprintf-js');
underscore = require('underscore');


module.exports = function(grunt) {

  var yaml = 'sys/system.yaml';
  var system = YAML.load(yaml);

// shell
  var shell = underscore.reduce(system.sys,function(memo,v,k){
    u = k.charAt(0).toUpperCase() + k.slice(1);
    memo[sprintf.sprintf('start%s',u)] = {command:sprintf.sprintf('yak -c sys/system.cfg start %s',k)};
    memo[sprintf.sprintf('stop%s',u)] = {command:sprintf.sprintf('yak -c sys/system.cfg stop %s',k)};
    memo[sprintf.sprintf('restart%s',u)] = {command:sprintf.sprintf('yak -c sys/system.cfg restart %s',k)};
    memo[sprintf.sprintf('console%s',u)] = {command:sprintf.sprintf('yak -c sys/system.cfg console %s',k)};
    memo[sprintf.sprintf('clean%s',u)] = {command:sprintf.sprintf('rm -f yak/log/%s/*',k)};
    return memo;
    },{
    y2json:{command:'yaml2json sys/system.yaml -p -s'},
    info:{ command:'yak -c sys/system.cfg info'},
    cleanLog:{ command:'rm -rf yak/log/*'},
    startAll:{ command:'yak -c sys/system.cfg start *'},
    stopAll:{  command:'yak -c sys/system.cfg stop *'},
    restartAll:{ command:'yak -c sys/system.cfg restart *'}
  });

// watch
  var o = {spawn:false,atBegin:true,interrupt:true};
  var watch = underscore.reduce(system.sys,function(memo,v,k){

    var u = k.charAt(0).toUpperCase() + k.slice(1);
    var f = underscore.reduce(v['process'],function(m,v){ return m.concat(v['depends']) },[]);
    f = underscore.uniq(f);
    memo[sprintf.sprintf('console%s',u)] = {files:f,tasks:[sprintf.sprintf('shell:stop%s',u),sprintf.sprintf('shell:clean%s',u),sprintf.sprintf('shell:console%s',u)],options:o};
    memo[sprintf.sprintf('silent%s',u)] = {files:f,tasks:[sprintf.sprintf('shell:stop%s',u),sprintf.sprintf('shell:clean%s',u),sprintf.sprintf('shell:start%s',u)],options:o};
    return memo;
    },{
      y2sbl:{files:['sys/system.yaml'],tasks:['file-creator:y2sbl']},
      y2yak:{files:['sys/system.yaml'],tasks:['file-creator:y2yak']},
      y2json:{files:['sys/system.yaml'],tasks:['shell:y2json']},
      main:{files:['main.q','tick.q'],tasks:['shell:stopMain','shell:cleanMain','shell:consoleMain'],options:o},
      silent:{files:['main.q','tick.q'],tasks:['shell:stopMain','shell:cleanMain','shell:startMain'],options:o},
      test:{files:['test/test.q','tick.q'],tasks:['shell:stopTest','shell:cleanTest','shell:consoleTest'],options:o}
    });

// concurrent

  var silentTasks = underscore.map(system.sys,function(v,k){
    var u = k.charAt(0).toUpperCase() + k.slice(1);
    return sprintf.sprintf('watch:silent%s',u);
    });

  var consoleTasks = underscore.map(system.sys,function(v,k){
    var u = k.charAt(0).toUpperCase() + k.slice(1);
    return sprintf.sprintf('watch:console%s',u);
    });



  // Project configuration.
  grunt.initConfig({
    pkg:grunt.file.readJSON('package.json'),
    shell:shell,
    watch:watch,
    concurrent:{
      config:{options:{logConcurrentOutput: true},tasks:['watch:y2json','watch:y2yak','watch:y2sbl']},
      silent:{options:{logConcurrentOutput: true},tasks:silentTasks},
      console:{options:{logConcurrentOutput: true},tasks:consoleTasks},
      test:{options:{logConcurrentOutput: true},tasks:['watch:test']}
    },
    "file-creator": {
      y2yak: {
        "sys/system.cfg": function(fs, fd, done) {
          fs.writeSync(fd,sprintf.sprintf('basePort = %s\n\n',system.env.sys.basePort));
          underscore.each(system.sys,function(v,group){
            fs.writeSync(fd,sprintf.sprintf('[group:%s]\n',group));
            if(underscore.has(v,'basePort')){ fs.writeSync(fd,sprintf.sprintf('\tbasePort = %s\n',v['basePort']));}
            underscore.each(v['process'],function(p){
                fs.writeSync(fd,sprintf.sprintf('\t[[%s.%s]]\n',group,p.name));
                fs.writeSync(fd,'\ttype = q\n');
                fs.writeSync(fd,sprintf.sprintf('\tport=\'$%s\'\n',p.port));
                fs.writeSync(fd,sprintf.sprintf('\tcommand=\'q %s -name %s.%s\'\n',p.file,group,p.name));
                fs.writeSync(fd,sprintf.sprintf('\tlogPath=\'yak/log/%s\'\n',group));
                fs.writeSync(fd,'\n');
            });
          });
          done();
        }
      },
      y2sbl:{
        "sys/system.sbl":function(fs,fd,done){
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
          fs.writeSync(fd,sbl);
          fs.writeSync(fd,test);
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

  grunt.registerTask('y2yak', ['file-creator:y2yak']);
  grunt.registerTask('y2sbl', ['file-creator:y2sbl']);
  grunt.registerTask('wy2yak', ['watch:y2yak']);
  grunt.registerTask('wy2json', ['watch:y2json']);
  grunt.registerTask('wy2sbl', ['watch:y2sbl']);
  grunt.registerTask('config', ['concurrent:config']);

  // Register the default tasks.

  underscore.each(shell,function(v,k){grunt.registerTask(k, [sprintf.sprintf('shell:%s',k)]);});

  grunt.registerTask('default', ['concurrent:silent']);
  grunt.registerTask('silent', ['concurrent:silent']);
  grunt.registerTask('console', ['concurrent:console']);
  grunt.registerTask('test', ['concurrent:test']);

};
