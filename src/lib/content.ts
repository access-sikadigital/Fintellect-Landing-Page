/**
 * All page copy lives here. Source: "Fintellect ATO Debt Landing Page" design artifact.
 * Quiz steps 2–10 were drafted from the page's own content (FAQ + eligibility list)
 * and are marked TO CONFIRM below.
 */

export const site = {
  name: "Fintellect",
  legalName: "Fintel Group (VIC) Pty Ltd",
  acl: "515382",
  broker: "Robert",
  /** Mirrors the main site's client-approved callback promise. */
  callback: "within the next business day",
  privacyHref: "https://fintellect.com.au/privacy-policy/",
  termsHref: "https://fintellect.com.au/credit-guide/",
} as const;

export const cta = "Check if this works for me";

export const hero = {
  eyebrow: "For business owners with ATO debt",
  titleLead: "Owe the ATO? Your home could pay it out",
  titleAccent: "in one go.",
  sub: "ATO interest compounds every day, and interest charged since 1 July 2025 can't be claimed as a tax deduction. If you own property, using your equity to clear the balance could take the pressure off. Answer a few questions to see if it fits you.",
  ticks: ["For business owners who own property", "Talk to a licensed broker, not a call centre", "About a minute"],
};

/** Short facts for the marquee strip. All taken from elsewhere on the page. */
export const marquee = [
  // RG 234 (June 2026): the licence must be written in full, not as "ACL"
  `Australian Credit Licence ${site.acl}`,
  "Access to 40+ lenders",
  "Talk to Robert, not a call centre",
  "Your details aren't sold on",
  "Straight answers on the first call",
  "About a minute",
];

export const pain = {
  title: "Carrying an ATO debt costs more than it used to",
  sub: "If any of this sounds familiar, you're not alone.",
  cards: [
    {
      title: "The interest never stops",
      body: "The ATO charges interest on the overdue balance, and it compounds daily. The longer it sits, the bigger it gets.",
    },
    {
      title: "You can't claim it anymore",
      body: "ATO interest charged from 1 July 2025 is no longer tax-deductible. Every dollar of interest now costs you a full dollar.",
    },
    {
      title: "Payment plans squeeze cashflow",
      body: "ATO plans run over the shortest period you can afford, and interest keeps building. The monthly hit lands on top of wages, suppliers and your own bills.",
    },
    {
      title: "It can follow you",
      body: "Business tax debts of $100,000+ that are over 90 days overdue can be reported to credit bureaus if you're not engaging with the ATO. That makes the next loan harder to get.",
    },
    {
      title: "And it comes home with you",
      body: "The letters, the reminders, the late nights doing the numbers.",
    },
  ],
};

export const solution = {
  title: "Clear the ATO through your home loan",
  body: "If your property has enough equity, we may be able to restructure your lending to release some of it and pay the ATO balance in full. You're left with one loan and one repayment, spread over a longer term, at a home loan interest rate instead of the ATO's interest charge.",
  points: [
    "The ATO balance is paid out in full. No payment plan, no collection letters.",
    "One repayment you can plan around, instead of the ATO plan on top of everything else.",
    "More room in your monthly cashflow to run the business.",
  ],
  honest: {
    title: "The honest part",
    body: "This isn't right for everyone. Your home becomes security for the debt, and a longer term can mean more interest overall. That's why Robert looks at your whole position first, and why we suggest running it past your accountant before you go ahead.",
  },
};

export const steps = {
  title: "How it works",
  items: [
    { title: "Answer a few questions", body: "Your ATO balance, your property and your business. It takes about a minute." },
    { title: "Talk it through with Robert", body: "A 15-minute call with a licensed broker who works with business owners. He'll tell you straight whether it's an option." },
    { title: "We shortlist the lenders that fit", body: "Access to 40+ lenders, including ones that work with self-employed borrowers. We shortlist the ones that fit you." },
    { title: "The ATO gets paid out", body: "When the loan settles, the ATO balance is paid in full." },
  ],
};

export const fit = {
  title: "Is this for you?",
  yes: {
    title: "This could work if you",
    items: [
      "run a business or work as a sole trader with an ATO debt",
      "own a home or investment property with equity in it",
      "have been trading for at least 12 months",
      "want the ATO paid out, not just a longer payment plan",
    ],
  },
  no: {
    title: "This isn't for you if you",
    items: ["don't own property", "have only just started your business", "want a quick unsecured loan with no questions asked"],
  },
};

export const proof = {
  caseTitle: "What it looked like for one client",
  /**
   * SAMPLE DATA (code note only, never shown on the page): swap in Robert's real,
   * de-identified deal before ads go live. The note below states this is a real deal.
   */
  caseStudy: {
    placeholder: false,
    where: "Electrical contractor, Melbourne VIC",
    metrics: [
      { label: "ATO balance cleared", value: "$184,000" },
      { label: "Monthly cashflow", value: "+$3,900 a month" },
      { label: "Loan term", value: "25 years" },
    ],
    note: "A real, de-identified Fintellect deal with the client's permission.",
  },
  robertTitle: "You deal with Robert, start to finish",
  robertPoints: [
    { icon: "user", text: "A licensed broker, not a lead-referral site. Your details aren't sold on to a list of lenders." },
    { icon: "wallet-1", text: "Works with self-employed and business-owner lending every day." },
    { icon: "chat", text: "Straight answers on the first call, including when it's not the right move." },
    { icon: "bank", text: "Access to 40+ lenders. We shortlist the ones that fit you." },
  ],
};

export const faq = {
  title: "Questions business owners ask",
  items: [
    { q: "What if I'm already on an ATO payment plan?", a: "You can still pay the balance out. The plan ends once the ATO is paid in full." },
    { q: "What if I've received a director penalty notice?", a: "These are time-sensitive. Speak to your accountant straight away, and tell Robert on the call so he knows the timeframe." },
    { q: "Do my tax returns and BAS need to be up to date?", a: "Most lenders want lodgements up to date or close to it. Tell us where you're at in the quiz and Robert will explain your options." },
    { q: "Is the interest on the new loan tax-deductible?", a: "It depends on how the money is used and how your business is set up. Your accountant can confirm. We don't give tax advice." },
    { q: "How long does it take?", a: "It depends on the lender, the valuation and your paperwork. Robert will give you a realistic timeframe on the call." },
    { q: "How is Robert paid?", a: "Brokers are usually paid by the lender. Robert will walk you through it in his credit guide before anything goes ahead." },
    // Fact-checked against ato.gov.au on 15 Nov 2026 (payment plans, firmer action, lodging when you can't pay)
    {
      q: "Does ATO interest stop while I'm on a payment plan?",
      a: "No. The general interest charge keeps building daily on what's left, so paying sooner lowers the total. Some small businesses can get an interest-free plan if they meet the ATO's conditions.",
    },
    {
      q: "Can an ATO debt affect my business credit file?",
      a: "Yes. If your business owes $100,000 or more that's over 90 days overdue and you're not engaging with the ATO, it may be reported to credit bureaus. The ATO sends a notice first and gives you 28 days to act.",
    },
    {
      q: "Should I keep lodging if I can't pay?",
      a: "Yes. The ATO says not being able to pay isn't a reason to lodge late. Lodge on time and contact the ATO early about paying. Up-to-date lodgements also make lenders more comfortable.",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Added sections (research-led: competitor gaps + ATO/ASIC fact-check, 15 Nov 2026) */
/* ------------------------------------------------------------------ */

/**
 * ATO general interest charge. Set quarterly (base rate + 7 points).
 * UPDATE EACH QUARTER: next change 1 Jan 2027 (published mid-December).
 * Source: ato.gov.au/tax-rates-and-codes/general-interest-charge-rates
 */
export const gic = { rate: "11.51% p.a.", period: "October–December 2026", checked: "15 November 2026" };

/** Side-by-side: staying on an ATO plan vs clearing it through the home loan. Risks shown on both sides. */
export const compare = {
  eyebrow: "Side by side",
  title: "ATO payment plan or home loan restructure: what each one really costs you",
  ato: { label: "Stay on an ATO payment plan", tag: "Today", summary: "Two repayments, interest compounding daily" },
  home: { label: "Clear it through your home loan", tag: "One loan", summary: "One loan, one repayment, ATO paid in full" },
  rows: [
    { icon: "percent", label: "Interest you pay", ato: `The ATO's general interest charge, ${gic.rate}`, home: "Your home loan interest rate", homeTone: "good" },
    { icon: "sync", label: "How interest builds", ato: "Daily, including on unpaid interest", home: "On the loan balance, charged monthly", homeTone: "good" },
    { icon: "receipt", label: "Tax-deductible", ato: "No, for interest charged from 1 July 2025", home: "Depends how the money is used. Ask your accountant", homeTone: "neutral" },
    { icon: "wallet-1", label: "Repayments each month", ato: "Plan payment on top of your home loan", home: "One repayment", homeTone: "good" },
    { icon: "credit-card", label: "Your credit file", ato: "Can be reported at $100,000+ and 90+ days overdue", home: "ATO balance paid in full at settlement", homeTone: "good" },
    { icon: "calendar", label: "Time to repay", ato: "The shortest period you can afford", home: "Spread over a longer term", homeTone: "good" },
    { icon: "dollar-1", label: "Total interest", ato: "Keeps growing while the balance sits", home: "A longer term can mean more interest overall", homeTone: "risk" },
    { icon: "home-1", label: "What secures it", ato: "Nothing. It's unsecured", home: "Your home secures the loan", homeTone: "risk" },
  ] as { icon: string; label: string; ato: string; home: string; homeTone: "good" | "neutral" | "risk" }[],
  honest: {
    title: "If an interest-free ATO plan fits you, Robert will tell you to take it",
    body: "Small businesses with turnover under $2 million and activity statement debt of $50,000 or less may qualify for an ATO plan with no interest, repaid within 12 months.",
  },
  source: `General interest charge rate for ${gic.period}, from ato.gov.au. Checked ${gic.checked}. General information only.`,
};

/** What to have ready, and what the 15-minute call covers. */
export const callPrep = {
  eyebrow: "Before you talk",
  title: "Five things to have handy for your 15-minute call with Robert",
  items: [
    { icon: "receipt", title: "Your latest ATO statement", body: "The balance owing, and whether you're on a payment plan." },
    { icon: "mail", title: "Any letters from the ATO", body: "Especially a director penalty notice. Those have short deadlines." },
    { icon: "home-1", title: "A rough value for your property", body: "Plus what's still owing on the home loan. A recent statement is enough." },
    { icon: "file-copy", title: "Where your tax returns and BAS are at", body: "Lodged, or a few behind. Robert needs to know, not judge." },
    { icon: "user-group", title: "Your accountant's details", body: "We suggest running it past them before anything goes ahead." },
  ],
  agenda: {
    title: "What the 15 minutes covers",
    points: [
      "Where you stand with the ATO right now",
      "Whether your equity could clear the balance",
      "What it would cost you over the full term",
      "If it's not the right move, what else might work",
    ],
    footnote: "No paperwork on the call. It's a conversation, not an application.",
  },
};

/** Sole trader vs company: where the debt sits changes the plan. DPN facts from ato.gov.au. */
export const structure = {
  eyebrow: "Whose debt is it?",
  title: "Sole trader or company director? Where the debt sits changes how it gets paid.",
  cards: [
    {
      icon: "user",
      tag: "Sole trader",
      title: "The tax debt is in your name",
      points: [
        "Equity released from your home can go to the ATO at settlement",
        "You end up with one loan and one repayment, in your name",
        "Your accountant confirms how it's recorded at tax time",
      ],
    },
    {
      icon: "bank",
      tag: "Company director",
      title: "The tax debt belongs to the company",
      points: [
        "A director penalty notice can make you personally liable for unpaid PAYG withholding, GST and super",
        "Robert and your accountant work out how the money moves from you to the company",
        "Had a director penalty notice? Tell Robert first. The deadline is 21 days.",
      ],
    },
  ],
  more: "Trust or partnership? Pick it in the quiz and Robert will explain how it works for your set-up.",
};

export const finalCta = {
  title: "Every month the ATO balance sits there, it costs you more",
  sub: "Find out if your property can clear it.",
};

export const footer = {
  lines: [
    `${site.legalName} trading as ${site.name} · Australian Credit Licence ${site.acl}`,
    "General information only. It doesn't consider your objectives, financial situation or needs, and isn't tax or financial advice. Speak to your accountant about your tax position. Lending criteria, fees and charges apply. Your property is used as security for the loan.",
  ],
};

/* ------------------------------------------------------------------ */
/* Quiz                                                                */
/* ------------------------------------------------------------------ */

export type ChoiceStep = {
  id: string;
  kind: "choice";
  question: string;
  hint?: string;
  options: string[];
  /** Lay options out as a grid of short chips (e.g. states). */
  compact?: boolean;
  /** Skip this step when the function returns true. */
  skipIf?: (answers: Record<string, string>) => boolean;
};

export type ContactStep = {
  id: "contact";
  kind: "contact";
  question: string;
  hint?: string;
};

export type QuizStep = ChoiceStep | ContactStep;

export const NO_PROPERTY = "No, I don't own property";
const noProperty = (a: Record<string, string>) => a.property === NO_PROPERTY;

/** Step 1 is from the artifact. Steps 2–10 are drafted: TO CONFIRM with Robert. */
export const quizSteps: QuizStep[] = [
  {
    id: "atoDebt",
    kind: "choice",
    question: "Roughly how much do you owe the ATO?",
    hint: "A rough figure is fine.",
    options: ["Under $50k", "$50k – $100k", "$100k – $250k", "$250k – $500k", "$500k+"],
  },
  {
    id: "atoStatus",
    kind: "choice",
    question: "Where are things at with the ATO right now?",
    hint: "Pick the one that fits best.",
    options: ["On a payment plan", "Not on a plan yet", "I've had a director penalty notice", "Not sure"],
  },
  {
    id: "property",
    kind: "choice",
    question: "Do you own property?",
    options: ["Yes, my home", "Yes, an investment property", "Yes, both", NO_PROPERTY],
  },
  {
    id: "propertyValue",
    kind: "choice",
    question: "Roughly what is your property worth?",
    hint: "If you own more than one, add them together.",
    options: ["Under $600k", "$600k – $1m", "$1m – $1.5m", "$1.5m – $2.5m", "$2.5m+"],
    skipIf: noProperty,
  },
  {
    id: "mortgage",
    kind: "choice",
    question: "And roughly how much is still owing on it?",
    hint: "A rough figure is fine.",
    options: ["Nothing, it's paid off", "Under $300k", "$300k – $600k", "$600k – $1m", "$1m+"],
    skipIf: noProperty,
  },
  {
    id: "trading",
    kind: "choice",
    question: "How long has your business been trading?",
    options: ["Under 12 months", "1 – 2 years", "2 – 5 years", "5+ years"],
  },
  {
    id: "structure",
    kind: "choice",
    question: "How is your business set up?",
    options: ["Sole trader", "Company", "Trust", "Partnership"],
  },
  {
    id: "lodgements",
    kind: "choice",
    question: "Are your tax returns and BAS up to date?",
    hint: "No judgement. It just helps Robert know which lenders fit.",
    options: ["All up to date", "Mostly, a few behind", "Quite a few behind", "Not sure"],
  },
  {
    id: "state",
    kind: "choice",
    question: "Which state are you in?",
    options: ["VIC", "NSW", "QLD", "WA", "SA", "TAS", "ACT", "NT"],
    compact: true,
  },
  {
    id: "contact",
    kind: "contact",
    question: "Where should Robert call you?",
    hint: `He'll call ${site.callback} for a 15-minute chat. No obligation.`,
  },
];

export const quizTrust = ["Licensed broker", `Australian Credit Licence ${site.acl}`, "Your details stay with us"];
