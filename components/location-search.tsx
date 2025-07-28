"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import debounce from "lodash.debounce"
import type { OpenStreetMapProvider } from "leaflet-geosearch"

// Define the structure of OpenStreetMap's raw response
interface OpenStreetMapRaw {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  lat: string
  lon: string
  class: string
  type: string
  place_rank: number
  importance: number
  addresstype: string
  name: string
  display_name: string
  address: {
    house_number?: string
    road?: string
    neighbourhood?: string
    suburb?: string
    city?: string
    county?: string
    state?: string
    postcode?: string
    country?: string
    country_code?: string
  }
  boundingbox: [string, string, string, string]
}

// Define the search result structure from leaflet-geosearch
interface GeosearchResult {
  x: number
  y: number
  label: string
  bounds: [[number, number], [number, number]] | null
  raw: OpenStreetMapRaw
}

interface LocationData {
  x: number
  y: number
  label: string
  bounds: [[number, number], [number, number]] | null
  raw: OpenStreetMapRaw
}

interface LocationSearchInputProps {
  onSelect: (location: LocationData) => void
  className?: string
  placeholder?: string
  value?: string
}

export default function LocationSearchInput({
  onSelect,
  className,
  placeholder = "What is your location",
  value: propValue = "",
}: LocationSearchInputProps) {
  const [query, setQuery] = useState(propValue)
  const [results, setResults] = useState<LocationData[]>([])
  const hasSelectedRef = useRef(false)
  const [provider, setProvider] = useState<OpenStreetMapProvider | null>(null)

  // Sync internal state with external value prop
  useEffect(() => {
    setQuery(propValue)
  }, [propValue])

  useEffect(() => {
    const initProvider = async () => {
      try {
        const { OpenStreetMapProvider } = await import("leaflet-geosearch")
        const browserLanguages = navigator.languages ? navigator.languages.join(",") : navigator.language || "en"

        const newProvider = new OpenStreetMapProvider({
          params: {
            "accept-language": browserLanguages,
            addressdetails: 1,
            limit: 10,
          },
        })
        setProvider(newProvider)
      } catch (error) {
        console.error("Failed to initialize geosearch provider:", error)
      }
    }

    initProvider()
  }, [])

  const searchLocations = debounce(async (value: string) => {
    if (!provider || !value || hasSelectedRef.current) {
      hasSelectedRef.current = false
      return setResults([])
    }

    try {
      const searchResults = (await provider.search({ query: value })) as unknown as GeosearchResult[]

      // Remove duplicates based on display_name and properly type the results
      const uniqueResults = Array.from(
        new Map(searchResults.map((item) => [item.raw.display_name, item])).values(),
      ).map(
        (item): LocationData => ({
          x: item.x,
          y: item.y,
          label: item.label,
          bounds: item.bounds,
          raw: item.raw,
        }),
      )

      setResults(uniqueResults)
    } catch (err) {
      console.error("GeoSearch error", err)
    }
  }, 400)

  useEffect(() => {
    if (provider) {
      searchLocations(query)
    }
    return () => searchLocations.cancel()
  }, [query, provider])

  const handleSelect = (item: LocationData) => {
    hasSelectedRef.current = true
    setQuery(item.label) // Use the full label as shown in the menu
    onSelect(item)
    setResults([])

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }

  return (
    <div className={cn("relative w-full", className)}>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-200 mt-1 w-full rounded shadow-md lg:max-h-42 xl:max-h-[200px] overflow-auto">
          {results.map((item, idx) => {
            return (
              <li
                key={`${item.raw.place_id}-${idx}`}
                onClick={() => handleSelect(item)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                <div className="font-semibold text-sm text-gray-800">{item.label}</div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}