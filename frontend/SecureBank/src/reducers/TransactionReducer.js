import { createSlice } from "@reduxjs/toolkit";

export const transactionSlice = createSlice({
    name: "transaction",
    initialState: {
        transaction: [],
    },
    reducers: {
        addTransaction: (state, action) => {
            const itemInTransaction = state.transaction;
            const newData = [action.payload];

            if (!itemInTransaction) {
                state.transaction.push({ ...action.payload })
            } else {
                console.log("NEW DATA...",newData)
                state.transaction = newData
            }
        },
        updateTransaction: (state, action) => {
            const itemInTransaction = [action.payload];
            if (itemInTransaction) {
                state.transaction = itemInTransaction;
            }
        },
        removeTransaction: (state, action) => {
            const removeFromLogin = [];
            state.transaction = removeFromLogin;
        }
    }
});


export const { addTransaction, updateTransaction, removeTransaction } = transactionSlice.actions;

export default transactionSlice.reducer;