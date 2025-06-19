import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  username: "",
  email: "",
  cookie: "",
  isLoggedIn: false,
  isGuest: false,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      const { username, email, cookie, isLoggedIn, isGuest } = action.payload;

      state.username = username;
      state.email = email;
      state.isLoggedIn = isLoggedIn;
      state.isGuest = isGuest;
      state.cookie = cookie;

    },

    logOut(state) {
      state.isLoggedIn = false;
      state.cookie = "";
      state.username = "",
        state.email = "",
        state.isGuest = false
    }
  }
})


export const { setUser, logOut } = userSlice.actions;
export default userSlice.reducer;