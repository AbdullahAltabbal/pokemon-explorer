export function setCookie(name: string, value: string, days: number) {
  let expires = ""
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = "; expires=" + date.toUTCString()
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/"
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null

  const nameEQ = name + "="
  const ca = document.cookie.split(";")
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === " ") c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

export function eraseCookie(name: string) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"
}

export function saveFavorites(favorites: string[]) {
  // Always save favorites, regardless of consent
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("pokemon-favorites", JSON.stringify(favorites))
    } catch (e) {
      console.error("Error saving favorites to localStorage:", e)
      // Fallback to cookies if localStorage fails
      setCookie("pokemon-favorites", JSON.stringify(favorites), 30)
    }
  }
}

export function loadFavorites(): string[] {
  if (typeof window === "undefined") return []

  try {
    // Try localStorage first
    const favoritesStr = localStorage.getItem("pokemon-favorites")
    if (favoritesStr) {
      return JSON.parse(favoritesStr)
    }

    // Fallback to cookies
    const cookieFavoritesStr = getCookie("pokemon-favorites")
    if (cookieFavoritesStr) {
      return JSON.parse(cookieFavoritesStr)
    }
  } catch (e) {
    console.error("Error loading favorites:", e)
  }

  return []
}

