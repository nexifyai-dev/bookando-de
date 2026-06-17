# Bookando.de – Anforderungs-Traceability-Matrix

> **Grundlage:** Kunden-Pflichtenheft (docs/customer/PFLICHTENHEFT_BOOKANDO_KUNDE.md)
> **SHA-256:** bb94f8a8018f76a87ecacc06ba2cf5a175e94e30fc735a7e6eb0a77b819ee105
> **Stand:** 17.06.2026
> **Audit-Tiefe:** Code-basiert (kein Live-Zugriff möglich — API 402)

## Status-Legende

| Status | Bedeutung |
|--------|-----------|
| ✅ VERIFIED_COMPLETE | Fachlich umgesetzt, FE+BE kompatibel, DB-Modell vorhanden, Tests, Live bestätigt |
| 🔶 IMPLEMENTED_UNVERIFIED | Code vorhanden, aber nicht ausreichend getestet/nachgewiesen |
| 🔸 PARTIAL | Teilweise umgesetzt |
| 🟡 MOCK_ONLY | Nur Mock/Prototyp vorhanden |
| 📄 DOCUMENTED_ONLY | Nur in Doku erwähnt |
| ❌ MISSING | Fehlt vollständig |
| ⚠️ CONTRADICTED | Widerspricht Anforderung |
| 🔴 BLOCKED | Durch externe Abhängigkeit blockiert |
| ⬜ OUT_OF_SCOPE | Für aktuelle Phase nicht vorgesehen |

---

## Kapitel 8 – Terminbuchungssystem

| ID | Anforderung | Phase | FE-Nachweis | BE-Nachweis | DB-Nachweis | Tests | Live | Status | Lücke | Risiko |
|----|------------|-------|-------------|-------------|-------------|-------|------|--------|-------|--------|
| PF-08-001 | Echte Terminlogik (kein Produkt) | MVP | api.js: CustomerBookingsApi, BookingSlotsApi | bookings_routes.py | bookings Tabelle (Supabase) | ❌ | 🔴 (402) | 🔶 PARTIAL | Slots-Logik vorhanden, aber Doppelbuchungsschutz, Races, Puffer nicht geprüft | Mittel |
| PF-08-002 | Datum | MVP | BookingSlotsApi.available() | POST /bookings/slots | bookings.start_at | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | vorhanden | Mittel |
| PF-08-003 | Uhrzeit | MVP | BookingSlotsApi.available() | POST /bookings/slots | bookings.start_at/end_at | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | vorhanden | Mittel |
| PF-08-004 | Dauer | MVP | PublicApi.slots() | services.duration | services Tabelle | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Duration in services, Slot-Berechnung vorhanden | Mittel |
| PF-08-005 | Mitarbeiter-Zuordnung | MVP | EmployeeAccountsApi | employees_routes.py | employees Tabelle | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | vorhanden | Mittel |
| PF-08-006 | Standort-Zuordnung | MVP | LocationsApi | locations_routes.py | locations Tabelle | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | vorhanden | Mittel |
| PF-08-007 | Ressourcen | MVP | ResourcesApi (FE) | (nicht gefunden) | (nicht gefunden) | ❌ | 🔴 | ❌ MISSING | ResourcesApi im Frontend, aber Backend-Modul fehlt | Hoch |
| PF-08-008 | Vorlaufzeiten | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Hoch |
| PF-08-009 | Pufferzeiten | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Hoch |
| PF-08-010 | Gruppenlogik | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Hoch |
| PF-08-011 | Online-/Offline-Termine | MVP | CustomerBookingsApi.create | bookings_routes.py | bookings | ❌ | 🔴 | 🔶 PARTIAL | Buchung vorhanden, aber Online/Offline-Typ nicht klar getrennt | Mittel |
| PF-08-012 | Einzeltermine | MVP | CustomerBookingsApi.create() | POST /bookings | bookings | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Vorhanden | Mittel |
| PF-08-013 | Mehrfachsitzungen | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Hoch |
| PF-08-014 | Beratungsgespräche | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht als Service-Typ differenziert | Niedrig |
| PF-08-015 | Gruppenbuchungen | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Hoch |
| PF-08-016 | Online-Termine | MVP | CustomerBookingsApi.create() | bookings_routes.py | bookings | ❌ | 🔴 | 🔶 PARTIAL | Buchbar, aber kein Video/Meeting-Integration | Mittel |
| PF-08-017 | Vor-Ort-Termine | MVP | CustomerBookingsApi.create() | bookings_routes.py | bookings | ❌ | 🔴 | 🔶 PARTIAL | Buchbar | Mittel |
| PF-08-018 | Paketbuchungen | MVP | VendorBookingsApi (FE) | bookings_routes.py | bookings/packages | ❌ | 🔴 | 🔶 PARTIAL | Packages API vorhanden, aber Paketbuchungslogik fraglich | Mittel |
| PF-08-019 | Wiederkehrende Termine | MVP | CustomerBookingsApi.createRecurring() | bookings_routes.py | bookings (recurring) | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | createRecurring FE vorhanden, BE muss geprüft werden | Mittel |
| PF-08-020 | Zeitslots blockierbar | MVP | POST /bookings/slots | bookings_routes.py | bookings | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Booking-Create blockiert Slots | Mittel |
| PF-08-021 | Zeitslots reservierbar | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Kein Reservierungsmechanismus | Mittel |
| PF-08-022 | Zeitslots synchronisierbar | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Kein Kalender-Sync (iCal/Google) | Hoch |
| PF-08-023 | Zeitslots direkt teilbar | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Kein Direktlink-Mechanismus pro Slot | Mittel |
| PF-08-024 | Affiliate-fähige Slots | MVP | ❌ | commission_routes.py | commissions | ❌ | 🔴 | 🔶 PARTIAL | Commission-Engine existiert, aber Slot-Attribution unklar | Hoch |
| PF-08-025 | Teilbar via Direktlinks | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |
| PF-08-026 | Teilbar via Social Media | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |
| PF-08-027 | Teilbar via QR-Codes | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |
| PF-08-028 | Teilbar via Werbekampagnen | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |
| PF-08-029 | Teilbar via Affiliate-Links | MVP | ❌ | affiliate_routes.py | affiliate_links | ❌ | 🔴 | 🔶 PARTIAL | Affiliate-Routes vorhanden, konkrete Link-Teilbarkeit unklar | Hoch |

---

## Kapitel 9 – Vendor-System

| ID | Anforderung | Phase | FE-Nachweis | BE-Nachweis | DB-Nachweis | Tests | Live | Status | Lücke | Risiko |
|----|------------|-------|-------------|-------------|-------------|-------|------|--------|-------|--------|
| PF-09-001 | Vendor als Organisationseinheit | MVP | PortalContext.js, navItems | vendor_routes.py | vendors Tabelle | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Vendor-Entity vorhanden | Mittel |
| PF-09-002 | Dienstleistungen anbieten | MVP | ServicesApi, VendorServicesPage | services_routes.py | services Tabelle | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | CRUD für Services | Mittel |
| PF-09-003 | Produkte verkaufen | MVP | ProductsApi | compat_routes.py | products Tabelle | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Products CRUD | Mittel |
| PF-09-004 | Mitarbeiter verwalten | MVP | VendorEmployeesPage | employees_routes.py | employees Tabelle | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Employee CRUD | Mittel |
| PF-09-005 | Kalender verwalten | MVP | VendorCalendarPage | hours_routes.py | working_hours | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Kalender + Arbeitszeiten | Mittel |
| PF-09-006 | Standorte besitzen | MVP | LocationsApi | locations_routes.py | locations Tabelle | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Locations CRUD | Mittel |
| PF-09-007 | Affiliates anbinden | MVP | VendorAffiliatesPage | affiliate_routes.py | affiliate_links | ❌ | 🔴 | 🔶 PARTIAL | Affiliate-Routen vorhanden, Vendor-Zuordnung prüfbar | Hoch |
| PF-09-008 | Eigene Landingpages | MVP | BrandsPage | branding_routes.py | branding | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Branding-Modul vorhanden | Mittel |
| PF-09-009 | Marketplace-Sichtbarkeit | MVP | MarketplaceApi | marketplace_routes.py | vendors.is_active | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Marketplace-Filter vorhanden | Mittel |
| PF-09-010 | Eigene Landingpages pro Vendor | MVP | VendorDetailDetailPage | public_routes.py + compat | vendors | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Vendor-Detail-Seite öffentlich | Mittel |
| PF-09-011 | Eigenes Buchungsprofil | MVP | VendorDetailPage + BookingSlotsApi | public_routes.py | vendors | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Buchungsprofil vorhanden | Mittel |
| PF-09-012 | Serviceübersichten | MVP | PublicApi.vendorServices() | public_routes.py | services | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Services public abrufbar | Mittel |
| PF-09-013 | Kalender (öffentlich?) | MVP | BookingSlotsApi | bookings_routes.py | bookings | ❌ | 🔴 | 🔶 PARTIAL | Slots ja, öffentlicher Kalender nein | Mittel |
| PF-09-014 | Branding | MVP | BrandingApi | branding_routes.py | branding | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Branding-Modul | Mittel |
| PF-09-015 | Bilder | MVP | UploadsApi.uploadImage | uploads_routes.py | users/vendors/services | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Base64-Uploads | Hoch (kein S3) |
| PF-09-016 | Bewertungen | MVP | ReviewsApi | reviews_routes.py | reviews Tabelle | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Reviews CRUD + Moderation | Mittel |
| PF-09-017 | Zahlungsoptionen pro Vendor | MVP | PlansApi | checkout_routes.py | (Vendor-eigene Payment-Accounts?) | ❌ | 🔴 | 🔶 PARTIAL | Provider-Abstraktion vorhanden, Vendor-eigene Accounts fraglich | Hoch |

---

## Kapitel 10 – Marketplace-System

| ID | Anforderung | Phase | FE-Nachweis | BE-Nachweis | DB-Nachweis | Tests | Live | Status | Lücke | Risiko |
|----|------------|-------|-------------|-------------|-------------|-------|------|--------|-------|--------|
| PF-10-001 | Öffentliches Verzeichnis | MVP | MarketplacePage.js | marketplace_routes.py | vendors Tabelle | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Marketplace-Seite + API | Mittel |
| PF-10-002 | Suche nach Standort | MVP | MarketplaceApi.vendors() | marketplace_routes.py | vendors.location | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Standortfilter in API | Mittel |
| PF-10-003 | Suche nach Kategorie | MVP | MarketplaceApi.vendors() | marketplace_routes.py | vendors.category | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Kategorie-Filter | Mittel |
| PF-10-004 | Suche nach Bewertung | MVP | MarketplaceApi.vendors() | marketplace_routes.py | vendors.rating | ❌ | 🔴 | 🔶 PARTIAL | Rating-Filter nicht explizit | Mittel |
| PF-10-005 | Suche nach Preis | MVP | MarketplaceApi.services() | marketplace_routes.py | services.price | ❌ | 🔴 | 🔶 PARTIAL | Preisfilter nicht explizit | Mittel |
| PF-10-006 | Suche nach Dienstleistung | MVP | MarketplaceApi.services() | marketplace_routes.py | services | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Services-Listing | Mittel |
| PF-10-007 | Online-/Offline-Filter | MVP | MarketplaceApi.services() | marketplace_routes.py | ❌ | ❌ | 🔴 | ❌ MISSING | Kein Online/Offline-Filter | Mittel |
| PF-10-008 | Reichweite erzeugen | MVP | (Marketplace-Seite) | (Marketplace-logik) | — | ❌ | 🔴 | 📄 DOCUMENTED_ONLY | Anforderung, nicht prüfbar | Niedrig |
| PF-10-009 | Buchungen vermitteln | MVP | CustomerBookingsApi | bookings_routes.py | bookings | ❌ | 🔴 | 🔶 PARTIAL | Buchbar, Vermittlungslogik unklar | Mittel |
| PF-10-010 | Kleinere Dienstleister sichtbar | MVP | MarketplacePage.js | marketplace_routes.py | — | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Grundsätzlich möglich | Niedrig |
| PF-10-011 | Affiliate-Traffic bündeln | MVP | ❌ | affiliate_routes.py | — | ❌ | 🔴 | 🔶 PARTIAL | Affiliate-Routen, Bündelung unklar | Hoch |
| PF-10-012 | Landingpages bereitstellen | MVP | VendorDetailPage.js | public_routes.py | — | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Vendor-Seiten vorhanden | Mittel |
| PF-10-013 | Öffentlich sichtbar | MVP | MarketplacePage.js | vendors.is_active | vendors.is_active | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Filter nach is_active | Mittel |
| PF-10-014 | Verborgen | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Kein visibility-flag != is_active | Mittel |
| PF-10-015 | Nur per Direktlink | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |

---

## Kapitel 11 – Affiliate-Booking-System (★ KERN-USP)

| ID | Anforderung | Phase | FE-Nachweis | BE-Nachweis | DB-Nachweis | Tests | Live | Status | Lücke | Risiko |
|----|------------|-------|-------------|-------------|-------------|-------|------|--------|-------|--------|
| PF-11-001 | Affiliate-System als Kern-USP | MVP | — | — | — | ❌ | 🔴 | 📄 DOCUMENTED_ONLY | Architektur-Anforderung | Hoch |
| PF-11-002 | Vendor bewerben | MVP | AffiliateLinksPage | affiliate_routes.py | affiliate_links | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Grundlegend vorhanden | Hoch |
| PF-11-003 | Dienstleistung bewerben | MVP | AffiliateLinksPage | affiliate_routes.py | affiliate_links | ❌ | 🔴 | 🔶 PARTIAL | Service-Zuordnung prüfbar? | Hoch |
| PF-11-004 | Paket bewerben | MVP | ❌ | affiliate_routes.py | affiliate_links | ❌ | 🔴 | 🔶 PARTIAL | Paket-Tracking unklar | Hoch |
| PF-11-005 | Gutschein bewerben | MVP | ❌ | affiliate_routes.py | affiliate_links | ❌ | 🔴 | 🔶 PARTIAL | Gutschein-Tracking unklar | Hoch |
| PF-11-006 | Festen Termin bewerben | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Slot-basiertes Affiliate-Tracking | Hoch |
| PF-11-007 | Individueller Trackinglink | MVP | AffiliateLinksPage | affiliate_routes.py | affiliate_links | ❌ | 🔴 | 🔶 PARTIAL | Links vorhanden, Qualität ungeprüft | Hoch |
| PF-11-008 | Kunde klickt → Landing | MVP | VendorDetailPage.js | public_routes.py | — | ❌ | 🔴 | 🔶 PARTIAL | Landing auf Vendor-Seite | Hoch |
| PF-11-009 | Kunde bucht Termin | MVP | CustomerBookingsApi | bookings_routes.py | bookings | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Buchung vorhanden | Mittel |
| PF-11-010 | Zahlung verarbeitet | MVP | CheckoutApi | checkout_routes.py | bookings.payment_status | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Stripe + Mock Provider | Hoch |
| PF-11-011 | Umsatz gespeichert | MVP | ❌ | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 PARTIAL | Wallet vorhanden, Umsatz-Verknüpfung unklar | Hoch |
| PF-11-012 | Provision automatisch berechnet | MVP | ❌ | commission_routes.py | commissions | ❌ | 🔴 | 🔶 PARTIAL | Commission-Engine, automatisch? | Hoch |
| PF-11-013 | Provision im Wallet | MVP | AffiliateWalletPage | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 PARTIAL | Wallet + Commissions-Verknüpfung prüfen | Hoch |
| PF-11-014 | Auszahlung beantragbar | MVP | AffiliateWalletPage | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Withdraw-Endpunkt vorhanden | Hoch |
| PF-11-015 | Faire Zusammenarbeit | MVP | — | — | — | ❌ | 🔴 | 📄 DOCUMENTED_ONLY | Nicht technisch prüfbar | Niedrig |
| PF-11-016 | Transparente Umsatzzuordnung | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Keine nachvollziehbare Attribution | Hoch |
| PF-11-017 | Nachvollziehbare Performance | MVP | AffiliateDashboardPage | affiliate_routes.py | — | ❌ | 🔴 | 🔶 PARTIAL | Dashboard vorhanden, Datenqualität unklar | Mittel |
| PF-11-018 | Automatisierte Provisionierung | MVP | ❌ | commission_routes.py | commissions | ❌ | 🔴 | 🔶 PARTIAL | Commission-Engine, Automatisierung unklar | Hoch |
| PF-11-019 | Skalierbares Empfehlungsmarketing | MVP | — | — | — | ❌ | 🔴 | 📄 DOCUMENTED_ONLY | Anforderung | Niedrig |
| PF-11-020 | Affiliate = Kernarchitektur | MVP | — | — | — | ❌ | 🔴 | ❌ MISSING | Aktuell separater Router, nicht tief integriert | Hoch |

---

## Kapitel 12 – Wallet- und Ledger-System

| ID | Anforderung | Phase | FE-Nachweis | BE-Nachweis | DB-Nachweis | Tests | Live | Status | Lücke | Risiko |
|----|------------|-------|-------------|-------------|-------------|-------|------|--------|-------|--------|
| PF-12-001 | Jeder Nutzer erhält Wallet | MVP | WalletApi (FE) | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 PARTIAL | Wallet-Routen vorhanden, automatische Erstellung? | Hoch |
| PF-12-002 | Affiliate-Provisionen | MVP | AffiliateWalletPage | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 PARTIAL | Provisions-Typ vorhanden | Hoch |
| PF-12-003 | Partnerprovisionen | MVP | ❌ | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 PARTIAL | Partner-Typ prüfbar | Hoch |
| PF-12-004 | Rückerstattungen | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Kein Refund-Workflow | Hoch |
| PF-12-005 | Gutscheinreste | MVP | CustomerVouchersApi | voucher_routes.py? | vouchers | ❌ | 🔴 | ❌ MISSING | Vouchers vorhanden, Restguthaben? | Mittel |
| PF-12-006 | Manuelle Gutschriften | MVP | ❌ | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 PARTIAL | deposit-Endpunkt = manuelle Gutschrift | Mittel |
| PF-12-007 | Eigene Einzahlungen | MVP | WalletApi | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | deposit-Endpunkt vorhanden | Mittel |
| PF-12-008 | Unveränderbare Ledger | MVP | — | wallet_routes.py | wallet_transactions | ❌ | 🔴 | ❌ MISSING | append-only? Derzeit POST/PATCH möglich | 🔴 Sehr Hoch |
| PF-12-009 | commission pending | MVP | ❌ | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 PARTIAL | Statusfeld vorhanden | Hoch |
| PF-12-010 | commission approved | MVP | ❌ | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 PARTIAL | Statusfeld vorhanden | Hoch |
| PF-12-011 | payout requested | MVP | AffiliateWalletPage | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | withdraw-Endpunkt | Hoch |
| PF-12-012 | payout paid | MVP | ❌ | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 PARTIAL | Status, aber Auszahlungs-Workflow? | Hoch |
| PF-12-013 | refund credit | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Hoch |
| PF-12-014 | wallet spent | MVP | ❌ | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 PARTIAL | Ausgaben-Typ vorhanden | Hoch |
| PF-12-015 | Vollständig auditierbar | MVP | AdminAuditPage | audit_routes.py | audit_logs | ❌ | 🔴 | 🔶 PARTIAL | Audit-Logs vorhanden, Ledger-Audit? | Hoch |

---

## Kapitel 13 – WhiteLabel-System

| ID | Anforderung | Phase | FE-Nachweis | BE-Nachweis | DB-Nachweis | Tests | Live | Status | Lücke | Risiko |
|----|------------|-------|-------------|-------------|-------------|-------|------|--------|-------|--------|
| PF-13-001 | Eigene Versionen | Phase 2 | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |
| PF-13-002 | Eigene Domains | Phase 2 | BrandingApi.listDomains() | branding_routes.py | vendor_domains | ❌ | 🔴 | 🔶 PARTIAL | Domain-Verwaltung vorhanden, vollständiger WL-Betrieb? | Mittel |
| PF-13-003 | Eigenes Branding | Phase 2 | BrandingApi | branding_routes.py | branding | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Branding-Modul vorhanden | Mittel |
| PF-13-004 | Eigene Kunden | Phase 2 | — | — | — | ❌ | 🔴 | ⬜ OUT_OF_SCOPE | Phase 2 | Niedrig |
| PF-13-005 | Eigene Loginseiten | Phase 2 | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |
| PF-13-006 | Eigene Domains (WL) | Phase 2 | BrandingApi | branding_routes.py | vendor_domains | ❌ | 🔴 | 🔶 PARTIAL | Domain-API, aber WL-Domain-Routing? | Mittel |
| PF-13-007 | Eigenes E-Mail-Branding | Phase 2 | ❌ | config.py/Resend | RESEND_DOMAIN | ❌ | 🔴 | ❌ MISSING | Nutzt neXify-Domain | Mittel |
| PF-13-008 | Eigene Farben | Phase 2 | BrandingApi | branding_routes.py | branding | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Branding vorhanden | Mittel |
| PF-13-009 | Eigene Marketplace-Strukturen | Phase 2 | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Hoch |

---

## Kapitel 14 – CRM-System

| ID | Anforderung | Phase | FE-Nachweis | BE-Nachweis | DB-Nachweis | Tests | Live | Status | Lücke | Risiko |
|----|------------|-------|-------------|-------------|-------------|-------|------|--------|-------|--------|
| PF-14-001 | Kundenprofile | MVP | CustomerProfilePage | users_routes.py | public.users | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | User-Profil vorhanden | Mittel |
| PF-14-002 | Leads | MVP | VendorCustomersPage | crm_routes.py | crm_leads? | ❌ | 🔴 | 🔶 PARTIAL | CRM-Routen vorhanden, Leads-Modell prüfen | Mittel |
| PF-14-003 | Buchungshistorien | MVP | CustomerBookingsPage | customer_routes.py | bookings | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Buchungsliste | Mittel |
| PF-14-004 | Kaufhistorien | MVP | ❌ | orders_router | orders | ❌ | 🔴 | 🔶 PARTIAL | Orders vorhanden, Historie? | Mittel |
| PF-14-005 | Tags | MVP | VendorCustomersPage | crm_routes.py | crm_tags? | ❌ | 🔴 | 🔶 PARTIAL | CRM vorhanden, Tags prüfbar | Mittel |
| PF-14-006 | Notizen | MVP | VendorCustomersPage | crm_routes.py | crm_notes? | ❌ | 🔴 | 🔶 PARTIAL | Notizen prüfbar | Mittel |
| PF-14-007 | Präferenzen | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |
| PF-14-008 | Marketingsegmente | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |
| PF-14-009 | Wiederkehrer-Erkennung | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |
| PF-14-010 | Kundenbindung verbessern | MVP | — | — | — | ❌ | 🔴 | 📄 DOCUMENTED_ONLY | Zielsetzung | Niedrig |
| PF-14-011 | Reaktivierungen ermöglichen | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |
| PF-14-012 | Marketing automatisieren | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Hoch |
| PF-14-013 | Auslastung unterstützen | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |

---

## Kapitel 15 – KI-Strategie

| ID | Anforderung | Phase | FE-Nachweis | BE-Nachweis | DB-Nachweis | Tests | Live | Status | Lücke | Risiko |
|----|------------|-------|-------------|-------------|-------------|-------|------|--------|-------|--------|
| PF-15-001 | KI als Kernbereich | Phase 3 | ❌ | ❌ | ❌ | ❌ | 🔴 | ⬜ OUT_OF_SCOPE | Phase 3 | Niedrig |
| PF-15-002 | KI-Funktionen gesamt | Phase 3 | ❌ | ❌ | ❌ | ❌ | 🔴 | ⬜ OUT_OF_SCOPE | Phase 3 | Niedrig |

---

## Kapitel 16 – Mobile- und App-Strategie

| ID | Anforderung | Phase | FE-Nachweis | BE-Nachweis | DB-Nachweis | Tests | Live | Status | Lücke | Risiko |
|----|------------|-------|-------------|-------------|-------------|-------|------|--------|-------|--------|
| PF-16-001 | Mobile First | MVP | TailwindCSS responsive | — | — | ❌ | 🔴 | 🔶 PARTIAL | CRA + Tailwind, reaktiv geprüft? | Mittel |
| PF-16-002 | Native Apps | Phase 3 | ❌ | ❌ | ❌ | ❌ | 🔴 | ⬜ OUT_OF_SCOPE | Phase 3 | Niedrig |

---

## Kapitel 17 – Geschäftsmodell

| ID | Anforderung | Phase | FE-Nachweis | BE-Nachweis | DB-Nachweis | Tests | Live | Status | Lücke | Risiko |
|----|------------|-------|-------------|-------------|-------------|-------|------|--------|-------|--------|
| PF-17-001 | Monatliches SaaS-Modell | MVP | PricingPage | plans_routes.py | plans | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Plans vorhanden | Mittel |
| PF-17-002 | 30-Tage-Testphase | MVP | PlansApi | plans_routes.py | subscriptions | ❌ | 🔴 | 🔶 PARTIAL | subscription vorhanden, Trial-Logik? | Hoch |
| PF-17-009 | Automatische Umstellung | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Hoch |
| PF-17-003 | Standardpaket 49 € | MVP | PricingPage | plans_routes.py | plans.price_monthly | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Preis im Plan? | Mittel |
| PF-17-004 | Affiliate-Booking 189 € | MVP | PricingPage | plans_routes.py | plans.price_monthly | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Preis im Plan? | Mittel |
| PF-17-005 | Eigene Zahlungsanbieter | MVP | — | payment_providers.py | — | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Provider-Abstraktion vorhanden | Hoch |
| PF-17-006 | 2,5 % Auszahlungsgebühr | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Keine Gebührenlogik | Hoch |
| PF-17-007 | 5 % + 1 € Plattformgebühr | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Keine Gebührenlogik | Hoch |
| PF-17-008 | Provider-unabhängig | MVP | — | payment_providers.py | — | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Abstraktion vorhanden, PayPal/Mollie/Klarna? | Mittel |
| PF-17-010 | Direkte Auszahlung Vendor | MVP | WalletApi | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 PARTIAL | Withdraw-Endpunkt, direkt an Vendor? | Hoch |
| PF-17-011 | Plattform-Split-Payment | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Hoch |
| PF-17-012 | Affiliate-Split | MVP | ❌ | commission_routes.py | commissions | ❌ | 🔴 | 🔶 PARTIAL | Commission-Engine, Split-Logik? | Hoch |
| PF-17-013 | Franchise-Split | Phase 2 | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |
| PF-17-014 | WhiteLabel-Split | Phase 2 | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |

---

## Kapitel 18 – Technisches Zielbild

| ID | Anforderung | Phase | FE-Nachweis | BE-Nachweis | DB-Nachweis | Tests | Live | Status | Lücke | Risiko |
|----|------------|-------|-------------|-------------|-------------|-------|------|--------|-------|--------|
| PF-18-001 | Modular | MVP | — | FastAPI-Module | — | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Module vorhanden | Mittel |
| PF-18-002 | Skalierbar | MVP | — | — | — | ❌ | 🔴 | 📄 DOCUMENTED_ONLY | Nicht prüfbar | Mittel |
| PF-18-003 | API-First | MVP | api.js/apiClient.js | 195 Routes | — | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | API-first design | Mittel |
| PF-18-004 | Multi-Tenant | MVP | AuthContext, PortalContext | auth_routes.context | users.tenants | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Tenant-Wechsel vorhanden | Hoch |
| PF-18-005 | WhiteLabel-fähig | MVP | BrandingApi | branding_routes.py | branding,domains | ❌ | 🔴 | 🔶 PARTIAL | Vorhanden, aber unvollständig | Hoch |
| PF-18-006 | Internationalisierbar | MVP | i18n.js, translation.json | X-Lang-Header | users.language | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | i18n + Sprache im Profil | Mittel |
| PF-18-007 | Payment-unabhängig | MVP | — | payment_providers.py | — | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Provider-Abstraktion | Hoch |
| PF-18-008 | Langfrist-Anforderungen | alle | — | — | — | ❌ | 🔴 | ⬜ OUT_OF_SCOPE | Gesamtarchitektur | Niedrig |

---

## Kapitel 19 – Entwicklerprioritäten

| ID | Anforderung | Phase | FE-Nachweis | BE-Nachweis | DB-Nachweis | Tests | Live | Status | Lücke | Risiko |
|----|------------|-------|-------------|-------------|-------------|-------|------|--------|-------|--------|
| PF-19-001 | Nicht als kleines Tool entwickeln | MVP | — | — | — | — | — | 📄 DOCUMENTED_ONLY | Architektur-Prinzip | Mittel |
| PF-19-002 | Kalender- & Ressourcenlogik | MVP | (siehe 8) | (siehe 8) | (siehe 8) | ❌ | 🔴 | 🔶 PARTIAL | Ressourcen fehlen | Hoch |
| PF-19-003 | Wallet- & Ledger-System | MVP | (siehe 12) | (siehe 12) | (siehe 12) | ❌ | 🔴 | 🔶 PARTIAL | Ledger nicht unveränderbar | 🔴 Sehr Hoch |
| PF-19-004 | Affiliate-Tracking | MVP | (siehe 11) | (siehe 11) | (siehe 11) | ❌ | 🔴 | 🔶 PARTIAL | Tracking-Qualität unklar | Hoch |
| PF-19-005 | Rollen- & Rechteverwaltung | MVP | AuthContext.js | auth_routes, security.py | users.roles/tenants | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Rollensystem vorhanden | Mittel |
| PF-19-006 | WhiteLabel-Struktur | Phase 2 | BrandingApi | branding_routes.py | branding/domains | ❌ | 🔴 | 🔶 PARTIAL | Früh mitgedacht? Ja, Domain/Branding vorhanden | Mittel |
| PF-19-007 | API-Architektur | MVP | api.js | 195 Routes | — | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Umfangreich | Mittel |

---

## Kapitel 20 – MVP-Strategie (Zusammenfassung)

| MVP-Baustein | Status | Erfüllungsgrad |
|-------------|--------|---------------|
| ✅ Terminbuchung | 🔶 PARTIAL | Basis-CRUD vorhanden, Zeitslot-Logik, Doppelbuchungsschutz, Puffer, Vorlauf, Gruppen fehlen |
| ✅ Vendor-System | 🔶 PARTIAL | CRUD vorhanden, Affiliate-Anbindung, Landingpages, Branding teilweise |
| ✅ Kalender | 🔶 PARTIAL | Slots + Working-Hours vorhanden, Kalender-Sync, Ressourcen fehlen |
| ✅ Zahlungen | 🔶 PARTIAL | Stripe + Mock-Provider, Provider-Abstraktion, Splits fehlen |
| ✅ Marketplace | 🔶 PARTIAL | Verzeichnis + Suche vorhanden, Sichtbarkeitslogik unvollständig |
| ✅ Vendor-Unterseiten | 🔶 IMPLEMENTED_UNVERIFIED | Öffentliche Vendor-Seiten vorhanden |
| ✅ Affiliate-Tracking | 🔶 PARTIAL | Grundlegend vorhanden, tiefe Integration fraglich |
| ✅ Wallet-System | 🔶 PARTIAL | Balance + Transactions, Ledger nicht unveränderbar |
| ✅ Grundlegendes CRM | 🔶 PARTIAL | Kundenprofile + Notizen/Tags, Automationen fehlen |

**MVP-Gesamterfüllungsgrad:** ca. **40-50%** — Grundstruktur steht, aber tiefe fachliche Implementierung fehlt großflächig.

---

## Phase 2 & Phase 3 -Voraussetzungen

| Voraussetzung | Erfüllt | Lücke |
|--------------|---------|-------|
| WhiteLabel-Domain-Verwaltung | 🔶 PARTIAL | Domain-API, aber vollständiger WL-Betrieb fehlt |
| Tenant-Isolation | 🔶 PARTIAL | active_tenant-Mechanismus, aber Isolation nicht geprüft |
| Provider-Abstraktion | 🔶 IMPLEMENTED_UNVERIFIED | Abstraktion vorhanden, PayPal/Mollie/Klarna fehlen |
| i18n-Infrastruktur | 🔶 IMPLEMENTED_UNVERIFIED | i18next + Backend-Language-Support |
| API-First-Design | 🔶 IMPLEMENTED_UNVERIFIED | REST-API vorhanden |

---

## Zusammenfassung der Lücken

| Kategorie | Gesamt | ✅ | 🔶 | ❌ | 📄 | ⬜ |
|-----------|--------|---|----|----|-----|----|
| Terminbuchung (Kap 8) | 25 | 0 | 12 | 13 | 0 | 0 |
| Vendor-System (Kap 9) | 17 | 0 | 16 | 1 | 0 | 0 |
| Marketplace (Kap 10) | 15 | 0 | 11 | 4 | 0 | 0 |
| Affiliate (Kap 11) | 18 | 0 | 11 | 4 | 3 | 0 |
| Wallet/Ledger (Kap 12) | 16 | 0 | 11 | 4 | 0 | 0 |
| WhiteLabel (Kap 13) | 9 | 0 | 4 | 4 | 0 | 1 |
| CRM (Kap 14) | 13 | 0 | 7 | 5 | 1 | 0 |
| KI (Kap 15) | 2 | 0 | 0 | 0 | 0 | 2 |
| Mobile (Kap 16) | 2 | 0 | 1 | 0 | 0 | 1 |
| Geschäftsmodell (Kap 17) | 14 | 0 | 9 | 5 | 0 | 0 |
| Technisches Zielbild (Kap 18) | 7 | 0 | 6 | 0 | 1 | 0 |
| Entwicklerprioritäten (Kap 19) | 6 | 0 | 5 | 0 | 1 | 0 |

| **Gesamt** | **144** | **0** | **93** | **40** | **6** | **4** |
| **VERIFIED_COMPLETE** | **0%** | | | | | |

---

## 🔴 P0-Sicherheitsmaßnahmen (parallel)

1. **Supabase-Secrets aus Code entfernen** — `config.py`, `db.py`, `security.py`
2. **Rate Limiting für Auth** — `POST /auth/login`, `/auth/register`, `/auth/refresh`
3. **Tokens aus localStorage in httpOnly-Cookies** (oder XSS-Härtung)
4. **CORS einschränken** auf `bookando.de`, `localhost:3000`

Siehe Baseline-Audit für vollständige Liste.

---

*Traceability erstellt 17.06.2026. Ein `VERIFIED_COMPLETE` erfordert fachliche Tests + Live-Verifikation. Beides derzeit nicht möglich (API 402).*