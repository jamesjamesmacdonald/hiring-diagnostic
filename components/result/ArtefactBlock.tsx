'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Artefact } from '@/lib/types';

type Props = { artefact: Artefact };

export default function ArtefactBlock({ artefact }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(artefact.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Older browsers: noop. The text is still visible.
    }
  }

  return (
    <section className="mb-8 border border-grey-medium rounded-lg overflow-hidden">
      <div className="bg-navy text-white px-5 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-eyebrow text-gold uppercase mb-1">Artefact</p>
          <h3 className="text-lg font-bold truncate">{artefact.title}</h3>
        </div>
        <button
          type="button"
          onClick={copy}
          className="flex-shrink-0 px-3 py-1.5 bg-gold text-navy text-sm font-bold rounded hover:opacity-90 transition"
        >
          {copied ? 'Copied' : 'Copy to clipboard'}
        </button>
      </div>
      <div className="p-5 bg-white">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: (props) => (
              <h1 className="text-xl font-bold text-navy mt-6 mb-2" {...props} />
            ),
            h2: (props) => (
              <h2 className="text-lg font-bold text-navy mt-5 mb-2" {...props} />
            ),
            h3: (props) => (
              <h3
                className="text-base font-bold text-navy mt-4 mb-2"
                {...props}
              />
            ),
            p: (props) => (
              <p
                className="text-sm text-black mb-3 leading-relaxed"
                {...props}
              />
            ),
            strong: (props) => <strong className="font-bold" {...props} />,
            em: (props) => <em className="italic" {...props} />,
            ul: (props) => (
              <ul
                className="list-disc list-outside ml-5 text-sm text-black mb-3 space-y-1"
                {...props}
              />
            ),
            ol: (props) => (
              <ol
                className="list-decimal list-outside ml-5 text-sm text-black mb-3 space-y-1"
                {...props}
              />
            ),
            li: (props) => (
              <li className="text-sm text-black leading-relaxed" {...props} />
            ),
            code: (props) => (
              <code
                className="bg-grey-light px-1 py-0.5 rounded text-xs font-mono"
                {...props}
              />
            ),
            hr: () => <hr className="my-4 border-grey-light" />,
            table: (props) => (
              <table
                className="w-full text-sm border-collapse mb-4"
                {...props}
              />
            ),
            thead: (props) => <thead className="bg-grey-light" {...props} />,
            th: (props) => (
              <th
                className="border border-grey-medium px-2 py-1 text-left font-bold text-navy"
                {...props}
              />
            ),
            td: (props) => (
              <td
                className="border border-grey-medium px-2 py-1 align-top"
                {...props}
              />
            ),
            a: (props) => (
              <a
                className="text-blue underline hover:text-navy"
                {...props}
              />
            ),
          }}
        >
          {artefact.content}
        </ReactMarkdown>
      </div>
    </section>
  );
}
