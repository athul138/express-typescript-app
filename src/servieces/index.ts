const bcrypt = require('bcrypt')

module.exports = {
    hashPassword: (password:string) => {

        if (password) {
            const saltRounds = 10;
            return bcrypt.hash(password, saltRounds);
        } else false

    },

    matchPassword:async (currentPassword:string, incomingPassword:string)  => {
        const match = await bcrypt.compare(incomingPassword, currentPassword );
        return match
    },

};
