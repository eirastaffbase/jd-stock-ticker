/*!
 * Copyright 2024, Staffbase GmbH and contributors.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { ReactElement, useEffect, useState } from "react";
import { BlockAttributes } from "widget-sdk"; // Assuming this is from your environment
import { useContainerSize } from "./useContainerSize"; // Assuming this is a custom hook

/* ------------------------------------------------------------------ */
/* ▸ Config                                                            */
/* ------------------------------------------------------------------ */
const JD_API_KEY   = "60C38A34CD4D4513BF1C02B863204993";
const JD_ENDPOINT  =
  `https://deere2017ir.q4web.com/feed/StockQuote.svc/GetStockQuoteList`;
const JD_SYMBOL    = "DE";
const JD_NAME      = "Deere & Company";
const JD_LOGO_FALLBACK =
  "https://jdonline.staffbase.com/api/media/secure/external/v2/image/upload/680a642ac83d6e736cfc366c.png";

/* ------------------------------------------------------------------ */
/* ▸ Props                                                             */
/* ------------------------------------------------------------------ */
export interface JDStockTickerProps extends BlockAttributes {
  /** Optional override for logo URL */
  logo?: string;
  /** Percentage to adjust font size, e.g., 0 for default, 10 for 10% larger */
  fontsizeadjustment?: number;
}



/* ------------------------------------------------------------------ */
/* ▸ Component                                                         */
/* ------------------------------------------------------------------ */
export const JDStockTicker = ({
  logo: customLogo, // Renamed to avoid conflict with local 'logo' variable if any
  fontsizeadjustment = 0, // Default to 0% adjustment
}: JDStockTickerProps): ReactElement => {
  /* size-aware container -------------------------------------------- */
  const [containerRef, size] = useContainerSize<HTMLDivElement>();
  // Responsive adjustments (can be tied to font size later if needed)
  const isMid   = size.width < 350;
  const isSmall = size.width < 295;

  const logoSize = isSmall ? 35 : isMid ? 40 : 50; // Responsive logo container size



  /* state ----------------------------------------------------------- */
  const [price, setPrice]         = useState<number | null>(null);
  // const [prevClose, setPrevClose] = useState<number | null>(null); // Not directly used in display
  const [change, setChange]       = useState<number | null>(null);
  const [pct, setPct]             = useState<number | null>(null);
  const [loading, setLoading]     = useState<boolean>(false);
  const [error, setError]         = useState<string | null>(null);

  /* data fetch ------------------------------------------------------ */
  useEffect(() => {
    const fetchQuote = async () => {
      setLoading(true);
      setError(null);
      try {
        const url =
          `${JD_ENDPOINT}?apiKey=${JD_API_KEY}&exchange=NYSE&symbol=${JD_SYMBOL}&pageSize=1`;
        const res  = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const quote = json?.GetStockQuoteListResult?.[0];
        if (!quote) throw new Error("Empty response");
        setPrice(+quote.TradePrice);
        // setPrevClose(+quote.PreviousClose);
        setChange(+quote.Change);
        setPct(+quote.PercChange);
      } catch (e: any) {
        console.error("JD Stock Ticker:", e);
        setError("Couldn’t load quote");
      } finally {
        setLoading(false);
      }
    };
    fetchQuote();
  }, []);

  /* helpers --------------------------------------------------------- */
  const up = (change ?? 0) >= 0;
  const containerClasses = [
    "jd-stockticker",
    isSmall ? "jd-stockticker--sm" : isMid ? "jd-stockticker--md" : "",
    up ? "is-up" : "is-down",
    loading ? "is-loading" : "",
    error ? "is-error" : "",
  ]
    .filter(Boolean)
    .join(" ");

  /* Font Size Calculation ------------------------------------------- */
  const calculateFontSize = (baseSizeInEm: number): string => {
    const adjustedSize = baseSizeInEm * (1 + (fontsizeadjustment / 100));
    return `${adjustedSize}em`;
  };

  /* Styles ---------------------------------------------------------- */
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between", // Ensures price info is pushed to the right
      fontFamily: "Arial, sans-serif",
      padding: "0.5rem", // Similar to example's padding
      width: "100%",
      boxSizing: "border-box",
      minHeight: "70px", // Adjusted min height
      fontSize: "1rem", // Base font size for em calculations
    },
    logoContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: `${logoSize}px`,
      height: `${logoSize}px`,
      borderRadius: "50%",
      overflow: "hidden",
      backgroundColor: "#efefef", // Fallback background for logo area
      flexShrink: 0,
      marginRight: "12px", // Space between logo and company info
    },
    logoImage: {
      maxWidth: "75%", // Image will be smaller than its circular container
      maxHeight: "75%",
      display: "block",
      objectFit: "contain", // Use contain to ensure full logo is visible
    },
    companyInfoContainer: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1, // Allows this section to take available space
      textAlign: "left",
      minWidth: "100px", // Prevents excessive shrinking
      marginRight: "12px", // Space between company info and price
    },
    symbol: {
      fontSize: calculateFontSize(1.1), // Base: 1.1em
      fontWeight: "bold",
      margin: "0 0 2px 0",
      lineHeight: "1.2",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    companyName: {
      fontSize: calculateFontSize(0.85), // Base: 0.85em
      color: "#555",
      margin: "0",
      lineHeight: "1.2",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    priceInfoContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end", // Align text to the right
      flexShrink: 0, // Prevent shrinking
      textAlign: "right",
    },
    currentPrice: {
      fontSize: calculateFontSize(1.15), // Base: 1.15em
      fontWeight: "bold",
      lineHeight: "1.3",
      marginBottom: "2px",
    },
    priceChange: {
      fontSize: calculateFontSize(0.9), // Base: 0.9em
      color: up ? "green" : "red",
      lineHeight: "1.3",
    },
    loadingErrorText: {
      fontSize: calculateFontSize(0.9), // Base: 0.9em
      color: "#777",
      textAlign: "right", // Ensure it aligns with price info
    },
  };

  console.log('hi');
  console.log('JDStockTicker received fontsizeadjustment:', fontsizeadjustment, '| Type:', typeof fontsizeadjustment);
  

  /* render ---------------------------------------------------------- */
  return (
    <div ref={containerRef} className={containerClasses} style={styles.container}>
      {/* Logo -------------------------------------------------------- */}
      <div className="jd-stockticker__logo-wrapper" style={styles.logoContainer}>
        <img
          className="jd-stockticker__logo-image"
          src={customLogo || JD_LOGO_FALLBACK}
          alt={`${JD_NAME} logo`}
          loading="lazy"
          style={styles.logoImage}
        />
      </div>

      {/* Company Info (Symbol and Name) --------------------------------- */}
      <div className="jd-stockticker__company-info" style={styles.companyInfoContainer}>
        <h2 className="jd-stockticker__symbol" style={styles.symbol}>{JD_SYMBOL}</h2>
        <p  className="jd-stockticker__name" style={styles.companyName}>{JD_NAME}</p>
      </div>

      {/* Price Info ------------------------------------------------------- */}
      <div className="jd-stockticker__price-info" style={styles.priceInfoContainer}>
        {loading && (
          <span className="jd-stockticker__loading" style={styles.loadingErrorText}>
            Loading…
          </span>
        )}
        {error && (
          <span className="jd-stockticker__error" style={styles.loadingErrorText}>
            {error}
          </span>
        )}
        {!loading && !error && price !== null && (
          <>
            <div className="jd-stockticker__price-current" style={styles.currentPrice}>
              ${price.toFixed(2)}
            </div>
            {change !== null && pct !== null && (
              <div
                className="jd-stockticker__price-change"
                style={styles.priceChange}
              >
                {up ? "▲" : "▼"}
                {Math.abs(change).toFixed(2)} ({up ? "+" : ""}
                {pct.toFixed(2)}%)
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};