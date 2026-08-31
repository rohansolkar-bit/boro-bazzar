import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaPinterestP, FaYoutube } from 'react-icons/fa';
import { FiCreditCard, FiGift, FiHeadphones, FiMessageSquare, FiTruck } from 'react-icons/fi';
import { LuBadgeDollarSign, LuPackageCheck } from 'react-icons/lu';

const serviceHighlights = [
  {
    icon: FiTruck,
    title: 'Free Shipping',
    description: 'For all Orders Over $100',
  },
  {
    icon: LuPackageCheck,
    title: '30 Days Returns',
    description: 'For an Exchange Product',
  },
  {
    icon: FiCreditCard,
    title: 'Secured Payment',
    description: 'Payment Cards Accepted',
  },
  {
    icon: FiGift,
    title: 'Special Gifts',
    description: 'Our First Product Order',
  },
  {
    icon: FiHeadphones,
    title: 'Support 24/7',
    description: 'Contact us Anytime',
  },
];

const productLinks = [
  { href: '/prices-drop', label: 'Prices drop' },
  { href: '/new-products', label: 'New products' },
  { href: '/best-sales', label: 'Best sales' },
  { href: '/contact', label: 'Contact us' },
  { href: '/sitemap', label: 'Sitemap' },
  { href: '/stores', label: 'Stores' },
];

const companyLinks = [
  { href: '/delivery', label: 'Delivery' },
  { href: '/legal-notice', label: 'Legal Notice' },
  { href: '/terms', label: 'Terms and conditions of use' },
  { href: '/about', label: 'About us' },
  { href: '/secure-payment', label: 'Secure payment' },
  { href: '/login', label: 'Login' },
];

const socialLinks = [
  { href: 'https://www.facebook.com', label: 'Facebook', icon: FaFacebookF },
  { href: 'https://www.youtube.com', label: 'YouTube', icon: FaYoutube },
  { href: 'https://www.pinterest.com', label: 'Pinterest', icon: FaPinterestP },
  { href: 'https://www.instagram.com', label: 'Instagram', icon: FaInstagram },
];

const paymentMethods = ['Visa', 'Mastercard', 'Amex', 'PayPal'];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-[#f7f7f7] text-slate-600" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8" aria-label="Store benefits">
        <ul className="grid gap-7 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {serviceHighlights.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex flex-col items-center text-center">
              <Icon className="h-8 w-8 text-slate-700" aria-hidden="true" strokeWidth={1.8} />
              <h3 className="mt-3 text-sm font-extrabold text-slate-800">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="border-t border-slate-200">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.1fr_0.8fr_0.9fr_1.35fr] lg:gap-10 lg:px-8">
          <section aria-labelledby="footer-contact-heading" className="lg:border-r lg:border-slate-200 lg:pr-9">
            <h3 id="footer-contact-heading" className="text-base font-extrabold text-slate-800">
              Contact us
            </h3>
            <address className="mt-5 space-y-5 text-xs not-italic leading-5 text-slate-500">
              <p>
                Classyshop - Mega Super Store
                <br />
                507-Union Trade Centre France
              </p>
              <a
                href="mailto:sales@yourcompany.com"
                className="block rounded-sm transition hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                sales@yourcompany.com
              </a>
              <a
                href="tel:+919876543210"
                className="block rounded-sm text-xl font-extrabold text-emerald-500 transition hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                (+91) 9876-543-210
              </a>
            </address>

            <a
              href="/help"
              className="mt-5 inline-flex items-center gap-3 rounded-sm text-sm font-bold text-slate-800 transition hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <FiMessageSquare className="h-8 w-8 text-emerald-500" aria-hidden="true" />
              <span>
                Online Chat
                <span className="block">Get Expert Help</span>
              </span>
            </a>
          </section>

          <nav aria-labelledby="footer-products-heading">
            <h3 id="footer-products-heading" className="text-base font-extrabold text-slate-800">
              Products
            </h3>
            <ul className="mt-5 space-y-2.5 text-xs">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-sm transition hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-company-heading">
            <h3 id="footer-company-heading" className="text-base font-extrabold text-slate-800">
              Our company
            </h3>
            <ul className="mt-5 space-y-2.5 text-xs">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-sm transition hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-labelledby="footer-newsletter-heading">
            <h3 id="footer-newsletter-heading" className="text-base font-extrabold text-slate-800">
              Subscribe to newsletter
            </h3>
            <p className="mt-5 text-xs leading-5 text-slate-500">
              Subscribe to our latest newsletter to get news about special discounts.
            </p>

            <form action="#" className="mt-6 space-y-3">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Your Email Address"
                className="h-10 w-full border border-slate-200 bg-white px-4 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="h-9 bg-emerald-500 px-6 text-xs font-extrabold uppercase text-white transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Subscribe
              </button>
              <label className="flex items-start gap-2 text-[11px] leading-4 text-slate-600">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 border-slate-300 text-emerald-500 focus:ring-2 focus:ring-emerald-500"
                />
                <span>I agree to the terms and conditions and the privacy policy</span>
              </label>
            </form>
          </section>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-5 sm:px-6 md:grid md:grid-cols-3 lg:px-8">
          <nav aria-label="Social media links" className="justify-self-start">
            <ul className="flex items-center gap-3">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={`Follow us on ${label}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-emerald-500 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <p className="text-center text-xs text-slate-500">&copy; 2024 - Ecommerce Template</p>

          <div className="flex flex-wrap items-center justify-center gap-1.5 md:justify-self-end" aria-label="Accepted payment methods">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="inline-flex h-5 items-center gap-1 rounded-sm border border-slate-200 bg-white px-1.5 text-[9px] font-extrabold uppercase text-slate-700 shadow-sm"
              >
                <LuBadgeDollarSign className="h-3 w-3 text-sky-600" aria-hidden="true" />
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}