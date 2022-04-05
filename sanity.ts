import { ClientConfig, createClient, createCurrentUserHook } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const config: ClientConfig = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  apiVersion: '2022-04-03',
  useCdn: process.env.NODE_ENV === 'production',
}

export const sanityClient = createClient(config)

export const UseCurrentUser = createCurrentUserHook(config)

export const urlFor = (source: any) => imageUrlBuilder(config).image(source)
