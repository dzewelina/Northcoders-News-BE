## Northcoders News API

### Background

We will be building the API which we used in the Northcoders News Sprint during the
Front End block of the course. Your mongoose models and a Database seed file have been done for you.

Look closely at the response you get for each route on http://northcoders-news-api.herokuapp.com/ You will notice that we also send data such as the comment and vote count for each article. You will need to think carefully about how to do this in your API.

You will need to get all your routes built up first as you can share the functionality between you `GET comments by id` route and the comment count on the articles response for example.

### Mongoose Documentation

The below are all model methods that you call on your models.

* [find](http://mongoosejs.com/docs/api.html#model_Model.find)
* [findOne](http://mongoosejs.com/docs/api.html#model_Model.findOne)
* [findOneAndUpdate](http://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate)
* [findOneAndRemove](http://mongoosejs.com/docs/api.html#model_Model.findOneAndRemove)
* [findById](http://mongoosejs.com/docs/api.html#model_Model.findById)
* [findByIdAndUpdate](http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate)
* [findByIdAndRemove](http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove)
* [update](http://mongoosejs.com/docs/api.html#model_Model.update)

There are also some methods that can be called on the documents that get returned. These are:

* [remove](http://mongoosejs.com/docs/api.html#model_Model-remove)
* [save](http://mongoosejs.com/docs/api.html#model_Model-save)
* [count](http://mongoosejs.com/docs/api.html#model_Model.count)

### Tasks

1. Seed your database with the main seed file `$ node seed/seed.js`
2. Build your express App
3. Mount an API Router onto your app
4. Define the routes described below
5. Define controller functions for each of your routes
6. Once you have all your routes start to tackle responding with the vote and comment counts on article requests like this http://northcoders-news-api.herokuapp.com/api/articles
7. Test your api routes!

### Routes
```
GET /api/topics
```
Get all the topics

```
GET /api/topics/:topic/articles
```
Return all the articles for a certain topic

```
GET /api/articles
```
Returns all the articles

```
GET /api/articles/:article_id/comments
```
Get all the comments for a individual article

```
POST /api/articles/:article_id/comments
```
Add a new comment to an article. This route requires a JSON body with a comment key and value pair
e.g: {"comment": "This is my new comment"}

```
GET /api/articles/:article_id
```
Get an article by article id

```
PUT /api/articles/:article_id
```
Increment or Decrement the votes of an article by one. This route requires a vote query of 'up' or 'down'
e.g: /api/articles/:article_id?vote=up

```
PUT /api/comments/:comment_id
```
Increment or Decrement the votes of a comment by one. This route requires a vote query of 'up' or 'down'
e.g: /api/comments/:comment_id?vote=down

```
DELETE /api/comments/:comment_id
```
Deletes a comment

```
GET /api/users/:username
```
Returns a JSON object with the profile data for the specified user.

```
GET /api/users/:username/articles
```
Return all the articles for a certain user
