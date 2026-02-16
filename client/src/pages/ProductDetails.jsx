import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
  const { products, currency, addToCart } = useAppContext();
  const { category, id } = useParams();

  const product = products.find(
    (item) =>
      item._id === id &&
      item.category.toLowerCase() === category.toLowerCase()
  );

  const [thumbnail, setThumbnail] = useState("");

  // related products (same category, exclude current)
  const relatedProducts = products.filter(
    (item) =>
      item.category.toLowerCase() === category.toLowerCase() &&
      item._id !== id
  );

  // Fix refresh image issue
  useEffect(() => {
    if (product?.image?.length) {
      setThumbnail(product.image[0]);
    }
  }, [product]);

  // Safety check
  if (!product) {
    return (
      <p className="text-center mt-20 text-gray-500">
        Product not found
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full px-4 md:px-10 mt-10">
      {/* Breadcrumb */}
      <p className="text-sm text-gray-500 mb-6">
        <NavLink to="/" className="hover:text-primary">Home</NavLink> /
        <NavLink to="/products" className="hover:text-primary"> Products</NavLink> /
        <NavLink
          to={`/products/${category}`}
          className="hover:text-primary"
        >
          {" "}
          {product.category}
        </NavLink>{" "}
        /
        <span className="text-primary"> {product.name}</span>
      </p>

      <div className="flex flex-col md:flex-row gap-14">
        {/* Images */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-3">
            {product.image.map((img, index) => (
              <div
                key={index}
                onClick={() => setThumbnail(img)}
                className={`border rounded overflow-hidden cursor-pointer w-20 ${
                  thumbnail === img ? "border-primary" : "border-gray-300"
                }`}
              >
                <img src={img} alt={`thumb-${index}`} />
              </div>
            ))}
          </div>

          <div className="border border-gray-300 rounded overflow-hidden max-w-md">
            {thumbnail && (
              <img
                src={thumbnail}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Details */}
        <div className="w-full md:w-1/2 text-sm">
          <h1 className="text-3xl font-medium">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${
                    i < product.rating
                      ? "text-indigo-500"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            <p className="ml-2">({product.rating})</p>
          </div>

          {/* Price */}
          <div className="mt-6">
            <p className="text-gray-400 line-through">
              {currency}{product.price}
            </p>
            <p className="text-2xl font-medium text-primary">
              {currency}{product.offerPrice}
            </p>
            <span className="text-gray-400 text-xs">
              (inclusive of all taxes)
            </span>
          </div>

          {/* Description */}
          <p className="mt-6 font-medium text-base">About Product</p>
          <ul className="list-disc ml-4 text-gray-500 mt-2">
            {product.description?.map((desc, index) => (
              <li key={index}>{desc}</li>
            ))}
          </ul>

          {/* Buttons */}
          <div className="flex gap-4 mt-10">
            <button
              onClick={() => addToCart(product._id)}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 transition"
            >
              Add to Cart
            </button>

            <NavLink
              to="/cart"
              className="w-full"
              onClick={() => addToCart(product._id)}
            >
              <button className="w-full py-3 bg-indigo-500 text-white hover:bg-indigo-600 transition">
                Buy Now
              </button>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Related Products */}
<div className="mt-24">
  {/* Heading */}
  <div className="flex flex-col items-center mb-10">
    <h2 className="text-3xl font-medium">Related Products</h2>
    <span className="w-20 h-1 bg-primary rounded-full mt-3"></span>
  </div>

  {/* Products Grid */}
  <div className="
    grid 
    grid-cols-2 
    sm:grid-cols-3 
    md:grid-cols-4 
    lg:grid-cols-5 
    gap-4 
    md:gap-6
  ">
    {relatedProducts
      ?.filter((item) => item.inStock)
      .map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
  </div>

  {/* See All Button */}
  <div className="flex justify-center mt-12">
    <NavLink
      to="/products"
      onClick={() => window.scrollTo(0, 0)}
      className="
        px-8 
        py-3 
        border 
        border-primary 
        text-primary 
        rounded-md 
        hover:bg-primary 
        hover:text-white 
        transition
      "
    >
      See All Products
    </NavLink>
  </div>
</div>

    </div>
  );
};

export default ProductDetails;
