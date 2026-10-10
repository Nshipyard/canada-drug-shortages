# Showcase drafts (DRAFT for review)

Umbrella Q&A for "Drug Shortages, Ranked". Every number from src/lib/*.json (reference date 2025-12-01).

---

## Q1. Which drug companies own most of Canada's critical shortages?

**Quotable stat:** Three companies account for 49% of Canada's 59 Tier 3 critical shortage reports: Teva Canada (13), Pfizer Canada ULC (9), Pharmascience (7).

**Mechanism:** Tier 3 marks the shortages that could hit Canada's drug supply and health care system hardest, assigned by a federal-provincial Tier Assignment Committee. The concentration is sharper than the raw report counts suggest: Apotex files the most reports overall (3,633) but holds only 3 Tier 3 reports, while the critical tier is dominated by Teva, Pfizer Canada ULC, and Pharmascience. The top 5 companies hold 59.3% of the 59.

**How we know:** counts over the tier3 flag in reports.json, concentration shares from insights.json (tier3_top3_share 0.4915, tier3_top5_share 0.5932).

**Cite this:** Three companies account for 49% of Canada's 59 Tier 3 critical drug shortage reports (Teva Canada 13, Pfizer Canada ULC 9, Pharmascience 7). Source: Drug Shortages, Ranked, Health Product Shortages Canada extract archived 2025-12-20.

**Share text:** Three companies account for half of Canada's critical drug shortages: Teva Canada (13), Pfizer Canada ULC (9), Pharmascience (7).

**FR**
Question : Quelles entreprises pharmaceutiques sont à l'origine de la plupart des pénuries critiques au Canada ?
Stat : Trois entreprises représentent 49 % des 59 rapports canadiens de pénurie critique de niveau 3 : Teva Canada (13), Pfizer Canada ULC (9), Pharmascience (7).
Mécanisme : Le niveau 3 désigne les pénuries qui pourraient frapper le plus durement l'approvisionnement en médicaments et le système de santé du Canada, attribuées par un comité fédéral-provincial. La concentration est plus marquée que ne le suggèrent les nombres bruts : Apotex dépose le plus de rapports (3 633) mais ne détient que 3 rapports de niveau 3. Les 5 premières entreprises détiennent 59,3 % des 59.
Citer : Trois entreprises représentent 49 % des 59 rapports canadiens de pénurie critique de niveau 3 (Teva Canada 13, Pfizer Canada ULC 9, Pharmascience 7). Source : Drug Shortages, Ranked, extrait de Health Product Shortages Canada archivé le 2025-12-20.
Partager : Trois entreprises représentent la moitié des pénuries critiques de médicaments au Canada : Teva Canada (13), Pfizer Canada ULC (9), Pharmascience (7).

---

## Q2. Are critical shortages rising?

**Quotable stat:** Tier 3 designations went from 4 in 2022 to 28 in 2025, while total new reports stayed roughly flat.

**Mechanism:** The honest caveat is the data's own history: the Tier 3 flag first appears in this dataset in 2022, when the current committee process was formalized, so the curve mixes real growth with the flag's rollout. The 2022 (4), 2023 (6), 2024 (21), 2025 (28) sequence is computed from the Date Created field of the 59 flagged reports.

**How we know:** insights.json tier3_by_year. The trends.json quarterly series shows Tier 3 bars first non-zero in 2022-Q1.

**Cite this:** Tier 3 critical shortage designations rose from 4 in 2022 to 28 in 2025. The Tier 3 flag itself first appears in the dataset in 2022. Source: Drug Shortages, Ranked, Health Product Shortages Canada extract archived 2025-12-20.

**Share text:** Critical drug shortage designations in Canada went from 4 in 2022 to 28 in 2025. The flag itself dates to 2022.

**FR**
Question : Les pénuries critiques augmentent-elles ?
Stat : Les désignations de niveau 3 sont passées de 4 en 2022 à 28 en 2025, tandis que le nombre total de nouveaux rapports restait à peu près stable.
Mécanisme : La réserve honnête, c'est l'histoire même des données : le drapeau de niveau 3 apparaît pour la première fois en 2022, année de formalisation du processus actuel du comité, donc la courbe mêle croissance réelle et déploiement du drapeau. La séquence 2022 (4), 2023 (6), 2024 (21), 2025 (28) est calculée à partir du champ Date Created des 59 rapports marqués.
Citer : Les désignations de pénurie critique de niveau 3 sont passées de 4 en 2022 à 28 en 2025. Le drapeau de niveau 3 lui-même apparaît pour la première fois en 2022. Source : Drug Shortages, Ranked, extrait de Health Product Shortages Canada archivé le 2025-12-20.
Partager : Les désignations de pénurie critique de médicaments au Canada sont passées de 4 en 2022 à 28 en 2025. Le drapeau lui-même date de 2022.

---

## Q3. How long does a shortage last?

**Quotable stat:** The median resolved shortage ran 58 days. The mean was 140 days. Open shortages on 2025-12-01 had already run a median of 647 days.

**Mechanism:** The mean sits far above the median because of a long tail of multi-year shortages: the longest resolved shortage ran 5,685 days (15.6 years). The median and mean come from 20,347 resolved reports with computable duration. Open shortages are the slow ones, which is why the 1,742 still open on the reference date had already run a median of 646.5 days.

**How we know:** insights.json duration fields. Duration = actual end minus actual start, capped at 2025-12-01.

**Cite this:** The median resolved drug shortage lasted 58 days, the mean 140 days. Shortages still open on 2025-12-01 had run a median of 647 days. Source: Drug Shortages, Ranked, Health Product Shortages Canada extract archived 2025-12-20.

**Share text:** The median resolved drug shortage lasts 58 days, the mean 140. Open ones had already run 647 days.

**FR**
Question : Combien de temps dure une pénurie ?
Stat : La pénurie résolue médiane a duré 58 jours. La moyenne était de 140 jours. Les pénuries ouvertes le 2025-12-01 duraient déjà depuis 647 jours en médiane.
Mécanisme : La moyenne dépasse largement la médiane à cause d'une longue traîne de pénuries pluriannuelles : la plus longue pénurie résolue a duré 5 685 jours (15,6 ans). La médiane et la moyenne proviennent de 20 347 rapports résolus avec une durée calculable. Les pénuries ouvertes sont les plus lentes, d'où les 646,5 jours en médiane déjà écoulés pour les 1 742 encore ouvertes à la date de référence.
Citer : La pénurie médiane résolue a duré 58 jours, la moyenne 140 jours. Les pénuries encore ouvertes le 2025-12-01 duraient depuis 647 jours en médiane. Source : Drug Shortages, Ranked, extrait de Health Product Shortages Canada archivé le 2025-12-20.
Partager : La pénurie médiane résolue dure 58 jours, la moyenne 140. Les ouvertes duraient déjà depuis 647 jours.

---

## Q4. Which drug classes short out most?

**Quotable stat:** Respiratory drugs hold 15 of the 59 Tier 3 reports, the highest critical count and share of any class. Nervous system drugs lead raw volume with 6,785 reports.

**Mechanism:** Raw volume and criticality point in different directions. Nervous system (6,785) and cardiovascular (5,082) drugs lead total reports, but critical shortages concentrate in respiratory drugs (15 Tier 3 of 744 reports, a 2.0% critical share) and cancer drugs, antineoplastic and immunomodulating agents (13 of 1,249). The earlier project brief claimed antineoplastic agents held the highest critical share. The computed data corrected it: respiratory leads on both count (15 vs 13) and share (2.02% vs 1.04%).

**How we know:** atc.json level-1 breakdown. Shares computed as tier3_reports divided by reports per class.

**Cite this:** Respiratory drugs hold 15 of Canada's 59 Tier 3 critical shortage reports, the most of any drug class. Cancer drugs hold 13. Source: Drug Shortages, Ranked, Health Product Shortages Canada extract archived 2025-12-20.

**Share text:** Respiratory drugs hold 15 of Canada's 59 critical Tier 3 shortage reports, more than any other class.

**FR**
Question : Quelles classes de médicaments manquent le plus ?
Stat : Les médicaments respiratoires représentent 15 des 59 rapports de niveau 3, le nombre et la part critiques les plus élevés de toutes les classes. Les médicaments du système nerveux mènent le volume brut avec 6 785 rapports.
Mécanisme : Le volume brut et la criticité pointent dans des directions différentes. Le système nerveux (6 785) et le cardiovasculaire (5 082) mènent les rapports totaux, mais les pénuries critiques se concentrent dans les médicaments respiratoires (15 de niveau 3 sur 744 rapports, soit 2,0 %) et les médicaments contre le cancer (13 sur 1 249). Une première version du dossier attribuait la part critique la plus élevée aux antinéoplasiques. Les données calculées l'ont corrigé : le respiratoire mène en nombre (15 contre 13) comme en part (2,02 % contre 1,04 %).
Citer : Les médicaments respiratoires représentent 15 des 59 rapports canadiens de pénurie critique de niveau 3, plus que toute autre classe. Les médicaments contre le cancer en représentent 13. Source : Drug Shortages, Ranked, extrait de Health Product Shortages Canada archivé le 2025-12-20.
Partager : Les médicaments respiratoires représentent 15 des 59 pénuries critiques de niveau 3 au Canada, plus que toute autre classe.

---

## Q5. Who files the most reports, period?

**Quotable stat:** Apotex filed 3,633 reports, Teva 3,077, Sandoz 2,261. Volume alone does not mean chronic.

**Mechanism:** Most reports resolve, and the chronicity ranking comes from Tier 3 and duration data, not the raw count. Apotex leads volume with 3,633 reports but holds only 3 Tier 3 reports. Pharmascience filed 1,340 reports but holds 7 Tier 3 reports. The company table also tracks shortage-days and median duration, the two measures that separate routine churn from structural shortage.

**How we know:** companies.json ranking. 239 canonical companies after 16 merges.

**Cite this:** Apotex filed 3,633 shortage reports, Teva Canada 3,077, Sandoz 2,261. Volume alone does not measure chronicity. Source: Drug Shortages, Ranked, Health Product Shortages Canada extract archived 2025-12-20.

**Share text:** Apotex filed 3,633 drug shortage reports, Teva 3,077, Sandoz 2,261. Volume is not chronicity.

**FR**
Question : Qui dépose le plus de rapports, tout court ?
Stat : Apotex a déposé 3 633 rapports, Teva 3 077, Sandoz 2 261. Le volume seul ne signifie pas chronicité.
Mécanisme : La plupart des rapports se résolvent, et le classement de chronicité repose sur les données de niveau 3 et de durée, pas sur le nombre brut. Apotex mène le volume avec 3 633 rapports mais ne détient que 3 rapports de niveau 3. Pharmascience a déposé 1 340 rapports mais en détient 7 de niveau 3. La table des entreprises suit aussi les jours de pénurie et la durée médiane, les deux mesures qui séparent la rotation ordinaire de la pénurie structurelle.
Citer : Apotex a déposé 3 633 rapports de pénurie, Teva Canada 3 077, Sandoz 2 261. Le volume seul ne mesure pas la chronicité. Source : Drug Shortages, Ranked, extrait de Health Product Shortages Canada archivé le 2025-12-20.
Partager : Apotex a déposé 3 633 rapports de pénurie, Teva 3 077, Sandoz 2 261. Le volume n'est pas la chronicité.

---

## Q6. What this registry cannot say. (honest limit card)

**Quotable stat:** 24,377 reports: 21,945 resolved, 1,742 open, 690 avoided. One report is one product presentation, not one patient.

**Mechanism:** The registry records product presentations, and pharmacists often substitute, so report counts do not measure patients harmed. "Resolved" can mean the shortage ended or was avoided. Companies self-report, so open reports may be stale. 21 reports carry no company name and 96 carry no ATC code. They are counted in totals but excluded from rankings.

**Cite this:** 24,377 shortage reports: 21,945 resolved, 1,742 open, 690 avoided. Reports are product presentations, not patients. Source: Drug Shortages, Ranked, Health Product Shortages Canada extract archived 2025-12-20.

**Share text:** Canada's drug shortage registry: 24,377 reports. One report is one product presentation, not one patient.

**FR**
Question : Ce que ce registre ne peut pas dire.
Stat : 24 377 rapports : 21 945 résolus, 1 742 ouverts, 690 évités. Un rapport, c'est une présentation de produit, pas un patient.
Mécanisme : Le registre enregistre des présentations de produit, et les pharmaciens substituent souvent, donc les nombres de rapports ne mesurent pas les patients lésés. « Résolu » peut signifier que la pénurie a pris fin ou a été évitée. Les entreprises déclarent elles-mêmes, donc les rapports ouverts peuvent être périmés. 21 rapports n'ont pas de nom d'entreprise et 96 n'ont pas de code ATC. Ils sont comptés dans les totaux mais exclus des classements.
Citer : 24 377 rapports de pénurie : 21 945 résolus, 1 742 ouverts, 690 évités. Les rapports sont des présentations de produit, pas des patients. Source : Drug Shortages, Ranked, extrait de Health Product Shortages Canada archivé le 2025-12-20.
Partager : Le registre canadien des pénuries : 24 377 rapports. Un rapport, c'est une présentation de produit, pas un patient.
