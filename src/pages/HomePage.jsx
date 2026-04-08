import { Link } from 'react-router-dom';
import { Heart, Brain, Zap, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const HomePage = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const features = [
    {
      icon: Brain,
      title: 'Mental Health',
      description: 'Talk to someone, try guided meditation, or learn how to handle stress better.',
      color: 'text-purple-600',
      bg: 'bg-purple-100/50',
    },
    {
      icon: Zap,
      title: 'Stay Active',
      description: 'Group classes, solo workouts, or just a run around campus — find what works for you.',
      color: 'text-amber-600',
      bg: 'bg-amber-100/50',
    },
    {
      icon: Heart,
      title: 'Eat Well',
      description: 'Practical nutrition tips that actually work on a student budget.',
      color: 'text-rose-600',
      bg: 'bg-rose-100/50',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'You\'re not in this alone. Join peer groups and meet people who get it.',
      color: 'text-blue-600',
      bg: 'bg-blue-100/50',
    },
  ];

  const benefits = [
    'Everything is free for students',
    'Programs run by actual professionals',
    'Mental health support available 24/7',
    'Track how you\'re doing over time',
    'Find your people in wellness groups',
    'Your data stays private, always',
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 sm:pt-32 sm:pb-32 bg-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-60 animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-purple-50 rounded-full blur-3xl opacity-60"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-sm font-semibold mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Empowering Student Wellness
              </div>
              <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                Your Health. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Our Priority.</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                The all-in-one wellness platform built for students. Access mental health resources, specialized fitness programs, and nutrition advice in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/resources" className="btn-primary flex items-center gap-2 shadow-lg shadow-blue-200">
                  Explores Resources <ArrowRight size={20} />
                </Link>
                <Link to="/programs" className="px-8 py-3 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">
                  View Programs
                </Link>
              </div>
              <div className="mt-12 flex items-center gap-6 text-slate-400 text-sm">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <img key={i} className="w-10 h-10 rounded-full border-4 border-white" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                  ))}
                </div>
                <p><span className="text-slate-900 font-bold">1k+</span> students already joined</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 p-4 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-white/50 shadow-2xl overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800" 
                  className="rounded-[2rem] w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" 
                  alt="wellness" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full blur-2xl opacity-40"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full blur-2xl opacity-40"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Comprehensive Wellness Support</h2>
            <p className="text-slate-600 text-lg">Everything you need to thrive academically and personally, conveniently organized in one modern dashboard.</p>
          </div>
          
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={item}
                className="card-modern p-8"
              >
                <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className={feature.color} size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="card-modern bg-slate-100/50 p-2 sm:p-10">
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-4">
                     <div className="h-40 bg-white rounded-3xl p-6 flex flex-col justify-between shadow-sm border border-slate-100">
                        <Users className="text-blue-500" size={32} />
                        <span className="text-2xl font-bold">500+</span>
                     </div>
                     <div className="h-56 bg-indigo-600 rounded-3xl p-6 flex flex-col justify-between text-white shadow-xl shadow-indigo-100">
                        <Brain size={32} />
                        <div>
                          <p className="text-sm opacity-80">Guided Sessions</p>
                          <span className="text-2xl font-bold">120+</span>
                        </div>
                     </div>
                   </div>
                   <div className="space-y-4 translate-y-8">
                     <div className="h-56 bg-white rounded-3xl p-6 flex flex-col justify-between shadow-sm border border-slate-100">
                        <Heart className="text-rose-500" size={32} />
                        <div>
                          <p className="text-sm text-slate-500">Active Members</p>
                          <span className="text-2xl font-bold">2.4k</span>
                        </div>
                     </div>
                     <div className="h-40 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                        <CheckCircle className="text-green-500 mb-4" size={32} />
                        <span className="text-lg font-bold">Verified Coach</span>
                     </div>
                   </div>
                 </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-bold text-slate-900 mb-8">Why Students Love Us</h2>
              <div className="grid gap-6">
                {benefits.map((benefit, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-500 transition-colors">
                      <CheckCircle className="text-green-600 group-hover:text-white transition-colors" size={16} />
                    </div>
                    <span className="text-lg text-slate-700 font-medium group-hover:text-slate-900 transition-colors">{benefit}</span>
                  </motion.div>
                ))}
              </div>
              <button className="mt-12 btn-primary">Join the Community</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative bg-gradient-to-r from-blue-700 to-indigo-800 rounded-[3rem] px-8 py-16 text-center overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Zap size={200} />
            </div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-6">Start Your Wellness Journey Today</h2>
              <p className="text-blue-100 text-lg mb-10 leading-relaxed">
                Take the first step toward a healthier and more balanced life. Register now and join 
                hundreds of students already prioritized their mental and physical health.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/signup" className="px-10 py-4 bg-white text-blue-700 font-bold rounded-2xl hover:scale-105 transition-transform active:scale-95">
                  Get Started Free
                </Link>
                <Link to="/support" className="px-10 py-4 bg-blue-600/30 text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/10 transition-colors">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-16 bg-white border-t border-slate-100 pt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <span className="text-white font-bold text-lg">HW</span>
                 </div>
                 <span className="text-xl font-bold text-slate-900 tracking-tight">HealthWell</span>
              </div>
              <p className="text-slate-500 leading-relaxed">Helping students take better care of themselves, one day at a time.</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-[0.2em]">Platform</h4>
              <ul className="space-y-4">
                <li><Link to="/resources" className="text-slate-500 hover:text-blue-600 transition-colors">Resources</Link></li>
                <li><Link to="/programs" className="text-slate-500 hover:text-blue-600 transition-colors">Programs</Link></li>
                <li><Link to="/support" className="text-slate-500 hover:text-blue-600 transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-[0.2em]">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">About Us</a></li>
                <li><a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Privacy</a></li>
                <li><a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-[0.2em]">Contact</h4>
              <ul className="space-y-4 text-slate-500">
                <li className="flex items-center gap-2">Crisis: <span className="text-rose-500 font-bold">1-800-HELP</span></li>
                <li>Email: support@hw.edu</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-8 text-center text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} HealthWell Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
