# Bookando — API P0-Backend-Review

> **Stand:** 06.06.2026, 10:33 UTC
> **Backend-Repo:** `nexifyai-dev/bookando-api.git` → `/root/bookando-backend` (main)
> **Letzter Commit:** `e3edc8c` (Password-Reset + Branding)
> **Live-API:** https://bookando-backend.vercel.app
> **Frontend-Repo:** `nexifyai-dev/bookando-de.git` → Commit `0b8f406`
> **Live-Frontend:** https://app.bookando.de
> **Dokumentation:** README.md (575 Zeilen), docs/ (4 Dateien)

---

## 1. Endpunkt-Matrix (Frontend ↔ Backend)

| Bereich | Endpoint | Backend | Frontend | Status |
|---------|----------|---------|----------|--------|
| Marketplace | `GET /api/public/marketplace/vendors` | ✅ 3 Vendors | MarketplacePage | ✅ |
| Vendor Detail | `GET /api/marketplace/{id}` | ✅ 14 Felder | VendorDetailApi | ✅ |
| Vendor Services | `GET /api/marketplace/{id}/services` | ✅ 2 Services | VendorDetailApi | ⚠️ duration_minutes fehlt |
| Vendor Reviews | `GET /api/marketplace/{id}/reviews` | ✅ Vorhanden | VendorDetailApi | ⏳ P1 |
| Slots | `POST /api/bookings/slots` | ✅ SlotsRequest | BookingSlotsApi | ✅ |
| Booking | `POST /api/bookings` | ✅ 100% Payload-Match | CustomerBookingsApi | ✅ |
| Health | `GET /api/health` | ✅ "healthy" | - | ✅ |
| Affiliate | `POST /api/affiliate/link` | ✅ Vorhanden | - | ⏳ P1 |
| Wallet | `GET /api/wallet/balance` | ✅ Vorhanden | VendorWalletPage | ✅ |
| Checkout | `POST /api/checkout/create-session` | ✅ Vorhanden | - | ⏳ In BookingWidget |

---

## 2. Payload-Vergleich Booking Create

### Frontend sendet (VendorDetailPage.js):
```javascript
{
  vendor_id, service_id, service_name,
  start_at, end_at,
  customer_name, customer_email, customer_phone,
  notes, price
}
```

### Backend erwartet (BookingCreate):
```python
{
  vendor_id: str             # ✅
  service_id: str            # ✅
  service_name: str          # ✅
  employee_id: Optional[str] # 🔶 optional, Frontend sendet nicht (OK)
  start_at: str              # ✅
  end_at: str                # ✅
  customer_name: Optional[str]  # ✅
  customer_email: Optional[str] # ✅
  customer_phone: Optional[str] # ✅
  notes: Optional[str]       # ✅
  price: float               # ✅
  currency: str = "EUR"      # ✅ Default
  voucher_code: Optional[str] # ⏳ optional
  affiliate_code: Optional[str] # ⏳ optional (P1)
}
```

**Fazit:** ✅ **100% kompatibel. Kein Mismatch.**

---

## 3. Booking-Core-Architektur-Prüfung

### 3.1 Kriterium: Booking = Termin, nicht Produktkauf
| Kriterium | Status | Befund |
|-----------|--------|--------|
| Datum + Uhrzeit | ✅ | `start_at`/`end_at` ISO DateTime |
| Dauer | ✅ | Aus `start_at`-`end_at` berechenbar |
| Mitarbeiter | ⚠️ | Optional (`employee_id`) |
| Standort | ❌ | Kein `location_id` im BookingCreate |
| Ressourcen | ❌ | Fehlt (Phase 2) |
| Pufferzeiten | ❌ | Fehlt (Phase 2) |
| Kollisionsprüfung | ✅ | `WHERE status IN (pending,confirmed)` in list_bookings |
| Gruppenbuchung | ❌ | Fehlt (Phase 2) |

### 3.2 Statusmodell
| Status | Vorhanden | Verwendung |
|--------|-----------|------------|
| `pending` | ✅ | Default bei Create |
| `confirmed` | ✅ | Manuelle Bestätigung |
| `completed` | ✅ | Abschluss |
| `cancelled` | ✅ | Stornierung |
| `rescheduled` | ❌ | Fehlt (P2) |
| `no_show` | ❌ | Fehlt (P3/KI) |
| `refunded` | ❌ | Fehlt (P2) |

### 3.3 Affiliate-Attribution
| Kriterium | Status |
|-----------|--------|
| `affiliate_code` im BookingCreate | ✅ Vorhanden |
| Commission-Engine bei BookingCreate | ❌ **Fehlt (P0-C)** |
| Tracking-Click-Erfassung | ❌ **Fehlt (P0-C)** |
| Attribution-Logik | ❌ **Fehlt (P0-C)** |

### 3.4 Payment-Integration
| Kriterium | Status |
|-----------|--------|
| Provider-Abstraktion | ❌ Stripe hard-coded |
| Checkout-Session | ✅ Vorhanden |
| Webhook-Verarbeitung | ✅ Stripe-Webhook |
| Split-Payment | ❌ Fehlt (P2) |
| Booking ohne Payment | ✅ BookingCreate erfordert kein Payment |

**Kritisch:** BookingWidget erstellt aktuell die Buchung OHNE Payment (`CustomerBookingsApi.create`). Der Checkout-Flow muss später ergänzt werden.

### 3.5 Wallet/Ledger
| Kriterium | Status |
|-----------|--------|
| Wallet pro User | ✅ Vorhanden |
| Ledger-Einträge | ✅ Vorhanden |
| Append-Only | ❌ **Nicht garantiert (P0-C)** |
| Commission bei Affiliate-Booking | ❌ **Fehlt (P0-C)** |
| Payout-Request | ✅ Vorhanden |
| Admin-Korrektur | ❌ Fehlt |

---

## 4. Gefundene Lücken (Priorisiert)

| # | Lücke | Bereich | Prio | Frontend-Blocker? |
|---|-------|---------|------|-------------------|
| 1 | `duration_minutes` fehlt in Marketplace-Service-Response | Services | P0 🟠 | ❌ Frontend zeigt nur Preis, Dauer nicht kritisch |
| 2 | BookingCreate hat keinen `location_id`-Parameter | Booking | P1 🟡 | ❌ MVP ohne Standort-Auswahl |
| 3 | Kein rescheduled/no_show/refunded Status | Booking | P2 🟢 | ❌ Kein MVP-Blocker |
| 4 | Commission-Engine fehlt (bei Affiliate-Booking) | Affiliate | P0-C 🔴 | ❌ P0-C (separates Backend-Paket) |
| 5 | Ledger nicht garantiert Append-Only | Wallet | P0-C 🔴 | ❌ P0-C |
| 6 | Kein Click-Tracking für Affiliate | Affiliate | P1 🟠 | ❌ Affiliate-Dashboard P1 |
| 7 | Stripe hard-coded (keine Payment-Abstraktion) | Payment | P2 🟢 | ❌ Vorerst ausreichend |

---

## 5. Minimalinvasive Quick-Fixes

### Fix 1: `duration_minutes` in Marketplace-Service-Response ergänzen
**Datei:** `/root/bookando-backend/api/marketplace_routes.py`
**Änderung:** Service-Response um `duration_minutes` erweitern
**Risiko:** Minimal — nur Response-Feld hinzufügen

### Fix 2: Standort-ID in BookingCreate ergänzen (P1)
**Nicht jetzt umsetzen** — kein MVP-Blocker.

### Fix 3: Payment-Flow für Booking vorbereiten (Dokumentation)
BookingWidget erstellt aktuell die Buchung ohne Payment.
Für MVP muss geklärt werden:
- Soll die Buchung sofort bezahlt werden (Stripe Checkout)?
- Oder reicht erstelle-Buchung → später bezahlen?

**Empfehlung:** MVP: BookingCreate ohne Payment → Status `pending` → später Checkout-Integration.

---

## 6. Smoke-Test-Ergebnisse

### 6.1 API-Smoke-Tests (gegen Live-Backend)

| Test | Befehl | Ergebnis |
|------|--------|----------|
| Marketplace Vendors | `GET /api/public/marketplace/vendors` | ✅ 3 Vendors |
| Vendor Detail | `GET /api/marketplace/{id}` | ✅ 14 Felder |
| Vendor Services | `GET /api/marketplace/{id}/services` | ✅ 2 Services |
| Health | `GET /api/health` | ✅ "healthy" |
| API Base URL | Frontend Production | ✅ `https://bookando-backend.vercel.app` |

### 6.2 Frontend-Smoke-Tests (gegen Live-Frontend)

| Test | URL | Ergebnis |
|------|-----|----------|
| Landingpage | `app.bookando.de/` | ✅ HTTP 200 |
| Marketplace | `app.bookando.de/marketplace` | ✅ HTTP 200 |
| Legal/Privacy | `app.bookando.de/legal/privacy` | ✅ HTTP 200 |
| Vendor Detail | `app.bookando.de/marketplace/{id}` | ✅ HTTP 200 (Route existiert) |
| hero-grafik.png | `app.bookando.de/images/hero-grafik.png` | ✅ 1,36 MB |
| cta-grafik.png | `app.bookando.de/images/cta-grafik.png` | ✅ 1,16 MB |
| brand-logo-horizontal.png | `app.bookando.de/images/brand-logo-horizontal.png` | ✅ 30,8 KB |

---

## 7. Offene Risiken

| Risiko | Betroffen | Wahrscheinlichkeit | Impact |
|--------|-----------|-------------------|--------|
| `bookando.de` DNS nicht konfiguriert | Production-Domain | Hoch | Hoch — aktuell nur `app.bookando.de` nutzbar |
| Wallet/Ledger nicht Append-Only | Finanzdaten | Mittel | **Kritisch** — P0-C zwingend |
| Keine Commission-Engine | Affiliate | Mittel | **Kritisch** für Affiliate-Paket |
| Booking ohne Payment | Umsatz | Mittel | Klärung nötig: Booking + Payment-Flow |
| `duration_minutes` fehlt | Service-Display | Niedrig | Kosmetisch, Frontend zeigt Dauer nicht |

---

## 8. Empfehlungen

### P0-B (jetzt abschließbar)
- ✅ Alle Frontend-Endpunkte existieren und sind kompatibel
- ✅ BookingCreate-Payload passt 100%
- ⚠️ `duration_minutes` in Marketplace-Service-Response ergänzen (minimaler Fix)

### P0-C (nächster Schritt)
- Commission-Engine bei Affiliate-Booking
- Ledger Append-Only garantieren
- Click-Tracking für Affiliate-Links

### P1
- Standort-ID in BookingCreate
- Affiliate-Dashboard
- Checkout-Integration in BookingWidget
- rescheduled/no_show/refunded Status

### P2
- Payment-Abstraktion (PayPal, Mollie, Klarna)
- Ressourcenverwaltung
- Gruppenbuchungen
- Split-Payment
