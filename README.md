## Northcoders News API

## About
A RESTful API for Northcoders News, a news aggregation site based on Reddit. 

Built with Node.js, Express.js, MongoDB and Mongoose.

Testing was carried out using Mocha, Chai and Supertest.

## Set Up
- To check if ```Node.js``` is installed on your machine open a terminal window and enter:
  ```
  $ node -v
  ```
  If you do not already have Node.js installed follow the instructions on [this guide](https://nodejs.org/en/download/package-manager/).

- To check if ```npm``` is installed on your machine enter this command in you terminal window: 
  ```
  $ npm -v
  ```
  If you do not have npm already installed follow [this guide](https://www.npmjs.com/get-npm) to set it up.

- To check if ```git``` is installed on your machine enter the following in your terminal window: 
  ```
  $ git --version
  ```
  If you do not already have git installed on your machine follow [this guide](https://git-scm.com/).

- To check if ```MongoDB``` is installed on your machine enter this command in you terminal window:
  ```
  $ mongod --version
  ```
  If you do not have MongoDB already installed, follow [this guide](https://docs.mongodb.com/manual/installation/).

## Installation

To run this project you will need to clone this repository onto your local machine.
  ```
  $ git clone https://github.com/dzewelina/BE-FT-northcoders-news.git
  ```
Navigate inside the folder and install all dependencies by entering the following commands on your terminal window:
  ```
  $ cd BE-FT-northcoders-news
  $ npm install
  ```
Open another terminal window and enter the following command to connect to the database and keep it running: 
  ```
  $ mongod
  ```
In your first terminal window enter the following command to populate the database: 
  ```
  $ node seed/seed.js
  ```
Finally to run the server enter the following command in your terminal window: 
  ```
  $ npm start
  ```
This will run the server on port 4000. All endpoints can be found locally on ```http://localhost:4000```.

## Testing

To test the API navigate to the project directory and enter the following command:
  ```
  $ npm test
  ```

## API Routes
```
GET /api/topics
```
Returns all the topics

```
GET /api/topics/:topic/articles
```
Returns all the articles for a certain topic

```
GET /api/articles
```
Returns all the articles

```
GET /api/articles/:article_id/comments
```
Returns all the comments for an individual article

```
POST /api/articles/:article_id/comments
```
Adds a new comment to an article. Requires body with a comment key and value pair, e.g: {"comment": "This is my new comment"}

```
GET /api/articles/:article_id
```
Returns an article for specified id

```
PUT /api/articles/:article_id
```
Increment or Decrement the votes of an article by one. Requires a vote query of 'up' or 'down', e.g: /api/articles/:article_id?vote=up

```
PUT /api/comments/:comment_id
```
Increment or Decrement the votes of a comment by one. Requires a vote query of 'up' or 'down', e.g: /api/comments/:comment_id?vote=down

```
DELETE /api/comments/:comment_id
```
Deletes a comment

```
GET /api/users/:username
```
Returns an object with the profile data for the specified user

```
GET /api/users/:username/articles
```
Returns all the articles for a certain user