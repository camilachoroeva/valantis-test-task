import React from 'react';

const Filter = ({ filter, setFilter, availableBrands, handleFilterApply, handleClearFilter, handleFilterPanelClick }) => {
  return (
    <div className="px-8 py-12 flex flex-col h-full" onClick={handleFilterPanelClick}>
      <h2 className="text-xl font-semibold mb-8">Фильтры</h2>
      <input
        type="text"
        placeholder="Название товара"
        value={filter.name}
        onChange={e => setFilter(prevFilter => ({ ...prevFilter, name: e.target.value }))}
        className="p-2 border rounded mb-4"
      />
      <input
        type="text"
        placeholder="Цена"
        value={filter.price}
        onChange={e => setFilter(prevFilter => ({ ...prevFilter, price: e.target.value }))}
        className="p-2 border rounded mb-4"
      />

      <select
        value={filter.brand}
        onChange={e => setFilter(prevFilter => ({ ...prevFilter, brand: e.target.value }))}
        className={`p-2 border rounded mb-4 relative outline-none`}
      >
        <option value="">Бренд</option>
        {availableBrands.map((brand, index) => (
          <option key={index} value={brand}>{brand}</option>
        ))}
      </select>

      <div className='absolute bottom-8 left-8 right-8 flex flex-col'>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded-sm shadow mr-2 mb-4"
          onClick={handleFilterApply}
        >
          Применить
        </button>
        <button
          className="underline bg-transparent text-gray px-4 py-2"
          onClick={handleClearFilter}
        >
          Очистить фильтры
        </button>
      </div>
    </div>
  );
};

export default Filter;