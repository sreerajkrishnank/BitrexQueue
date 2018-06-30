'use strict';
const loopbackUtils = require('loopback/lib/utils');
const groupBy = require('../../server/helpers/transformer').groupBy
const ONE_HOUR = 60 * 1000;
module.exports = function(Thirtyminutesdata) {
  /**
   * generates report
   * @param {Function(Error, object)} callback
   */

  Thirtyminutesdata.generateReport = function (callback) {
    callback = callback || loopbackUtils.createPromiseCallback();
    let totalCount = 0;
    Thirtyminutesdata.find({
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
      return groupBy(data, 'marketName')
    }, err => callback(err))
      .then(data => {
        if (data) {
          let dataPointsPerMarket = {}
          for (let market in data) {
            dataPointsPerMarket[market] = data[market] * 100 / 2
          }
          callback(null, {
            numberOfMarkets: Object.keys(data).length,
            numberOfDataPointsExpected: 2,
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
