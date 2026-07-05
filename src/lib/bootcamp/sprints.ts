// Grup 43 bootcamp sprint data (read-only, Turkish UI).
//
// Single source of truth for the /sprints panel. Kept in sync with the
// human-readable doc at docs/sprints/sprint-1/sprint-board.md — if you edit
// one, edit the other. No Supabase storage: this is bootcamp documentation,
// not tenant workforce data.

export type SprintStatus =
  | "backlog"
  | "todo"
  | "in_progress"
  | "in_review"
  | "done";

export type Priority = "low" | "medium" | "high";

export type SprintTask = {
  /** Short task code, e.g. "A1". */
  code: string;
  title: string;
  storyPoints: number;
  status: SprintStatus;
  priority: Priority;
  /** Work category, e.g. "Backend"; omitted for tasks not yet categorized. */
  category?: string;
  /** Person responsible; "TBD" for unassigned backlog items. */
  responsible: string;
  /** Completion percent, 0-100. */
  progress: number;
  /** Parent sprint slug (e.g. "sprint-1"), or "backlog" for project backlog items. */
  sprintId: string;
};

export type Sprint = {
  slug: string; // used in the URL, e.g. "sprint-1"
  number: number;
  name: string; // "Sprint 1"
  goal: string;
  startDate: string; // human label, Turkish
  endDate: string;
  state: "completed" | "active" | "planned";
  /** Tasks for a documented sprint; null for a not-yet-written placeholder. */
  tasks: SprintTask[] | null;
  /** Shown when tasks is null. */
  placeholder?: string;
};

// Board columns, in order. Turkish labels for the Grup 43 workspace.
export const SPRINT_COLUMNS: { id: SprintStatus; title: string }[] = [
  { id: "backlog", title: "Backlog" },
  { id: "todo", title: "Yapılacak" },
  { id: "in_progress", title: "Devam Ediyor" },
  { id: "in_review", title: "İncelemede" },
  { id: "done", title: "Tamamlandı" },
];

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
};

// Priority dot colors from the active tenant theme (Grup 43 preset).
export const PRIORITY_DOT: Record<Priority, string> = {
  low: "var(--muted-foreground)",
  medium: "var(--chart-3)",
  high: "var(--destructive)",
};

export const SPRINTS: Sprint[] = [
  {
    slug: "sprint-1",
    number: 1,
    name: "Sprint 1",
    goal: "Temel kurulum, veri modeli, kimlik doğrulama ve çalışan listeleme.",
    startDate: "19 Haziran 2026",
    endDate: "5 Temmuz 2026",
    state: "completed",
    tasks: [
      {
        code: "A1",
        title: "Repo, klasör yapısı, README, backlog board kurulumu",
        storyPoints: 2,
        status: "done",
        priority: "medium",
        category: "Dokümantasyon / Kurulum",
        responsible: "Buşra Eşkara",
        progress: 100,
        sprintId: "sprint-1",
      },
      {
        code: "A2",
        title:
          "Veri modeli: tenant, çalışan, lokasyon, departman, unvan, yetenek, eğitim, sertifika, deneyim ve rol yapısı",
        storyPoints: 3,
        status: "done",
        priority: "high",
        category: "Backend",
        responsible: "Ömer Burak Avcıoğlu",
        progress: 100,
        sprintId: "sprint-1",
      },
      {
        code: "A3",
        title: "Kayıt/giriş sistemi: Supabase Auth ile e-posta/şifre girişi",
        storyPoints: 3,
        status: "done",
        priority: "high",
        category: "Kimlik Doğrulama",
        responsible: "Hümeyra Maden",
        progress: 100,
        sprintId: "sprint-1",
      },
      {
        code: "A4",
        title:
          "Rol bazlı yetkilendirme: Tenant Admin, HR, Manager, Technical Coordinator ve Super Admin erişim yapısı",
        storyPoints: 5,
        status: "done",
        priority: "high",
        category: "Güvenlik",
        responsible: "Ömer Burak Avcıoğlu",
        progress: 100,
        sprintId: "sprint-1",
      },
      {
        code: "B1",
        title: "100+ sahte çok-lokasyonlu çalışan seed verisi",
        storyPoints: 3,
        status: "done",
        priority: "medium",
        category: "Veri",
        responsible: "Emine Soyuçok",
        progress: 100,
        sprintId: "sprint-1",
      },
      {
        code: "C1",
        title: "Çalışan liste/kart görünümü",
        storyPoints: 3,
        status: "done",
        priority: "medium",
        category: "Frontend",
        responsible: "Ahmet Berke Çiftçi",
        progress: 100,
        sprintId: "sprint-1",
      },
      {
        code: "C3",
        title: "Temel anahtar kelime araması",
        storyPoints: 2,
        status: "done",
        priority: "low",
        category: "Arama",
        responsible: "Ahmet Berke Çiftçi",
        progress: 100,
        sprintId: "sprint-1",
      },
    ],
  },
  {
    slug: "sprint-2",
    number: 2,
    name: "Sprint 2",
    goal: "Yapay zeka destekli arama, doğal dil filtreleme ve demo kalitesini artırmak.",
    startDate: "6 Temmuz 2026",
    endDate: "19 Temmuz 2026",
    state: "planned",
    tasks: [
      {
        code: "D1",
        title: "AI semantik arama teknik araştırması ve pgvector/embedding spike",
        storyPoints: 5,
        status: "todo",
        priority: "high",
        category: "Yapay Zeka",
        responsible: "Ömer Burak Avcıoğlu",
        progress: 0,
        sprintId: "sprint-2",
      },
      {
        code: "D2",
        title: "Çalışan profilleri için embedding veri hazırlığı ve arama indeks yapısı",
        storyPoints: 5,
        status: "todo",
        priority: "high",
        category: "Veri / AI",
        responsible: "Hümeyra Maden",
        progress: 0,
        sprintId: "sprint-2",
      },
      {
        code: "D3",
        title: "Doğal dil sorgularını filtrelere dönüştüren prototip",
        storyPoints: 8,
        status: "todo",
        priority: "high",
        category: "Yapay Zeka",
        responsible: "Ahmet Berke Çiftçi",
        progress: 0,
        sprintId: "sprint-2",
      },
      {
        code: "D4",
        title: "Proje için uygun çalışan öneri ajanı tasarımı",
        storyPoints: 8,
        status: "todo",
        priority: "high",
        category: "AI Agent",
        responsible: "Emine Soyuçok",
        progress: 0,
        sprintId: "sprint-2",
      },
      {
        code: "D5",
        title: "Görsel QA ekran görüntüleri ve Sprint 1 dokümanlarının tamamlanması",
        storyPoints: 3,
        status: "todo",
        priority: "medium",
        category: "Dokümantasyon",
        responsible: "Buşra Eşkara",
        progress: 0,
        sprintId: "sprint-2",
      },
      {
        code: "D6",
        title: "Demo akışı ve kullanıcı senaryolarının hazırlanması",
        storyPoints: 3,
        status: "todo",
        priority: "medium",
        category: "Ürün / Demo",
        responsible: "Buşra Eşkara",
        progress: 0,
        sprintId: "sprint-2",
      },
    ],
  },
  {
    slug: "sprint-3",
    number: 3,
    name: "Sprint 3",
    goal: "Final demo, ürün bütünlüğü, AI özelliklerinin iyileştirilmesi ve teslim hazırlığı.",
    startDate: "20 Temmuz 2026",
    endDate: "2 Ağustos 2026",
    state: "planned",
    tasks: [
      {
        code: "E1",
        title: "AI öneri sonuçlarının gerekçeli ve açıklanabilir hale getirilmesi",
        storyPoints: 5,
        status: "todo",
        priority: "high",
        category: "Yapay Zeka",
        responsible: "Ahmet Berke Çiftçi",
        progress: 0,
        sprintId: "sprint-3",
      },
      {
        code: "E2",
        title: "Semantik arama ve doğal dil filtreleme UI entegrasyonu",
        storyPoints: 5,
        status: "todo",
        priority: "high",
        category: "Frontend / AI",
        responsible: "Hümeyra Maden",
        progress: 0,
        sprintId: "sprint-3",
      },
      {
        code: "E3",
        title: "Tenant bazlı fotoğraf storage path yapısının değerlendirilmesi",
        storyPoints: 5,
        status: "todo",
        priority: "medium",
        category: "Güvenlik / Storage",
        responsible: "Ömer Burak Avcıoğlu",
        progress: 0,
        sprintId: "sprint-3",
      },
      {
        code: "E4",
        title: "Final UI polish ve responsive düzenlemeler",
        storyPoints: 5,
        status: "todo",
        priority: "medium",
        category: "UI / UX",
        responsible: "Emine Soyuçok",
        progress: 0,
        sprintId: "sprint-3",
      },
      {
        code: "E5",
        title: "Cross-tenant test senaryolarının dokümantasyonu ve kontrol listesi",
        storyPoints: 4,
        status: "todo",
        priority: "medium",
        category: "Test",
        responsible: "Buşra Eşkara",
        progress: 0,
        sprintId: "sprint-3",
      },
      {
        code: "E6",
        title: "3 dakikalık proje videosu senaryosu ve demo kaydı hazırlığı",
        storyPoints: 5,
        status: "todo",
        priority: "high",
        category: "Sunum / Demo",
        responsible: "Buşra Eşkara",
        progress: 0,
        sprintId: "sprint-3",
      },
      {
        code: "E7",
        title: "Final README, sprint dokümanları ve teslim formu hazırlığı",
        storyPoints: 4,
        status: "todo",
        priority: "high",
        category: "Dokümantasyon",
        responsible: "Emine Soyuçok",
        progress: 0,
        sprintId: "sprint-3",
      },
    ],
  },
];

// ── Project backlog ──────────────────────────────────────────────────────
// Future/unscheduled work not yet assigned to a sprint. Deliberately kept
// separate from SPRINTS: it must not appear on /sprints, the sprint
// roadmap, or count toward sprint progress — only on the planning board's
// dedicated "Backlog" column ("Sprint dışı / Gelecek işler").
export const BACKLOG_TASKS: SprintTask[] = [
  {
    code: "F1",
    title: "Çalışan self-service profil yönetimi",
    storyPoints: 8,
    status: "backlog",
    priority: "low",
    category: "Feature",
    responsible: "TBD",
    progress: 0,
    sprintId: "backlog",
  },
  {
    code: "F2",
    title: "Production super admin tenant switcher",
    storyPoints: 8,
    status: "backlog",
    priority: "medium",
    category: "Platform",
    responsible: "TBD",
    progress: 0,
    sprintId: "backlog",
  },
  {
    code: "F3",
    title: "Kurumsal SSO entegrasyonu",
    storyPoints: 13,
    status: "backlog",
    priority: "low",
    category: "Enterprise",
    responsible: "TBD",
    progress: 0,
    sprintId: "backlog",
  },
];

export function getSprint(slug: string): Sprint | undefined {
  return SPRINTS.find((s) => s.slug === slug);
}

export type SprintSummary = {
  totalTasks: number;
  completedTasks: number;
  inProgress: number;
  totalPoints: number;
  completedPoints: number;
  progress: number; // percent, by story points
};

export function summarize(tasks: SprintTask[]): SprintSummary {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const totalPoints = tasks.reduce((sum, t) => sum + t.storyPoints, 0);
  const completedPoints = tasks
    .filter((t) => t.status === "done")
    .reduce((sum, t) => sum + t.storyPoints, 0);
  const progress =
    totalPoints === 0 ? 0 : Math.round((completedPoints / totalPoints) * 100);
  return {
    totalTasks,
    completedTasks,
    inProgress,
    totalPoints,
    completedPoints,
    progress,
  };
}

// ── Project-wide aggregation (Genel Sprint Board) ───────────────────────
//
// Sprint 2/3 have no task data yet (tasks: null). Every aggregate below only
// counts sprints/tasks that actually have data — it never assumes 0 or
// invents scope for a sprint that hasn't been documented. Callers should
// label totals as "bilinen kapsam" (known scope) rather than "project
// total", since sprints without task data are excluded from the point math
// entirely, not counted as empty.

export type OverallSprintSummary = {
  totalSprints: number;
  completedSprints: number;
  activeSprints: number;
  plannedSprints: number;
  /** Story points summed only across sprints that have task data. */
  knownTotalPoints: number;
  knownCompletedPoints: number;
  knownRemainingPoints: number;
  /** Percent complete within known scope only (not the whole project). */
  knownProgress: number;
  /** True when at least one sprint has no task data yet (e.g. Sprint 2/3). */
  hasUnknownScope: boolean;
};

export function getOverallSprintSummary(): OverallSprintSummary {
  const totalSprints = SPRINTS.length;
  const completedSprints = SPRINTS.filter((s) => s.state === "completed").length;
  const activeSprints = SPRINTS.filter((s) => s.state === "active").length;
  const plannedSprints = SPRINTS.filter((s) => s.state === "planned").length;

  const known = SPRINTS.filter((s): s is Sprint & { tasks: SprintTask[] } =>
    Array.isArray(s.tasks),
  );
  const knownTotalPoints = known.reduce(
    (sum, s) => sum + s.tasks.reduce((tSum, t) => tSum + t.storyPoints, 0),
    0,
  );
  const knownCompletedPoints = known.reduce(
    (sum, s) =>
      sum +
      s.tasks
        .filter((t) => t.status === "done")
        .reduce((tSum, t) => tSum + t.storyPoints, 0),
    0,
  );
  const knownRemainingPoints = knownTotalPoints - knownCompletedPoints;
  const knownProgress =
    knownTotalPoints === 0
      ? 0
      : Math.round((knownCompletedPoints / knownTotalPoints) * 100);

  return {
    totalSprints,
    completedSprints,
    activeSprints,
    plannedSprints,
    knownTotalPoints,
    knownCompletedPoints,
    knownRemainingPoints,
    knownProgress,
    hasUnknownScope: SPRINTS.some((s) => s.tasks === null),
  };
}

export type SprintStatusCounts = {
  /** Task-level counts, across every sprint that has task data. */
  tamamlandi: number;
  devamEdiyor: number;
  yapilacak: number;
  /** Sprint-level count: sprints with no task data yet (planned/undocumented). */
  planlanacak: number;
};

export function getSprintStatusCounts(): SprintStatusCounts {
  const known = SPRINTS.flatMap((s) => s.tasks ?? []);
  return {
    tamamlandi: known.filter((t) => t.status === "done").length,
    devamEdiyor: known.filter((t) => t.status === "in_progress").length,
    yapilacak: known.filter((t) =>
      ["backlog", "todo", "in_review"].includes(t.status),
    ).length,
    planlanacak: SPRINTS.filter((s) => s.tasks === null).length,
  };
}

export type CategoryBreakdownEntry = {
  category: string;
  taskCount: number;
  storyPoints: number;
};

/** Aggregates only tasks that carry a `category`; uncategorized tasks are omitted. */
export function getCategoryBreakdown(): CategoryBreakdownEntry[] {
  const byCategory = new Map<string, CategoryBreakdownEntry>();
  for (const sprint of SPRINTS) {
    for (const task of sprint.tasks ?? []) {
      if (!task.category) continue;
      const entry = byCategory.get(task.category) ?? {
        category: task.category,
        taskCount: 0,
        storyPoints: 0,
      };
      entry.taskCount += 1;
      entry.storyPoints += task.storyPoints;
      byCategory.set(task.category, entry);
    }
  }
  return [...byCategory.values()].sort((a, b) => b.storyPoints - a.storyPoints);
}

// ── Planning board (Sprint Planı) ────────────────────────────────────────
// Aggregates across Sprint 1/2/3 only. Backlog is deliberately excluded from
// every total here — it is "Sprint dışı" (out of sprint scope) and must
// never affect the progress percentage.

export type PlanningBoardSummary = {
  totalSprints: number;
  completedSprints: number;
  plannedSprints: number;
  /** Sum of each sprint's story points (Sprint 1 + 2 + 3), backlog excluded. */
  totalKnownPoints: number;
  completedPoints: number;
  remainingPoints: number;
  /** Percent: completedPoints / totalKnownPoints. Backlog excluded. */
  progress: number;
  perSprintPoints: { slug: string; name: string; points: number }[];
};

export function getPlanningBoardSummary(): PlanningBoardSummary {
  const totalSprints = SPRINTS.length;
  const completedSprints = SPRINTS.filter((s) => s.state === "completed").length;
  const plannedSprints = SPRINTS.filter((s) => s.state === "planned").length;

  const perSprintPoints = SPRINTS.map((s) => ({
    slug: s.slug,
    name: s.name,
    points: (s.tasks ?? []).reduce((sum, t) => sum + t.storyPoints, 0),
  }));
  const totalKnownPoints = perSprintPoints.reduce((sum, s) => sum + s.points, 0);
  const completedPoints = SPRINTS.reduce(
    (sum, s) =>
      sum +
      (s.tasks ?? [])
        .filter((t) => t.status === "done")
        .reduce((tSum, t) => tSum + t.storyPoints, 0),
    0,
  );
  const remainingPoints = totalKnownPoints - completedPoints;
  const progress =
    totalKnownPoints === 0
      ? 0
      : Math.round((completedPoints / totalKnownPoints) * 100);

  return {
    totalSprints,
    completedSprints,
    plannedSprints,
    totalKnownPoints,
    completedPoints,
    remainingPoints,
    progress,
    perSprintPoints,
  };
}

export type BacklogSummary = {
  taskCount: number;
  storyPoints: number;
};

export function getBacklogSummary(): BacklogSummary {
  return {
    taskCount: BACKLOG_TASKS.length,
    storyPoints: BACKLOG_TASKS.reduce((sum, t) => sum + t.storyPoints, 0),
  };
}
