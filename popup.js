document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const adminBtn = document.getElementById("adminBtn");
  const recOutput = document.getElementById("rec-output");
  const overlay = document.getElementById("onboarding-overlay");

  // --- UPDATED: SECURE IDENTITY CHECK ---
  const storedData = await chrome.storage.local.get(['swiftpage_user_name', 'swiftpage_user_email']);
  let userRealName = storedData.swiftpage_user_name;
  let userRealEmail = storedData.swiftpage_user_email;

  if (!userRealName || !userRealEmail) {
    overlay.style.display = "flex";
  }

  document.getElementById("save-identity-btn").onclick = () => {
    const nameInput = document.getElementById("user-name-input").value.trim();
    const emailInput = document.getElementById("user-email-input").value.trim();
    
    if (nameInput && emailInput) {
      // --- UPDATED: SECURE STORAGE SET ---
      chrome.storage.local.set({
        'swiftpage_user_name': nameInput,
        'swiftpage_user_email': emailInput
      }, () => {
        userRealName = nameInput;
        userRealEmail = emailInput;

        // --- SIGNUP TRACKING LOG ---
        logToGoogleSheet("Signup", "New User Registration", "N/A", "0");

        overlay.style.display = "none";
        runAnalysis(); 
      });
    } else {
      alert("Please fill in both fields to activate SwiftPage.");
    }
  };

  // --- SWIFTPAGE ANALYTICS TRACKING ---
  async function logToGoogleSheet(action, title, company = "-", followers = "0", companyId = "N/A") { 
    if (!userRealName || !userRealEmail) return;

    const caseIdInput = document.getElementById("case-id-input");
    const caseIdValue = caseIdInput ? caseIdInput.value.trim() : "N/A";

    const formID = "1FAIpQLScbQnh92os3wxGGJC4UzVNke6FCK5u1MR4LHl2uiSUtyOBBrw"; 
    const entryAction = "entry.1173334499"; 
    const entryTitle = "entry.142158593"; 
    const entryUser = "entry.156849716"; 
    const entryCompany = "entry.1453777363";
    const entryFollowers = "entry.1673480008";
    const entryEmail = "entry.546733564"; 
    const entryCaseId = "entry.773810217"; 
    const entryCompanyId = "entry.483809784"; 

    const url = `https://docs.google.com/forms/d/e/${formID}/formResponse?` + 
                `${entryAction}=${encodeURIComponent(action)}&` + 
                `${entryTitle}=${encodeURIComponent(title)}&` + 
                `${entryUser}=${encodeURIComponent(userRealName)}&` + 
                `${entryCompany}=${encodeURIComponent(company)}&` + 
                `${entryFollowers}=${encodeURIComponent(followers)}&` + 
                `${entryEmail}=${encodeURIComponent(userRealEmail)}&` + 
                `${entryCaseId}=${encodeURIComponent(caseIdValue)}&` + 
                `${entryCompanyId}=${encodeURIComponent(companyId)}&` + 
                `submit=Submit`; 

    fetch(url, { mode: 'no-cors' }); 
  } 

  const runAnalysis = () => { 
    if (!userRealName || !userRealEmail) return;

    document.getElementById("status").textContent = "Analyzing..."; 

    chrome.tabs.sendMessage(tab.id, { action: "getPageData" }, (res) => { 
      if (chrome.runtime.lastError || !res) { 
        document.getElementById("status").textContent = "Error: Navigate to Admin Page"; 
        document.getElementById("status").style.color = "red"; 
        adminBtn.style.display = "block"; 
        return; 
      } 

      adminBtn.style.display = res.isAdmin ? "none" : "block"; 
      document.getElementById("status").textContent = "Analysis Complete"; 
      document.getElementById("status").style.color = "#057642"; 
      document.getElementById("page-val").textContent = res.pageName || "Unknown"; 
      document.getElementById("follower-val").textContent = res.followers || "0"; 

      recOutput.innerHTML = ""; 

      if (res.recommendation) { 
        const mainTitle = Array.isArray(res.recommendation) ? res.recommendation[0] : res.recommendation;
        logToGoogleSheet("View", mainTitle, res.pageName, res.followers, res.companyId); 
      } 

      const verbiages = Array.isArray(res.verbiage) ? res.verbiage : [res.verbiage]; 

      verbiages.forEach((text, index) => { 
        const blockTitle = Array.isArray(res.recommendation) 
          ? (res.recommendation[index] || res.recommendation[0] || "") 
          : (res.recommendation || ""); 

        const titleDiv = document.createElement("div"); 
        titleDiv.style.fontWeight = "700"; 
        titleDiv.style.fontSize = "14px"; 
        titleDiv.style.margin = "12px 0 6px 0"; 
        titleDiv.style.color = "rgba(0,0,0,0.9)"; 
        titleDiv.innerText = blockTitle; 

        if (Array.isArray(res.recommendation) || index === 0) {
          recOutput.appendChild(titleDiv); 
        }

        const textDiv = document.createElement("div"); 
        textDiv.style.marginBottom = "10px"; 
        textDiv.style.padding = "10px"; 
        textDiv.style.background = "#f9fafb"; 
        textDiv.style.borderRadius = "4px"; 
        textDiv.style.border = "1px solid #e5e7eb"; 

        const safe = String(text || "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");

        const withLinks = safe.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank">$1</a>');
        const withBullets = withLinks.replace(/•\s*/g, "&bull; ");
        textDiv.innerHTML = withBullets.replace(/\n/g, "<br>");

        const copyBtn = document.createElement("button"); 
        copyBtn.className = "btn-primary"; 
        copyBtn.style.marginBottom = "20px"; 
        copyBtn.innerText = `Copy Verbiage ${verbiages.length > 1 ? index + 1 : ""}`; 

        copyBtn.onclick = () => { 
          navigator.clipboard.writeText(text).then(() => { 
            logToGoogleSheet("Copy", blockTitle, res.pageName, res.followers, res.companyId); 
            const originalText = copyBtn.innerText; 
            copyBtn.innerText = "✓ Copied!"; 
            copyBtn.style.backgroundColor = "#057642"; 
            setTimeout(() => { 
              copyBtn.innerText = originalText; 
              copyBtn.style.backgroundColor = "#0a66c2"; 
            }, 2000); 
          }); 
        }; 

        recOutput.appendChild(textDiv); 
        recOutput.appendChild(copyBtn); 
      }); 
    }); 
  }; 

  adminBtn.addEventListener("click", () => { 
    let baseUrl = tab.url.split('?')[0].replace(/\/$/, ""); 
    if (baseUrl.includes("/company/") || baseUrl.includes("/school/") || baseUrl.includes("/showcase/")) { 
      const adminUrl = baseUrl + "/admin/dashboard/"; 
      chrome.tabs.update(tab.id, { url: adminUrl }); 
    } 
  }); 

  runAnalysis(); 
  document.getElementById("refreshBtn").addEventListener("click", runAnalysis); 
});
