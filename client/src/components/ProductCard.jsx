import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const ProductCard = ({ product }) => {
  const [count, setCount] = useState(0);
  const { currency, addToCart, removeFromCart, cartItems } = useAppContext();

  if (!product) return null;

  return (
    <div className="border border-gray-300 rounded-md bg-white p-3 min-w-[200px] max-w-[220px] w-full flex flex-col cursor-pointer">
      
      {/* Image */}
      <NavLink to={`/products/${product.category.toLowerCase()}/${product._id}`} className="flex justify-center mb-3">
        <img
          src={product.image?.[0]}
          alt={product.name}
          className="h-40 object-contain transition-transform group-hover:scale-105"
        />
      </NavLink>

      {/* Category */}
      <p className="text-xs text-gray-400">{product.category}</p>

      {/* Product Name */}
      <p className="text-gray-700 font-medium text-sm truncate">{product.name}</p>

      {/* Rating */}
      <div className="flex items-center gap-0.5 mt-1">
        {Array(5)
          .fill("")
          .map((_, i) => (
            <img
              key={i}
              src={i < product.rating ? assets.star_icon : assets.star_dull_icon}
              alt="star"
              className="w-3 h-3"
            />
          ))}
        <span className="text-xs text-gray-500">({product.rating})</span>
      </div>

      {/* Price + Cart */}
      <div className="flex items-end justify-between mt-3">
        <div>
          <p className="text-primary font-medium text-base">
            {currency}
            {product.offerPrice}
          </p>
          <p className="text-gray-400 text-xs line-through">
            {currency}
            {product.price}
          </p>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          {!cartItems[product._id] ? (
            <button
              className="flex items-center justify-center gap-1 bg-indigo-100 border border-indigo-300 px-3 py-1 rounded text-primary font-medium text-xs hover:bg-indigo-200 transition"
              onClick={() => {
                addToCart(product._id);
                setCount(1);
              }}
            >
              <img src={assets.cart_icon} alt="cart" className="w-4 h-4" />
              Add
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 bg-indigo-50 px-2 py-1 rounded select-none">
              <button
                className="text-primary font-bold"
                onClick={() => removeFromCart(product._id)}
              >
                -
              </button>
              <span className="w-5 text-center">{cartItems[product._id]}</span>
              <button
                className="text-primary font-bold"
                onClick={() => addToCart(product._id)}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
