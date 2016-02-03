var child_process = require('child_process');
var exec = child_process.exec;
var sysPath = require('path');
var fs = require('fs');

var fsExists = fs.exists || sysPath.exists;

var execute = function (pathParts, params) {
  var path = sysPath.join.apply(null, pathParts);
  var command = 'node ' + path + ' ' + params;
  console.log('Executing', command);
  exec(command, function (error, stdout, stderr) {
    if (error != null) return process.stderr.write(stderr.toString());
    console.log(stdout.toString());
  });
};

fsExists(sysPath.join(__dirname, 'lib'), function (exists) {
  if (exists) return;
  execute(['..', 'babel-cli', 'bin', 'babel'], 'src --out-dir lib');
});
