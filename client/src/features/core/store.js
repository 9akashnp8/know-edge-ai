
import { configureStore } from '@reduxjs/toolkit'

import { apiSlice } from '../api/apiSlice'
import chatSlice from '../chat/chatSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    chatMessage: chatSlice
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({serializableCheck: false}).concat(apiSlice.middleware),
})
