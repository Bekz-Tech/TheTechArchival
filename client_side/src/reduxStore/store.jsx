import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import uiReducer from './slices/uiSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session'; // Use sessionStorage
import { combineReducers } from 'redux'; // Used to combine reducers with persistReducer
import logger from 'redux-logger'; // Import redux-logger
import adminDataReducer from './slices/adminDataSlice';
import messageReducer from './slices/messageSlice';
import streamReducer from './slices/videoCallSlice';


// Redux Persist Config
const persistConfig = {
  key: 'root', // Key to store the persisted state
  storage, // sessionStorage is used here
  whitelist: ['users'], // Only persist the 'users' slice (whitelist)
};

// Combine reducers (ui slice is not persisted, so no need to include it in the persistConfig)
const rootReducer = combineReducers({
  users: usersReducer,
  ui: uiReducer,
  adminData: adminDataReducer,
  message: messageReducer,
  stream: streamReducer,
});

// Wrap your reducers with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure Store with Redux Persist and make sure devTools is enabled
const store = configureStore({
  reducer: persistedReducer,
  
  // To ensure Redux DevTools are enabled, we hardcode `true` for testing
  devTools: true, // Remove conditional to make sure DevTools works
  
  // Add middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger), // Add redux-logger to the middleware chain
});

const persistor = persistStore(store); // Create a persistor

export { store, persistor };
