const sgMail = require('@sendgrid/mail');
const APIKey = process.env.SENGGRID_API_KEY;

sgMail.setApiKey(APIKey);

const sendWelcome = (email,name)=> {
  sgMail.send({
    to: email,
    from: 'mssg_2211@hotmail.com',
    subject: 'Welcome to task app',
    text: `Welcome to the app, ${name}. `
  })
}
const sendCancelationEmail = (email,name)=> {
  sgMail.send({
    to: email,
    from: 'mssg_2211@hotmail.com',
    subject: 'We sorry to say goodbye!',
    text: `Hi ${name}, tell us what we did wrong so we can fix it!`
  })
}
module.exports = {
  sendWelcome,
  sendCancelationEmail
}