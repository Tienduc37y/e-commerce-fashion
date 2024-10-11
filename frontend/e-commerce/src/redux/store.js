import { applyMiddleware, combineReducers, legacy_createStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import { authReducer } from "./Auth/Reducer";
import { AllUsersReducer } from "./AllUsers/Reducer";
import customerProductReducer from "./Product/Reducer";
import { cartReducer } from "./Cart/Reducer";
import { orderReducer } from "./Order/Reducer";
const rootReducers = combineReducers({
    auth:authReducer,
    users: AllUsersReducer,
    product: customerProductReducer,
    cart: cartReducer,
    order: orderReducer
    
})
export const store = legacy_createStore(rootReducers,applyMiddleware(thunk))