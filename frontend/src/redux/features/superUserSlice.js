import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    admins:null
}

export const superuserSlice = createSlice({
    name:'superuser',
    initialState,
    reducers:{
        setAdmins:(state,action) =>{
            state.admins = action.payload;
        }
    }
});

const superuserReducer = superuserSlice.reducer;

export const {setAdmins} = superuserSlice.actions;

export default superuserReducer;