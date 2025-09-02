/**
 * Cookie utility functions for secure cookie handling
 * Used by AdminAuthContext to manage HttpOnly cookies
 */

interface CookieOptions {
  path?: string;
  domain?: string;
  maxAge?: number;
  expires?: Date;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Get a cookie value by name
 * @param name Cookie name
 * @returns Cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    // Check if this cookie string begins with the name we want
    if (cookie.startsWith(name + '=')) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
}

/**
 * Set a cookie with the provided options
 * @param name Cookie name
 * @param value Cookie value
 * @param options Cookie options
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof document === 'undefined') return;
  
  const {
    path = '/',
    domain,
    maxAge,
    expires,
    secure = false,
    sameSite = 'lax'
  } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
  if (path) cookieString += `; path=${path}`;
  if (domain) cookieString += `; domain=${domain}`;
  if (maxAge) cookieString += `; max-age=${maxAge}`;
  if (expires) cookieString += `; expires=${expires.toUTCString()}`;
  if (secure) cookieString += '; secure';
  if (sameSite) cookieString += `; samesite=${sameSite}`;
  
  document.cookie = cookieString;
}

/**
 * Delete a cookie by setting its expiration to the past
 * @param name Cookie name
 * @param path Cookie path (must match the path used when setting)
 * @param domain Cookie domain (must match the domain used when setting)
 */
export function deleteCookie(name: string, path: string = '/', domain?: string): void {
  if (typeof document === 'undefined') return;
  
  // Set expiration to a date in the past
  let cookieString = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  
  if (path) cookieString += `; path=${path}`;
  if (domain) cookieString += `; domain=${domain}`;
  
  document.cookie = cookieString;
}
