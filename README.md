# Dish Management Website

A modern and interactive web application that allows users to manage a collection of dishes , add new dishes, view them by category, edit their details, and delete them. This website communicates with a local JSON server and updates the DOM dynamically.


## Table of Contents
- Features
- Learning Goals
- Tech Stack
- Setup Instructions
- Project Structure
- API Endpoints

## Features
- Add new dish with name ,origin ,Description ,spice level and Dish image
- View dishes grouped by category
- Edit and update existing dish entries
- Delete dishes with confirmation
- Filter dishes by category via sidebar
- View first dish automatically on the specific Dish category 
- Responsive form toggling
- Smooth scroll to form on open

## Learning Goals
This project helps practice and reinforce:
- Accessing and manipulating the DOM using JavaScript
- Communicating with a RESTful API (`GET`, `POST`, `PATCH`, `DELETE`)
- Organizing and displaying data by category
- Implementing dynamic event handling
- Improving UI/UX with feedback and animations

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** JSON Server
- **Development Tools:** Live Server, VS Code

## Setup Instruction
**Follow these steps to set up and run the Dish Management App on your computer:**

1.Download or Clone the Project Folder

2.Extract the ZIP file to a location on your computer.

3.Install JSON Server 
-Open your computer’s terminal or command prompt.
-Type: npm install -g json-server
-This installs the tool that simulates a backend server.

4.Check for the db.json File
-This file contains the data (list of dishes) that the app will use.

5.Start the JSON Server
-Still in the terminal or command prompt, navigate to the project folder.
-Type: json-server --watch db.json
-This will start the backend and provide an API at:
http://localhost:3000/dishes

6.Launch the App in Your Browser.
-Open it using a browser like Chrome or Firefox.
-you can use live server.

7.You should now see the Dish Management App.
-Interact with the App
-You can view a list of dishes.
-Use the form to add new dishes.
-Edit or delete dishes using the provided buttons.

## Author
**Vivian Gichure**
- Frontend Developer | Backend Developer
- Email: viviangichure@gmail.com
- GitHub: https://github.com/viviangichuregithub/Code-Challange-3
