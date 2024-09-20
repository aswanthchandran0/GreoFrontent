import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore,persistReducer } from "redux-persist";
import  userAuthReducer  from "../features/user/auth/authSlice";
import adminAuthReducers from '../features/admin/auth/authSlice'
import storage from "redux-persist/lib/storage";
import modalReducer from "../features/user/modalSlice";

const rootReducer = combineReducers({
    userAuth:userAuthReducer,
    adminAuth:adminAuthReducers,
    modal:modalReducer
})

const persistConfig = {
    key:'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig,rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
})


export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type  AppDispatch = typeof store.dispatch