const express = require('express');
const path = require('path');
var AWS = require("aws-sdk");

AWS.config.update({region: 'us-east-2'});
var myCredentials = {
    accessKeyId: 'AKIAWXFSDROU4YYAGU6G',
    secretAccessKey: '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'
}
AWS.config.credentials = myCredentials;
// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01'});

const app = express();

// pSQL database connection
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

//////////////////////////////////////////////////
///////////////////// ROUTES /////////////////////
//////////////////////////////////////////////////

// An api endpoint that returns a short list of items
app.get('/api/getList', async (req,res) => {
    var list = ["item1", "item2", "item3"];
    var ourBucket = '';
    res.json(list);
    console.log('Sent list of items');

    // Call S3 to list the buckets
    await s3.listBuckets(function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.Buckets);
            ourBucket = data.Buckets[0].Name;

            // // Create the parameters for calling listObjects
            // var bucketParams = {
            //     Bucket : ourBucket,
            // };

            // // Call S3 to obtain a list of the objects in the bucket
            // s3.listObjects(bucketParams, function(err, data) {
            //     if (err) {
            //         console.log("Error", err);
            //     } else {
            //         console.log("Success", data);
            //     }
            // });

            // call S3 to retrieve upload file to specified bucket
            var uploadParams = {Bucket: 'shoppar', Key: '', Body: ''};
            var file = 'vase.scn';

            // Configure the file stream and obtain the upload parameters
            var fs = require('fs');
            var fileStream = fs.createReadStream(file);
            fileStream.on('error', function(err) {
                console.log('File Error', err);
            });
            uploadParams.Body = fileStream;
            var path = require('path');
            uploadParams.Key = 'johan' + path.basename(file);

            // call S3 to retrieve upload file to specified bucket
            s3.upload (uploadParams, function (err, data) {
                if (err) {
                    console.log("Error", err);
                } if (data) {
                    console.log("Upload Success", data.Location);
                }
            });
        }
    });


});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});


const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);

///////////////////////////////////////////////////
//////////////////////////////////////////////////




// client.connect();
//
// client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
//   client.end();
// });
