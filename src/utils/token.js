const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

exports.generateToken = (userEmail, callback) => {
    let token = jwt.sign(
        {
          user: userEmail
        },
        process.env.JTW_SECRET,
        { expiresIn: "30d" }
      );

    return callback(token);
};

exports.validateToken = (req, res, callback) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(token == null){
    res.status(401).send('without token')
  } else {
    jwt.verify(token, process.env.JTW_SECRET, (err, user) => {
      if(err){
        res.status(403).send('invalid token');
      } else {
        req.user = {user: user.user};
        return callback();
      };
    })
  }
};