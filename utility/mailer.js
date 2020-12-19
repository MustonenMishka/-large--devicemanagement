function emailSender(devices) {

    const nodemailer = require ('nodemailer');

    const transporter = nodemailer.createTransport({ // ADD YOUR HOST EMAIL ADDRESS HERE
        service: 'gmail',
        auth: {
            user: 'laurel.license.service@gmail.com',
            pass: 'imt630110'
        }
    });

    const mailOptions = {
        from: 'laurel.license.service@gmail.com',
        to: `${devices[0].email}, ${devices[0].email2}`,
        subject: 'Ключи активации Laurel зарегистрированы',
        text: `${devices.map(device => `Серийный номер: ${device.serial}, Ключ активации: ${device.hash} `).join('\n')}`
    };

    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent!')
        }
    });

}

module.exports = emailSender;