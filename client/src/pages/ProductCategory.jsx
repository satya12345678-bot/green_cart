import React from 'react'
import { useParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { categories } from '../assets/assets'
import ProductCard from '../components/ProductCard'

const ProductCategory = () => {
  const { products } = useAppContext()
  const { category } = useParams()

  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category.toLowerCase()
  )

  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase()
  )

  return (
    <div className="mt-16 px-4 md:px-14">
      {/* CATEGORY TITLE */}
     {searchCategory && (
  <div className="inline-block mb-8">
    <p className="text-2xl font-semibold">
      {searchCategory.text.toUpperCase()}
    </p>
    <div className="h-1 bg-primary rounded-full mt-1"></div>
  </div>
)}


      {/* PRODUCTS GRID */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-500 text-lg">
            No products found in this category 😕
          </p>
        </div>
      )}
    </div>
  )
}

export default ProductCategory
