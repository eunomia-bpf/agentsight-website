import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icons';

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function ArrowLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  const content = (
    <>
      {children}
      <Icon name="arrow" size={17} />
    </>
  );
  return external ? (
    <a href={href} className="arrow-link">
      {content}
    </a>
  ) : (
    <Link href={href} className="arrow-link">
      {content}
    </Link>
  );
}

export function CommandBlock({
  commands,
  title = 'Terminal',
}: {
  commands: string[];
  title?: string;
}) {
  return (
    <div className="command-block">
      <div className="command-title">
        <span className="terminal-dot" aria-hidden="true" />
        <Icon name="terminal" size={15} />
        {title}
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
          <span className="outcome-icon" aria-hidden="true">
            <Icon name="check" size={16} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function IconBadge({ name }: { name: IconName }) {
  return (
    <span className="icon-badge" aria-hidden="true">
      <Icon name={name} size={20} />
    </span>
  );
}

export function PageMeta({
  version,
  reviewed,
  author,
}: {
  version: string;
  reviewed: string;
  author: string;
}) {
  return (
    <div className="page-meta" aria-label="Page verification metadata">
      <span><Icon name="check" size={15} />Verified with AgentSight v{version}</span>
      <span><Icon name="time" size={15} />Reviewed {reviewed}</span>
      <span><Icon name="github" size={15} />Maintained by {author}</span>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2>{title}</h2>
      </div>
      <p>{description}</p>
    </div>
  );
}
