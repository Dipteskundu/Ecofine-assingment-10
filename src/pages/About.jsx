import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { Leaf, Users, Heart, CheckCircle, Globe2, Shield } from 'lucide-react'

export default function About() {
  useEffect(() => {
    document.title = 'About | EcoFine'
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Together for a Cleaner, Greener Future
              </h1>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
                EcoFine is a community-driven platform that empowers citizens to report environmental and infrastructure issues, collaborate on solutions, and track progress transparently.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/register" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium">
                  Join the Community
                </Link>
                <Link to="/all-issues" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 px-6 py-3 rounded-lg font-medium">
                  Browse Issues
                </Link>
              </div>
            </Motion.div>
            <Motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative">
              <div className="rounded-2xl p-8 bg-gradient-to-br from-green-600 to-emerald-500 text-white shadow-xl">
                <div className="flex items-center gap-3">
                  <Leaf className="w-8 h-8" />
                  <span className="text-2xl font-semibold">EcoFine</span>
                </div>
                <p className="mt-4 text-green-50">
                  Report, contribute, and celebrate the positive change happening around you.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold">1k+</p>
                    <p className="text-green-100">Issues Resolved</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">8k+</p>
                    <p className="text-green-100">Community Members</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">120+</p>
                    <p className="text-green-100">Cities Impacted</p>
                  </div>
                </div>
              </div>
            </Motion.div>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Community First</h3>
              </div>
              <p className="mt-3 text-gray-600 dark:text-gray-300">Built for citizens, volunteers, and local organizations to collaborate easily.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Transparent Progress</h3>
              </div>
              <p className="mt-3 text-gray-600 dark:text-gray-300">Track issues from report to resolution with clear milestones.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Impact Driven</h3>
              </div>
              <p className="mt-3 text-gray-600 dark:text-gray-300">Celebrate contributions and share success stories across communities.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow">
              <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Globe2 className="w-6 h-6 text-green-600" />
                <span className="font-semibold">Our Mission</span>
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Make urban spaces cleaner, safer, and more sustainable by enabling seamless reporting, collective action, and measurable outcomes.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Focus Areas</p>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">Waste, Roads, Water, Trees, Infrastructure</p>
                </div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Collaboration</p>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">Citizens, NGOs, Local Authorities</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow">
              <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Shield className="w-6 h-6 text-green-600" />
                <span className="font-semibold">Our Values</span>
              </div>
              <ul className="mt-4 space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600" /> Integrity and transparency</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600" /> Empathy for communities</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600" /> Collaboration over competition</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600" /> Sustainability at the core</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 p-8 md:p-12 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold">Be part of the change</h2>
                <p className="mt-4 text-green-50">Create an account to report issues, contribute resources, and inspire your city.</p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link to="/register" className="bg-white text-green-700 hover:bg-green-50 px-6 py-3 rounded-lg font-medium">Get Started</Link>
                  <Link to="/all-issues" className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-medium">See Live Issues</Link>
                </div>
              </div>
              <div className="flex items-center gap-6 justify-center">
                <div className="text-center">
                  <p className="text-4xl font-bold">92%</p>
                  <p className="text-green-100">Satisfaction</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold">24/7</p>
                  <p className="text-green-100">Availability</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold">Zero</p>
                  <p className="text-green-100">Cost to Join</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}