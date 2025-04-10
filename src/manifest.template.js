// src/manifest.template.js
export const manifestTemplate = {
  manifest_version: 3,
  name: "Auto Direct Button Clicker",
  version: "1.1",
  description: "Automatically clicks .direct-btn in new .results entries on PoE trade.",
  permissions: ["storage", "scripting", "activeTab"],
  host_permissions: [
    "https://www.pathofexile.com/trade2/search/poe2/*"
  ],
  // background will be injected by the build script
  action: {
    default_popup: "popup.html",
    default_title: "Toggle AutoClick"
  },
  content_scripts: [
    {
      matches: [
        "https://www.pathofexile.com/trade2/search/poe2/*"
      ],
      js: ["content.js"],
      run_at: "document_idle"
    }
  ]
};