/**
 * Created by payyan1 on 29/06/18.
 */
module.exports.transformAPIData = (payloadData) => {
  return payloadData.map((item) => {
    return {
      timestamp: item.TimeStamp,
      marketName: item.MarketName,
      open: item.prevDay,
      close:null,
      bid:item.Bid,
      high:item.High,
      low:item.Low,
      volume:item.Volume
    }
  })
}


module.exports.groupBy = (data,key) =>{
  var groupData = {}
  data.forEach((item) => {
    groupData[item[key]] = groupData[item[key]]? groupData[item[key]]++ : 1
  })
  return groupData;
}
