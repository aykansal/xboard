import { Github, Twitter, Linkedin } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="relative mt-24 pb-6 px-6">
      {/* Decorative pixel corners */}
      <div className="pixel-corner pixel-corner-tl" />
      <div className="pixel-corner pixel-corner-tr" />
      <div className="pixel-corner pixel-corner-bl" />
      <div className="pixel-corner pixel-corner-br" />

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Author credit with animated elements */}
          <div className="flex items-center space-x-2 animate-float">
            <span className="pixel-dot" />
            <p className="text-sm text-muted-foreground">
              Made with 💜 by{" "}
              <Link 
                href="https://x.com/aykansal" 
                target="_blank"
                className="pixel-link font-['Press_Start_2P'] text-xs"
              >
                Aykansal
              </Link>
            </p>
            <span className="pixel-dot" />
          </div>

          {/* Social links with hover animations */}
          <div className="flex items-center space-x-4">
            <Link
              href="https://github.com/aykansal"
              target="_blank"
              className="social-icon"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </Link>
            <Link
              href="https://x.com/aykansal"
              target="_blank"
              className="social-icon"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </Link>
            <Link
              href="https://linkedin.com/in/aykansal"
              target="_blank"
              className="social-icon"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 