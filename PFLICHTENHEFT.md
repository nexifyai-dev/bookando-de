# 📘 Bookando.de – Pflichtenheft / Product Requirements Document

> **Projekt**: Bookando.de – Modulare SaaS-, Marketplace- & WhiteLabel-Plattform für Dienstleister
> **Stand**: 05.06.2026
> **Repository**: `nexifyai-dev/affilinet-portal-aachen` → **umbenennen in `bookando-de`**

---

## 1. Einleitung

### 1.1 Projektname
**Bookando.de**

### 1.2 Projektbeschreibung
Bookando.de ist eine modulare **SaaS-, Marketplace- und WhiteLabel-Plattform für Dienstleister**.  
Die Plattform kombiniert:
- Professionelle Terminbuchung
- Kalenderverwaltung
- Dienstleisterverwaltung
- Marketplace-Funktionen
- Affiliate-Marketing
- Automatisierte Provisionslogik
- Wallet-Systeme
- Zahlungsabwicklung
- CRM
- Marketing-Automationen
- KI-Funktionen
- WhiteLabel- und Franchise-Strukturen

> **Bookando ist KEIN einfaches Terminbuchungstool, sondern ein vollständiges Betriebs-, Vertriebs- und Marketing-Ökosystem für Dienstleister.**

---

## 2. Grundidee der Plattform

### 2.1 Was Bookando lösen soll
Klassische Terminbuchungssysteme (Calendly, Shore, Fresha, Treatwell, Booksy, SimplyBook, Trafft) lösen hauptsächlich die reine Terminverwaltung.  
Bookando soll **deutlich weitergehen**:
- Kundengewinnung
- Affiliate-Marketing
- Umsatzzuordnung
- Partnerstrukturen
- Wallet-Auszahlungen
- Marketplace-Logik
- CRM
- Marketingautomationen
- WhiteLabel-Modelle

### 2.2 Hauptproblem im Markt
Viele Dienstleister arbeiten mit Social-Media-Marketer, Influencern, Agenturen, Werbepartnern oder Affiliates zusammen.  
**Aktuell fehlen:**
- Transparente Trackingstrukturen
- Automatische Provisionsabrechnungen
- Nachvollziehbare Umsatzzuordnungen
- Direkte Auszahlungen
- Kontrollierte Partnerstrukturen

---

## 3. Vision

Bookando soll langfristig verbinden:
- **Dienstleister**
- **Affiliates**
- **Kunden**
- **Agenturen**
- **Franchisegeber**
- **WhiteLabel-Partner**

→ **Eine skalierbare Infrastrukturplattform für Dienstleister**

---

## 4. Orientierung an Trafft

| Bereich | Trafft (Referenz) | Bookando (Erweiterung) |
|---------|------------------|----------------------|
| Terminbuchung | ✅ Voll | ✅ Voll |
| Kalender | ✅ Voll | ✅ Voll |
| Vendor-Verwaltung | ✅ Voll | ✅ Voll |
| Affiliate-Marketing | ❌ Kein System | ✅ **Kern-USP** |
| Wallet/Ledger | ❌ | ✅ **Eigenentwicklung** |
| Marketplace | ❌ | ✅ **Öffentliches Verzeichnis** |
| WhiteLabel | ✅ Basis | ✅ **Vollständig** |
| KI-Funktionen | ❌ | ✅ **Geplant** |

---

## 5. Zielgruppen

### 5.1 Primär (Start)
**Beauty- & Ästhetikbranche:**
- Tattoo-Studios
- Kosmetikstudios
- Friseure / Barbershops
- Beauty-Salons
- Laser-Studios
- Ästhetik-Dienstleister

### 5.2 Erweiterbar
- Coaches & Berater
- Healthcare
- Fitness
- Education
- Home Services
- Automotive Services

---

## 6. Plattformstruktur

```
Bookando.de
├── Terminbuchungssystem
├── Vendor-System
├── Marketplace-System
├── Affiliate-Booking-System (★ KERN-USP)
├── Wallet- & Ledger-System
├── WhiteLabel-System
├── CRM-System
├── KI-Strategie
├── Mobile- & App-Strategie
└── Geschäftsmodell (SaaS)
```

---

## 7. Geschäftsmodell

### 7.1 Pakete

| Paket | Preis | Features |
|-------|-------|----------|
| **Standard** | **49 €/Monat** | Booking, Kalender, Mitarbeiter, Kunden, Marketplace, CRM |
| **Affiliate-Booking** | **189 €/Monat** | Alles aus Standard + Affiliate-Tracking, Wallet, Provisionen, Kampagnen |

### 7.2 Gebühren

| Szenario | Gebühr |
|----------|--------|
| **Eigener Zahlungsanbieter** | 2,5 % Auszahlungsgebühr |
| **Plattform-Zahlung** | 5 % + 1 € pro Transaktion |

---

## 8. Technische Architekturziele

- **Modular** & skalierbar
- **API-First**
- **Multi-Tenant**
- **WhiteLabel-fähig**
- **Internationalisierbar** (DE/EN, später mehr)
- **Payment-unabhängig** (Stripe, PayPal, Mollie, Klarna)

### Kritische Systeme
1. ⚡ Kalender- & Ressourcenlogik – extrem stabil & skalierbar
2. 💰 Wallet- & Ledger-System – unveränderbar, auditierbar
3. 🔗 Affiliate-Tracking – manipulationssicher
4. 🔐 Rollen- & Rechteverwaltung – granular
5. 🏢 WhiteLabel-Struktur – früh mitdenken
6. 🔌 API-Architektur – appfähig & integrationsfähig

---

## 9. MVP-Strategie

| Phase | Inhalt |
|-------|--------|
| **MVP (jetzt)** | Terminbuchung, Vendor, Kalender, Zahlungen, Marketplace, Affiliate-Tracking, Wallet, CRM-Basis |
| **Phase 2** | WhiteLabel, Franchise, CRM-Automationen, Ressourcen, Kampagnen |
| **Phase 3** | KI-Funktionen, Native Apps, Globaler Marketplace, API-Ökosystem |

---

## 10. Domain & Branding

| Bereich | Wert |
|---------|------|
| **Hauptdomain** | `bookando.de` |
| **App-Domain** | `app.bookando.de` |
| **Marke** | Bookando |
| **Claim** | Deine Buchungs- & Vertriebsplattform |

---

## 11. Nächste konkrete Schritte

1. ✅ Frontend-Landingpage basierend auf Design-Template (erledigt)
2. ✅ Auth-System (Login/Register) (erledigt)
3. ✅ Build & Deployment via Emergent Base (Domain-Umleitung steht aus)
4. ⬜ Umbenennung: Repo → `bookando-de`, alle Texte/Titel auf "Bookando" aktualisieren
5. ⬜ Backend-Verknüpfung mit dem existierenden FastAPI-Backend
6. ⬜ Marketplace-Seite fertigstellen
7. ⬜ Dashboard mit echten API-Daten verbinden
