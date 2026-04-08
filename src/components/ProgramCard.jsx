import { Users, Clock, MapPin } from 'lucide-react';

export const ProgramCard = ({ program, onEnroll, isEnrolled }) => {
  const spotsLeft = program.maxParticipants - program.participants;
  const isFull = spotsLeft <= 0;
  const fillPercent = Math.round((program.participants / program.maxParticipants) * 100);

  return (
    <div className="bg-white rounded-xl border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group">
      <div className="w-full h-36 bg-gradient-to-br from-sky-50 via-blue-50 to-violet-50 flex items-center justify-center">
        <Users size={36} className="text-sky-300 group-hover:scale-110 transition-transform duration-200" />
      </div>

      <div className="p-5">
        <h3 className="text-base font-bold text-gray-900 mb-1.5 leading-snug">{program.title}</h3>
        <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-2">{program.description}</p>

        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={15} className="text-gray-400 flex-shrink-0" />
            <span>{program.schedule}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin size={15} className="text-gray-400 flex-shrink-0" />
            <span>Duration: {program.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users size={15} className="text-gray-400 flex-shrink-0" />
            <span>{program.participants}/{program.maxParticipants} participants</span>
          </div>
        </div>

        <div className="bg-gray-100 rounded-full h-2 mb-3 overflow-hidden">
          <div
            className="bg-primary-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${fillPercent}%` }}
          />
        </div>

        <p className="text-xs text-gray-400 mb-4">
          Instructor: <span className="font-semibold text-gray-600">{program.instructor}</span>
        </p>

        {onEnroll && (
          <button
            onClick={onEnroll}
            disabled={isFull || isEnrolled}
            className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors duration-200 ${
              isEnrolled
                ? 'bg-emerald-500 text-white cursor-default'
                : isFull
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary-500 text-white hover:bg-primary-600'
            }`}
          >
            {isEnrolled ? 'Enrolled ✓' : isFull ? 'Program Full' : 'Enroll Now'}
          </button>
        )}
      </div>
    </div>
  );
};
