const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

/**
 * Sends the recipient of a friend request a notification to the last
 * device they were logged in on
 *
 * @param  {DataSnapshot} snapshot A snapshot of the portion of the database that data was created in
 * @param  {EventContext} context  An object containing information about the path that data was created in
 * @return {Promise}               Promise that will send notification once created data has been downloaded
 */
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

/**
 * Function is called daily at midnight EST
 * Deletes all current treasures and regenerates them
 * Resets the variable that keeps track of treasures the user has found on a particular day
 *
 * @param  {EventContext} context Object containing information about the time and authorization of the function call
 * @return {Promise}              Null promise that indicates that no action is needed after function is executed
 */
exports.dailyReset = functions.pubsub.schedule('@daily')
  .timeZone('America/New_York')
  .onRun(context => {
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

/**
 * @param  {Number} min Inclusive lower bound of random number
 * @param  {Number} max Inclusive upper bound of random number
 * @return {Number}     Random number between min and max
 */
function getRandomNumberBetween(min, max) {
  return Math.random() * (max - min + 1) + min
}

/**
 * @return {String} Randomly generated rarity based on predefined probabilities
 */
function getRarity() {

  rand = Math.random()
  switch(true) {

    //1%
    case(rand <= 0.01):
      return 'LEGENDARY'

    //4%
    case(rand <= 0.05):
      return 'ULTRA_RARE'

    //10%
    case(rand <= 0.15):
      return 'RARE'

    //30%
    case(rand <= 0.45):
      return 'UNCOMMON'

    //55%
    default:
      return 'COMMON'
}

