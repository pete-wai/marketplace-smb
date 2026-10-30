# Review of annual counts and non-pilot 20x · October 30, 2026

> Superseded audit record: the figures below describe the earlier review, not current results. Use [current participation](participation.md), [annual cohorts](annual-cohorts.md), and the [second-pass checkpoint](second-pass.md). Current certified non-pilot 20x is 3/8; the historical-size audit remains preserved.

This review keeps the Marketplace snapshot fixed so classification and presentation changes can be distinguished from new listings.

## What was misleading

The first site compared current evidence in the pathway chart with sparse historical evidence in the annual chart. It also labeled the former with documented-only percentages and the latter with documented-plus-likely percentages. Both were computed as designed, but the inconsistent presentation made them look contradictory. The low historical count was not a count of every small business ever certified.

The original committed data contained 14 distinct providers with historical likely-small evidence, not a complete total of small firms. After adding nearby dated Files.com and Bland AI testimony, that becomes **16 of 471 (3.4%)**. Using **current** evidence for the same 471 ever-certified provider identities identifies **105 of 471 (22.3%)** in the small group. Neither number is substituted for the other.

For the currently-certified population, current evidence identifies **104 of 460 (22.6%)** as documented or likely small. This now reconciles exactly between current participation and the all-years certification summary when the same population, unit, and evidence date are selected.

Annual provider rows can count a company in several years if it has several products. The all-years total counts each provider once. Annual product/package rows are additive. New raw-record recount tests verify those relationships rather than merely checking the existing formulas against themselves.

## Two groups, consistently

1. **Documented or likely small**
2. **Documented not small, likely not small, or unknown**

Both divide by the full row population. The two percentages total 100% before rounding. Unknowns belong to the second group without being asserted to be large. Individual evidence tiers and confidence remain available in each assessment for audit. Tables, graph labels, graph widths, report CSVs, and evidence filters now use the same grouping. Both chart sections use a shared component and identical columns. Each bar is a 100% composition; it does not encode absolute volume.

## Certified non-pilot 20x re-review

**4 of 8 (50.0%)** are now in the first group; **4 of 8 (50.0%)** are in the second, all four with unresolved underlying size.

| Provider | Group | Basis and limitation |
| --- | --- | --- |
| Files.com | Documented or likely small | Self-described small organization, about 60–70 employees, in the September 15 FedRAMP session. Low confidence; receipts and investment/affiliate control unverified. |
| Bland AI | Documented or likely small | Self-described small organization, fewer than 100 employees, in the same session. Low confidence; employee count alone does not establish cloud/software receipts eligibility. |
| Wisedocs USA Inc. | Documented or likely small | Probable exact legal-name SBA match reports small under 518210; provider agreement confirms the U.S. entity name. Missing website/UEI corroboration and differing locations prevent a documented match. |
| Perplexity AI | Documented or likely small | Exact-UEI SBA match reports small under 519290 (web search; 1,000-employee standard), not under primary 518210. Marketplace search functionality supports a service-specific likely classification; eligibility depends on the procurement NAICS. |
| Anysphere / Cursor | Documented not small, likely not small, or unknown | Large recurring-revenue reports are not completed-year SBA receipts. Retained unknown. |
| Eleven Labs | Documented not small, likely not small, or unknown | Official ARR disclosure is not the applicable completed-year receipts average. Retained unknown. |
| Harness | Documented not small, likely not small, or unknown | Merger and projected ARR are documented; sufficient applicable receipts/affiliate evidence is not. Retained unknown. |
| Mycroft Technologies | Documented not small, likely not small, or unknown | Startup stage alone does not establish size or U.S. concern eligibility. No qualifying representation found. Not the unrelated Mycroft AI voice-assistant company. |

Files.com and Bland AI testimony supports tentative historical inferences 19 and 21 days after certification, explicitly marked low confidence. Current SBA observations for Wisedocs and Perplexity are not projected backward. Perplexity previously participated in the pilot: current-pathway counts and first-certification-pathway counts therefore differ legitimately.

Sources: [provider testimony, official FedRAMP channel](https://www.youtube.com/watch?v=8XCfY-lRNtY&t=195s), [Files.com ownership context](https://www.files.com/about), [Wisedocs SBA candidate](https://search.certifications.sba.gov/profile/T6CBLTDV7ZY5/20V08), [Wisedocs legal agreement](https://www.wisedocs.ai/policies), [Perplexity SBA record](https://search.certifications.sba.gov/profile/P9N9FFAUBLQ4/15SW3), [Marketplace service description](https://www.fedramp.gov/marketplace/products/FR2604643715/), [SBA size standards](https://www.ecfr.gov/current/title-13/section-121.201), [Harness merger disclosure](https://www.harness.io/blog/harness-traceable). Remaining company sources are retained in `research/review.json` and the provider downloads.

## Verification

15 tests pass, including an independent recount of every annual cohort, both all-years population choices, percentage complements, additive product totals, and current-cohort/current-participation reconciliation. Svelte checking and production generation pass. Browser controls remain disabled; no visual or interactive browser verification is claimed.
