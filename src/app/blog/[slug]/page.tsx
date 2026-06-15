import React from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ArrowLeft, Clock, Calendar, Tag, Layers } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/content/site";
import { notFound } from "next/navigation";

interface BlogPost {
  title: string;
  publishedAt: string;
  summary: string;
  readTime: string;
  tags: string[];
  content: string;
}

// Define compile params type
interface PageProps {
  params: Promise<{ slug: string }>;
}

const getPostData = async (slug: string): Promise<BlogPost | null> => {
  const blogDir = path.join(process.cwd(), "src/content/blog");
  const filePath = path.join(blogDir, `${slug}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  
  return {
    title: data.title || "Untitled",
    publishedAt: data.publishedAt || "",
    summary: data.summary || "",
    readTime: data.readTime || "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    content,
  };
};

// Generate static parameters for Next.js build optimization
export async function generateStaticParams() {
  const blogDir = path.join(process.cwd(), "src/content/blog");
  if (!fs.existsSync(blogDir)) return [];
  
  const files = fs.readdirSync(blogDir);
  return files
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => ({
      slug: file.replace(/\.mdx?$/, ""),
    }));
}

// Generate dynamic metadata for SEO optimization
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostData(slug);
  if (!post) return {};
  
  return {
    title: `${post.title} | ${siteConfig.name} Blog`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

// Simple but beautiful Markdown compiler helper
function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let codeLanguage = "";
  let inList = false;
  let listItems: string[] = [];

  const flushList = (key: number) => {
    if (listItems.length === 0) return null;
    const items = [...listItems];
    listItems = [];
    inList = false;
    
    const listEl = (
      <ul key={`list-${key}`} className="list-disc pl-6 space-y-3 text-slate-300 font-sans text-sm md:text-base text-justify">
        {items.map((item, idx) => (
          <li key={idx} dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(item) }} />
        ))}
      </ul>
    );
    if (elements.length > 0) {
      elements.push(<div key={`spacer-list-${key}`} className="w-full h-6"></div>);
    }
    return listEl;
  };

  const parseInlineMarkdown = (text: string) => {
    // Bold parsing: **text**
    let parsed = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
    // Inline code parsing: `code`
    parsed = parsed.replace(/`(.*?)`/g, '<code class="font-mono text-xs px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-neon-cyan">$1</code>');
    // Math latex parsing: $$formula$$
    parsed = parsed.replace(/\$\$(.*?)\$\$/g, '<span class="font-mono text-neon-cyan">$1</span>');
    // Math latex inline: $formula$
    parsed = parsed.replace(/\$(.*?)\$/g, '<span class="font-mono text-neon-cyan">$1</span>');
    return parsed;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 1. Code Block toggle handler
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        // End of code block - render code panel
        const code = codeBlockLines.join("\n");
        if (elements.length > 0) {
          elements.push(<div key={`spacer-code-${i}`} className="w-full h-6"></div>);
        }
        elements.push(
          <div key={`code-${i}`} className="rounded-xl border border-white/5 bg-neutral-950/80 overflow-hidden font-mono text-xs">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-neutral-900/30 text-slate-500 text-[10px]">
              <span className="uppercase tracking-wider">{codeLanguage || "code"} buffer</span>
              <span>STABLE</span>
            </div>
            <pre className="p-4 overflow-x-auto text-emerald-400 leading-relaxed whitespace-pre font-mono">
              <code>{code}</code>
            </pre>
          </div>
        );
        codeBlockLines = [];
        inCodeBlock = false;
      } else {
        // Start of code block
        codeLanguage = line.replace("```", "").trim();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // 2. Unordered lists handler
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      if (!inList) {
        inList = true;
      }
      listItems.push(line.replace(/^[\s*-]+/, "").trim());
      continue;
    } else if (inList && line.trim() !== "") {
      // Continue list if line is not blank, but wait!
      // If line doesn't start with list marker, it means list has ended
      const listEl = flushList(i);
      if (listEl) elements.push(listEl);
    }

    // Flush list on blank line
    if (line.trim() === "" && inList) {
      const listEl = flushList(i);
      if (listEl) elements.push(listEl);
      continue;
    }

    if (line.trim() === "") {
      continue;
    }

    // 3. Headings H1, H2, H3
    if (line.startsWith("# ")) {
      if (elements.length > 0) elements.push(<div key={`spacer-h1-${i}`} className="w-full h-6"></div>);
      elements.push(
        <h1 key={i} className="text-3xl md:text-4xl font-mono font-bold text-white uppercase border-b border-white/5 pb-3">
          {line.replace("# ", "").trim()}
        </h1>
      );
    } else if (line.startsWith("## ")) {
      if (elements.length > 0) elements.push(<div key={`spacer-h2-${i}`} className="w-full h-6"></div>);
      elements.push(
        <h2 key={i} className="text-2xl md:text-3xl font-mono font-semibold text-white uppercase">
          {line.replace("## ", "").trim()}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      if (elements.length > 0) elements.push(<div key={`spacer-h3-${i}`} className="w-full h-6"></div>);
      elements.push(
        <h3 key={i} className="text-xl md:text-2xl font-mono font-semibold text-slate-100">
          {line.replace("### ", "").trim()}
        </h3>
      );
    }
    // 4. Blockquotes
    else if (line.startsWith("> ")) {
      if (elements.length > 0) elements.push(<div key={`spacer-bq-${i}`} className="w-full h-6"></div>);
      elements.push(
        <blockquote key={i} className="pl-5 border-l-2 border-neon-cyan bg-white/2 p-5 rounded text-slate-300 font-sans italic text-sm md:text-base text-justify">
          <p dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(line.replace("> ", "").trim()) }} />
        </blockquote>
      );
    }
    // 5. Standard paragraph
    else {
      if (elements.length > 0) elements.push(<div key={`spacer-p-${i}`} className="w-full h-6"></div>);
      elements.push(
        <p 
          key={i} 
          className="text-slate-350 leading-loose font-sans text-sm md:text-base text-justify"
          dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(line.trim()) }}
        />
      );
    }
  }

  // Final list flush
  if (inList) {
    const listEl = flushList(lines.length);
    if (listEl) elements.push(listEl);
  }

  return elements;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostData(slug);
  
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-cyber-black text-slate-200 grid-bg font-sans">
      
      {/* Small Header */}
      <header className="border-b border-white/5 bg-cyber-black/70 backdrop-blur-md sticky top-0 z-40">
        <div className="site-shell h-14 flex items-center justify-between font-mono text-xs">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-neon transition-colors">
            <Layers className="w-4 h-4 text-neon" />
            <span>HOME</span>
          </Link>
          <span className="text-slate-500 uppercase tracking-widest text-[9px]">ENGINEERING_LOG</span>
        </div>
      </header>

      {/* Main post body */}
      <main className="flex-grow page-section">
        <article className="section-shell-blog">
          
          {/* Back handle */}
          <div className="font-mono text-xs">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-1 text-slate-400 hover:text-neon transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN TO INDEX</span>
            </Link>
          </div>
          
          <div className="w-full h-6"></div>

          {/* Heading Cover */}
          <div className="border-b border-white/5 pb-10">
            <h1 className="text-3xl md:text-5xl font-mono font-bold tracking-tight text-white uppercase leading-tight">
              {post.title}
            </h1>
            
            <div className="w-full h-6"></div>
            
            {/* Metadata bar */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-neon" />
                <span>{post.publishedAt}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-neon" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-neon" />
                <div className="flex gap-1.5">
                  {post.tags.map((t) => (
                    <span key={t} className="px-1.5 py-0.5 rounded border border-white/5 bg-white/5 text-[10px] text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-6"></div>

          {/* Dynamic Post content compiled */}
          <div>
            {renderMarkdown(post.content)}
          </div>

        </article>
      </main>

      {/* Small Footer */}
      <footer className="py-10 border-t border-white/5 bg-cyber-black/80 font-mono text-[9px] text-slate-500 text-center">
        <div className="site-shell">
          © {new Date().getFullYear()} SAMUEL MUSA. TRANSACTION BUNDLED & SEALED.
        </div>
        <div className="w-full h-6"></div>
      </footer>

    </div>
  );
}
