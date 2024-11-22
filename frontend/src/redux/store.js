

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice.js";
import superuserReducer from "./features/superUserSlice.js";
import adminReducer from "./features/adminSlice.js";

const store = configureStore({
    reducer: {
        user: userReducer,
        superuser: superuserReducer,
        admin:adminReducer
    }
})

export default store