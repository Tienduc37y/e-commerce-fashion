import { createBrowserRouter } from "react-router-dom";
import HomePage from "../customer/pages/HomePage/HomePage";
import Cart from "../customer/components/CartProduct/Cart";
import Product from "../customer/components/Product/Product";
import ProductDetails from "../customer/components/ProductDetails/ProductDetails";
import Checkout from "../customer/components/Checkout/Checkout";
import Order from "../customer/components/Order/Order";
import OrderDetails from "../customer/components/Order/OrderDetails";
import BaseLayout from "../layout/BaseLayout";
import Login from "../customer/pages/Login/Login";
import Register from "../customer/pages/register/Register";
import ForgotPassword from "../customer/pages/ForgotPassword/ForgotPassword";
import UserProfile from "../customer/components/UserProfile/UserProfile";
import PageNotFound from "../customer/pages/404/PageNotFound";
import Admin from "../admin/pages/Admin";
import AdminDashBoard from "../admin/pages/AdminDashboard"
import ProductsTable from "../admin/pages/ProductsTable";
import CustomersTable from "../admin/pages/CustomersTable";
import OrdersTable from "../admin/pages/OrdersTable";
import CreateProduct from "../admin/pages/CreateProduct";
import AuthMiddleware from "../middleware/AuthMiddleware";

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
        path: "/user-profile",
        element: <UserProfile/>
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
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/register",
    element:<Register/>
  },
  {
    path:"/forgot-password",
    element:<ForgotPassword/>
  },
  {
    path:"/admin",
    element: <AuthMiddleware />,
    children: [
      {
        path: "",
        element: <Admin />,
        children: [
          {
            path: "",
            element: <AdminDashBoard/>
          },
          {
            path: "products",
            element: <ProductsTable/>
          },
          {
            path: "customers",
            element: <CustomersTable/>
          },
          {
            path: "orders",
            element: <OrdersTable/>
          },
          {
            path: "product/create",
            element: <CreateProduct/>
          },
        ]
      }
    ]
  },
  {
    path:"*",
    element:<PageNotFound/>
  },
]);
