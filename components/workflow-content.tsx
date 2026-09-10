import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export function WorkflowPanel({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
      <h2 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h2>
      {description ? <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function DetailRows({ items }: { items: { label: string; value: ReactNode }[] }) {
  return <dl className="divide-y divide-slate-100">{items.map(item => (
    <div key={item.label} className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[144px_minmax(0,1fr)] sm:gap-5">
      <dt className="text-sm font-medium text-slate-500">{item.label}</dt>
      <dd className="min-w-0 break-words text-sm leading-6 text-slate-800">{item.value}</dd>
    </div>
  ))}</dl>;
}

export function NextStep({ title, description, href, label }: { title: string; description: string; href: string; label: string }) {
  return (
    <section aria-label="下一步" className="flex flex-col gap-4 rounded-2xl border border-teal-200/70 bg-teal-50/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div><h2 className="font-semibold text-slate-950">{title}</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">{description}</p></div>
      <Link href={href} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700">{label}<ArrowRight className="size-4" aria-hidden="true" /></Link>
    </section>
  );
}
