<h1>shopAR backend API</h2>

<h2>Overview</h2>
	
	shopAR allows you to upload .scn files through our React app accessible at shoppar.herokuapp.com/. Files are stored by our API using AWS s3, and our CocoaPod enables interaction with these services for easy in-app retrieval and display.

	shopAR provides an example project that includes a ViewController that enables you to view .scn objects in Augmented Reality. If your app does not already have AR capabilities, instructions for easy integration of this file are below.

<h3> API Description </h3>

Users can upload .scn files through a drag-and-drop at https://shoppar.herokuapp.com/ or by directly sending POST requests to https://shopppar.herokuapp.com/api/uploadObject/ with body parameters user_id (String, your unique identifier) and file_id (String, name of file). Uploaded files are saved in an AWS s3 bucket and signedURLs for them can be retrieved through POST requests to https://shopppar.herokuapp.com/api/getObject passing up the same parameters.

<h3> Usage </h3>

For iOS app CocoaPod installation, in-app access to the API, and an example project, visit https://cocoapods.org/pods/shopar.
To upload .scn files, visit https://shoppar.herokuapp.com/.

