import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../components/header'
import MediumLogo from '../public/images/medium.png'
import { sanityClient, urlFor } from '../sanity'

interface Props {
  posts: [Post]
}
export interface Post {
  _id: string
  title: string
  description: string
  slug: {
    current: string
    _type: string
  }
  mainImage: any
  _createdAt: string
  author: {
    name: string
    image: {
      asset: {
        _ref: string
      }
    }
  }
  body: [object]
}

const Home = ({ posts }: Props) => {
  console.log(posts)

  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Medium -Blog clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <div className="flex items-center justify-between space-x-5 border-y border-black bg-yellow-400 px-10 py-20">
        <div className="space-y-5">
          <h1 className="max-w-xl font-serif text-6xl">
            <span className="underline decoration-black decoration-4">
              Medium
            </span>{' '}
            is a place to Write, Read and Connect
          </h1>
          <h2>
            It's easy and free to post your thinking on any topic and connect
            with millions of other readers.
          </h2>
        </div>
        <div className="hidden h-40 md:inline-flex lg:h-full">
          <Image src={MediumLogo} alt="" />
        </div>
      </div>

      {/* POSTS */}
      <div className="grid gap-3 p-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:p-6">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className="group cursor-pointer border rounded-lg overflow-hidden">
              <img
                className="h-60 w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-105"
                src={urlFor(post.mainImage).url()}
                alt="post"
              />
              <div className="flex justify-between bg-white p-5">
                <div>
                  <p className='text-lg font-bold'>{post.title} - {<span className="text-xs font-normal">{post.author.name}</span>}</p>
                  <p className='py-1 text-md'>{post.description}</p>
                </div>
                <img
                  className="h-12 w-12 rounded-full"
                  src={urlFor(post.author.image).url()}
                  alt="author"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  // Fecth data from Sanity CMS
  const query = `*[_type == "post"]{
    title,
    slug,
    description,
    author -> {
      name,
      image
    },
    mainImage,
    body,
  }`
  const posts = await sanityClient.fetch(query)
  return {
    props: {
      posts,
    },
  }
}

export default Home
