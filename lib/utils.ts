import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function unescapeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.documentElement.textContent || html;
}

export function isFile(value: any) {
  return value instanceof File;
}