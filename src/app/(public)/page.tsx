import NavBar from "@/app/_components/NavBar/NavBar";
import HeroSection from "./_components/HeroSection";
import PlayerManagementSection from "./_components/PlayerManagementSection";
import DynamicTacticsSection from "./_components/DynamicTacticsSection";
import CTASection from "./_components/CTASection";
import Footer from "./_components/Footer";

export default function HomePage() {
  return (
    <>
      <NavBar />
      <main>
        <HeroSection />
        <PlayerManagementSection />
        <DynamicTacticsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
