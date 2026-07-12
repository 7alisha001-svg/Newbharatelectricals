import { ShieldCheck, Truck, HeadphonesIcon, RefreshCcw } from 'lucide-react';

const reasons = [
  {
    icon: <Truck size={36} strokeWidth={1.5} />,
    title: 'Fast Delivery',
    desc: 'Across India logistics network'
  },
  {
    icon: <ShieldCheck size={36} strokeWidth={1.5} />,
    title: 'Secure Payment',
    desc: '100% secure payment gateways'
  },
  {
    icon: <RefreshCcw size={36} strokeWidth={1.5} />,
    title: 'Easy Returns',
    desc: 'Hassle-free 7 days return'
  },
  {
    icon: <HeadphonesIcon size={36} strokeWidth={1.5} />,
    title: 'Customer Support',
    desc: 'Dedicated 24/7 assistance'
  }
];

export default function WhyUs() {
  return (
    <section className="py-8 md:py-10 bg-white border-t border-gray-100">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-6">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="flex flex-col xl:flex-row items-center xl:items-start text-center xl:text-left gap-2 sm:gap-4 bg-[#f8f9fa] p-3 sm:p-6 rounded-xl border border-gray-100/50 hover:shadow-sm hover:border-gray-200 transition-all justify-center"
            >
              <div className="text-brand-green">
                {reason.icon}
              </div>
              <div className="flex flex-col">
                <h3 className="font-heading font-bold text-gray-900 text-xs sm:text-sm lg:text-base uppercase tracking-wide mb-1 flex items-center justify-center xl:justify-start leading-tight">
                  {reason.title}
                </h3>
                <p className="text-gray-700 text-xs md:text-xs xl:text-sm font-medium tracking-wide">
                  {reason.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
