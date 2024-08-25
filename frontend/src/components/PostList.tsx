import type { Post } from '../types'

export default function PostList({ Posts }: { Posts: Post[] }) {
  return (
    <div className="flex-auto items-center">
      <ul>
        {Posts.map(Post => (
          <PostObj Post={Post} key={Post.id} />
        ))}
      </ul>
    </div>
  )
}

function PostObj({ Post }: { Post: Post }) {
  return (
    <li>
      <a href={Post.Url} target="_blank" rel="noreferrer">
        <strong>
          {Post.title}
        </strong>
      </a>
    </li>
  )
}
