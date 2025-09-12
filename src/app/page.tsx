import {
  Header,
  Footer,
  HeroSection,
  AboutSection,
  SkillsSection,
  PortfolioSection,
  ExperienceSection,
  Contact,
  QueryDecorations,
  QuerySeparator
} from '@/components';

export default function Home() {
  return (
    <div className="min-h-screen bg-white relative">
      {/* Global Query Decorations */}
      <QueryDecorations />
      
      <Header />
      
      <main>
        <HeroSection />
        
        <QuerySeparator type="brackets" />
        <AboutSection />
        
        <QuerySeparator type="sql" />
        <SkillsSection />
        
        <QuerySeparator type="arrows" />
        <ExperienceSection />
        
        <QuerySeparator type="nodes" />
        <PortfolioSection />
        
        <QuerySeparator type="brackets" />
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
}
