var path = require('path');
var fs = require('fs');

module.exports = function(context) {
  var xcode = require('xcode');

  // Require the iOS platform Api to get the Xcode .pbxproj path.
  var iosPlatformPath = path.join(context.opts.projectRoot, 'platforms', 'ios');
  var iosAPI = require(path.join(iosPlatformPath, 'cordova', 'Api'));
  var iosAPIInstance = new iosAPI();
  var pbxprojPath = iosAPIInstance.locations.pbxproj;

  // Read the Xcode project and get the target.
  var xcodeProject = xcode.project(pbxprojPath);
  xcodeProject.parseSync();

  var platformPathWWW = path.join(iosPlatformPath, 'www', 'pd');
  
  fs.readdirSync(platformPathWWW).forEach(file => {
    if (file[0] != '.') {
      var filepath = path.join(platformPathWWW, file);
      xcodeProject.addResourceFile(filepath);
    }
  });

  // Write the changes into the Xcode project.
  fs.writeFileSync(pbxprojPath, xcodeProject.writeSync());

}