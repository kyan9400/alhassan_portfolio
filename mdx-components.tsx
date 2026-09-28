import { Children, isValidElement, type ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import { headingId } from "@/lib/notes";

/*
 * Global MDX elements for /notes (required by @next/mdx with the App Router). Styles follow the site:
 * hairline rules, muted body text, accent only on links. Logical properties (ps-, border-s) so Arabic
 * posts mirror. Code is always left to right.
 */

const components: MDXComponents = {
  h2: ({ children, ...props }) => (
    <h2 {...props} className="mt-14 scroll-mt-28 text-2xl font-semibold leading-tight text-text md:text-[1.75rem]">
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 {...props} className="mt-10 scroll-mt-28 text-lg font-semibold leading-snug text-text md:text-xl">
      {children}
    </h3>
  ),
  p: (props) => <p {...props} className="mt-5 text-pretty text-base leading-[1.8] text-muted md:text-[17px]" />,
  a: ({ href = "", ...props }) => {
    const external = /^https?:\/\//.test(href);
    return (
      <a
        {...props}
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="font-medium text-accent-ink underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-current"
      />
    );
  },
  strong: (props) => <strong {...props} className="font-semibold text-text" />,
  ul: (props) => <ul {...props} className="mt-5 list-disc space-y-2 ps-5 text-base leading-[1.75] text-muted marker:text-muted/60 md:text-[17px]" />,
  ol: (props) => <ol {...props} className="mt-5 list-decimal space-y-2 ps-5 text-base leading-[1.75] text-muted marker:text-muted/60 md:text-[17px]" />,
  blockquote: (props) => <blockquote {...props} className="mt-8 border-s-2 border-accent/50 ps-5 [&>p]:mt-0 [&>p]:text-text/80" />,
  hr: () => <hr className="my-12 border-t hairline" />,
  code: (props) => (
    <code {...props} dir="ltr" className="rounded-md bg-surface px-1.5 py-0.5 font-mono text-[0.88em] text-text [pre_&]:bg-transparent [pre_&]:p-0" />
  ),
  pre: (props) => (
    <pre
      {...props}
      dir="ltr"
      tabIndex={0}
      className="mt-6 overflow-x-auto rounded-2xl border hairline bg-card/80 p-5 text-left font-mono text-[13px] leading-relaxed text-text"
    />
  ),
  img: ({ alt = "", ...props }) => (
    // Post images are plain files under /public; next/image needs sizes the markdown does not carry.
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={alt} loading="lazy" className="mt-8 h-auto max-w-full rounded-2xl border hairline" />
  )
};

export function useMDXComponents(): MDXComponents {
  return components;
}

/** Visible text of rendered heading children (strings, inline code, links…). */
function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return Children.toArray(node).map(textOf).join("");
}

/**
 * h2/h3 with ids for one post. The ids come from headingId() with a per-post counter, in document
 * order: the same function and order as the table of contents (lib/notes.ts), so every TOC link lands.
 * Create a fresh set for each render.
 */
export function createHeadingComponents(): MDXComponents {
  const seen = new Map<string, number>();
  const id = (children: ReactNode) => headingId(textOf(children).trim(), seen);
  const H2 = components.h2 as (props: { id: string; children?: ReactNode }) => ReactNode;
  const H3 = components.h3 as (props: { id: string; children?: ReactNode }) => ReactNode;
  // Other heading levels still advance the counter, like extractHeadings() does.
  return {
    h1: function NoteH1({ children }) {
      return <h1 id={id(children)}>{children}</h1>;
    },
    h2: function NoteH2({ children }) {
      return <H2 id={id(children)}>{children}</H2>;
    },
    h3: function NoteH3({ children }) {
      return <H3 id={id(children)}>{children}</H3>;
    },
    h4: function NoteH4({ children }) {
      return <h4 id={id(children)}>{children}</h4>;
    },
    h5: function NoteH5({ children }) {
      return <h5 id={id(children)}>{children}</h5>;
    },
    h6: function NoteH6({ children }) {
      return <h6 id={id(children)}>{children}</h6>;
    }
  };
}
