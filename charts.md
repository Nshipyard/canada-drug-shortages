# Charts drafts (DRAFT for review)

Each chart is hand-built SVG (no chart library), computed from src/lib JSONs. Numbers verified against the computed files.

**What "Tier 3" means:** Tier 3 is Health Canada's critical tier: the shortages with the greatest potential impact on the drug supply and health care system, assigned by the federal-provincial Tier Assignment Committee. Every "Tier 3" below means a critical shortage.

**FR :** Le niveau 3 est le niveau critique de Santé Canada : les pénuries ayant le plus grand impact potentiel sur l'approvisionnement en médicaments et le système de soins de santé, attribuées par le comité fédéral-provincial d'attribution des niveaux. Chaque mention de « niveau 3 » ci-dessous désigne une pénurie critique.

---

## Chart A: Tier 3 quarterly timeline

**Finding as title:** Tier 3 designations climbed from 4 in 2022 to 28 in 2025, while total new reports stayed in their normal band.

**Exact computed numbers:** Quarterly series 2020-Q1 to 2025-Q4 (trends.json): tier3_new max 8 per quarter (2025-Q1 and 2025-Q2), all_new max 801 per quarter. Tier 3 bars are zero for every quarter before 2022-Q1. Annual new-report totals: 2022: 2,487, 2023: 2,845, 2024: 2,596, 2025: 1,870. Tier 3 by Date Created: 2022: 4, 2023: 6, 2024: 21, 2025: 28.

**What the chart shows:** 24 quarters on the x axis. Red bars: new Tier 3 reports per quarter (left axis, 0-8). Ink line: all new reports per quarter (right axis, 0-801). Legend labels both scales. X labels every 4th quarter.

**EN caption:** "New Tier 3 designations by quarter, 2020 to 2025"
**EN note:** "Bars: new Tier 3 reports per quarter (left axis). Line: all new reports per quarter (right axis). Tier 3 first appears in 2022."
**FR caption:** "Nouvelles désignations de niveau 3 par trimestre, 2020 à 2025"
**FR note:** "Barres : nouveaux rapports de niveau 3 par trimestre (axe de gauche). Courbe : tous les nouveaux rapports par trimestre (axe de droite). Le niveau 3 apparaît pour la première fois en 2022."

---

## Chart B: Company Tier 3 bar ranking, top 10

**Finding as title:** Ten companies hold 49 of the 59 critical shortages. Three hold 29.

**Exact computed numbers:** TEVA CANADA LIMITED 13, PFIZER CANADA ULC 9, PHARMASCIENCE INC 7, APOTEX INC 3, ASPEN PHARMACARE CANADA INC. 3, ACCORD HEALTHCARE INC 2, FRESENIUS KABI CANADA LTD 2, BAXTER CORPORATION 2, MINT PHARMACEUTICALS INC 2, SEARCHLIGHT PHARMA INC 2. Sum of top 10: 49. Top 3 = 29 of 59 = 49.2%. 24 companies hold at least one Tier 3 report (companies.json tier3 ranking).

**What the chart shows:** Horizontal bars, rank 1-10, length proportional to tier3_reports, value labels in red numerals. Top 3 bars at full red, 4-10 at 45% opacity.

**EN caption:** "Critical (Tier 3) shortage reports by company, top 10"
**EN note:** "Tier 3 is Health Canada's critical tier. 24 companies hold at least one critical shortage report. The top 10 hold 49 of 59."
**FR caption:** "Rapports de pénurie critique (niveau 3) par entreprise, 10 premières"
**FR note:** "Le niveau 3 est le niveau critique. 24 entreprises détiennent au moins un rapport de pénurie critique. Les 10 premières en détiennent 49 sur 59."

---

## Chart C: ATC class comparison, Tier 3 highlighted

**Finding as title:** Volume and criticality diverge by drug class: nervous system drugs lead with 6,785 reports, but respiratory drugs lead critical shortages with 15.

**Exact computed numbers (atc.json level 1, reports / tier3):** N 6785/13, C 5082/9, J 2072/4, A 2034/0, G 1350/0, L 1249/13, D 1099/0, B 1081/0, M 873/0, R 744/15, S 738/0, V 549/3, H 538/2, P 84/0, U 3/0. Critical shares: R 15/744 = 2.02% (highest), L 13/1249 = 1.04%, N 13/6785 = 0.19%, C 9/5082 = 0.18%.

**What the chart shows:** One row per ATC class (label letter + localized name). Left bar: total reports (ink, scale 0-6785, value labeled). Right bar: Tier 3 reports in that class (red, own scale 0-15, value labeled in red numerals). The two scales are labeled separately so the tiny Tier 3 counts stay visible.

**EN caption:** "Shortage reports by drug class, Tier 3 highlighted"
**EN note:** "Left bar: total reports per ATC level-1 class. Right bar: Tier 3 reports in that class (different scale, each labeled). Respiratory drugs lead critical shortages with 15."
**FR caption:** "Rapports de pénurie par classe de médicaments, niveau 3 en évidence"
**FR note:** "Barre de gauche : rapports totaux par classe ATC de niveau 1. Barre de droite : rapports de niveau 3 dans cette classe (échelle différente, chacun étiqueté). Les médicaments respiratoires mènent les pénuries critiques avec 15."
