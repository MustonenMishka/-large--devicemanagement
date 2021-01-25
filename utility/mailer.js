function emailSender(devices) {
    if (!devices || devices.length === 0) {
        return
    }

    const nodemailer = require ('nodemailer');

    const transporter = nodemailer.createTransport({ // ADD YOUR HOST EMAIL ADDRESS HERE
        service: 'gmail',
        auth: {
            user: 'YOUR_EMAIL',
            pass: 'YOUR_EMAILS_PASSWORD'
        }
    });

    const mailOptions = {
        from: 'YOUR_EMAIL',
        to: `${devices[0].email}, ${devices[0].email2}`,
        subject: 'Devices license keys were successfully registered',
        text: `${devices.map(device => `Device type: ${device.type.name}${device.type.props[0] ? '-'+device.type.props[0].propvalue : ''}, Serial №: ${device.serial}, License key: ${device.hash} `).join('\n')}`
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