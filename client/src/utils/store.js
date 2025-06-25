
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import expireInTransform from "redux-persist-transform-expire-in";
import userReducer from './userSlice.js';

const userExpireTransform = expireInTransform({
  expireKey: import.meta.env.VITE_REDUX_EXPIRE_KEY,
  expireSeconds: 86400,
  autoExpire: true,
});

const userPersistConfig = {
  key: 'user',
  storage,
  transforms: [userExpireTransform],
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),

});

const persistedReducer = persistReducer(
  {
    key: 'root',
    storage,
    whitelist: ['user'], 
  },
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
