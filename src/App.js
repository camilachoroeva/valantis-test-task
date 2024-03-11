import React, { useState, useEffect } from 'react';
import Filter from './Filter';
import ProductItem from './ProductItem';
import Pagination from '@mui/material/Pagination';
import { getAllIds, getAllProducts, getFilteredProducts, getAllBrands } from './api';

const ITEMS_PER_PAGE = 50;

const App = () => {
  const [filter, setFilter] = useState({ name: '', price: '', brand: '' });
  const [showFilter, setShowFilter] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProductIds, setFilteredProductIds] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [allIds, setAllIds] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [productsFound, setProductsFound] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const brandList = await getAllBrands();
        setAvailableBrands(brandList);
        await getAllIds(setAllIds, setTotalPages, setLoading);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = page * ITEMS_PER_PAGE;
    const pageIds = filteredProductIds.length > 0 ? filteredProductIds.slice(startIndex, endIndex) : allIds.slice(startIndex, endIndex);
    getAllProducts(pageIds, setProducts, setLoading);
  }, [page, filteredProductIds, allIds]);

  const handleFilterApply = async () => {
    try {
      if (filterIsEmpty(filter)) {
        setFilteredProductIds([]);
        setTotalPages(Math.ceil(allIds.length / ITEMS_PER_PAGE));
      } else {
        const filteredIds = await getFilteredProducts(filter);
        setFilteredProductIds(filteredIds);
        setTotalPages(Math.ceil(filteredIds.length / ITEMS_PER_PAGE));
        setProductsFound(filteredIds.length > 0);
      }
    } catch (error) {
      console.error('Error applying filter:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterIsEmpty = (filter) => {
    return Object.values(filter).every(value => value === '');
  };

  const handleOverlayClick = () => {
    setShowFilter(false);
  };

  const handleClearFilter = () => {
    setFilter({ name: '', price: '', brand: '' });
  };

  const handleFilterPanelClick = (e) => {
    e.stopPropagation();
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div className="bg-white min-h-screen flex items-center flex-col ">
      <div className="container py-8 w-9/12 max-w-screen-lg">
        <h1 className="text-3xl font-serif text-center mt-8 mb-12">Каталог ювелирных изделий</h1>
        <button
          className="bg-gray-500 hover:bg-gray-800 text-white px-4 py-2 rounded-3xl shadow"
          onClick={() => setShowFilter(!showFilter)}
        >
          Все фильтры
        </button>
      </div>
      {loading && (
        <div className="text-center flex items-center">
          <div role="status">
            <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-700" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
          </div>
          <div className='ml-2 text-lg'>Товары загружаются...</div>
        </div>
      )}
      <div className={`grid grid-cols-1 gap-6 w-9/12 ${(!loading && !productsFound) ? 'md:grid-cols-1' : 'md:grid-cols-2'} max-w-screen-lg justify-items-center`}>
        {(!loading && products.length > 0 && productsFound) ? (
          products.map(product => (
            <ProductItem key={product.id} product={product} />
          ))
        ) : (
          <p className="text-center mt-4 text-xl">{(!loading && !productsFound) ? 'К сожалению, в каталоге нет товаров, подходящих под выбранные фильтры. Попробуйте поменять или очистить фильтры, и товары обязательно найдутся.' : ''}</p>
        )}
      </div>

      <div className={`fixed inset-0 overflow-hidden z-10 transition-opacity ${showFilter ? 'pointer-events-auto' : 'pointer-events-none opacity-0'}`}>
        <div className="absolute inset-0 bg-black opacity-25" onClick={handleOverlayClick}></div>
        <div className={`absolute top-0 left-[-30vw] w-[30vw] h-full bg-white shadow-lg transition-transform ${showFilter ? 'translate-x-full' : 'translate-x-0'}`}>
          <Filter
            filter={filter}
            setFilter={setFilter}
            availableBrands={availableBrands}
            handleFilterApply={handleFilterApply}
            handleClearFilter={handleClearFilter}
            handleFilterPanelClick={handleFilterPanelClick}
          />
        </div>
      </div>

      <div className={`flex justify-center inset-x-0 bottom-0 ${loading ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'} transition-opacity`}>
        <Pagination
          className='mt-8'
          count={totalPages}
          showFirstButton
          showLastButton
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default App;