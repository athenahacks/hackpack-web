# AthenaHacks Web Dev Hackpack

We'll be building an app that will take user input, save it to a database, and display it on the page. Building a full stack application like this means that you'll write front-end, back-end, and database code. Use this as a starting point and get familiar with all parts of the stack so you can hack a cool site at AthenaHacks!

## Getting Started

#### Installations
Make sure you have the following installed:

 - [Atom](https://atom.io/) or other text editor
 - [Homebrew](http://brew.sh/): Homebrew is a package manager that makes it easy to install other packages. Install it by running the following command on your terminal:
    ```sh
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    ```
    
 - [Node](https://nodejs.org/en/): Install this using Homebrew by running the following command on your terminal:
    ```sh 
    brew install node
    ```
    
 - [SQLite](https://www.sqlite.org/): SQLite is a file-based database. It is commonly used for development and testing and it's the easiest database to get started with. Install this using this command:
    ```sh 
    brew install sqlite3
    ```

#### Cloning the repository

To start, make sure you have git installed, and clone this repository
```sh
git clone git@github.com:athenahacks/hackpack-web.git
```
Go to the directory you cloned your repository in and install the necessary packages: 
```sh
cd hackpack-web
npm install
```
The repository has a `package.json` folder which essentially lists out all the dependencies of your project. The second command will go through all the dependencies and install them. This might take a while. 

## Setting up the backend 
The entry point for our project will be a file called `server.js`. To create this file, navigate to the cloned repo in your terminal and enter the following command:
```sh
atom server.js
```
This file will live at the top of your repository and will be where you store server-side code. Copy the following code into `server.js`: 
```sh
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var knex = require('./db/knex');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

app.get('/ideas', function(req, res) {
  knex('ideas').select()
  .then(function(data){
    res.send(data);
  });
});

app.post('/ideas', function(req, res) {
  knex('ideas').insert(req.body)
  .then(function(id){
    res.redirect('/');
  });
});

app.listen(3000, function(){
  console.log('Listening on Port 3000');
});
```

Now let's walk through the code:

 - Lines 1 and 2: Importing Express and setting up an [Express](https://expressjs.com/) application. Express is a Node.js web application framework.
 - Lines 3 and 4: Importing some of the dependencies you installed earlier in order to use them in this file. `body-parser` allows you to read data that the client sends over in a request. `knex` allows you to interact with your database in JavaScript. 
 - Line 6: Mounts the BodyParser as middleware, meaning that every request comes into the server has to pass through this module. 
 - Next block of code is a `get` route. This allows us to get data from the database. This function gets all the data from the database and sends it back to the client to do whatever it wishes with - it can display it or store it. Later on, you'll see where we display it! 
 - Next block of code is a `post` route. This allows us to post (add or update) data to the database. The second line in this block inserts the data in the request body into the `ideas` table. 
 - Next block of code binds the server to port 3000 on our computer. This means we can access our website at `localhost:3000` when we run it later on. 
 
## Setting up the Database 
In the last section, we set up the server which read and wrote data to a database. Now, we're going to set up that database. Navigate to the clone repository in your directory. We are going to create a `db/` folder to store the files that make up our database:
```sh
mkdir db
cd db/
```
We'll be using [Knex](http://knexjs.org/) and [SQLite](https://www.sqlite.org/) for the database. To create a SQLite database, type this into the terminal:
```sh
sqlite3 ideas.db
```
A `sqlite>` promt will display, and you can enter for following commands one at a time to create a table named 'Ideas', insert values into it, and display them: 
```sh
create table ideas(idea varchar(255));
insert into ideas values("Have fun at AthenaHacks!");
insert into ideas values("Make a cool web app at AH 2k17 :)");
select * from ideas;
```
You've just created the database! To exit the `sqlite` prompt, hit `CTRL + D`. 

Create a new file called `knex.js` in the `db/` folder. Enter the following code and save the file:
```sh 
var config = require('../knexfile')['development'];
var knex = require('knex')(config);

module.exports = knex;
```

Navigate back up to the root of your project by typing `cd ..` and create a new file called `knexfile.js`:
```sh
atom knexfile.js
```
Copy and paste the following code into the file:
```sh
module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: 'db/ideas.db'
    },
    useNullAsDefault: true
  }

};
```

`knexfile.js` and `db/knex.js` are setting up the Knex instance available to your application so it knows where to find and store the data.

## Home Stretch: Building the client-side components 
The current repository contains 2 files in the `public` folder: `index.html` and `main.css`. `index.html` contains basic html which provides the structure of the interface that the user sees. It has a input field, a button, and an area to display the list from the database. `main.css` has styling for the landing page.

Now we're going to add some functionality to the client-side so we can get the data from our database and display it, as well as be able to write data back to the database. 

Navigate to your clone repo on your terminal, and create a `client.js` file inside of the `public/` folder: 
```sh
cd public
atom client.js
```
In your `client.js` file, write the following code and save: 
```sh
$(document).ready(function(){
  getIdeas();
});

function getIdeas(){
  $.get('/ideas', function(data){
    console.log(data);
    renderData(data);
  });
}

function renderData(data){
  for (var i = 0; i < data.length; i++) {
    $('ul').append('<li>' + data[i].idea + '</li>');
  }
}   
``` 

Walkthrough of the code: 

 - The first block of code is what gets called as soon as the website loads. In our case, when the website loads, it calls the `getIdeas()` function. 
 - The `getIdeas()` function makes a get request to the `/ideas` route (the same as we created on `server.js` in order to get all the data. It then calls the `renderData()` function with the data that is returned from the database.
 - The `renderData()` function goes through all the data passed in as an arugment and appends it (or adds it) to the list on the home page. 
 

## Building and running the app 
We're done! To start the app, go back to your terminal on the root directory and type: 
```sh
node server.js
```
Now open your browser and navigate to `localhost:3000` and you should see this:
![screenshot](https://github.com/athenahacks/hackpack-web/blob/master/screenshot.png)

#### Credit
Built by Marsela Sulku, based on [this tutorial](http://www.galvanize.com/learn/learn-to-code/build-full-stack-app-40-minutes/)! 
