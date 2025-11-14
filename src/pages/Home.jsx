import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Trash2, Building2, Wrench, Route, Users, CheckCircle, Clock, Heart } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function Home() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Banner slides data
  const bannerSlides = [
    {
      title: "Fighting Garbage Issues",
      description: "Join us in cleaning our communities and making our cities cleaner",
      image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=1200&h=600&fit=crop",
      bgColor: "from-red-600/80 to-orange-600/80"
    },
    {
      title: "Community Cleaning Drive",
      description: "Together we can make a difference. Volunteer for community cleaning initiatives",
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=600&fit=crop",
      bgColor: "from-green-600/80 to-emerald-600/80"
    },
    {
      title: "Sustainability Action",
      description: "Take action for a sustainable future. Report issues and be part of the solution",
      image: "https://images.unsplash.com/photo-1470071456044-3b5ecd3fae0b?w=1200&h=600&fit=crop",
      bgColor: "from-blue-600/80 to-cyan-600/80"
    }
  ];

  // Category data
  const categories = [
    {
      name: "Garbage",
      icon: Trash2,
      color: "bg-red-500",
      description: "Report garbage and waste management issues"
    },
    {
      name: "Illegal Construction",
      icon: Building2,
      color: "bg-orange-500",
      description: "Report unauthorized construction activities"
    },
    {
      name: "Broken Public Property",
      icon: Wrench,
      color: "bg-yellow-500",
      description: "Report damaged public infrastructure"
    },
    {
      name: "Road Damage",
      icon: Route,
      color: "bg-blue-500",
      description: "Report road and pavement issues"
    }
  ];

  useEffect(() => {
    document.title = 'Home | EcoFine - Community Cleanup Platform';
  }, []);

  useEffect(() => {
    const fetchLatestIssues = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://server-bzhwshzg7-diptes-projects.vercel.app/issues');
        if (!res.ok) {
          throw new Error(`Failed to fetch issues: ${res.status}`);
        }
        const payload = await res.json();
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.result)
            ? payload.result
            : [];
        const sorted = list.sort((a, b) => new Date(b?.date || 0) - new Date(a?.date || 0));
        setIssues(sorted.slice(0, 6));
      } catch (err) {
        console.error('Error fetching issues:', err);
        toast.error('Failed to load issues from server.');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestIssues();
  }, []);

  // Auto-rotate banner slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerSlides.length]);

  const handleSeeDetails = (issue) => {
    const issueId = issue?._id || issue?.id;
    if (!issueId) {
      toast.error('Invalid issue id');
      return;
    }
    if (user) {
      navigate(`/issue-details/${issueId}`);
    } else {
      navigate('/login', {
        state: {
          from: {
            pathname: `/issue-details/${issueId}`
          }
        }
      });
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  // Map category names from issues.json to our categories
  const getCategoryColor = (category) => {
    const categoryMap = {
      'Garbage': 'bg-red-500',
      'Illegal Construction': 'bg-orange-500',
      'Broken Public Property': 'bg-yellow-500',
      'Road Damage': 'bg-blue-500',
      'Water Issues': 'bg-cyan-500',
      'Waste Management': 'bg-red-500',
      'Tree Plantation': 'bg-green-500',
      'Infrastructure': 'bg-yellow-500'
    };
    return categoryMap[category] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Banner Section */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <AnimatePresence mode="wait">
          {bannerSlides.map((slide, index) => (
            index === currentSlide && (
              <Motion.div
                key={index}
                className="absolute inset-0"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor}`} />
                  <div className="relative z-10 h-full flex items-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                      <Motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-white max-w-2xl"
                      >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                          {slide.title}
                        </h1>
                        <p className="text-xl md:text-2xl mb-8">
                          {slide.description}
                        </p>
                        <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors">
                          <span>Get Started</span>
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </Motion.div>
                    </div>
                  </div>
                </div>
              </Motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Category Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Report Issues by Category
            </h2>
            <p className="text-gray-600 text-lg">
              Select a category to report an issue in your area
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer group"
                >
                  <div className={`${category.color} w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600">
                    {category.description}
                  </p>
                </Motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Complaints Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Recent Complaints
            </h2>
            <p className="text-gray-600 text-lg">
              Latest issues reported by our community
            </p>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading issues...</p>
            </div>
          ) : issues.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No recent issues found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {issues.map((issue, index) => (
              <Motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={issue.image}
                    alt={issue.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                    }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`${getCategoryColor(issue.category)} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                      {issue.category}
                    </span>
                    <span className="text-gray-500 text-sm">{issue.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {issue.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {issue.description}
                  </p>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <span>📍 {issue.location}</span>
                  </div>
                  <button
                    onClick={() => handleSeeDetails(issue)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                  >
                    <span>See Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </Motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Community Stats Section */}
      <section className="py-16 bg-gradient-to-r from-green-500 to-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center text-white"
            >
              <Users className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-4xl font-bold mb-2">1,250+</h3>
              <p className="text-xl">Registered Users</p>
            </Motion.div>
            <Motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center text-white"
            >
              <CheckCircle className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-4xl font-bold mb-2">850+</h3>
              <p className="text-xl">Issues Resolved</p>
            </Motion.div>
            <Motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center text-white"
            >
              <Clock className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-4xl font-bold mb-2">120+</h3>
              <p className="text-xl">Pending Issues</p>
            </Motion.div>
          </div>
        </div>
      </section>

      {/* Volunteer CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Heart className="w-20 h-20 mx-auto mb-6 text-green-500" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join Clean Drive
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Be part of the solution! Volunteer for community cleaning drives and help make our cities cleaner and greener.
            </p>
            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-medium text-lg flex items-center space-x-2 mx-auto transition-colors">
              <span>Join as Volunteer</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </Motion.div>
        </div>
      </section>
    </div>
  );
}

