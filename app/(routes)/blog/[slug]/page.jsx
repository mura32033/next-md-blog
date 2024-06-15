import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import './content.scss';

export async function getStaticPaths() {
  const postsDirectory = path.join(process.cwd(), 'content');
  const fileNames = fs.readdirSync(postsDirectory);

  return {
    paths: fileNames.map((fileName) => {
      return {
        params: {
          slug: fileName.replace('.md', ''),
        },
      };
    }),
    fallback: false,
  };
}

// ブログ記事ページ
export default async function BlogPost({ params }) {
  // URLのパラメータから該当するファイル名を取得 (今回は hello-world)
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'content', `${slug}.md`);

  // ファイルの中身を取得
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const processedContent = await unified().use(remarkParse).use(remarkHtml).use(remarkGfm).process(content);
  const contentHtml = processedContent.toString(); // 記事の本文をHTMLに変換

  return (
    <div className="bg-white px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
        <div
          className="mt-6 blog-content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        ></div>
      </div>
    </div>
  );
}