var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

var params = {
  TableName: 'CUSTOMER_LIST_2',
  Item: {
    'CUSTOMER_ID' : {N: '002'},
    'CUSTOMER_NAME' : {S: 'Michard Moe'},
	'CUSTOMER_ADDRESS' : {S: '456 Garlic Street'},
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