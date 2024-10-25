import { applyMiddleware, combineReducers, legacy_createStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import { authReducer } from "./Auth/Reducer";
import { AllUsersReducer } from "./AllUsers/Reducer";
import { productReducer } from "./Product/Reducer";
import { cartReducer } from "./Cart/Reducer";
import { orderReducer } from "./Order/Reducer";
import { categoryReducer } from "./Category/Reducer";
const rootReducers = combineReducers({
    auth:authReducer,
    users: AllUsersReducer,
    product: productReducer,
    cart: cartReducer,
    order: orderReducer,
    categories: categoryReducer
    
})
export const store = legacy_createStore(rootReducers,applyMiddleware(thunk))