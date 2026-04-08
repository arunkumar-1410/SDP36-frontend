import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Search, Download, Book } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BookCover = ({ title, url, category }) => {
    return (
        <img 
            src={url || 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f'} 
            onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f";
            }}
            alt={title}
            className="w-full h-full object-cover"
        />
    );
};

export const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      console.log('Fetching resources from: http://localhost:9090/api/resources');
      const res = await apiClient.get('/api/resources');
      
      // FIX D: Explicit mapping for camelCase/snake_case compatibility
      const mappedResources = (Array.isArray(res.data) ? res.data : []).map(item => ({
        ...item,
        pdfUrl: item.pdfUrl || item.pdf_url,
        coverImageUrl: item.coverImageUrl || item.cover_image_url,
        createdAt: item.createdAt || item.created_at
      }));

      console.log('Mapped Resources:', mappedResources);
      setResources(mappedResources);
    } catch (err) {
      console.error('Failed to load resources:', err);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Health Economics', 'Nutrition', 'Psychology', 'Fitness', 'Sleep', 'Wellness'];

  const filteredResources = resources.filter((r) => {
    const matchesSearch = ((r.title || '') + (r.author || '')).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleReadNow = (res) => {
    // Open PDF
    const pdfUrl = res.pdfUrl || res.pdf_url;
    window.open(pdfUrl, '_blank');
    
    // Track the read (silent — never blocks the PDF open)
    const token = localStorage.getItem('token');
    if (token && res.id) {
        fetch(`http://localhost:9090/api/resources/${res.id}/read`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(() => console.log('✅ Read tracked for:', res.title))
        .catch((err) => console.warn('❌ Tracking failed:', err));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Research Library</h1>
            <p className="text-slate-500 font-medium">Academic books and healthwell study materials</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide w-full md:w-auto">
               {categories.map((cat) => (
                 <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
                        selectedCategory === cat 
                        ? 'bg-slate-900 text-white shadow-lg' 
                        : 'bg-white text-slate-400 border border-slate-100'
                    }`}
                 >
                    {cat}
                 </button>
               ))}
            </div>

            <div className="relative group w-full max-w-sm">
               <input
                  type="text"
                  placeholder="Search and discover..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-6 pr-4 py-3 rounded-full border border-slate-100 bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none font-bold text-xs"
               />
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center">
            {loading ? [1,2,3,4].map(n => <div key={n} className="w-[220px] h-[320px] bg-slate-100 rounded-xl animate-pulse" />) : 
            filteredResources.map(res => (
                <motion.div
                    key={res.id}
                    whileHover={{ scale: 1.02 }}
                    className="w-[220px] bg-white rounded-[10px] border border-slate-100 shadow-sm overflow-hidden flex flex-col"
                >
                    <div className="h-[160px] relative">
                        <BookCover title={res.title} url={res.coverImageUrl} category={res.category} />
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-0.5 bg-blue-600/90 text-[8px] text-white font-black uppercase rounded-full">
                             {res.category}
                          </span>
                        </div>
                    </div>
                    <div className="p-[10px] flex-1 flex flex-col">
                        <h3 className="text-[13px] font-bold text-slate-900 line-clamp-2 leading-tight mb-1">{res.title}</h3>
                        <p className="text-[11px] text-slate-400 mb-2 truncate">By {res.author}</p>
                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 overflow-hidden mb-4 italic">
                            {res.description}
                        </p>
                        <button 
                            onClick={() => handleReadNow(res)}
                            className="w-full py-2 bg-slate-900 text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2 mt-auto"
                        >
                            <Download size={14} /> Read Now
                        </button>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};
