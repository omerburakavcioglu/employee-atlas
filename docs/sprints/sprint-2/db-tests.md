# Sprint 2 / D1 — RLS İzolasyon Test Suite'i + CI (Kanıt)

**Tarih:** 11 Temmuz 2026
**Durum:** Tamamlandı — suite lokalde ve CI'da yeşil
**Görev tanımı:** pgTAP tabanlı tenant-izolasyon test suite'i + her push/PR'da koşan GitHub Actions workflow'u

## Kanıt özeti

| Metrik | Değer |
| --- | --- |
| Test dosyası | 5 (`supabase/tests/001`–`005`) |
| Assertion | 42 |
| Lokal sonuç | `All tests successful. Files=5, Tests=42 — Result: PASS` |
| CI ilk koşu | ✅ success (run #1, commit `9198fc4`) |
| CI koşu linki | https://github.com/omerburakavcioglu/employee-atlas/actions/runs/29164619399 |
| Workflow | https://github.com/omerburakavcioglu/employee-atlas/actions/workflows/db-tests.yml |

## Test kapsamı

| Dosya | Assertion | Ne kanıtlıyor |
| --- | ---: | --- |
| `001-rls-enabled.sql` | 17 | RLS'in açık olması gereken tabloların tamamında (13 tenant-owned + 4 junction) RLS aktif |
| `002-tenant-isolation.sql` | 8 | TAV admin karşı tenant verisini göremiyor/yazamıyor: SELECT filtreleniyor, INSERT 42501, UPDATE/DELETE 0 satır, composite FK 23503, tenant reassignment trigger'ı P0001 |
| `003-shortlists.sql` | 4 | Shortlist izolasyonu: cross-tenant shortlist görünmüyor; cross-tenant çalışan ekleme hem RLS (42501) hem composite FK (23503) katmanında yakalanıyor |
| `004-roles.sql` | 5 | Rol matrisi: Manager admin-panel yazamıyor (42501 / 0 satır), HR yazabiliyor |
| `005-tenant-isolation-turkcell.sql` | 8 | 002'nin aynası, Turkcell admin perspektifinden — izolasyon iki yönde de simetrik |

Tüm test dosyaları `begin; … rollback;` ile sarılı; suite hiçbir veri bırakmaz.
Testler yalnızca lokal Docker stack'inde koşar (CI'da da runner içinde
`supabase start` ile) — hosted veritabanına hiçbir bağlantı yok.

## Sprint Review cümlesi

> **"Tenant izolasyonunu her push'ta kanıtlıyoruz":** her push ve PR'da CI,
> veritabanını migration + seed ile sıfırdan kurup 42 izolasyon assertion'ını
> koşturuyor. Ekran görüntüsü için: yukarıdaki CI koşu linkini aç → yeşil
> "Database tests" job'ı + "Run pgTAP test suite" adımının çıktısı
> (`Files=5, Tests=42 — Result: PASS`) görünür şekilde ekran görüntüsü al.

## Merge engeli (branch protection)

CI tek başına bilgi verir; asıl değer merge engelinde. `main` için
"Database tests" check'i **required** yapılmalı. Bu ayarı yalnızca repo
sahibi (admin) yapabilir — ayrıntı ve hazır komut için not: workflow'daki
job `name: Database tests` olarak adlandırıldı ve `pull_request`
tetikleyicisindeki paths filtresi kaldırıldı; aksi halde supabase dışı
PR'larda check hiç koşmaz ve required check "waiting for status" ile
merge'i sonsuza dek beklertirdi.

Ayar (repo sahibi, Settings → Branches → Add branch ruleset/protection):
- Branch: `main`
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging (strict)
- Required check: **Database tests**
