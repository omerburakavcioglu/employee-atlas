"use client";

import { useRef, useState, useTransition } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { CheckCircle2, Download, FileSpreadsheet, Upload, XCircle } from "lucide-react";
import { toast } from "sonner";
import { importEmployees } from "@/lib/actions/import";
import { IMPORT_COLUMNS, importRowSchema, type ImportRow } from "@/lib/import-schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ParsedRow = {
  index: number;
  raw: Record<string, string>;
  parsed: ImportRow | null;
  errors: string[];
};

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function parseRows(records: Record<string, unknown>[]): ParsedRow[] {
  return records.map((raw, index) => {
    const normalized: Record<string, string> = {};
    for (const [k, v] of Object.entries(raw)) {
      normalized[normalizeHeader(k)] = v == null ? "" : String(v).trim();
    }
    const result = importRowSchema.safeParse(normalized);
    return {
      index,
      raw: normalized,
      parsed: result.success ? result.data : null,
      errors: result.success
        ? []
        : result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    };
  });
}

const TEMPLATE_SAMPLE = [
  {
    first_name: "Ada",
    last_name: "Yilmaz",
    title: "Operations Specialist",
    department: "Operations",
    location_code: "ESB",
    email: "ada.yilmaz@tav.aero",
    phone: "+90 532 000 00 00",
    internal_ext: "1234",
    manager_name: "Kemal Ünsal",
    start_date: "2021-03-15",
    education_level: "bachelor",
    school: "Middle East Technical University",
    graduate_info: "",
    skills: "Airport Operations; SQL",
    certifications: "IATA Airport Operations Diploma",
    languages: "Turkish; English",
    hobbies: "Hiking",
    expertise_areas: "Airside Operations",
    tools_technologies: "Excel; SAP",
  },
];

export function ImportWizard() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [done, setDone] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const validRows = rows.filter((r) => r.parsed);
  const invalidRows = rows.filter((r) => !r.parsed);

  async function handleFile(file: File) {
    setDone(null);
    setFileName(file.name);
    if (file.name.toLowerCase().endsWith(".csv")) {
      Papa.parse<Record<string, unknown>>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => setRows(parseRows(res.data)),
        error: () => toast.error("Could not parse the CSV file."),
      });
    } else {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const records = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
        raw: false,
        defval: "",
      });
      setRows(parseRows(records));
    }
  }

  function downloadTemplate() {
    const csv = Papa.unparse(TEMPLATE_SAMPLE, { columns: [...IMPORT_COLUMNS] });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employee-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function commit() {
    startTransition(async () => {
      const res = await importEmployees(validRows.map((r) => r.parsed!));
      if (res.error) toast.error(res.error);
      else {
        setDone(res.inserted);
        setRows([]);
        setFileName(null);
        toast.success(`Imported ${res.inserted} employees`);
      }
    });
  }

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
        <Button onClick={() => inputRef.current?.click()}>
          <Upload className="size-4" />
          Choose CSV or Excel file
        </Button>
        <Button variant="outline" onClick={downloadTemplate}>
          <Download className="size-4" />
          Download template
        </Button>
        {fileName && (
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <FileSpreadsheet className="size-4" />
            {fileName}
          </span>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Expected columns: <code className="text-xs">{IMPORT_COLUMNS.join(", ")}</code>.
        Separate multiple tags with a semicolon. Location is matched by its code
        (e.g. ESB); unknown departments are created automatically.
      </p>

      {done !== null && (
        <Alert className="border-sky/40 bg-secondary">
          <CheckCircle2 className="size-4 text-sky" />
          <AlertTitle>Import complete</AlertTitle>
          <AlertDescription>
            {done} employees were imported. They are now visible in the map and
            directory.
          </AlertDescription>
        </Alert>
      )}

      {rows.length > 0 && (
        <>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="gap-1">
              <CheckCircle2 className="size-3.5 text-sky" />
              {validRows.length} valid
            </Badge>
            {invalidRows.length > 0 && (
              <Badge variant="outline" className="gap-1 text-destructive">
                <XCircle className="size-3.5" />
                {invalidRows.length} with errors (skipped)
              </Badge>
            )}
            <Button
              className="ml-auto"
              disabled={pending || validRows.length === 0}
              onClick={commit}
            >
              {pending ? "Importing…" : `Import ${validRows.length} employees`}
            </Button>
          </div>

          <div className="overflow-hidden rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.slice(0, 100).map((r) => (
                  <TableRow key={r.index} className={r.errors.length ? "bg-destructive/5" : ""}>
                    <TableCell className="text-muted-foreground tabular-nums">
                      {r.index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {r.raw.first_name} {r.raw.last_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{r.raw.title}</TableCell>
                    <TableCell className="text-muted-foreground">{r.raw.department}</TableCell>
                    <TableCell>
                      {r.raw.location_code ? (
                        <span className="code-chip">{r.raw.location_code}</span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      {r.errors.length === 0 ? (
                        <span className="flex items-center gap-1 text-xs text-sky">
                          <CheckCircle2 className="size-3.5" /> Ready
                        </span>
                      ) : (
                        <span className="text-xs text-destructive">
                          {r.errors.join("; ")}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {rows.length > 100 && (
            <p className="text-xs text-muted-foreground">
              Showing the first 100 of {rows.length} rows.
            </p>
          )}
        </>
      )}
    </div>
  );
}
