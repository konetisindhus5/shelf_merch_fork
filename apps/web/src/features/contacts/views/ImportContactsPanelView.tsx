import { useRef } from "react";
import { Upload } from "lucide-react";
import type { ContactImportStatus } from "../model";
import type { ImportContactsVm } from "../controllers/useImportContactsController";

const ACCEPT =
  ".csv,.xlsx,.xls,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const STAGE_LABEL: Record<ContactImportStatus["status"], string> = {
  queued: "Queued for processing…",
  processing: "Validating and importing contacts…",
  done: "Import complete",
  failed: "Import failed",
};

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ImportContactsPanelView(vm: ImportContactsVm) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>
        Download the template, fill in employee details, and upload a CSV or Excel file.{" "}
        <button type="button" className="lnk" onClick={vm.onDownloadTemplate}>
          Download template
        </button>
      </p>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        style={{ display: "none" }}
        onChange={(e) => vm.onPickFile(e.target.files?.[0] ?? null)}
      />

      {!vm.file ? (
        <button
          type="button"
          className="ac-import-zone"
          onClick={() => inputRef.current?.click()}
          style={{
            width: "100%",
            border: "1.5px dashed var(--line)",
            borderRadius: "var(--r-sm)",
            padding: 22,
            textAlign: "center",
            color: "var(--ink-2)",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          <Upload size={20} aria-hidden="true" />
          <div style={{ fontWeight: 600, fontSize: 13 }}>Drag and drop file</div>
          <div className="mut3" style={{ fontSize: 11, margin: "6px 0" }}>
            CSV, XLSX, or XLS · max 5 MB
          </div>
          <span className="btn btn-soft btn-sm">Browse files</span>
        </button>
      ) : (
        <div className="ac-import-file-card">
          <div
            className="row"
            style={{ alignItems: "center", justifyContent: "space-between", gap: 10 }}
          >
            <div style={{ minWidth: 0, textAlign: "left" }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 13,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {vm.file.name}
              </div>
              <div className="mut3" style={{ fontSize: 11 }}>
                {fmtSize(vm.file.size)}
              </div>
            </div>
            {!vm.busy && (
              <button
                type="button"
                className="xbtn"
                aria-label="Remove file"
                onClick={vm.onClearFile}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {vm.status && (
        <div
          className="ac-import-status"
          style={{ marginTop: 12 }}
          role="status"
          aria-live="polite"
        >
          <div style={{ fontWeight: 600 }}>{STAGE_LABEL[vm.status.status]}</div>
          {vm.status.status === "done" && (
            <div className="mut3" style={{ fontSize: 12, marginTop: 4 }}>
              {vm.status.validCount} of {vm.status.totalRows} rows imported
              {vm.status.errorCount > 0 ? ` · ${vm.status.errorCount} skipped` : ""}
            </div>
          )}
          {vm.status.errors.length > 0 && (
            <div
              style={{
                marginTop: 8,
                maxHeight: 120,
                overflow: "auto",
                fontSize: 12,
                color: "var(--ink-2)",
              }}
            >
              {vm.status.errors.slice(0, 5).map((e, i) => (
                <div key={i}>
                  Row {e.row}: {e.message}
                </div>
              ))}
              {vm.status.errors.length > 5 && <div>…and {vm.status.errors.length - 5} more</div>}
            </div>
          )}
        </div>
      )}

      <div className="row" style={{ marginTop: 16 }}>
        <button
          type="button"
          className="btn btn-ghost btn-block"
          onClick={vm.onDone}
          disabled={vm.busy}
        >
          {vm.finished ? "Close" : "Cancel"}
        </button>
        {!vm.finished && (
          <button
            type="button"
            className="btn btn-brand btn-block"
            onClick={vm.onRunImport}
            disabled={!vm.file || vm.busy}
          >
            {vm.busy ? "Importing…" : "Import contacts"}
          </button>
        )}
      </div>
    </div>
  );
}
