import Address from "../models/Address.js";


//add adress:/api/seller/add
export const addAddress = async (req, res) => {
    try {
        const { userId, address } = req.body;
        await Address.create({ userId, ...address });
        res.json({ success: true, message: "Address added successfully" });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
        
    }
}

//get address:/api/seller/get
export const getAddress = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.userId });

    res.json({
      success: true,
      addresses
    });

  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message
    });
  }
};
