var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

//console.log(process.argv)
var args = process.argv[2];
console.log("Args passed to get_from_table.js: " + args)
var jsonArgs = JSON.parse(args);


var params = {
  TableName: (jsonArgs.table),
  Key: {
    'USER_ID' : {S: (jsonArgs.key)},
  },
  //ProjectionExpression: 'CUSTOMER_NAME'
};

// Call DynamoDB to read the item from the table
ddb.getItem(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else if (data.Item === undefined) {
	console.log("ddb.getItem returned undefined");
	// Should probably return some JSON or something instead of just a string?
	process.send("ERROR")
	return "ERROR"
  } else {
    console.log("Success", data.Item);
	console.log(data.Item);
	process.send(data.Item)
	return data.Item
  }
});