import fs from "node:fs/promises";
import path from "node:path";
import SiteHeader from "@/app/components/SiteHeader";

type LegalMarkdownPageProps = {
  fileName: string;
  titleOverride?: string;
};

function renderInline(text: string) {
  const parts = text.split(
    /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/g
  );

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-slate-950">
          {part.slice(2, -2)}
        </strong>
      );
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          className="font-medium text-slate-900 underline-offset-4 transition hover:text-amber-600 hover:underline focus:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-200"
        >
          {linkMatch[1]}
        </a>
      );
    }

    if (/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(part)) {
      return (
        <a
          key={index}
          href={`mailto:${part}`}
          className="font-medium text-slate-900 underline-offset-4 transition hover:text-amber-600 hover:underline focus:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-200"
        >
          {part}
        </a>
      );
    }

    return part;
  });
}

function renderMarkdown(markdown: string, title: string, lastUpdated: string) {
  const lines = markdown.split(/\r?\n/);
  const nodes: React.ReactNode[] = [];
  let listItems: string[] = [];

  function flushList() {
    if (!listItems.length) return;

    nodes.push(
      <ul
        key={`ul-${nodes.length}`}
        className="my-7 list-disc space-y-3 ps-7 text-slate-700 marker:text-slate-400"
      >
        {listItems.map((item, index) => (
          <li key={index}>{renderInline(item)}</li>
        ))}
      </ul>
    );
    listItems = [];
  }

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed === `# ${title}` || trimmed === lastUpdated) {
      return;
    }

    if (!trimmed) {
      flushList();
      return;
    }

    if (trimmed.startsWith("- ")) {
      listItems.push(trimmed.slice(2));
      return;
    }

    flushList();

    if (trimmed.startsWith("# ")) {
      return;
    }

    if (trimmed.startsWith("## ")) {
      nodes.push(
        <h2
          key={`h2-${nodes.length}`}
          className="mt-12 text-xl font-bold tracking-tight text-slate-950 first:mt-0 md:mt-14 md:text-[1.35rem]"
        >
          {renderInline(trimmed.slice(3))}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith("### ")) {
      nodes.push(
        <h3
          key={`h3-${nodes.length}`}
          className="mt-8 text-base font-bold tracking-tight text-slate-950 md:text-lg"
        >
          {renderInline(trimmed.slice(4))}
        </h3>
      );
      return;
    }

    nodes.push(
      <p key={`p-${nodes.length}`} className="my-6 text-slate-700">
        {renderInline(trimmed)}
      </p>
    );
  });

  flushList();
  return nodes;
}

export default async function LegalMarkdownPage({
  fileName,
  titleOverride,
}: LegalMarkdownPageProps) {
  const filePath = path.join(process.cwd(), "content", "legal", fileName);
  const markdown = await fs.readFile(filePath, "utf8");
  const markdownTitle = markdown.match(/^#\s+(.+)$/m)?.[1] || "Legal";
  const title = titleOverride || markdownTitle;
  const lastUpdatedMatch = markdown.match(/^\*\*Last updated:\*\*\s+(.+)$/m);
  const lastUpdated = lastUpdatedMatch?.[0] || "";
  const lastUpdatedText = lastUpdatedMatch?.[1] || "";

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader sticky />

      <section className="mx-auto max-w-[760px] px-5 py-14 md:px-6 md:py-20">
        <article className="legal-page-fade rounded-[22px] border border-slate-200 bg-white px-6 py-12 shadow-sm md:px-14 md:py-14">
          <header>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-[3.25rem] md:leading-[1.05]">
              {title}
            </h1>
            {lastUpdatedText && (
              <p className="mt-4 text-sm font-medium text-slate-500">
                Last updated: {lastUpdatedText}
              </p>
            )}
          </header>

          <div className="mt-10 text-[1.01rem] leading-[1.8] text-slate-700 md:mt-12 md:text-[1.04rem]">
            {renderMarkdown(markdown, markdownTitle, lastUpdated)}
          </div>

          <aside className="mt-14 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-bold tracking-tight text-slate-950">
              Questions?
            </p>
            <p className="mt-4 text-sm font-medium text-slate-700">
              Hashim Alkhateeb
            </p>
            <a
              href="mailto:Alkhateeb.Hashim@outlook.com"
              className="mt-1 inline-block text-sm font-medium text-slate-700 underline-offset-4 transition hover:text-amber-600 hover:underline focus:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-200"
            >
              Alkhateeb.Hashim@outlook.com
            </a>
          </aside>
        </article>
      </section>
    </main>
  );
}
