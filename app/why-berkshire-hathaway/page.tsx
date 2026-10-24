import Navbar from "@/components/layouts/Navbar";
import { createPageMetadata } from "@/lib/page-seo";
import Footer from "@/components/layouts/Footer";
import RealScoutListings from "@/components/realscout/RealScoutListings";
import Link from "next/link";
import { Shield, Users, Globe, Award, TrendingUp, CheckCircle, Phone } from "lucide-react";

export const metadata = createPageMetadata("/why-berkshire-hathaway");

// Organization Schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Berkshire Hathaway HomeServices",
  url: "https://www.bhhs.com",
  logo: "https://anthemhenderson.com/favicon-32x32.png",
  description:
    "Berkshire Hathaway HomeServices is a real estate brokerage network, part of Berkshire Hathaway Inc., one of the world's most respected and trusted companies.",
  parentOrganization: {
    "@type": "Corporation",
    name: "Berkshire Hathaway Inc.",
    founder: "Warren Buffett",
  },
};

export default function WhyBerkshireHathawayPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Top 1% Las Vegas REALTOR®
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              Why Work With Dr. Jan Duffy?
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              In real estate since 1983, Dr. Jan Duffy brings trust, ethical standards, and local
              knowledge to every Anthem and Henderson move.
            </p>
          </div>

          {/* Key Benefits */}
          <section className="mb-16 max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
              The Dr. Jan Duffy Advantage
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white border border-slate-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Unmatched Trust</h3>
                <p className="text-slate-600">
                  Integrity and reliability in every transaction, built over a career in real
                  estate since 1983.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Referral Network</h3>
                <p className="text-slate-600">
                  A nationwide network of trusted agents means seamless referrals for relocations
                  and connections to buyers from across the country.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6">
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">World-Class Marketing</h3>
                <p className="text-slate-600">
                  Professional photography, MLS syndication, and targeted digital advertising put
                  your property in front of qualified buyers.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6">
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Ethical Standards</h3>
                <p className="text-slate-600">
                  Dr. Jan follows strict ethical guidelines that go beyond industry requirements.
                  Your interests always come first.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Top 1% Las Vegas REALTOR®</h3>
                <p className="text-slate-600">
                  Ranked among the top 1% of Las Vegas REALTORS®, with $127M+ in closed
                  transactions.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Proven Results</h3>
                <p className="text-slate-600">
                  500+ transactions helping families achieve their real estate goals in Southern
                  Nevada.
                </p>
              </div>
            </div>
          </section>

          {/* Local Expert Section */}
          <section className="mb-16 max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                  Your Local Expert in Las Vegas
                </h2>
                <p className="text-lg text-slate-700 mb-6">
                  Dr. Jan Duffy serves Las Vegas, Henderson, Summerlin, and all of Southern
                  Nevada. In real estate since 1983 with $127M+ in closed transactions, she
                  brings hometown expertise to every move.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "In real estate since 1983",
                    "$127M+ in closed transactions",
                    "500+ satisfied clients",
                    "Specializing in luxury, investment, and relocation",
                    "Deep knowledge of every Las Vegas neighborhood",
                  ].map((item) => (
                    <li key={item} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/about"
                  className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center"
                >
                  Meet Dr. Jan Duffy →
                </Link>
              </div>
              <div className="bg-slate-100 rounded-lg p-8">
                <blockquote className="text-lg text-slate-700 italic mb-4">
                  "When clients ask why they should choose me, I tell them: you get a REALTOR®
                  who has been in real estate since 1983, world-class marketing, and someone who
                  puts your interests first."
                </blockquote>
                <cite className="text-slate-900 font-semibold">
                  — Dr. Jan Duffy, REALTOR®
                </cite>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-16 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "How long has Dr. Jan Duffy been in real estate?",
                  a: "Dr. Jan Duffy has been in real estate since 1983 and is a Top 1% Las Vegas REALTOR®, with 500+ transactions and $127M+ in closed volume.",
                },
                {
                  q: "Does working with Dr. Jan cost more?",
                  a: "No. Commission rates are negotiable and comparable to other full-service agents. The value you receive—marketing exposure and experienced representation—often helps homes sell faster and for more money.",
                },
                {
                  q: "Can Dr. Jan help with relocations to Las Vegas?",
                  a: "Yes! Dr. Jan Duffy can coordinate with agents in your current city through her referral network while providing expert guidance on Las Vegas neighborhoods, schools, and communities.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-slate-50 rounded-lg p-6">
                  <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                  <p className="text-slate-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center bg-slate-900 text-white rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Experience the Difference
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Ready to work with a Top 1% Las Vegas REALTOR®? Contact Dr. Jan Duffy today.
            </p>
            <a
              href="tel:+17025001942"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-md font-bold text-lg transition-colors"
            >
              <Phone className="h-5 w-5 mr-2" />
              Call (702) 500-1942
            </a>
          </section>
        </div>

        {/* Last Updated */}
        <div className="text-center text-sm text-slate-500 mt-8">Last Updated: January 2026</div>
      </main>
      <RealScoutListings />
      <Footer />
    </>
  );
}
