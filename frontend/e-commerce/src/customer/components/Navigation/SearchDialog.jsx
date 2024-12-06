import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { convertCurrency } from "../../../common/convertCurrency";
export default function SearchDialog({ 
  open, 
  onClose, 
  searchValue, 
  onSearchChange, 
  searchResults,
  onProductClick 
}) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-start pt-[10%] justify-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden bg-white text-left shadow-xl transition-all w-full mx-4 sm:mx-0 sm:max-w-lg sm:rounded-lg">
                {/* Header với nút đóng */}
                <div className="flex items-center justify-between p-4 border-b">
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    Tìm kiếm
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Search Input */}
                <div className="p-4 border-b">
                  <div className="flex items-center border rounded-md bg-gray-50">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 ml-3" />
                    <input
                      type="text"
                      value={searchValue}
                      onChange={onSearchChange}
                      placeholder="Tìm kiếm sản phẩm..."
                      className="w-full p-3 outline-none bg-transparent"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Search Results */}
                <div className="max-h-[320px] overflow-y-auto">
                  {searchResults.content?.length > 0 ? (
                    <>
                      {searchResults.content.map((product) => (
                        <div
                          key={product._id}
                          className="p-3 hover:bg-gray-100 cursor-pointer flex items-center border-b last:border-b-0"
                          onClick={() => onProductClick(product)}
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
                      <div className="p-2 text-xs text-gray-500 border-t text-center bg-gray-50">
                        Tìm thấy {searchResults.content.length} sản phẩm
                      </div>
                    </>
                  ) : searchValue ? (
                    <div className="p-4 text-center text-gray-500">
                      Không tìm thấy sản phẩm nào
                    </div>
                  ) : null}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 