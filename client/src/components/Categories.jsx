import React from 'react'
import { assets, categories } from '../assets/assets'
import { NavLink } from 'react-router-dom'

const Categories = () => {
  return (
    <div className="pt-16">
      <p className="text-2xl md:text-3xl font-medium">Categories</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6">
        {categories.map((category, index) => (
          <NavLink
            key={index}
            to={`/products/${category.path.toLowerCase()}`}
            onClick={() => window.scrollTo(0, 0)}
            className="group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center"
            style={{ backgroundColor: category.bgColor }}
          >
            <img
              src={category.image}
              alt={category.text}
              className="group-hover:scale-110 transition max-w-28"
            />
            <p className="text-sm font-medium">{category.text}</p>
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default Categories
