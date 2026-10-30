const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState } from 'react';
import { Send } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';

const projectTypes = ['Film Production', 'Media Production', 'Photography', 'Videography', 'Brand Identity', 'Graphic Design', 'Web Design', 'Documentary', 'Post-Production', 'Other'];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', project_type: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in your name, email and a brief message.');
      return;
    }
    setStatus('submitting');
    setError('');
    try {
      await db.entities.Enquiry.create(form);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', project_type: '', message: '' });
    } catch (err) {
      setStatus('error');
      setError('Something went wrong. Please try again or reach us on Instagram.');
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Start a Project"
        title="Have something worth creating?"
        subtitle="Let's build something meaningful. Share a few details and we'll be in touch."
      />
      <section className="pb-24 md:pb-32 bg-ecs-white">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
            {/* Form */}
            <div className="md:col-span-7">
              {status === 'success' ? (
                <Reveal>
                  <div className="border border-ecs-gold/40 bg-ecs-cream/50 p-10 md:p-14">
                    <p className="label-eyebrow mb-4">Thank you</p>
                    <h2 className="font-display text-3xl md:text-4xl font-light leading-tight">
                      Your enquiry has been received.
                    </h2>
                    <p className="mt-4 text-ecs-black/60 font-light">
                      We'll review your message and reach out shortly.
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="mt-8 text-sm uppercase tracking-[0.22em] link-underline"
                    >
                      Send another enquiry
                    </button>
                  </div>
                </Reveal>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Field label="Name" name="name" value={form.name} onChange={handleChange} required />
                    <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Field label="Phone (optional)" name="phone" value={form.phone} onChange={handleChange} />
                    <div>
                      <label className="label-eyebrow-muted block mb-3">Project Type</label>
                      <select
                        name="project_type"
                        value={form.project_type}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-ecs-black/25 py-2 text-sm focus:outline-none focus:border-ecs-gold transition-colors"
                      >
                        <option value="">Select a type</option>
                        {projectTypes.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label-eyebrow-muted block mb-3">Tell us about your project</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      required
                      className="w-full bg-transparent border-b border-ecs-black/25 py-2 text-base font-light resize-none focus:outline-none focus:border-ecs-gold transition-colors"
                    />
                  </div>

                  {error && <p className="text-sm text-red-700">{error}</p>}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="inline-flex items-center gap-3 px-10 py-4 bg-ecs-black text-ecs-white text-sm uppercase tracking-[0.22em] font-medium hover:bg-ecs-gold hover:text-ecs-black transition-all duration-500 disabled:opacity-50"
                  >
                    {status === 'submitting' ? 'Sending…' : 'Start a Project'}
                    <Send size={15} />
                  </button>
                </form>
              )}
            </div>

            {/* Side info */}
            <div className="md:col-span-5 md:pl-8 md:border-l md:border-ecs-black/15">
              <Reveal>
                <p className="label-eyebrow mb-6">Studio</p>
                <p className="font-display text-2xl md:text-3xl font-light leading-relaxed">
                  Eternal Creative Studio
                </p>
                <p className="mt-2 text-sm text-ecs-black/55">Thiruvananthapuram, Kerala</p>

                <div className="mt-10 space-y-6">
                  <div>
                    <p className="label-eyebrow-muted mb-2">Instagram</p>
                    <a
                      href="https://instagram.com/eternal.creativestudio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm link-underline"
                    >
                      @eternal.creativestudio
                    </a>
                  </div>
                  <div>
                    <p className="label-eyebrow-muted mb-2">Parent Company</p>
                    <p className="text-sm text-ecs-black/70">Eternal Groups</p>
                  </div>
                  <div>
                    <p className="label-eyebrow-muted mb-2">Established</p>
                    <p className="text-sm text-ecs-black/70">2023</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, name, value, onChange, type = 'text', required }) {
  return (
    <div>
      <label className="label-eyebrow-muted block mb-3">
        {label}{required && <span className="text-ecs-gold"> *</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-transparent border-b border-ecs-black/25 py-2 text-base font-light focus:outline-none focus:border-ecs-gold transition-colors"
      />
    </div>
  );
}