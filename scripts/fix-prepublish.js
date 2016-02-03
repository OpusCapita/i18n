var child_process = require('child_process');
var exec = child_process.exec;
var spawn = child_process.spawn;
var sysPath = require('path');
var fs = require('fs');

var mode = process.argv[2];

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

if (mode === 'prepublish') {
  var babel = __dirname + '/node_modules/.bin/babel';
  spawn('node', [babel, 'src', '--out-dir', 'lib'], {
    cwd: __dirname,
    stdio: 'inherit'
  });
} else if (mode === 'postinstall') {
  fsExists(sysPath.join(__dirname, 'lib'), function (exists) {
    if (exists) return;
    execute(['node_modules', '.bin', 'babel'], 'src --out-dir lib');
  });
}
