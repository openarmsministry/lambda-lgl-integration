const axios = require("axios");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // TODO implement
  var flattenObject = function (ob) {
    var toReturn = {};

    for (var i in ob) {
      if (!ob.hasOwnProperty(i)) continue;

      if ((typeof ob[i]) == 'object') {
        var flatObject = flattenObject(ob[i]);
        for (var x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) continue;

          toReturn[i + '.' + x] = flatObject[x];
        }
      } else {
        toReturn[i] = ob[i];
      }
    }
    return toReturn;
  };

  var obj = JSON.parse(event.body);
  if (obj.type === "charge.succeeded") {
    await stripe.customers.retrieve(obj.data.object.customer)
      .then(customer => {
        obj.data.object.email = customer.email;
        obj.data.object.metadata = customer.metadata;
      });
    var gift = parseFloat(obj.data.object.amount) / 100;
    obj.data.object.metadata.gift = gift.toString();
    obj.data.object.metadata.gift_date = new Date().toISOString();
  }

  const response = await axios.post(process.env.LGL_WEBHOOK_URL,
    flattenObject(obj)
  );

  return { statusCode: response.status };
  // return { 
  //     statusCode: 200,
  //     body: JSON.stringify(flattenObject(obj))
  // };
};