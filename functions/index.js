const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp();

exports.resetTreasures = functions.https.onRequest((request, response) => {

  minLatitude = 32.959580;
  maxLatitude = 33.246028;
  minLongitude = -96.975756;
  maxLongitude = -96.532377;

  databaseReference = admin.database().ref('Treasures');

  treasures = [];

  for (var i = 0; i < 10000; i++) {
    treasures[i] = {
      latitude: getRandomNumberBetween(minLatitude, maxLatitude),
      longitude: getRandomNumberBetween(minLongitude, maxLongitude),
      rarity: getRarity()
    };
  }

  databaseReference.set(treasures);
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
      return 'LEGENDARY';

    case(rand < 0.006):
      return 'ULTRA_RARE';

    case(rand < 0.015):
      return 'RARE';

    case(rand < 0.305):
      return 'UNCOMMON';

    default:
      return 'COMMON';
  }
}
//(33.246028, -96.975756)
//(32.959580, -96.532377)
