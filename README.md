
# NerfUS: A Shooting Range Game

*S5 Project, Team P05.*

NerfUS is a shooting range game using Nerfs, embedded systems, and a web app on a server.
This project contains the web server part of the game.
The web app is used to show the game interfaces and menus, and communicate with a mesh networks of embedded systems to elevate wooden targets in real-time.

----------

## Installation instructions
Theses are the steps to run locally the server on your computer.

### 1. Download NerfUS

Download the latest server app of NerfUS from this repo.


### 2. Installing Node.JS

- Grab the latest LTS version of Node.JS from the web site https://nodejs.org/en/.
- Run the installer
- Follow the steps


### 3. Intalling Project Dependencies

Open a **CMD** under the project folder **./node-server**.

In that folder, their is a file named package.json, which contains all the necessary dependencies for this project.

In your CMD, simply run this command:

    npm install

This will download all the dependencies from the package.json file.


### 4. Installing and starting Bitvise tunneling

Before running the server locally on your working station, you need to setup a tunnel to the real NerfUS server database.

This will allow you local server to fetch data from the database, and it's necessary for the server to be able to run.

Download & install **Bitvise Tunnelier** here : https://www.bitvise.com/download-area.

Make a tunnel to the server running the database instance.

*Note that Bitvise must be running as long as you want to run the server locally.


### 5. Start the server in debug mode

Open two **CMD** terminals into the **./node-server folder**.

On the first on, run this:

	node_modules\.bin\node-inspector

It will show you an local web address. This is the **server-side debugging tool**. Use chrome for better debugging.

On the second CMD, run this:

    node_modules\.bin\nodemon --debug

Nodemon will start the node server, and also listen for any changes in the code. When that happens, it will automatically restart the server.

*While their is a lot of way to run a node-js server, this one is great, because it give you some powerful debugging features.*

If you want to be able to run nodemon and node-inspector with any node.js project, install the packages globally:

    npm install -g nodemon node-inspector

After that, you will be able to simply run these commands:

    node-inspector 
    nodemon


***That's all!***