import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    user:null
}

export const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        setUser:(state,action) =>{
            state.user = action.payload;
        }
    }
});

const userReducer = userSlice.reducer;

export const {setUser} = userSlice.actions;

export default userReducer;