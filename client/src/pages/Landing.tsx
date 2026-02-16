import { Link } from 'react-router-dom';

const exampleMoments = [
  { text: 'Coffee, no small talk.', author: 'Ana', city: 'Skopje' },
  { text: 'I want to laugh until it hurts.', author: 'Marko', city: 'Belgrade' },
  { text: "Drive somewhere pretty. Don't tell me where.", author: 'Ivana', city: 'Zagreb' },
];

const faqs = [
  {
    q: 'Who is this for?',
    a: 'People dealing with serious illness who want to keep living, not just surviving. No diagnoses required at sign-up, but verification is encouraged.',
  },
  {
    q: 'Is this a dating app?',
    a: 'No. It is a place to find company for the things you want to do. Romance is not the point, but genuine human connection is.',
  },
  {
    q: 'Do I have to share my diagnosis?',
    a: 'Never. You share what you want, when you want. Your condition summary is optional and visible only to the people you choose.',
  },
  {
    q: 'What happens to my profile if I pass away?',
    a: 'You can set memorial preferences in advance. Your profile can become a tribute page, or be quietly removed. Your choice.',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-brand-dark text-brand-text">
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-3xl mb-4">
          Still Here
        </h1>
        <p className="text-lg md:text-xl text-brand-muted max-w-2xl mb-10 leading-relaxed">
          If you're here, you already know. This is a place to find people who won't flinch.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/join" className="btn-primary text-center">
            Join Still Here
          </Link>
          <Link to="/login" className="btn-ghost text-center">
            I'm already a member
          </Link>
        </div>
        <div className="mt-16 animate-bounce text-brand-muted text-sm">
          Scroll down
        </div>
      </section>

      {/* Explanation + example moments */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-amber mb-6 text-center">
          Post what you want to do. Someone will show up.
        </h2>
        <p className="text-brand-muted text-center max-w-2xl mx-auto mb-12 leading-relaxed">
          A moment request is simple: say what you want to do, and let someone nearby
          say "I'm in." No small talk required. No pity. Just people who get it.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {exampleMoments.map((m) => (
            <div key={m.author} className="card text-center">
              <p className="text-lg italic text-brand-text mb-4">"{m.text}"</p>
              <p className="text-brand-amber font-medium">
                {m.author}, <span className="text-brand-muted">{m.city}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom message */}
      <section className="px-6 py-16 text-center">
        <p className="text-brand-muted max-w-2xl mx-auto text-lg leading-relaxed">
          This is not a support group. It's not therapy. It's a place to do things
          with people who get it.
        </p>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-brand-amber mb-8 text-center">
          Questions you might have
        </h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="card">
              <h3 className="text-brand-text font-semibold mb-2">{faq.q}</h3>
              <p className="text-brand-muted leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 text-center text-brand-muted text-sm border-t border-brand-mid/30">
        <p>Still Here &mdash; Because you are.</p>
      </footer>
    </div>
  );
}
