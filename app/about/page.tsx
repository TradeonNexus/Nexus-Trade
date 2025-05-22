"use client"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerChildren, StaggerItem } from "@/components/animations/stagger-children"
import { AnimatedGradientText } from "@/components/animations/animated-gradient-text"
import { AnimatedButton } from "@/components/animations/animated-button"
import { AnimatedBackground } from "@/components/animations/animated-background"
import { FloatingElements } from "@/components/animations/floating-elements"
import { useInView } from "react-intersection-observer"
import { MobileMenu } from "@/components/mobile-menu"
import { useVideoModal } from "@/contexts/video-modal-context"
import { useRouter } from "next/navigation"

export default function AboutPage() {
  const { openVideoModal } = useVideoModal()
  const { ref: missionRef, inView: missionInView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  })

  const { ref: teamRef, inView: teamInView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  })

  const { ref: timelineRef, inView: timelineInView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  })

  const router = useRouter()

  return (
    <main className="flex min-h-screen flex-col bg-dark">
      {/* Header */}
      <motion.header
        className="bg-dark py-4 px-4 md:px-12 sticky top-0 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.png"
                alt="Nexus Trade Logo"
                width={40}
                height={40}
                className="h-8 w-auto md:h-10"
              />
            </Link>
          </motion.div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-4">
            <div className="md:hidden">
              <AnimatedButton
                size="sm"
                className="bg-cta-blue text-dark hover:bg-primary text-xs"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/sign-in">Login</Link>
              </AnimatedButton>
            </div>
            <MobileMenu />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Link href="/" className="text-white hover:text-primary">
                Home
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Link href="/about" className="text-white border-b-2 border-primary pb-1">
                About
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Link href="/get-connected" className="text-white hover:text-primary">
                Get connected
              </Link>
            </motion.div>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex space-x-4">
            <AnimatedButton className="bg-cta-blue text-dark hover:bg-primary">
              <Link href="/sign-in">Login</Link>
            </AnimatedButton>
            <AnimatedButton
              variant="outline"
              className="text-white border-white bg-gray-800/50 hover:bg-primary hover:text-dark hover:border-primary"
              onClick={() => openVideoModal()}
            >
              Watch Demo
            </AnimatedButton>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="bg-dark py-12 md:py-20 text-center px-4 relative overflow-hidden">
        {/* Background Animation */}
        <AnimatedBackground variant="particles" color="primary" className="opacity-20" />
        <FloatingElements count={15} className="opacity-10" />

        <div className="container mx-auto relative z-10">
          <FadeIn delay={0.2} once={false}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              About <AnimatedGradientText className="font-extrabold">Nexus Trade</AnimatedGradientText>
            </h1>
          </FadeIn>

          <FadeIn delay={0.4} once={false}>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-sm md:text-base px-4">
              Pioneering the future of decentralized trading with innovative technology and a community-first approach.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-dark-blue py-12 md:py-20 px-4 relative overflow-hidden" ref={missionRef}>
        {/* Background Animation */}
        <AnimatedBackground variant="gradient" color="primary" className="opacity-10" />

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <FadeIn direction="left" once={false}>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  Our <AnimatedGradientText>Mission</AnimatedGradientText>
                </h2>
                <p className="text-gray-300 mb-4">
                  At Nexus Trade, we're on a mission to democratize access to decentralized derivatives trading. We
                  believe that financial tools should be accessible to everyone, regardless of their background or
                  location.
                </p>
                <p className="text-gray-300 mb-4">
                  Our platform is built on the principles of transparency, security, and community. We're committed to
                  providing a trading experience that is not only powerful and efficient but also intuitive and
                  user-friendly.
                </p>
                <p className="text-gray-300">
                  By leveraging the SUI blockchain, we're able to offer a trading platform that is fast, secure, and
                  truly decentralized, putting the power back in the hands of traders.
                </p>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.2} once={false}>
              <div className="bg-dark/50 p-6 rounded-lg border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4">Our Values</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-primary/20 p-2 rounded-full mr-3 mt-1">
                      <svg
                        className="w-4 h-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Transparency</h4>
                      <p className="text-gray-300 text-sm">
                        All transactions are recorded on-chain, ensuring complete transparency and accountability.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/20 p-2 rounded-full mr-3 mt-1">
                      <svg
                        className="w-4 h-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Community</h4>
                      <p className="text-gray-300 text-sm">
                        We believe in the power of community and are committed to building a platform that serves the
                        needs of our users.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/20 p-2 rounded-full mr-3 mt-1">
                      <svg
                        className="w-4 h-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Innovation</h4>
                      <p className="text-gray-300 text-sm">
                        We're constantly pushing the boundaries of what's possible in decentralized finance.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/20 p-2 rounded-full mr-3 mt-1">
                      <svg
                        className="w-4 h-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Security</h4>
                      <p className="text-gray-300 text-sm">
                        The security of our platform and our users' assets is our top priority.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-dark py-12 md:py-20 px-4 relative overflow-hidden" ref={teamRef}>
        <FloatingElements count={10} className="opacity-10" />

        <div className="container mx-auto relative z-10">
          <FadeIn once={false}>
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
              Meet Our <AnimatedGradientText>Team</AnimatedGradientText>
            </h2>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" once={false}>
            {/* Team Member 1 */}
            <StaggerItem>
              <div className="bg-dark-blue rounded-lg overflow-hidden border border-gray-800 transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20">
                <div className="aspect-square relative bg-gray-800">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                    <svg
                      className="w-16 h-16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-bold text-white mb-1">Alex Chen</h3>
                  <p className="text-primary text-sm mb-2">Founder & CEO</p>
                  <p className="text-gray-400 text-sm">
                    Blockchain pioneer with 10+ years in fintech and decentralized systems.
                  </p>
                </div>
              </div>
            </StaggerItem>

            {/* Team Member 2 */}
            <StaggerItem>
              <div className="bg-dark-blue rounded-lg overflow-hidden border border-gray-800 transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20">
                <div className="aspect-square relative bg-gray-800">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                    <svg
                      className="w-16 h-16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-bold text-white mb-1">Sarah Johnson</h3>
                  <p className="text-primary text-sm mb-2">CTO</p>
                  <p className="text-gray-400 text-sm">
                    Former lead developer at major crypto exchanges with expertise in scalable systems.
                  </p>
                </div>
              </div>
            </StaggerItem>

            {/* Team Member 3 */}
            <StaggerItem>
              <div className="bg-dark-blue rounded-lg overflow-hidden border border-gray-800 transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20">
                <div className="aspect-square relative bg-gray-800">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                    <svg
                      className="w-16 h-16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-bold text-white mb-1">Michael Rodriguez</h3>
                  <p className="text-primary text-sm mb-2">Head of Product</p>
                  <p className="text-gray-400 text-sm">
                    Product strategist with a passion for creating intuitive user experiences.
                  </p>
                </div>
              </div>
            </StaggerItem>

            {/* Team Member 4 */}
            <StaggerItem>
              <div className="bg-dark-blue rounded-lg overflow-hidden border border-gray-800 transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20">
                <div className="aspect-square relative bg-gray-800">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                    <svg
                      className="w-16 h-16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-bold text-white mb-1">Emily Zhang</h3>
                  <p className="text-primary text-sm mb-2">Head of Community</p>
                  <p className="text-gray-400 text-sm">
                    Community builder with extensive experience in crypto education and engagement.
                  </p>
                </div>
              </div>
            </StaggerItem>
          </StaggerChildren>

          <div className="text-center mt-12">
            <AnimatedButton
              className="bg-primary text-dark hover:bg-blue-600"
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 150, 255, 0.5)" }}
            >
              Join Our Team
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-dark-blue py-12 md:py-20 px-4 relative overflow-hidden" ref={timelineRef}>
        <AnimatedBackground variant="waves" color="primary" className="opacity-10" />

        <div className="container mx-auto relative z-10">
          <FadeIn once={false}>
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
              Our <AnimatedGradientText>Journey</AnimatedGradientText>
            </h2>
          </FadeIn>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-gray-800 transform md:translate-x-[-50%]"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
              {/* 2021 */}
              <FadeIn once={false}>
                <div className="relative flex flex-col md:flex-row items-center md:justify-between">
                  <div className="flex-1 md:pr-8 md:text-right order-2 md:order-1 mb-4 md:mb-0">
                    <h3 className="text-xl font-bold text-white mb-2">Inception</h3>
                    <p className="text-gray-300">
                      Nexus Trade was founded with a vision to revolutionize decentralized derivatives trading.
                    </p>
                  </div>
                  <div className="absolute left-0 md:left-1/2 w-12 h-12 bg-primary rounded-full transform md:translate-x-[-50%] flex items-center justify-center order-1 md:order-2 mb-4 md:mb-0 z-10">
                    <span className="text-dark font-bold text-sm">2021</span>
                  </div>
                  <div className="flex-1 md:pl-8 order-3"></div>
                </div>
              </FadeIn>

              {/* 2022 Q1 */}
              <FadeIn once={false} delay={0.1}>
                <div className="relative flex flex-col md:flex-row items-center md:justify-between">
                  <div className="flex-1 md:pr-8 md:text-right order-2 md:order-1"></div>
                  <div className="absolute left-0 md:left-1/2 w-12 h-12 bg-primary rounded-full transform md:translate-x-[-50%] flex items-center justify-center order-1 md:order-2 mb-4 md:mb-0 z-10">
                    <span className="text-dark font-bold text-sm">Q1</span>
                  </div>
                  <div className="flex-1 md:pl-8 order-3 mb-4 md:mb-0">
                    <h3 className="text-xl font-bold text-white mb-2">Seed Funding</h3>
                    <p className="text-gray-300">
                      Secured $5M in seed funding to build the initial platform architecture.
                    </p>
                  </div>
                </div>
              </FadeIn>

              {/* 2022 Q3 */}
              <FadeIn once={false} delay={0.2}>
                <div className="relative flex flex-col md:flex-row items-center md:justify-between">
                  <div className="flex-1 md:pr-8 md:text-right order-2 md:order-1 mb-4 md:mb-0">
                    <h3 className="text-xl font-bold text-white mb-2">Alpha Launch</h3>
                    <p className="text-gray-300">
                      Released the alpha version of the platform to a select group of early adopters.
                    </p>
                  </div>
                  <div className="absolute left-0 md:left-1/2 w-12 h-12 bg-primary rounded-full transform md:translate-x-[-50%] flex items-center justify-center order-1 md:order-2 mb-4 md:mb-0 z-10">
                    <span className="text-dark font-bold text-sm">Q3</span>
                  </div>
                  <div className="flex-1 md:pl-8 order-3"></div>
                </div>
              </FadeIn>

              {/* 2023 Q1 */}
              <FadeIn once={false} delay={0.3}>
                <div className="relative flex flex-col md:flex-row items-center md:justify-between">
                  <div className="flex-1 md:pr-8 md:text-right order-2 md:order-1"></div>
                  <div className="absolute left-0 md:left-1/2 w-12 h-12 bg-primary rounded-full transform md:translate-x-[-50%] flex items-center justify-center order-1 md:order-2 mb-4 md:mb-0 z-10">
                    <span className="text-dark font-bold text-sm">Q1</span>
                  </div>
                  <div className="flex-1 md:pl-8 order-3 mb-4 md:mb-0">
                    <h3 className="text-xl font-bold text-white mb-2">Beta Release</h3>
                    <p className="text-gray-300">
                      Launched the beta version with core trading functionality and SUI blockchain integration.
                    </p>
                  </div>
                </div>
              </FadeIn>

              {/* 2023 Q4 */}
              <FadeIn once={false} delay={0.4}>
                <div className="relative flex flex-col md:flex-row items-center md:justify-between">
                  <div className="flex-1 md:pr-8 md:text-right order-2 md:order-1 mb-4 md:mb-0">
                    <h3 className="text-xl font-bold text-white mb-2">Public Launch</h3>
                    <p className="text-gray-300">
                      Official public launch of Nexus Trade with full feature set and community programs.
                    </p>
                  </div>
                  <div className="absolute left-0 md:left-1/2 w-12 h-12 bg-primary rounded-full transform md:translate-x-[-50%] flex items-center justify-center order-1 md:order-2 mb-4 md:mb-0 z-10">
                    <span className="text-dark font-bold text-sm">Q4</span>
                  </div>
                  <div className="flex-1 md:pl-8 order-3"></div>
                </div>
              </FadeIn>

              {/* 2024 */}
              <FadeIn once={false} delay={0.5}>
                <div className="relative flex flex-col md:flex-row items-center md:justify-between">
                  <div className="flex-1 md:pr-8 md:text-right order-2 md:order-1"></div>
                  <div className="absolute left-0 md:left-1/2 w-12 h-12 bg-primary rounded-full transform md:translate-x-[-50%] flex items-center justify-center order-1 md:order-2 mb-4 md:mb-0 z-10">
                    <span className="text-dark font-bold text-sm">2024</span>
                  </div>
                  <div className="flex-1 md:pl-8 order-3 mb-4 md:mb-0">
                    <h3 className="text-xl font-bold text-white mb-2">The Future</h3>
                    <p className="text-gray-300">
                      Expanding our ecosystem with new features, partnerships, and community initiatives.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-cta-blue py-10 md:py-16 px-4 relative overflow-hidden">
        <AnimatedBackground variant="particles" color="dark" className="opacity-5" />

        <div className="container mx-auto text-center relative z-10">
          <FadeIn once={false}>
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-3 md:mb-4">Ready to join the revolution?</h2>
          </FadeIn>
          <FadeIn delay={0.2} once={false}>
            <p className="text-dark-blue mb-6 md:mb-8 text-sm md:text-base max-w-2xl mx-auto">
              Experience the future of decentralized trading with Nexus Trade. Connect your wallet and start trading in
              minutes.
            </p>
          </FadeIn>
          <FadeIn delay={0.4} once={false}>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <AnimatedButton
                className="bg-dark text-white hover:bg-secondary px-4 sm:px-8 py-2 sm:py-6 text-sm md:text-base"
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 15, 29, 0.5)" }}
              >
                Start Trading
              </AnimatedButton>
              <Link href="/get-connected">
                <AnimatedButton
                  variant="outline"
                  className="border-dark text-dark hover:bg-light-blue px-4 sm:px-8 py-2 sm:py-6 text-sm md:text-base mt-3 sm:mt-0"
                >
                  Learn How to Connect
                </AnimatedButton>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark py-10 md:py-12 px-4 relative overflow-hidden">
        <FloatingElements count={5} minSize={5} maxSize={20} className="opacity-5" />

        <div className="container mx-auto">
          <motion.div
            className="flex justify-center mb-6 md:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Image src="/images/logo.png" alt="Nexus Trade Logo" width={50} height={50} className="h-12 w-auto" />
            </motion.div>
          </motion.div>

          <StaggerChildren className="flex flex-wrap justify-center gap-4 md:gap-6 mb-6 md:mb-8" once={false}>
            <StaggerItem>
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link href="/about-us" className="text-white hover:text-primary text-sm md:text-base">
                  About Us
                </Link>
              </motion.div>
            </StaggerItem>
            <StaggerItem>
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link href="/contact-us" className="text-white hover:text-primary text-sm md:text-base">
                  Contact Us
                </Link>
              </motion.div>
            </StaggerItem>
            <StaggerItem>
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link href="/support-center" className="text-white hover:text-primary text-sm md:text-base">
                  Support Center
                </Link>
              </motion.div>
            </StaggerItem>
            <StaggerItem>
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link href="/blog-posts" className="text-white hover:text-primary text-sm md:text-base">
                  Blog Posts
                </Link>
              </motion.div>
            </StaggerItem>
            <StaggerItem>
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link href="/join-us" className="text-white hover:text-primary text-sm md:text-base">
                  Join Us
                </Link>
              </motion.div>
            </StaggerItem>
          </StaggerChildren>

          <motion.div
            className="text-center text-gray-500 text-xs md:text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <p>© 2023 Nexus Trade. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-4">
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link href="/privacy-policy" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link href="/terms-of-use" className="hover:text-primary">
                  Terms of Use
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link href="/cookie-policy" className="hover:text-primary">
                  Cookie Policy
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </footer>
    </main>
  )
}
