# Data-fixes log entry (DRAFT for review)

**Dataset:** Health Product Shortages Canada monthly bulk extract, archived 2025-12-20 (drugshortagescanada.ca, now healthproductshortages.ca), reference date 2025-12-01. 24,377 shortage reports, 3,221 discontinuation reports. Pipeline: scripts/build_data.py produces src/lib JSONs and public/data CSVs.

---

## EN

### Problems and fixes

1. **BOM disclaimer row.** The raw extract's first row is a byte-order-mark disclaimer, not data. Fix: detect and drop it before parsing. Result: 0 data rows lost, header row parsed cleanly.

2. **DIN formatting.** DINs arrive as floats or digit-stripped strings. Fix: strip all non-digit characters, zero-pad to 8 digits. Result: every DIN is a comparable 8-digit string (e.g. report 97054, DIN 02245669).

3. **Company name variants.** The same company appears under near-identical strings ("ALK ABELLO A/S" vs "ALK-ABELLO INC", "ALLERGAN INC" vs "ALLERGAN PHARMA CO."). Fix: deterministic normalization to canonical names, 16 merge groups logged with row counts in public/data/company_merges.json. Result: 239 canonical companies.

4. **0001-01-01 placeholder dates.** Missing dates are encoded as 0001-01-01. Fix: treat them as missing rather than real dates. Result: no 1-January-year-1 dates in duration math. Affected rows keep null durations.

5. **End before start.** 25 rows have an actual end date before the actual start date (impossible durations). Fix: quarantine the rows from duration math (duration set to null, row kept) and log them in public/data/quarantine.json. Result: 25 quarantined, median and mean durations computed over 20,347 resolved reports with computable duration.

### Result counts

- 24,377 shortage reports. 3,221 discontinuation reports (tracked separately, excluded from rankings)
- 239 canonical companies (16 merge groups)
- 25 quarantined rows. 21 reports with no company name. 96 with no ATC code. 4 with no DIN (counted in totals, excluded from rankings)

### Before/after examples

- "ALLERGAN PHARMA CO." (6 rows) -> "ALLERGAN INC" (126 + 6 rows, per company_merges.json)
- "ALK-ABELLO INC" (7 rows) -> "ALK ABELLO A/S" (12 + 7 rows, per company_merges.json)
- Report 172409 (end before start) -> duration null, row kept, logged in quarantine.json
- DIN rule: float or digit-stripped DINs -> 8-digit zero-padded strings (report 97054 carries DIN 02245669)

---

## FR

### Problèmes et correctifs

1. **Ligne d'avertissement BOM.** La première ligne de l'extrait brut est un avertissement d'ordre des octets, pas une donnée. Correctif : détection et suppression avant l'analyse. Résultat : 0 ligne de données perdue, en-tête analysé proprement.

2. **Formatage des DIN.** Les DIN arrivent en flottants ou en chaînes amputées. Correctif : suppression de tout caractère non numérique, complétion par des zéros jusqu'à 8 chiffres. Résultat : chaque DIN est une chaîne comparable de 8 chiffres (ex. rapport 97054, DIN 02245669).

3. **Variantes de noms d'entreprises.** La même entreprise apparaît sous des chaînes quasi identiques (« ALK ABELLO A/S » contre « ALK-ABELLO INC »). Correctif : normalisation déterministe vers des noms canoniques, 16 groupes de fusion journalisés avec nombres de lignes dans public/data/company_merges.json. Résultat : 239 entreprises canoniques.

4. **Dates fictives 0001-01-01.** Les dates manquantes sont encodées 0001-01-01. Correctif : traitées comme manquantes, pas comme de vraies dates. Résultat : aucune date du 1er janvier de l'an 1 dans le calcul des durées. Les lignes touchées gardent une durée nulle.

5. **Fin avant début.** 25 lignes ont une date de fin réelle antérieure à la date de début réelle (durées impossibles). Correctif : mise en quarantaine hors du calcul des durées (durée à null, ligne conservée) et journalisation dans public/data/quarantine.json. Résultat : 25 mises en quarantaine, médiane et moyenne calculées sur 20 347 rapports résolus avec une durée calculable.

### Comptes résultants

- 24 377 rapports de pénurie. 3 221 rapports d'abandon (suivis à part, exclus des classements)
- 239 entreprises canoniques (16 groupes de fusion)
- 25 lignes en quarantaine. 21 rapports sans nom d'entreprise. 96 sans code ATC. 4 sans DIN (comptés dans les totaux, exclus des classements)

### Exemples avant/après

- « ALLERGAN PHARMA CO. » (6 lignes) -> « ALLERGAN INC » (126 + 6 lignes, selon company_merges.json)
- « ALK-ABELLO INC » (7 lignes) -> « ALK ABELLO A/S » (12 + 7 lignes, selon company_merges.json)
- Rapport 172409 (fin avant début) -> durée null, ligne conservée, journalisée dans quarantine.json
- Règle DIN : DIN flottants ou amputés -> chaînes de 8 chiffres complétées par des zéros (le rapport 97054 porte le DIN 02245669)
