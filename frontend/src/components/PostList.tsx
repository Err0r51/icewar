import type { Post } from '../types'

export default function PostList({ Posts }: { Posts: Post[] }) {
  return (
    <div className="flex-auto items-center">
      <div>
        {Posts.map(({ id, title, Url }) => (
          <div key={id}>
            <h3>{title}</h3>
            <PostObj url={Url} />
          </div>
        ))}
      </div>
    </div>
  )
}

function PostObj({ url }: { url: string }) {
  return (
    <div>
      <h3>{url}</h3>
    </div>
  )
}
