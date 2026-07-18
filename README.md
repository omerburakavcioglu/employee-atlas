# Employee Atlas

Employee Atlas, çok lokasyonlu büyük şirketlerin - holdingler, havalimanı
işletmecileri, telekom operatörleri, perakende zincirleri, fabrikalar ve
benzeri kuruluşların - şehirler, ülkeler, ofisler, havalimanları, şubeler ve
kampüsler genelindeki iş gücünü keşfetmesine, yönetmesine ve analiz etmesine
yardımcı olan çok-kiracılı (multi-tenant) bir B2B SaaS platformudur.

Her şirket aynı paylaşımlı giriş sayfasından oturum açar. Kimlik doğrulaması
sonrası kullanıcı yalnızca kendi şirketinin çalışma alanını görür: çalışanlar,
lokasyonlar, marka ve rol bazlı yetkiler. Harita öncelikli dashboard,
aranabilir dizin, kısa listeler ve analitik ekranların tümü yalnızca oturum
açan kullanıcının kiracısı üzerinde çalışır.

Örnek (seed) demo kiracıları: **TAV Airports** (havalimanı operasyonları) ve
**Turkcell** (telekomünikasyon ve teknoloji).

**Nihai ürün hedefi:** Sağlam çok-kiracılı temelin üzerine yapay zeka destekli
yetenekler eklemek - semantik (anlamsal) çalışan arama, doğal dil ile filtreleme
ve bir proje/rol için en uygun çalışanları gerekçesiyle öneren bir yapay zeka
ajanı. Nihai teslimde bu AI özellikleriyle birlikte cilalanmış bir demo ve tam
sprint dokümantasyonu hedeflenmektedir.

## Bootcamp - Grup 43

| | |
| --- | --- |
| **Takım numarası** | 43 |
| **Ürün adı** | Employee Atlas |
| **Canlı demo** | https://employee-atlas.vercel.app/ |

### Takım Üyeleri ve Rolleri

| İsim | Rol | LinkedIn |
| --- | --- | --- |
| Büşra Eşkara | Scrum Master & Developer | [LinkedIn](https://www.linkedin.com/in/busraeskara) |
| Ahmet Berke Çiftçi | Product Owner & Developer | [LinkedIn](https://www.linkedin.com/in/berkecftc) |
| Hümeyra Maden | Developer | [LinkedIn](https://www.linkedin.com/in/h%C3%BCmeyra-maden) |
| Emine Soyuçok | Developer | [LinkedIn](https://www.linkedin.com/in/emine-soyu%C3%A7ok-244793229) |
| Ömer Burak Avcıoğlu | Developer | [LinkedIn](https://www.linkedin.com/in/omerburakavcioglu) |

### Hedef Kitle

Employee Atlas, çok lokasyonlu büyük ölçekli şirketler - holdingler,
havalimanı işletmecileri, telekom operatörleri, perakende zincirleri,
fabrikalar ve benzeri kuruluşlar - için tasarlanmıştır. Bu organizasyonların
İK departmanları, yöneticileri ve teknik koordinatörleri; farklı şehir,
ülke, ofis, havalimanı, şube ve kampüslerdeki iş gücünü keşfetmek, yönetmek
ve analiz etmek için platformu kullanır.

## Sprint 1

**Tarih:** 19 Haziran 2026 – 5 Temmuz 2026 · **Durum:** Tamamlandı · **Canlı demo:** https://employee-atlas.vercel.app/

> Sprint hedefi: Temel kurulum, veri modeli, kimlik doğrulama ve çalışan listeleme (MVP çekirdeği).
>
> Detaylı doküman: [Sprint 1 özeti](docs/sprints/sprint-1/sprint1.md)

### Product Backlog

- **Nereden yürüttük:** Product Backlog ve tüm sprint görevleri **Trello** üzerinden takip edildi. Board, iş aşamalarına göre listelere ayrılmıştır: **Backlog → To Do → In Progress → Done** (+ Rejected). Her kart, sorumlusu, story point'i ve başlangıç/bitiş tarihiyle birlikte tutulur; hangi sprinte ait olduğu **renkli etiketlerle** gösterilir: 🟢 yeşil = Sprint 1, 🟡 sarı = Sprint 2, 🔵 mavi = Sprint 3, ⚪ gri = Backlog (sprint dışı). Sprint 1 tamamlandığı için tüm Sprint 1 kartları **Done** listesindedir. (Ayrıca uygulama içinde salt-okunur bir sprint panosu da bulunur: `/sprints`.)
- **Link:** [Trello — Employee Atlas Product Backlog](https://trello.com/b/PF92LZMW/employee-atlas)
- **Ekran görüntüsü:**

![Product Backlog — Trello (Sprint 1)](docs/sprints/sprint-1/sprint1-1.PNG)
![Product Backlog — Trello (Sprint 1)](docs/sprints/sprint-1/sprint1-2.PNG)

### Sprint Puanlaması

Puanlama, ekip içi göreceli büyüklük tahminiyle (planning poker benzeri) yapıldı. Her göreve karmaşıklığına göre story point (SP) atandı:

- **2 SP** - tek kişinin birkaç saatte bitirebileceği, net kapsamlı görevler
- **3 SP** - orta karmaşıklıkta, birkaç bileşeni kapsayan görevler
- **5 SP** - birden fazla katmanı (veritabanı, uygulama, politika) etkileyen karmaşık görevler

Sprint 1 için **7 görev** açıldı ve toplam kapasite **21 SP** olarak belirlendi. İki haftalık sprinte uygun kapasite hedeflendi.

| Kod | Görev | SP | Durum |
| --- | --- | ---: | --- |
| A1 | Repo, klasör yapısı, README, backlog board kurulumu | 2 | ✅ |
| A2 | Veri modeli (tenant, çalışan, lokasyon, departman, unvan, yetenek, eğitim, sertifika, rol) | 3 | ✅ |
| A3 | Kayıt/giriş sistemi (Supabase Auth, e-posta/şifre) | 3 | ✅ |
| A4 | Rol bazlı yetkilendirme (Tenant Admin, HR, Manager, Technical Coordinator, Super Admin) | 5 | ✅ |
| B1 | 100+ sahte çok-lokasyonlu çalışan seed verisi | 3 | ✅ |
| C1 | Çalışan liste/kart görünümü | 3 | ✅ |
| C3 | Temel anahtar kelime araması | 2 | ✅ |

- **Puanlama mantığı ve toplam:** 7 görev · 21 SP (2/3/5 SP göreceli büyüklük)
- **Tamamlanan:** 21 / 21 SP → **%100 tamamlanma** · Velocity: 21 SP (baseline)

### Daily Scrum

- **Nereden görüştük:** Günlük senkronizasyon **WhatsApp** grubu üzerinden (hızlı durum paylaşımı ve blocker bildirimi) ve **Slack** üzerinden huddle yaparak (geliştirme/teknik koordinasyon) yürütüldü.

- **Ekran görüntüsü:** 
 [Google Drive Linki](https://drive.google.com/drive/folders/1MO36G4rBL_l6UVB_-wARWaUjH9aX1mj8?usp=sharing)

  Sprint boyunca derlenen özet Daily Scrum tablosu: [daily-scrum.md](docs/sprints/sprint-1/daily-scrum.md).

### Ürün geliştirme durumu

Sprint 1 sonunda MVP çekirdeği canlıya alındı. Aşağıdaki ekran görüntüleri ürünün güncel durumunu gösterir:

**Giriş ekranı** - Paylaşılan, kiracıdan bağımsız login sayfası. Tüm kullanıcılar aynı noktadan giriş yapar; doğrulama sonrası yalnızca kendi kiracısının çalışma alanına yönlenir.

![Giriş ekranı](docs/sprints/sprint-1/urun_durumu_4.png)

**Harita dashboard (TAV Airports)** - Lokasyon pinleri, çalışan sayıları ve pin tıklamasıyla açılan çalışan kartları. 50 çalışan, 10 lokasyon.

![TAV harita dashboard](docs/sprints/sprint-1/urun_durumu_5.png)

**Çalışan dizini (TAV Airports)** - Tam metin arama, filtreler (lokasyon, departman, yetenek vb.) ve kart/liste/tablo görünümü. Filtreler kiracıya özeldir.

![TAV çalışan dizini](docs/sprints/sprint-1/urun_durumu_1.png)

**Analytics (TAV Airports)** - İş gücü KPI'ları ve dağılım grafikleri (lokasyon, departman, yetenek, sertifika); kiracı temasına uyumlu palet.

![TAV analytics](docs/sprints/sprint-1/urun_durumu_2.png)

**Grup 43 Sprint Board** - Uygulama içi sprint panosu; Sprint 1 görevleri, story point'ler ve %100 ilerleme (21/21 SP). Kiracı izolasyonu çalışır.

![Grup 43 sprint board](docs/sprints/sprint-1/urun_durumu_3.png)

Ayrıntılı ürün durumu: [product-status.md](docs/sprints/sprint-1/product-status.md).

### Sprint Review

Sprint 1'de MVP çekirdeği tamamlandı ve Vercel'e canlı deploy edildi. Sprint Review'da canlı ortamda şu akış gösterildi: giriş → harita dashboard → dizin (arama/filtre) → analytics → kiracı izolasyonu (TAV↔Turkcell geçişi) → Grup 43 sprint panosu.

Şimdiye kadar yapılanlar ve verilen kararlar:

- **Çok-kiracılı mimari** hayata geçirildi: TAV Airports ve Turkcell kiracıları izole çalışıyor (RLS + composite FK + uygulama katmanı, savunma derinliği).
- **Kimlik doğrulama ve 5 rollü erişim** (Tenant Admin, HR, Manager, Technical Coordinator, Super Admin) uygulandı.
- **130+ gerçekçi seed çalışan** (TAV: 50, Turkcell: 80) çok lokasyonlu veriyle demo akışını güçlendirdi.
- **Harita, dizin, profil, shortlist, analytics ve admin paneli** erişilebilir; kiracı temaları uygulandı.
- **AI özellikleri bilinçli olarak Sprint 2/3'e ertelendi** — MVP önce sağlam temele odaklandı.

Tüm planlanan 7 hikâye (21/21 SP) tamamlandı; tamamlanmayan görev yok. Ayrıntı: [sprint-review.md](docs/sprints/sprint-1/sprint-review.md).

### Sprint Retrospective

**İyi gidenler:** Çok-kiracılı mimarinin sprint başında kurulması sonraki UI geliştirmelerini hızlandırdı; canlı deploy başarılı; tüm sprint hedefleri (%100) karşılandı; teknoloji seçimi (Next.js + Supabase) doğrulandı.

**Geliştirilecekler / gelecek sprintte farklı yapılacaklar:**

- **Süreç dokümantasyonunu sprint içinde güncel tutmak** — Daily Scrum, review, retro ve ürün durumu dokümanları sprint sonunda toplu yazıldı; Sprint 2'de paralel tutulacak.
- **Günlük Daily Scrum notlarını düzenli arşivlemek** (SM disiplini).
- **Git katkısını ekibe dağıtmak** — commit/PR katkısı tek yazarda yoğunlaştı; dağıtık katkı hedeflenecek.
- **Eksik ekran görüntülerini tamamlamak** (Turkcell, çalışan profili, shortlist, admin paneli) — Sprint 2 D5 görevi.

**Sonraki sprint planı özeti:** AI semantik arama spike'ı (D1) ile başlanacak; Sprint 2 kapasitesi 32 SP olarak planlandı (Sprint 1 velocity'si 21 SP baseline alınarak). Ayrıntı: [sprint-retrospective.md](docs/sprints/sprint-1/sprint-retrospective.md).

## Sprint 2

**Tarih:** 6 Temmuz 2026 - 19 Temmuz 2026 · **Durum:** Tamamlandı· **Canlı demo:** https://employee-atlas.vercel.app/

> Sprint hedefi: Yapay zeka destekli arama, doğal dil filtreleme ve demo kalitesini artırmak.

### Product Backlog

- **Nereden yürüttük:** Sprint 1 ile aynı **Trello** board'undan. Sprint 2 görevleri (🟡 sarı etiket) iş ilerledikçe **To Do → In Progress → Done** listeleri arasında taşınır; her kartta sorumlu, story point ve başlangıç/bitiş tarihi bulunur. Böylece Sprint 2'nin biten ve devam eden işleri tek bakışta görülür. (Renk lejantı: 🟢 Sprint 1, 🟡 Sprint 2, 🔵 Sprint 3, ⚪ Backlog.)
- **Link:** [Trello - Employee Atlas Product Backlog](https://trello.com/b/PF92LZMW/employee-atlas)
- **Ekran görüntüsü:** (Yalnızca Sprint 2 kartlarını görmek için board'da **Filter → Sprint 2 (sarı)** uygulanabilir.)

![Product Backlog - Trello (Sprint 2)](docs/sprints/sprint-2/sprint2-1.PNG)
![Product Backlog - Trello (Sprint 2)](docs/sprints/sprint-2/sprint2-2.PNG)
![Product Backlog - Trello (Sprint 2)](docs/sprints/sprint-2/sprint2-3.PNG)

### Sprint puanlaması

Sprint 1'deki puanlama mantığı sürdürüldü (planning poker benzeri göreceli büyüklük). Sprint 2 için **6 görev** açıldı ve toplam kapasite **32 SP** olarak belirlendi. Sprint 1 velocity'si (21 SP) baseline alınarak, AI odaklı ve daha büyük görevler nedeniyle kapasite bir miktar yüksek tutuldu.

- **8 SP** - birden fazla katmanı kapsayan, yüksek belirsizlik içeren AI görevleri (D3, D4)
- **5 SP** - orta-yüksek karmaşıklıkta araştırma/altyapı görevleri (D1, D2)
- **3 SP** - dokümantasyon ve demo hazırlığı görevleri (D5, D6)

| Kod | Görev | SP | Sorumlu | Durum |
| --- | --- | ---: | --- | --- |
| D1 | AI semantik arama teknik araştırması ve pgvector/embedding spike | 5 | Ömer Burak Avcıoğlu | ✅ Tamamlandı |
| D2 | Çalışan profilleri için embedding veri hazırlığı ve arama indeks yapısı | 5 | Hümeyra Maden | ✅ Tamamlandı |
| D3 | Doğal dil sorgularını filtrelere dönüştüren prototip | 8 | Ahmet Berke Çiftçi | 🔄 Devam ediyor |
| D4 | Proje için uygun çalışan öneri ajanı tasarımı | 8 | Emine Soyuçok | 🔄 Devam ediyor |
| D5 | Görsel QA ekran görüntüleri ve Sprint 1 dokümanlarının tamamlanması | 3 | Büşra Eşkara | ✅ Tamamlandı |
| D6 | Demo akışı ve kullanıcı senaryolarının hazırlanması | 3 | Büşra Eşkara | 🔄 Devam ediyor |

- **Puanlama mantığı ve toplam:** 6 görev · 32 SP (3/5/8 SP göreceli büyüklük)
- **Ne kadarı tamamlandı:** D1 (araştırma/spike: pgvector + embedding yaklaşımı doğrulandı), D2 (embedding veri hazırlığı ve arama indeksi) ve D5 (Sprint 1 dokümantasyonu) tamamlandı → **13 / 32 SP (~%41)**. Kalan 19 SP (D3, D4, D6) doğal dil prototipi, öneri ajanı ve demo hazırlığı olarak devam ediyor.
- **Ek tamamlanan mühendislik kanıtı:** Sprint 2 kapsamında pgTAP tabanlı **RLS izolasyon test suite'i** (5 dosya, 42 assertion) ve her push/PR'da koşan **GitHub Actions CI** tamamlandı ve yeşil. Ayrıntı ve CI koşu linki: [db-tests.md](docs/sprints/sprint-2/db-tests.md).

### Daily Scrum

- **Nereden görüştük:** Sprint 1 ile aynı şekilde günlük senkronizasyon **WhatsApp** grubu (hızlı durum/blocker) ve **Slack** (teknik koordinasyon) üzerinden yürütülüyor. Sprint 2'de günlük notların düzenli tutulması (Sprint 1 retrospektif aksiyonu) uygulanıyor.
- **Ekran görüntüsü:** 

[Google Drive Linki](https://drive.google.com/drive/folders/18Ni6HB8ZvBHDHojrOHswwsU1dLkovu0f?usp=sharing)

### Ürün geliştirme durumu

Sprint 2'de ürün, Sprint 1 MVP çekirdeğinin üzerine **kalite/güvenlik altyapısı** ve **AI arama yeteneği** yönünde ilerliyor. Aşağıda ürünün Sprint 2 itibarıyla çalışan güncel ekranları ile somut mühendislik çıktısı yer alır.

**Çalışan dizini (arama + filtreler)** - Semantik arama çalışmalarının üzerine kurulacağı mevcut tam metin arama ve çok-kriterli filtreleme ekranı.

![Çalışan dizini](docs/sprints/sprint-1/urun_durumu_1.png)

**Analytics (iş gücü grafikleri)** - Lokasyon, departman, yetenek ve sertifika dağılım grafikleri; ürünün veri/çıktı durumunu gösteren analitik ekran.

![Analytics](docs/sprints/sprint-1/urun_durumu_2.png)

**Harita dashboard** - Çok lokasyonlu iş gücünün harita üzerindeki güncel görünümü.

![Harita dashboard](docs/sprints/sprint-1/urun_durumu_5.png)

**Tenant izolasyon test suite'i + CI (yeşil koşu)** — Her push ve PR'da CI, veritabanını migration + seed ile sıfırdan kurup 42 izolasyon assertion'ını koşturuyor (`Files=5, Tests=42 — Result: PASS`). Bu, ürünün güvenlik/kalite durumunu kanıtlayan somut bir çıktıdır. Ayrıntı ve CI koşu linki: [db-tests.md](docs/sprints/sprint-2/db-tests.md).

<!-- Ekleyince: ![Sprint 2 CI yeşil koşu](docs/sprints/sprint-2/ci-green-run.png) -->
_(İsteğe bağlı: CI yeşil koşu ekran görüntüsü de eklenebilir — db-tests.md içindeki CI koşu linkinden alınabilir. AI arama UI'ı tamamlandıkça buraya eklenecek.)_

### Sprint Review

Sprint 2, canlı ürünün üzerine kalite ve AI yeteneği eklenmesine odaklandı. Şimdiye kadar yapılanlar ve verilen kararlar:

- **Kalite/güvenlik altyapısı sağlamlaştırıldı:** pgTAP RLS izolasyon test suite'i (5 dosya, 42 assertion) ve her push/PR'da koşan GitHub Actions CI devreye alındı; `main` için "Database tests" check'i merge engeli olarak hedeflendi. Kiracı izolasyonu artık her push'ta otomatik kanıtlanıyor.
- **AI arama yaklaşımına karar verildi ve altyapısı hazırlandı:** Teknik araştırma/spike (D1) sonucunda semantik arama için **pgvector + embedding** yaklaşımı seçildi; embedding veri hazırlığı ve arama indeks yapısı (D2) tamamlandı. Bunun üzerine doğal dil → filtre prototipi (D3) geliştiriliyor.
- **Dokümantasyon borcu kapatıldı:** Sprint 1 süreç dokümanları (daily, review, retro, ürün durumu) ve README sprint bölümleri tamamlandı (D5) - Sprint 1 retrospektif aksiyonu karşılandı.
- **Demo hazırlığı başladı:** Demo akışı ve kullanıcı senaryoları (D6) üzerinde çalışılıyor.

Sprint sonu (19 Temmuz) itibarıyla tamamlanamayan AI görevleri, Sprint 3'e (E1–E2 semantik arama entegrasyonu ve açıklanabilir öneriler) devredilecek şekilde değerlendirilecek. Ayrıntı: [db-tests.md](docs/sprints/sprint-2/db-tests.md).

### Sprint Retrospective

**İyi gidenler:** Sprint 1 retrospektif aksiyonları uygulandı - süreç dokümantasyonu güncel tutuldu ve test/CI altyapısı kuruldu. Kiracı izolasyonunun otomatik test edilmesi güven verdi.

**Geliştirilecekler / gelecek sprintte farklı yapılacaklar:**

- **AI görevlerini daha küçük parçalara bölmek** - 8 SP'lik büyük AI görevleri (D3, D4) tek sprintte bitirilmesi zor oldu; Sprint 3'te AI işleri daha küçük, doğrulanabilir adımlara ayrılacak.
- **AI özelliklerine erken spike ile başlamak** işe yaradı; bu disiplin sürdürülecek.
- **Ekran görüntüsü/QA kanıtlarını iş bittikçe anında eklemek** (sprint sonuna bırakmamak).
- **Git katkısını ekibe dağıtmaya devam etmek** (Sprint 1'den taşınan aksiyon).

**Sonraki sprint planı özeti (Sprint 3):** Final demo, ürün bütünlüğü ve AI özelliklerinin iyileştirilmesine odaklanılacak — semantik arama & doğal dil filtreleme UI entegrasyonu (E1–E2), tenant fotoğraf storage değerlendirmesi (E3), final UI polish (E4), cross-tenant test dokümantasyonu (E5), 3 dakikalık proje videosu (E6) ve final README/teslim hazırlığı (E7). Sprint 3 kapasitesi 33 SP olarak planlandı.

