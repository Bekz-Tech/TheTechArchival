import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  allUser: [],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAllUser: (state, action) => {
      state.allUser = action.payload;
    },
    resetUser: (state) => {
      state.user = null;
      state.allUser = [];
    },
  },
});

export const { setUser, setAllUser, resetUser } = usersSlice.actions;
export default usersSlice.reducer;
