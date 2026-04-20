export function matchTriggerLogic(lisa) {

let finalVerbiages = [];
let finalRecommendation = "Page Optimized";
let finalRuleId = "OPTIMIZED";
let finalRecommendations = [];

// ---------- BASE LOGIC ----------

if (lisa.isAnalyticsPage && lisa.isZeroReported) {

if (!lisa.isComplete) {
finalRuleId = "COMPLETE_PAGE";
finalRecommendation = "Complete Page";
// Updated Verbiage 1
finalVerbiages.push("Looking at your Page setup, we could see that it’s incomplete and missing some basic information. To make the most of your LinkedIn Page, we would recommend completing your page, as Pages with complete information get 30% more weekly views. If you need help with updating your page, please feel free to review the resources below:\n\n• https://www.linkedin.com/help/linkedin/answer/111872\n• https://business.linkedin.com/marketing-solutions/linkedin-pages/best-practices");
finalRecommendations.push("Complete Page");
}

else {
finalRuleId = "ENGAGED_QUALITY";
finalRecommendation = "Engaged Quality Pages";
// Updated Verbiage 2
finalVerbiages.push("After taking a closer look at your Page, I noticed there’s an opportunity to strengthen engagement and build a follower base aligned with your goals. As Pages start attracting more followers, we typically see growth compound more naturally over time, especially when discoverability and posting cadence are optimized.\n\nHere is a quick plan for small businesses that you can easily implement to start growing your LinkedIn presence organically: https://business.linkedin.com/advertise/linkedin-pages/for-small-business");
finalRecommendations.push("Engaged Quality Pages");
}

}

else if (lisa.isAnalyticsPage) {

if (lisa.sponsoredHasActivity) {
finalRuleId = "CMT_UPSELL";
finalRecommendation = "CMT Upsell";
// Updated Verbiage 4
finalVerbiages.push("We see that you have been on quite a journey with LinkedIn, with a strong organic presence. The time is right for you to explore advertising with LinkedIn using our powerful B2B platform.\n\nHere are 6 simple steps for you to get started:\nhttps://business.linkedin.com/advertise/ads/how-to-advertise-on-linkedin");
finalRecommendations.push("CMT Upsell");
}

else {
finalRuleId = "PAGES_BOOST";
finalRecommendation = "Pages Boost";
// Updated Verbiage 3
finalVerbiages.push("I see that your Company Page has a very active LinkedIn presence. Your Page is at the right stage for you to explore boosting. Boosting enables you to use real, member-generated demographic data to reach the right professionals based on seniority, industry, job function, and more. It’s an easy way to drive views and engagement on your post.\n\nHere is a guide to best practices when it comes to boosting:\nhttps://business.linkedin.com/content/dam/lem/business/en/advertise/ads/boosting/lms-boosting-best-practices-guide.pdf");
finalRecommendations.push("Pages Boost");
}

}

else {

if (!lisa.isComplete) {
finalRuleId = "COMPLETE_PAGE";
finalRecommendation = "Complete Page";
// Updated Verbiage 1
finalVerbiages.push("Looking at your Page setup, we could see that it’s incomplete and missing some basic information. To make the most of your LinkedIn Page, we would recommend completing your page, as Pages with complete information get 30% more weekly views. If you need help with updating your page, please feel free to review the resources below:\n\n• https://www.linkedin.com/help/linkedin/answer/111872\n• https://business.linkedin.com/marketing-solutions/linkedin-pages/best-practices");
finalRecommendations.push("Complete Page");
}

else if (lisa.numericFollowers <= 150) {
finalRuleId = "ENGAGED_QUALITY";
finalRecommendation = "Engaged Quality Pages";
// Updated Verbiage 2
finalVerbiages.push("After taking a closer look at your Page, I noticed there’s an opportunity to strengthen engagement and build a follower base aligned with your goals. As Pages start attracting more followers, we typically see growth compound more naturally over time, especially when discoverability and posting cadence are optimized.\n\nHere is a quick plan for small businesses that you can easily implement to start growing your LinkedIn presence organically: https://business.linkedin.com/advertise/linkedin-pages/for-small-business");
finalRecommendations.push("Engaged Quality Pages");
}

}

// ---------- PREMIUM LAYER ----------

if (lisa.isUpsellVisible) {
// Updated Verbiage 5
finalVerbiages.push("As you're looking to maximize your business presence, have you considered upgrading to a LinkedIn Premium Company Page? It's designed to help you grow your followers up to 6.7x faster. You get exclusive features like the gold Premium badge to boost credibility, custom call-to-action buttons, the ability to see exactly who visits your page, and tools to auto-invite engaged prospects.\n\nYou can check out all the features and start a free trial here:\nhttps://premium.linkedin.com/small-business/company-page");
finalRecommendations.push("PCP Upsell (New Sub)");
}

if (lisa.isPCPActive) {
// Updated Verbiage 6
finalVerbiages.push("Since you're a Premium Company Page subscriber, I wanted to quickly check in and make sure you're getting the absolute most out of your subscription.\n\nMany users miss out on a few powerful features that are already included in your plan:\nCustom Testimonials: You can pin a testimonial from a past client right on your Page to instantly earn trust from new prospects.\n\nAuto-Invite to Follow: Make sure you have this turned on. It automatically invites anyone who engages with your content to follow your Page, saving you tons of manual work.\nEnhanced Visibility: Your Premium status automatically qualifies you for exclusive placements across LinkedIn to boost your reach.\n\nLearn how to best use your LinkedIn Premium Company Page subscription with our upcoming webinar at: https://linkedinpremiumcp.splashthat.com/zest");
finalRecommendations.push("PCP Optimization");

// Kept old retention verbiage as per instructions
finalVerbiages.push("I understand you’re considering canceling your Premium Company Page, and wanted to quickly check in before you decide.\n\nBased on your goals, there may still be value you can get from the subscription especially through features like the:\n\n• Custom call to action button to drive visits or inquiries,\n• Credibility highlights and testimonials to build trust with new visitors, and\n• Tools that help you grow relevant followers more efficiently by inviting people who’ve already engaged with your content\n\nIf helpful, we’re also hosting a short webinar that walks through practical ways to use these features effectively: https://linkedinpremiumcp.splashthat.com/zest\n\nI’m happy to help you get more value from your subscription or answer any questions. If you still choose to cancel after reviewing this, just let me know.");
finalRecommendations.push("PCP Retention");
}

// ---------- FALLBACK ----------

if (finalVerbiages.length === 0) {
  finalVerbiages.push("This page meets all current strategic criteria.\n\nNote: Please check the Analytics tab for Pages Boost and CMT Upsell recommendations.");
  finalRecommendations.push(finalRecommendation);
}

// ---------- SAFETY GUARD ----------
if (finalRecommendations.length !== finalVerbiages.length) {
finalRecommendations = finalVerbiages.map((_, i) => finalRecommendations[i] || finalRecommendation);
}

return {
ruleId: finalRuleId,
recommendation: finalVerbiages.length > 1 ? finalRecommendations : finalRecommendation,
verbiage: finalVerbiages
};

}