import jwt from 'jsonwebtoken';

//seller lognin :/api/seller/login

export const sellerLogin = async (req, res) => {
    try {
    const { email, password } = req.body;
    if (email !== process.env.SELLER_EMAIL || password !== process.env.SELLER_PASSWORD) {
        return res.json({ success: false, message: "Invalid credentials" });
    }
    else {
        const token = jwt.sign({email}, process.env.JWT_SECRET, { expiresIn: "7d" });

            res.cookie("sellerToken", token, {
      httpOnly: true, // prevent client-side JS access
      secure: process.env.NODE_ENV === "production", // use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
return res.json({ success: true, message: "Seller logged in successfully" });

    }
    }
    catch (error) {
        console.log(error.message);
        return res.json({ success: false, message:error.message });

    }
}
//seller isAuth : /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
  try {

 return res.json({success:true});
  }
  catch (error) {
    console.log(error.message);
    return res.json({success:false,message:error.message});

  }
}

//logout seleer : api/user/logout
export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken",{
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    })
    return res.json({success:true,message:"Logged out successfully"});
  }
  catch (error) {
    console.log(error.message);
    return res.json({success:false,message:error.message});
  }}
