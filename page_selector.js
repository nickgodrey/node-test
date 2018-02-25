var http = require('http');
var url = require('url');
var fs = require('fs');
var childProcess = require('child_process');
var path = require('path');

var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});



function checkURL(str) {
  if (str === "/"){
	console.log("str = /, setting to /index.html");
    return "/index.html";
  }
  return str;
}

http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  var pathname = checkURL(q.pathname);
  console.log("Pathname:" + pathname);
  console.log("Method:" + req.method);
  var filename = "." + pathname;
  
  console.log("Checking pathname " + pathname);
  var isHTML = pathname.indexOf(".html");
  var isJS = pathname.indexOf(".js");
  console.log("HTML: " + isHTML);
  console.log("JS: " + isJS);
  
  if (isJS != -1){
	console.log("Calling JavaScript");
	var qdata = q.query;
	console.log("query:" + "qdata: %j", qdata)
	console.log("table:" + qdata.table)
	console.log("key: "+ qdata.key)
	
	runScript(pathname, qdata , function(err, data) {
      console.log('Returned data: ', data);  
	  if (err) {
		console.log('Run Script Error');  
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end("404 Not Found");
      } 
	
      console.log('finished running ' + pathname);
	  console.log("data:", data)
	  res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(JSON.stringify(data));
      return res.end();
    });
  } else {
    fs.readFile(filename, function(err, data) {
    console.log("filename:" + filename) 
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    } 
	
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
    }); 
  } 
}).listen(8080);



function runScript(scriptPath, args, callback) {
	console.log("Running script:  " + scriptPath + "args: %j", args)
	console.log("Running script:  " + scriptPath + JSON.stringify(args))
	var dirString = path.dirname(fs.realpathSync(__filename));
	console.log("Directory: " + dirString);
	scriptLocation = "" + dirString + scriptPath
	console.log("scriptLocation: " + scriptLocation);
	
    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;
	
    var process = childProcess.fork(scriptLocation, [JSON.stringify(args)]);

    // listen for errors as they may prevent the exit event from firing
    process.on('error', function (err) {
		console.log("Error in runScript");
        if (invoked) return;
        invoked = true;
        callback(err);
    });

	process.on('message', (m) => {
	  console.log('PARENT got message:', m);
	  //callback(m)
	  // execute the callback once the process has finished running
      process.on('exit', function (code) {
		  console.log("Exiting runScript");
		  console.log("Process: ", process);
		  console.log("code: " + code);
          if (invoked) return;
          invoked = true;
		  console.log("invoked?");
          var err = code === 0 ? null : new Error('exit code ' + code);
		  console.log("err:", err);
		  console.log("m:", m);
          callback(err, m);
      });
    });
	
	//process.on('message', (m) => {
	//	console.log('PARENT got message:', m);
	//	callback(m)
    //});
	
	
    // execute the callback once the process has finished running
    //process.on('exit', function (code) {
		//console.log("Exiting runScript");
		//console.log("Process: ", process);
		//console.log("code: " + code);
        //if (invoked) return;
        //invoked = true;
		//console.log("invoked?");
        //var err = code === 0 ? null : new Error('exit code ' + code);
        //callback(err);
    //});
}

// Now we can run a script and invoke a callback when complete, e.g.
//runScript('./some-script.js', function (err) {
//    if (err) throw err;
//    console.log('finished running some-script.js');
//});