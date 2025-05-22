"use client"

import type React from "react"

import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { useVideoModal } from "@/contexts/video-modal-context"
import { useRouter } from "next/navigation"

export default function GetConnectedPage() {
  const [activeTab, setActiveTab] = useState("sui")
  const [email, setEmail] = useState("")
  const { openVideoModal } = useVideoModal()
  const router = useRouter()

  const { ref: stepsRef, inView: stepsInView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  })

  const { ref: faqRef, inView: faqInView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  })

  const { ref: supportRef, inView: supportInView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Support request submitted. We'll get back to you soon!")
    setEmail("")
  }

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
              <Link href="/about" className="text-white hover:text-primary">
                About
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Link href="/get-connected" className="text-white border-b-2 border-primary pb-1">
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
              Get <AnimatedGradientText className="font-extrabold">Connected</AnimatedGradientText>
            </h1>
          </FadeIn>

          <FadeIn delay={0.4} once={false}>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-sm md:text-base px-4">
              Connect your wallet to Nexus Trade and start trading in minutes. Follow our simple guide to get started.
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
                onClick={() => openVideoModal("https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1")}
              >
                Watch Tutorial
              </AnimatedButton>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Wallet Options Section */}
      <section className="bg-dark-blue py-12 md:py-20 px-4 relative overflow-hidden">
        {/* Background Animation */}
        <AnimatedBackground variant="gradient" color="primary" className="opacity-10" />

        <div className="container mx-auto relative z-10">
          <FadeIn once={false}>
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
              Choose Your <AnimatedGradientText>Wallet</AnimatedGradientText>
            </h2>
          </FadeIn>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <motion.button
              className={`px-6 py-3 rounded-lg text-white font-medium ${
                activeTab === "sui" ? "bg-primary" : "bg-gray-800 hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab("sui")}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              SUI Wallet
            </motion.button>
            <motion.button
              className={`px-6 py-3 rounded-lg text-white font-medium ${
                activeTab === "stashed" ? "bg-primary" : "bg-gray-800 hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab("stashed")}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Stashed
            </motion.button>
            <motion.button
              className={`px-6 py-3 rounded-lg text-white font-medium ${
                activeTab === "other" ? "bg-primary" : "bg-gray-800 hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab("other")}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Other Wallets
            </motion.button>
          </div>

          <div className="bg-dark/50 rounded-lg border border-gray-800 p-6 md:p-8">
            {activeTab === "sui" && (
              <FadeIn once={false}>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/3 flex justify-center">
                    <div className="bg-gray-800 rounded-lg p-8 w-48 h-48 flex items-center justify-center">
                      <Image
                        src="/images/icons/sui.png"
                        alt="SUI Wallet"
                        width={80}
                        height={80}
                        className="w-24 h-24 object-contain"
                      />
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4">SUI Wallet</h3>
                    <p className="text-gray-300 mb-4">
                      The official wallet for the SUI blockchain. SUI Wallet provides a secure and user-friendly way to
                      manage your SUI tokens and interact with decentralized applications on the SUI network.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-gray-300">
                        <svg
                          className="w-5 h-5 text-primary mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Secure key management
                      </li>
                      <li className="flex items-center text-gray-300">
                        <svg
                          className="w-5 h-5 text-primary mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Easy-to-use interface
                      </li>
                      <li className="flex items-center text-gray-300">
                        <svg
                          className="w-5 h-5 text-primary mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Seamless integration with Nexus Trade
                      </li>
                    </ul>
                    <div className="flex flex-wrap gap-3">
                      <AnimatedButton className="bg-primary text-dark hover:bg-blue-600" whileHover={{ scale: 1.05 }}>
                        Download SUI Wallet
                      </AnimatedButton>
                      <AnimatedButton
                        variant="outline"
                        className="text-white border-white bg-gray-800 hover:bg-gray-700"
                      >
                        View Documentation
                      </AnimatedButton>
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}

            {activeTab === "stashed" && (
              <FadeIn once={false}>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/3 flex justify-center">
                    <div className="bg-gray-800 rounded-lg p-8 w-48 h-48 flex items-center justify-center">
                      <Image
                        src="/images/icons/wallet-2.png"
                        alt="Stashed Wallet"
                        width={80}
                        height={80}
                        className="w-24 h-24 object-contain"
                      />
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Stashed Wallet</h3>
                    <p className="text-gray-300 mb-4">
                      A popular multi-chain wallet with support for SUI blockchain. Stashed offers a comprehensive suite
                      of features for managing your crypto assets across multiple blockchains.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-gray-300">
                        <svg
                          className="w-5 h-5 text-primary mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Multi-chain support
                      </li>
                      <li className="flex items-center text-gray-300">
                        <svg
                          className="w-5 h-5 text-primary mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Built-in DEX
                      </li>
                      <li className="flex items-center text-gray-300">
                        <svg
                          className="w-5 h-5 text-primary mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Mobile and desktop apps
                      </li>
                    </ul>
                    <div className="flex flex-wrap gap-3">
                      <AnimatedButton className="bg-primary text-dark hover:bg-blue-600" whileHover={{ scale: 1.05 }}>
                        Download Stashed
                      </AnimatedButton>
                      <AnimatedButton
                        variant="outline"
                        className="text-white border-white bg-gray-800 hover:bg-gray-700"
                      >
                        View Documentation
                      </AnimatedButton>
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}

            {activeTab === "other" && (
              <FadeIn once={false}>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/3 flex justify-center">
                    <div className="bg-gray-800 rounded-lg p-8 w-48 h-48 flex items-center justify-center">
                      <svg
                        className="w-24 h-24 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Other Compatible Wallets</h3>
                    <p className="text-gray-300 mb-4">
                      Nexus Trade supports a variety of wallets that are compatible with the SUI blockchain. Check our
                      documentation for the full list of supported wallets.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-gray-300">
                        <svg
                          className="w-5 h-5 text-primary mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Multiple wallet options
                      </li>
                      <li className="flex items-center text-gray-300">
                        <svg
                          className="w-5 h-5 text-primary mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Hardware wallet support
                      </li>
                      <li className="flex items-center text-gray-300">
                        <svg
                          className="w-5 h-5 text-primary mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Regular updates for new wallets
                      </li>
                    </ul>
                    <div className="flex flex-wrap gap-3">
                      <AnimatedButton className="bg-primary text-dark hover:bg-blue-600" whileHover={{ scale: 1.05 }}>
                        View Compatible Wallets
                      </AnimatedButton>
                      <AnimatedButton
                        variant="outline"
                        className="text-white border-white bg-gray-800 hover:bg-gray-700"
                      >
                        Request Wallet Integration
                      </AnimatedButton>
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </section>

      {/* Connection Steps Section */}
      <section className="bg-dark py-12 md:py-20 px-4 relative overflow-hidden" ref={stepsRef}>
        <FloatingElements count={10} className="opacity-10" />

        <div className="container mx-auto relative z-10">
          <FadeIn once={false}>
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
              How to <AnimatedGradientText>Connect</AnimatedGradientText>
            </h2>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8" once={false}>
            {/* Step 1 */}
            <StaggerItem>
              <div className="bg-dark-blue rounded-lg border border-gray-800 p-6 h-full transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Install a Wallet</h3>
                <p className="text-gray-300 mb-4">
                  Download and install a compatible wallet like SUI Wallet or Stashed from their official website or app
                  store.
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start">
                    <svg
                      className="w-4 h-4 text-primary mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Create a new wallet or import an existing one
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-4 h-4 text-primary mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Securely store your recovery phrase
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-4 h-4 text-primary mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Add SUI tokens to your wallet
                  </li>
                </ul>
              </div>
            </StaggerItem>

            {/* Step 2 */}
            <StaggerItem>
              <div className="bg-dark-blue rounded-lg border border-gray-800 p-6 h-full transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Connect to Nexus Trade</h3>
                <p className="text-gray-300 mb-4">
                  Visit Nexus Trade and click on the "Login" button in the top right corner of the page.
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start">
                    <svg
                      className="w-4 h-4 text-primary mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Select your wallet from the list
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-4 h-4 text-primary mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Approve the connection request
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-4 h-4 text-primary mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Verify your wallet is connected
                  </li>
                </ul>
              </div>
            </StaggerItem>

            {/* Step 3 */}
            <StaggerItem>
              <div className="bg-dark-blue rounded-lg border border-gray-800 p-6 h-full transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Start Trading</h3>
                <p className="text-gray-300 mb-4">
                  Once connected, you can deposit funds and start trading on Nexus Trade's decentralized platform.
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start">
                    <svg
                      className="w-4 h-4 text-primary mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Deposit SUI or other supported tokens
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-4 h-4 text-primary mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Navigate to the trading dashboard
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-4 h-4 text-primary mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Place your first trade
                  </li>
                </ul>
              </div>
            </StaggerItem>
          </StaggerChildren>

          <div className="text-center mt-12">
            <AnimatedButton
              className="bg-primary text-dark hover:bg-blue-600"
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 150, 255, 0.5)" }}
            >
              View Detailed Guide
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-dark-blue py-12 md:py-20 px-4 relative overflow-hidden" ref={faqRef}>
        <AnimatedBackground variant="waves" color="primary" className="opacity-10" />

        <div className="container mx-auto relative z-10">
          <FadeIn once={false}>
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
              Frequently Asked <AnimatedGradientText>Questions</AnimatedGradientText>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* FAQ Item 1 */}
            <FadeIn once={false} delay={0.1}>
              <div className="bg-dark/50 rounded-lg border border-gray-800 p-6 transition-all duration-300 hover:border-primary">
                <h3 className="text-lg font-bold text-white mb-3">What is a crypto wallet?</h3>
                <p className="text-gray-300">
                  A crypto wallet is a digital tool that allows you to store, send, and receive cryptocurrencies. It
                  contains your private keys, which are used to access and manage your crypto assets on the blockchain.
                </p>
              </div>
            </FadeIn>

            {/* FAQ Item 2 */}
            <FadeIn once={false} delay={0.2}>
              <div className="bg-dark/50 rounded-lg border border-gray-800 p-6 transition-all duration-300 hover:border-primary">
                <h3 className="text-lg font-bold text-white mb-3">Is it safe to connect my wallet to Nexus Trade?</h3>
                <p className="text-gray-300">
                  Yes, Nexus Trade uses secure connection methods and does not store your private keys. We only request
                  permission to interact with the blockchain on your behalf when you initiate transactions.
                </p>
              </div>
            </FadeIn>

            {/* FAQ Item 3 */}
            <FadeIn once={false} delay={0.3}>
              <div className="bg-dark/50 rounded-lg border border-gray-800 p-6 transition-all duration-300 hover:border-primary">
                <h3 className="text-lg font-bold text-white mb-3">Do I need to have SUI tokens to use Nexus Trade?</h3>
                <p className="text-gray-300">
                  Yes, you'll need some SUI tokens to pay for transaction fees on the SUI blockchain. Additionally,
                  you'll need tokens to trade or provide liquidity on the platform.
                </p>
              </div>
            </FadeIn>

            {/* FAQ Item 4 */}
            <FadeIn once={false} delay={0.4}>
              <div className="bg-dark/50 rounded-lg border border-gray-800 p-6 transition-all duration-300 hover:border-primary">
                <h3 className="text-lg font-bold text-white mb-3">What if I disconnect my wallet?</h3>
                <p className="text-gray-300">
                  If you disconnect your wallet, you'll need to reconnect it to continue trading. Your funds remain safe
                  in your wallet, and your trading history and settings will be preserved on Nexus Trade.
                </p>
              </div>
            </FadeIn>

            {/* FAQ Item 5 */}
            <FadeIn once={false} delay={0.5}>
              <div className="bg-dark/50 rounded-lg border border-gray-800 p-6 transition-all duration-300 hover:border-primary">
                <h3 className="text-lg font-bold text-white mb-3">Can I use multiple wallets with my account?</h3>
                <p className="text-gray-300">
                  Yes, you can connect multiple wallets to your Nexus Trade account. This allows you to manage your
                  assets across different wallets and use different wallets for different trading strategies.
                </p>
              </div>
            </FadeIn>

            {/* FAQ Item 6 */}
            <FadeIn once={false} delay={0.6}>
              <div className="bg-dark/50 rounded-lg border border-gray-800 p-6 transition-all duration-300 hover:border-primary">
                <h3 className="text-lg font-bold text-white mb-3">
                  What should I do if I encounter connection issues?
                </h3>
                <p className="text-gray-300">
                  If you're having trouble connecting your wallet, try refreshing the page, ensuring your wallet is
                  unlocked, or checking your internet connection. If issues persist, contact our support team for
                  assistance.
                </p>
              </div>
            </FadeIn>
          </div>

          <div className="text-center mt-12">
            <Link href="/faq">
              <AnimatedButton
                variant="outline"
                className="text-white border-white bg-gray-800 hover:bg-gray-700"
                whileHover={{ scale: 1.05 }}
              >
                View All FAQs
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="bg-dark py-12 md:py-20 px-4 relative overflow-hidden" ref={supportRef}>
        <FloatingElements count={8} className="opacity-10" />

        <div className="container mx-auto relative z-10">
          <FadeIn once={false}>
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
              Need <AnimatedGradientText>Help?</AnimatedGradientText>
            </h2>
          </FadeIn>

          <FadeIn delay={0.2} once={false}>
            <p className="text-gray-300 text-center max-w-2xl mx-auto mb-12">
              Our support team is available 24/7 to help you with any questions or issues you may have. Reach out to us
              through any of the channels below.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Support Channel 1 */}
            <FadeIn once={false} delay={0.3}>
              <div className="bg-dark-blue rounded-lg border border-gray-800 p-6 text-center transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Email Support</h3>
                <p className="text-gray-300 mb-4">Send us an email and we'll get back to you within 24 hours.</p>
                <a href="mailto:support@nexustrade.com" className="text-primary hover:underline">
                  support@nexustrade.com
                </a>
              </div>
            </FadeIn>

            {/* Support Channel 2 */}
            <FadeIn once={false} delay={0.4}>
              <div className="bg-dark-blue rounded-lg border border-gray-800 p-6 text-center transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Live Chat</h3>
                <p className="text-gray-300 mb-4">Chat with our support team in real-time for immediate assistance.</p>
                <button className="text-primary hover:underline">Start Chat</button>
              </div>
            </FadeIn>

            {/* Support Channel 3 */}
            <FadeIn once={false} delay={0.5}>
              <div className="bg-dark-blue rounded-lg border border-gray-800 p-6 text-center transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Community Forum</h3>
                <p className="text-gray-300 mb-4">
                  Join our community forum to get help from other users and our team.
                </p>
                <a href="#" className="text-primary hover:underline">
                  Visit Forum
                </a>
              </div>
            </FadeIn>
          </div>

          <div className="bg-dark/50 rounded-lg border border-gray-800 p-6 md:p-8">
            <h3 className="text-xl font-bold text-white mb-4 text-center">Contact Us</h3>
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    className="bg-gray-900 border-gray-800 text-white"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    className="bg-gray-900 border-gray-800 text-white"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-1">
                  Subject
                </label>
                <Input
                  id="subject"
                  type="text"
                  className="bg-gray-900 border-gray-800 text-white"
                  placeholder="Subject"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full rounded-md bg-gray-900 border border-gray-800 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your message"
                  required
                ></textarea>
              </div>
              <div className="text-center">
                <AnimatedButton
                  type="submit"
                  className="bg-primary text-dark hover:bg-blue-600 px-8"
                  whileHover={{ scale: 1.05 }}
                >
                  Send Message
                </AnimatedButton>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-cta-blue py-10 md:py-16 px-4 relative overflow-hidden">
        <AnimatedBackground variant="particles" color="dark" className="opacity-5" />

        <div className="container mx-auto text-center relative z-10">
          <FadeIn once={false}>
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-3 md:mb-4">Ready to start trading?</h2>
          </FadeIn>
          <FadeIn delay={0.2} once={false}>
            <p className="text-dark-blue mb-6 md:mb-8 text-sm md:text-base max-w-2xl mx-auto">
              Connect your wallet now and join thousands of traders on Nexus Trade. Experience the future of
              decentralized trading today.
            </p>
          </FadeIn>
          <FadeIn delay={0.4} once={false}>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <AnimatedButton
                className="bg-dark text-white hover:bg-secondary px-4 sm:px-8 py-2 sm:py-6 text-sm md:text-base"
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 15, 29, 0.5)" }}
              >
                <Link href="/sign-in">Login</Link>
              </AnimatedButton>
              <AnimatedButton
                variant="outline"
                className="border-dark text-dark hover:bg-light-blue px-4 sm:px-8 py-2 sm:py-6 text-sm md:text-base mt-3 sm:mt-0"
              >
                Learn More
              </AnimatedButton>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <section className="bg-dark py-10 md:py-12 px-4 relative overflow-hidden">
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
      </section>
    </main>
  )
}
