import {
  Header,
  Footer,
  HeroSection,
  AboutSection,
  SkillsSection,
  PortfolioSection,
  ExperienceSection,
  Contact
} from '@/components';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <PortfolioSection />
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
}
