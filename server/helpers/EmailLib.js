/**
 * Created by payyan1 on 14/07/17.
 */
var nodemailer = require('nodemailer');
var loopback = require('loopback');
var path = require('path')
var Promise = require('bluebird')
var sesTransport = require('nodemailer-ses-transport');
var transport = nodemailer.createTransport(sesTransport({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'eu-west-1',
  rateLimit: 2 // do not send more than 5 messages in a second
}));

var sendMail = function (mailData) {
  return new Promise((resolve, reject) => {
    console.log(mailData)
    transport.sendMail({
      from: mailData.from,
      to: mailData.to,
      bcc:mailData.bcc,
      subject: mailData.subject,
      text:mailData.text
    }, function (err, info) {
      if (err) {
        console.log(err)
        reject(err)
      }
      else {
        console.log(info)
        resolve(info)
      }
    })
  })

}

module.exports.sendReportEmail = function (reportData) {
  let reportEmailText = '';
  console.log(reportData);
  reportData.forEach((data) => {
    reportEmailText += 'Number of markets: ' + data.numberOfMarkets + '\n';
    reportEmailText += 'Number of data points expected: ' + data.numberOfDataPointsExpected + '\n';
    reportEmailText += '% of data points available: ' + data.dataPointsAvailable + '\n';
    reportEmailText += '% of data points available for each market: ';
    for (let market in data.dataPointsPerMarket) {
      reportEmailText += market + '--> ' + data.dataPointsPerMarket[market] + '\n'
    }
    reportEmailText += '\n\n';
  })
  console.log(reportEmailText)
  return sendMail({
    from: 'BitRex Support <support@himalayanbase.com>',
    to: 'edul@mudrex.com',
    subject: 'BitRex Last Hour Report',
    bcc:'sreerajkrishnan.k@gmail.com',
    text: reportEmailText
  })
}
