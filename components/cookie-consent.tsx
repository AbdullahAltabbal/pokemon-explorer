"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { setCookie, getCookie } from "@/lib/cookies"

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice about cookies
    const hasConsented = getCookie("cookie-consent")
    if (hasConsented === null) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    setCookie("cookie-consent", "true", 365) // Set for 1 year
    setIsVisible(false)
  }

  const handleDecline = () => {
    setCookie("cookie-consent", "false", 365)
    setIsVisible(false)
  }

  const handleClose = () => {
    // Just closing without making a choice still sets a cookie to remember the banner was closed
    setCookie("cookie-consent", "false", 365)
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-background border-t shadow-lg"
        >
          <div className="container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">Cookie Consent</h3>
              <p className="text-sm text-muted-foreground">
                We use cookies to enhance your experience and store your favorite Pokémon. Do you consent to our use of
                cookies?
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleAccept} size="sm">
                Accept
              </Button>
              <Button onClick={handleDecline} variant="outline" size="sm">
                Decline
              </Button>
              <Button variant="ghost" size="icon" onClick={handleClose} className="sm:hidden" aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

