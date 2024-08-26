import { createBrowserRouter } from "react-router-dom";
import HomePage from "../customer/pages/HomePage/HomePage";
import Cart from "../customer/components/CartProduct/Cart";
import Product from "../customer/components/Product/Product";
import ProductDetails from "../customer/components/ProductDetails/ProductDetails";
import Checkout from "../customer/components/Checkout/Checkout";
import Order from "../customer/components/Order/Order";
import OrderDetails from "../customer/components/Order/OrderDetails";
import BaseLayout from "../layout/BaseLayout";
import Login from "../customer/components/Login/Login";
import Register from "../customer/components/register/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseLayout />,
    children: [
      {
        path:"/",
        element: <HomePage />,
      },
      {
        path:"login",
        element:<Login/>
      },
      {
        path:"register",
        element:<Register/>
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "product/:productId",
        element: <ProductDetails />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "account/order",
        element: <Order />,
      },
      {
        path: "account/order/:orderId",
        element: <OrderDetails />,
      },
      {
        path: ":levelOne/:levelTwo/:levelThree",
        element: <Product />,
      },
    ],
  },
]);
