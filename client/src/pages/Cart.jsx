import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Cart = () => {
  const navigate = useNavigate();

  const {
    products,
    currency,
    cartItems,
    setCartItems,
    removeFromCart,
    getCartCount,
    updateCartItem,
    getCartAmount,
    axios,
    user,
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOptions, setPaymentOptions] = useState("COD");

  // Build cart array
  const getCart = () => {
    let tempArray = [];

    for (const key in cartItems) {
      const product = products.find((item) => item._id === key);
      if (product) {
        tempArray.push({
          ...product,
          quantity: cartItems[key],
        });
      }
    }

    setCartArray(tempArray);
  };

  // Fetch user addresses
  const getUserAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");

      if (data.success) {
        setAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Place order
  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please add an address");
      }

      if (paymentOptions === "COD") {
        const { data } = await axios.post("/api/order/cod", {
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
        });

        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
      }
      else{//place order stripe
         const { data } = await axios.post("/api/order/stripe", {
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
        });

        if (data.success) {
       window.location.replace(data.url)
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [cartItems, products]);

  useEffect(() => {
    if (user) {
      getUserAddress();
    }
  }, [user]);

  if (!products.length || !cartItems) return null;

  return (
    <div className="flex flex-col md:flex-row mt-16">
      {/* LEFT SIDE */}
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-primary">
            {getCartCount()} Items
          </span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p>Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product, index) => (
          <div
            key={index}
            className="grid grid-cols-[2fr_1fr_1fr] items-center pt-3"
          >
            <div className="flex items-center gap-4">
              <NavLink
                to={`/products/${product.category.toLowerCase()}/${product._id}`}
                onClick={() => scrollTo(0, 0)}
                className="w-24 h-24 border rounded flex items-center justify-center"
              >
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="h-full object-cover"
                />
              </NavLink>

              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-gray-500">
                  Weight: {product.weight || "N/A"}
                </p>

                <div className="flex items-center gap-2">
                  <span>Qty:</span>
                  <select
                    value={cartItems[product._id]}
                    onChange={(e) =>
                      updateCartItem(
                        product._id,
                        Number(e.target.value)
                      )
                    }
                  >
                    {Array(
                      cartItems[product._id] > 9
                        ? cartItems[product._id]
                        : 9
                    )
                      .fill("")
                      .map((_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            <p className="text-center">
              {currency}
              {product.offerPrice * product.quantity}
            </p>

            <button
              onClick={() => removeFromCart(product._id)}
              className="mx-auto"
            >
              <img
                src={assets.remove_icon}
                alt="remove"
                className="w-6 h-6"
              />
            </button>
          </div>
        ))}

        <NavLink
          to="/products"
          className="flex items-center gap-2 mt-8 text-primary font-medium"
        >
          Continue Shopping
        </NavLink>
      </div>

      {/* RIGHT SIDE */}
      <div className="max-w-90 w-full bg-gray-100/40 p-5 max-md:mt-16 border">
        <h2 className="text-xl font-medium">Order Summary</h2>
        <hr className="my-5" />

        <p className="text-sm font-medium uppercase">
          Delivery Address
        </p>

        <div className="relative mt-2">
          <p className="text-gray-500 text-sm">
            {selectedAddress
              ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
              : "No address found"}
          </p>

          <button
            onClick={() => setShowAddress(!showAddress)}
            className="text-primary mt-2"
          >
            Change
          </button>

          {showAddress && (
            <div className="absolute top-14 w-full bg-white border text-sm">
              {addresses.map((address, i) => (
                <p
                  key={i}
                  onClick={() => {
                    setSelectedAddress(address);
                    setShowAddress(false);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {address.street}, {address.city}
                </p>
              ))}

              <NavLink
                to="/add-address"
                className="block text-center text-primary p-2"
              >
                Add address
              </NavLink>
            </div>
          )}
        </div>

        <p className="text-sm font-medium uppercase mt-6">
          Payment Method
        </p>

        <select
          onChange={(e) => setPaymentOptions(e.target.value)}
          className="w-full border px-3 py-2 mt-2"
        >
          <option value="COD">Cash On Delivery</option>
          <option value="Online">Online Payment</option>
        </select>

        <hr className="my-4" />

        <div className="space-y-2 text-gray-500">
          <p className="flex justify-between">
            <span>Price</span>
            <span>{currency}{getCartAmount()}</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping</span>
            <span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>{currency}{(getCartAmount() * 0.02).toFixed(2)}</span>
          </p>
          <p className="flex justify-between font-medium">
            <span>Total</span>
            <span>
              {currency}
              {(getCartAmount() * 1.02).toFixed(2)}
            </span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          className="w-full mt-6 py-3 bg-primary text-white"
        >
          {paymentOptions === "COD"
            ? "Place Order"
            : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
