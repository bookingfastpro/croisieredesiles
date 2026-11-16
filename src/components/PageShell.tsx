import React from 'react';

/** Simple text page layout (legal pages, 404…). */
export default function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pt-32 pb-24 px-6 bg-white min-h-[70vh]">
      <article className="max-w-3xl mx-auto text-marine-navy/85 leading-relaxed [&_h2]:text-xl [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-marine-navy [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:mb-3 [&_a]:text-marine-blue [&_a]:underline [&_a]:underline-offset-2">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-marine-navy mb-8">{title}</h1>
        {children}
      </article>
    </div>
  );
}
