var fs = require('fs');
var test = require('../middlewareserver.js')
FileUploadController = function() {};

if (!fs.existsSync("public/uploads")){
    fs.mkdirSync("public/uploads");
}

FileUploadController.prototype.uploadFile = function(req, res) {
  var list = [];

  var file = req.files.file;
  var customName = req.body.name;

    fs.readFile(file.path, function (err, data) {

      // set the correct path for the file not the temporary one from the API:
      //file.name = Date.now()+ file.name;
      file.path = "public/uploads/" + file.name;

      var tmpName = ""
      var tmpPath = file.path;

      for(var i = 0; i < 99999; i++) {
        if(i==0)
          tmpName = file.name
        else
          tmpName = i + "-" + file.name;

        tmpPath = "public/uploads/" + tmpName;

        if (fs.existsSync(tmpPath)) {
          continue;
        }
        else {
          file.path = tmpPath;
          break;
        }
      }

      // copy the data from the req.files.file.path and paste it to file.path
      fs.writeFile(file.path, data, function (err) {
        if (err) {
          res.json({success: false});
          console.warn(err);
          return;
        }
        console.log("The file: " + file.name + " was saved to " + file.path);

        var id = test.writeToDB({'name': file.name, 'path': file.path})
        if(customName)
          res.json({success: true, id: id, filename: tmpName, filepath: file.path, oldfilename: file.name, refName: customName});
        else
          res.json({success: true, id: id, filename: tmpName, filepath: file.path, oldfilename: file.name, refName: tmpName});
      });
    });
}

FileUploadController.prototype.uploadFiles = function(req, res) {

  var list = [];

  req.files.file.forEach(function(x, index, arr)
  {
    var file = x;
    var j = 0;
    fs.readFile(file.path, function (err, data) {

      // set the correct path for the file not the temporary one from the API:


      //file.name = Date.now()+ file.name;
      file.path = "public/uploads/" + file.name;

      var tmpName = ""
      var tmpPath = file.path;

      for(var i = 0; i < 99999; i++) {
        if(i==0)
          tmpName = file.name
        else
          tmpName = i + "-" + file.name;

        tmpPath = "public/uploads/" + tmpName;

        if (fs.existsSync(tmpPath)) {
          continue;
        }
        else {
          file.path = tmpPath;
          break;
        }
      }


      // copy the data from the req.files.file.path and paste it to file.path
      fs.writeFile(file.path, data, function (err) {
        if (err) {
          list.push({success: false});
          console.warn(err);
          return;
        }
        console.log("The file: " + file.name + " was saved to " + file.path);

        var id = test.writeToDB({'name': file.name, 'path': file.path})
        list.push({success: true, id: id, filename: tmpName, filepath: file.path, oldfilename: file.name});
        if(list.length == arr.length)
          res.json(list);
      });
    });
  })
}

module.exports = new FileUploadController();