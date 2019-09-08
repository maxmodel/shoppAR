import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './home.css';

var AWS = require("aws-sdk");
AWS.config.update({region: 'us-east-2'});
var myCredentials = {
    accessKeyId: 'AKIAWXFSDROU4YYAGU6G',
    secretAccessKey: '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'
}
AWS.config.credentials = myCredentials;
// Create S3 service object
var s3 = new AWS.S3({apiVersion: '2006-03-01'});




class Home extends Component {

componentDidMount(){
    this.setState({
        selectedFile: "",
        loaded: 0,
    })
    this.onClickHander=this.onClickHandler.bind(this);
}
onChangeHandler=event=>{
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    })
  }

onClickHandler = async () => {
    var file = this.state.selectedFile
    const data = new FormData()
    data.append('file', file)

    console.log(this.state.selectedFile)
    var user_id = "johan";
    var file_id = this.state.selectedFile.name;
    // file?
    var object_key = user_id + file_id;

    console.log("Will Upload Object:", object_key);

    // call S3 to retrieve upload file to specified bucket
    var uploadParams = {Bucket: 'shoppar', Key: object_key, Body: ''};

    // Configure the file stream and obtain the upload parameters
    // var fs = require('fs');
    // var file = 'vase.scn';
    // var fileStream = fs.createReadStream(file);
    // fileStream.on('error', function(err) {
    //     console.log('File Error', err);
    // });

    uploadParams.Body = file;//fileStream;

    //call S3 to retrieve upload file to specified bucket
    await s3.upload (uploadParams, async function (err, data) {
        if (err) {
            console.log("Error", err);
        } if (data) {
            console.log("Upload Success", data.Location);
            window.alert("success");



            // Save in our database that the file was uploaded
            // Configure database client and insert form to table
            // const client = await pool.connect()
            // await client.query('INSERT INTO objects (user_id, file_id, object_key) VALUES ($1, $2, $3)', [user_id, file_id, object_key]);

            // Return created_on timestamp of when form was created
            // client.release()
            //res.json(data.location);
        }
    });

    this.setState({
      selectedFile: "",
      loaded: 0,
    })


}


  render() {
    return (
    <div className="App">
    <br /><br />
      <h1 className="header" style={{color: "#212121", height: "130%"}}>ShopAR: Upload 3D Files</h1>
      <br /><br />
      <hr />
      <br /><br />
      {/* Link to List.js */}
<center>
<h3>Select a 3D file to upload</h3>
<div style={{width: "300px", height: "200px", backgroundColor: "#CDCDCD", borderRadius: "15px", cornerRadius: "15px"}} >
    <input type="file" name="file" onChange={this.onChangeHandler} style={{padding: "27%"}}/>


</div>
<br /><br /><br />
<button type="button" style={{width: "140px", height: "40px", borderRadius: "15px", cornerRadius: "15px"}}onClick={this.onClickHandler}>Submit File</button>
</center>
    </div>
    );
  }
}
export default Home;
