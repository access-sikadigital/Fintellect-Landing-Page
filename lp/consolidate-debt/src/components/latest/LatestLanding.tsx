/* eslint-disable @next/next/no-img-element */
import { MobileCta } from "@/components/layout/MobileCta";
import { QuizLink } from "@/components/original/QuizLink";
import { LatestQuiz } from "./LatestQuiz";
import { LatestFooter } from "./FunnelChrome";
import "./latest.css";

/**
 * Consolidate Debt landing page. Same design, layout and markup as the ATO debt page (repo root,
 * FIN-01 LATEST static design); only the words, the quiz and the theme images are changed.
 * Copy source: Google Doc "Fintellect – Business Lending Landing Pages & Quizzes", tab "6. Consolidate Debt",
 * restructured into the ATO page's sections. Its <style> blocks live in latest.css.
 * Additions: Lenis smooth scrolling (layout), quiz step transitions with height easing, links to the quiz glide
 * there, the phones-only sticky call-to-action, and the quiz posts to /api/lead (GoHighLevel webhook).
 */
export function LatestLanding() {
  return (
    <div className="fl-latest" style={{ fontFamily: "var(--font-inter), Inter, -apple-system, 'Segoe UI', Roboto, sans-serif", color: "#012412", background: "#FBFEEE", fontSize: "17px", lineHeight: "1.55", overflowX: "hidden" }}>
    
      {/* HERO */}
      <section style={{ position: "relative", background: "#012412", color: "#FBFEEE", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", top: "0", left: "0", right: "0", height: "920px", overflow: "hidden" }}>
          <img src="/images/lp/hero-debts.jpg" alt="" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 45%" }} />
          <div style={{ position: "absolute", left: "0", right: "0", bottom: "0", height: "220px", background: "linear-gradient(transparent, #012412)" }}></div>
        </div>
        <div aria-hidden="true" style={{ position: "absolute", inset: "0", background: "linear-gradient(90deg, #012412 0%, rgba(1,36,18,.94) 38%, rgba(1,36,18,.72) 70%, rgba(1,36,18,.55) 100%)" }}></div>
        <div aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: "0", height: "160px", background: "linear-gradient(transparent, #012412)" }}></div>
        <svg aria-hidden="true" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "900px", opacity: ".14" }}>
          <g fill="none" stroke="#9FD3A8" strokeWidth="1">
            <path d="M-50 720 C 200 640, 380 780, 640 700 S 1100 560, 1500 640"></path>
            <path d="M-50 680 C 200 600, 380 740, 640 660 S 1100 520, 1500 600"></path>
            <path d="M-50 640 C 210 560, 390 700, 650 620 S 1110 480, 1500 560"></path>
            <path d="M-50 600 C 220 520, 400 660, 660 580 S 1120 440, 1500 520"></path>
            <path d="M-50 560 C 230 480, 410 620, 670 540 S 1130 400, 1500 480"></path>
            <path d="M-50 520 C 240 440, 420 580, 680 500 S 1140 360, 1500 440"></path>
            <path d="M-50 480 C 250 400, 430 540, 690 460 S 1150 320, 1500 400"></path>
            <path d="M-50 440 C 260 360, 440 500, 700 420 S 1160 280, 1500 360"></path>
            <path d="M-50 400 C 270 320, 450 460, 710 380 S 1170 240, 1500 320"></path>
            <path d="M-50 360 C 280 280, 460 420, 720 340 S 1180 200, 1500 280"></path>
          </g>
        </svg>
    
        <header style={{ position: "relative", padding: "0 24px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", minHeight: "72px", padding: "12px 0", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", borderBottom: "1px solid rgba(226,230,209,.12)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src="/images/lp/logo-fintellect-white.png" alt="Fintellect" style={{ display: "block", height: "16px", width: "auto", maxWidth: "60vw" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "22px", flexWrap: "wrap", justifyContent: "flex-end" }}>
              <span className="fl-acl" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#E2E6D1" }}><span className="fl-live" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#9FD3A8" }}></span>Licensed broker · ACL 515382</span>
              <QuizLink className="fl-btn fl-btn-light fl-hdr-btn" style={{ background: "#FBFEEE", color: "#012412", textDecoration: "none", fontWeight: "600", fontSize: "15px", padding: "11px 20px", borderRadius: "999px", whiteSpace: "nowrap" }}>Apply to speak with a broker</QuizLink>
            </div>
          </div>
        </header>
    
        <div className="fl-hero-row" style={{ position: "relative", maxWidth: "1200px", margin: "0 auto", padding: "clamp(32px, 6vw, 72px) 20px clamp(64px, 9vw, 120px)", display: "flex", flexWrap: "wrap", gap: "clamp(36px, 5vw, 64px)", alignItems: "center" }}>
          <div className="fl-hero-copy" style={{ flex: "1 1 500px", minWidth: "0" }}>
            <div className="fl-up" style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "rgba(159,211,168,.12)", border: "1px solid rgba(159,211,168,.3)", color: "#fbfeee", fontSize: "14px", fontWeight: "600", padding: "7px 14px 7px 8px", borderRadius: "999px", marginBottom: "28px" }}>
              <span style={{ background: "#C62828", color: "#FFFFFF", fontSize: "12px", fontWeight: "700", padding: "3px 9px", borderRadius: "999px", whiteSpace: "nowrap" }}>One loan</span>
              Short-term loans, cards, overdraft and ATO debt
            </div>
            <h1 className="fl-up fl-d1" style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: "600", fontSize: "clamp(40px, 4.6vw, 64px)", lineHeight: "1.04", letterSpacing: "-0.025em", margin: "0 0 26px" }}>Five lenders, five due dates. <em style={{ fontStyle: "normal", fontWeight: "inherit", color: "#9FD3A8" }}>Make it one.</em></h1>
            <p className="fl-up fl-d2" style={{ fontSize: "19px", lineHeight: "1.6", color: "#E2E6D1", margin: "0 0 36px", maxWidth: "560px" }}>Roll short-term loans, cards, the overdraft and old finance into one repayment you can plan around. Answer a few quick questions, and we&apos;ll tell you what&apos;s possible.</p>
            <div className="fl-up fl-d3" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px", maxWidth: "560px" }}>
              <div style={{ border: "1px solid #E2E6D1", borderRadius: "14px", padding: "12px 12px", background: "#FBFEEE" }}>
                <div style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: "clamp(22px, 5.6vw, 30px)", fontWeight: "700", color: "#206943", lineHeight: "1.1" }}>40+</div>
                <div style={{ fontSize: "12.5px", lineHeight: "1.35", color: "#4b5b52" }}>lenders compared</div>
              </div>
              <div style={{ border: "1px solid #E2E6D1", borderRadius: "14px", padding: "12px 12px", background: "#FBFEEE" }}>
                <div style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: "clamp(22px, 5.6vw, 30px)", fontWeight: "700", color: "#206943", lineHeight: "1.1" }}>1</div>
                <div style={{ fontSize: "12.5px", lineHeight: "1.35", color: "#4b5b52" }}>broker, start to finish</div>
              </div>
              <div style={{ border: "1px solid #E2E6D1", borderRadius: "14px", padding: "12px 12px", background: "#FBFEEE" }}>
                <div style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: "clamp(22px, 5.6vw, 30px)", fontWeight: "700", color: "#206943", lineHeight: "1.1" }}>2 min</div>
                <div style={{ fontSize: "12.5px", lineHeight: "1.35", color: "#4b5b52" }}>to check your options</div>
              </div>
            </div>
            <div className="fl-up fl-d3" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "12px", maxWidth: "560px", marginTop: "14px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", border: "1px solid rgba(159,211,168,.35)", background: "rgba(1,36,18,.55)", borderRadius: "14px", padding: "14px 16px" }}>
                <div style={{ flex: "0 0 36px", height: "36px", borderRadius: "10px", background: "rgba(159,211,168,.14)", display: "flex", alignItems: "center", justifyContent: "center" }}><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9FD3A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5"></path><path d="M5 9.5V21h14V9.5"></path><path d="M10 21v-6h4v6"></path></svg></div>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "15.5px", color: "#FBFEEE", lineHeight: "1.3" }}>Own property?</div>
                  <div style={{ fontSize: "14px", lineHeight: "1.45", color: "#E2E6D1", marginTop: "3px" }}>Use your equity for longer terms and more lenders.</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", border: "1px solid rgba(159,211,168,.35)", background: "rgba(1,36,18,.55)", borderRadius: "14px", padding: "14px 16px" }}>
                <div style={{ flex: "0 0 36px", height: "36px", borderRadius: "10px", background: "rgba(159,211,168,.14)", display: "flex", alignItems: "center", justifyContent: "center" }}><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9FD3A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"></rect><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path><path d="M3 13h18"></path></svg></div>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "15.5px", color: "#FBFEEE", lineHeight: "1.3" }}>No property?</div>
                  <div style={{ fontSize: "14px", lineHeight: "1.45", color: "#E2E6D1", marginTop: "3px" }}>Unsecured and low-doc business loans are still an option.</div>
                </div>
              </div>
            </div>
          </div>
    
          {/* QUIZ (live Consolidate Debt quiz) */}
          <div className="fl-up fl-d2 fl-hero-quiz" style={{ position: "relative", flex: "1 1 440px", maxWidth: "520px", minWidth: "0" }}>
    <div id="quiz" style={{ position: "relative", color: "#012412", borderRadius: "22px", boxShadow: "0 30px 70px rgba(0,0,0,.4)" }}>
    <LatestQuiz />
    </div>
    </div>
        </div>
      </section>
    
      {/* TRUST STRIP */}
      <section style={{ background: "#206943", color: "#FBFEEE", padding: "36px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", fontSize: "17.5px", fontWeight: "700", lineHeight: "1.3" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "16px", background: "rgba(1,36,18,.35)", border: "1px solid rgba(207,233,201,.35)", borderRadius: "16px", padding: "18px 20px" }}><span style={{ flex: "0 0 48px", height: "48px", borderRadius: "12px", background: "#F4FAEE", display: "flex", alignItems: "center", justifyContent: "center" }}><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#206943" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"></path><path d="M5 21V10l7-5 7 5v11"></path><path d="M9 21v-6h6v6"></path></svg></span>Banks, non-banks and specialist lenders</span>
          <span style={{ display: "flex", alignItems: "center", gap: "16px", background: "rgba(1,36,18,.35)", border: "1px solid rgba(207,233,201,.35)", borderRadius: "16px", padding: "18px 20px" }}><span style={{ flex: "0 0 48px", height: "48px", borderRadius: "12px", background: "#F4FAEE", display: "flex", alignItems: "center", justifyContent: "center" }}><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#206943" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v12H5l-1 4z"></path></svg></span>Alt-doc and low-doc options</span>
          <span style={{ display: "flex", alignItems: "center", gap: "16px", background: "rgba(1,36,18,.35)", border: "1px solid rgba(207,233,201,.35)", borderRadius: "16px", padding: "18px 20px" }}><span style={{ flex: "0 0 48px", height: "48px", borderRadius: "12px", background: "#F4FAEE", display: "flex", alignItems: "center", justifyContent: "center" }}><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#206943" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg></span>Fintel Group (VIC) Pty Ltd · ACL 515382</span>
        </div>
      </section>
    
      {/* HOW IT WORKS */}
      
    
      {/* CASE STUDY */}
      <section style={{ padding: "clamp(64px, 9vw, 112px) 20px", background: "#FFFFFF" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "24px 40px", margin: "-24px auto clamp(48px, 6vw, 72px)" }}>
              <img loading="lazy" decoding="async" src="/images/lp/badge-ama-excellence.png" alt="Australian Mortgage Awards excellence awardee" style={{ display: "block", height: "clamp(68px, 12vw, 96px)", width: "auto", filter: "drop-shadow(0 6px 14px rgba(1,36,18,.12))" }} />
              <img loading="lazy" decoding="async" src="/images/lp/badge-award-winning.png" alt="Award-winning mortgage broker" style={{ display: "block", height: "clamp(68px, 12vw, 96px)", width: "auto", filter: "drop-shadow(0 6px 14px rgba(1,36,18,.12))" }} />
              <img loading="lazy" decoding="async" src="/images/lp/badge-top-25.png" alt="Top 25 brokerage" style={{ display: "block", height: "clamp(68px, 12vw, 96px)", width: "auto", filter: "drop-shadow(0 6px 14px rgba(1,36,18,.12))" }} />
          </div>
          <div style={{ maxWidth: "760px", margin: "0 auto 56px", textAlign: "center" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "700", letterSpacing: ".12em", textTransform: "uppercase", color: "#206943", marginBottom: "14px" }}>How it works</div>
              <h2 style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: "600", fontSize: "clamp(34px, 4vw, 52px)", lineHeight: "1.05", letterSpacing: "-0.02em", margin: "0" }}>How business debt consolidation <em style={{ fontStyle: "normal", fontWeight: "inherit", color: "#206943" }}>actually works.</em></h2>
            </div>
            <p style={{ fontSize: "18px", color: "#4b5b52", margin: "16px auto 0", maxWidth: "560px" }}>Four steps to one repayment.</p>
          </div>
          <div className="fl-imgwrap" style={{ position: "relative", borderRadius: "26px", overflow: "hidden", height: "clamp(220px, 32vw, 380px)", marginBottom: "clamp(40px, 5vw, 64px)", boxShadow: "0 24px 60px rgba(1,36,18,.14)" }}>
            <img className="fl-img" src="/images/lp/how-it-works-handshake.jpg" alt="Business owner shaking hands on a finance agreement" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 55%" }} />
            <div style={{ position: "absolute", left: "24px", bottom: "24px", right: "24px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
              <span style={{ background: "rgba(1,36,18,.88)", color: "#FBFEEE", fontSize: "14px", fontWeight: "600", padding: "10px 16px", borderRadius: "999px" }}>One loan pays out the old ones</span>
              <span style={{ background: "#FBFEEE", color: "#012412", fontSize: "14px", fontWeight: "600", padding: "10px 16px", borderRadius: "999px" }}>Then one set repayment</span>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <div className="fl-dash" aria-hidden="true" style={{ position: "absolute", top: "27px", left: "28px", right: "28px", height: "2px", background: "repeating-linear-gradient(90deg, #9FD3A8 0 8px, transparent 8px 16px)" }}></div>
            <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "28px" }}>
              <div>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#012412", color: "#FBFEEE", fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: "600", fontSize: "22px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px", boxShadow: "0 0 0 8px #FFFFFF" }}>1</div>
                <h3 style={{ fontSize: "19px", fontWeight: "700", margin: "0 0 8px" }}>Answer a few questions</h3>
                <p style={{ fontSize: "15.5px", color: "#4b5b52", margin: "0" }}>What debts you have, roughly how much, and whether repayments are up to date. About two minutes.</p>
              </div>
              <div>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#012412", color: "#FBFEEE", fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: "600", fontSize: "22px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px", boxShadow: "0 0 0 8px #FFFFFF" }}>2</div>
                <h3 style={{ fontSize: "19px", fontWeight: "700", margin: "0 0 8px" }}>Robert lists it all out</h3>
                <p style={{ fontSize: "15.5px", color: "#4b5b52", margin: "0" }}>Every debt, what it costs and when it&apos;s due, then which of the 40+ lenders we have access to could roll it into one.</p>
              </div>
              <div>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#012412", color: "#FBFEEE", fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: "600", fontSize: "22px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px", boxShadow: "0 0 0 8px #FFFFFF" }}>3</div>
                <h3 style={{ fontSize: "19px", fontWeight: "700", margin: "0 0 8px" }}>The new lender pays out the old ones</h3>
                <p style={{ fontSize: "15.5px", color: "#4b5b52", margin: "0" }}>Once you&apos;re approved and accept, your existing debts are paid out in full.</p>
              </div>
              <div>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#206943", color: "#FBFEEE", fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: "600", fontSize: "22px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px", boxShadow: "0 0 0 8px #FFFFFF" }}>✓</div>
                <h3 style={{ fontSize: "19px", fontWeight: "700", margin: "0 0 8px" }}>You make one repayment</h3>
                <p style={{ fontSize: "15.5px", color: "#4b5b52", margin: "0" }}>One lender, one due date, over a term that fits your cash flow.</p>
              </div>
            </div>
          </div>
        </div>
      </section><section style={{ padding: "clamp(64px, 9vw, 112px) 20px", background: "#F1F4E6" }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "780px", margin: "0 auto 52px" }}>
            <div style={{ fontSize: "13px", fontWeight: "700", letterSpacing: ".12em", textTransform: "uppercase", color: "#206943", marginBottom: "14px" }}>Case study</div>
            {/* PLACEHOLDER: made-up example from the copy doc, for layout only. Robert must replace it with a real,
                de-identified Fintellect client (or remove this section) before ads run. */}
            <h2 style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: "600", fontSize: "clamp(32px, 3.8vw, 48px)", lineHeight: "1.08", letterSpacing: "-0.02em", margin: "0" }}>How a Dandenong freight business got <em style={{ fontStyle: "normal", fontWeight: "inherit", color: "#206943" }}>off the daily debits.</em></h2>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", background: "#FFFFFF", borderRadius: "26px", overflow: "hidden", boxShadow: "0 24px 60px rgba(1,36,18,.10)", border: "1px solid #E2E6D1" }}>
            <div className="fl-case-bg" style={{ position: "relative", background: "#012412", isolation: "isolate", flex: "1 1 340px", color: "#FBFEEE", padding: "clamp(28px, 4vw, 44px) clamp(20px, 3.5vw, 40px)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "36px", overflow: "hidden" }}>
              <img loading="lazy" decoding="async" src="/images/lp/case-study-bg.jpg" alt="" aria-hidden="true" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", zIndex: "-2" }} />
              <div aria-hidden="true" style={{ position: "absolute", inset: "0", background: "linear-gradient(160deg, rgba(1,36,18,.80) 0%, rgba(1,36,18,.94) 70%)", zIndex: "-1" }}></div>
              <svg aria-hidden="true" viewBox="0 0 400 400" style={{ position: "absolute", right: "-80px", bottom: "-80px", width: "320px", height: "320px", opacity: ".12" }}><g fill="none" stroke="#9FD3A8" strokeWidth="1.5"><circle cx="200" cy="200" r="60"></circle><circle cx="200" cy="200" r="100"></circle><circle cx="200" cy="200" r="140"></circle><circle cx="200" cy="200" r="180"></circle></g></svg>
              <div style={{ position: "relative" }}>
                <span style={{ display: "inline-block", fontSize: "12px", fontWeight: "700", letterSpacing: ".08em", textTransform: "uppercase", background: "#F4FAEE", color: "#012412", borderRadius: "999px", padding: "6px 12px" }}>Transport · VIC</span>
                <div style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: "84px", fontWeight: "600", lineHeight: "1", letterSpacing: "-0.03em", margin: "26px 0 8px" }}>$260K</div>
                <div style={{ fontSize: "16px", color: "#E2E6D1" }}>across 4 lenders</div>
              </div>
              <div style={{ position: "relative", display: "flex", gap: "32px", borderTop: "1px solid rgba(226,230,209,.2)", paddingTop: "22px" }}>
                <div><div style={{ fontSize: "12px", letterSpacing: ".08em", textTransform: "uppercase", color: "#9FD3A8", fontWeight: "700" }}>Before</div><div style={{ fontSize: "18px", fontWeight: "700" }}>4 short-term loans</div></div>
                <div><div style={{ fontSize: "12px", letterSpacing: ".08em", textTransform: "uppercase", color: "#9FD3A8", fontWeight: "700" }}>After</div><div style={{ fontSize: "18px", fontWeight: "700" }}>1 five-year loan</div></div>
              </div>
            </div>
            <div style={{ flex: "2 1 460px", padding: "clamp(28px, 4vw, 44px) clamp(20px, 3.5vw, 44px)", minWidth: "0" }}>
              <h3 style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: "600", fontSize: "28px", lineHeight: "1.2", margin: "0 0 24px" }}>From four short-term loans to one 5-year loan</h3>
              <div style={{ background: "#FBFEEE", border: "1px solid #E2E6D1", borderRadius: "16px", padding: "22px 24px", marginBottom: "26px" }}>
                <div style={{ fontSize: "12px", fontWeight: "700", letterSpacing: ".08em", textTransform: "uppercase", color: "#4b5b52", marginBottom: "16px" }}>Monthly repayment</div>
                <div style={{ display: "grid", gridTemplateColumns: "70px minmax(0, 1fr) 70px", alignItems: "center", gap: "10px 14px", fontSize: "14px" }}>
                  <span style={{ color: "#4b5b52", fontWeight: "600" }}>Before</span>
                  <div style={{ height: "16px", background: "#E2E6D1", borderRadius: "99px", overflow: "hidden" }}><div className="fl-bar-fill" style={{ width: "100%", height: "100%", background: "#B4472F", borderRadius: "99px" }}></div></div>
                  <span style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: "700", fontSize: "20px", color: "#8A1C1C" }}>$22.5K</span>
                  <span style={{ color: "#4b5b52", fontWeight: "600" }}>After</span>
                  <div style={{ height: "16px", background: "#E2E6D1", borderRadius: "99px", overflow: "hidden" }}><div className="fl-bar-fill" style={{ width: "44%", height: "100%", background: "#206943", borderRadius: "99px" }}></div></div>
                  <span style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: "700", fontSize: "20px", color: "#206943" }}>$9.8K</span>
                </div>
              </div>
              <p style={{ margin: "0 0 14px", fontSize: "16.5px" }}>A freight business had taken out four short-term loans over 18 months, each to cover the last. Daily debits were coming out before fuel and wages were paid.</p>
              <p style={{ margin: "0", fontSize: "16.5px", color: "#4b5b52" }}>We consolidated all four into one loan over five years, secured against the owner&apos;s property. One repayment a month, and more than $12,000 a month back in the business.</p>
            </div>
          </div>
        </div>
      </section>
    
      {/* THREE REASONS */}
      <section style={{ padding: "clamp(64px, 9vw, 112px) 20px", background: "#012412", color: "#FBFEEE" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "1146px", margin: "0 auto 56px" }}>
            <div style={{ fontSize: "13px", fontWeight: "700", letterSpacing: ".12em", textTransform: "uppercase", color: "#9FD3A8", marginBottom: "14px" }}>Why consolidate</div>
            <h2 style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: "600", fontSize: "clamp(32px, 3.8vw, 48px)", lineHeight: "1.08", letterSpacing: "-0.02em", margin: "0 auto", textAlign: "center" }}>Why owners are rolling their debts <em style={{ fontStyle: "normal", fontWeight: "inherit", color: "#9FD3A8" }}>into one.</em></h2>
          </div>
          <p style={{ textAlign: "center", fontSize: "13px", fontWeight: "700", letterSpacing: ".12em", textTransform: "uppercase", color: "#9FD3A8", margin: "0 0 18px" }}>Two ways to roll it into one</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "20px" }}>
            <div className="fl-card" style={{ border: "1px solid rgba(226,230,209,.16)", borderRadius: "22px", overflow: "hidden", background: "rgba(255,255,255,.04)", display: "flex", flexDirection: "column" }}>
              <div className="fl-imgwrap" style={{ position: "relative", height: "clamp(180px, 20vw, 240px)", overflow: "hidden" }}>
                <img className="fl-img" src="/images/lp/route-home-equity.jpg" alt="Model house balanced against stacks of coins" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 48%" }} />
                <div aria-hidden="true" style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(1,36,18,0) 40%, rgba(1,36,18,.75) 100%)" }}></div>
                <span style={{ position: "absolute", left: "18px", bottom: "16px", background: "#FBFEEE", color: "#012412", fontSize: "13px", fontWeight: "700", padding: "6px 12px", borderRadius: "999px" }}>Own property</span>
              </div>
              <div style={{ padding: "clamp(22px, 3vw, 30px) clamp(20px, 2.5vw, 28px)" }}>
                <h3 style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: "clamp(22px, 2.4vw, 26px)", fontWeight: "700", lineHeight: "1.2", letterSpacing: "-0.01em", margin: "0 0 10px" }}>Use your home equity</h3>
                <p style={{ fontSize: "15.5px", color: "#CFD6C4", margin: "0" }}>Secure the new loan against property you own. Equity can open up longer terms and more lenders, which can bring the monthly repayment down.</p>
              </div>
            </div>
            <div className="fl-card" style={{ border: "1px solid rgba(226,230,209,.16)", borderRadius: "22px", overflow: "hidden", background: "rgba(255,255,255,.04)", display: "flex", flexDirection: "column" }}>
              <div className="fl-imgwrap" style={{ position: "relative", height: "clamp(180px, 20vw, 240px)", overflow: "hidden" }}>
                <img className="fl-img" src="/images/lp/route-business-loan.jpg" alt="Business owners shaking hands over a loan agreement" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 40%" }} />
                <div aria-hidden="true" style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(1,36,18,0) 40%, rgba(1,36,18,.75) 100%)" }}></div>
                <span style={{ position: "absolute", left: "18px", bottom: "16px", background: "#FBFEEE", color: "#012412", fontSize: "13px", fontWeight: "700", padding: "6px 12px", borderRadius: "999px" }}>No property</span>
              </div>
              <div style={{ padding: "clamp(22px, 3vw, 30px) clamp(20px, 2.5vw, 28px)" }}>
                <h3 style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: "clamp(22px, 2.4vw, 26px)", fontWeight: "700", lineHeight: "1.2", letterSpacing: "-0.01em", margin: "0 0 10px" }}>Use a business loan</h3>
                <p style={{ fontSize: "15.5px", color: "#CFD6C4", margin: "0" }}>Lenders look at your revenue and trading history instead of property. Unsecured and low-doc options are still on the table.</p>
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            <div className="fl-card" style={{ border: "1px solid rgba(226,230,209,.16)", borderRadius: "20px", padding: "clamp(24px, 3vw, 32px) clamp(20px, 2.5vw, 28px)", background: "rgba(255,255,255,.04)", position: "relative" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "#F4FAEE", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "22px" }}><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#206943" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg></div>
              <h3 style={{ fontSize: "20px", fontWeight: "700", margin: "0 0 10px" }}>The repayments eat the week</h3>
              <p style={{ fontSize: "15.5px", color: "#CFD6C4", margin: "0" }}>Daily and weekly debits from short-term lenders come out before you&apos;ve paid anyone else.</p>
            </div>
            <div className="fl-card" style={{ border: "1px solid rgba(226,230,209,.16)", borderRadius: "20px", padding: "clamp(24px, 3vw, 32px) clamp(20px, 2.5vw, 28px)", background: "rgba(255,255,255,.04)" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "#F4FAEE", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "22px" }}><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#206943" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22V4"></path><path d="M4 4h12l-2 4 2 4H4"></path></svg></div>
              <h3 style={{ fontSize: "20px", fontWeight: "700", margin: "0 0 10px" }}>It&apos;s hard to keep track</h3>
              <p style={{ fontSize: "15.5px", color: "#CFD6C4", margin: "0" }}>Different lenders, terms and statements make it hard to know what you really owe.</p>
            </div>
            <div className="fl-card" style={{ border: "1px solid rgba(226,230,209,.16)", borderRadius: "20px", padding: "clamp(24px, 3vw, 32px) clamp(20px, 2.5vw, 28px)", background: "rgba(255,255,255,.04)" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "#F4FAEE", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "22px" }}><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#206943" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l6-6 4 4 8-8"></path><path d="M14 7h7v7"></path></svg></div>
              <h3 style={{ fontSize: "20px", fontWeight: "700", margin: "0 0 10px" }}>Each new loan was meant to fix the last one</h3>
              <p style={{ fontSize: "15.5px", color: "#CFD6C4", margin: "0" }}>Stacking short-term debt can make cash flow tighter, not looser.</p>
            </div>
          </div>
          <p style={{ textAlign: "center", fontSize: "17px", color: "#E2E6D1", maxWidth: "760px", margin: "48px auto 0" }}>One loan on longer terms can give you room to breathe. Robert will show you the total cost both ways before you decide.</p>
        </div>
      </section>
    
      {/* ROBERT */}
      <section style={{ padding: "clamp(64px, 9vw, 112px) 20px", background: "#FBFEEE" }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "clamp(36px, 5vw, 64px)", alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 320px", maxWidth: "440px" }}>
            <img loading="lazy" decoding="async" src="/images/lp/robert-makhlouta.jpg" alt="Robert Makhlouta, broker at Fintellect" style={{ display: "block", width: "100%", aspectRatio: "4 / 5", objectFit: "cover", objectPosition: "50% 30%", borderRadius: "26px", boxShadow: "0 24px 60px rgba(1,36,18,.18)" }} />
            <div style={{ position: "absolute", left: "-18px", bottom: "32px", background: "#FBFEEE", color: "#012412", border: "1px solid #E2E6D1", borderRadius: "16px", padding: "16px 20px", boxShadow: "0 16px 36px rgba(1,36,18,.25)" }}>
              <div style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: "20px", fontWeight: "600" }}>Robert Makhlouta</div>
              <div style={{ fontSize: "13px", color: "#206943", fontWeight: "600" }}>Broker · Fintellect</div>
            </div>
          </div>
          <div style={{ flex: "1 1 440px", minWidth: "0" }}>
            <div style={{ fontSize: "13px", fontWeight: "700", letterSpacing: ".12em", textTransform: "uppercase", color: "#206943", marginBottom: "14px" }}>Meet your broker</div>
            <h2 style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: "600", fontSize: "clamp(32px, 3.8vw, 48px)", lineHeight: "1.08", letterSpacing: "-0.02em", margin: "0 0 24px" }}>Why I started Fintellect</h2>
            <p style={{ margin: "0 0 14px", fontSize: "18px", fontWeight: "500" }}>Hi, I&apos;m Robert Makhlouta, the broker behind Fintellect.</p>
            <p style={{ margin: "0 0 14px", color: "#4b5b52" }}>I kept seeing the same thing: good business owners spending weeks going lender to lender, or giving up after one no from their bank. Most of them didn&apos;t have a bad business. They just hadn&apos;t been put in front of the right lender.</p>
            <p style={{ margin: "0 0 26px", color: "#4b5b52" }}>So Fintellect works the other way around. You tell us your situation once. I look at it, work out which of the 40+ lenders we have access to are likely to say yes, and only put forward the ones that fit.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", fontWeight: "600" }}><span style={{ flex: "0 0 26px", height: "26px", borderRadius: "50%", background: "#206943", display: "flex", alignItems: "center", justifyContent: "center" }}><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></span>You deal with me, not a call centre</div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", fontWeight: "600" }}><span style={{ flex: "0 0 26px", height: "26px", borderRadius: "50%", background: "#206943", display: "flex", alignItems: "center", justifyContent: "center" }}><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></span>One set of questions, not ten applications</div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", fontWeight: "600" }}><span style={{ flex: "0 0 26px", height: "26px", borderRadius: "50%", background: "#206943", display: "flex", alignItems: "center", justifyContent: "center" }}><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></span>Straight answers, including when finance isn&apos;t the right move</div>
            </div>
            <blockquote style={{ margin: "0", borderRadius: "16px", background: "#FFFFFF", border: "1px solid #E2E6D1", padding: "22px 24px", fontFamily: "var(--font-inter), Inter, sans-serif", fontStyle: "italic", fontSize: "20px", lineHeight: "1.45" }}>&quot;If I can save you the legwork and find a lender that suits how your business actually runs, I&apos;ve done my job.&quot;</blockquote>
          </div>
        </div>
      </section>
    
    
      {/* REVIEWS */}
      <section style={{ padding: "clamp(64px, 9vw, 112px) 20px", background: "#F1F4E6" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto 52px" }}>
            <div style={{ fontSize: "13px", fontWeight: "700", letterSpacing: ".12em", textTransform: "uppercase", color: "#206943", marginBottom: "14px" }}>Reviews</div>
            <h2 style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: "600", fontSize: "clamp(32px, 3.8vw, 48px)", lineHeight: "1.08", letterSpacing: "-0.02em", margin: "0 0 18px" }}>What clients say about <em style={{ fontStyle: "normal", fontWeight: "inherit", color: "#206943" }}>Robert and the team.</em></h2>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "#FFFFFF", border: "1px solid #E2E6D1", borderRadius: "999px", padding: "8px 16px", fontSize: "15px", fontWeight: "600" }}><img loading="lazy" decoding="async" src="/images/lp/google-g.png" alt="Google" style={{ display: "block", width: "22px", height: "22px" }} /><div role="img" aria-label="5 out of 5 stars" style={{ display: "flex", gap: "3px", margin: "0" }}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="#E8A317"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"></path></svg><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="#E8A317"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"></path></svg><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="#E8A317"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"></path></svg><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="#E8A317"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"></path></svg><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="#E8A317"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"></path></svg></div><span>on Google</span></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", alignItems: "stretch" }}>
            <figure className="fl-card" style={{ margin: "0", background: "#FFFFFF", border: "1px solid #E2E6D1", borderRadius: "20px", padding: "28px 26px", display: "flex", flexDirection: "column" }}>
              <div role="img" aria-label="5 out of 5 stars" style={{ display: "flex", gap: "3px", marginBottom: "16px" }}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="#E8A317"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"></path></svg><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="#E8A317"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"></path></svg><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="#E8A317"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"></path></svg><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="#E8A317"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"></path></svg><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="#E8A317"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"></path></svg></div>
              <blockquote style={{ margin: "0", flex: "1 1 auto" }}><p style={{ margin: "0 0 12px", fontSize: "15.5px", lineHeight: "1.6", color: "#2f3d34" }}>Rob and the team at Fintellect were fantastic to deal with! They managed to get our finance approved when other lenders couldn’t make it happen.</p><p style={{ margin: "0 0 12px", fontSize: "15.5px", lineHeight: "1.6", color: "#2f3d34" }}>Really impressed with the effort and dedication they put into getting us across the line. The whole team went above and beyond, and we couldn’t be happier with the outcome.</p><p style={{ margin: "0 0 12px", fontSize: "15.5px", lineHeight: "1.6", color: "#2f3d34" }}>Highly recommend Fintellect to anyone looking for a reliable mortgage broker who knows how to get things done!</p></blockquote>
              <figcaption style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "12px", paddingTop: "18px", borderTop: "1px solid #E2E6D1" }}>
                <span aria-hidden="true" style={{ flex: "0 0 42px", height: "42px", borderRadius: "50%", background: "#206943", color: "#FBFEEE", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>JS</span>
                <span><span style={{ display: "block", fontWeight: "700" }}>John Sikalias</span></span>
              </figcaption>
            </figure>
            <figure className="fl-card" style={{ margin: "0", background: "#FFFFFF", border: "1px solid #E2E6D1", borderRadius: "20px", padding: "28px 26px", display: "flex", flexDirection: "column" }}>
              <div role="img" aria-label="5 out of 5 stars" style={{ display: "flex", gap: "3px", marginBottom: "16px" }}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="#E8A317"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"></path></svg><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="#E8A317"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"></path></svg><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="#E8A317"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"></path></svg><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="#E8A317"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"></path></svg><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="#E8A317"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"></path></svg></div>
              <blockquote style={{ margin: "0", flex: "1 1 auto" }}><p style={{ margin: "0 0 12px", fontSize: "15.5px", lineHeight: "1.6", color: "#2f3d34" }}>Can’t speak highly enough of Robert, Danni, Sam and Jamie at Fintellect!</p><p style={{ margin: "0 0 12px", fontSize: "15.5px", lineHeight: "1.6", color: "#2f3d34" }}>They’ve helped both myself and my family with all our loans over the years, and the service has always been exceptional.</p><p style={{ margin: "0 0 12px", fontSize: "15.5px", lineHeight: "1.6", color: "#2f3d34" }}>The entire team is incredibly knowledgeable, approachable and genuinely cares about getting the best outcome for their clients. They make what can sometimes be a stressful and complicated process feel straightforward and easy.</p><p style={{ margin: "0 0 12px", fontSize: "15.5px", lineHeight: "1.6", color: "#2f3d34" }}>It’s hard to find people you can trust completely when it comes to your finances, but these guys have earned that trust time and time again.</p><p style={{ margin: "0 0 12px", fontSize: "15.5px", lineHeight: "1.6", color: "#2f3d34" }}>Wouldn’t hesitate to recommend Fintellect to anyone looking for a great mortgage broker. Thanks again to the whole team!</p></blockquote>
              <figcaption style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "12px", paddingTop: "18px", borderTop: "1px solid #E2E6D1" }}>
                <span aria-hidden="true" style={{ flex: "0 0 42px", height: "42px", borderRadius: "50%", background: "#206943", color: "#FBFEEE", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>PE</span>
                <span><span style={{ display: "block", fontWeight: "700" }}>Phyras El Amin</span></span>
              </figcaption>
            </figure>
            <figure className="fl-card" style={{ margin: "0", background: "#FFFFFF", border: "1px solid #E2E6D1", borderRadius: "20px", padding: "28px 26px", display: "flex", flexDirection: "column" }}>
              <div role="img" aria-label="5 out of 5 stars" style={{ display: "flex", gap: "3px", marginBottom: "16px" }}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="#E8A317"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"></path></svg><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="#E8A317"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"></path></svg><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="#E8A317"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"></path></svg><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="#E8A317"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"></path></svg><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="#E8A317"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"></path></svg></div>
              <blockquote style={{ margin: "0", flex: "1 1 auto" }}><p style={{ margin: "0 0 12px", fontSize: "15.5px", lineHeight: "1.6", color: "#2f3d34" }}>Couldn’t recommend Fintellect enough! Robert and the team made the entire finance process so much easier than we expected. They were professional, knowledgeable and always happy to answer our questions.</p><p style={{ margin: "0 0 12px", fontSize: "15.5px", lineHeight: "1.6", color: "#2f3d34" }}>What impressed us most was how proactive they were throughout the whole process. They kept us updated, explained everything clearly and genuinely went out of their way to get us the best possible outcome.</p><p style={{ margin: "0 0 12px", fontSize: "15.5px", lineHeight: "1.6", color: "#2f3d34" }}>If you’re looking for a mortgage broker who knows their stuff and actually cares about their clients, these are the guys to speak to. Highly recommend!</p></blockquote>
              <figcaption style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "12px", paddingTop: "18px", borderTop: "1px solid #E2E6D1" }}>
                <span aria-hidden="true" style={{ flex: "0 0 42px", height: "42px", borderRadius: "50%", background: "#206943", color: "#FBFEEE", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>DM</span>
                <span><span style={{ display: "block", fontWeight: "700" }}>Daniel Mitchell</span></span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
    
      {/* FAQ */}
      
    
      {/* FINAL CTA */}
      <section style={{ padding: "clamp(64px, 9vw, 112px) 20px", background: "#FFFFFF" }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "clamp(32px, 4vw, 48px)" }}>
          <div style={{ flex: "1 1 300px", minWidth: "0" }}>
            <div style={{ fontSize: "13px", fontWeight: "700", letterSpacing: ".12em", textTransform: "uppercase", color: "#206943", marginBottom: "14px" }}>FAQ</div>
            <h2 style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: "600", fontSize: "clamp(32px, 3.6vw, 46px)", lineHeight: "1.08", letterSpacing: "-0.02em", margin: "0 0 18px" }}>Common questions</h2>
            <p style={{ color: "#4b5b52", margin: "0 0 24px" }}>Something else on your mind? Robert will cover it on the call.</p>
            <QuizLink className="fl-btn fl-btn-green" style={{ display: "inline-block", background: "#206943", color: "#FFFFFF", textDecoration: "none", fontWeight: "700", fontSize: "16px", padding: "15px 24px", borderRadius: "999px" }}>Apply to speak with a broker</QuizLink>
          </div>
          <div style={{ flex: "2 1 520px", minWidth: "0", display: "flex", flexDirection: "column", gap: "12px" }}>
            <details className="fl-faq" open style={{ border: "1px solid #E2E6D1", borderRadius: "16px", padding: "22px 24px", background: "#FBFEEE", transition: "background .2s, border-color .2s" }}>
              <summary style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", fontWeight: "700", fontSize: "17.5px" }}>Will consolidating cost me more overall?<span className="fl-plus" style={{ flex: "0 0 32px", height: "32px", borderRadius: "50%", background: "#EEF6E4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "400", color: "#206943", transition: "transform .2s" }}>+</span></summary>
              <p style={{ margin: "12px 0 0", color: "#4b5b52", fontSize: "16px" }}>It can, if the loan runs longer. Robert will show you the total cost both ways so you can decide.</p>
            </details>
            <details className="fl-faq" style={{ border: "1px solid #E2E6D1", borderRadius: "16px", padding: "22px 24px", background: "#FBFEEE", transition: "background .2s, border-color .2s" }}>
              <summary style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", fontWeight: "700", fontSize: "17.5px" }}>Can I include ATO debt?<span className="fl-plus" style={{ flex: "0 0 32px", height: "32px", borderRadius: "50%", background: "#EEF6E4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "400", color: "#206943", transition: "transform .2s" }}>+</span></summary>
              <p style={{ margin: "12px 0 0", color: "#4b5b52", fontSize: "16px" }}>Yes. It can be paid out as part of the same loan, subject to lender approval.</p>
            </details>
            <details className="fl-faq" style={{ border: "1px solid #E2E6D1", borderRadius: "16px", padding: "22px 24px", background: "#FBFEEE", transition: "background .2s, border-color .2s" }}>
              <summary style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", fontWeight: "700", fontSize: "17.5px" }}>What about merchant cash advances or daily-repayment loans?<span className="fl-plus" style={{ flex: "0 0 32px", height: "32px", borderRadius: "50%", background: "#EEF6E4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "400", color: "#206943", transition: "transform .2s" }}>+</span></summary>
              <p style={{ margin: "12px 0 0", color: "#4b5b52", fontSize: "16px" }}>Those are some of the most common debts people consolidate.</p>
            </details>
            <details className="fl-faq" style={{ border: "1px solid #E2E6D1", borderRadius: "16px", padding: "22px 24px", background: "#FBFEEE", transition: "background .2s, border-color .2s" }}>
              <summary style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", fontWeight: "700", fontSize: "17.5px" }}>Do I need property as security?<span className="fl-plus" style={{ flex: "0 0 32px", height: "32px", borderRadius: "50%", background: "#EEF6E4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "400", color: "#206943", transition: "transform .2s" }}>+</span></summary>
              <p style={{ margin: "12px 0 0", color: "#4b5b52", fontSize: "16px" }}>Not always. Property can open up more lenders and longer terms.</p>
            </details>
          </div>
        </div>
      </section><section id="final-cta" style={{ padding: "0 16px clamp(64px, 9vw, 112px)", background: "#FFFFFF" }}>
        <div style={{ position: "relative", maxWidth: "1200px", margin: "0 auto", background: "#206943", isolation: "isolate", color: "#FBFEEE", borderRadius: "30px", padding: "clamp(44px, 6vw, 72px) clamp(20px, 4vw, 48px)", overflow: "hidden", textAlign: "center" }}>
          <img loading="lazy" decoding="async" src="/images/lp/final-cta-suburbs.jpg" alt="" aria-hidden="true" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 45%", zIndex: "-2" }} />
          <div aria-hidden="true" style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, rgba(32,105,67,.90) 0%, rgba(1,36,18,.92) 100%)", zIndex: "-1" }}></div>
          <svg aria-hidden="true" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", opacity: ".16" }}><g fill="none" stroke="#FBFEEE" strokeWidth="1"><path d="M-20 300 C 200 220, 420 360, 640 280 S 1000 180, 1220 240"></path><path d="M-20 260 C 200 180, 420 320, 640 240 S 1000 140, 1220 200"></path><path d="M-20 220 C 200 140, 420 280, 640 200 S 1000 100, 1220 160"></path><path d="M-20 180 C 200 100, 420 240, 640 160 S 1000 60, 1220 120"></path></g></svg>
          <div style={{ position: "relative", maxWidth: "760px", margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: "600", fontSize: "clamp(34px, 4.4vw, 58px)", lineHeight: "1.04", letterSpacing: "-0.02em", margin: "0 0 18px" }}>One loan. One repayment. <em style={{ fontStyle: "normal", fontWeight: "inherit", color: "#CFE9C9" }}>One less thing to chase.</em></h2>
            <p style={{ margin: "0 auto 32px", fontSize: "18.5px", color: "#E2E6D1", maxWidth: "812px", textAlign: "center" }}>Answer a few questions and Robert will look at whether consolidating makes sense for you.</p>
            <QuizLink className="fl-btn fl-btn-light" style={{ display: "inline-block", background: "#FBFEEE", color: "#012412", textDecoration: "none", fontWeight: "700", fontSize: "clamp(16px, 4vw, 18px)", padding: "clamp(15px, 3vw, 19px) clamp(22px, 4vw, 34px)", borderRadius: "999px" }}>Apply to speak with a broker</QuizLink>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 22px", marginTop: "22px", fontSize: "14px", color: "#CFE9C9" }}>
              <span>Your data is safe &amp; secure</span><span>·</span><span>No credit score impact</span>
            </div>
          </div>
        </div>
      </section>
    
      {/* FOOTER */}
      <LatestFooter />
    
    
      {/* Phones: sticky call-to-action at the bottom of the screen */}
      <MobileCta label="Apply to speak with a broker" status="About two minutes" />
    </div>
  );
}
