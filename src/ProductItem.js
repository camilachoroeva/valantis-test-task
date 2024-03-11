import React from 'react';

const ProductItem = ({ product }) => {
  return (
    <div className="bg-[#f5f5f5] p-4 shadow rounded-lg transition duration-300 ease-in-out transform hover:shadow-lg">
      <div>Идентификатор: {product.id}</div>
      <div>Название: {product.product}</div>
      <div>Бренд: {product.brand}</div>
      <div className='text-red-700 font-bold'>Цена: {product.price} ₽</div>
    </div>
  );
};

export default ProductItem;