import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    teams:null,
    adminId:null

}

export const adminSlice = createSlice({
    name:'admin',
    initialState,
    reducers:{
        setTeams:(state,action) =>{
            state.teams = action.payload;
        },
        setAdminId:(state,action)=>{
            state.adminId = action.payload
        }
    }
});

const adminReducer = adminSlice.reducer;

export const {setTeams,setAdminId} = adminSlice.actions;

export default adminReducer;