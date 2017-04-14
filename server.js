// loading environment variables
require('dotenv').config()
var url = process.env.MONGODBURL

// loading modules
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient

// using body-parser in express to parse the JSON in the body
app.use(bodyParser.json())

// home route is used to perform CRUD operations on devices
app.get('/', function (request, response) {
  // connect to the mongo database
  MongoClient.connect(url, function (err, db) {
    if (err) {
      response.status(500).send('Unhandled error')
    }

    // loading the collection
    var collection = db.collection('test')

    // creating query
    var query = {}

    // searching in the database
    collection.find(query).toArray(function (err, devices) {
      if (err) {
        response.status(500).send('Unhandled error')
      }
      if (devices.length === 0) {
        response.status(404).send('Document not found')
      } else {
        // sending the found devices
        response.status(200).send(devices)
      }
    })
    db.close()
  })
})

app.post('/', function (request, response) {
  // connect to the mongo database
  MongoClient.connect(url, function (err, db) {
    if (err) {
      response.status(500).send('Unhandled error')
    }

    // loading the collection
    var collection = db.collection('test')

    // creating the document to insert
    var doc = request.body

    // inserting the device
    collection.insert(doc, function (err, records) {
      if (err) {
        response.status(500).send('Unhandled error')
      }
      // return code 204 NO CONTENT
      response.status(204).send()
    })
  })
})

app.delete('/', function (request, response) {
  // connect to the mongo database
  MongoClient.connect(url, function (err, db) {
    if (err) {
      response.status(500).send('Unhandled error')
    }

    var collection = db.collection('test')

    // creating query
    var query = {}

    collection.remove(query, function (err, result) {
      if (err) {
        response.status(500).send('Unhandled error')
      }
      response.status(200).send(result)
      db.close()
    })
  })
})
// listen for requests
var server = app.listen(process.env.port || process.env.PORT || 80, function () {
  console.log('Your app is listening on port ' + server.address().port)
})

module.exports = server
