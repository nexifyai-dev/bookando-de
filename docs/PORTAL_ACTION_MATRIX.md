# Bookando — Portal Action Matrix

> **Stand:** 06.06.2026 | **Rollen:** 7 | **Aktionen:** 120+

---

## 1. Public Visitor

| # | Aktion | Ziel | Seite/Komponente | API | DB | Status | Prio |
|---|--------|------|-----------------|-----|-----|--------|------|
| 1 | Landingpage besuchen | Produkt kennenlernen | HomePage | — | — | ✅ | P0 |
| 2 | Marketplace durchsuchen | Anbieter finden | MarketplacePage | marketplace_vendors | vendors | ✅ | P0 |
| 3 | Nach Kategorie/Standort filtern | Eingrenzen | MarketplacePage | marketplace_vendors | vendors | ✅ | P0 |
| 4 | Vendor-Profil öffnen | Details sehen | VendorDetailPage | marketplace/{id} | vendors | ✅ | P0 |
| 5 | Services ansehen | Leistungen vergleichen | VendorDetailPage | marketplace/{id}/services | services | ✅ | P0 |
| 6 | Verfügbare Slots prüfen | Termin finden | BookingWidget | POST /slots | bookings | ✅ | P0 |
| 7 | Termin buchen | Buchung abschließen | BookingWidget | POST /bookings | bookings | ✅ | P0 |
| 8 | Preise/Pläne lesen | Kosten verstehen | PricingPage | — | plans | ✅ | P0 |
| 9 | Impressum/Datenschutz lesen | Rechtssicherheit | LegalPage | — | — | ✅ | P0 |
| 10 | Kontakt aufnehmen | Fragen klären | ContactPage | — | — | ✅ | P0 |
| 11 | Sprache wechseln DE/EN | Barrierefreiheit | LanguageSwitcher | — | — | ✅ | P0 |
| 12 | Registrieren | Konto erstellen | RegisterPage | POST /auth/register | auth.users | ✅ | P0 |

## 2. Customer

| # | Aktion | Ziel | Seite | API | DB | Status | Prio |
|---|--------|------|-------|-----|-----|--------|------|
| 1 | Login | Authentifizierung | LoginPage | POST /auth/login | auth.users | ✅ | P0 |
| 2 | Passwort zurücksetzen | Zugriff wiederherstellen | ResetPasswordPage | POST /auth/reset-password | auth.users | ✅ | P0 |
| 3 | Profil anzeigen | Eigene Daten sehen | CustomerProfilePage | GET /auth/me | auth.users | ✅ | P1 |
| 4 | Profil bearbeiten | Daten aktualisieren | CustomerProfilePage | PUT /auth/profile | auth.users | ✅ | P1 |
| 5 | Buchungen anzeigen | Termine sehen | CustomerBookingsPage | GET /customer/bookings | bookings | ✅ | P1 |
| 6 | Buchungshistorie anzeigen | Vergangene Termine | CustomerBookingsPage | GET /customer/bookings | bookings | ✅ | P1 |
| 7 | Buchung stornieren | Termin absagen | CustomerBookingsPage | DELETE /customer/bookings/{id} | bookings | ✅ | P1 |
| 8 | Buchung umbuchen | Termin verschieben | CustomerBookingsPage | PATCH /customer/bookings/{id}/reschedule | bookings | ✅ | P1 |
| 9 | Zahlungsstatus prüfen | Bezahlung nachvollziehen | CustomerBookingsPage | GET /customer/bookings | bookings | ⚠️ | P1 |
| 10 | Rechnung/Beleg herunterladen | Buchhaltung | ❌ Fehlt | ❌ Fehlt | invoices | ❌ | P2 |
| 11 | Bewertung abgeben | Feedback geben | VendorDetailPage | POST /reviews | reviews | ⚠️ | P2 |
| 12 | Favoriten verwalten | Merkliste | ❌ Fehlt | POST /customer/favorites | bookings | ❌ | P2 |
| 13 | Benachrichtigungen verwalten | E-Mail-Präferenzen | ❌ Fehlt | ❌ Fehlt | notifications | ❌ | P2 |
| 14 | Account löschen | DSGVO | CustomerProfilePage | DELETE /auth/account | auth.users | ✅ | P2 |
| 15 | Support-Ticket erstellen | Hilfe bekommen | ❌ Fehlt | POST /help/tickets | tickets | ❌ | P3 |

## 3. Vendor/Inhaber

| # | Aktion | Ziel | Seite | API | DB | Status | Prio |
|---|--------|------|-------|-----|-----|--------|------|
| 1 | Dashboard öffnen | Übersicht sehen | VendorDashboardPage | GET /vendor/stats | vendors | ✅ | P0 |
| 2 | Trial-Status prüfen | Testphase im Blick | VendorDashboardPage | GET /plans/subscription | subscriptions | ⚠️ | P1 |
| 3 | Unternehmen/Vendor anlegen | Profil erstellen | Onboarding | POST /vendors/register | vendors | ✅ | P0 |
| 4 | Unternehmensprofil bearbeiten | Daten pflegen | VendorSettingsPage | PUT /vendors/{id} | vendors | ✅ | P1 |
| 5 | Marketplace-Profil bearbeiten | Sichtbarkeit steuern | VendorBrandingPage | PUT /branding/{id} | vendor_branding | ✅ | P1 |
| 6 | Logo/Branding hochladen | Marke darstellen | VendorBrandingPage | POST /uploads/vendor-logo | uploads | ✅ | P1 |
| 7 | Öffnungszeiten setzen | Verfügbarkeit definieren | VendorHoursPage | PUT /vendor/working-hours | hours | ✅ | P0 |
| 8 | Blockzeiten eintragen | Ausnahmen verwalten | VendorHoursPage | POST /hours/exceptions | calendar_blocks | ✅ | P1 |
| 9 | Standort anlegen | Filiale hinzufügen | VendorLocationsPage | POST /locations | locations | ✅ | P0 |
| 10 | Standort bearbeiten | Daten pflegen | VendorLocationsPage | PATCH /locations/{id} | locations | ⚠️ | P1 |
| 11 | Mitarbeiter anlegen | Team verwalten | VendorEmployeesPage | POST /employees | employees | ✅ | P0 |
| 12 | Mitarbeiter bearbeiten | Rollen/Rechte pflegen | VendorEmployeesPage | PATCH /employees/{id} | employees | ⚠️ | P1 |
| 13 | **Mitarbeiter-Rollen/Rechte** | Zugriff steuern | ❌ Fehlt | ❌ Fehlt | roles,permissions | ❌ | **P1** |
| 14 | Service anlegen | Leistung definieren | VendorServicesPage | POST /services | services | ✅ | P0 |
| 15 | Service bearbeiten | Daten pflegen | VendorServicesPage | PATCH /services/{id} | services | ✅ | P0 |
| 16 | Service deaktivieren | Ausblenden | VendorServicesPage | PATCH /services/{id} | services | ✅ | P1 |
| 17 | Paket/Gutschein anlegen | Angebot bündeln | ❌ Fehlt | POST /packages | packages | ❌ | P2 |
| 18 | Ressource verwalten | Raum/Gerät pflegen | ❌ Fehlt | POST /resources | resources | ❌ | P2 |
| 19 | Kalender öffnen | Tagesplan sehen | VendorCalendarPage | GET /bookings/calendar | bookings | ✅ | P1 |
| 20 | Buchungen anzeigen | Termine verwalten | VendorBookingsPage | GET /vendor/bookings | bookings | ✅ | P0 |
| 21 | **Buchung bestätigen** | Termin fixieren | VendorBookingsPage | PATCH /vendor/bookings/{id} | bookings | ⚠️ | **P1** |
| 22 | **Buchung ablehnen** | Termin absagen | VendorBookingsPage | PATCH /vendor/bookings/{id} | bookings | ❌ | **P1** |
| 23 | **Buchung als completed markieren** | Abschluss | VendorBookingsPage | PATCH /vendor/bookings/{id} | bookings | ❌ | **P1** |
| 24 | **Buchung als no-show markieren** | Nicht erschienen | ❌ Fehlt | ❌ | bookings | ❌ | P2 |
| 25 | Kunden/CRM anzeigen | Kunden verwalten | VendorCustomersPage | GET /crm/contacts | customers | ✅ | P1 |
| 26 | Kundennotiz hinzufügen | CRM pflegen | VendorCustomersPage | POST /crm/contacts | crm_notes | ⚠️ | P1 |
| 27 | **Kunden-Tag setzen** | Segmentieren | ❌ Fehlt | ❌ | crm_tags | ❌ | P2 |
| 28 | Umsatz anzeigen | Finanzen prüfen | VendorReportsPage | POST /reports/revenue | bookings | ✅ | P1 |
| 29 | Wallet anzeigen | Guthaben prüfen | VendorWalletPage | GET /wallet/balance | wallets | ✅ | P1 |
| 30 | Auszahlung beantragen | Geld erhalten | VendorWalletPage | POST /wallet/withdraw | payout_requests | ✅ | P1 |
| 31 | **Zahlungsanbieter verbinden** | Stripe-Konto anbinden | ❌ Fehlt | ❌ Fehlt | payment_providers | ❌ | P2 |
| 32 | Affiliate-Partner einladen | Vertriebspartner gewinnen | VendorAffiliatesPage | POST /affiliate/link | affiliate_links | ✅ | P1 |
| 33 | Affiliate-Provisionen einsehen | Ausgaben prüfen | VendorAffiliatesPage | GET /affiliate/commissions | commissions | ✅ | P1 |
| 34 | Bewertungen anzeigen | Feedback lesen | ❌ Fehlt | GET /reviews | reviews | ❌ | P2 |
| 35 | Reports exportieren | CSV/Auswertung | VendorReportsPage | GET /reports/export/csv | bookings | ✅ | P1 |
| 36 | Support-Ticket erstellen | Hilfe bekommen | ❌ Fehlt | POST /help/tickets | tickets | ❌ | P3 |
| 37 | Plan ändern/kündigen | Tarif anpassen | VendorDashboardPage | PUT /plans/subscription | subscriptions | ⚠️ | P1 |

## 4. Mitarbeiter (Staff)

| # | Aktion | Ziel | Seite | API | DB | Status | Prio |
|---|--------|------|-------|-----|-----|--------|------|
| 1 | Dashboard öffnen | Übersicht | ❌ Fehlt | GET /employees/{id}/stats | employees | ❌ | P3 |
| 2 | Eigene Termine sehen | Tagesplan | ❌ Fehlt | GET /bookings?employee_id= | bookings | ❌ | P3 |
| 3 | Verfügbarkeit bearbeiten | Freie Zeiten setzen | ❌ Fehlt | PATCH /employees/{id}/schedule | employees | ❌ | P3 |
| 4 | Buchungsstatus ändern | Termin bestätigen | ❌ Fehlt | PATCH /bookings/{id} | bookings | ❌ | P3 |
| 5 | Kundendetails sehen | Kunde verstehen | ❌ Fehlt | GET /crm/contacts/{id} | customers | ❌ | P3 |
| 6 | Notiz hinzufügen | Kundeninfo | ❌ Fehlt | POST /crm/contacts | crm_notes | ❌ | P3 |
| 7 | Ausloggen | Sitzung beenden | PortalShell | POST /auth/logout | auth | ❌ | P3 |

## 5. Affiliate

| # | Aktion | Ziel | Seite | API | DB | Status | Prio |
|---|--------|------|-------|-----|-----|--------|------|
| 1 | Dashboard öffnen | Performance | AffiliateDashboardPage | GET /affiliate/links + /commissions | affiliate_links, commissions | ✅ | P1 |
| 2 | Trackinglink erstellen | Bewerber-Link | AffiliateLinksPage | POST /affiliate/link | affiliate_links | ✅ | P1 |
| 3 | Links anzeigen | Übersicht | AffiliateLinksPage | GET /affiliate/links | affiliate_links | ✅ | P1 |
| 4 | Link kopieren | Teilen | AffiliateLinksPage | — | — | ✅ | P1 |
| 5 | Klicks anzeigen | Traffic messen | ❌ Fehlt | GET /affiliate/links/{code}/stats | affiliate_clicks | ❌ | **P1** |
| 6 | Conversions/Provisionen | Erfolg messen | AffiliateCommissionsPage | GET /affiliate/commissions | commissions | ✅ | P1 |
| 7 | Wallet anzeigen | Guthaben prüfen | AffiliateWalletPage | GET /wallet/balance | wallets | ✅ | P1 |
| 8 | Auszahlung beantragen | Geld erhalten | AffiliateWalletPage | POST /wallet/withdraw | payout_requests | ✅ | P1 |
| 9 | Performance-Reports | Entwicklung | ❌ Fehlt | ❌ Fehlt | affiliate_clicks, commissions | ❌ | P2 |

## 6. Plattform-Admin

| # | Aktion | Ziel | Seite | API | DB | Status | Prio |
|---|--------|------|-------|-----|-----|--------|------|
| 1 | Dashboard öffnen | Systemübersicht | AdminDashboardPage | GET /admin/stats | users,vendors,bookings | ✅ | P0 |
| 2 | Nutzer verwalten | Accounts pflegen | AdminUsersPage | GET/PUT /users | auth.users | ✅ | P0 |
| 3 | Vendoren verwalten | Anbieter prüfen | AdminVendorsPage | GET /admin/vendors | vendors | ✅ | P0 |
| 4 | **Buchungen prüfen** | Transaktionen sehen | ❌ Fehlt | GET /bookings | bookings | ❌ | P1 |
| 5 | Commission Review | Provisionen freigeben | AdminCommissionPage | GET /commissions, PATCH /commissions/{id}/approve | commissions | ✅ | P0 |
| 6 | **Payout Review** | Auszahlungen prüfen | ❌ Fehlt | GET /wallet/withdrawals | payout_requests | ❌ | **P1** |
| 7 | **Wallet-Prüfung** | Guthaben kontrollieren | ❌ Fehlt | GET /wallet/balance/ | wallets | ❌ | P1 |
| 8 | **Ledger-Korrektur** (Gegenbuchung) | Audit-freundlich | ❌ Fehlt | ❌ Fehlt | ledger_entries | ❌ | P3 |
| 9 | Pläne/Tarife verwalten | Preise pflegen | AdminPlansPage | GET /plans | plans | ✅ | P1 |
| 10 | Marketplace-Freigabe | Anbieter moderieren | ❌ Fehlt | PATCH /vendors/{id} | vendors | ❌ | **P1** |
| 11 | Reviews moderieren | Bewertungen prüfen | AdminReviewsPage | GET/POST /reviews | reviews | ✅ | P1 |
| 12 | Audit Logs einsehen | Compliance | AdminAuditPage | GET /audit/logs | audit_logs | ✅ | P1 |
| 13 | Support-Tickets bearbeiten | Kunden helfen | ❌ Fehlt | GET/POST /help/tickets | tickets | ❌ | P3 |
| 14 | Reports exportieren | Daten sichern | AdminDashboardPage | GET /reports | bookings | ⚠️ | P1 |
| 15 | Systemstatus prüfen | Gesundheit | AdminDashboardPage | GET /api/health | — | ✅ | P0 |
| 16 | **Systemlogs** | Fehleranalyse | AdminAuditPage | GET /audit/logs | audit_logs | ⚠️ | P2 |

## 7. WhiteLabel/Agency/Franchise

| # | Aktion | Ziel | Seite | API | DB | Status | Prio |
|---|--------|------|-------|-----|-----|--------|------|
| 1 | Dashboard öffnen | Partner-Übersicht | FranchiserDashboardPage | GET /franchises/{id} | franchises | ⚠️ | P3 |
| 2 | Eigene Vendoren verwalten | Anbieter steuern | FranchiserVendorsPage | GET /franchises/{id}/vendors | vendors | ⚠️ | P3 |
| 3 | Branding konfigurieren | Eigene Marke | ❌ Fehlt | PUT /branding/{id} | branding | ❌ | P3 |
| 4 | Domain verwalten | Eigene URL | ❌ Fehlt | ❌ | domain_mappings | ❌ | P3 |
| 5 | Provisionen einsehen | Vergütung | ❌ Fehlt | GET /commissions | commissions | ❌ | P3 |
| 6 | Reports öffnen | Auswertung | ❌ Fehlt | GET /reports | bookings | ❌ | P3 |

---

## Summary

| Rolle | Aktionen | Vorhanden | Teilweise | Fehlt | Erfüllung |
|-------|----------|-----------|-----------|-------|-----------|
| Public Visitor | 12 | 12 | 0 | 0 | **100%** |
| Customer | 15 | 10 | 2 | 3 | **67%** |
| Vendor/Inhaber | 37 | 20 | 10 | 7 | **54%** |
| Mitarbeiter | 7 | 0 | 0 | 7 | **0%** |
| Affiliate | 9 | 6 | 0 | 3 | **67%** |
| Plattform-Admin | 16 | 8 | 3 | 5 | **50%** |
| WhiteLabel/Agency | 6 | 2 | 0 | 4 | **33%** |
| **Gesamt** | **102** | **58** | **15** | **29** | **57%** |

### Kritische fehlende Aktionen (P1-Blocker)

| Aktion | Rolle | Grund |
|--------|-------|-------|
| Buchung bestätigen/ablehnen/completed | Vendor | Kernbooking-Flow |
| Klicks anzeigen | Affiliate | Ohne kein Tracking |
| Payout Review | Admin | Ohne keine Auszahlungssteuerung |
| Marketplace-Freigabe | Admin | Ohne keine Qualitätskontrolle |
| Mitarbeiter-Rollen/Rechte | Vendor | Ohne kein Team-Management |
