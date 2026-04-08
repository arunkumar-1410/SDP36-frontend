import { BookOpen, User, Calendar } from 'lucide-react';

const categoryBadges = {
  'mental-health': { bg: 'bg-purple-100', text: 'text-purple-700' },
  'fitness': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  'nutrition': { bg: 'bg-amber-100', text: 'text-amber-700' },
};

export const ResourceCard = ({ resource, onClick }) => {
  const badge = categoryBadges[resource.category] || { bg: 'bg-blue-100', text: 'text-blue-700' };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden group"
    >
      <div className="w-full h-40 bg-gradient-to-br from-sky-50 via-blue-50 to-violet-50 flex items-center justify-center">
        <BookOpen size={36} className="text-sky-300 group-hover:scale-110 transition-transform duration-200" />
      </div>

      <div className="p-5">
        <div className="mb-3">
          <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${badge.bg} ${badge.text}`}>
            {resource.category.replace('-', ' ').toUpperCase()}
          </span>
        </div>

        <h3 className="text-base font-bold text-gray-900 mb-1.5 leading-snug">{resource.title}</h3>
        <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-2">{resource.description}</p>

        <div className="flex items-center gap-4 text-xs text-gray-400 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <User size={13} />
            <span>{resource.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={13} />
            <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
