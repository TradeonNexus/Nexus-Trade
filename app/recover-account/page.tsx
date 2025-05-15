"use client"
import { motion } from "framer-motion"
import { NexusLogo } from "@/components/nexus-logo"
import Link from "next/link"

export default function RecoverAccountPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <NexusLogo size="lg" withLink={false} />
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-white mb-2 text-center"
      >
        Don't worry, we've got you
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-gray-400 mb-8 text-center"
      >
        Gain unrestricted access back to your account in few steps
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="w-full max-w-md bg-gray-900 rounded-lg p-8"
      >
        <h2 className="text-white text-xl mb-6 text-center">Verify with:</h2>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-blue-300 text-gray-900 py-3 rounded-md font-medium mb-4"
        >
          Email & Questions
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gray-800 text-white py-3 rounded-md font-medium"
        >
          Trusted Contacts
        </motion.button>

        <div className="mt-6 text-center">
          <Link href="/sign-in" className="text-blue-400 hover:underline text-sm">
            Back to Sign-in
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
