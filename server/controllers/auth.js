const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
const _ = require('lodash');
const {OAuth2Client} = require('google-auth-library');
const fetch = require('node-fetch');



// exports.signup = (req, res) => {
//     console.log('REQ BODY:', req.body);
    
//     const {name, email, password} = req.body;

//     User.findOne({email}).exec((err, user) => {
//             if(user) {
//                 return res.status(400).json({
//                     error: 'Email is taken'
//             }) 
//         } 
//     })

    

//     let newUser = new User({name, email, password})

//     newUser.save((err, success) => {
//         if(err) {
//             console.log('SIGNUP ERROR:', err);
//             return res.status(400).json({
//                 error: err
//             })
//         }
//         res.json({
//             message: 'Signup success! Please signin.'
//         })
//     });
// };



// controllers/auth
 
// rest of your code
const { sendEmailWithNodemailer } = require("../helpers/email");
 
exports.signup = (req, res) => {
  const { name, email, password } = req.body;
 
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }
 
    const token = jwt.sign(
        { name, email, password },
        process.env.JWT_ACCOUNT_ACTIVATION,
        { expiresIn: "10m" }
    )


    const emailData = {
      from: process.env.EMAIL_FROM, // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
      to: email, // WHO SHOULD BE RECEIVING THIS EMAIL? IT SHOULD BE THE USER EMAIL (VALID EMAIL ADDRESS) WHO IS TRYING TO SIGNUP
      subject: `ACCOUNT ACTIVATION LINK`,
      html: `
                <h1>Please use the following link to activate your account</h1>
                <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                <hr />
                <p>This email may contain sensitive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `,
    };
 
    sendEmailWithNodemailer(req, res, emailData);
 
    // const emailData = {
    //   from: process.env.EMAIL_FROM,
    //   to: email,
    //   subject: `Account activation link`,
    //   html: `
    //             <h1>Please use the following link to activate your account</h1>
    //             <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
    //             <hr />
    //             <p>This email may contain sensetive information</p>
    //             <p>${process.env.CLIENT_URL}</p>
    //         `,
    // };
 
    // sgMail
    //   .send(emailData)
    //   .then((sent) => {
    //     // console.log('SIGNUP EMAIL SENT', sent)
    //     return res.json({
    //       message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
    //     });
    //   })
    //   .catch((err) => {
    //     // console.log('SIGNUP EMAIL SENT ERROR', err)
    //     return res.json({
    //       message: err.message,
    //     });
    //   });
  });
};

exports.accountActivation = (req, res) => {
  const {token} = req.body;

  if(token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
      if(err) {
        console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', err)
        return res.status(401).json({
          error: `Expired link. Signup again`
        })
      }

      const {name, email, password} = jwt.decode(token);

      const user = new User({name, email, password});
      user.save((err, user) => {
        if(err) {
          console.log('ACCOUNT ACTIVATION SAVE ERROR', err)
          return res.status(401).json({
            error: `Error saving user data. Please try again`
          })
        }
        return res.json({
          message: 'Signup success! Please signin.'
        })
      });
    });
  } else {
    return res.json({
      message: 'Something went wrong. Try again'
    })
  }
};


exports.signin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if(err || !user) {
      return res.status(400).json({
        error: `User with that email does not exist. Please signup.`
      })
    }

    // authenticate
    if(!user.authenticate(password)) {
      return res.status(400).json({
        error: `Email and password do not match` 
      })
    }

    // generate a token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const { _id, name, email, role } = user;

    return res.json({
      token,
      user: { _id, name, email, role }
    })
  });
}

exports.requireSignin = expressJWT({
  secret: process.env.JWT_SECRET, // req.user
  algorithms: ['sha1', 'RS256', 'HS256'],
})

exports.adminMiddleware = (req, res, next) => {
  User.findById({ _id: req.user._id }).exec((err, user) => {
      if(err || !user) {
        return res.status(400).json({
          error: `User not found!`
        })
      }

      if(user.role !== 'admin') {
        return res.status(400).json({
          error: `Admin resource. Access denied!`
        })
      }

      req.profile = user;
      next();
  });
}

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if(err || !user){
      return res.status(400).json({
        error: `User with that email does not exist`
      })
    }
  

    const token = jwt.sign(
        { _id: user._id, name: user.name },
        process.env.JWT_RESET_PASSWORD,
        { expiresIn: "10m" }
    )


    const emailData = {
      from: process.env.EMAIL_FROM, // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
      to: email, // WHO SHOULD BE RECEIVING THIS EMAIL? IT SHOULD BE THE USER EMAIL (VALID EMAIL ADDRESS) WHO IS TRYING TO SIGNUP
      subject: `PASSWORD RESET LINK`,
      html: `
                <h1>Please use the following link to reset your password</h1>
                <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                <hr />
                <p>This email may contain sensitive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `,
    };

    return user.updateOne({resetPasswordLink: token}, (err, success) => {
      if(err) {
        console.log(`Reset Password Link Error`, err)
        return res.status(400).json({
          error: `Database connection error on user password forgot request`
        })
      } else {
        sendEmailWithNodemailer(req, res, emailData);
      }
    })

    
  });
}

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if(resetPasswordLink) {
    jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, (err, decoded) => {
      if(err) {
        return res.status(400).json({
          error: `Expired link. Try again!`
        })
      }

      User.findOne({ resetPasswordLink }).exec((err, user) => {
        if(err || !user) {
          return res.status(400).json({
            error: `Something went wrong. Try later!`
          })
        }

        const updatedFields = {
          password: newPassword,
          resetPasswordLink: ''
        }

        user = _.extend(user, updatedFields);

        user.save((err, result) => {
          if(err) {
            return res.status(400).json({
              error: `Error resetting user password`
            })
          }

          res.json({
            message: `Great! Now you can login with your new password`
          })
        });
      });
    });
  }
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.googleLogin = (req, res) => {
  const { idToken } = req.body;

  // verify the token
  // get the user data
  // verify token
  // find user
  client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID }).then(response => {
    // console.log(`Google Login Response`, response);
    const { email_verified, name, email } = response.payload;
      if(email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if(user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            const { _id, email, name, role } = user;
            return res.json({
              token,
              user: { _id, email, name, role }
            })
          } else {
            let password = email + process.env.JWT_SECRET
            user = new User({name, email, password})
            user.save((err, data) => {
              if(err) {
                console.log(`Error Google Login on user save`, err)
                return res.status(400).json({
                  error: `Error saving user from Google Login`
                })
              }
              const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
              const { _id, email, name, role } = data;
              return res.json({
                token,
                user: { _id, email, name, role }
              })
            })
          }
        });
      } else {
        return res.status(400).json({
          error: `Google login failed. Try again!`
        })
      }
    }).catch(error => {
      console.log(`Error while verifying google token`, error);
      return res.status(400).json({
        error: `Google token is not valid`
      })
    });
}

exports.facebookLogin = (req, res) => {
  console.log(`Facebook login req body`, req.body)
  const {userID, accessToken} = req.body;

  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

  return (
    fetch(url, {
      method: 'GET'
    })
    .then(response => response.json())
    // .then(reponse => { console.log(response) })
    .then(response => {
      const {email, name} = response;
      User.findOne({email}).exec((err, user) => {
        if(user) {
          const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            const { _id, email, name, role } = user;
            return res.json({
              token,
              user: { _id, email, name, role }
            })
        }
        else {
          let password = email + process.env.JWT_SECRET
            user = new User({name, email, password})
            user.save((err, data) => {
              if(err) {
                console.log(`Error Facebook Login on user save`, err)
                return res.status(400).json({
                  error: `Error saving user from Facebook Login`
                })
              }
              const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
              const { _id, email, name, role } = data;
              return res.json({
                token,
                user: { _id, email, name, role }
              })
            })
        }
      })
    })
    .catch(error => {
      res.json({
        error: `Facebook login failed. Try again!`
      })
    })
  )
}