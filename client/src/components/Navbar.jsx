import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const {
    user,
    setUser,
    setShowUserLogin,
    setSearchQuery,
    searchQuery,
    getCartCount,axios
  } = useAppContext();

  const logout =async () => {
    try {
      const {data} =await axios.get('/api/user/logout')
      if(data.success){
        toast.success(data.message)
        setUser(null);
    window.location.href = "/";} else {
      toast.error(data.message)
    }
    } catch (error) {
       toast.error(error.message)
    }
  
  };

  return (
<nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 
border-b border-gray-300 bg-white sticky top-0 z-50">

      {/* Logo */}
      <NavLink to="/" className="flex items-center">
        <img src={assets.logo} alt="logo" className="h-9" />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to="/" className={({ isActive }) => isActive ? "font-semibold" : ""}>
          Home
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => isActive ? "font-semibold" : ""}>
          All Products
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? "font-semibold" : ""}>
          Contact
        </NavLink>

        {/* Search */}
        <div className="hidden lg:flex items-center gap-2 border border-gray-300 px-3 rounded-full">
          <input
           onChange={(e)=> setSearchQuery(e.target.value)}
            className="py-1.5 bg-transparent outline-none"
            type="text"
            placeholder="Search products"
          />
          <NavLink to="/products">
            <img
              src={assets.search_icon}
              alt="search"
              className="w-4 h-4 cursor-pointer"
            />
          </NavLink>
        </div>

        {/* Cart */}
        <NavLink to="/cart" className="relative">
          <img src={assets.nav_cart_icon} alt="cart" className="w-6" />
          <span className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-4.5 h-4.5 rounded-full flex items-center justify-center">
            {getCartCount()}
          </span>
        </NavLink>

        {/* User */}
        {!user ? (
          <button
            onClick={() => setShowUserLogin(true)}
            className="px-8 py-2 bg-primary text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div className="relative group">
            <img src={assets.profile_icon} className="w-10" alt="profile" />
            <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border py-2 w-32 rounded-md text-sm">
              <li className="p-2 hover:bg-gray-100">
                <NavLink to="/my-orders"> My Orders</NavLink>
              </li>
              <li
                onClick={logout}
                className="p-2 hover:bg-primary cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-6 sm:hidden">
        <NavLink to="/cart" className="relative">
          <img src={assets.nav_cart_icon} alt="cart" className="w-6" />
          <span className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-4.5 h-4.5 rounded-full flex items-center justify-center">
            {getCartCount()}
          </span>
        </NavLink>
 <button onClick={() => setOpen(!open)} className="">
        <img src={assets.menu_icon} alt="menu" />
      </button>

      </div>
     

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md py-4 flex flex-col gap-2 px-5 text-sm sm:hidden z-50">
          <NavLink 
            to="/" 
            onClick={() => setOpen(false)}
            className={({ isActive }) => isActive ? "font-semibold" : ""}
          >
            Home
          </NavLink>
          <NavLink 
            to="/products" 
            onClick={() => setOpen(false)}
            className={({ isActive }) => isActive ? "font-semibold" : ""}
          >
            All Products
          </NavLink>
          <NavLink 
            to="/contact" 
            onClick={() => setOpen(false)}
            className={({ isActive }) => isActive ? "font-semibold" : ""}
          >
            Contact
          </NavLink>
          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              className="px-6 py-2 bg-indigo-500 text-white rounded-full mt-2"
            >
              Login
            </button>
          ) : (
            <button
              onClick={logout}
              className="px-6 py-2 bg-indigo-500 text-white rounded-full mt-2"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;