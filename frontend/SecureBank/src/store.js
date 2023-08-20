import { configureStore } from "@reduxjs/toolkit";
import TransactionReducer from "./reducers/TransactionReducer";

export default configureStore({
    reducer: {
        transaction: TransactionReducer
    }
});