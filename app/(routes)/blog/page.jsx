import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Image from "next/image";

export default async function Blogs() {
  // contentディレクトリ内のマークダウンファイル一覧を取得
  const postsDirectory = path.join(process.cwd(), "content");
  const fileNames = fs.readdirSync(postsDirectory);

  // 各ファイルの中身を取得
  const posts = await Promise.all(
    // 各ファイル情報を取得
    fileNames.map(async (fileName) => {
      const filePath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);
      const title = matter(fileContents)
        .content.split("\n")[1]
        .split("#")[1]
        .trim();

      // slugとinfo(title, date, description)を取得
      return {
        slug: fileName.replace(".md", ""),
        title,
        info: {
          ...data,
        },
      };
    })
  ).then((posts) =>
    // 最新日付順に並び替え
    posts.sort(
      (a, b) =>
        new Date(b.info.date).getTime() - new Date(a.info.date).getTime()
    )
  );

  return (
    <div className="grid grid-cols-3 gap-8">
      {posts.map((post) => (
        <div
          key={post.slug}
          className="flex flex-col hover:bg-slate-50 hover:font-bold"
        >
          <Link href={`/blog/${post.slug}`}>
            <Image
              src={`${post.info.cover}`}
              width={500}
              height={500}
              alt={`${post.title}のサムネイル画像`}
              className="w-full h-36 object-cover"
            />
          </Link>
          <div className="px-4 pb-4">
            <div className="mt-2 flex flex-row items-center">
              <time dateTime={post.info.date} className="text-sm font-normal">
                {post.info.date}
              </time>
            </div>
            <Link href={`/blog/${post.slug}`}>
              <h2 className="mt-4 text-2xl">{post.title}</h2>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
