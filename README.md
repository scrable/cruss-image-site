To run this project locally, do the following:

`git clone https://github.com/scrable/cruss-image-site`

`cd cruss-image-site`

If on Windows:

`cd. > .env`

If on Linux/Mac:

`touch .env`

For any OS, enter the environment variables inside the `.env` file in the following format:

`ENV_VARIABLE_NAME=env_variable_value`

You will need:

## For the bucket:

#### 1. AWS bucket name - name this `AWS_BUCKET_NAME`

#### 2. AWS bucket secret key - name this `AWS_BUCKET_SECRET_ACCESS_KEY`

#### 3. AWS bucket access key id - name this `AWS_BUCKET_ACCESS_KEY_ID`
  
## For the database

#### 1. AWS database user name - name this `AWS_USER`

#### 2. AWS database password for `AWS_USER` - name this `AWS_PASSWORD`

#### 3. AWS database host name - name this `AWS_HOST`

#### 4. AWS database table name - name this `AWS_DATABASE`
  
#### Add the following line: `ENABLE_HTTPS=false` this allows the app to run locally without using `https`

`npm install`

`heroku local -p 6000`

Navigate in browser to `localhost:5000` and the app should be available.

If the AWS is not set up correctly, it will not download images on the home page. Furthermore, you will not be able to upload images as the location is not correctly set. If the `process.env` values are correct, the app should run correctly.
