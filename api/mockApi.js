'use strict';

var fs = require('fs');
/**
 *  @chris.roberson
 *  Support for a mock data API that lives on the file system and consists of
 *  JSON files with a folder structure mirroring the real API
 *
 *  Support for "default" responses when exact matches aren't found using __default folder.
 *  For example,
 *    Folder structure:
 *        - api
 *          - User
 *            - Get
 *              - 2
 *                * GET.json
 *              - __default
 *                * GET.json
 *
 *    API call: /User/Get/1 => api/User/Get/__default/GET.json
 *    API call: /User/Get/2 => api/User/Get/2/GET.json
 *
 *  The system supports a completely dynamic query string as well where each subsequent part returns a different response
 *  rather than parameter data for generating one response. See the below example
 *
 *  Folder structure:
 *    - api
 *      - cars
 *        - Honda
 *          * GET.json
 *          - Civic
 *            * GET.json
 *            - 2009
 *              * GET.json
 *        - {make}
 *          - __default
 *            * GET.json
 *          - {model}
 *            - __default
 *              * GET.json
 *            - {year}
 *              - __default
 *                * GET.json
 *
 *  API call: /cars/Honda/            => api/cars/Honda/GET.json
 *  API call: /cars/Honda/Civic       => api/cars/Honda/Civic/GET.json
 *  API call: /cars/Honda/Civic/2009  => api/cars/Honda/Civic/2009/GET.json
 *
 *  API call: /cars/Honda/Accord      => api/cars/{make}/{model}/__default/GET.json
 *  API call: /cars/Honda/Civic/2010  => api/cars/{make}/{model}/{year}/__default/GET.json
 *
 *  API call: /cars/Toyta/            => api/cars/{make}/__default/GET.json
 *  API call: /cars/Toyota/Prius      => api/cars/{make}/{model}/__default/GET.json
 *  API call: /cars/Toyota/Prius/2004 => api/cars/{make}/{model}/{year}/__default/GET.json
 */
module.exports = {
  mockApi: function(apiFolder) {
    var dynamicQuery = /\{\w+\}/,
      defaultDirectory = '__default';
      
    function serveContent(file, res) {
      console.log('mockApi is serving a file, path=', file);
      fs.readFile(file, function(err, json) {
        res.end(json);
      });
    } 
    
    function serveDefault(folder, req, res) {
      while (!fs.existsSync(folder + '/' + defaultDirectory)) {
        folder = folder.substring(0, folder.lastIndexOf('/'));
      }
      serveContent(folder + '/' + defaultDirectory + '/' + req.method + '.json', res);
    }
  
    function findFolder(folder, done, failure) {
      folder = folder.lastIndexOf('/') === folder.length - 1 ? folder.substring(0, folder.length - 1) : folder;
      if (fs.existsSync(folder)) {
        done(folder + '/');
      }
      else {
        // If the file does not exist directly on the file system, automatically use default data
        // unless a __default directory exists at any point
        
        // Backtrace to find the base folder
        var baseFolder, 
          level = 0,
          f = folder,
          keepGoing = true;
          
        while (keepGoing && f.length !== 0) {
          // Note: we don't necessarily want to stop when we found a file that exists
          // because if the full path does not exist, we go down the defaults or {} tree
          // instead, utilize the regular expression to tell if it has dynamic query string
          // support (which looks for {something})
          if (fs.existsSync(f)) {
            var files = fs.readdirSync(f);
            for (var x in files) {
              var file = files[x];
              if (file === defaultDirectory) {
                done(f + '/' + file + '/');
                return;
              }
              
              if (dynamicQuery.test(file)) {
                keepGoing = false;
                break;
              }
            }
            if (keepGoing) {
              f = f.substring(0, f.lastIndexOf('/'));
              level++;
            }
          }
          else {
            f = f.substring(0, f.lastIndexOf('/'));
            level++;
          }
        }
        
        // We cannot find a base path for this url, 404
        if (f.length === 0) {
          failure();
          return;
        }
        
        baseFolder = f;
        
        // Go {level} deep to find the right default to serve
        for (var i = 0; i < level; i++) {
          var files = fs.readdirSync(baseFolder);
          for (var x in files) {
            var file = files[x];
            if (dynamicQuery.test(file)) {
              baseFolder += '/' + file;
            }
          }
        }
        
        done(baseFolder); 
      }
    }
  
    return function(req, res/*,next*/) {
      var originalFolder = apiFolder + req.url,
          file;
  
      findFolder(originalFolder, function success(foundFolder) {
        // If the result is not found at the top level, we're using default data
        //console.log('Found folder', foundFolder);
        //console.log('Original folder', originalFolder);
        if (foundFolder !== originalFolder && foundFolder !== (originalFolder + '/')) {
          serveDefault(foundFolder, req, res);
        }
        else {
          file = foundFolder + req.method + '.json';
          fs.exists(file, function(exists) {
            if (exists) {
              serveContent(file, res);
            }
            else {
              serveDefault(file, req, res);
            }
          });
        }
      }, function failure() {
        res.statusCode = 404;
        res.end();
      });
    };
  }
}