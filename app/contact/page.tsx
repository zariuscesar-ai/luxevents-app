'use client'

import { useState } from 'react'
import { Mail, MessageSquare, Clock } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) { setStatus('sent'); setFormData({ name: '', email: '', subject: '', message: '' }) }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gray-900 py-16 pt-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-medium tracking-widest uppercase">Get In Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Contact Us</h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            Have a question, issue, or feedback? We&apos;re here to help. We&apos;ll get back to you within 1–2 business days.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">

            <div className="md:col-span-1 space-y-8">
              <div>
                <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-gray-900" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">General Support</p>
                      <a href="mailto:support@luxevents.app" className="text-sm text-yellow-600 hover:underline">support@luxevents.app</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-gray-900" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Legal &amp; Privacy</p>
                      <a href="mailto:legal@luxevents.app" className="text-sm text-yellow-600 hover:underline">legal@luxevents.app</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-gray-900" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Response Time</p>
                      <p className="text-sm text-gray-600">1–2 business days</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="mailto:support@luxevents.app" className="text-yellow-600 hover:underline">Report a Provider issue</a></li>
                  <li><a href="mailto:support@luxevents.app" className="text-yellow-600 hover:underline">Refund request</a></li>
                  <li><a href="mailto:legal@luxevents.app" className="text-yellow-600 hover:underline">Privacy data request</a></li>
                  <li><a href="mailto:support@luxevents.app" className="text-yellow-600 hover:underline">Provider account help</a></li>
                </ul>
              </div>
            </div>

            <div className="md:col-span-2">
              {status === 'sent' ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">Thanks for reaching out. We&apos;ll get back to you within 1–2 business days.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                      <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Your name" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                      <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="you@email.com" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                    <select id="subject" name="subject" required value={formData.subject} onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400">
                      <option value="">Select a topic...</option>
                      <option value="booking">Booking Issue</option>
                      <option value="refund">Refund Request</option>
                      <option value="provider">Provider Complaint</option>
                      <option value="account">Account Help</option>
                      <option value="privacy">Privacy / Data Request</option>
                      <option value="partnership">Partnership Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                    <textarea id="message" name="message" required rows={6} value={formData.message} onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                      placeholder="Tell us how we can help..." />
                  </div>
                  {status === 'error' && (
                    <p className="text-red-600 text-sm">Something went wrong. Please email support@luxevents.app directly.</p>
                  )}
                  <button type="submit" disabled={status === 'sending'}
                    className="w-full bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors">
                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
