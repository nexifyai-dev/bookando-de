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
| 8.1.1 | Echte Terminlogik (kein Produkt) | MVP | api.js: CustomerBookingsApi, BookingSlotsApi | bookings_routes.py | bookings Tabelle (Supabase) | ❌ | 🔴 (402) | 🔶 PARTIAL | Slots-Logik vorhanden, aber Doppelbuchungsschutz, Races, Puffer nicht geprüft | Mittel |
| 8.1.2 | Datum | MVP | BookingSlotsApi.available() | POST /bookings/slots | bookings.start_at | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | vorhanden | Mittel |
| 8.1.3 | Uhrzeit | MVP | BookingSlotsApi.available() | POST /bookings/slots | bookings.start_at/end_at | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | vorhanden | Mittel |
| 8.1.4 | Dauer | MVP | PublicApi.slots() | services.duration | services Tabelle | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Duration in services, Slot-Berechnung vorhanden | Mittel |
| 8.1.5 | Mitarbeiter-Zuordnung | MVP | EmployeeAccountsApi | employees_routes.py | employees Tabelle | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | vorhanden | Mittel |
| 8.1.6 | Standort-Zuordnung | MVP | LocationsApi | locations_routes.py | locations Tabelle | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | vorhanden | Mittel |
| 8.1.7 | Ressourcen | MVP | ResourcesApi (FE) | (nicht gefunden) | (nicht gefunden) | ❌ | 🔴 | ❌ MISSING | ResourcesApi im Frontend, aber Backend-Modul fehlt | Hoch |
| 8.1.8 | Vorlaufzeiten | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Hoch |
| 8.1.9 | Pufferzeiten | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Hoch |
| 8.1.10 | Gruppenlogik | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Hoch |
| 8.1.11 | Online-/Offline-Termine | MVP | CustomerBookingsApi.create | bookings_routes.py | bookings | ❌ | 🔴 | 🔶 PARTIAL | Buchung vorhanden, aber Online/Offline-Typ nicht klar getrennt | Mittel |
| 8.2.1 | Einzeltermine | MVP | CustomerBookingsApi.create() | POST /bookings | bookings | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Vorhanden | Mittel |
| 8.2.2 | Mehrfachsitzungen | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Hoch |
| 8.2.3 | Beratungsgespräche | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht als Service-Typ differenziert | Niedrig |
| 8.2.4 | Gruppenbuchungen | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Hoch |
| 8.2.5 | Online-Termine | MVP | CustomerBookingsApi.create() | bookings_routes.py | bookings | ❌ | 🔴 | 🔶 PARTIAL | Buchbar, aber kein Video/Meeting-Integration | Mittel |
| 8.2.6 | Vor-Ort-Termine | MVP | CustomerBookingsApi.create() | bookings_routes.py | bookings | ❌ | 🔴 | 🔶 PARTIAL | Buchbar | Mittel |
| 8.2.7 | Paketbuchungen | MVP | VendorBookingsApi (FE) | bookings_routes.py | bookings/packages | ❌ | 🔴 | 🔶 PARTIAL | Packages API vorhanden, aber Paketbuchungslogik fraglich | Mittel |
| 8.2.8 | Wiederkehrende Termine | MVP | CustomerBookingsApi.createRecurring() | bookings_routes.py | bookings (recurring) | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | createRecurring FE vorhanden, BE muss geprüft werden | Mittel |
| 8.3.1 | Zeitslots blockierbar | MVP | POST /bookings/slots | bookings_routes.py | bookings | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Booking-Create blockiert Slots | Mittel |
| 8.3.2 | Zeitslots reservierbar | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Kein Reservierungsmechanismus | Mittel |
| 8.3.3 | Zeitslots synchronisierbar | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Kein Kalender-Sync (iCal/Google) | Hoch |
| 8.3.4 | Zeitslots direkt teilbar | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Kein Direktlink-Mechanismus pro Slot | Mittel |
| 8.3.5 | Affiliate-fähige Slots | MVP | ❌ | commission_routes.py | commissions | ❌ | 🔴 | 🔶 PARTIAL | Commission-Engine existiert, aber Slot-Attribution unklar | Hoch |
| 8.3.6 | Teilbar via Direktlinks | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |
| 8.3.7 | Teilbar via Social Media | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |
| 8.3.8 | Teilbar via QR-Codes | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |
| 8.3.9 | Teilbar via Werbekampagnen | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |
| 8.3.10 | Teilbar via Affiliate-Links | MVP | ❌ | affiliate_routes.py | affiliate_links | ❌ | 🔴 | 🔶 PARTIAL | Affiliate-Routes vorhanden, konkrete Link-Teilbarkeit unklar | Hoch |

---

## Kapitel 9 – Vendor-System

| ID | Anforderung | Phase | FE-Nachweis | BE-Nachweis | DB-Nachweis | Tests | Live | Status | Lücke | Risiko |
|----|------------|-------|-------------|-------------|-------------|-------|------|--------|-------|--------|
| 9.1.1 | Vendor als Organisationseinheit | MVP | PortalContext.js, navItems | vendor_routes.py | vendors Tabelle | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Vendor-Entity vorhanden | Mittel |
| 9.1.2 | Dienstleistungen anbieten | MVP | ServicesApi, VendorServicesPage | services_routes.py | services Tabelle | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | CRUD für Services | Mittel |
| 9.1.3 | Produkte verkaufen | MVP | ProductsApi | compat_routes.py | products Tabelle | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Products CRUD | Mittel |
| 9.1.4 | Mitarbeiter verwalten | MVP | VendorEmployeesPage | employees_routes.py | employees Tabelle | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Employee CRUD | Mittel |
| 9.1.5 | Kalender verwalten | MVP | VendorCalendarPage | hours_routes.py | working_hours | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Kalender + Arbeitszeiten | Mittel |
| 9.1.6 | Standorte besitzen | MVP | LocationsApi | locations_routes.py | locations Tabelle | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Locations CRUD | Mittel |
| 9.1.7 | Affiliates anbinden | MVP | VendorAffiliatesPage | affiliate_routes.py | affiliate_links | ❌ | 🔴 | 🔶 PARTIAL | Affiliate-Routen vorhanden, Vendor-Zuordnung prüfbar | Hoch |
| 9.1.8 | Eigene Landingpages | MVP | BrandsPage | branding_routes.py | branding | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Branding-Modul vorhanden | Mittel |
| 9.1.9 | Marketplace-Sichtbarkeit | MVP | MarketplaceApi | marketplace_routes.py | vendors.is_active | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Marketplace-Filter vorhanden | Mittel |
| 9.2.1 | Eigene Landingpages pro Vendor | MVP | VendorDetailDetailPage | public_routes.py + compat | vendors | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Vendor-Detail-Seite öffentlich | Mittel |
| 9.2.2 | Eigenes Buchungsprofil | MVP | VendorDetailPage + BookingSlotsApi | public_routes.py | vendors | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Buchungsprofil vorhanden | Mittel |
| 9.2.3 | Serviceübersichten | MVP | PublicApi.vendorServices() | public_routes.py | services | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Services public abrufbar | Mittel |
| 9.2.4 | Kalender (öffentlich?) | MVP | BookingSlotsApi | bookings_routes.py | bookings | ❌ | 🔴 | 🔶 PARTIAL | Slots ja, öffentlicher Kalender nein | Mittel |
| 9.2.5 | Branding | MVP | BrandingApi | branding_routes.py | branding | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Branding-Modul | Mittel |
| 9.2.6 | Bilder | MVP | UploadsApi.uploadImage | uploads_routes.py | users/vendors/services | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Base64-Uploads | Hoch (kein S3) |
| 9.2.7 | Bewertungen | MVP | ReviewsApi | reviews_routes.py | reviews Tabelle | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Reviews CRUD + Moderation | Mittel |
| 9.2.8 | Zahlungsoptionen pro Vendor | MVP | PlansApi | checkout_routes.py | (Vendor-eigene Payment-Accounts?) | ❌ | 🔴 | 🔶 PARTIAL | Provider-Abstraktion vorhanden, Vendor-eigene Accounts fraglich | Hoch |

---

## Kapitel 10 – Marketplace-System

| ID | Anforderung | Phase | FE-Nachweis | BE-Nachweis | DB-Nachweis | Tests | Live | Status | Lücke | Risiko |
|----|------------|-------|-------------|-------------|-------------|-------|------|--------|-------|--------|
| 10.1.1 | Öffentliches Verzeichnis | MVP | MarketplacePage.js | marketplace_routes.py | vendors Tabelle | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Marketplace-Seite + API | Mittel |
| 10.1.2 | Suche nach Standort | MVP | MarketplaceApi.vendors() | marketplace_routes.py | vendors.location | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Standortfilter in API | Mittel |
| 10.1.3 | Suche nach Kategorie | MVP | MarketplaceApi.vendors() | marketplace_routes.py | vendors.category | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Kategorie-Filter | Mittel |
| 10.1.4 | Suche nach Bewertung | MVP | MarketplaceApi.vendors() | marketplace_routes.py | vendors.rating | ❌ | 🔴 | 🔶 PARTIAL | Rating-Filter nicht explizit | Mittel |
| 10.1.5 | Suche nach Preis | MVP | MarketplaceApi.services() | marketplace_routes.py | services.price | ❌ | 🔴 | 🔶 PARTIAL | Preisfilter nicht explizit | Mittel |
| 10.1.6 | Suche nach Dienstleistung | MVP | MarketplaceApi.services() | marketplace_routes.py | services | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Services-Listing | Mittel |
| 10.1.7 | Online-/Offline-Filter | MVP | MarketplaceApi.services() | marketplace_routes.py | ❌ | ❌ | 🔴 | ❌ MISSING | Kein Online/Offline-Filter | Mittel |
| 10.2.1 | Reichweite erzeugen | MVP | (Marketplace-Seite) | (Marketplace-logik) | — | ❌ | 🔴 | 📄 DOCUMENTED_ONLY | Anforderung, nicht prüfbar | Niedrig |
| 10.2.2 | Buchungen vermitteln | MVP | CustomerBookingsApi | bookings_routes.py | bookings | ❌ | 🔴 | 🔶 PARTIAL | Buchbar, Vermittlungslogik unklar | Mittel |
| 10.2.3 | Kleinere Dienstleister sichtbar | MVP | MarketplacePage.js | marketplace_routes.py | — | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Grundsätzlich möglich | Niedrig |
| 10.2.4 | Affiliate-Traffic bündeln | MVP | ❌ | affiliate_routes.py | — | ❌ | 🔴 | 🔶 PARTIAL | Affiliate-Routen, Bündelung unklar | Hoch |
| 10.2.5 | Landingpages bereitstellen | MVP | VendorDetailPage.js | public_routes.py | — | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Vendor-Seiten vorhanden | Mittel |
| 10.3.1 | Öffentlich sichtbar | MVP | MarketplacePage.js | vendors.is_active | vendors.is_active | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Filter nach is_active | Mittel |
| 10.3.2 | Verborgen | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Kein visibility-flag != is_active | Mittel |
| 10.3.3 | Nur per Direktlink | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |

---

## Kapitel 11 – Affiliate-Booking-System (★ KERN-USP)

| ID | Anforderung | Phase | FE-Nachweis | BE-Nachweis | DB-Nachweis | Tests | Live | Status | Lücke | Risiko |
|----|------------|-------|-------------|-------------|-------------|-------|------|--------|-------|--------|
| 11.1 | Affiliate-System als Kern-USP | MVP | — | — | — | ❌ | 🔴 | 📄 DOCUMENTED_ONLY | Architektur-Anforderung | Hoch |
| 11.2.1 | Vendor bewerben | MVP | AffiliateLinksPage | affiliate_routes.py | affiliate_links | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Grundlegend vorhanden | Hoch |
| 11.2.2 | Dienstleistung bewerben | MVP | AffiliateLinksPage | affiliate_routes.py | affiliate_links | ❌ | 🔴 | 🔶 PARTIAL | Service-Zuordnung prüfbar? | Hoch |
| 11.2.3 | Paket bewerben | MVP | ❌ | affiliate_routes.py | affiliate_links | ❌ | 🔴 | 🔶 PARTIAL | Paket-Tracking unklar | Hoch |
| 11.2.4 | Gutschein bewerben | MVP | ❌ | affiliate_routes.py | affiliate_links | ❌ | 🔴 | 🔶 PARTIAL | Gutschein-Tracking unklar | Hoch |
| 11.2.5 | Festen Termin bewerben | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Slot-basiertes Affiliate-Tracking | Hoch |
| 11.3.1 | Individueller Trackinglink | MVP | AffiliateLinksPage | affiliate_routes.py | affiliate_links | ❌ | 🔴 | 🔶 PARTIAL | Links vorhanden, Qualität ungeprüft | Hoch |
| 11.3.2 | Kunde klickt → Landing | MVP | VendorDetailPage.js | public_routes.py | — | ❌ | 🔴 | 🔶 PARTIAL | Landing auf Vendor-Seite | Hoch |
| 11.3.3 | Kunde bucht Termin | MVP | CustomerBookingsApi | bookings_routes.py | bookings | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Buchung vorhanden | Mittel |
| 11.3.4 | Zahlung verarbeitet | MVP | CheckoutApi | checkout_routes.py | bookings.payment_status | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Stripe + Mock Provider | Hoch |
| 11.3.5 | Umsatz gespeichert | MVP | ❌ | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 PARTIAL | Wallet vorhanden, Umsatz-Verknüpfung unklar | Hoch |
| 11.3.6 | Provision automatisch berechnet | MVP | ❌ | commission_routes.py | commissions | ❌ | 🔴 | 🔶 PARTIAL | Commission-Engine, automatisch? | Hoch |
| 11.3.7 | Provision im Wallet | MVP | AffiliateWalletPage | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 PARTIAL | Wallet + Commissions-Verknüpfung prüfen | Hoch |
| 11.3.8 | Auszahlung beantragbar | MVP | AffiliateWalletPage | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Withdraw-Endpunkt vorhanden | Hoch |
| 11.4.1 | Faire Zusammenarbeit | MVP | — | — | — | ❌ | 🔴 | 📄 DOCUMENTED_ONLY | Nicht technisch prüfbar | Niedrig |
| 11.4.2 | Transparente Umsatzzuordnung | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Keine nachvollziehbare Attribution | Hoch |
| 11.4.3 | Nachvollziehbare Performance | MVP | AffiliateDashboardPage | affiliate_routes.py | — | ❌ | 🔴 | 🔶 PARTIAL | Dashboard vorhanden, Datenqualität unklar | Mittel |
| 11.4.4 | Automatisierte Provisionierung | MVP | ❌ | commission_routes.py | commissions | ❌ | 🔴 | 🔶 PARTIAL | Commission-Engine, Automatisierung unklar | Hoch |
| 11.4.5 | Skalierbares Empfehlungsmarketing | MVP | — | — | — | ❌ | 🔴 | 📄 DOCUMENTED_ONLY | Anforderung | Niedrig |
| 11.5 | Affiliate = Kernarchitektur | MVP | — | — | — | ❌ | 🔴 | ❌ MISSING | Aktuell separater Router, nicht tief integriert | Hoch |

---

## Kapitel 12 – Wallet- und Ledger-System

| ID | Anforderung | Phase | FE-Nachweis | BE-Nachweis | DB-Nachweis | Tests | Live | Status | Lücke | Risiko |
|----|------------|-------|-------------|-------------|-------------|-------|------|--------|-------|--------|
| 12.1.1 | Jeder Nutzer erhält Wallet | MVP | WalletApi (FE) | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 PARTIAL | Wallet-Routen vorhanden, automatische Erstellung? | Hoch |
| 12.1.2 | Affiliate-Provisionen | MVP | AffiliateWalletPage | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 PARTIAL | Provisions-Typ vorhanden | Hoch |
| 12.1.3 | Partnerprovisionen | MVP | ❌ | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 PARTIAL | Partner-Typ prüfbar | Hoch |
| 12.1.4 | Rückerstattungen | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Kein Refund-Workflow | Hoch |
| 12.1.5 | Gutscheinreste | MVP | CustomerVouchersApi | voucher_routes.py? | vouchers | ❌ | 🔴 | ❌ MISSING | Vouchers vorhanden, Restguthaben? | Mittel |
| 12.1.6 | Manuelle Gutschriften | MVP | ❌ | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 PARTIAL | deposit-Endpunkt = manuelle Gutschrift | Mittel |
| 12.1.7 | Eigene Einzahlungen | MVP | WalletApi | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | deposit-Endpunkt vorhanden | Mittel |
| 12.2.1 | Unveränderbare Ledger | MVP | — | wallet_routes.py | wallet_transactions | ❌ | 🔴 | ❌ MISSING | append-only? Derzeit POST/PATCH möglich | 🔴 Sehr Hoch |
| 12.2.2 | commission pending | MVP | ❌ | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 PARTIAL | Statusfeld vorhanden | Hoch |
| 12.2.3 | commission approved | MVP | ❌ | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 PARTIAL | Statusfeld vorhanden | Hoch |
| 12.2.4 | payout requested | MVP | AffiliateWalletPage | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | withdraw-Endpunkt | Hoch |
| 12.2.5 | payout paid | MVP | ❌ | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 PARTIAL | Status, aber Auszahlungs-Workflow? | Hoch |
| 12.2.6 | refund credit | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Hoch |
| 12.2.7 | wallet spent | MVP | ❌ | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 PARTIAL | Ausgaben-Typ vorhanden | Hoch |
| 12.2.8 | Vollständig auditierbar | MVP | AdminAuditPage | audit_routes.py | audit_logs | ❌ | 🔴 | 🔶 PARTIAL | Audit-Logs vorhanden, Ledger-Audit? | Hoch |

---

## Kapitel 13 – WhiteLabel-System

| ID | Anforderung | Phase | FE-Nachweis | BE-Nachweis | DB-Nachweis | Tests | Live | Status | Lücke | Risiko |
|----|------------|-------|-------------|-------------|-------------|-------|------|--------|-------|--------|
| 13.1.1 | Eigene Versionen | Phase 2 | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |
| 13.1.2 | Eigene Domains | Phase 2 | BrandingApi.listDomains() | branding_routes.py | vendor_domains | ❌ | 🔴 | 🔶 PARTIAL | Domain-Verwaltung vorhanden, vollständiger WL-Betrieb? | Mittel |
| 13.1.3 | Eigenes Branding | Phase 2 | BrandingApi | branding_routes.py | branding | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Branding-Modul vorhanden | Mittel |
| 13.1.4 | Eigene Kunden | Phase 2 | — | — | — | ❌ | 🔴 | ⬜ OUT_OF_SCOPE | Phase 2 | Niedrig |
| 13.2.1 | Eigene Loginseiten | Phase 2 | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |
| 13.2.2 | Eigene Domains (WL) | Phase 2 | BrandingApi | branding_routes.py | vendor_domains | ❌ | 🔴 | 🔶 PARTIAL | Domain-API, aber WL-Domain-Routing? | Mittel |
| 13.2.3 | Eigenes E-Mail-Branding | Phase 2 | ❌ | config.py/Resend | RESEND_DOMAIN | ❌ | 🔴 | ❌ MISSING | Nutzt neXify-Domain | Mittel |
| 13.2.4 | Eigene Farben | Phase 2 | BrandingApi | branding_routes.py | branding | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Branding vorhanden | Mittel |
| 13.2.5 | Eigene Marketplace-Strukturen | Phase 2 | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Hoch |

---

## Kapitel 14 – CRM-System

| ID | Anforderung | Phase | FE-Nachweis | BE-Nachweis | DB-Nachweis | Tests | Live | Status | Lücke | Risiko |
|----|------------|-------|-------------|-------------|-------------|-------|------|--------|-------|--------|
| 14.1.1 | Kundenprofile | MVP | CustomerProfilePage | users_routes.py | public.users | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | User-Profil vorhanden | Mittel |
| 14.1.2 | Leads | MVP | VendorCustomersPage | crm_routes.py | crm_leads? | ❌ | 🔴 | 🔶 PARTIAL | CRM-Routen vorhanden, Leads-Modell prüfen | Mittel |
| 14.1.3 | Buchungshistorien | MVP | CustomerBookingsPage | customer_routes.py | bookings | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Buchungsliste | Mittel |
| 14.1.4 | Kaufhistorien | MVP | ❌ | orders_router | orders | ❌ | 🔴 | 🔶 PARTIAL | Orders vorhanden, Historie? | Mittel |
| 14.1.5 | Tags | MVP | VendorCustomersPage | crm_routes.py | crm_tags? | ❌ | 🔴 | 🔶 PARTIAL | CRM vorhanden, Tags prüfbar | Mittel |
| 14.1.6 | Notizen | MVP | VendorCustomersPage | crm_routes.py | crm_notes? | ❌ | 🔴 | 🔶 PARTIAL | Notizen prüfbar | Mittel |
| 14.1.7 | Präferenzen | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |
| 14.1.8 | Marketingsegmente | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |
| 14.1.9 | Wiederkehrer-Erkennung | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |
| 14.2.1 | Kundenbindung verbessern | MVP | — | — | — | ❌ | 🔴 | 📄 DOCUMENTED_ONLY | Zielsetzung | Niedrig |
| 14.2.2 | Reaktivierungen ermöglichen | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |
| 14.2.3 | Marketing automatisieren | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Hoch |
| 14.2.4 | Auslastung unterstützen | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |

---

## Kapitel 15 – KI-Strategie

| ID | Anforderung | Phase | FE-Nachweis | BE-Nachweis | DB-Nachweis | Tests | Live | Status | Lücke | Risiko |
|----|------------|-------|-------------|-------------|-------------|-------|------|--------|-------|--------|
| 15.1 | KI als Kernbereich | Phase 3 | ❌ | ❌ | ❌ | ❌ | 🔴 | ⬜ OUT_OF_SCOPE | Phase 3 | Niedrig |
| 15.2.1-10 | KI-Funktionen gesamt | Phase 3 | ❌ | ❌ | ❌ | ❌ | 🔴 | ⬜ OUT_OF_SCOPE | Phase 3 | Niedrig |

---

## Kapitel 16 – Mobile- und App-Strategie

| ID | Anforderung | Phase | FE-Nachweis | BE-Nachweis | DB-Nachweis | Tests | Live | Status | Lücke | Risiko |
|----|------------|-------|-------------|-------------|-------------|-------|------|--------|-------|--------|
| 16.1 | Mobile First | MVP | TailwindCSS responsive | — | — | ❌ | 🔴 | 🔶 PARTIAL | CRA + Tailwind, reaktiv geprüft? | Mittel |
| 16.2-16.3 | Native Apps | Phase 3 | ❌ | ❌ | ❌ | ❌ | 🔴 | ⬜ OUT_OF_SCOPE | Phase 3 | Niedrig |

---

## Kapitel 17 – Geschäftsmodell

| ID | Anforderung | Phase | FE-Nachweis | BE-Nachweis | DB-Nachweis | Tests | Live | Status | Lücke | Risiko |
|----|------------|-------|-------------|-------------|-------------|-------|------|--------|-------|--------|
| 17.1 | Monatliches SaaS-Modell | MVP | PricingPage | plans_routes.py | plans | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Plans vorhanden | Mittel |
| 17.2 | 30-Tage-Testphase | MVP | PlansApi | plans_routes.py | subscriptions | ❌ | 🔴 | 🔶 PARTIAL | subscription vorhanden, Trial-Logik? | Hoch |
| 17.2(6) | Automatische Umstellung | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Hoch |
| 17.3 | Standardpaket 49 € | MVP | PricingPage | plans_routes.py | plans.price_monthly | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Preis im Plan? | Mittel |
| 17.4 | Affiliate-Booking 189 € | MVP | PricingPage | plans_routes.py | plans.price_monthly | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Preis im Plan? | Mittel |
| 17.5 | Eigene Zahlungsanbieter | MVP | — | payment_providers.py | — | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Provider-Abstraktion vorhanden | Hoch |
| 17.6 | 2,5 % Auszahlungsgebühr | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Keine Gebührenlogik | Hoch |
| 17.7 | 5 % + 1 € Plattformgebühr | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Keine Gebührenlogik | Hoch |
| 17.8 | Provider-unabhängig | MVP | — | payment_providers.py | — | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Abstraktion vorhanden, PayPal/Mollie/Klarna? | Mittel |
| 17.8(3) | Direkte Auszahlung Vendor | MVP | WalletApi | wallet_routes.py | wallet_transactions | ❌ | 🔴 | 🔶 PARTIAL | Withdraw-Endpunkt, direkt an Vendor? | Hoch |
| 17.8(4) | Plattform-Split-Payment | MVP | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Hoch |
| 17.8(5) | Affiliate-Split | MVP | ❌ | commission_routes.py | commissions | ❌ | 🔴 | 🔶 PARTIAL | Commission-Engine, Split-Logik? | Hoch |
| 17.8(6) | Franchise-Split | Phase 2 | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |
| 17.8(7) | WhiteLabel-Split | Phase 2 | ❌ | ❌ | ❌ | ❌ | 🔴 | ❌ MISSING | Nicht implementiert | Mittel |

---

## Kapitel 18 – Technisches Zielbild

| ID | Anforderung | Phase | FE-Nachweis | BE-Nachweis | DB-Nachweis | Tests | Live | Status | Lücke | Risiko |
|----|------------|-------|-------------|-------------|-------------|-------|------|--------|-------|--------|
| 18.1.1 | Modular | MVP | — | FastAPI-Module | — | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Module vorhanden | Mittel |
| 18.1.2 | Skalierbar | MVP | — | — | — | ❌ | 🔴 | 📄 DOCUMENTED_ONLY | Nicht prüfbar | Mittel |
| 18.1.3 | API-First | MVP | api.js/apiClient.js | 195 Routes | — | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | API-first design | Mittel |
| 18.1.4 | Multi-Tenant | MVP | AuthContext, PortalContext | auth_routes.context | users.tenants | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Tenant-Wechsel vorhanden | Hoch |
| 18.1.5 | WhiteLabel-fähig | MVP | BrandingApi | branding_routes.py | branding,domains | ❌ | 🔴 | 🔶 PARTIAL | Vorhanden, aber unvollständig | Hoch |
| 18.1.6 | Internationalisierbar | MVP | i18n.js, translation.json | X-Lang-Header | users.language | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | i18n + Sprache im Profil | Mittel |
| 18.1.7 | Payment-unabhängig | MVP | — | payment_providers.py | — | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Provider-Abstraktion | Hoch |
| 18.2.1-11 | Langfrist-Anforderungen | alle | — | — | — | ❌ | 🔴 | ⬜ OUT_OF_SCOPE | Gesamtarchitektur | Niedrig |

---

## Kapitel 19 – Entwicklerprioritäten

| ID | Anforderung | Phase | FE-Nachweis | BE-Nachweis | DB-Nachweis | Tests | Live | Status | Lücke | Risiko |
|----|------------|-------|-------------|-------------|-------------|-------|------|--------|-------|--------|
| 19.1 | Nicht als kleines Tool entwickeln | MVP | — | — | — | — | — | 📄 DOCUMENTED_ONLY | Architektur-Prinzip | Mittel |
| 19.2.1 | Kalender- & Ressourcenlogik | MVP | (siehe 8) | (siehe 8) | (siehe 8) | ❌ | 🔴 | 🔶 PARTIAL | Ressourcen fehlen | Hoch |
| 19.2.2 | Wallet- & Ledger-System | MVP | (siehe 12) | (siehe 12) | (siehe 12) | ❌ | 🔴 | 🔶 PARTIAL | Ledger nicht unveränderbar | 🔴 Sehr Hoch |
| 19.2.3 | Affiliate-Tracking | MVP | (siehe 11) | (siehe 11) | (siehe 11) | ❌ | 🔴 | 🔶 PARTIAL | Tracking-Qualität unklar | Hoch |
| 19.2.4 | Rollen- & Rechteverwaltung | MVP | AuthContext.js | auth_routes, security.py | users.roles/tenants | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Rollensystem vorhanden | Mittel |
| 19.2.5 | WhiteLabel-Struktur | Phase 2 | BrandingApi | branding_routes.py | branding/domains | ❌ | 🔴 | 🔶 PARTIAL | Früh mitgedacht? Ja, Domain/Branding vorhanden | Mittel |
| 19.2.6 | API-Architektur | MVP | api.js | 195 Routes | — | ❌ | 🔴 | 🔶 IMPLEMENTED_UNVERIFIED | Umfangreich | Mittel |

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
