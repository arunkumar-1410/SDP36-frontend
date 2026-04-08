
import { useHealth } from '@/context/HealthContext';
import { ServiceCard } from '@/components/ServiceCard';

export const SupportPage = () => {
  const { getServices } = useHealth();
  const services = getServices();

  const emergencyServices = [
    {
      title: 'Mental Health Crisis',
      contact: '1-800-HELP-NOW (1-800-435-7669)',
      icon: '🆘',
    },
    {
      title: 'Campus Emergency',
      contact: 'Campus Security: ext. 5555',
      icon: '📞',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-14">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Support</h1>
          <p className="text-gray-400">You don't have to figure things out alone. Help is here when you need it.</p>
        </div>

        {/* Emergency Banner */}
        <div className="mb-10 p-5 bg-red-50 border border-red-200 rounded-xl">
          <h2 className="text-xl font-bold text-red-700 mb-3">Need help right now?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {emergencyServices.map((service, index) => (
              <div key={index} className="bg-white p-4 rounded-xl border border-red-100 shadow-sm">
                <p className="font-semibold text-red-800">{service.title}</p>
                <p className="text-lg font-bold text-red-600 mt-2">{service.contact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">What's available</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Additional Resources */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-5">Here's what we can do</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Counseling</h3>
              <ul className="flex flex-col gap-2 text-gray-500 text-sm">
                <li>- One-on-one counseling sessions</li>
                <li>- Crisis support when you need it</li>
                <li>- Peer support groups</li>
                <li>- Referrals to specialists</li>
                <li>- Psychiatric services</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Wellness</h3>
              <ul className="flex flex-col gap-2 text-gray-500 text-sm">
                <li>- Mental health workshops</li>
                <li>- Stress management sessions</li>
                <li>- Nutrition consultations</li>
                <li>- Fitness programs</li>
                <li>- Personal wellness coaching</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Common questions</h2>
          <div className="flex flex-col gap-4">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-1.5">Is everything confidential?</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Yes. What you share stays between you and your counselor, unless there's a safety concern.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-1.5">Do I need insurance?</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Nope. All services are covered by your student fees — no insurance needed.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-1.5">How do I book an appointment?</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Call the office, drop by during hours, or book online. Crisis support is available anytime.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-1.5">Are the programs free?</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Yes, totally free for enrolled students. Some may need sign-up to manage capacity.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
