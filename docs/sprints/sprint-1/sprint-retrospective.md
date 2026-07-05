# Sprint 1 — Sprint Retrospective

**Tarih:** 5 Temmuz 2026  
**Sprint:** 1 (19 Haziran – 5 Temmuz 2026)  
**Ekip:** Grup 43 — Employee Atlas

## İyi gidenler

- **Çok-kiracılı mimari tamamlandı.** TAV ve Turkcell kiracıları izole çalışıyor; RLS, composite FK'ler ve uygulama katmanı birlikte savunma derinliği sağlıyor.
- **Canlı deploy başarılı.** https://employee-atlas.vercel.app/ üzerinden demo erişilebilir durumda.
- **Tüm sprint hedefleri karşılandı.** 7 görev, 21 SP — %100 tamamlanma.
- **Gerçekçi demo verisi.** 130+ çalışan, çok lokasyonlu seed verisi demo akışını güçlendiriyor.
- **Rol bazlı erişim çalışıyor.** Tenant Admin, HR, Manager, Technical Coordinator ve Super Admin rolleri uygulandı.
- **Kiracı temaları uygulandı.** TAV ve Turkcell marka renkleri arayüze yansıtıldı.
- **Teknoloji seçimi doğrulandı.** Next.js + Supabase stack'i hızlı iterasyona olanak sağladı.

## Geliştirilecekler

- **Sprint süreç dokümantasyonu eksik kaldı.** Daily Scrum, Sprint Review, Retrospective ve ürün durumu dokümanları sprint sırasında yazılmadı; sprint sonrasında tamamlanıyor.
- **Ekran görüntüsü kanıtları eksik.** Turkcell, çalışan profili, shortlist ve admin paneli için görsel kanıt henüz eklenmedi.
- **Git katkı dağılımı yetersiz.** Commit geçmişinde tek yazar görünüyor; ekip üyelerinin GitHub üzerinden katkı kanıtı oluşturulması gerekiyor.
- **Product Backlog linki README'de yoktu.** Miro/board referansı eksikti (Sprint 1 sonrası README güncelleniyor).
- **Velocity ölçümü resmi kaydedilmedi.** İlk sprint olduğu için baseline oluştu (21 SP) ancak formal bir velocity kaydı tutulmadı.

## Sonraki sprint aksiyonları

| # | Aksiyon | Sorumlu | Hedef sprint |
| --- | --- | --- | --- |
| 1 | Eksik ekran görüntülerini ekle (Turkcell, profil, shortlist, admin) | Buşra Eşkara | Sprint 2 (D5) |
| 2 | Sprint 2/3 dokümanlarını sprint içinde güncel tut | Buşra Eşkara | Sprint 2 |
| 3 | Ekip üyelerinin dağıtık Git commit/PR katkısı sağla | Tüm ekip | Sprint 2 |
| 4 | AI semantik arama spike'ına başla (D1) | Ömer Burak Avcıoğlu | Sprint 2 |
| 5 | Demo akışı ve kullanıcı senaryolarını hazırla (D6) | Buşra Eşkara | Sprint 2 |
| 6 | Daily Scrum notlarını sprint boyunca düzenli tut | Buşra Eşkara (SM) | Sprint 2 |

## Ölçülen velocity

| Sprint | Planlanan SP | Tamamlanan SP | Velocity |
| --- | ---: | ---: | ---: |
| Sprint 1 | 21 | 21 | 21 SP |

> İlk sprint olduğu için velocity baseline olarak 21 SP kabul edilir. Sprint 2 planlamasında bu değer referans alınacaktır.

## Öğrenimler

- Çok-kiracılı mimariyi sprint başında kurmak, sonraki UI geliştirmelerini hızlandırdı; kiracı izolasyonu sonradan eklenmek zorunda kalınmadı.
- RLS + uygulama katmanı çift kontrolü, güvenlik testlerinde güven verdi.
- AI özelliklerini bilinçli olarak Sprint 2/3'e ertelemek doğru karar oldu; MVP önce sağlam temele odaklandı.
- Süreç dokümantasyonunu sprint içinde paralel tutmak, sprint sonunda toplu yazmaktan daha az yük getirir — bu ders Sprint 2'de uygulanacak.

## Riskler

| Risk | Etki | Azaltma |
| --- | --- | --- |
| Git katkı kanıtı eksikliği | Proje yönetimi puanı riski | Ekip dağıtık commit/PR hedeflemeli |
| Eksik görsel kanıtlar | Ürün durumu belgesi zayıf | Sprint 2 D5 görevi |
| AI kapsamı geniş (Sprint 2/3) | Velocity düşüşü riski | Spike (D1) ile erken doğrulama |
| Dokümantasyon gecikmesi tekrarlanırsa | Değerlendirme puanı riski | SM günlük not tutma disiplini |
