const mongodb = require('mongodb').MongoClient;
// const url = process.env.MLAB_URI;
const url = "mongodb://localhost:27017/testdb";

module.exports = {
  storeSearch: (searchTerm, callback) => {
    mongodb.connect(url, (err, db) => {
      if (err) {
        console.error('Unable to connect to the mongo server. Error: ', err);
        callback(err);
      } else {
        console.log('Connection for storeSearch established to ', url);

        var coll = db.collection('searchIndex');

        coll.insert({searchTerm: searchTerm, when: new Date().toUTCString()});
        db.close();
      }
    });
  },
  lastSearches: callback => {
    mongodb.connect(url, (err, db) => {
      if (err) {
        console.error('Unable to connect to the mongo server. Error: ', err);
      } else {
        console.log('Connection for lastSearches established to ', url);

        var coll = db.collection('searchIndex');

        coll.find().sort({$natural: -1})
        .limit(10)
        .toArray((err, result) => {
          if (err) {
            console.error('Error! Unable to find latest searches', err);
            callback(err, null);
          } else {
            callback(null, result);
          }
        });
        db.close();
      }
    });
  }
};
