"use client";

export default function PartnershipPage() {
  return (
    <main className="min-h-screen bg-hp-light flex items-center justify-center px-5">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 rounded-2xl bg-hp-navy flex items-center justify-center mx-auto mb-6"><span className="text-white text-2xl font-bold">HP</span></div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-hp-navy mb-3">Coming soon</h1>
        <p className="text-hp-gray mb-8 text-sm leading-relaxed">We&apos;re preparing the partnership program for hospitals and clinics. Leave your email and we&apos;ll notify you.</p>
        <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 max-w-sm mx-auto">
          <input type="email" placeholder="hospital@email.com" className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-hp-green" />
          <button type="submit" className="bg-hp-green text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-hp-green-dark">Notify me</button>
        </form>
        <a href="/" className="inline-block mt-8 text-sm text-hp-gray hover:text-hp-navy">← Back</a>
      </div>
    </main>
  );
}
