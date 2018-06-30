'use strict';
const loopbackUtils = require('loopback/lib/utils');
const groupBy = require('../../server/helpers/transformer').groupBy
const ONE_HOUR = 60 * 1000;
module.exports = function (Oneminutedata) {

  /**
   * generates report
   * @param {Function(Error, object)} callback
   */

  Oneminutedata.generateReport = function (callback) {
    callback = callback || loopbackUtils.createPromiseCallback();
    let totalCount = 0;
    Oneminutedata.find({
      where: {
        timestamp: {
          gt: Date.now() - ONE_HOUR
        }
      },
      fields: {
        marketName: true
      }
    }).then(data => {
      totalCount = data.length;
      console.log(JSON.stringify(data))
      return groupBy(data, 'marketName')
    }, err => callback(err))
      .then(data => {
        if (data) {
          let dataPointsPerMarket = {}
          for (let market in data) {
            dataPointsPerMarket[market] = data[market] * 100 / 60
          }
          callback(null, {
            numberOfMarkets: Object.keys(data).length,
            numberOfDataPointsExpected: 60,
            dataPointsAvailable: (totalCount * 100) / (Object.keys(data).length * 60),
            dataPointsPerMarket: dataPointsPerMarket
          })
        } else {
          callback()
        }
      }, err => callback(err))
    return callback.promise;
  };
};
