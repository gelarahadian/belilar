import Image from "next/image";
import Link from "next/link";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import {
  FaInstagram,
  FaTwitter,
  FaFacebookF,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";

// ─── Data ──────────────────────────────────────────────────────────────────────

const FOOTER_LINKS = [
  {
    heading: "Customer Service",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "How to Buy", href: "/how-to-buy" },
      { label: "How to Sell", href: "/how-to-sell" },
      { label: "Return & Refund", href: "/return" },
      { label: "Track Your Order", href: "/track" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    heading: "Explore Belilar",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Press & Media", href: "/press" },
      { label: "Affiliate Program", href: "/affiliate" },
      { label: "Become a Seller", href: "/sell" },
    ],
  },
  {
    heading: "Payment",
    links: [
      { label: "Credit & Debit Card", href: "#" },
      { label: "Bank Transfer", href: "#" },
      { label: "GoPay & OVO", href: "#" },
      { label: "DANA & ShopeePay", href: "#" },
      { label: "Belilar PayLater", href: "#" },
      { label: "Virtual Account", href: "#" },
    ],
  },
  {
    heading: "Shipping",
    links: [
      { label: "JNE Express", href: "#" },
      { label: "J&T Cargo", href: "#" },
      { label: "SiCepat", href: "#" },
      { label: "Anteraja", href: "#" },
      { label: "Same Day Delivery", href: "#" },
      { label: "Instant Courier", href: "#" },
    ],
  },
];

const SOCIAL_LINKS = [
  {
    icon: FaInstagram,
    label: "Instagram",
    href: "#",
    color: "hover:text-pink-400",
  },
  { icon: FaTiktok, label: "TikTok", href: "#", color: "hover:text-gray-200" },
  {
    icon: FaFacebookF,
    label: "Facebook",
    href: "#",
    color: "hover:text-blue-400",
  },
  {
    icon: FaTwitter,
    label: "Twitter / X",
    href: "#",
    color: "hover:text-sky-400",
  },
  { icon: FaYoutube, label: "YouTube", href: "#", color: "hover:text-red-400" },
];

const CONTACT = [
  { icon: HiOutlineMail, text: "support@belilar.id" },
  { icon: HiOutlinePhone, text: "0800-1234-5678 (Free)" },
  { icon: HiOutlineLocationMarker, text: "Jakarta, Indonesia" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-400 mt-12">
      {/* ── Top band ──────────────────────────────────────────────────────── */}
      <div className="border-b border-white/5">
        <div className="max-w-[1280px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Brand + description */}
          <div className="space-y-5 lg:col-span-1">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-600/30">
                <Image src="/logo.png" width={22} height={22} alt="Belilar" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Belilar
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
              Indonesia's modern marketplace — millions of products, trusted
              sellers, and lightning-fast delivery right at your fingertips.
            </p>

            {/* Contact */}
            <ul className="space-y-2">
              {CONTACT.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2.5 text-sm">
                  <Icon className="text-primary-500 flex-shrink-0 text-base" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            {/* Social */}
            <div className="flex items-center gap-3 pt-1">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href, color }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-gray-500 ${color} transition-all duration-150`}
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {FOOTER_LINKS.map(({ heading, links }) => (
              <div key={heading}>
                <h5 className="text-white text-sm font-bold mb-4 tracking-wide">
                  {heading}
                </h5>
                <ul className="space-y-2.5">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-xs text-gray-500 hover:text-primary-400 transition-colors duration-150"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SEO Description ───────────────────────────────────────────────── */}
      <div className="border-b border-white/5">
        <div className="max-w-[1280px] mx-auto px-6 py-8 grid sm:grid-cols-2 gap-6">
          <div>
            <h6 className="text-white text-xs font-bold mb-2 uppercase tracking-widest">
              Belilar — Buy & Sell Online
            </h6>
            <p className="text-xs text-gray-600 leading-relaxed">
              Belilar is a modern online marketplace built to make buying and
              selling in Indonesia fast, safe, and enjoyable. From everyday
              essentials to your dream items — find the best deals across
              thousands of verified sellers.
            </p>
          </div>
          <div>
            <h6 className="text-white text-xs font-bold mb-2 uppercase tracking-widest">
              Trusted Shopping at Belilar
            </h6>
            <p className="text-xs text-gray-600 leading-relaxed">
              Browse millions of products across fashion, electronics, home
              goods, food & beverages, and more. Enjoy secure transactions,
              seller ratings, weekly promos, and a seamless mobile experience —
              wherever you are, whenever you shop.
            </p>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-600 order-2 sm:order-1">
          &copy; {year} Belilar. All rights reserved.
        </p>

        <div className="flex items-center gap-4 order-1 sm:order-2">
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
            (item) => (
              <Link
                key={item}
                href="#"
                className="text-xs text-gray-600 hover:text-primary-400 transition-colors duration-150"
              >
                {item}
              </Link>
            ),
          )}
        </div>

        {/* Language switcher */}
        <div className="flex items-center gap-1 order-3 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
          <span className="text-xs">🇮🇩</span>
          <select
            className="bg-transparent text-xs text-gray-400 outline-none cursor-pointer"
            defaultValue="id"
          >
            <option value="id">Bahasa Indonesia</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </footer>
  );
}
