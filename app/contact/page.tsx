"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Mail, MapPin, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { AnimatedGradientText } from "@/components/animations/animated-gradient-text"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerChildren } from "@/components/animations/stagger-children"
import { AnimatedBackground } from "@/components/animations/animated-background"
import { FloatingElements } from "@/components/animations/floating-elements"
import { useWallet } from "@/contexts/wallet-context"

export default function ContactPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { isConnected, connect } = useWallet()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required"
    if (!formData.message.trim()) newErrors.message = "Message is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Message sent successfully!",
      description: "We'll get back to you as soon as possible.",
      variant: "default",
    })

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    })

    setIsSubmitting(false)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <AnimatedBackground />
      <FloatingElements />

      <div className="container relative z-10 mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute right-4 top-4 z-20 md:right-8 md:top-8">
          {!isConnected ? (
            <Button
              onClick={connect}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            >
              Connect Wallet
            </Button>
          ) : (
            <Button
              onClick={() => router.push("/trading")}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            >
              Go to Trading
            </Button>
          )}
        </div>

        <nav className="mb-8 flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="Nexus Trade Logo" width={40} height={40} />
            <span className="text-xl font-bold">Nexus Trade</span>
          </Link>

          <div className="hidden space-x-6 md:flex">
            <Link href="/" className="text-gray-300 transition-colors hover:text-white">
              Home
            </Link>
            <Link href="/about" className="text-gray-300 transition-colors hover:text-white">
              About
            </Link>
            <Link href="/trading" className="text-gray-300 transition-colors hover:text-white">
              Trading
            </Link>
            <Link href="/get-connected" className="text-gray-300 transition-colors hover:text-white">
              Get Connected
            </Link>
            <Link href="/contact" className="text-white font-medium">
              Contact
            </Link>
          </div>
        </nav>

        <FadeIn>
          <div className="mb-12 text-center">
            <AnimatedGradientText className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">
              Get in Touch
            </AnimatedGradientText>
            <p className="mx-auto max-w-2xl text-lg text-gray-300">
              Have questions about Nexus Trade? Our team is here to help you with anything you need.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-12 md:grid-cols-2">
          <StaggerChildren className="space-y-8">
            <motion.div
              className="rounded-xl bg-gray-900/50 p-6 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600/20">
                <MessageSquare className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Chat Support</h3>
              <p className="text-gray-400">
                Our support team is available 24/7 to assist you with any questions or issues.
              </p>
              <Button variant="link" className="mt-2 p-0 text-purple-400">
                Start a chat <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div
              className="rounded-xl bg-gray-900/50 p-6 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/20">
                <Mail className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Email Us</h3>
              <p className="text-gray-400">Send us an email and we'll get back to you within 24 hours.</p>
              <a href="mailto:support@nexustrade.io" className="mt-2 inline-flex items-center text-blue-400">
                support@nexustrade.io <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </motion.div>

            <motion.div
              className="rounded-xl bg-gray-900/50 p-6 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-600/20">
                <MapPin className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Visit Us</h3>
              <p className="text-gray-400">Our headquarters are located in the heart of the financial district.</p>
              <address className="mt-2 not-italic text-green-400">123 Blockchain Avenue, Crypto City, CC 10101</address>
            </motion.div>
          </StaggerChildren>

          <motion.div
            className="rounded-xl bg-gray-900/50 p-8 backdrop-blur-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="mb-6 text-2xl font-bold">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium">
                  Your Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`bg-gray-800 border-gray-700 ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={`bg-gray-800 border-gray-700 ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="subject" className="mb-1 block text-sm font-medium">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className={`bg-gray-800 border-gray-700 ${errors.subject ? "border-red-500" : ""}`}
                />
                {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
              </div>

              <div>
                <label htmlFor="message" className="mb-1 block text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us more about your inquiry..."
                  className={`w-full rounded-md border bg-gray-800 border-gray-700 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.message ? "border-red-500" : ""}`}
                />
                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </motion.div>
        </div>

        <div className="mt-20">
          <h3 className="mb-6 text-center text-2xl font-bold">Follow Us</h3>
          <div className="flex justify-center space-x-6">
            {["Twitter", "Discord", "Telegram", "LinkedIn"].map((platform) => (
              <motion.a
                key={platform}
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {platform.charAt(0)}
              </motion.a>
            ))}
          </div>
        </div>

        <footer className="mt-20 border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Nexus Trade. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4 text-sm">
            <Link href="#" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-white">
              Cookie Policy
            </Link>
          </div>
        </footer>
      </div>
    </main>
  )
}
