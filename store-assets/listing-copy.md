# Store Listing Copy

## Core Metadata

Name: CourtListener Copy Citation

Short description:
Copy formatted CourtListener citations with pincites directly from selected opinion text.

Suggested categories:
- Chrome Web Store: Productivity
- Firefox Add-ons: Other

Suggested tags / keywords:
legal research, citations, CourtListener, law, Bluebook, pincite, clipboard

Homepage URL:
https://github.com/jonjonrankin/courtlistener_copy

Support URL:
https://github.com/jonjonrankin/courtlistener_copy/issues

Privacy policy URL:
https://github.com/jonjonrankin/courtlistener_copy/blob/main/PRIVACY.md

Visibility:
- Chrome Web Store: Unlisted
- Firefox Add-ons: Unlisted / self-distributed, unless you want a public AMO listing page

## Longer Description

CourtListener Copy Citation helps legal researchers copy cleaner citations from CourtListener opinion pages.

Select text inside a CourtListener opinion and a small popup appears near the selection. From there, you can copy either a formatted citation with pincite or the selected quote followed by the citation. When an opinion has multiple reporters, the popup lets you choose which reporter to cite.

Features:
- Copy a citation with pincite from selected opinion text
- Copy selected text followed by a citation
- Choose between available reporters on multi-reporter opinions
- Format case names, court names, years, and page ranges locally in the browser
- Runs only on CourtListener opinion pages
- No analytics, tracking, remote code, or external API calls

This extension is designed for lightweight legal research workflows where you want a fast citation without leaving the opinion page.

## Chrome Permission Justification

Permission: clipboardWrite

Justification:
CourtListener Copy Citation needs clipboard write access so it can copy the formatted citation, or the selected text plus citation, after the user clicks one of the copy buttons. The extension does not read from the clipboard.

Host access:
https://*.courtlistener.com/opinion/*

Justification:
The extension runs only on CourtListener opinion pages. It reads selected opinion text and visible citation metadata from the current page so it can format a local citation with a pincite.

Remote code:
No remote code is used.

Data use:
The extension does not collect, store, sell, or transmit user data. It formats citations locally in the browser.

## Firefox Data Collection Disclosure

Data collection:
This extension does not collect or transmit any user data.

Manifest declaration:
`browser_specific_settings.gecko.data_collection_permissions.required` is set to `["none"]`.

## Single Purpose Statement

CourtListener Copy Citation lets users copy formatted legal citations with pincites from CourtListener opinion pages.

## Screenshot Assets

Chrome screenshot:
`store-assets/chrome-screenshot-1280x800.png`

Chrome small promotional image:
`store-assets/chrome-small-promo-440x280.png`

Firefox can reuse the same screenshot if a screenshot is requested during submission.
