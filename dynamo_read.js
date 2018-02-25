var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

var params = {
  TableName: 'CUSTOMER_LIST_2',
  Key: {
    'CUSTOMER_ID' : {N: '1'},
  },
  ProjectionExpression: 'CUSTOMER_NAME, CUSTOMER_ADDRESS, CUSTOMER_BLAH'
};

// Call DynamoDB to read the item from the table
ddb.getItem(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.Item);
  }
});