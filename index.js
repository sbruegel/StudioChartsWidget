var version = "2.0.0";

var path = require('path');
//const studioLog = require('studio-log');
//const log = studioLog.getLogger('TEST');
//log.info("");

exports.extensionInfo = {
  extensionType: 'widget'
};

exports.IDEImages = [
  path.resolve(__dirname, 'ide', 'images', '*')
];

/*exports.canvasLibraries = function() {
  return [
    {files: [path.resolve(__dirname, 'ide', 'js', "common-sb-widgets-ng.js")], dest: 'js'}
  ];
};*/

exports.widgetsJS = [
  path.resolve(__dirname, 'widgets', '**', '*.js'),
  path.resolve(__dirname, 'widgets', 'chartWidgetGroups.js'),
  path.resolve(__dirname, 'widgets', 'chartProps.js')
];

exports.widgetsCSS = [
  path.resolve(__dirname, 'widgets', '**', '*.scss')
];

exports.runtimeFiles = function() {
  return [
    {files: [path.resolve(__dirname, 'runtime', 'images', '*')], dest: 'images'},
    {files: [path.resolve(__dirname, 'runtime', 'js', '*')], dest: 'js'},
  ];
}

exports.runtimeAngularModulesRequires = ['chartjs3d-ng'];
/*exports.canvasAngularModulesRequires = ['common-sb-widgets-ng'];
exports.IDEAngularModulesRequires = ['common-sb-widgets-ng'];*/