import Hero from '@/components/home/Hero';
import Introduction from '@/components/home/Introduction';
import FourPillars from '@/components/home/FourPillars';
import ClientsMarquee from '@/components/home/ClientsMarquee';
import SelectedWork from '@/components/home/SelectedWork';
import ProductionFeature from '@/components/home/ProductionFeature';
import ThroughTheLens from '@/components/home/ThroughTheLens';
import ServicesPreview from '@/components/home/ServicesPreview';
import AboutPreview from '@/components/home/AboutPreview';
import Leadership from '@/components/home/Leadership';
import CtaContact from '@/components/home/CtaContact';

export default function Home() {
  return (
    <>
      <Hero />
      <Introduction />
      <FourPillars />
      <ClientsMarquee />
      <SelectedWork />
      <ProductionFeature />
      <ThroughTheLens />
      <ServicesPreview />
      <AboutPreview />
      <Leadership />
      <CtaContact />
    </>
  );
}