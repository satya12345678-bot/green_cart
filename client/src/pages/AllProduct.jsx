import React from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

const AllProduct = () => {
  const { products, searchQuery } = useAppContext();

  if (!products || !products.length) {
    return (
      <p className="text-center mt-20 text-gray-500">
        No products available
      </p>
    );
  }

  // ✅ LIVE SEARCH FILTER
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-12">
      <p className="text-2xl md:text-3xl font-medium mb-6">
        All Products
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredProducts.length ? (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found
          </p>
        )}
      </div>
    </div>
  );
};

export default AllProduct;
