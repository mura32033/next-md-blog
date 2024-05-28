import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Image from 'next/image';

export default async function Blogs() {
  // contentディレクトリ内のマークダウンファイル一覧を取得
  const postsDirectory = path.join(process.cwd(), 'content');
  const fileNames = fs.readdirSync(postsDirectory);

  // 各ファイルの中身を取得
  const posts = await Promise.all(
    // 各ファイル情報を取得
    fileNames.map(async (fileName) => {
      const filePath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      const title = matter(fileContents).content.split('\n')[1].split('#')[1].trim();

      // slugとinfo(title, date, description)を取得
      return {
        slug: fileName.replace('.md', ''),
        info: {
          ...data,
          title
        },
      };
    })
  ).then((posts) =>
    // 最新日付順に並び替え
    posts.sort((a, b) => new Date(b.info.date).getTime() - new Date(a.info.date).getTime())
  );

  return (
    <div className='w-1/2 m-auto flex flex-col min-h-screen'>
      <header className='flex flex-row items-center py-8'>
        <div className='text-4xl font-bold'>My Blog</div>
        <nav className='ml-auto flex flex-row gap-4'>
          <Link href='/'>Home</Link>
          <Link href='/about'>About</Link>
          <Link href='/blog'>Blog</Link>
        </nav>
      </header>
      <main className='flex-1 py-8'>
        <div className='grid grid-cols-3'>
          {posts.map((post) => (
            <div key={post.slug}>
              <time dateTime={post.info.date}>{post.info.date}</time>
              {post.info.tags ? (
                <span className='text-sm border rounded-full px-2 py-1'>{post.info.tags}</span>
              ) : null}
              <h2 className='text-2xl'>
                <Link href={`/blog/${post.slug}`}>{post.info.title}</Link>
              </h2>
              <Image src={`${post.info.cover}`} width="100" height="100" alt={`${post.info.title}のサムネイル画像`} />
            </div>
          ))}
        </div>
      </main>
      <footer>
        <span>© {new Date().getFullYear()} My Blog</span>
      </footer>
    </div>
  );
}