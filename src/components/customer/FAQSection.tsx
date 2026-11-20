import React, { useState } from 'react';
import { HelpCircle, ChevronDown, PhoneCall, MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import { BASE_GARAGE } from '../../data/seedData';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: "EV Towing",
    question: "Why does EV towing in Hyderabad require a 0-degree hydraulic flatbed?",
    answer: "Electric vehicles (such as Tata Nexon EV, MG ZS EV, Hyundai Ioniq 5, BYD Atto 3, and Mahindra XUV400) cannot be towed with rolling wheels. Dragging an EV spins the permanent-magnet electric motor, generating high back-EMF voltage that can permanently destroy the high-voltage battery inverter and void manufacturer warranties. Our certified 0-degree hydraulic flatbed lowers completely flush to the asphalt, pulling your EV onto the deck so both front and rear axles remain 100% stationary throughout transit."
  },
  {
    category: "Arrival Time",
    question: "How fast can your towing service arrive across Hyderabad?",
    answer: "Our rapid dispatch flatbed fleet is stationed strategically across key Hyderabad hubs including Gachibowli (TNGOs Colony), Hitec City, Madhapur, Financial District, and the Outer Ring Road (ORR) junctions. Our average on-scene arrival time is 15 to 20 minutes across Cyberabad, West Hyderabad, and the Airport expressway corridor."
  },
  {
    category: "Coverage",
    question: "Which areas in Hyderabad do your 24/7 towing services cover?",
    answer: "We provide 24/7 emergency car and EV towing across all major areas of Hyderabad: Gachibowli, Hitec City, Madhapur, Kondapur, Jubilee Hills, Banjara Hills, Kokapet, Financial District, Miyapur, Kukatpally, Secunderabad, Shamshabad Rajiv Gandhi International Airport, and the entire 158 km Outer Ring Road (ORR) expressway."
  },
  {
    category: "Luxury & Low Ground Clearance",
    question: "Is your flatbed towing safe for low-clearance luxury cars & sports sedans?",
    answer: "Yes! Standard flatbeds with steep ramps frequently scrape front bumpers, splitters, and low exhaust pipes on luxury vehicles (BMW, Mercedes-Benz, Audi, Porsche, Jaguar). Our hydraulic platform slides down to a true zero-degree angle at ground level, and we secure wheels using soft rim webbing straps so steel chains never touch your alloy wheels, suspension, or paint."
  },
  {
    category: "Accidents & Total Loss",
    question: "Can you recover severely damaged, wheel-locked, or accident-impacted cars?",
    answer: "Yes. For severe highway collisions, wheel-sheared vehicles, or total loss wrecks, our heavy-duty Tata recovery units are equipped with high-tonnage hydraulic winches, synthetic snatch blocks, and 4-wheel Go-Jack dollies to safely extract vehicles without secondary structural damage, delivering directly to authorized insurance body shops."
  },
  {
    category: "Pricing & Booking",
    question: "How do I request emergency EV or car towing in Hyderabad?",
    answer: "You can call our 24/7 direct helpline at +91 99121 24247, click our instant WhatsApp button to send your live GPS location, or book online using the quick request form on this page. We provide upfront, transparent pricing before dispatch with zero hidden fees."
  }
];

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            24/7 EV &amp; Car Towing Services in Hyderabad
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Everything you need to know about our certified zero-degree flatbed recovery, response times, safety protocols, and 24/7 roadside assistance across Hyderabad.
          </p>
        </div>

        {/* Accordion FAQ Items */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 bg-white hover:border-slate-300 shadow-xs"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
                      {faq.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {faq.question}
                    </h3>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'bg-sky-600 text-white rotate-180' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Contact Helpline Card */}
        <div className="mt-10 p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Need Immediate Towing Assistance in Hyderabad?</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Our 0-degree hydraulic flatbed is on standby 24/7 across Gachibowli, ORR &amp; Hitec City.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href={`tel:${BASE_GARAGE.phone.replace(/\s+/g, '')}`}
              className="bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call: {BASE_GARAGE.phone}</span>
            </a>
            <a
              href={`https://wa.me/${BASE_GARAGE.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20Dispatch%2C%20I%20need%20emergency%20towing%20service%20in%20Hyderabad`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
