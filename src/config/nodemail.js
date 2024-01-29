const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config()

const transporter = nodemailer.createTransport({
  host: 'smtp.sapo.pt',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});


exports.sendEmail = async (userEmail, user, adress, id) => {
 
  await transporter.sendMail({
    from: 'mercado_poupanca@sapo.pt', 
    to: `${userEmail}`, 
    subject: "Encomenda recebida", 
    text: `A sua encomenda em nome de ${user} para, ${adress}, foi recebida e já se encontra em processamento.`, // plain text body html body
  });

  await transporter.sendMail({
    from: 'mercado_poupanca@sapo.pt', 
    to: 'inaciomarques128@gmail.com', 
    subject: "Encomenda recebida", 
    text: `Uma encomenda em nome de ${user} para, ${adress}, foi recebida, em pagamento contra-reembolso, com o id de ${id}.`, // plain text body html body
  });

  return true;
}

exports.sendVerify = async (userEmail, id) => {
 
  const info = await transporter.sendMail({
    from: 'mercado_poupanca@sapo.pt', 
    to: `${userEmail}`, 
    subject: "Encomenda recebida", 
    text: `Verifique a sua conta em https://mercadopoupanca.azurewebsites.net/verify?id=${id}.`, // plain text body html body
  });

  return true
}