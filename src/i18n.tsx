"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type Lang = "en" | "fr";

const en = {
  banner: {
    line: "An independent open-source project. Not affiliated with the Government of Canada or Health Canada.",
    badge: "Open source",
  },
  nav: { explorer: "Explorer", showcase: "Showcase", charts: "Charts", methodology: "Methodology", developers: "Developers", data: "Data", back: "All projects" },
  hero: {
    kicker: "Nshipyard Canada · Open data project",
    title: "Drug Shortages, Ranked",
    sub: "Canada's drug shortage registry lists 24,377 reports, one by one, and it never answers the follow-up: which companies keep showing up, and which shortages never end. This project normalizes the registry, ranks the companies and drug classes by chronicity, and tracks the 59 Tier 3 critical shortages separately. Reference date 2025-12-01.",
    cta1: "Search the reports",
    cta2: "Read the methodology",
  },
  stats: [
    { value: "59", label: "Tier 3 reports, the critical shortages that could hit Canada's drug supply hardest. 24 were still open on 2025-12-01" },
    { value: "49%", label: "of Tier 3 reports filed by three companies: Teva Canada (13), Pfizer Canada ULC (9), Pharmascience (7)" },
    { value: "28", label: "Tier 3 designations in 2025, up from 4 in 2022" },
    { value: "58 days", label: "the median length of a resolved shortage. The mean is 140 days because a long tail of multi-year shortages pulls the average up" },
    { value: "1,742", label: "shortages still open on 2025-12-01, running a median of 647 days" },
  ],
  explorer: {
    kicker: "Explorer",
    title: "Search 24,377 shortage reports.",
    search: "Search by brand name, DIN, or company…",
    companyFilter: "All companies",
    atcFilter: "All drug classes",
    tier3Toggle: "Tier 3 only",
    tier3Only: "Tier 3 only",
    allStatuses: "All statuses",
    statusNames: { open: "Open", anticipated: "Anticipated", avoided: "Avoided", resolved: "Resolved" } as Record<string, string>,
    showing: "Showing",
    of: "of",
    noResult: "No reports match.",
    empty: "Search above or filter by company, drug class, Tier 3, or status. Status values come from the registry: open, anticipated, avoided, resolved.",
    colBrand: "Brand",
    colCompany: "Company",
    colDin: "DIN",
    colAtc: "ATC",
    colStatus: "Status",
    colTier3: "Tier 3",
    colStart: "Start",
    colDuration: "Days",
    tier3Yes: "Yes",
    tier3No: "-",
    pagePrev: "Previous",
    pageNext: "Next",
    pageOf: "of",
  },
  showcase: {
    kicker: "Showcase",
    title: "Six questions the registry never answers.",
    body: "Every number below is computed from the 24,377 normalized shortage reports, reference date 2025-12-01. The sixth card states the limits plainly, because a ranking without its blind spots is a marketing chart.",
    cite: "Cite this",
    copied: "Copied",
    shareX: "Share on X",
    shareLinkedIn: "Share on LinkedIn",
    cards: [
      {
        q: "Which drug companies own most of Canada's critical shortages?",
        a: "Teva Canada filed 13 of the 59 Tier 3 reports, Pfizer Canada ULC filed 9, Pharmascience filed 7. Three companies account for 49% of the critical shortage reports. Tier 3 marks shortages that could hit Canada's drug supply and health care system hardest.",
        cite: "Three companies account for 49% of Canada's 59 Tier 3 critical drug shortage reports (Teva Canada 13, Pfizer Canada ULC 9, Pharmascience 7). Source: Drug Shortages, Ranked, Health Product Shortages Canada extract archived 2025-12-20.",
        share: "Three companies account for half of Canada's critical drug shortages: Teva Canada (13), Pfizer Canada ULC (9), Pharmascience (7).",
      },
      {
        q: "Are critical shortages rising?",
        a: "Tier 3 designations went from 4 in 2022 to 28 in 2025, while total new reports stayed roughly flat. The honest caveat: the Tier 3 flag first appears in this dataset in 2022, when the current committee process was formalized, so the curve mixes real growth with the flag's rollout.",
        cite: "Tier 3 critical shortage designations rose from 4 in 2022 to 28 in 2025. The Tier 3 flag itself first appears in the dataset in 2022. Source: Drug Shortages, Ranked, Health Product Shortages Canada extract archived 2025-12-20.",
        share: "Critical drug shortage designations in Canada went from 4 in 2022 to 28 in 2025. The flag itself dates to 2022.",
      },
      {
        q: "How long does a shortage last?",
        a: "The median resolved shortage ran 58 days. The mean was 140 days, pulled up by a long tail of multi-year shortages, the longest ran 15.6 years. Open shortages are the slow ones: on 2025-12-01 they had been running a median of 647 days.",
        cite: "The median resolved drug shortage lasted 58 days, the mean 140 days. Shortages still open on 2025-12-01 had run a median of 647 days. Source: Drug Shortages, Ranked, Health Product Shortages Canada extract archived 2025-12-20.",
        share: "The median resolved drug shortage lasts 58 days, the mean 140. Open ones had already run 647 days.",
      },
      {
        q: "Which drug classes short out most?",
        a: "Nervous system drugs lead with 6,785 reports, cardiovascular drugs follow with 5,082. Critical shortages concentrate elsewhere: respiratory drugs hold 15 of the 59 Tier 3 reports, the highest count and share of any class, and cancer drugs (antineoplastic and immunomodulating agents) hold 13.",
        cite: "Respiratory drugs hold 15 of Canada's 59 Tier 3 critical shortage reports, the most of any drug class. Cancer drugs hold 13. Source: Drug Shortages, Ranked, Health Product Shortages Canada extract archived 2025-12-20.",
        share: "Respiratory drugs hold 15 of Canada's 59 critical Tier 3 shortage reports, more than any other class.",
      },
      {
        q: "Who files the most reports, period?",
        a: "Apotex filed 3,633 reports, Teva 3,077, Sandoz 2,261. Volume alone does not mean chronic: most reports resolve, and the chronicity ranking comes from Tier 3 and duration data, not the raw count.",
        cite: "Apotex filed 3,633 shortage reports, Teva Canada 3,077, Sandoz 2,261. Volume alone does not measure chronicity. Source: Drug Shortages, Ranked, Health Product Shortages Canada extract archived 2025-12-20.",
        share: "Apotex filed 3,633 drug shortage reports, Teva 3,077, Sandoz 2,261. Volume is not chronicity.",
      },
      {
        q: "What this registry cannot say.",
        a: "Reports are not patients: one report covers one product presentation, and pharmacists often substitute. 'Resolved' can mean the shortage ended or was avoided. Companies self-report, so open reports may be stale. 21 reports carry no company name and 96 carry no ATC code. They are counted in totals but excluded from rankings.",
        cite: "24,377 shortage reports: 21,945 resolved, 1,742 open, 690 avoided. Reports are product presentations, not patients. Source: Drug Shortages, Ranked, Health Product Shortages Canada extract archived 2025-12-20.",
        share: "Canada's drug shortage registry: 24,377 reports. One report is one product presentation, not one patient.",
      },
    ],
  },
  charts: {
    kicker: "Charts",
    title: "The shape of the problem.",
    body: "Three views of the same 24,377 reports. Bars and lines are computed from the quarterly series, the Tier 3 company ranking, and the ATC level-1 breakdown.",
    c1Title: "New Tier 3 designations by quarter, 2020 to 2025",
    c1Note: "Bars: new Tier 3 reports per quarter (left axis). Line: all new reports per quarter (right axis). Tier 3 first appears in 2022.",
    c1LegendTier3: "New Tier 3 reports",
    c1LegendAll: "All new reports",
    c2Title: "Tier 3 reports by company, top 10",
    c2Note: "24 companies hold at least one Tier 3 report. The top 10 hold 49 of 59.",
    c3Title: "Shortage reports by drug class, Tier 3 highlighted",
    c3Note: "Left bar: total reports per ATC level-1 class. Right bar: Tier 3 reports in that class (different scale, each labeled). Respiratory drugs lead critical shortages with 15.",
    reports: "reports",
    tier3: "Tier 3",
  },
  methodology: {
    kicker: "Methodology",
    title: "How the ranking was built, and where it is weak.",
    items: [
      "Source: the Health Product Shortages Canada monthly bulk extract, archived 2025-12-20 (originally drugshortagescanada.ca, now healthproductshortages.ca). Reference date 2025-12-01. The PMPRB 2022 analytical study on shortages is the one-off baseline this living tracker replaces.",
      "Cleaning: the BOM disclaimer row is dropped, DINs are digit-stripped and zero-padded, company names are normalized with 16 logged merge groups (see company_merges.json), 0001-01-01 placeholder dates are treated as missing, and 25 rows whose actual end date precedes the actual start are quarantined from duration math (see quarantine.json).",
      "Duration: resolved duration is actual end minus actual start, capped at the 2025-12-01 reference date. Open duration is the reference date minus the start. The 58-day median and 140-day mean come from 20,347 resolved reports with computable duration.",
      "Status mapping: the registry's statuses map to open (Actual shortage), anticipated (Anticipated shortage), avoided (Avoided shortage), and resolved (Resolved). The 1,742 open reports on 2025-12-01 split into 1,709 actual and 33 anticipated.",
      "Companies: 239 canonical companies after merging 16 near-identical name variants. 21 reports carry no company name and are counted in totals but excluded from rankings.",
      "ATC classes: records roll up to ATC level 1 (letter) and level 2. 96 reports carry no ATC code and are counted in totals but excluded from class rankings. Class names follow the WHO ATC system.",
      "Tier 3: critical shortages that could hit Canada's drug supply and health care system hardest, assigned by a federal-provincial Tier Assignment Committee. The flag first appears in this dataset in 2022, matching when the current committee process was formalized.",
      "Discontinuations: tracked separately, 3,221 reports, and excluded from every shortage ranking on this site.",
      "Honest limits: reports are product presentations, not patients, and pharmacists often substitute. Companies self-report, so open reports may be stale. 'Resolved' can mean the shortage ended or was avoided.",
    ],
    contextTitle: "Why this matters now",
    contextBody: "Health Canada's drug supply notices page (canada.ca, checked 2026-10-10) lists 6 active notices: glucagon for injection (2026-07-02), Bicillin L-A penicillin G benzathine (2026-06-01), dantrolene sodium for injection (2026-05-29), animal-sourced insulin discontinuation (2026-03-13), CeeNU lomustine (2025-04-17), and PEGASYS peginterferon alfa-2a (2025-03-31). Two recently resolved notices corroborate the Tier 3 clusters in this data: spironolactone/Aldactone, resolved 2026-08-05, matches the Tier 3 C03DA cluster of 7 reports. Salbutamol nebules and metered-dose inhalers, resolved 2026-05-06, match the Tier 3 R03AC/R03BB respiratory cluster of 13 reports.",
  },
  developers: {
    kicker: "For developers",
    title: "Query it from code, or from an agent.",
    body: "Three consumption paths, same normalized data. REST for applications, OpenAPI for integration, MCP tools over streamable HTTP for AI agents.",
    endpoints: "Endpoints",
    tryIt: "Try it",
    openapi: "OpenAPI spec",
    mcpTitle: "MCP server",
    mcpBody: "One streamable-HTTP endpoint. Tools: shortage_lookup, company_ranking, tier3_trend, atc_breakdown.",
    downloadNote: "Both cleaned CSVs are served from this site's /data directory, same build as the API.",
  },
  mcp: {
    kicker: "Connect your agent",
    title: "Put this data to work inside your AI tools.",
    body: "Pick your harness, copy the prompt, send it to your agent. Your agent runs the setup itself.",
    tabs: { chatgpt: "ChatGPT", claude: "Claude", claudecode: "Claude Code", cli: "CLI", other: "Other" },
    cardTitle: "Copy and send this to {tab}",
    copy: "Copy",
    copied: "Copied",
    chatgptNote: "ChatGPT connects through the documented REST API rather than MCP directly.",
    pChatgpt:
      "I want to use the {displayName} through its API.\n- OpenAPI spec: {origin}/api/openapi.json\n- REST base: {origin}/api/v1\nFirst tell me in two sentences what this API offers, then {exampleLower}, and show me the result.",
    pClaude:
      "In Claude (claude.ai), open Settings, then Connectors, and add a custom connector:\n- Name: {displayName}\n- URL: {origin}/mcp\nThen list the available tools, {exampleLower}, and show me the result.",
    pClaudeCode:
      "Set up the {displayName} MCP server so I can query it from here.\n1. Run: claude mcp add --transport http {slug} {origin}/mcp\n2. Run `claude mcp list` to confirm it connected.\n3. {example}, and show me the result.",
    pCli:
      "# MCP endpoint (streamable HTTP)\n{origin}/mcp\n\n# List the available tools\ncurl -s -X POST {origin}/mcp -H 'Content-Type: application/json' \\\n  -d '{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/list\"}'",
    otherTitle: "Everything else",
    otherBody: "Any harness that speaks MCP over streamable HTTP, or plain REST.",
    mcpEndpoint: "MCP endpoint",
    openapiSpec: "OpenAPI spec",
    restBase: "REST base",
  },
  downloads: {
    kicker: "Data",
    title: "Take the files.",
    body: "The two cleaned extracts, the company merge log, and the quarantine log. Same files the API reads. MIT licensed.",
    files: [
      { name: "shortages_clean.csv", desc: "24,377 shortage reports, cleaned and normalized" },
      { name: "discontinuations_clean.csv", desc: "3,221 discontinuation reports, tracked separately" },
      { name: "company_merges.json", desc: "16 logged company name merge groups with row counts" },
      { name: "quarantine.json", desc: "25 rows quarantined from duration math (end before start)" },
    ],
    download: "Download",
  },
  footer: {
    line: "An independent open-source project. Not affiliated with the Government of Canada or Health Canada.",
    sources: "Source: Health Product Shortages Canada monthly bulk extract, archived 2025-12-20 (drugshortagescanada.ca, now healthproductshortages.ca). Reference date 2025-12-01. Planned domain: shortages.canada.nshipyard.com.",
    author: "Built by Richardson Dackam",
  },
};

export type Dict = typeof en;

const fr: Dict = {
  banner: {
    line: "Un projet indépendant à code source ouvert. Non affilié au gouvernement du Canada ni à Santé Canada.",
    badge: "Code source ouvert",
  },
  nav: { explorer: "Explorateur", showcase: "Vitrine", charts: "Graphiques", methodology: "Méthodologie", developers: "Développeurs", data: "Données", back: "Tous les projets" },
  hero: {
    kicker: "Nshipyard Canada · Projet de données ouvertes",
    title: "Pénuries de médicaments, classées",
    sub: "Le registre canadien des pénuries de médicaments liste 24 377 rapports, un par un, sans jamais répondre à la suite : quelles entreprises reviennent toujours, et quelles pénuries ne se terminent jamais. Ce projet normalise le registre, classe les entreprises et les classes de médicaments selon leur chronicité, et suit à part les 59 pénuries critiques de niveau 3. Date de référence : 2025-12-01.",
    cta1: "Rechercher les rapports",
    cta2: "Lire la méthodologie",
  },
  stats: [
    { value: "59", label: "rapports de niveau 3, les pénuries critiques qui pourraient frapper le plus durement l'approvisionnement en médicaments du Canada. 24 étaient encore ouverts le 2025-12-01" },
    { value: "49 %", label: "des rapports de niveau 3 déposés par trois entreprises : Teva Canada (13), Pfizer Canada ULC (9), Pharmascience (7)" },
    { value: "28", label: "désignations de niveau 3 en 2025, contre 4 en 2022" },
    { value: "58 jours", label: "durée médiane d'une pénurie résolue. La moyenne est de 140 jours car une longue traîne de pénuries pluriannuelles tire la moyenne vers le haut" },
    { value: "1 742", label: "pénuries encore ouvertes le 2025-12-01, en cours depuis 647 jours en médiane" },
  ],
  explorer: {
    kicker: "Explorateur",
    title: "Chercher parmi 24 377 rapports de pénurie.",
    search: "Rechercher par nom de marque, DIN ou entreprise…",
    companyFilter: "Toutes les entreprises",
    atcFilter: "Toutes les classes de médicaments",
    tier3Toggle: "Niveau 3 seulement",
    tier3Only: "Niveau 3 seulement",
    allStatuses: "Tous les statuts",
    statusNames: { open: "Ouvert", anticipated: "Anticipé", avoided: "Évité", resolved: "Résolu" } as Record<string, string>,
    showing: "Affichage de",
    of: "sur",
    noResult: "Aucun rapport ne correspond.",
    empty: "Recherchez ci-dessus ou filtrez par entreprise, classe de médicaments, niveau 3 ou statut. Les statuts viennent du registre : ouvert, anticipé, évité, résolu.",
    colBrand: "Marque",
    colCompany: "Entreprise",
    colDin: "DIN",
    colAtc: "ATC",
    colStatus: "Statut",
    colTier3: "Niveau 3",
    colStart: "Début",
    colDuration: "Jours",
    tier3Yes: "Oui",
    tier3No: "-",
    pagePrev: "Précédent",
    pageNext: "Suivant",
    pageOf: "sur",
  },
  showcase: {
    kicker: "Vitrine",
    title: "Six questions auxquelles le registre ne répond jamais.",
    body: "Chaque chiffre ci-dessous est calculé à partir des 24 377 rapports de pénurie normalisés, date de référence 2025-12-01. La sixième carte énonce les limites franchement, car un classement sans angles morts est un argument publicitaire.",
    cite: "Citer",
    copied: "Copié",
    shareX: "Partager sur X",
    shareLinkedIn: "Partager sur LinkedIn",
    cards: [
      {
        q: "Quelles entreprises pharmaceutiques sont à l'origine de la plupart des pénuries critiques au Canada ?",
        a: "Teva Canada a déposé 13 des 59 rapports de niveau 3, Pfizer Canada ULC 9, Pharmascience 7. Trois entreprises représentent 49 % des rapports de pénurie critique. Le niveau 3 désigne les pénuries qui pourraient frapper le plus durement l'approvisionnement en médicaments et le système de santé du Canada.",
        cite: "Trois entreprises représentent 49 % des 59 rapports canadiens de pénurie critique de niveau 3 (Teva Canada 13, Pfizer Canada ULC 9, Pharmascience 7). Source : Drug Shortages, Ranked, extrait de Health Product Shortages Canada archivé le 2025-12-20.",
        share: "Trois entreprises représentent la moitié des pénuries critiques de médicaments au Canada : Teva Canada (13), Pfizer Canada ULC (9), Pharmascience (7).",
      },
      {
        q: "Les pénuries critiques augmentent-elles ?",
        a: "Les désignations de niveau 3 sont passées de 4 en 2022 à 28 en 2025, tandis que le nombre total de nouveaux rapports restait à peu près stable. Réserve honnête : le drapeau de niveau 3 apparaît pour la première fois dans ces données en 2022, année de formalisation du processus actuel du comité, donc la courbe mêle croissance réelle et déploiement du drapeau.",
        cite: "Les désignations de pénurie critique de niveau 3 sont passées de 4 en 2022 à 28 en 2025. Le drapeau de niveau 3 lui-même apparaît pour la première fois en 2022. Source : Drug Shortages, Ranked, extrait de Health Product Shortages Canada archivé le 2025-12-20.",
        share: "Les désignations de pénurie critique de médicaments au Canada sont passées de 4 en 2022 à 28 en 2025. Le drapeau lui-même date de 2022.",
      },
      {
        q: "Combien de temps dure une pénurie ?",
        a: "La pénurie résolue médiane a duré 58 jours. La moyenne était de 140 jours, tirée vers le haut par une longue traîne de pénuries pluriannuelles, la plus longue ayant duré 15,6 ans. Les pénuries ouvertes sont les plus lentes : au 2025-12-01, elles duraient depuis 647 jours en médiane.",
        cite: "La pénurie médiane résolue a duré 58 jours, la moyenne 140 jours. Les pénuries encore ouvertes le 2025-12-01 duraient depuis 647 jours en médiane. Source : Drug Shortages, Ranked, extrait de Health Product Shortages Canada archivé le 2025-12-20.",
        share: "La pénurie médiane résolue dure 58 jours, la moyenne 140. Les ouvertes duraient déjà depuis 647 jours.",
      },
      {
        q: "Quelles classes de médicaments manquent le plus ?",
        a: "Les médicaments du système nerveux arrivent en tête avec 6 785 rapports, suivis des médicaments cardiovasculaires avec 5 082. Les pénuries critiques se concentrent ailleurs : les médicaments respiratoires représentent 15 des 59 rapports de niveau 3, le nombre et la part les plus élevés de toutes les classes, et les médicaments contre le cancer (agents antinéoplasiques et immunomodulateurs) en représentent 13.",
        cite: "Les médicaments respiratoires représentent 15 des 59 rapports canadiens de pénurie critique de niveau 3, plus que toute autre classe. Les médicaments contre le cancer en représentent 13. Source : Drug Shortages, Ranked, extrait de Health Product Shortages Canada archivé le 2025-12-20.",
        share: "Les médicaments respiratoires représentent 15 des 59 pénuries critiques de niveau 3 au Canada, plus que toute autre classe.",
      },
      {
        q: "Qui dépose le plus de rapports, tout court ?",
        a: "Apotex a déposé 3 633 rapports, Teva 3 077, Sandoz 2 261. Le volume seul ne signifie pas chronicité : la plupart des rapports se résolvent, et le classement de chronicité repose sur les données de niveau 3 et de durée, pas sur le nombre brut.",
        cite: "Apotex a déposé 3 633 rapports de pénurie, Teva Canada 3 077, Sandoz 2 261. Le volume seul ne mesure pas la chronicité. Source : Drug Shortages, Ranked, extrait de Health Product Shortages Canada archivé le 2025-12-20.",
        share: "Apotex a déposé 3 633 rapports de pénurie, Teva 3 077, Sandoz 2 261. Le volume n'est pas la chronicité.",
      },
      {
        q: "Ce que ce registre ne peut pas dire.",
        a: "Les rapports ne sont pas des patients : un rapport couvre une présentation de produit, et les pharmaciens substituent souvent. « Résolu » peut signifier que la pénurie a pris fin ou a été évitée. Les entreprises déclarent elles-mêmes, donc les rapports ouverts peuvent être périmés. 21 rapports n'ont pas de nom d'entreprise et 96 n'ont pas de code ATC. Ils sont comptés dans les totaux mais exclus des classements.",
        cite: "24 377 rapports de pénurie : 21 945 résolus, 1 742 ouverts, 690 évités. Les rapports sont des présentations de produit, pas des patients. Source : Drug Shortages, Ranked, extrait de Health Product Shortages Canada archivé le 2025-12-20.",
        share: "Le registre canadien des pénuries : 24 377 rapports. Un rapport, c'est une présentation de produit, pas un patient.",
      },
    ],
  },
  charts: {
    kicker: "Graphiques",
    title: "La forme du problème.",
    body: "Trois vues des mêmes 24 377 rapports. Barres et courbes sont calculées à partir de la série trimestrielle, du classement des entreprises de niveau 3 et de la ventilation ATC de niveau 1.",
    c1Title: "Nouvelles désignations de niveau 3 par trimestre, 2020 à 2025",
    c1Note: "Barres : nouveaux rapports de niveau 3 par trimestre (axe de gauche). Courbe : tous les nouveaux rapports par trimestre (axe de droite). Le niveau 3 apparaît pour la première fois en 2022.",
    c1LegendTier3: "Nouveaux rapports de niveau 3",
    c1LegendAll: "Tous les nouveaux rapports",
    c2Title: "Rapports de niveau 3 par entreprise, 10 premières",
    c2Note: "24 entreprises détiennent au moins un rapport de niveau 3. Les 10 premières en détiennent 49 sur 59.",
    c3Title: "Rapports de pénurie par classe de médicaments, niveau 3 en évidence",
    c3Note: "Barre de gauche : rapports totaux par classe ATC de niveau 1. Barre de droite : rapports de niveau 3 dans cette classe (échelle différente, chacun étiqueté). Les médicaments respiratoires mènent les pénuries critiques avec 15.",
    reports: "rapports",
    tier3: "Niveau 3",
  },
  methodology: {
    kicker: "Méthodologie",
    title: "Comment le classement a été construit, et où il est faible.",
    items: [
      "Source : l'extrait mensuel en vrac de Health Product Shortages Canada, archivé le 2025-12-20 (à l'origine drugshortagescanada.ca, devenu healthproductshortages.ca). Date de référence : 2025-12-01. L'étude analytique de 2022 du CEPMB sur les pénuries est la base de référence ponctuelle que ce suivi continu remplace.",
      "Nettoyage : la ligne d'avertissement BOM est retirée, les DIN sont épurés de leurs chiffres et complétés par des zéros, les noms d'entreprises sont normalisés avec 16 groupes de fusion journalisés (voir company_merges.json), les dates fictives 0001-01-01 sont traitées comme manquantes, et 25 lignes dont la date de fin réelle précède la date de début sont mises en quarantaine hors du calcul des durées (voir quarantine.json).",
      "Durée : la durée résolue est la date de fin réelle moins la date de début réelle, plafonnée à la date de référence 2025-12-01. La durée ouverte est la date de référence moins le début. La médiane de 58 jours et la moyenne de 140 jours proviennent de 20 347 rapports résolus avec une durée calculable.",
      "Correspondance des statuts : les statuts du registre correspondent à ouvert (Actual shortage), anticipé (Anticipated shortage), évité (Avoided shortage) et résolu (Resolved). Les 1 742 rapports ouverts au 2025-12-01 se divisent en 1 709 réels et 33 anticipés.",
      "Entreprises : 239 entreprises canoniques après fusion de 16 variantes de noms quasi identiques. 21 rapports n'ont pas de nom d'entreprise et sont comptés dans les totaux mais exclus des classements.",
      "Classes ATC : les dossiers sont regroupés au niveau 1 (lettre) et au niveau 2 de l'ATC. 96 rapports n'ont pas de code ATC et sont comptés dans les totaux mais exclus des classements par classe. Les noms de classes suivent le système ATC de l'OMS.",
      "Niveau 3 : pénuries critiques qui pourraient frapper le plus durement l'approvisionnement en médicaments et le système de santé du Canada, attribuées par un comité fédéral-provincial d'attribution des niveaux. Le drapeau apparaît pour la première fois dans ces données en 2022, année de formalisation du processus actuel du comité.",
      "Abandons : suivis à part, 3 221 rapports, et exclus de tous les classements de pénurie sur ce site.",
      "Limites honnêtes : les rapports sont des présentations de produit, pas des patients, et les pharmaciens substituent souvent. Les entreprises déclarent elles-mêmes, donc les rapports ouverts peuvent être périmés. « Résolu » peut signifier que la pénurie a pris fin ou a été évitée.",
    ],
    contextTitle: "Pourquoi c'est important maintenant",
    contextBody: "La page des avis d'approvisionnement de Santé Canada (canada.ca, consultée le 2026-10-10) liste 6 avis actifs : le glucagon injectable (2026-07-02), la pénicilline G benzathine Bicillin L-A (2026-06-01), la dantrolène sodique injectable 2026 (2026-05-29), l'abandon de l'insuline d'origine animale (2026-03-13), la lomustine CeeNU (2025-04-17) et le péginterféron alfa-2a PEGASYS (2025-03-31). Deux avis récemment résolus corroborent les regroupements de niveau 3 de ces données : la spironolactone/Aldactone, résolue le 2026-08-05, correspond au regroupement C03DA de niveau 3 de 7 rapports. Les nébulisateurs et inhalateurs-doseurs de salbutamol, résolus le 2026-05-06, correspondent au regroupement respiratoire R03AC/R03BB de niveau 3 de 13 rapports.",
  },
  developers: {
    kicker: "Pour les développeurs",
    title: "Interrogez-le depuis du code, ou depuis un agent.",
    body: "Trois façons de consommer les mêmes données normalisées. REST pour les applications, OpenAPI pour l'intégration, outils MCP en HTTP continu pour les agents IA.",
    endpoints: "Points de terminaison",
    tryIt: "Essayer",
    openapi: "Spécification OpenAPI",
    mcpTitle: "Serveur MCP",
    mcpBody: "Un point de terminaison HTTP continu. Outils : shortage_lookup, company_ranking, tier3_trend, atc_breakdown.",
    downloadNote: "Les deux CSV nettoyés sont servis depuis le répertoire /data de ce site, issu de la même construction que l'API.",
  },
  mcp: {
    kicker: "Connectez votre agent",
    title: "Exploitez ces données dans vos outils d'IA.",
    body: "Choisissez votre plateforme, copiez l'invite, envoyez-la à votre agent. Votre agent exécute la configuration lui-même.",
    tabs: { chatgpt: "ChatGPT", claude: "Claude", claudecode: "Claude Code", cli: "CLI", other: "Autre" },
    cardTitle: "Copiez et envoyez ceci à {tab}",
    copy: "Copier",
    copied: "Copié",
    chatgptNote: "ChatGPT se connecte via l'API REST documentée plutôt que directement en MCP.",
    pChatgpt:
      "Je veux utiliser {displayName} via son API.\n- Spécification OpenAPI : {origin}/api/openapi.json\n- Base REST : {origin}/api/v1\nD'abord, dis-moi en deux phrases ce que cette API offre, puis {exampleLower}, et montre-moi le résultat.",
    pClaude:
      "Dans Claude (claude.ai), ouvre les paramètres, puis Connecteurs, et ajoute un connecteur personnalisé :\n- Nom : {displayName}\n- URL : {origin}/mcp\nEnsuite, liste les outils disponibles, {exampleLower}, et montre-moi le résultat.",
    pClaudeCode:
      "Configure le serveur MCP {displayName} pour que je puisse l'interroger d'ici.\n1. Exécute : claude mcp add --transport http {slug} {origin}/mcp\n2. Exécute `claude mcp list` pour confirmer la connexion.\n3. {example}, et montre-moi le résultat.",
    pCli:
      "# Point de terminaison MCP (HTTP continu)\n{origin}/mcp\n\n# Lister les outils disponibles\ncurl -s -X POST {origin}/mcp -H 'Content-Type: application/json' \\\n  -d '{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/list\"}'",
    otherTitle: "Tout le reste",
    otherBody: "Toute plateforme qui parle MCP en HTTP continu, ou REST tout court.",
    mcpEndpoint: "Point de terminaison MCP",
    openapiSpec: "Spécification OpenAPI",
    restBase: "Base REST",
  },
  downloads: {
    kicker: "Données",
    title: "Prenez les fichiers.",
    body: "Les deux extraits nettoyés, le journal des fusions d'entreprises et le journal de quarantaine. Les mêmes fichiers que lit l'API. Licence MIT.",
    files: [
      { name: "shortages_clean.csv", desc: "24 377 rapports de pénurie, nettoyés et normalisés" },
      { name: "discontinuations_clean.csv", desc: "3 221 rapports d'abandon, suivis à part" },
      { name: "company_merges.json", desc: "16 groupes de fusion de noms d'entreprises journalisés, avec nombres de lignes" },
      { name: "quarantine.json", desc: "25 lignes mises en quarantaine hors du calcul des durées (fin avant début)" },
    ],
    download: "Télécharger",
  },
  footer: {
    line: "Un projet indépendant à code source ouvert. Non affilié au gouvernement du Canada ni à Santé Canada.",
    sources: "Source : extrait mensuel en vrac de Health Product Shortages Canada, archivé le 2025-12-20 (drugshortagescanada.ca, devenu healthproductshortages.ca). Date de référence : 2025-12-01. Domaine prévu : shortages.canada.nshipyard.com.",
    author: "Conçu par Richardson Dackam",
  },
};

const dicts: Record<Lang, Dict> = { en, fr };

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict }>({
  lang: "en",
  setLang: () => {},
  t: en,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return <LangCtx.Provider value={{ lang, setLang, t: dicts[lang] }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  return useContext(LangCtx);
}
