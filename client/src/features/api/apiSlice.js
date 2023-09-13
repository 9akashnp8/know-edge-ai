import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'apiSlice',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api'}),
    endpoints: (builder) => ({
        listDocuments: builder.query({
            query: () => '/allfiles'
        }),
        getDocument: builder.query({
            query: (fileName) => ({
                url: `/getfile/?file_name=${fileName}`,
                responseHandler: (response) => response.blob()
            }),
        })
    })
})

export const {
    useListDocumentsQuery,
    useGetDocumentQuery
} = apiSlice 