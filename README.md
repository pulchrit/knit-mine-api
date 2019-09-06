This is the version that will store file uploads to the app server itself. It
uses accepts multipart form data, processes the file uploaded to the server using
express-formidable middleware, and then posts that multipart form data to the database with
a url relative to the server for later GET requests by the client side. 
I was not able to use this for my capstone because Heroku DOES NOT STORE static files
like file uploads in it's server instances. Instead they recommend using AWS S3 to store
such files. 
