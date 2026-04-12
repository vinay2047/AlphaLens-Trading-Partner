import { Metadata } from 'next';
import {
  HelpCircle,
  MessageCircle,
  BookOpen,
  Lightbulb,
  Mail,
  Github,
  ChevronDown
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Help Center | AlphaLens',
  description: 'Support and documentation for AlphaLens features.',
};

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I add stocks to my watchlist?",
      answer: "Use the search bar at the top or in the header to find any symbol. On the stock's detail page, click the 'Heart' or 'Star' icon to instantly add it to your dashboard."
    },
    {
      question: "Where does the market data come from?",
      answer: "AlphaLens integrates with premium market data providers to offer real-time insights. While highly accurate, we recommend using the data for analysis and decision support."
    },
    {
      question: "How do I track my portfolio holdings?",
      answer: "Navigate to the Portfolio section and use the 'Add Trade' button. You can record your buy and sell transactions, and AlphaLens will automatically calculate your P&L and performance metrics."
    },
    {
      question: "Can I set price alerts?",
      answer: "Yes, you can configure alerts for specific price targets or percentage moves. Notifications will be sent to help you stay informed even when you're away from the platform."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">

      {/* Header */}
      <div className="text-center pt-16 pb-12 space-y-4">
        <div className="inline-flex p-3 bg-[#10E55A]/10 rounded-2xl border border-[#10E55A]/20 mb-4">
          <HelpCircle className="text-[#10E55A] h-8 w-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white">Help Center</h1>
        <p className="text-xl text-gray-400">Everything you need to know about using AlphaLens.</p>
      </div>

      {/* Quick Action Grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-16">
        <HelpCard
          icon={<BookOpen className="text-teal-400" />}
          title="Getting Started"
          desc="Learn how to set up your portfolio and start tracking your first assets."
          link="/dashboard"
          linkText="Go to Dashboard"
        />
        <HelpCard
          icon={<Lightbulb className="text-yellow-400" />}
          title="Feature Guide"
          desc="Explore advanced tools like the DCA Manager and technical indicators."
          link="/portfolio"
          linkText="View Features"
        />
      </div>

      {/* FAQs */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-white border-b border-gray-800 pb-4">Frequently Asked Questions</h2>
        <div className="grid gap-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:bg-gray-800/50 transition-colors">
              <h3 className="font-semibold text-lg text-gray-200 mb-2 flex items-start gap-3">
                <Lightbulb size={20} className="text-[#10E55A]/50 mt-1 shrink-0" />
                {faq.question}
              </h3>
              <p className="text-gray-400 leading-relaxed ml-8 pl-1 border-l-2 border-gray-800">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Support Section */}
      <div className="mt-20 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Need more assistance?</h3>
        <p className="text-gray-400 mb-6">Our support team is here to help you get the most out of AlphaLens.</p>
        <button
          className="inline-flex items-center gap-2 bg-[#10E55A] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#0dbd4a] transition-colors"
        >
          <Mail size={18} />
          Contact Support
        </button>
      </div>

    </div>
  );
}

function HelpCard({ icon, title, desc, link, linkText }: any) {
  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex flex-col items-start hover:border-gray-700 transition-colors">
      <div className="mb-4 bg-gray-800 p-2 rounded-lg">{icon}</div>
      <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-400 mb-6 flex-grow">{desc}</p>
      <a href={link} className="text-teal-400 text-sm font-medium hover:underline flex items-center gap-1">
        {linkText} <ChevronDown size={14} className="-rotate-90" />
      </a>
    </div>
  );
}
