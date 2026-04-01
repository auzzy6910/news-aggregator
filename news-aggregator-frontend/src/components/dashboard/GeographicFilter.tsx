import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronRight, Globe, X } from 'lucide-react';
import { locationTree } from '../../data/mockData';
import { LocationNode } from '../../types';

interface GeographicFilterProps {
  selectedCountry: string | null;
  selectedRegion: string | null;
  onCountryChange: (country: string | null) => void;
  onRegionChange: (region: string | null) => void;
}

export default function GeographicFilter({
  selectedCountry,
  selectedRegion,
  onCountryChange,
  onRegionChange,
}: GeographicFilterProps) {
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);

  const handleCountryClick = (country: LocationNode) => {
    if (expandedCountry === country.name) {
      setExpandedCountry(null);
    } else {
      setExpandedCountry(country.name);
    }
    onCountryChange(country.name);
    onRegionChange(null);
  };

  const handleRegionClick = (region: LocationNode) => {
    onRegionChange(region.name);
  };

  const clearFilter = () => {
    onCountryChange(null);
    onRegionChange(null);
    setExpandedCountry(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card rounded p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-orange-500" />
          <h3 className="text-sm font-semibold text-gray-900">Geographic Filter</h3>
        </div>
        {(selectedCountry || selectedRegion) && (
          <button
            onClick={clearFilter}
            className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Active filter display */}
      {selectedCountry && (
        <div className="flex items-center gap-1.5 mb-3 text-xs">
          <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded font-medium border border-orange-200">
            {selectedCountry}
          </span>
          {selectedRegion && (
            <>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded font-medium border border-orange-200">
                {selectedRegion}
              </span>
            </>
          )}
        </div>
      )}

      {/* Country list */}
      <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
        {locationTree.map((country) => (
          <div key={country.code}>
            <button
              onClick={() => handleCountryClick(country)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-all ${
                selectedCountry === country.name
                  ? 'bg-orange-50 text-orange-600 border border-orange-200'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                {country.name}
              </span>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform ${
                  expandedCountry === country.name ? 'rotate-90' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {expandedCountry === country.name && country.children && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pl-6 py-1 space-y-0.5">
                    {country.children.map((region) => (
                      <button
                        key={region.code}
                        onClick={() => handleRegionClick(region)}
                        className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
                          selectedRegion === region.name
                            ? 'bg-orange-50 text-orange-700 font-medium border border-orange-200'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-gray-400" />
                          {region.name}
                          <span className="text-gray-400 capitalize">({region.type})</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
