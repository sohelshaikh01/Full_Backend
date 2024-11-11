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



## Notes:
It is complex project it contains all concept
It may takes months to complete  