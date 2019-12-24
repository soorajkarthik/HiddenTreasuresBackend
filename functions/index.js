const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp();

exports.resetTreasures = functions.https.onRequest((request, response) => {

  minLatitude = 32.959580;
  maxLatitude = 33.246028;
  minLongitude = -96.975756;
  maxLongitude = -96.532377;

  databaseReference = admin.database().ref('Treasures');

  treasrues = [];

  for (var i = 0; i < 10000; i++) {
    treasrues[i] = {
      latitute: getRandomNumberBetween(minLatitude, maxLatitude),
      longitude: getRandomNumberBetween(minLongitude, maxLongitude),
      rarity: getRarity()
    };
  }

  databaseReference.set(treasrues);
  console.log('hi i am a function and I am working :)');
  return null;
});

function getRandomNumberBetween(min, max) {
  return Math.random() * (max - min + 1) + min;
}

function getRarity() {
  rand = Math.random();
  switch(true) {

    case(rand < 0.001):
      return 'legendary';

    case(rand < 0.006):
      return 'ultra-rare';

    case(rand < 0.015):
      return 'rare';

    case(rand < 0.305):
      return 'uncommon';

    default:
      return 'common';
  }
}
//(33.246028, -96.975756)
//(32.959580, -96.532377)
