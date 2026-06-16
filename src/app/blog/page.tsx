import React from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ArrowLeft, BookOpen, Layers } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/content/site";

interface BlogPost {
  slug: string;
  title: string;
  publishedAt: string;
  summary: string;
  readTime: string;
  tags: string[];
}

const getBlogPosts = (): BlogPost[] => {
  const blogDir = path.join(process.cwd(), "src/content/blog");
  if (!fs.existsSync(blogDir)) return [];
  
  const files = fs.readdirSync(blogDir);
  const posts = files
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(blogDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);
      return {
        slug: file.replace(/\.mdx?$/, ""),
        title: data.title || "Untitled",
        publishedAt: data.publishedAt || "",
        summary: data.summary || "",
        readTime: data.readTime || "",
        tags: data.tags || [],
      };
    });

  // Sort by date descending
  return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
};

export const metadata = {
  title: `Blog Archives | ${siteConfig.name}`,
  description: "Technical logs, research notes, and engineering breakdowns.",
};

export default function BlogIndex() {
  const posts = getBlogPosts();

  return (
    <div className="min-h-screen flex flex-col bg-cyber-black text-slate-200 grid-bg font-sans">
      
      {/* Small Header */}
      <header className="border-b border-white/5 bg-cyber-black/70 backdrop-blur-md fixed top-0 w-full z-50">
        <div className="site-shell h-14 flex items-center justify-between font-mono text-xs">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-neon transition-colors">
            <Layers className="w-4 h-4 text-neon" />
            <span>HOME</span>
          </Link>
          <span className="text-slate-500 uppercase tracking-widest text-[9px]">ENGINEERING_LOGS</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow page-section pt-14">
        <div className="section-shell-blog space-y-16">
          
          {/* Back to Home handle */}
          <div className="font-mono text-xs">
            <Link 
              href="/#blog" 
              className="inline-flex items-center gap-1 text-slate-400 hover:text-neon transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN TO ENGINEERING_LOGS</span>
            </Link>
          </div>
          <div className="w-full h-6"></div>

          {/* Heading */}
          <div className="space-y-5 text-left">
            <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-tight text-white uppercase flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-neon" />
              <span>ARCHIVE_INDEX</span>
            </h1>
            <p className="text-sm text-slate-400 font-mono leading-relaxed max-w-xl">
              Research publications and architectural deep dives. Written dynamically in MDX.
            </p>
          </div>
          <div className="w-full h-6"></div>

          {/* Posts List */}
          <div className="space-y-0 pt-8">
            {posts.length > 0 ? (
              posts.map((post, idx) => (
                <React.Fragment key={post.slug}>
                <article 
                  className="p-8 rounded-xl border border-white/5 bg-neutral-950/40 backdrop-blur-md hover:border-neon/40 hover:bg-neutral-900/10 transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Glowing vertical left bar on hover */}
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-neon scale-y-0 group-hover:scale-y-100 transition-transform duration-300" style={{ backgroundColor: "var(--neon-accent)" }} />

                  <Link href={`/blog/${post.slug}`} className="block space-y-5 pl-2">
                    <div className="flex items-center gap-3 font-mono text-[10px] text-slate-500">
                      <span>{post.publishedAt}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h2 className="text-xl font-mono font-semibold text-white group-hover:text-neon transition-colors duration-200">
                      {post.title}
                    </h2>

                    <p className="text-sm text-slate-400 leading-loose font-sans line-clamp-3">
                      {post.summary}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {post.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="text-[9px] font-mono px-2 py-0.5 rounded border border-white/5 bg-white/5 text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                </article>
                {idx < posts.length - 1 && (
                  <div className="w-full h-6"></div>
                )}
                </React.Fragment>
              ))
            ) : (
              <div className="py-20 text-center text-slate-500 font-mono">
                No articles discovered in directories.
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Small Footer */}
      <footer className="py-10 border-t border-white/5 bg-cyber-black/80 font-mono text-[9px] text-slate-500 text-center">
        <div className="site-shell">
          © {new Date().getFullYear()} SAMUEL MUSA. METADATA FULLY OPTIMIZED.
        </div>
        <div className="w-full h-6"></div>
      </footer>

    </div>
  );
}
