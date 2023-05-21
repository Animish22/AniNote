const express = require("express");
const User = require("../models/User");
var jwt = require('jsonwebtoken');
const router = express.Router();
var bcrypt = require("bcryptjs");
const { body, validationResult } = require('express-validator');
var fetchuser = require("../middleware/fetchuser")

const JWT_SECRET = "animish$here";
//Create a User using post request : Does not require Auth
router.post('/createuser' ,[ 
    body('name' , 'Enter a valid name').isLength({min : 5}),
    body('email' , 'Enter a valid email ').isEmail(),
    body('password' , ' Enter a valid password').isLength({min : 5}),
], async (req,res)=>{

  let success = false;
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try
    {
    let user = await User.findOne({email: req.body.email});
    if(user)
    {
      return res.status(400).json({success , error : "A user with this email already exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password , salt);

    user  =  await User.create({
        name: req.body.name,
        email  : req.body.email,
        password: secPass,
      })
      const data = {
        user : {
          id : user.id
        }
      }
      success = true;
      const authtoken = jwt.sign(data , JWT_SECRET);
      res.json({success , authtoken});
      // Not needed now as we are using async await 
      // .then(user => res.json(user))
      // .catch(err => console.log(err));
    }catch(error){
      res.status(500).send("Internal Error occured");
    }

})


//Authenticate a user i.e. Login 
router.post('/login' ,[ 
  body('email').isEmail(),
  body('password','password cannot be blank').exists()
], async (req,res)=>{
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }


  const {email , password} = req.body;
  try
  {
    let user = await User.findOne({email});
    if(!user) 
    {
      res.status(400).json({success ,error : "Please Login with correct credentials"});
    }

    const passCompare  = await bcrypt.compare(password , user.password);
    if(!passCompare)
    {
      res.status(400).json({success , error : "Please Login with correct credentials"});
    }

    const data= {
      user :{id : user.id}
    }

    const authtoken = jwt.sign(data , JWT_SECRET);
    success = true;
    res.json({success , authtoken});

  }catch(error){
    res.status(500).send("Internal Error occured");
  }
})

// Get logged in User Details Login is Required /api/auth/getuser
router.post('/getuser' , fetchuser ,  async (req,res)=>{
try {
  const userId = req.user.id;
  const user = await User.findById(userId).select("-password");
  res.send(user);
} catch (error) {
  res.status(500).send("Internal Error occured");
}
})
//if we do not export router then we cannot use router.get there since it is not imported there by default  
module.exports  = router;