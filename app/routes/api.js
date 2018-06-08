
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = 'harrypotret';
const nodemailer = require('nodemailer'); // Import Nodemailer Package
///var sgTransport = require('nodemailer-sendgrid-transport'); // Import Nodemailer Sengrid Transport Package



module.exports = function(router) {

/*
  var options = {
    auth: {
      api_user: 'arimursandhi',
      api_key: 'jl.jolotundo1'
    }
  }

//api_user: 'dbIl3G8pT1Ci4h93Ke00PQ',
//api_key: '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'


  var client = nodemailer.createTransport(sgTransport(options));
*/

//

  var client = nodemailer.createTransport({
        host: 'email.polines.ac.id',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'arimursandhi@polines.ac.id', // generated ethereal user
            pass: 'Cicak117' // generated ethereal password
        },
        tls:{
            ciphers:'SSLv3',
            rejectUnauthorized: false
        },
        authMethod: 'PLAIN',
        debug: true
    });

  //http://localhost:3000/api/users = app.use('/api', appRoutes) + router.post('/users', function(req, res);
  //USER REGISTRATION ROUTE
  router.post('/users', function(req, res) {
    //res.send('testing users route');
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    user.name = req.body.name;
    user.temporarytoken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });

    if (req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '' || req.body.name == null || req.body.name == '') {
      res.json({ success: false, message: 'Pastikan username, email dan password terisi!' });
    } else {
      user.save(function(err) {
          if (err) {
                  if (err.errors !== null) {
                      if (err.errors.name) {
                        res.json({ success: false, message: err.errors.name.message });
                      } else if (err.errors.email) {
                        res.json({ success: false, message: err.errors.email.message });
                      } else if (err.errors.username) {
                        res.json({ success: false, message: err.errors.username.message });
                      } else if (err.errors.password) {
                        res.json({ success: false, message: err.errors.password.message });
                      } else {
                        res.json({ success: false, message: err });
                      }
                  } else if (err) {
                      if (err.code == 11000) {
                          if (err.errmsg[61] == "u") {
                            res.json({ success: false, message: 'username telah digunakan..! = pesan error' });
                          } else if (err.errmsg[61] == "e") {
                            res.json({ success: false, message: 'email telah digunakan..! = pesan error' });
                          }
                      } else {
                        res.json({ success: false, message: err });
                      }
                  }
              } else {
                  var email = {
                    from: '"arimursandhi 👻", arimursandhi@polines.ac.id',
                    to: user.email,
                    subject: 'agile-dusk-75173 Activation Link',
                    text: 'Hello ' + user.name + ', thank You for registering at agile-dusk-75173.herokuapp.com. Please click on the following link to complete your aktivation: https://agile-dusk-75173.herokuapp.com/activate/' + user.temporarytoken,
                    html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Thank You for registering at agile-dusk-75173.herokuapp.com. Please click on the link below to complete your aktivation:<br><br><a href="https://agile-dusk-75173.herokuapp.com/activate/' + user.temporarytoken + '">https://agile-dusk-75173.herokuapp.com/activate/</a>'
                  };

                  client.sendMail(email, function(err, info) {
                      if (err) {
                        console.log(err);
                      }
                      else {
                        console.log('Message sent: ' + info.response);
                      }
                  });
                  res.json({ success: true, message: 'Akun diregistrasi!, check email untuk aktivasi ' });
              }
          });
      }
  });

  //http://localhost:3000/api/authenticate = app.use('/api', appRoutes) + router.post('/authenticate', function(req, res);
  //USER LOGIN ROUTE
  router.post('/checkusername', function(req, res) {
    User.findOne({ username: req.body.username }).select('username').exec(function(err, user) {
        if (err) throw err;

        if (user) {
          res.json({ success: false, message: 'username is ready eksis bos' });
        } else {
          res.json({ success: true, message: 'valid username' });
        }
    });
  });

  router.post('/checkemail', function(req, res) {
    User.findOne({ email: req.body.email }).select('email').exec(function(err, user) {
        if (err) throw err;

        if (user) {
          res.json({ success: false, message: 'email is ready eksis bos' });
        } else {
          res.json({ success: true, message: 'valid email' });
        }
    });
  });


  router.post('/authenticate', function(req, res) {
    User.findOne({ username: req.body.username }).select('email username password active').exec(function(err, user) {
        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Username tidak ditemukan' });
        } else if (user) {
            if (!req.body.password) {
              res.json({ success: false, message: 'Password belum dimasukan'});
            } else {
              var validPassword = user.comparePassword(req.body.password);
              if (!validPassword) {
                res.json({ success: false, message: 'Password tidak valid'});
              } else if (!user.active) {
                res.json({ success: false, message: 'Akun ini belum diaktifkan. Cek kembali your email aktivasion link', expired: true });
              } else {
                var token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h'});
                res.json({ success: true, message: 'Antum is guut..!mongooo ose..!', token: token});
              }

            }
        }
    });
  });

  router.put('/activate/:token', function(req, res) {
    User.findOne({ temporarytoken: req.params.token }, function(err, user) {
      if (err) throw err;
      var token = req.params.token;
      jwt.verify(token, secret, function(err, decoded) {
        if (err) {
          res.json({ success: false, message: 'Activation link has expired' });
        } else if (!user) {
          res.json({ success: false, message: 'Activation link has expired' });
        } else {
          user.temporarytoken = false;
          user.active = true;
          user.save(function(err) {
            if (err) {
              console.log(err);
            } else {
                var email = {
                  from: '"arimursandhi 👻", arimursandhi@polines.ac.id',
                  to: user.email,
                  subject: 'agile-dusk-75173 Account Activated',
                  text: 'Hello ' + user.name + ', Your account has been successfully activated!',
                  html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Your account has been successfully activated!'
                };

                client.sendMail(email, function(err, info){
                    if (err ) {
                      console.log(err);
                    } else {
                      console.log('Message sent: ' + info.response);
                    }
                });
                res.json({ success: true, message: 'Account Activated' });
            }
          });
        }
      });

    });
  });

  router.post('/resend', function(req, res) {
    User.findOne({ username: req.body.username }).select('username password active').exec(function(err, user) {
        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Ente bahlul, dilarang enter yu nao' });
        } else if (user) {
            if (req.body.password) {
              var validPassword = user.comparePassword(req.body.password);
            } else {
              res.json({ success: false, message: 'Password belum dimasukan' });
            }
            if (!validPassword) {
              res.json({ success: false, message: 'Antum welum terdaftar' });
            } else if (user.active) {
              res.json({ success: false, message: 'Account is already activated' });
            } else {
              res.json({ success: true, user: user });
            }
        }
    });
  });

  router.put('/resend', function(req, res) {
    User.findOne({ username: req.body.username}).select('username name email temporarytoken').exec(function(err, user) {
      if (err) throw err;
      user.temporarytoken = jwt.sign({ username: user.username, email: user.email }, secret, {expiresIn: '24h' });
      user.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          var email = {
            from: '"arimursandhi 👻", arimursandhi@polines.ac.id',
            to: user.email,
            subject: 'Resend: agile-dusk-75173 Activation Link Request',
            text: 'Hello ' + user.name + ', You recently requested a new account activation link. Please click on the following link to complete your aktivation: https://agile-dusk-75173.herokuapp.com/activate/' + user.temporarytoken,
            html: 'Hello<strong> ' + user.name + '</strong>,<br><br> You recently requested a new account activation link. Please click on the link below to complete your aktivation:<br><br><a href="https://agile-dusk-75173.herokuapp.com/activate/' + user.temporarytoken + '">https://agile-dusk-75173.herokuapp.com/activate/</a>'
          };

          client.sendMail(email, function(err, info) {
              if (err) {
                console.log(err);
              }
              else {
                console.log('Message sent: ' + info.response);
              }
          });
          res.json({ success: true, message: 'Link aktivasi telah dikirim ke : ' + user.email + '!'});
        }
      });

    })
  });

  router.get('/resetUsername/:email', function(req, res) {
      User.findOne({ email: req.params.email }).select('email name username').exec(function(err, user) {
          if (err) {
              res.json({ success: false, message: err });
          } else {
              if (!user) {
                  res.json({ success: false, message: 'E-Mail was tidak ketemu' });
              } else {
                  var email = {
                    from: '"arimursandhi 👻", arimursandhi@polines.ac.id',
                    to: user.email,
                    subject: 'agile-dusk-75173 Username Request',
                    text: 'Hello ' + user.name + ', You recently requested your username. Please save it in your files: ' + user.username,
                    html: 'Hello<strong> ' + user.name + '</strong>,<br><br> You recently requested your username. Please save it in your files, username kamu adalah : ' + user.username
                  };

                  client.sendMail(email, function(err, info) {
                      if (err) {
                            console.log(err); // If error in sending e-mail, log to console/terminal
                        } else {
                            console.log(info); // Log confirmation to console
                        }
                  });
                  res.json({ success: true, message: 'Username has been sent to E-Mail'});
              }
          }
      });
  });

  router.put('/resetPassword', function(req, res) {
      User.findOne({ username: req.body.username }).select('username active email resettoken name').exec(function(err, user) {
          if (err) throw err;
          if (!user) {
              res.json({ success:false, message: 'Username was not found' });
          } else if (!user.active) {
              res.json({ success:false, message: 'Akun belum diaktifkan' });
          } else {
              user.resettoken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h'});
              user.save(function(err) {
                  if (err) {
                      res.json({ success: false, message: err });
                  } else {
                      var email = {
                        from: '"arimursandhi 👻", arimursandhi@polines.ac.id',
                        to: user.email,
                        subject: 'agile-dusk-75173 Reset Password Request',
                        text: 'Hello ' + user.name + ', thank you for registering at localhost.com. Please click on the following link to complete your aktivasion: https://agile-dusk-75173.herokuapp.com/reset/' + user.resettoken,
                        html: 'Hello<strong> ' + user.name + '</strong>,<br><br>You recently request a password reset link. Please click on the link below to reset your password :<br><br><a href="https://agile-dusk-75173.herokuapp.com/reset/' + user.resettoken + '">https://agile-dusk-75173.herokuapp.com/reset/</a>'
                      };

                      client.sendMail(email, function(err, info) {
                          if (err) console.log(err);
                      });
                      res.json({ success: true, message: 'Please check your e-mail for password reset link' });
                  }
              });
          }
      });
  });

  router.get('/resetPassword/:token', function(req, res) {
      User.findOne({ resettoken: req.params.token }).select().exec(function(err, user) {
          if (err) throw err;
          var token = req.params.token;

          jwt.verify(token, secret, function(err, decoded) {
            if (err) {
                res.json({ success: false, message: 'Password link has expired' });
            } else {
                if (!user) {
                  res.json({ success: false, message: 'Password link has expired' });
                } else {
                  res.json({ success: true, user: user });
                }
            }
          });
      });
  });

  router.put('/savePassword', function(req, res) {
      User.findOne({ username: req.body.username }).select('username email name password resettoken').exec(function(err, user) {
          if (err) throw err;
          if (req.body.password == null || req.body.password== '') {
            res.json({ success: false, message: 'Passwor not provided' });
          } else {
            user.password = req.body.password;
            user.resettoken = false;
            user.save(function(err) {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    var email = {
                      from: '"arimursandhi 👻", arimursandhi@polines.ac.id',
                      to: user.email,
                      subject: 'agile-dusk-75173 Reset Password',
                      text: 'Hello ' + user.name + ', This E-Mail is to notify you that your password was recently reset at agile-dusk-75173.herokuapp.com',
                      html: 'Hello<strong> ' + user.name + '</strong>,<br><br>This E-Mail is to notify you that your password was recently reset at agile-dusk-75173.herokuapp.com'
                    };

                    client.sendMail(email, function(err, info) {
                        if (err) console.log(err);
                    });
                    res.json({ success: true, message: 'Password has been reset!' });
                }
              });
          }
      });
  });

  router.use(function(req, res, next) {
    var token = req.body.token || req.body.query || req.headers['x-access-token'];

    if (token) {
      //verify token
      jwt.verify(token, secret, function(err, decoded) {
        if (err) {
          res.json({ success: false, message: 'Token Invalid' });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.json({ success: false, message: 'No token provided'});
    }
  });


  router.post('/me', function(req, res) {
    res.send(req.decoded);
  });

  router.get('/renewToken/:username', function(req, res) {
    User.findOne({ username: req.params.username }).select().exec(function(err, user) {
      if (err) throw err;
      if (!user) {
        res.json({ success: false, message: 'No user was found' });
      } else {
        var newToken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
        res.json({ success: true, token: newToken });
      }
    });
  });

  router.get('/permission', function(req, res) {
    User.findOne({ username: req.decoded.username }, function(err, user) {
      if (err) throw err;
      if (!user) {
        res.json({ success: false, message: 'No users was found' });
      } else {
        res.json({ success: true, permission: user.permission });
      }
    });
  });

  router.get('/management', function(req, res) {
    User.find({}, function(err, users) {
      if (err) throw err;
      User.findOne({ username: req.decoded.username }, function(err, mainUser) {
        if (err) throw err;
        if (!mainUser) {
          res.json({ success: false, message: 'No user found' });
        } else {
          if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
              if (!users) {
                res.json({ success: false, message: 'Users not found' });
              } else {
                res.json({ success: true, users: users, permission: mainUser.permission });
              }
          } else {
              res.json({ success: false, message: 'Insufficient Permissions' });
          }
        }

      });
    });
  });

  router.delete('/management/:username', function(req, res) {
    var deletedUser = req.params.username;
    User.findOne({ username: req.decoded.username }, function(err, mainUser) {
      if (err) throw err;
      if (!mainUser) {
        res.json({ success: false, message: 'No user found'});
      } else {
        if (mainUser.permission !== 'admin') {
          res.json({ success: false, message: 'Insufficient Permissions' });
        } else {
          User.findOneAndRemove({ username: deletedUser }, function(err, user) {
            if (err) throw err;
            res.json({ success: true });
          });
        }
      }
    });
  });

  router.get('/edit/:id', function(req, res) {
    var editUser = req.params.id;
    User.findOne({ username: req.decoded.username }, function(err, mainUser) {
      if (err) throw err;
      if (!mainUser) {
        res.json({ success: false, message: 'No user found' });
      } else {
        if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
          User.findOne({ _id: editUser }, function(err, user) {
            if (err) throw err;
            if (!user) {
              res.json({ success: false, message: 'No user found' });
            } else {
              res.json({ success: true, user: user });
            }
          });
        } else {
          res.json({ success: false, message: 'Insufficient Permissions' });
        }
      }
    });
  });

  router.put('/edit', function(req, res) {
    var editUser = req.body._id;

    if (req.body.name) var newName = req.body.name;
    if (req.body.username) var newUsername = req.body.username;
    if (req.body.email) var newEmail = req.body.email;
    if (req.body.permission) var newPermission = req.body.permission;
    User.findOne({ username: req.decoded.username }, function(err, mainUser) {
      if (err) throw err;
      if (!mainUser) {
        res.json({ success: false, message: 'No user found' });
      } else {
        if (newName) {
          if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
            User.findOne({ _id: editUser }, function(err, user) {
              if (err) throw err;
              if (!user) {
                res.json({ success: false, message: 'No user found' });
              } else {
                user.name = newName;
                user.save(function(err) {
                  if (err) {
                    console.log(err);
                  } else {
                    res.json({ success: true, message: 'Name has been updated!' });
                  }
                });
              }
            });
          } else {
            res.json({ success: false, message: 'Insufficient Permissions' });
          }
        }
        if (newUsername) {
          if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
            User.findOne({ _id: editUser }, function(err, user) {
              if (err) throw err;
              if (!user) {
                res.json({ success: false, message: 'No user was found' });
              } else {
                user.username = newUsername;
                user.save(function(err) {
                  if (err) {
                    console.log(err);
                  } else {
                    res.json({ success: true, message: 'Username has been updated!' });
                  }
                });
              }
            });
          } else {
            res.json({ success: false, message: 'Insufficient Permissions' });
          }
        }

        if (newEmail) {
          if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
            User.findOne({ _id: editUser }, function(err, user) {
              if (err) throw err;
              if (!user) {
                res.json({ success: false, message: 'No user was found' });
              } else {
                user.email = newEmail;
                user.save(function(err) {
                  if (err) {
                    console.log(err);
                  } else {
                    res.json({ success: true, message: 'E-Mail has been updated!' });
                  }
                });
              }
            });
          } else {
            res.json({ success: false, message: 'Insufficient Permissions' });
          }
        }

        if (newPermission) {
          if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
            User.findOne({ _id: editUser }, function(err, user) {
              if (err) throw err;
              if (!user) {
                res.json({ success: false, message: 'No user was found' });
              } else {
                if (newPermission === 'user') {
                  if (user.permission === 'admin') {
                    if (mainUser.permission !== 'admin') {
                      res.json({ success: false, message: 'Insufficient Permissions. You must be an admin to downgrade another admin' });
                    } else {
                      user.permission = newPermission;
                      user.save(function(err) {
                        if (err) {
                          console.log(err);
                        } else {
                          res.json({ success: true, message: 'Permissions have been updated!' });
                        }
                      });
                    }
                  } else {
                    user.permission = newPermission;
                    user.save(function(err) {
                      if (err) {
                        console.log(err);
                      } else {
                        res.json({ success: true, message: 'Permissions have been updated!' });
                      }
                    });
                  }
                }
                if (newPermission === 'moderator') {
                  if (user.permission === 'admin') {
                    if (mainUser.permission !== 'admin') {
                      res.json({ success: false, message: 'Insufficient Permissions. You must be an admin to downgrade another admin' });
                    } else {
                      user.permission = newPermission;
                      user.save(function(err) {
                        if (err) {
                          console.log(err);
                        } else {
                          res.json({ success: true, message: 'Permissions have been updated!' });
                        }
                      });
                    }
                  } else {
                    user.permission = newPermission;
                    user.save(function(err) {
                      if (err) {
                        console.log(err);
                      } else {
                        res.json({ success: true, message: 'Permissions have been updated!' });
                      }
                    });
                  }
                }
                if (newPermission === 'admin') {
                  if (mainUser.permission === 'admin') {
                    user.permission = newPermission;
                    user.save(function(err) {
                      if (err) {
                        console.log(err);
                      } else {
                        res.json({ success: true, message: 'Permissions have been updated!' });
                      }
                    });
                  } else {
                    res.json({ success: false, message: 'Insufficient Permissions. You must be an admin to upgrade someone to the admin level' });
                  }
                }
              }
            });
          } else {
            res.json({ success: false, message: 'Insufficient Permissions' });
          }
        }




      }

    });
  });



    return router;
};
