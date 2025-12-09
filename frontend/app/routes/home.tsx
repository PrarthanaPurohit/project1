import type { Route } from "./+types/home";
import LandingPage from "../components/LandingPage";
import ProjectsSection from "../components/ProjectsSection";
import HappyClientsSection from "../components/HappyClientsSection";
import ContactForm from "../components/ContactForm";
import NewsletterSection from "../components/NewsletterSection";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Showcase - Projects & Clients" },
    { name: "description", content: "Explore our portfolio of projects and client testimonials" },
  ];
}

export default function Home() {
  return (
    <LandingPage>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <section className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 px-4">
            Welcome to Our Showcase
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
            Discover our portfolio of projects and hear from our satisfied clients
          </p>
        </section>

        {/* Projects Section */}
        <ProjectsSection />

        {/* Happy Clients Section */}
        <HappyClientsSection />

        <section id="contact" className="mb-12 sm:mb-16 scroll-mt-20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center px-4">
            Contact Us
          </h2>
          <ContactForm />
        </section>

        <section id="newsletter" className="mb-12 sm:mb-16 scroll-mt-20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center px-4">
            Newsletter
          </h2>
          <NewsletterSection />
        </section>
      </div>
    </LandingPage>
  );
}
