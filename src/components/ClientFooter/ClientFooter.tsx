import React from "react";
import Link from "next/link";

const SocialIcon = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
  >
    {children}
  </a>
);

const FooterLink = ({ href, text }: { href: string; text: string }) => (
  <li>
    <Link
      href={href}
      className="text-gray-300 hover:text-white transition-colors"
    >
      {text}
    </Link>
  </li>
);

const PaymentMethod = ({ name }: { name: string }) => (
  <div className="bg-white rounded-md py-2 px-4 text-gray-700 font-semibold text-sm">
    {name}
  </div>
);

export default function ClientFooter() {
  return (
    <footer className="bg-[#a02023] text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
          {/* FubaBus Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">FubaBus</h3>
            <p className="text-gray-300">
              Hệ thống đặt vé xe khách trực tuyến hàng đầu Việt Nam, kết nối bạn
              đến mọi miền đất nước.
            </p>
            <div className="flex space-x-3 pt-2">
              <SocialIcon href="#">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </SocialIcon>
              <SocialIcon href="#">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </SocialIcon>
              <SocialIcon href="#">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm6.406-11.845a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </SocialIcon>
              <SocialIcon href="#">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.78 22 12 22 12s0 3.22-.418 4.814a2.504 2.504 0 0 1-1.768 1.768C18.319 19 12 19 12 19s-6.319 0-7.812-.418a2.504 2.504 0 0 1-1.768-1.768C2 15.22 2 12 2 12s0-3.22.418-4.814a2.504 2.504 0 0 1 1.768-1.768C5.681 5 12 5 12 5s6.319 0 7.812.418zM9.5 15.5V8.5l6 3.5-6 3.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:pl-8">
            <h3 className="font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-3">
              <FooterLink href="/about-us" text="Về chúng tôi" />
              <FooterLink href="/routes-2" text="Tuyến đường" />
              <FooterLink href="/contact" text="Liên hệ" />
              <FooterLink href="#" text="Điều khoản" />
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-3">
              <FooterLink href="#" text="Câu hỏi thường gặp" />
              <FooterLink href="#" text="Hướng dẫn đặt vé" />
              <FooterLink href="#" text="Thanh toán" />
              <FooterLink href="#" text="Hoàn tiền" />
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Liên hệ</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="mt-1">📞</span>
                <div>
                  <div className="text-gray-400">Hotline</div>
                  <a
                    href="tel:1900123456"
                    className="font-semibold tracking-wider hover:text-white"
                  >
                    1900 123 456
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="mt-1">✉️</span>
                <div>
                  <div className="text-gray-400">Email</div>
                  <a
                    href="mailto:support@fubabus.vn"
                    className="hover:text-white"
                  >
                    support@fubabus.vn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-10 pt-8 border-t border-white/10 text-center">
          <h3 className="font-semibold mb-4">Phương thức thanh toán</h3>
          <div className="flex justify-center flex-wrap gap-3">
            <PaymentMethod name="Visa" />
            <PaymentMethod name="Mastercard" />
            <PaymentMethod name="MoMo" />
            <PaymentMethod name="ZaloPay" />
            <PaymentMethod name="VNPay" />
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-8 border-t border-white/10 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} FubaBus. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
