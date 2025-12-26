import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Custom heading with anchor links
    h1: ({ children, ...props }) => (
      <h1 className="text-3xl font-bold mt-8 mb-4 first:mt-0" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="text-2xl font-semibold mt-8 mb-3 border-b pb-2" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h3>
    ),
    // Custom paragraph
    p: ({ children, ...props }) => (
      <p className="my-4 leading-7" {...props}>
        {children}
      </p>
    ),
    // Custom links
    a: ({ href, children, ...props }) => {
      const isInternal = href?.startsWith("/") || href?.startsWith("#");
      if (isInternal && href) {
        return (
          <Link
            href={href}
            className="text-green-600 hover:text-green-700 underline underline-offset-4"
            {...props}
          >
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:text-green-700 underline underline-offset-4"
          {...props}
        >
          {children}
        </a>
      );
    },
    // Custom code blocks
    pre: ({ children, ...props }) => (
      <pre
        className="bg-muted rounded-lg p-4 overflow-x-auto my-4 text-sm"
        {...props}
      >
        {children}
      </pre>
    ),
    code: ({ children, ...props }) => {
      // Check if this is inline code (not inside a pre)
      const isInline = typeof children === "string";
      if (isInline) {
        return (
          <code
            className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
            {...props}
          >
            {children}
          </code>
        );
      }
      return <code {...props}>{children}</code>;
    },
    // Custom lists
    ul: ({ children, ...props }) => (
      <ul className="my-4 ms-6 list-disc space-y-2" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="my-4 ms-6 list-decimal space-y-2" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="leading-7" {...props}>
        {children}
      </li>
    ),
    // Custom blockquote
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="border-s-4 border-green-500 ps-4 my-4 italic text-muted-foreground"
        {...props}
      >
        {children}
      </blockquote>
    ),
    // Custom table
    table: ({ children, ...props }) => (
      <div className="my-4 overflow-x-auto">
        <table className="w-full border-collapse" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th
        className="border border-border bg-muted px-4 py-2 text-start font-semibold"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="border border-border px-4 py-2" {...props}>
        {children}
      </td>
    ),
    // Custom horizontal rule
    hr: (props) => <hr className="my-8 border-border" {...props} />,
    // Spread any passed components
    ...components,
  };
}
