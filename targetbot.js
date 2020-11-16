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
const currentUrl = 'https://www.target.com/p/playstation-5-digital-edition-console/-/A-81114596';
// const currentUrl = 'https://www.target.com/p/dualsense-wireless-controller-for-playstation-5/-/A-81114477';

let index = 0;
const notify = () => {
client.messages
            .create({
                body: `PS5 available at Target - ${currentUrl}` ,
                from: '+19379155940',
                to: '+18458939193'
            })
            console.log("CALLING");
            client.calls.create({
            twiml: '<Response><Say>Go get a PS5 at Target!</Say></Response>',
             to: '+18458939193',
             from: '+19379155940'
           })
        };

async function check_avail() {
    if (index === 0) {
    await nightmare
  .goto(currentUrl)
  .wait('#storeId-utilityNavBtn')
  .click('#storeId-utilityNavBtn')
  .wait('button[data-test=storeId-listItem-setStore]')
  .click('button[data-test=storeId-listItem-setStore]')
//   .click('#account')
//   .click('#accountNav-signIn a')
//   .wait('#username')
//   .type('#username', process.env.username)
//   .type('#password', process.env.pass)
//   .click('input [name="keepMeSignedIn"]')
//   .click("#login")
  .wait(3000)
  .exists('button[data-test=orderPickupButton]')
  .then(function (result) {
    if (result) {
      notify();
      console.log("notify hit");
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
    .exists('button[data-test=orderPickupButton]')
    .then(function (result) {
      if (result) {
        notify();
        console.log("notify hit");
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