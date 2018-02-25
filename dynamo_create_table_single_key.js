var http = require('http');
var url = require('url');
var fs = require('fs');

var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

var params = {
  AttributeDefinitions: [
    {
      AttributeName: 'USER_ID',
      AttributeType: 'S'
    }
  ],
  KeySchema: [
    {
      AttributeName: 'USER_ID',
      KeyType: 'HASH'
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  },
  TableName: 'TEST_USERS',
  StreamSpecification: {
    StreamEnabled: false
  }
};

// Call DynamoDB to create the table
ddb.createTable(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.Table.KeySchema);
  }
});