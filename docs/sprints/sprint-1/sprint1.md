# Sprint 1 — Employee Atlas (Grup 43)

**Tarih:** 19 Haziran 2026 – 5 Temmuz 2026  
**Durum:** Tamamlandı  
**Canlı demo:** https://employee-atlas.vercel.app/

## Sprint hedefi

Temel kurulum, veri modeli, kimlik doğrulama ve çalışan listeleme.

## Story point özeti

| Metrik | Değer |
| --- | --- |
| Planlanan SP | 21 |
| Tamamlanan SP | 21 |
| Velocity | 21 SP |
| Tamamlanma oranı | %100 |

## Sprint backlog

| Kod | Görev | SP | Durum | Öncelik | Kategori | Sorumlu |
| --- | --- | ---: | --- | --- | --- | --- |
| A1 | Repo, klasör yapısı, README, backlog board kurulumu | 2 | Tamamlandı | Orta | Dokümantasyon / Kurulum | Buşra Eşkara |
| A2 | Veri modeli: tenant, çalışan, lokasyon, departman, unvan, yetenek, eğitim, sertifika, deneyim ve rol yapısı | 3 | Tamamlandı | Yüksek | Backend | Ömer Burak Avcıoğlu |
| A3 | Kayıt/giriş sistemi: Supabase Auth ile e-posta/şifre girişi | 3 | Tamamlandı | Yüksek | Kimlik Doğrulama | Hümeyra Maden |
| A4 | Rol bazlı yetkilendirme: Tenant Admin, HR, Manager, Technical Coordinator ve Super Admin erişim yapısı | 5 | Tamamlandı | Yüksek | Güvenlik | Ömer Burak Avcıoğlu |
| B1 | 100+ sahte çok-lokasyonlu çalışan seed verisi | 3 | Tamamlandı | Orta | Veri | Emine Soyuçok |
| C1 | Çalışan liste/kart görünümü | 3 | Tamamlandı | Orta | Frontend | Ahmet Berke Çiftçi |
| C3 | Temel anahtar kelime araması | 2 | Tamamlandı | Düşük | Arama | Ahmet Berke Çiftçi |

## Backlog dağıtma mantığı

Sprint 1, ürünün **MVP çekirdeğini** oluşturmak için planlandı. Görev seçimi şu ilkelere dayandı:

1. **Önce altyapı, sonra arayüz.** Veri modeli (A2) ve kimlik doğrulama (A3–A4) tamamlanmadan kullanıcıya görünen özellikler anlamlı olmazdı. Bu nedenle A2–A4 yüksek öncelikli tutuldu.
2. **Çok-kiracılı mimari zorunluluğu.** Employee Atlas'ın temel değer önerisi, aynı platformda birden fazla şirketin (TAV, Turkcell) izole çalışmasıdır. Tenant modeli ve RLS tabanlı yetkilendirme Sprint 1 kapsamına alındı.
3. **Demo edilebilir veri.** Seed verisi (B1) olmadan harita, dizin ve filtreler test edilemezdi. TAV (50 çalışan) ve Turkcell (80 çalışan) kiracıları için gerçekçi çok-lokasyonlu veri üretildi.
4. **Kullanıcıya görünür değer.** C1 ve C3, sprint sonunda paydaşlara gösterilebilecek somut ekranlar sağladı: çalışan dizini ve temel arama.
5. **AI özellikleri bilinçli olarak ertelendi.** Semantik arama, doğal dil filtreleme ve AI ajanları Sprint 2/3'e taşındı; MVP önce güvenilir temel işlevselliğe odaklandı.

### Story point tahmin yöntemi

Tahminler ekip içi göreceli büyüklük (planning poker benzeri) ile yapıldı:

- **2 SP:** Tek kişinin birkaç saatte tamamlayabileceği, net kapsamlı görevler (A1, C3).
- **3 SP:** Orta karmaşıklıkta, birkaç bileşeni kapsayan görevler (A2, A3, B1, C1).
- **5 SP:** Birden fazla katmanı (veritabanı, uygulama, politika) etkileyen karmaşık görevler (A4).

Toplam 21 SP, iki haftalık sprint süresine uygun bir kapasite olarak değerlendirildi ve tamamı tamamlandı.

## İlgili dokümanlar

| Doküman | Açıklama |
| --- | --- |
| [Sprint Board](sprint-board.md) | Görev panosu ve özet metrikler |
| [Daily Scrum](daily-scrum.md) | Sprint sonunda derlenmiş özet daily notları |
| [Ürün Durumu](product-status.md) | Ekran görüntüleri ve tamamlanan özellikler |
| [Sprint Review](sprint-review.md) | Sprint sonu demo ve artış özeti |
| [Sprint Retrospective](sprint-retrospective.md) | Ekip değerlendirmesi ve aksiyonlar |
