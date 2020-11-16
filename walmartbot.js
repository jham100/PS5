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
const currentUrl = 'https://www.walmart.com/ip/Sony-PlayStation-5-Digital-Edition/493824815';
// const currentUrl = 'https://www.walmart.com/ip/Sony-PlayStation-5-DualSense-Wireless-Controller/615549727';

let index = 0;
const notify = () => {
client.messages
            .create({
                body: `PS5 available at Walmart - ${currentUrl}` ,
                from: '+19379155940',
                to: '+18458939193'
            })
            console.log("CALLING");
            client.calls.create({
            twiml: '<Say>Go get a PS5 at Target!</Say>',
             to: '+18458939193',
             from: '+19379155940'
           })
        };

async function check_avail() {
    if (index === 0) {
    await nightmare
  .goto(currentUrl)
  .wait(3000)
  .exists('.prod-product-cta-add-to-cart')
  .then(function (result) {
    if (result) {
      notify();
      console.log("notify hit");
        // setTimeout(()=>{
        //     notify()
        //   }, 180000)
    } else {
        index = 1
        setTimeout(()=>{
            check_avail();
        },interval);
        console.log("Could not buy a PS5. Fuck.")
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
    .exists('.prod-product-cta-add-to-cart')
    .then(function (result) {
      if (result) {
        notify();
        // console.log("notify hit");
        //   setTimeout(()=>{
        //     notify()
        //   }, 180000)
      } else {
          setTimeout(()=>{
              check_avail();
          },interval);
          console.log("Could not buy a PS5. Fuck.")
      }
      return;
  })
    .catch(error => {
      console.error('Search failed:', error)
    })
}
};
check_avail();
// setInterval(()=>check_avail(),10000);