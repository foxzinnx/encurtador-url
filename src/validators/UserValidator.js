const { isEmail } = require('validator');

const userValidators = {
    email: {
        validator: function(email) {
            return isEmail(email);
        },
        message: 'E-mail inválido'
    },
    
    password: {
        validator: function(password) {
            return password && password.length >= 8;
        },
        message: 'A senha precisa ter no mínimo 8 caracteres'
    },
    
    strongPassword: {
        validator: function(password) {
            const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            return strongPasswordRegex.test(password);
        },
        message: 'A senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e símbolo'
    }
};

module.exports = userValidators;