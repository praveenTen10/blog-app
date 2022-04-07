import React from 'react'
import { Post } from '../index'
import Header from '../../components/header'
import { urlFor, sanityClient } from '../../sanity'
import { GetStaticProps } from 'next'
import PortableText from 'react-portable-text'
import { MdOutlineComment, MdOutlineSaveAlt } from 'react-icons/md'
import { AiOutlineLike, AiFillLike } from 'react-icons/ai'
import { IoShareOutline } from 'react-icons/io5'

interface Props {
  post: Post
}

function ShowPost({ post }: Props) {
  const [liked, setLiked] = React.useState(false)
  const likesCount = '2.5k'
  const commentsCount = '26'
  return (
    <main>
      <Header />
      <article className="mx-auto max-w-7xl px-5">
        <img
          src={urlFor(post.mainImage).url()}
          className="h-52 w-full object-cover"
          alt=""
        />
        <div className="my-5 flex items-center">
          <img
            className="mr-5 h-12 w-12 rounded-full"
            src={urlFor(post.author.image).url()}
          ></img>
          <article className="flex flex-col gap-1">
            <h3 className="font-bold">{post.author.name}</h3>
            <article className="flex">
              <h1 className="pr-2 capitalize text-gray-500">
                {new Date(post._createdAt).toDateString()}
              </h1>
              &#xb7;
              <h1 className="px-2 text-green-600">{` ${
                Math.floor(Math.random() * 3) + 1
              } min read`}</h1>
            </article>
          </article>
        </div>
        <h4 className="py-6 text-5xl font-bold">{post.title}</h4>
        <em className="text-xl">{post.description}</em>

        <div className="text-justify">
          <PortableText
            className=""
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h1 className="my-5 text-xl font-bold" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ children, href }: any) => (
                <a href={href} className="text-blue-600 hover:underline">
                  {children}
                </a>
              ),
              p: (props: any) => <p className="my-5 text-lg" {...props} />,
            }}
          />
        </div>

        <div className="flex m-w-7xl py-8 text-3xl items-center">
          <div className="mr-1 cursor-pointer">
            {liked ? (
              <AiFillLike onClick={() => setLiked(false)} />
            ) : (
              <AiOutlineLike onClick={() => setLiked(true)} />
            )}
          </div>
          <span className="flex items-center text-sm font-bold text-gray-600">
            {likesCount}
          </span>
          <span className="flex cursor-pointer px-12">
            <MdOutlineComment />
            <span className="ml-1 flex items-center text-sm font-bold text-gray-600">
              {commentsCount}
            </span>
          </span>
          <div className="ml-auto flex cursor-pointer gap-12">
            <div>
              <IoShareOutline />
              <span className="flex items-center justify-center text-sm font-bold text-gray-600">
                Share
              </span>
            </div>
            <div>
              <MdOutlineSaveAlt />
              <span className="flex items-center justify-center text-sm font-bold text-gray-600">
                Save
              </span>
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}

export default ShowPost

export const getStaticPaths = async () => {
  const posts = await sanityClient.fetch(
    `*[_type == "post"] {
        _id,
        slug {
            current
        },
    }`
  )
  // Set as per file name in the pages folder ([slug].tsx)
  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
        title,
        slug,
        _id,
        _createdAt,
        description,
        author -> {
            name,
            image
        },
        mainImage,
        body,
    }`
  const post = await sanityClient.fetch(query, { slug: params?.slug })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 3,
  }
}
