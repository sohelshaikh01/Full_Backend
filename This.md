# Backend Project

Learning Full Complex Backend With Project

## Starting Full Backend Project ---

- Creating git repository of Project
- Model in app are designed will for future scope

Project Initialize repository
- npm init

- Initialize project readme.me
- pushing project on git hub


### Storing images in third party service
- upload photo and put on server tempary
- then put no cloudinary


### public/temp empty folder 
- Create `.gitkeep` file to track this


### git ignore file
To not get track and push on git this can be recreated
- Use .gitignore generators


### .env files setup
File to keep some variables values.
Not to push on git
create .env.sample

## Project Initialization ---

### Creating files
Folder and Files in it

src/  use git bash
touch app.js contants.js index.js

### Configuring package.json

- ES6 Module: type: module
- Install `nodemon` as dev dependency 
- To restart server on file save/change
- script: `dev` for `npm run dev` command

Creating directories:
- src/
- mkdir controllers, db, middlewares, models, routes, utils

### Configuring prettier files

For maintaining same code structure
- Install `prettier`: `npm i prettier` as dev dependency
- Add and configure files
- `.prettierrc` and `.prettierignore` Not touch files included in this 

## Starting Database Connection ---

### MongoDB Atlas Database

- Create Project
- Create Cluster
- Create User
- Choose Environment
- Set IP Address: 0.0.0.0/0
- Get Connection String
Simple do next > next

Starting From begining:
- Go to Network Access
- Add and allow ip address
Never allow all access in production

- Go to Database Access
- Create User
- Fill username and password

- Go on Connect to get String
If There any special character in String it may problem

Save `database` name in `constants.js` file

Two Methods to call database:
- All Code in index.file
- Seprate file for Database call

### Installations

`npm i mongoose express dotenv`
dotenv: use require method
mongoos
express

- Database connection may problem: 
so wrap it into `try and catch`

- Database is always in another continent
so always use `async and await`

### Database Call

- Using function
- Using IIFE Function
use semicolon to avoid error: Earlier if may not have semicolon

- Call database in another file

Environment Variables: As early as possible in your application, import and configure dotenv:
- Writing its improved version
- Using experimental feature
So go in package.json


## Custom API Responses and API handling ---

- Creating express app listen after db call
- Understanding API Requests and Responses

- Earlier in express `body-parser` need to takes json
- `Multer` is used for file uploading further.

- Using packeges
cookie-parser
cors

- Mostly `middleware` are used using `app.use`.
- We can modify `cors` settings

### Middleware:
- client hit url and then it get request and res => any res to send
- To check who is capable to take this response this checking in between is known as middleware

- Elements in API 
(err, req, res, next)
- When `next` is used it is about middleware.

### Wrapper utility 
Creating generalize wrapper function that gets the code and executes in wanted form.
- Creating utils/`asyncHandler`.

### Standarizing API response and Error Formats
- Learn node api errors
- Overwriting their properties as use
- utils/`ApiError.js`.
- Writing class to overwrite `Error` properties as need.

- Creating another `ApiReponse.js` File

## User and Video model with hooks and JWT ---

### Creating Models Files

User:
Id : generated by mongodb save in `bson` format
WatchHistory: Array and element get push on watching.

Video:
Owner: Uploader or Owner of Video

- Using Aggregation in mongoDB
install `npm i mongoose-aggregate-paginate-v2`

Installing `npm i bcrypt jsonwebtoken`:
- Both are based on cryptography to create tokens:
- Learning bcrypt or bcryptjs (both are similar)
To save password by hashing and not save it in plain text

- Learning about Jwt and its main parts:
Header includes algorithms
Payload means data
Verification Signature: Container secret import for encoding
- It is bearer token: which means any one have and send it, data will be send to one.


Access token is not to save in Database
Refresh token is to save Database


## How to Upload Files in Backend ---

Can upload any files like videos, pdf
There is no more file upload in fronted in form
File handling is done on third party services

File upload should be special utility

### Using Cloudinary
`npm i cloudinary multer` installing both together

We make user to upload file through multer and temp save file on temparory server then this file get send to storing server
Then remove file from your server
- This make posible reupload
- Save from it if file upload fails

Or there is another way to direct upload file

- Configuring Cloudinary Code:
Writing `uploadOnCloudinary` method in optimal way

- Creating `middleware` using `multer` like utility


## Learning About HTTP Chapter--- 

## Guide for Controllers and Routers with Debugging ---

- Practicing more controller make good problem solving
- Create Controller function
- Create Routes
- Created API Endpoint in App

## Logic Building in Register Controllers ---

- Step to perform Operation on Data
get user details from frontend
validation 
check if user already exists: username, email
check for images, check for avatar
upload them to cloudinary: url
Create user object(for mongodb) - create entry in db
remove password and refresh token field from response
check for user creation
return response

Creating controller for user register using
- ApiError, ApiReponse, Uploading Files

## How to user Postman Professionally ---

- Creating collection so can pass through frontend
- Write Path and set Request type to POST
- Choose Body / Form which make able to send files.

- ThunderClient Free Version - No File Sending Support

- In response use avatar image url to show
- Debug the coverImageLocalPath Methods

- Create and name to environment in postman
- To use similar url string all places
- `http://localhost:8000/api/v1/`
- Mark it and share in box before use to using location
- use {{ variable name }} to get the in String
- ~{{server}}/users1/register

## Access Refresh Token and Middleware and Queries.

Access Token: Short lived
- validate for some

Refresh Token: Long lived
- validate with refresh token if have access token

Check password validation in Login User
- Method created to store generated tokens

Create /login and /logout with auth.middleware

- login endpoint need to give data in json methods
- logout endpoint is not working 

<!-- 
    refresh token saved in database for long time and used to create accesstoken from it to loggin user without needing username and password
    access token is for short period of time and create new access token
-->



## Access and Refresh Token

Creating /login and /logout endpoints

<!-- At 16 video: Check Login and Logout Endpoint working properly -->
<!-- In this video discussion is remains on logout and how to use tokens in it. -->

## Writing Access and Refresh Token Functionallities

Video No 16: 

- Creating refresh Token and it validity
- Creating access Token using refresh token

## Writing Update controller for user --- Video No 17:

// TODO: Delete old image (url in Cloudinary)

- Adding Subscription Model
- Writing Edit functionality
- Adding Controllers
    changeCurrentPassword, 
    getCurrentUser, 
    updateAccountDetails
    updateUserAvatar
    updateUserCoverImage
<!-- 19:00 authmiddleware existance explained -->
- For file write another controller, from user Specific
it is better approach to write another controllers for file
- Check Middlewares: User login, Multer.

## Understand the subscription schema --- Video No 18: 

Understanding how subcription login work
How to get channel Subscribers
How to get subscribed channel of user

## Learn MongoDB Aggregation pipelines --- Video No 19:

Understanding pipelines
Created getUserChannelProfile controller

## How to write sub pipelines and routes --- Video No 20

Write subpipelines
- For getting User watch History
- We store video ids in array in user documents

- Added GetWatchHistory Controller
- Working on Routes to adding till now created

## Summary of this Backend series --- Video No 21

What we have done till now
Where we have to go from now: Create and try creating features from own.
Add new controllers and test them by own

## Some addition concepts in this videos --- Video No 22

Creating remaining models
- How routes created were tested
- logout controller: change undefined to 1
<!-- This removes the field from document: use unset operator -->
- creating remaing models
playlist, likes, controller, tweets




<!-- authmiddleware is used to get user and takes userId from it -->

## Notes:
It is complex project it contains all concept
It may takes months to complete  

- Mongoose `Pre` Hook is middlreware that run just before saving data in database
works no validate, save, update, delete and remove functionalities