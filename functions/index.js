const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

exports.sendFriendRequestNotification = functions.database.ref('Users/{recipient}/friendRequests/{friendRequestId}')
    .onCreate((snapshot, context) => {

        const recipient = context.params.recipient
        const sender = snapshot.child('username').val()

        const recipientInstanceTokenPromise = admin.database().ref(`Users/${recipient}/instanceToken`).once('value')

        return recipientInstanceTokenPromise.then(result => {
            const instanceToken = result.val();

            const payload =
            {
                notification: {
                    title: 'Hidden Treasures',
                    body: `You have received a friend request from ${sender}`,
                }
            }

            return admin.messaging().sendToDevice(instanceToken, payload)

        })

    })

exports.dailyReset = functions.https.onRequest((request, response) => {

  minLatitude = 32.959580
  maxLatitude = 33.246028
  minLongitude = -96.975756
  maxLongitude = -96.532377

  treasuresReference = admin.database().ref('Treasures')
  usersReference = admin.database().ref('Users')

  treasures = []

  for (var i = 0; i < 10000; i++) {
    treasures[i] = {
      latitude: getRandomNumberBetween(minLatitude, maxLatitude),
      longitude: getRandomNumberBetween(minLongitude, maxLongitude),
      rarity: getRarity(),
      id: i
    }
  }

  treasuresReference.set(treasures)
  usersReference.on('value', dataSnapshot => {
    dataSnapshot.forEach(userSnapshot => {
      var username = userSnapshot.child('username').val()
      usersReference.child(`${username.toString()}/treasuresFoundTodayIDs`).set([])
    })
  })

  return null
});

function getRandomNumberBetween(min, max) {
  return Math.random() * (max - min + 1) + min
}

function getRarity() {
  rand = Math.random()
  switch(true) {

    case(rand < 0.001):
      return 'LEGENDARY'

    case(rand < 0.006):
      return 'ULTRA_RARE'

    case(rand < 0.015):
      return 'RARE'

    case(rand < 0.305):
      return 'UNCOMMON'

    default:
      return 'COMMON'
  }
}
//(33.246028, -96.975756)
//(32.959580, -96.532377)
