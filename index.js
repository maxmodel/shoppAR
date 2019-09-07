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
app.use(express.json())
app.use(express.urlencoded({extended: true}))
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
});


// Route to get an item with inputted ID
app.post('/api/getObject', async (req,res) => {
    var user_id = req.body.user_id;
    var file_id = req.body.file_id;
    var object_key = user_id + file_id;

    console.log("Will Get Object:", object_key);

    const signedUrlExpireSeconds = 60 * 1200
    try {
            const url = await s3.getSignedUrl('getObject', {
                Bucket: 'shoppar',
                Key: object_key,
                Expires: signedUrlExpireSeconds
            })

            console.log("url: ", url);
            res.json({url:url});
        } catch (err) {
            console.error(err);
            res.json({url:"no-url-found"});
        }
});


// Route to upload an item with inputted ID
app.post('/api/uploadObject', async (req,res) => {
    var user_id = req.body.user_id;
    var file_id = req.body.file_id;
    var object_key = "user" + user_id + "--file" + file_id;

    console.log("Will Upload Object:", object_key);

    // call S3 to retrieve upload file to specified bucket
    var uploadParams = {Bucket: 'shoppar', Key: object_key, Body: ''};

    // Configure the file stream and obtain the upload parameters
    var fs = require('fs');
    var file = 'vase.scn';
    var fileStream = fs.createReadStream(file);
    fileStream.on('error', function(err) {
        console.log('File Error', err);
    });

    uploadParams.Body = fileStream;

    // call S3 to retrieve upload file to specified bucket
    await s3.upload (uploadParams, async function (err, data) {
        if (err) {
            console.log("Error", err);
        } if (data) {
            console.log("Upload Success", data.Location);

            // Save in our database that the file was uploaded
            // Configure database client and insert form to table
            // const client = await pool.connect()
            // await client.query('INSERT INTO objects (user_id, file_id, object_key) VALUES ($1, $2, $3)', [user_id, file_id, object_key]);

            // Return created_on timestamp of when form was created
            // client.release()
            res.json(data.location);
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
