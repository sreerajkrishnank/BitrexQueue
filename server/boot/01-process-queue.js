/**
 * Created by payyan1 on 29/06/18.
 */
const ACTION_TYPES = require('../constants/dataTypes')
const transformAPIData = require('../helpers/transformer').transformAPIData;
const Promise = require('bluebird');
const sendReportEmail = require('../helpers/EmailLib').sendReportEmail;
module.exports = (app) => {

  app.post('/process-bitrex-data', (req, res, next) => {
    var payloadData = null;
    if (req.body.payload) {
      payloadData = transformAPIData(req.body.payload)
    }
    console.log(req.body.action_type)
    switch (req.body.action_type) {
      case ACTION_TYPES.ONE_MINUTE_DATA:
        app.models.OneMinuteData.create(payloadData)
          .then(resp => res.sendStatus(200), err => next(err))
        break;
      case ACTION_TYPES.FIVE_MINUTES_DATA:
        app.models.FiveMinutesData.create(payloadData)
          .then(resp => res.sendStatus(200), err => next(err))
        break;
      case ACTION_TYPES.FIFTEEN_MINUTES_DATA:
        app.models.FifteenMinutesData.create(payloadData)
          .then(resp => res.sendStatus(200), err => next(err))
        break;
      case ACTION_TYPES.THIRTY_MINUTES_DATA:
        app.models.ThirtyMinutesData.create(payloadData)
          .then(resp => res.sendStatus(200), err => next(err))
        break;
      case ACTION_TYPES.SIXTY_MINUTES_DATA:
        app.models.SixtyMinutesData.create(payloadData)
          .then(resp => res.sendStatus(200), err => next(err))
        break;
      case ACTION_TYPES.GENERATE_REPORT:
        Promise.all([
          app.models.OneMinuteData.generateReport(),
          app.models.FiveMinutesData.generateReport(),
          app.models.FifteenMinutesData.generateReport(),
          app.models.ThirtyMinutesData.generateReport(),
          app.models.SixtyMinutesData.generateReport()
        ]).then((reportData) => {
          res.send(sendReportEmail(reportData))
        }, err => next(err));
            break;
      default:
        next(new Error('not a valid action'));
    }
  })
};
