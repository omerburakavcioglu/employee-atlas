# Sprint 1 — Daily Scrum Notları

> **Not:** Bu dosya, Sprint 1 boyunca tutulan günlük toplantı kayıtlarının birebir transkripti değildir.  
> Orijinal günlük notlar ayrı bir kanalda tutulmamıştır; aşağıdaki tablo **Sprint sonunda derlenmiş özet Daily Scrum notları**dır.

**Sprint:** 1 (19 Haziran – 5 Temmuz 2026)  
**Ekip:** Grup 43 — Employee Atlas

| Tarih / Dönem | Dün ne yapıldı? | Bugün ne yapılacak? | Blocker | Not |
| --- | --- | --- | --- | --- |
| 19–20 Haziran | Ürün fikri ve kapsam netleştirildi; bootcamp gereksinimleri incelendi | Repo oluşturma, klasör yapısı taslağı, README taslağı | — | MVP kapsamı: çok-kiracılı çalışan atlası; AI Sprint 2'ye ertelendi |
| 21–23 Haziran | Next.js projesi kuruldu, Tailwind/shadcn yapılandırıldı, README ilk sürümü yazıldı | Veri modeli tasarımı: tenant, employee, location, department tabloları | — | A1 ilerliyor; Product Backlog Miro'da oluşturuldu |
| 24–26 Haziran | Supabase migration'ları yazıldı; tenant ve çalışan şeması oluşturuldu | RLS politikalarının taslağı, composite FK'ler | — | A2 devam; yetenek, sertifika, eğitim tabloları eklendi |
| 27–28 Haziran | Auth akışı: Supabase Auth e-posta/şifre girişi | Profil oluşturma trigger'ı, oturum yönetimi | — | A3 başladı; demo hesapları planlandı |
| 29 Haziran – 1 Temmuz | Rol bazlı erişim: Tenant Admin, HR, Manager, Technical Coordinator | Super Admin geliştirme modu, tenant context çözümlemesi | RLS politikalarının test edilmesi zaman alıyor | A4 yoğun çalışma; defense-in-depth yaklaşımı benimsendi |
| 2–3 Temmuz | Seed verisi: TAV (50) ve Turkcell (80) çalışan, lokasyon, departman | Çalışan dizin sayfası: kart ve liste görünümü | — | B1 tamamlandı; C1 başladı |
| 4 Temmuz | Dizin sayfası filtreleri ve temel anahtar kelime araması | Harita dashboard, analytics sayfası son kontroller | — | C1 ve C3 tamamlandı; tenant temaları (TAV/Turkcell) uygulandı |
| 5 Temmuz | Vercel'e deploy, canlı demo doğrulaması | Sprint Review hazırlığı, dokümantasyon | Eksik sprint dokümanları (review, retro, daily) | Sprint 1 kapanışı; tüm 7 görev tamamlandı (21/21 SP) |

## Sprint genel ilerleme özeti

Sprint boyunca çalışma sırası kabaca şu akışı izledi:

1. Ürün fikri ve kapsam netleştirme
2. Proje kurulumu (repo, stack, README)
3. Veri modeli ve migration'lar
4. Kimlik doğrulama ve rol bazlı erişim
5. Kiracı izolasyonu (RLS + uygulama katmanı)
6. Seed verisi (100+ çalışan, çok lokasyon)
7. UI ekranları (harita, dizin, analytics)
8. Canlıya alma (Vercel deploy)
9. Dokümantasyon (Sprint 1 sonrası tamamlanıyor)
