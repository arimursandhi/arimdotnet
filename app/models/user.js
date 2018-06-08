var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt =  require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

var nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^(([a-zA-Z]{3,30})+[ ]+([a-zA-Z]{3,30})+)+$/,
        message: 'kolom Name : terdiri dari 2 Kata (huruf besar / kecil) yang terdapat spasi diantara keduanya, tidak ada special karakter atau nomor. Tiap kata min 3 kar max 30 kar | contoh = Andhi Cuprut'
    }),
    validate({
      validator: 'isLength',
      arguments: [3, 50],
      message: 'panjang nama harus berada diantara {ARGS[0]} dan {ARGS[1]} karakter  min 3 kar dan mak 50 kar'
    })
];

var emailValidator = [
    validate({
        validator: 'isEmail',
        message: 'pastikan email valid'
    }),
    validate({
      validator: 'isLength',
      arguments: [3, 50],
      message: 'panjang email harus berada diantara {ARGS[0]} dan {ARGS[1]} karakter  min 3 kar dan mak 50 kar'
    })
];

var usernameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 16],
        message: 'panjang username harus berada diantara {ARGS[0]} dan {ARGS[1]} karakter  min 3 kar dan mak 16 kar'
    }),
    validate({
      validator: 'isAlphanumeric',
      message: 'username harus berisi huruf dan angka saja'
    })
];

var passwordValidator = [
    validate({
      validator: 'matches',
      arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{4,35}$/,
      message: 'password : min 8 karakter , harus memiliki min : 1 kar huruf kecil, i kar huruf besar, 1 kar nomer, 1 kar special'
    }),
    validate({
      validator: 'isLength',
      arguments: [4, 35],
      message: 'panjang password harus berada diantara {ARGS[0]} dan {ARGS[1]} karakter min 4 kar dan mak..'
    })
];

var UserSchema = new Schema({
    name: { type: String, required: true, validate: nameValidator },
    username: { type: String, lowercase: true, required: true, unique: true, validate: usernameValidator },
    password: { type: String, required: true, validate: passwordValidator, select: false },
    email: { type: String, required: true, lowercase: true, unique: true, validate: emailValidator },
    active: { type: Boolean, required: true, default: false },
    temporarytoken: { type: String, required: true },
    resettoken: { type: String, required: false },
    permission: { type: String, required: true, default: 'user' }
});

UserSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, null, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
});

UserSchema.plugin(titlize, {
    paths: [ 'name' ]
});

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};



module.exports = mongoose.model('User', UserSchema);
