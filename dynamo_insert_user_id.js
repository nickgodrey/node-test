var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

//console.log(process.argv)
var args = process.argv[2];
console.log("Args passed to dynamo_insert_user_id.js: " + args)
var jsonArgs = JSON.parse(args);

var params = {
  TableName: 'TEST_USERS',
  Item: {
    'USER_ID' : {S: (jsonArgs.USER_ID)},
    'NAME' : {S: (jsonArgs.NAME)},
	'ADDRESS' : {S: (jsonArgs.ADDRESS)},
  }
};

// Call DynamoDB to add the item to the table
ddb.putItem(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data);
  }
});