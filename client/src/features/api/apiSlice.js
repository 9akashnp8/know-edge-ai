import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'apiSlice',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api'}),
    endpoints: (builder) => ({
        listDocuments: builder.query({
            query: () => '/documents'
        }),
        getDocument: builder.query({
            query: (fileName) => ({
                url: `/documents/${fileName}`,
                responseHandler: (response) => response.blob()
            }),
        })
    })
})

export const {
    useListDocumentsQuery,
    useGetDocumentQuery
} = apiSlice 