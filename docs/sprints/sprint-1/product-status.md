# Sprint 1 — Ürün Durumu

**Ürün:** Employee Atlas  
**Canlı demo:** https://employee-atlas.vercel.app/  
**Sprint:** 1 (19 Haziran – 5 Temmuz 2026)  
**Durum:** MVP çekirdeği tamamlandı ve canlıya alındı

## Demo hesapları

Geliştirme ortamı şifresi (tüm hesaplar): `AtlasDemo2026!`

| E-posta | Kiracı | Rol |
| --- | --- | --- |
| tav.admin@demo.com | TAV Airports | Tenant Admin |
| tav.hr@demo.com | TAV Airports | HR |
| tav.manager@demo.com | TAV Airports | Manager |
| turkcell.admin@demo.com | Turkcell | Tenant Admin |
| turkcell.hr@demo.com | Turkcell | HR |
| turkcell.manager@demo.com | Turkcell | Manager |
| superadmin@demo.com | — (platform) | Super Admin (yalnızca geliştirme) |

## Ekran görüntüleri

Aşağıdaki görüntüler `docs/sprints/sprint-1/` klasöründe saklanmaktadır.

### urun_durumu_1.png — Giriş ekranı

Paylaşılan, kiracıdan bağımsız login sayfası. Tüm demo kullanıcıları aynı giriş noktasından oturum açar; kimlik doğrulama sonrası kullanıcı yalnızca kendi kiracısının çalışma alanına yönlendirilir.

### urun_durumu_2.png — TAV Dizin (Directory)

TAV Airports kiracısında çalışan dizin sayfası. Tam metin arama, filtreler (lokasyon, departman, yetenek vb.) ve kart/liste görünümü. Filtre seçenekleri kiracıya özeldir — TAV kullanıcısı Turkcell verisini görmez.

### urun_durumu_3.png — Grup 43 Sprint Board

Bootcamp ekibinin (Grup 43) uygulama içi sprint panosu. Sprint 1 görevleri, story point'ler, ilerleme yüzdesi (%100) ve tamamlanan 21 SP görüntülenir. Kiracı izolasyonu çalışır: yalnızca Grup 43 panelinde erişilebilir.

### urun_durumu_4.png — TAV Analytics

TAV Airports kiracısında iş gücü analitiği sayfası. Çalışan dağılımları, KPI'lar ve kiracı temasına uyumlu grafik paleti.

### urun_durumu_5.png — TAV Harita (Map Dashboard)

TAV Airports kiracısında harita öncelikli dashboard. Lokasyon pinleri, çalışan sayıları ve pin tıklamasıyla açılan çalışan kartları paneli. Harita renkleri TAV kurumsal paletine uyumludur.

## Tamamlanan ürün özellikleri (Sprint 1)

- Çok-kiracılı mimari (TAV Airports + Turkcell)
- Supabase Auth ile e-posta/şifre girişi
- Rol bazlı yetkilendirme (Tenant Admin, HR, Manager, Technical Coordinator, Super Admin)
- Kiracı izolasyonu (RLS + uygulama katmanı)
- 130+ seed çalışan (TAV: 50, Turkcell: 80), çok lokasyonlu
- Harita dashboard (varsayılan ekran)
- Çalışan dizini: arama, filtreler, kart/liste/tablo görünümü
- Çalışan profili sayfaları (kiracı kapsamlı)
- Shortlist oluşturma ve CSV dışa aktarma
- Analytics sayfası
- Admin/HR paneli (çalışan, lokasyon, departman CRUD; CSV import)
- Kiracı temaları (TAV navy/sky/amber, Turkcell mavi/sarı)
- Grup 43 bootcamp sprint paneli (`/sprints`)
- Canlı deploy (Vercel)

## Kiracı durumları

### TAV Airports

- **Durum:** Tam seed verisi ve tema ile demo hazır
- **Lokasyon:** 10 (İstanbul HQ + havalimanları)
- **Çalışan:** 50
- **Ekran kanıtı:** Harita, dizin, analytics ekran görüntüleri mevcut

### Turkcell

- **Durum:** Tam seed verisi ve tema ile demo hazır (canlı ortamda test edilebilir)
- **Lokasyon:** 14 (Küçükyalı HQ, Gebze veri merkezi + bölgesel ofisler)
- **Çalışan:** 80
- **Ekran kanıtı:** Henüz ekran görüntüsü eklenmedi (aşağıdaki TODO)

### Grup 43 Sprint Paneli

- **Durum:** Sprint 1 board uygulama içinde çalışıyor
- **Ekran kanıtı:** `urun_durumu_3.png`

## Eklenecek ekran görüntüleri

Aşağıdaki ekranlar Sprint 1 kapsamında uygulamada mevcuttur ancak henüz `docs/sprints/sprint-1/` altına görsel kanıt eklenmemiştir:

- [ ] **Turkcell kiracısı** — dizin veya harita ekranı (`turkcell.admin@demo.com` ile)
- [ ] **Çalışan profili** — detay sayfası (yetenekler, sertifikalar, eğitim bölümleri)
- [ ] **Shortlist** — kısa liste oluşturma ve üye ekleme ekranı
- [ ] **Admin/HR paneli** — çalışan/lokasyon/departman yönetimi veya CSV import ekranı

Bu görüntüler Sprint 2 dokümantasyon görevi (D5) kapsamında da planlanmıştır.
