import Navbar       from '@/components/Navbar'
import Hero         from '@/components/Hero'
import MarqueeBand  from '@/components/MarqueeBand'
import About        from '@/components/About'
import Menu         from '@/components/Menu'
import WhyUs        from '@/components/WhyUs'
import Reviews      from '@/components/Reviews'
import OrderSection from '@/components/OrderSection'
import Footer       from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <MarqueeBand />
      <About />
      <Menu />
      <WhyUs />
      <Reviews />
      <OrderSection />
      <Footer />
    </main>
  )
}
