// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import type 

// export const siteAPI = createApi({
//     recucerPath: 'siteAPI',

// })



export type Site = {
    uuid?: string,
    siteID: number,
    address: string,
    latitude: number,
    longitude: number,
    lastUpdated: Date,
    city: string,
    region: string
}