"use client"

import Link from "next/link"

export const Header = () => {
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    window.location.href = "/"
  }

  return (
    <div className="fixed z-50 pt-8 md:pt-14 top-0 left-0 w-full">
      <header className="flex items-center justify-between container">
        <Link href="/" onClick={handleLogoClick}>
          <div className="text-2xl font-bold text-white font-sentient">Merlin</div>
        </Link>
      </header>
    </div>
  )
}
