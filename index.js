// const axios = require('axios')

exports.handler = async (event) => {
    // TODO implement
  var flattenObject = function (ob) {
    var toReturn = {}

    for (var i in ob) {
      if (!ob.hasOwnProperty(i)) continue

      if ((typeof ob[i]) === 'object') {
        var flatObject = flattenObject(ob[i])
        for (var x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) continue

          toReturn[i + '.' + x] = flatObject[x]
        }
      } else {
        toReturn[i] = ob[i]
      }
    }
    return toReturn
  }

  var obj = JSON.parse(event.body)
  if (obj.type === 'charge.succeeded') {
    // Stripe secret key is different for live vs test.
    // RequestOptions.builder().setApiKey(process.env.STRIPE_SECRET_KEY).build();

    obj.data.object.email = 'temp email'
  }
    // var obj = flattenObject(JSON.parse(event.body));
    // const response = await axios.post(process.env.LGL_WEBHOOK_URL,
    //     flattenObject(JSON.parse(event.body))
    // );

    // console.log(JSON.stringify(event, null, 2));
    // return { statusCode: response.status };
  return {
    statusCode: 200,
    body: JSON.stringify(flattenObject(obj))
  }
}
