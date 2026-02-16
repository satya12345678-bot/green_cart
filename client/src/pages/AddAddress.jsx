import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { data, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddAddress = () => {
  const { axios, user } = useAppContext();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?._id) {
      toast.error("login first");
      return;
    }

    try {
      const { data } = await axios.post("/api/address/add", {
        userId: user._id,         
        address: {
          ...address,
          zipcode: Number(address.zipcode) // ✅ must be number (schema requires Number)
        }
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/cart");
    }
  }, [user, navigate]);

  return (
    <div className="mt-16 pb-16 max-w-6xl mx-auto px-4">
      <p className="text-2xl md:text-3xl text-gray-500">
        Add Shipping{" "}
        <span className="font-semibold text-primary">Address</span>
      </p>

      <div className="flex flex-col-reverse md:flex-row justify-between items-center mt-10 gap-10">

        <form
          onSubmit={handleSubmit}
          className="flex-1 max-w-md w-full space-y-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={address.name}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-primary"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={address.email}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-primary"
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={address.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-primary"
            required
          />

          <input
            type="text"
            name="street"
            placeholder="Street Address"
            value={address.street}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-primary"
            required
          />

          <div className="flex gap-4">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={address.city}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-primary"
              required
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={address.state}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-primary"
              required
            />
          </div>

          <div className="flex gap-4">
            <input
              type="number"
              name="zipcode"
              placeholder="Zip Code"
              value={address.zipcode}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-primary"
              required
            />

            <input
              type="text"
              name="country"
              placeholder="Country"
              value={address.country}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-primary"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 font-medium hover:bg-primary-dull transition"
          >
            Save Address
          </button>
        </form>

        <img
          className="md:mr-16 mb-10 md:mb-0 w-72"
          src={assets.add_address_iamge}
          alt="add address"
        />
      </div>
    </div>
  );
};

export default AddAddress;
