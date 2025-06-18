import FooterSeccion from '@/components/layout/landing-components/footer-section'
import HeroSection from '@/components/layout/landing-components/hero-section'
import HowWorks from '@/components/layout/landing-components/how-works'
import ServicesSection from '@/components/layout/landing-components/services-section'
import PublicHeader from '@/components/layout/publicHeader'
import React from 'react'

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      
      {/* Hero Section */}
      <section id="inicio" className="relative items-center bg-white py-16 md:py-24 ">
        <HeroSection/>  
      </section>

      {/* Servicios Section */}
      <section id="servicios" className="flex items-center m-2 bg-gray-50 py-16">
        <ServicesSection/>
      </section>

      {/* Como Funciona Section */}
      <section id="como-funciona" className="flex items-center m-2 py-16 bg-white">
        <HowWorks/>
      </section>
      
      {/* Footer */}
      <FooterSeccion/>
    </div>
  )
}

export default HomePage