'use client';

import React, { useState, useCallback } from 'react';
import { GeocodeResult } from '../types';
import { locationApi } from '../api';
import styles from './LocationPicker.module.css';

interface LocationPickerProps {
  onLocationSelect: (location: GeocodeResult) => void;
  initialValue?: string;
  placeholder?: string;
}

export default function LocationPicker({ 
  onLocationSelect, 
  initialValue = '', 
  placeholder = 'Tìm kiếm địa điểm...' 
}: LocationPickerProps) {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchPlaces = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const places = await locationApi.searchPlaces(searchQuery);
      setResults(places);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching places:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    searchPlaces(value);
  };

  const handleSelectLocation = (location: GeocodeResult) => {
    setQuery(location.address);
    setResults([]);
    setShowResults(false);
    onLocationSelect(location);
  };

  const handleInputBlur = () => {
    // Delay hiding results to allow click on result items
    setTimeout(() => setShowResults(false), 200);
  };

  return (
    <div className={styles.locationPicker}>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowResults(results.length > 0)}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className={styles.searchInput}
        />
        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className={styles.resultsContainer}>
          <div className={styles.resultsList}>
            {results.map((result, index) => (
              <div
                key={index}
                className={styles.resultItem}
                onClick={() => handleSelectLocation(result)}
              >
                <div className={styles.resultIcon}>📍</div>
                <div className={styles.resultContent}>
                  <div className={styles.resultName}>{result.name}</div>
                  <div className={styles.resultAddress}>{result.address}</div>
                  <div className={styles.resultCoords}>
                    {result.latitude.toFixed(6)}, {result.longitude.toFixed(6)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}