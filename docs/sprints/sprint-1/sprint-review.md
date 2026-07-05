# Sprint 1 — Sprint Review

**Tarih:** 5 Temmuz 2026  
**Sprint:** 1 (19 Haziran – 5 Temmuz 2026)  
**Ürün:** Employee Atlas  
**Canlı demo:** https://employee-atlas.vercel.app/

## Tamamlanan hikayeler

| Kod | Görev | SP |
| --- | --- | ---: |
| A1 | Repo, klasör yapısı, README, backlog board kurulumu | 2 |
| A2 | Veri modeli: tenant, çalışan, lokasyon, departman, unvan, yetenek, eğitim, sertifika, deneyim ve rol yapısı | 3 |
| A3 | Kayıt/giriş sistemi: Supabase Auth ile e-posta/şifre girişi | 3 |
| A4 | Rol bazlı yetkilendirme: Tenant Admin, HR, Manager, Technical Coordinator ve Super Admin erişim yapısı | 5 |
| B1 | 100+ sahte çok-lokasyonlu çalışan seed verisi | 3 |
| C1 | Çalışan liste/kart görünümü | 3 |
| C3 | Temel anahtar kelime araması | 2 |

**Toplam tamamlanan SP:** 21 / 21 (%100)

## Tamamlanmayan hikayeler

Sprint 1 kapsamında planlanan tüm hikayeler tamamlandı. Tamamlanmayan görev yoktur.

## Demo akışı

Sprint Review'da aşağıdaki akış canlı ortamda gösterildi:

1. **Giriş** — Paylaşılan login sayfasından `tav.admin@demo.com` ile oturum açma
2. **Harita dashboard** — TAV lokasyon pinleri, çalışan sayıları, pin tıklamasıyla panel
3. **Dizin** — Tam metin arama, filtreler, kart/liste görünümü
4. **Analytics** — İş gücü KPI'ları ve dağılım grafikleri
5. **Kiracı izolasyonu** — Oturumu kapatıp `turkcell.admin@demo.com` ile giriş; farklı tema ve veri seti
6. **Grup 43 sprint paneli** — Bootcamp sprint board (`/sprints/sprint-1`)

## Gösterilen artışlar

### Ürün artışları

- Çok-kiracılı B2B SaaS platformunun MVP çekirdeği kullanılabilir durumda
- TAV ve Turkcell demo kiracıları gerçekçi veriyle çalışıyor
- Harita, dizin, profil, shortlist, analytics ve admin paneli erişilebilir
- Kiracı temaları (logo renkleri, grafik paleti) uygulanmış

### Teknik artışlar

- Supabase Postgres şeması: tenant, employee, location, department, skill, certification vb.
- Row Level Security (RLS) ile kiracı izolasyonu
- Composite foreign key'ler ile çapraz-kiracı referans engeli
- Supabase Auth entegrasyonu
- Rol bazlı erişim kontrolü (5 rol)
- Next.js App Router, TypeScript, Tailwind CSS v4, shadcn/ui
- Vercel'e canlı deploy

## Riskler ve sonraki adımlar

| Risk / Konu | Durum | Sonraki adım |
| --- | --- | --- |
| Sprint dokümantasyonu eksikti | Sprint 1 sonrası tamamlanıyor | Sprint 2'de D5 görevi ile sürdürülecek |
| Eksik ekran görüntüleri (Turkcell, profil, shortlist, admin) | TODO | Sprint 2'de görsel kanıtlar eklenecek |
| AI özellikleri henüz yok | Bilinçli erteleme | Sprint 2/3 kapsamında (D1–D6, E1–E7) |
| Git katkı kanıtı tek yazarda | Süreç riski | Ekip gelecek sprintlerde dağıtık commit/PR hedeflemeli |
| Employee self-service | MVP dışı | Backlog'da (F1) |

## Paydaş geri bildirimi

Paydaş geri bildirimi Sprint 1 için ayrıca kaydedilmemiştir.
