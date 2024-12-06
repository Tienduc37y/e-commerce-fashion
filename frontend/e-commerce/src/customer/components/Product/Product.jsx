import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import FilterListIcon from '@mui/icons-material/FilterList';
import { FormLabel, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import HomeSectionCard from '../HomeSectionList/HomeSectionCard';
import { filters, singleFilter } from './FilterData'
import './ProductCard.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { findProducts } from '../../../redux/Product/Action';
import { useEffect } from 'react';
import { fixedColors } from '../../../utils/colorMapping';

const sortOptions = [
  { name: 'Giá: Thấp đến Cao', value: 'price_low' },
  { name: 'Giá: Cao đến Thấp', value: 'price_high' },
  { name: 'Mới nhất', value: 'newest' },
];
const splitArrayIntoTwo = (array) => {
  const half = Math.ceil(array.length / 2);
  return [array.slice(0, half), array.slice(half)];
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


export default function Product() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()

  const { product } = useSelector(store => store)
  const decodedQueryString = decodeURIComponent(location.search)
  const searchParams = new URLSearchParams(decodedQueryString)

  const colorValue  = searchParams.get('color')
  const sizeValue = searchParams.get('size')
  const priceValue = searchParams.get('price')
  const discountValue = searchParams.get('discount')
  const sortValue = searchParams.get('sort') || '';
  const pageNumberValue = searchParams.get('page') || 1
  const stockValue = searchParams.get('stock')
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedDiscount, setSelectedDiscount] = useState('');
  const [selectedStock, setSelectedStock] = useState(searchParams.get('stock') || '');
  const handleFilter = (value, sectionId) => {
    const searchParams = new URLSearchParams(location.search);
    let filterValue = searchParams.get(sectionId);

    if (filterValue) {
      const values = filterValue.split('_');
      const index = values.indexOf(value);
      if (index > -1) {
        values.splice(index, 1);
      } else {
        values.push(value);
      }
      if (values.length > 0) {
        searchParams.set(sectionId, values.join('_'));
      } else {
        searchParams.delete(sectionId);
      }
    } else {
      searchParams.set(sectionId, value);
    }

    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };
  const handleRadioFilterChange = (e, sectionId) => {
    const searchParams = new URLSearchParams(location.search);
    const value = e.target.value;

    searchParams.set(sectionId, value);

    if (sectionId === 'price') setSelectedPrice(value);
    if (sectionId === 'discount') setSelectedDiscount(value);

    const query = searchParams.toString();
    navigate({search: `?${query}`});
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setSelectedPrice(searchParams.get('price') || '');
    setSelectedDiscount(searchParams.get('discount') || '');
    setSelectedStock(searchParams.get('stock') || '');

    const [minPrice, maxPrice] = priceValue === null ? [0, 100000000] : priceValue.split("-").map(Number);

    const data = {
      topLevelCategory: params.levelOne,
      secondLevelCategory: params.levelTwo,
      thirdLevelCategory: params.levelThree,
      colors: colorValue || [],
      sizes: sizeValue || [],
      minPrice,
      maxPrice,
      minDiscount: discountValue || 0,
      sort: sortValue || "price_low",
      pageNumber: pageNumberValue - 1 || 1,
      pageSize: 10,
      stock: searchParams.get('stock') || "" // Đảm bảo gửi đúng giá trị stock
    };

    dispatch(findProducts(data));
  }, [location.search, params.levelOne, params.levelTwo, params.levelThree]);

  const uniqueColors = useMemo(() => {
    const colorMap = new Map();
    product.products?.content?.forEach(product => {
      product.variants.forEach(variant => {
        if (!colorMap.has(variant.slugColor)) {
          colorMap.set(variant.slugColor, { value: variant.slugColor, label: variant.nameColor });
        }
      });
    });
    return Array.from(colorMap.values());
  }, [product.products?.content]);

  // Cập nhật phần filters
  const updatedFilters = useMemo(() => {
    return filters.map(filter => {
      if (filter.id === "color") {
        return {
          ...filter,
          options: fixedColors
        };
      }
      return filter;
    });
  }, []);

  const isValueSelected = (sectionId, value) => {
    const params = new URLSearchParams(location.search);
    const selectedValues = params.get(sectionId)?.split('_') || [];
    return selectedValues.includes(value);
  };

  const handleSortChange = (value) => {
    const searchParams = new URLSearchParams(location.search);
    if (value) {
      searchParams.set('sort', value);
    } else {
      searchParams.delete('sort');
    }
    navigate({ search: searchParams.toString() });
  };

  const resetFilters = () => {
    setSelectedPrice('');
    setSelectedDiscount('');
    setSelectedStock('');
    const searchParams = new URLSearchParams();
    navigate({ search: searchParams.toString() });
  };

  const handleStockChange = (e) => {
    const searchParams = new URLSearchParams(location.search);
    const value = e.target.value;
    
    if (value) {
      searchParams.set('stock', value);
      setSelectedStock(value);
    } else {
      searchParams.delete('stock');
      setSelectedStock('');
    }

    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Danh mục</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                >
                  <span className="sr-only">Đóng</span>
                  <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 border-t border-gray-200">
                {updatedFilters.map((section) => (
                  <Disclosure key={section.id} as="div" className="border-t border-gray-200 px-4 py-6">
                    {({ open }) => (
                      <>
                        <h3 className="-mx-2 -my-3 flow-root">
                          <DisclosureButton className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">{section.name}</span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon className="h-5 w-5" aria-hidden="true" />
                              ) : (
                                <PlusIcon className="h-5 w-5" aria-hidden="true" />
                              )}
                            </span>
                          </DisclosureButton>
                        </h3>
                        <DisclosurePanel className="pt-6">
                          {section.id === 'color' ? (
                            <div className="space-y-6">
                              {section.options.map((option, optionIdx) => (
                                <div key={option.value} className="flex items-center">
                                  <input
                                    onChange={() => handleFilter(option.value, section.id)}
                                    checked={isValueSelected(section.id, option.value)}
                                    id={`filter-mobile-${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                    className="ml-3 min-w-0 flex-1 text-gray-500"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          ) : section.id === 'size' ? (
                            <div className="space-y-6">
                              {section.options.map((option, optionIdx) => (
                                <div key={option.value} className="flex items-center">
                                  <input
                                    onChange={() => handleFilter(option.value, section.id)}
                                    checked={isValueSelected(section.id, option.value)}
                                    id={`filter-mobile-${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                    className="ml-3 min-w-0 flex-1 text-gray-500"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {section.options.map((option, optionIdx) => (
                                <div key={option.value} className="flex items-center">
                                  <input
                                    onChange={() => handleFilter(option.value, section.id)}
                                    checked={isValueSelected(section.id, option.value)}
                                    id={`filter-mobile-${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                    className="ml-3 min-w-0 flex-1 text-gray-500"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                        </DisclosurePanel>
                      </>
                    )}
                  </Disclosure>
                ))}
                {singleFilter.map((section) => (
                  <Disclosure key={section.id} as="div" className="border-b border-gray-200 px-4 py-6">
                    <h3 className="-my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                        {/* <span className="font-medium">{section.name}</span> */}
                        <span sx={{color:"black"}} className='font-medium text-gray-900'>{section.name}</span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                          <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-4">
                        <FormControl>
                          <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            value={
                              section.id === 'price' 
                                ? selectedPrice 
                                : section.id === 'discount'
                                  ? selectedDiscount
                                  : section.id === 'stock'
                                    ? selectedStock
                                    : ''
                            }
                            name="radio-buttons-group"
                          >
                            {section.options.map((option) => (
                              <FormControlLabel 
                                key={option.value}
                                onChange={(e) => handleRadioFilterChange(e, section.id)} 
                                value={option.value} 
                                control={<Radio />} 
                                label={option.label} 
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
                
                {/* Thêm nút Reset Filter ở đây */}
                <div className="px-4 py-6">
                  <button
                    type="button"
                    onClick={() => {
                      resetFilters();
                      setMobileFiltersOpen(false);
                    }}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Reset Filter
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto px-4 sm:px-6 lg:px-20">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Tìm kiếm</h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sắp xếp
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </MenuButton>
                </div>

                <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.name}>
                        {({ active }) => (
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleSortChange(option.value);
                            }}
                            className={classNames(
                              option.value === searchParams.get('sort') ? 'font-medium text-gray-900' : 'text-gray-500',
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm'
                            )}
                          >
                            {option.name}
                          </a>
                        )}
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              >
                <span className="sr-only">Danh mục</span>
                <FunnelIcon aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Sản phẩm
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
              <div>
                <div className='flex justify-between mb-5'>
                  <h1 className='text-lg opacity-50 font-bold'>Danh mục</h1>
                  <FilterListIcon/>
                </div>
                <form className="hidden lg:block">
                  {updatedFilters.map((section) => (
                    <Disclosure key={section.id} as="div" className="border-b border-gray-200 py-6">
                      <h3 className="-my-3 flow-root">
                        <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                          <span className="font-medium text-gray-900">{section.name}</span>
                          <span className="ml-6 flex items-center">
                            <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                            <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                          </span>
                        </DisclosureButton>
                      </h3>
                      <DisclosurePanel className="pt-6">
                        {section.id === 'color' ? (
                          <div className="grid grid-cols-2 gap-x-4">
                            {splitArrayIntoTwo(section.options).map((column, columnIndex) => (
                              <div key={columnIndex} className="space-y-4">
                                {column.map((option, optionIdx) => (
                                  <div key={option.value} className="flex items-center">
                                    <input
                                      onChange={() => handleFilter(option.value, section.id)}
                                      checked={isValueSelected(section.id, option.value)}
                                      value={option.value}
                                      id={`filter-${section.id}-${optionIdx}-${columnIndex}`}
                                      name={`${section.id}[]`}
                                      type="checkbox"
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor={`filter-${section.id}-${optionIdx}-${columnIndex}`} className="ml-3 text-sm text-gray-600">
                                      {option.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {section.options.map((option, optionIdx) => (
                              <div key={option.value} className="flex items-center">
                                <input
                                  onChange={() => handleFilter(option.value, section.id)}
                                  checked={isValueSelected(section.id, option.value)}
                                  value={option.value}
                                  id={`filter-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor={`filter-${section.id}-${optionIdx}`} className="ml-3 text-sm text-gray-600">
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </DisclosurePanel>
                    </Disclosure>
                  ))}
                  {singleFilter.map((section) => (
                    <Disclosure key={section.id} as="div" className="border-b border-gray-200 py-6">
                      <h3 className="-my-3 flow-root">
                        <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                          {/* <span className="font-medium">{section.name}</span> */}
                          <span sx={{color:"black"}} className='font-medium text-gray-900'>{section.name}</span>
                          <span className="ml-6 flex items-center">
                            <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                            <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                          </span>
                        </DisclosureButton>
                      </h3>
                      <DisclosurePanel className="pt-6">
                        <div className="space-y-4">
                        <FormControl>
                          <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                value={
                                  section.id === 'price' 
                                    ? selectedPrice 
                                    : section.id === 'discount'
                                      ? selectedDiscount
                                      : section.id === 'stock'
                                        ? selectedStock
                                        : ''
                                }
                                name="radio-buttons-group"
                              >
                            {section.options.map((option) => (
                              <FormControlLabel 
                                key={option.value}
                                onChange={(e) => handleRadioFilterChange(e, section.id)} 
                                value={option.value} 
                                control={<Radio />} 
                                label={option.label} 
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>
                        </div>
                      </DisclosurePanel>
                    </Disclosure>
                  ))}
                  
                  {/* Thêm nút Reset Filter ở đây */}
                  <div className="py-6">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Reset Filter
                    </button>
                  </div>
                </form>
              </div>

              {/* Product grid */}
              <div className="col-span-2 lg:col-span-4 w-full">
                {product.products?.content && product.products?.content.length > 0 ? (
                  <div className='flex flex-wrap justify-start bg-white py-5 gap-y-5'>
                    {product.products?.content.map((item, index) => (
                      <div
                        key={index}
                        className="px-2 flex-shrink-0 w-1/2 md:w-1/3 lg:w-1/4"
                      >
                        <HomeSectionCard product={item} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-64">
                    <p className="text-xl text-gray-500">Không có sản phẩm nào</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
