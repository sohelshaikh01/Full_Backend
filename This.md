# Backend Project

Learning Full Complex Backend With Project

## Starting Full Backend Project

- Creating git repository of Project
- Model in app are designed will for future scope

Project Initialize repository
- npm init

- Initialize project readme.me
- pushing project on git hub


### Storing images in third party service
- upload photo and put on server tempary
- then put no cloudinary


### git/temp empty folder 
- Create `.gitkeep` file to track this


### git ignore file
To not get track and push on git this can be recreated
- Use .gitignore generators


### .env files setup
File to keep some variables values.
Not to push on git
create .env.sample

## Project Initialization

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

## Starting Database Connection

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


## Custom API Responses and API handling

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

### Elements in API 
(err, req, res, next)
- When `next` is used it is about middleware.

### Wrapper utility 
Creating generalize wrapper function that gets the code and executes in wanted form.
- Creating utils/`asyncHandler`.

### Standarizing API response and Error Formats
- Learn node api errors 
- Overwriting their properties as use
- utils/`ApiError`.
- Writing class to overwrite `Error` properties as need.

- Creating another ApiReponse File

## Notes:
It is complex project it contains all concept
It may takes months to complete  