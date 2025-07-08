import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoggedIn: false,

}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    logOut(state) {
      state.user = null;
      state.isLoggedIn = false;
    },
    verified(state, action) { 
      state.user.user.verification = action.payload
    }
  }
})

export const { setUser,setIsLoggedIn, logOut, verified } = userSlice.actions
export default userSlice.reducer

