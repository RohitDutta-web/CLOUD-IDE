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
    }
  }
})

export const { setUser,setIsLoggedIn, logOut } = userSlice.actions
export default userSlice.reducer

