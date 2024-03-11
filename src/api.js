import md5 from "md5";

const API_URL = 'https://api.valantis.store:41000/';
const PASSWORD = 'Valantis';
const ITEMS_PER_PAGE = 50;

const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');

const getAuthHeader = () => {
  return {
    'Content-Type': 'application/json',
    'X-Auth': md5(`${PASSWORD}_${timestamp}`)
  };
};

export const getAllIds = async (setAllIds, setTotalPages, setLoading) => {
  const requestOptions = {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({
      action: 'get_ids',
      params: {
        offset: 0,
        limit: Infinity
      }
    })
  };

  try {
    setLoading(true);
    const response = await fetch(API_URL, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const uniqueIds = [...new Set(data.result)];
    setAllIds(uniqueIds);
    setTotalPages(Math.ceil(uniqueIds.length / ITEMS_PER_PAGE));
  } catch (error) {
    setLoading(false);
    console.error('Error fetching demo products:', error);
  }
};

export const getAllBrands = async () => {
  try {
    const requestOptions = {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        action: 'get_fields',
        params: { field: 'brand', offset: 0, limit: Infinity }
      })
    };
    const response = await fetch(API_URL, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const uniqueBrands = [...new Set(data.result.filter(brand => brand !== null))];
    const sortedBrands = uniqueBrands.sort((a, b) => a.localeCompare(b));
    return sortedBrands;
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
};

export const getAllProducts = async (ids, setProducts, setLoading) => {
  setLoading(true);
  const requestOptions = {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({
      action: 'get_items',
      params: {
        ids: ids
      }
    })
  };

  try {
    const response = await fetch(`${API_URL}`, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const uniqueProducts = removeDuplicates(data.result, 'id');
    setProducts(uniqueProducts);
  } catch (error) {
    console.error('Error fetching items:', error);
  } finally {
    setLoading(false);
    console.log('Продукты всей страницы подгрузились');
  }
};

export const getFilteredProducts = async (filter) => {
  const requests = [];
  
  if (filter.brand) {
    const brandRequestOptions = {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        action: 'filter',
        params: { brand: filter.brand }
      })
    };
    requests.push(fetch(API_URL, brandRequestOptions));
  }
  
  if (filter.name) {
    const nameRequestOptions = {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        action: 'filter',
        params: { product: filter.name }
      })
    };
    requests.push(fetch(API_URL, nameRequestOptions));
  }
  
  if (filter.price) {
    const priceRequestOptions = {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        action: 'filter',
        params: { price: parseFloat(filter.price) }
      })
    };
    requests.push(fetch(API_URL, priceRequestOptions));
  }
  
  const responses = await Promise.all(requests);
  const filteredIdsArrays = await Promise.all(responses.map(async (response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.result;
  }));
  
  const activeFiltersCount = Object.values(filter).filter(value => value !== '').length;
  
  if (activeFiltersCount > 1) {
    const intersection = filteredIdsArrays.reduce((acc, ids) => acc.filter(id => ids.includes(id)));
    return intersection;
  } else {
    return filteredIdsArrays[0];
  }
};

export const removeDuplicates = (array, key) => {
  return array.filter((item, index) => {
    const currentItem = JSON.stringify(item[key]);
    return (
      index ===
      array.findIndex((obj) => {
        return JSON.stringify(obj[key]) === currentItem;
      })
    );
  });
};