import { Fragment, useEffect, useState, useCallback } from "react";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import TextField from "@mui/material/TextField";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logout } from "../../../redux/Auth/Action";
import { getCart } from "../../../redux/Cart/Action";
import CartDialog from '../CartProduct/CartDialog';
import { findProductsByName } from "../../../redux/Product/Action";
import { convertCurrency } from "../../../common/convertCurrency";
import SearchDialog from './SearchDialog';
import useDebounce from '../../../hooks/useDebounce';
import { useNavigationData } from './navigationData';

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()
  const auth = useSelector(store=>store.auth)
  const cart = useSelector(store => store.cart)
  const dispatch = useDispatch()
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openUserMenu = Boolean(anchorEl);
  const accessToken = localStorage.getItem('accessToken')
  const [cartDialogOpen, setCartDialogOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 1500);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState({
    content: [],
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const navigationData = useNavigationData();
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleUserClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseUserMenu = (event) => {
    setAnchorEl(null);
  };

  const handleOpen = () => {
    setOpenAuthModal(true);
  };
  const handleClose = () => {
    setOpenAuthModal(false);
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  };
  const handleCategoryClick = (categoryName) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
    setExpandedSection(null);
  };

  const handleSectionClick = (sectionName) => {
    setExpandedSection(expandedSection === sectionName ? null : sectionName);
  };

  const handleCartClick = () => {
    setCartDialogOpen(true);
  };

  const handleCloseCartDialog = () => {
    setCartDialogOpen(false);
  };

  useEffect(() => {
    if(accessToken){
      dispatch(getUser(accessToken))
    }
  },[accessToken,auth.accessToken])

  useEffect(() => {
    if (accessToken) {
      dispatch(getCart())
    }
  },[cart.updatedCartItem, cart.deletedCartItem, accessToken])

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    const searchProducts = async () => {
      if (debouncedSearchValue.trim()) {
        try {
          const results = await dispatch(findProductsByName(debouncedSearchValue, 1, 1000));
          setSearchResults(results);
          setShowSearchResults(true);
        } catch (error) {
          console.error("Lỗi khi tìm kiếm:", error);
        }
      } else {
        setShowSearchResults(false);
        setSearchResults({
          content: [],
          currentPage: 1,
          totalPages: 1,
          totalItems: 0
        });
      }
    };

    searchProducts();
  }, [debouncedSearchValue, dispatch]);

  const handleSearchProductClick = (product) => {
    navigate(`/product/${product?.slugProduct}/${product?._id}`);
    setSearchDialogOpen(false);
    setSearchValue("");
    setShowSearchResults(false);
  };

  const handleCategoryNavigate = (category, section, item) => {
    if (item && section && category) {
      const path = `/${category.id}/${section.id}/${item.id}`;
      navigate(path);
      setOpen(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                {/* Header của mobile menu */}
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="space-y-2 px-4 py-6">
                  {/* Categories */}
                  {navigationData?.categories?.map((category) => (
                    <div key={category.name} className="border-b">
                      <button
                        onClick={() => handleCategoryClick(category.name)}
                        className="flex w-full items-center justify-between py-3 text-gray-900 hover:text-gray-600"
                      >
                        <span className="font-medium">{category.name}</span>
                        <span className="ml-6 flex items-center">
                          {expandedCategory === category.name ? (
                            <ChevronUpIcon className="h-5 w-5" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5" />
                          )}
                        </span>
                      </button>

                      {expandedCategory === category.name && (
                        <div className="space-y-2 pl-4 pb-3">
                          {category.sections.map((section) => (
                            <div key={section.name}>
                              <button
                                onClick={() => handleSectionClick(section.name)}
                                className="flex w-full items-center justify-between py-2 text-gray-700 hover:text-gray-900"
                              >
                                <span className="font-medium text-lg">{section.name}</span>
                                <span className="ml-6 flex items-center">
                                  {expandedSection === section.name ? (
                                    <ChevronUpIcon className="h-5 w-5" />
                                  ) : (
                                    <ChevronDownIcon className="h-5 w-5" />
                                  )}
                                </span>
                              </button>

                              {expandedSection === section.name &&
                                <ul className="space-y-2 pl-4 pt-2">
                                  {section.items.map((item) => (
                                    <li key={item.name}>
                                      <p
                                        onClick={() => handleCategoryNavigate(category, section, item)}
                                        className="text-gray-500 hover:text-gray-700 cursor-pointer text-base py-1"
                                      >
                                        {item.name}
                                      </p>
                                    </li>
                                  ))}
                                </ul>
                              }
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Pages */}
                  <div className="pt-4">
                    {navigationData.pages.map((page) => (
                      <a
                        key={page.name}
                        href={page.id}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block py-2 text-gray-700 hover:text-gray-900"
                      >
                        {page.name}
                      </a>
                    ))}
                  </div>

                  {/* User Actions */}
                  {!auth.user ? (
                    <div className="border-t pt-4 space-y-2">
                      <Link 
                        to="/login" 
                        className="block py-2 text-gray-700 hover:text-gray-900"
                        onClick={() => setOpen(false)}
                      >
                        Đăng nhập
                      </Link>
                      <Link 
                        to="/register" 
                        className="block py-2 text-gray-700 hover:text-gray-900"
                        onClick={() => setOpen(false)}
                      >
                        Đăng ký
                      </Link>
                    </div>
                  ) : null}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className="relative bg-white">
        <p className="uppercase flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
          Đổi trả hàng miễn phí trong vòng 7 ngày
        </p>

        <nav aria-label="Top">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center px-2 sm:px-4 lg:px-11">
              <button
                type="button"
                className="rounded-md bg-white p-1 sm:p-2 text-gray-400 lg:hidden"
                onClick={() => setOpen(true)}
              >
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Logo */}
              <div 
                onClick={() => navigate("/", { replace: true })} 
                className="ml-2 sm:ml-4 flex lg:ml-0 cursor-pointer"
              >
                <span className="sr-only">Your Company</span>
                <div className="logo-container relative">
                  <span className="text-xl sm:text-2xl font-bold flex items-center">
                    <span className="gin-text bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 
                      bg-size-200 animate-gradient">
                      GIN
                    </span>
                    <span className="store-text relative text-gray-800">
                      STORE
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"></span>
                    </span>
                  </span>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
                </div>
              </div>

              {/* Flyout menus */}
              <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch z-10">
                <div className="flex h-full space-x-8">
                  {navigationData.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      {({ open, close }) => (
                        <>
                          <div className="relative flex">
                            <Popover.Button
                              className={classNames(
                                open
                                  ? "border-indigo-600 text-indigo-600"
                                  : "border-transparent text-gray-700 hover:text-gray-800",
                                "relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out"
                              )}
                            >
                              {category.name}
                            </Popover.Button>
                          </div>

                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Popover.Panel className="absolute inset-x-0 top-full text-sm text-gray-500">
                              {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                              <div
                                className="absolute inset-0 top-1/2 bg-white shadow"
                                aria-hidden="true"
                              />

                              <div className="relative bg-white">
                                <div className="mx-auto max-w-7xl px-8">
                                  <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-12">
                                    <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                      {category.featured.map((item) => (
                                        <div
                                          key={item.name}
                                          className="group relative text-base sm:text-sm"
                                        >
                                          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                            <img
                                              src={item.imageSrc}
                                              alt={item.imageAlt}
                                              className="object-cover object-center"
                                            />
                                          </div>
                                          <a
                                            href={item.href}
                                            className="mt-6 block font-medium text-gray-900"
                                          >
                                            <span
                                              className="absolute inset-0 z-10"
                                              aria-hidden="true"
                                            />
                                            {item.name}
                                          </a>
                                          <p
                                            aria-hidden="true"
                                            className="mt-1"
                                          >
                                            Shop now
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="row-start-1 grid grid-cols-2 gap-x-8">
                                      {category.sections.map((section) => (
                                        <div key={section.name}>
                                          <p className="font-medium text-xl text-gray-900 mb-4">
                                            {section.name}
                                          </p>
                                          <ul
                                            role="list"
                                            aria-labelledby={`${category.id}-${section.id}-heading`}
                                            className="mt-2 space-y-4"
                                          >
                                            {section.items.map((item) => (
                                              <li key={item.name} className="flex">
                                                <button
                                                  onClick={() => {
                                                    handleCategoryNavigate(category, section, item);
                                                    close();
                                                  }}
                                                  className="hover:text-gray-800 text-lg"
                                                >
                                                  {item.name}
                                                </button>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>
                  ))}

                  {navigationData.pages.map((page) => (
                    <a
                      key={page.name}
                      href={page.id}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      {page.name}
                    </a>
                  ))}
                </div>
              </Popover.Group>

              <div className="ml-auto flex items-center gap-1 sm:gap-2 md:gap-8">

                {/* Search - Desktop */}
                <div className="hidden md:flex items-center relative">
                  <div className="flex items-center border rounded-md w-[500px]">
                    <input
                      type="text"
                      value={searchValue}
                      onChange={(e) => handleSearchChange(e)}
                      placeholder="Tìm kiếm sản phẩm..."
                      className="p-2 outline-none w-full"
                    />
                    <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 mr-2 flex-shrink-0" />
                  </div>

                  {/* Dropdown kết quả tìm kiếm */}
                  {showSearchResults && searchResults.content?.length > 0 && (
                    <div className="absolute top-full left-0 mt-1 w-[500px] bg-white border rounded-md shadow-lg z-50">
                      <div className="max-h-[320px] overflow-y-auto">
                        {searchResults.content.map((product) => (
                          <div
                            key={product._id}
                            className="p-3 hover:bg-gray-100 cursor-pointer flex items-center border-b last:border-b-0"
                            onClick={() => {
                              navigate(`/product/${product?.slugProduct}/${product?._id}`);
                              setShowSearchResults(false);
                              setSearchValue("");
                            }}
                          >
                            <div className="w-16 h-16 flex-shrink-0">
                              <img
                                src={product?.variants[0]?.imageUrl}
                                alt={product?.title}
                                className="w-full h-full object-cover rounded-md"
                              />
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {product?.title}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                {convertCurrency(product?.discountedPrice)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="p-2 text-xs text-gray-500 border-t text-center bg-gray-50">
                        Tìm thấy {searchResults.content.length} sản phẩm
                      </div>
                    </div>
                  )}
                </div>

                {/* Search Icon - Mobile */}
                <div className="md:hidden">
                  <button
                    type="button"
                    className="p-2"
                    onClick={() => setSearchDialogOpen(true)}
                  >
                    <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
                  </button>
                </div>

                {/* User menu */}
                {auth.role ? (
                  <div className="relative">
                    <Avatar
                      className="text-white"
                      onClick={handleUserClick}
                      aria-controls={openUserMenu ? "user-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={openUserMenu ? "true" : undefined}
                      sx={{
                        bgcolor: deepPurple[500],
                        color: "white",
                        cursor: "pointer",
                        width: { xs: 32, sm: 40 },
                        height: { xs: 32, sm: 40 },
                      }}
                    >
                      {auth.user?.lastName[0].toUpperCase()}
                    </Avatar>
                    <Menu
                      id="user-menu"
                      anchorEl={anchorEl}
                      open={openUserMenu}
                      onClose={handleCloseUserMenu}
                      MenuListProps={{
                        "aria-labelledby": "user-button",
                      }}
                      PaperProps={{
                        style: {
                          width: 'auto',
                          minWidth: '160px',
                          maxWidth: '90vw',
                          marginTop: '8px',
                        },
                      }}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      slotProps={{
                        paper: {
                          className: 'mt-1 sm:mt-2'
                        }
                      }}
                    >
                      {auth.role === "CUSTOMER" ? [
                        <MenuItem 
                          key="profile" 
                          onClick={() => {
                            navigate("/user-profile");
                            handleCloseUserMenu();
                          }}
                          className="px-4 py-2 text-sm"
                        >
                          Profile
                        </MenuItem>,
                        <MenuItem 
                          key="order" 
                          onClick={() => {
                            navigate("/account/order");
                            handleCloseUserMenu();
                          }}
                          className="px-4 py-2 text-sm"
                        >
                          My Order
                        </MenuItem>,
                        <MenuItem 
                          key="logout" 
                          onClick={() => {
                            handleLogout();
                            handleCloseUserMenu();
                          }}
                          className="px-4 py-2 text-sm"
                        >
                          Logout
                        </MenuItem>
                      ] : [
                        <MenuItem 
                          key="admin" 
                          onClick={() => {
                            navigate("/admin");
                            handleCloseUserMenu();
                          }}
                          className="px-4 py-2 text-sm"
                        >
                          Admin Dashboard
                        </MenuItem>,
                        <MenuItem 
                          key="logout" 
                          onClick={() => {
                            handleLogout();
                            handleCloseUserMenu();
                          }}
                          className="px-4 py-2 text-sm"
                        >
                          Logout
                        </MenuItem>
                      ]}
                    </Menu>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-800 sm:px-2 py-1">Đăng nhập</Link>
                    <Link to="/register" className="text-sm font-medium text-gray-700 hover:text-gray-800 sm:px-2 py-1">Đăng ký</Link>
                  </div>
                )}

                {/* Cart */}
                <div className="flow-root">
                  <Button 
                    onClick={handleCartClick}
                    className="group -m-2 flex items-center p-2"
                  >
                    <ShoppingBagIcon
                      className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                      {cart?.cart?.cartItems?.length}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Cart Dialog */}
      <CartDialog open={cartDialogOpen} onClose={handleCloseCartDialog} />

      {/* Search Dialog for Mobile */}
      <SearchDialog
        open={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchResults={searchResults}
        onProductClick={handleSearchProductClick}
      />
    </div>
  );
}
