"use client";

import LandingNavbar from "@/src/components/LandingNavbar/LandingNavbar";
import LoginModal from "@/src/components/LoginModal/LoginModal";
import HeroSection from "@/src/components/Landing/HeroSection";
import PopularRoutes from "@/src/components/Landing/PopularRoutes";
import WhyChooseUs from "@/src/components/Landing/WhyChooseUs";
import Newsletter from "@/src/components/Landing/Newsletter";
import Footer from "@/src/components/Landing/Footer";
import { useAuth } from "@/src/context/AuthContext";
import ClientHeader from "@/src/components/ClientHeader/ClientHeader";

export default function Home() {
  const { isLoginModalOpen, closeLoginModal } = useAuth();

  return (
    <div>
      {/* Fixed Navigation Bar */}
      {/* <LandingNavbar /> */}
      <ClientHeader />

      {/* Hero Section with Search */}
      <HeroSection />

      {/* Popular Routes */}
      <PopularRoutes />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Newsletter Subscription */}
      <Newsletter />

      {/* Footer */}
      <Footer />

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </div>
  );
}
