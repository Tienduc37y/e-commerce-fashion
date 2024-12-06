import { createBrowserRouter } from "react-router-dom";
import HomePage from "../customer/pages/HomePage/HomePage";
import Product from "../customer/components/Product/Product";
import ProductDetails from "../customer/components/ProductDetails/ProductDetails";
import Checkout from "../customer/pages/Checkout/Checkout";
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
import AdminMiddleware from "../middleware/AdminMiddleware";
import ReviewProduct from "../customer/components/Review/ReviewProduct";
import PromotionsTable from "../admin/pages/PromotionsTable";
import BannersTable from "../admin/pages/BannersTable";
import ThirdLevelProduct from "../customer/components/Product/ThirdLevelProduct";
import TopLevelProduct from "../customer/components/Product/TopLevelProduct";
import ScrollWrapper from "../customer/components/ScrollToTop/ScrollToTop";
import SizeGuideDetails from "../customer/components/SizeGuide/SizeGuideDetails";
import ReviewFeedback from "../admin/pages/ReviewFeedback";
import AuthorizedMiddleware from "../middleware/AuthorizedMiddleware";

export const router = createBrowserRouter([
  {
    element: <ScrollWrapper />,
    children: [
      {
        path: "/",
        element: <BaseLayout />,
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
          {
            element: <AuthorizedMiddleware />,
            children: [
              {
                path: "/user-profile",
                element: <UserProfile/>
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
                path: "review/:productId",
                element: <ReviewProduct />,
              },
            ]
          },
          {
            path: ":levelOne/:levelTwo/:levelThree",
            element: <Product />,
          },
          {
            path: "product/:slugProduct/:productId",
            element: <ProductDetails />,
          },
          {
            path: "/third-level-category/:chuoi",
            element: <ThirdLevelProduct />
          },
          {
            path: "/top-level-category/:chuoi",
            element: <TopLevelProduct />
          },
          {
            path: "/size-guide",
            element: <SizeGuideDetails />
          }
        ],
      },
      {
        path: "/",
        element: <AuthorizedMiddleware/>,
        children: [
          {
            path: "/checkout",
            element: <Checkout />
          }
        ],
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/admin",
        element: <AdminMiddleware />,
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
                path: "promotions",
                element: <PromotionsTable/>
              },
              {
                path: "reviews",
                element: <ReviewFeedback/>
              },
              {
                path: "banners",
                element: <BannersTable/>
              }
            ]
          }
        ]
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
]);
