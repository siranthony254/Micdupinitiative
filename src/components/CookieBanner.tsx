"use client"

import CookieConsent from "react-cookie-consent"

export default function CookieBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept All"
      declineButtonText="Reject All"
      enableDeclineButton
      cookieName="mui_cookie_consent"
      style={{
        background: "#000000",
        borderTop: "1px solid #333",
      }}
      buttonStyle={{
        background: "#f59e0b",
        color: "#000",
        fontWeight: "bold",
        borderRadius: "6px",
        padding: "10px 18px",
      }}
      declineButtonStyle={{
        background: "#333",
        color: "#fff",
        borderRadius: "6px",
        padding: "10px 18px",
      }}
      expires={150}
    >
      This website uses cookies to improve your experience and analyze site
      traffic. You can choose to accept or reject non-essential cookies.
    </CookieConsent>
  )
}