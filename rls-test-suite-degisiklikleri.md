# RLS İzolasyon Test Suite'i + CI — Değişiklik Özeti (Sprint 2 / D1)

`claude-code-rls-gorevi.md` görevinin uygulanması sonucunda yapılan tüm
değişikliklerin kaydı. Tarih: 2026-07-11.

## Sonuç

```
supabase test db
Files=5, Tests=42, All tests successful — Result: PASS
```

Testler `supabase db reset --local` ile sıfırdan kurulan migration + seed
üzerinde de yeşil. Hosted/canlı veritabanına hiçbir adımda bağlanılmadı;
her şey lokal Docker stack'inde koştu. Gerçek bir izolasyon açığı
bulunmadı — kırılan her test, test yazımı kaynaklıydı ve test tarafında
düzeltildi; şema/politika düzeltmesi (yeni migration) gerekmedi.

## Eklenen dosyalar

| Dosya | İçerik |
| --- | --- |
| `supabase/tests/001-rls-enabled.sql` | 17 assertion — RLS'in açık olması gereken tabloların tam listesi |
| `supabase/tests/002-tenant-isolation.sql` | 8 assertion — TAV admin perspektifinden cross-tenant izolasyon |
| `supabase/tests/003-shortlists.sql` | 4 assertion — shortlist izolasyonu (RLS + composite FK katmanları) |
| `supabase/tests/004-roles.sql` | 5 assertion — rol matrisi (manager yazamaz, HR yazabilir) |
| `supabase/tests/005-tenant-isolation-turkcell.sql` | 8 assertion — 002'nin Turkcell aynası |
| `.github/workflows/db-tests.yml` | CI: her push (main) ve `supabase/**` dokunan PR'larda suite'i koşturur |

Mevcut hiçbir dosya değiştirilmedi (migration'lar, seed, `.env.local` dahil).

## Adım 0 keşif bulguları (şablona göre uyarlamalar)

1. **Tenant slug'ları**: şablondaki `'tav'` yanlıştı; gerçek değerler
   `'tav-airports'` ve `'turkcell'` (üçüncü tenant: `'grup-43'`, çalışan
   verisi yok).
2. **`profiles` kullanıcı kolonu**: `id` değil **`user_id`** (PK,
   `auth.users.id`'ye FK). Trigger testi buna göre yazıldı.
3. **`employees` zorunlu kolonları**: default'suz NOT NULL kolonlar yalnızca
   `tenant_id`, `first_name`, `last_name` — test INSERT'lerinin minimum seti.
4. **Tenant reassignment trigger'ı**: `profiles_guard_change`
   (`guard_profile_change()` fonksiyonu). Hata: `P0001`,
   `only super admins can change a profile's tenant`.
5. **Composite FK adları** (canlı lokal DB kataloğundan doğrulandı):
   `employees_department_id_tenant_id_fkey`,
   `employees_location_id_tenant_id_fkey`,
   `shortlist_employees_shortlist_id_tenant_id_fkey`,
   `shortlist_employees_employee_id_tenant_id_fkey`.
6. **RLS'li tablo listesi**: README'deki 13'lük listeye ek olarak migration
   4 junction tabloda da RLS açıyor (`employee_skills`,
   `employee_certifications`, `employee_languages`, `employee_hobbies`) —
   001 bu yüzden **17** tablo test ediyor.

## Şablonda yapılan düzeltmeler (koşturmada çıkanlar)

- **UPDATE/DELETE testleri**: Postgres, veri değiştiren CTE'yi skaler alt
  sorgu içinde kabul etmiyor (`WITH clause containing a data-modifying
  statement must be at the top level`). Aynı assertion
  `is_empty('update/delete ... returning 1')` deseniyle yeniden yazıldı.
- **`tests.clear_auth()` yetkisi**: `authenticated` rolüne geçince `tests`
  şemasına erişim kalmıyordu (`permission denied for schema tests`).
  Transaction içinde kalan (rollback'lenen) `grant usage/execute` eklendi.
- **Trigger testi**: 4 parametreli `throws_ok` ile gerçek hata kodu
  (`P0001`) ve mesajı assert ediliyor.

## Önemli tasarım notları

- **Shortlist cross-tenant ekleme — hangi katman yakalıyor?** Gönderilen
  `tenant_id`'ye bağlı: kendi tenant_id'siyle Turkcell çalışanı eklemek RLS
  WITH CHECK'i geçip composite FK'ye takılıyor (**23503**); karşı
  tenant_id'siyle eklemek FK'ye gelmeden RLS'te reddediliyor (**42501**).
  003 iki varyantı da ayrı assertion olarak test ediyor — biri FK
  katmanını, diğeri RLS katmanını kanıtlıyor.
- **Seed'de Turkcell'e ait shortlist yok**; 003'ün SELECT senaryosu için
  setup'ta superuser iken geçici bir Turkcell shortlist'i oluşturuluyor
  (transaction rollback'lendiği için seed bozulmuyor).
- Her test dosyası `begin; … rollback;` ile sarılı — suite veri bırakmaz,
  arka arkaya koşturmak güvenlidir.
- `super_admin`'in cross-tenant erişimi bilinçli tasarım olduğu için test
  kapsamı dışında tutuldu (görev gereği).

## Nasıl koşturulur

```bash
supabase start            # lokal Docker stack (gerekiyorsa)
supabase db reset --local # migration + seed ile temiz kurulum
supabase test db          # suite: 5 dosya, 42 assertion
```

> **Yeni tenant-owned tablo eklerken:** tabloyu
> `supabase/tests/001-rls-enabled.sql` listesine ekle ve `plan()` sayısını
> güncelle — bu test tam olarak RLS'i unutulmuş tabloları yakalamak için var.

## CI

`.github/workflows/db-tests.yml`: `main`'e her push'ta ve `supabase/**`
veya workflow dosyasına dokunan PR'larda koşar. Adımlar: checkout →
Supabase CLI → `supabase start` → `supabase db reset --local` →
`supabase test db` → (her durumda) `supabase stop`. Secret, `supabase
link`, `db push` veya `--project-ref` içermez; her şey runner içindeki
lokal stack'te döner.

## Definition of Done durumu

1. ✅ `supabase test db` lokalde tamamen yeşil (5 dosya / 42 assertion).
2. ⏳ GitHub Actions ilk koşu — push sonrası doğrulanacak (push manuel yapılacak).
3. ⏳ PR açıklaması için test özeti hazır: **5 dosya, 42 assertion, Result: PASS**
   (bu dosyanın "Sonuç" bölümü PR açıklamasına kopyalanabilir).
4. ✅→📄 README yerine bu dosya: "Database tests" bilgisi yukarıdaki
   "Nasıl koşturulur" bölümünde.
