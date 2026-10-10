"use client";

import { useState, useSyncExternalStore } from "react";
import { useLang } from "@/i18n";

function subscribeUrl() {
  return () => {};
}
function getUrl() {
  return typeof window === "undefined" ? "" : window.location.origin;
}

function useShare(text: string) {
  const url = useSyncExternalStore(subscribeUrl, getUrl, () => "");
  const [copied, setCopied] = useState(false);
  const { t } = useLang();
  const xHref = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}${url ? `&url=${encodeURIComponent(url)}` : ""}`;
  const liHref = url ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` : "";
  async function copyCite(cite: string) {
    try {
      await navigator.clipboard.writeText(cite);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }
  return { xHref, liHref, copyCite, copied, citeLabel: t.showcase.cite, copiedLabel: t.showcase.copied };
}

function Card({ n, q, a, cite, share }: { n: number; q: string; a: string; cite: string; share: string }) {
  const { xHref, liHref, copyCite, copied, citeLabel, copiedLabel } = useShare(share);
  const { t } = useLang();
  return (
    <div className="rounded-[28px] border border-line bg-paper-warm p-6 md:p-10">
      <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-canada">Q{n}</p>
      <h3 className="display mt-3 max-w-[800px] text-[28px] leading-tight md:text-[36px]">{q}</h3>
      <p className="mt-5 max-w-[760px] text-[15px] leading-relaxed text-ink/70 md:text-[16px]">{a}</p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          onClick={() => copyCite(cite)}
          className="rounded-full border border-line bg-paper px-5 py-2.5 text-[14px] font-semibold hover:border-ink"
        >
          {copied ? copiedLabel : citeLabel}
        </button>
        <a
          href={xHref}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-line px-5 py-2.5 text-[14px] font-semibold hover:border-ink"
        >
          {t.showcase.shareX}
        </a>
        {liHref && (
          <a
            href={liHref}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-line px-5 py-2.5 text-[14px] font-semibold hover:border-ink"
          >
            {t.showcase.shareLinkedIn}
          </a>
        )}
      </div>
    </div>
  );
}

export default function Showcase() {
  const { t } = useLang();
  const sc = t.showcase;
  return (
    <section id="showcase" className="bg-paper">
      <div className="mx-auto max-w-[1392px] px-6 py-20 md:py-28">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-canada">{sc.kicker}</p>
        <h2 className="display mt-4 max-w-[720px] text-[40px] md:text-[52px]">{sc.title}</h2>
        <p className="mt-5 max-w-[720px] text-[18px] leading-relaxed text-ink/70">{sc.body}</p>
        <div className="mt-10 space-y-8">
          {sc.cards.map((c, i) => (
            <Card key={i} n={i + 1} q={c.q} a={c.a} cite={c.cite} share={c.share} />
          ))}
        </div>
      </div>
    </section>
  );
}
