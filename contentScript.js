function getLiveSignals() {
  const bodyText = document.body.innerText;
  const htmlContent = document.documentElement.innerHTML; 
  const currentUrl = window.location.href;
  
  // --- NEW: COMPANY ID EXTRACTION ---
  const urlMatch = currentUrl.match(/\/(?:company|school|showcase)\/(\d+)/);
  const companyId = urlMatch ? urlMatch[1] : "N/A";

  // 1. PAGE NAME & FOLLOWER DETECTION
  const titleEl = document.querySelector("h1, .org-top-card-summary__title");
  const title = titleEl ? titleEl.innerText.trim() : document.title.split(":")[0].trim();

  let followers = "0";
  const fMatch = bodyText.match(/([\d,.]+)\s+followers/i);
  if (fMatch) followers = fMatch[1];
  
  const numericFollowers = parseInt(followers.replace(/,/g, '')) || 0;

  // 2. LOGO & BANNER DETECTION
  const logoImg = document.querySelector('.org-top-card-primary-content__logo img, .org-top-card-summary__logo img, img[class*="logo"]');
  const isGhost = !logoImg || logoImg.classList.contains('ghost-company') || (logoImg.src && logoImg.src.includes('ghost-company'));
  
  // Banner detection
  const bannerEmpty = !!document.querySelector('.org-bg-image-empty-state__content');

  const hasRealLogo = logoImg && !isGhost;
  const isComplete = !!hasRealLogo && !bannerEmpty; 

  // 3. ZERO METRICS DETECTION
  const hasZeroOrganic = bodyText.includes("Organic\n0") || bodyText.includes("Organic 0");
  const hasZeroSponsored = bodyText.includes("Sponsored\n0") || bodyText.includes("Sponsored 0");
  const isZeroReported = hasZeroOrganic && hasZeroSponsored;

  // 4. MEMBER DETECTION
  const mMatch = bodyText.match(/([\d,.]+)\s+(employees|members)/i);
  const mappedMembers = mMatch ? parseInt(mMatch[1].replace(/,/g, '')) : 0;

  // 5. PCP PREMIUM DETECTION
  const premiumBadge = document.querySelector('.premium-company-page-badge, .premium-entity-badge, [data-test-premium-badge], .org-top-card-summary__premium-badge');
  const goldIconExists = htmlContent.includes("gold-icon") || htmlContent.includes("premium-icon") || htmlContent.includes("premium_company_page_badge");
  const hasVisiblePremiumText = !!Array.from(document.querySelectorAll('span, div')).find(el => el.textContent.trim() === "Premium");
  const isPCPActive = !!premiumBadge || goldIconExists || hasVisiblePremiumText;

  // 6. PCP UPSELL SCANNER
  const hasUpsellText = bodyText.includes("Enhance your Page") || bodyText.includes("Upgrade your Page") || bodyText.includes("6.7x faster with Premium") || bodyText.includes("start 1 month free");
  const hasUpsellBanner = bodyText.includes("Auto-invite content engagers") || bodyText.includes("Redeem 1 month for ₹0");
  const isUpsellVisible = (hasUpsellText || hasUpsellBanner) && !isPCPActive;

  // 7. ADVANCED SPONSORED METRICS SCRAPER
  const isAnalyticsPage = currentUrl.includes("/analytics/");
  let sponsoredVal = -1;

  if (isAnalyticsPage) {
    const allElements = Array.from(document.querySelectorAll('span, div, p, td'));
    const sponsoredLabel = allElements.find(el => el.innerText.trim() === "Sponsored");
    if (sponsoredLabel) {
      const rowContainer = sponsoredLabel.closest('div[class*="container"], tr, li') || sponsoredLabel.parentElement;
      const numMatch = (rowContainer ? rowContainer.innerText : "").match(/Sponsored\s*([\d,.]+)/);
      if (numMatch) sponsoredVal = parseInt(numMatch[1].replace(/,/g, ''));
    }
  }

  return {
    title,
    domFollowers: followers,
    numericFollowers: numericFollowers,
    isComplete,
    isZeroReported, 
    sponsoredHasActivity: (sponsoredVal > 0),
    isPCPActive, 
    isUpsellVisible,
    isAnalyticsPage,
    companyId // Pass ID to popup
  };
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getPageData") {
    const signals = getLiveSignals();
    (async () => {
      const src = chrome.runtime.getURL('utils.js');
      const { matchTriggerLogic } = await import(src);
      const result = matchTriggerLogic(signals);
      // Include companyId in response
      sendResponse({ ...result, pageName: signals.title, followers: signals.domFollowers, companyId: signals.companyId });
    })();
    return true; 
  }
});