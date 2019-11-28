import React from 'react';
import firebase from "firebase";
import db from './FirebaseInit.js';
var moment = require('moment');


const getClosestDate = (dates, target) => {
  if (!target) target = Date.now()
  else target = moment(target).format("x");
  var nearest = Infinity
  var winner = -1

  dates.forEach(function (date, index) {
      const tempDate = moment(date, "MM-DD-YYYY HH:mm").format("x");
      var distance = Math.abs(tempDate - target)
      if (distance < nearest) {
          nearest = distance
          winner = index
      }
  })

  return winner
}

const getDayChange = (coin) => {
  if (coin && coin.data && coin.data.length > 0) {

      let dates = coin.data.map(item => item.date);

      const date_closest_all = getClosestDate(dates, moment.utc());
      const date_closest_30 = getClosestDate(dates, moment.utc().subtract(24 * 30, 'hours'));
      const date_closest_7 = getClosestDate(dates, moment.utc().subtract(24 * 7, 'hours'));
      const date_closest_1 = getClosestDate(dates, moment.utc().subtract(24, 'hours'));

      let currentMemberCount = coin.data[date_closest_all].memberCount;
      let previousMemberCount_30 = coin.data[date_closest_30].memberCount;
      let previousMemberCount_7 = coin.data[date_closest_7].memberCount;
      let previousMemberCount_1 = coin.data[date_closest_1].memberCount;

      let dayChange1 = currentMemberCount - previousMemberCount_1;
      let dayChange7 = currentMemberCount - previousMemberCount_7;
      let dayChange30 = currentMemberCount - previousMemberCount_30;
      return {
          dayChange1,
          dayChange7,
          dayChange30,
          memberCount: currentMemberCount
      };
  }
}

const fetchDataFromDatabase = () => {
  return new Promise((res, rej) => {
    db.collection("coins")
      .get()
      .then(querySnapshot => {
        var coins = querySnapshot.docs.map(doc => doc.data());
        if (coins.length > 0) {
          // adds 'memberCount' and 'membersOnline' to each coin
          for (var i = 0; i < coins.length; i++) {
            const coin = coins[i];

            if (coin.data && coin.data.length > 0) {
              const lastCoin = coin.data[coin.data.length - 1]
              coin.memberCount = lastCoin.memberCount
              coin.membersOnline = lastCoin.membersOnline
              coin.membersActive = lastCoin.membersActive

              var messageCount = 0;
              var coinData24 = coin.data.length - 24
              if (coin.data.length < 24) {
                coinData24 = 0
              }

              for (var j = coin.data.length - 1; j >= coinData24; j--) {
                if (coin.data[j].messageCount != undefined) {
                  messageCount += coin.data[j].messageCount;
                }
              }

              coin.messageCount = messageCount;

              let dayChanges = getDayChange(coin)
              coin.dayChange1 = dayChanges.dayChange1
              coin.dayChange7 = dayChanges.dayChange7
              coin.dayChange30 = dayChanges.dayChange30
            }
            // if(!coin.memberCount) coin.memberCount = dayChanges.memberCount
          }
          // adds 'dayChangeX' to each coin
          // for (var i = 0; i < coins.length; i++) {

          // const coin = coins[i];
          // }
          res(coins);
        } else {
          res([]);
        }
      }).catch((err) => {
        console.log(err);
        res([]);
      });
  })
}

export default fetchDataFromDatabase;