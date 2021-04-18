const Nightmare = require('nightmare');
const nightmare = Nightmare( {
    openDevTools: {
    mode: 'detach'
  },
    show: false
});
require('dotenv').config();
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const interval = 30000;
const currentUrl = 'https://www.amazon.com/PlayStation-5-Digital/dp/B08FC6MR62';

let index = 0;
const notify = () => {
client.messages
            .create({
                body: `PS5 available at Amazon - ${currentUrl}` ,
                from: '+xxxxxxxxxxx',
                to: '+xxxxxxxxxxx'
            })
            console.log("CALLING");
            client.calls.create({
            twiml: '<Say>Go get a PS5 at Amazon!</Say>',
             to: '+xxxxxxxxxxx',
             from: '+xxxxxxxxxxx'
           })
        };

async function check_avail() {
    if (index === 0) {
    await nightmare
  .goto(currentUrl)
  .wait(3000)
  .exists('#add-to-cart-button')
  .then(function (result) {
    if (result) {
      notify();
      console.log("notify hit");
    } else {
        index = 1
        setTimeout(()=>{
            check_avail();
        },interval);
        console.log("Could not buy a PS5.")
    }
    return;
})
  .catch(error => {
    console.error('Search failed:', error)
  })
} else {
    await nightmare
    .refresh()
    .wait(3000)
    .exists('#add-to-cart-button')
    .then(function (result) {
      if (result) {
        notify();
        console.log("notify hit");
      } else {
          setTimeout(()=>{
              check_avail();
          },interval);
          console.log("Could not buy a PS5.")
      }
      return;
  })
    .catch(error => {
      console.error('Search failed:', error)
    })
}
};
check_avail();