import Link from 'next/link';
import type { ReactNode } from 'react';

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="arrow-link">
      {children} <span aria-hidden="true">→</span>
    </Link>
  );
}

export function CommandBlock({ commands }: { commands: string[] }) {
  return (
    <div className="command-block">
      <div className="command-title">
        <span aria-hidden="true">●</span> Terminal
      </div>
      <pre>
        <code>{commands.map((command) => `$ ${command}`).join('\n')}</code>
      </pre>
    </div>
  );
}

export function JsonLd({ value }: { value: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(value).replace(/</g, '\\u003c') }}
    />
  );
}

export function OutcomeList({ items }: { items: string[] }) {
  return (
    <ul className="outcome-list">
      {items.map((item) => (
        <li key={item}>
          <span aria-hidden="true">✓</span>
          {item}
        </li>
      ))}
    </ul>
  );
}
