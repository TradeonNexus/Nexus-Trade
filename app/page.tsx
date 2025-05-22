"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { MobileMenu } from "@/components/mobile-menu"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerChildren, StaggerItem } from "@/components/animations/stagger-children"
import { AnimatedGradientText } from "@/components/animations/animated-gradient-text"
import { AnimatedButton } from "@/components/animations/animated-button"
import { AnimatedFeatureCard } from "@/components/animations/animated-feature-card"
import { AnimatedBackground } from "@/components/animations/animated-background"
import { FloatingElements } from "@/components/animations/floating-elements"
import { useInView } from "react-intersection-observer"
import { useVideoModal } from "@/contexts/video-modal-context"
import { Logo } from "@/components/logo"
import { useWallet } from "@/contexts/wallet-context"

export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { openVideoModal } = useVideoModal()
  const { wallet, connectWallet } = useWallet()

  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  })

  const { ref: experienceRef, inView: experienceInView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  })

  const { ref: statsRef, inView: statsInView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  })

  const { ref: featuresRef, inView: featuresInView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  })

  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setEmail("")
      alert("Thank you for subscribing!")
    }, 1000)
  }

  return (
    <main className="flex min-h-screen flex-col bg-dark" ref={containerRef}>
      {/* Header */}
      <motion.header
        className="bg-dark py-4 px-4 md:px-12 sticky top-0 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo - directly use the Logo component with withLink=true */}
          <Logo size="md" />

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
              <Link href="/" className="text-white border-b-2 border-primary pb-1">
                Home
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Link href="/about" className="text-white hover:text-primary">
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

      {/* Rest of the page content remains the same */}
      {/* Hero Section */}
      <section className="bg-dark py-12 md:py-20 text-center px-4 relative overflow-hidden" ref={heroRef}>
        {/* Background Animation */}
        <AnimatedBackground variant="particles" color="primary" className="opacity-20" />
        <FloatingElements count={15} className="opacity-10" />

        <div className="container mx-auto relative z-10">
          <FadeIn delay={0.2} once={false}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Onchain Derivatives Built <br className="hidden sm:block" />
              <AnimatedGradientText from="from-primary" via="via-blue-400" to="to-blue-300" className="font-extrabold">
                Differently
              </AnimatedGradientText>
            </h1>
          </FadeIn>

          <FadeIn delay={0.4} once={false}>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-sm md:text-base px-4">
              Nexus Trade combines decentralized perpetual trading with social dynamics, empowering traders to connect
              and thrive. Experience low fees, high leverage, and a community-driven platform that puts you in control.
            </p>
          </FadeIn>

          <FadeIn delay={0.6} once={false}>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
              <AnimatedButton
                className="bg-cta-blue text-dark hover:bg-primary px-4 sm:px-8 py-2 sm:py-6 text-sm md:text-base"
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(142, 202, 255, 0.5)" }}
              >
                <Link href="/sign-in">Login</Link>
              </AnimatedButton>
              <AnimatedButton
                variant="outline"
                className="text-white border-white bg-gray-800/50 hover:bg-primary hover:text-dark hover:border-primary px-4 sm:px-8 py-2 sm:py-6 text-sm md:text-base mt-3 sm:mt-0"
                onClick={() => openVideoModal()}
              >
                Watch Demo Video
              </AnimatedButton>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-dark-blue py-12 md:py-20 px-4 relative overflow-hidden" ref={featuresRef}>
        {/* Background Animation */}
        <AnimatedBackground variant="gradient" color="primary" className="opacity-10" />

        <div className="container mx-auto relative z-10">
          <FadeIn once={false}>
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                Trade on the{" "}
                <AnimatedGradientText
                  from="from-primary"
                  via="via-blue-400"
                  to="to-blue-300"
                  className="font-extrabold"
                >
                  Fastest
                </AnimatedGradientText>{" "}
                Decentralized <br className="hidden sm:block" />
                Perpetual Exchange
              </h2>
              <p className="text-gray-400 text-sm md:text-base">onchain derivatives built differently</p>
            </div>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8" once={false}>
            <StaggerItem>
              <AnimatedFeatureCard
                icon="/images/icons/sui.png"
                iconAlt="SUI Blockchain"
                title="Built on SUI Blockchain"
                description="Leveraging SUI's high-performance blockchain to provide a seamless trading experience."
              />
            </StaggerItem>

            <StaggerItem>
              <AnimatedFeatureCard
                icon="/images/icons/eye.png"
                iconAlt="Transparency"
                title="Transparency"
                description="All transactions are recorded on-chain for maximum security. Trade logs are stored on-chain."
              />
            </StaggerItem>

            <StaggerItem>
              <AnimatedFeatureCard
                icon="/images/icons/shield-security.png"
                iconAlt="Easy Registration"
                title="Easy Registration Process"
                description="No KYC, just a SUI wallet is all you need to get started trading."
              />
            </StaggerItem>

            <StaggerItem>
              <AnimatedFeatureCard
                icon="/images/icons/timer.png"
                iconAlt="High Speed"
                title="High Speed"
                description="Trades get settled in milliseconds, in real time."
              />
            </StaggerItem>
          </StaggerChildren>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-dark py-12 md:py-20 px-4 relative overflow-hidden" ref={statsRef}>
        <AnimatedBackground variant="waves" color="primary" className="opacity-10" />

        <div className="container mx-auto relative z-10">
          <FadeIn once={false}>
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
              Platform <AnimatedGradientText>Statistics</AnimatedGradientText>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {statsInView && (
              <AnimatePresence>
                <motion.div
                  className="bg-gray-900/50 rounded-lg p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  key="stat-1"
                >
                  <motion.div
                    className="text-3xl md:text-4xl font-bold text-primary mb-2"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
                  >
                    $1.2B+
                  </motion.div>
                  <div className="text-sm text-gray-400">Trading Volume</div>
                </motion.div>

                <motion.div
                  className="bg-gray-900/50 rounded-lg p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  key="stat-2"
                >
                  <motion.div
                    className="text-3xl md:text-4xl font-bold text-primary mb-2"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
                  >
                    50K+
                  </motion.div>
                  <div className="text-sm text-gray-400">Active Traders</div>
                </motion.div>

                <motion.div
                  className="bg-gray-900/50 rounded-lg p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  key="stat-3"
                >
                  <motion.div
                    className="text-3xl md:text-4xl font-bold text-primary mb-2"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
                  >
                    0.06%
                  </motion.div>
                  <div className="text-sm text-gray-400">Trading Fee</div>
                </motion.div>

                <motion.div
                  className="bg-gray-900/50 rounded-lg p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  key="stat-4"
                >
                  <motion.div
                    className="text-3xl md:text-4xl font-bold text-primary mb-2"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
                  >
                    10x
                  </motion.div>
                  <div className="text-sm text-gray-400">Max Leverage</div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="bg-secondary py-12 md:py-20 px-4 relative overflow-hidden" ref={experienceRef}>
        {/* Background Animation */}
        <FloatingElements
          count={8}
          shapes={["circle", "hexagon"]}
          colors={["primary", "blue-400"]}
          minSize={20}
          maxSize={60}
          className="opacity-10"
        />

        <div className="container mx-auto relative z-10">
          <FadeIn once={false}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center mb-10 md:mb-16 leading-tight">
              Discover the{" "}
              <AnimatedGradientText from="from-primary" via="via-blue-400" to="to-blue-300" className="font-extrabold">
                seamless experience
              </AnimatedGradientText>{" "}
              of <br className="hidden sm:block" />
              trading with Nexus Trade today!
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1 */}
            <FadeIn delay={0.1} direction="up" once={false}>
              <div className="text-center mb-8 md:mb-0">
                <motion.div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white flex items-center justify-center mx-auto mb-4 md:mb-6"
                  whileHover={{ scale: 1.1, borderColor: "#0096FF" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-white text-xl md:text-2xl">1</span>
                </motion.div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 px-4">
                  A simple guide for traders, investors, and influencers alike.
                </h3>
                <p className="text-gray-300 mb-4 md:mb-6 text-sm md:text-base px-4">
                  Nexus Trade empowers you to trade, invest, and influence in the crypto space.
                </p>
                <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <Link
                    href="/learn-more"
                    className="text-primary flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    Learn More
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14"></path>
                      <path d="M12 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                </motion.div>
              </div>
            </FadeIn>

            {/* Column 2 */}
            <FadeIn delay={0.3} direction="up" once={false}>
              <div className="text-center mb-8 md:mb-0">
                <motion.div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white flex items-center justify-center mx-auto mb-4 md:mb-6"
                  whileHover={{ scale: 1.1, borderColor: "#0096FF" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-white text-xl md:text-2xl">2</span>
                </motion.div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 px-4">
                  Step into the world of decentralized trading with our user-friendly platform.
                </h3>
                <p className="text-gray-300 mb-4 md:mb-6 text-sm md:text-base px-4">
                  Join a vibrant community of traders and maximize your potential.
                </p>
                <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <AnimatedButton
                    asChild
                    className="text-primary flex items-center justify-center gap-2 text-sm md:text-base"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Link href="/sign-in">Sign Up</Link>
                  </AnimatedButton>
                </motion.div>
              </div>
            </FadeIn>

            {/* Column 3 */}
            <FadeIn delay={0.5} direction="up" once={false}>
              <div className="text-center">
                <motion.div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white flex items-center justify-center mx-auto mb-4 md:mb-6"
                  whileHover={{ scale: 1.1, borderColor: "#0096FF" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-white text-xl md:text-2xl">3</span>
                </motion.div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 px-4">
                  Engage with top traders and elevate your trading strategies effortlessly.
                </h3>
                <p className="text-gray-300 mb-4 md:mb-6 text-sm md:text-base px-4">
                  Follow successful trades and learn from the best in the industry.
                </p>
                <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <AnimatedButton
                    asChild
                    className="text-primary flex items-center justify-center gap-2 text-sm md:text-base"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Link href="/sign-in">Join Now</Link>
                  </AnimatedButton>
                </motion.div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-cta-blue py-10 md:py-16 px-4 relative overflow-hidden">
        {/* Background Animation */}
        <AnimatedBackground variant="particles" color="dark" className="opacity-5" />

        <div className="container mx-auto text-center relative z-10">
          <FadeIn once={false}>
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-3 md:mb-4">
              Join us. Become a part of Nexus Trade
            </h2>
          </FadeIn>
          <FadeIn delay={0.2} once={false}>
            <p className="text-dark-blue mb-6 md:mb-8 text-sm md:text-base px-4">
              Experience decentralized trading with community-driven strategies and low fees on Nexus Trade today!
            </p>
          </FadeIn>
          <FadeIn delay={0.4} once={false}>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <AnimatedButton
                className="bg-dark text-white hover:bg-secondary px-4 sm:px-8 py-2 sm:py-6 text-sm md:text-base"
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 15, 29, 0.5)" }}
              >
                <Link href="/sign-in">Get Started</Link>
              </AnimatedButton>
              <AnimatedButton
                variant="outline"
                className="border-dark text-dark hover:bg-light-blue px-4 sm:px-8 py-2 sm:py-6 text-sm md:text-base mt-3 sm:mt-0"
              >
                <Link href="/sign-in">Login</Link>
              </AnimatedButton>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-100 py-10 md:py-12 px-4 relative overflow-hidden">
        <AnimatedBackground variant="waves" color="primary" className="opacity-5" />

        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <FadeIn direction="left" once={false}>
              <div className="w-full md:w-auto">
                <h3 className="text-xl md:text-2xl font-bold text-dark-blue mb-2">Stay Updated with Nexus Trade</h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Subscribe to our Newsletter and get all updates and new information
                </p>
              </div>
            </FadeIn>
            <FadeIn direction="right" delay={0.2} once={false}>
              <div className="w-full md:w-auto">
                <form className="flex flex-col sm:flex-row gap-2 w-full" onSubmit={handleSubscribe}>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full sm:w-64 md:w-80"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <AnimatedButton
                    className="bg-primary text-white hover:bg-blue-600"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                  </AnimatedButton>
                </form>
                <p className="text-xs text-gray-500 mt-2">
                  By clicking sign up, you agree with our Terms and Conditions
                </p>
              </div>
            </FadeIn>
          </div>
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
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              animate={{
                y: [-5, 0],
                rotate: [0, 5],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                type: "spring",
                stiffness: 300,
              }}
            >
              <Logo size="lg" withLink={false} />
            </motion.div>
          </motion.div>

          <StaggerChildren className="flex flex-wrap justify-center gap-4 md:gap-6 mb-6 md:mb-8" once={false}>
            <StaggerItem>
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link href="/about" className="text-white hover:text-primary text-sm md:text-base">
                  About Us
                </Link>
              </motion.div>
            </StaggerItem>
            <StaggerItem>
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link href="/contact" className="text-white hover:text-primary text-sm md:text-base">
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
