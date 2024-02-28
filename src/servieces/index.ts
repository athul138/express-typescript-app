const bcrypt = require('bcrypt')

module.exports = {
    hashPassword: (password) => {

        if (password) {
            const saltRounds = 10;
            return bcrypt.hash(password, saltRounds);
        } else false

    },


    matchPassword: (currentPassword, incomingPassword) => {

        console.log("currentPassword -->>>", currentPassword)
        console.log("incomingPassword-->>>", incomingPassword)


        let passwordMatch = bcrypt.compare(incomingPassword, currentPassword, function (err, result) {
            return result
        });
        console.log("passwordMatch-->>>", passwordMatch)
        return passwordMatch

    },

};
