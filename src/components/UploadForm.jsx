import React from "react";
import { useState } from "react";

const SETTINGS_KEY = "panda_print_settings";

const defaultSettings = {
  customerName: "",
  copies: 1,
  pageSelection: "all",
  colorMode: "bw",
  orientation: "portrait",
  paperSize: "A4",
  duplex: false
};

export function useCachedSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) {
        return defaultSettings;
      }
      return { ...defaultSettings, ...JSON.parse(raw) };
    } catch {
      return defaultSettings;
    }
  });

  const update = (patch) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  };

  return [settings, update];
}

export default function UploadForm({ onSubmit, isLoading }) {
  const [settings, update] = useCachedSettings();
  const [files, setFiles] = useState([]);
  const acceptedTypes = ".pdf,.png,.jpg,.jpeg,.webp,.gif,.bmp,.tif,.tiff,.txt,.md,.csv,.json,.xml,.log,.doc,.docx,.rtf,.odt,.xls,.xlsx,.ods,.ppt,.pptx,.odp";
  const selectedFile = files[0] || null;

  const submit = (event) => {
    event.preventDefault();
    if (!files.length) {
      alert("Please choose one document file.");
      return;
    }

    onSubmit({ files: [files[0]], settings });
  };

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-ink/10 bg-white p-4 shadow-lg md:rounded-3xl md:p-6">
      <div>
        <p className="font-display text-2xl font-semibold text-ink">Upload your document</p>
        <p className="mt-1 text-sm text-ink/65">Choose one file, select the print options, then continue to payment.</p>
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ink/20 bg-paper/60 px-4 py-6 text-center transition hover:border-alert/60 hover:bg-alert/5">
        <span className="text-sm font-semibold text-ink">{selectedFile ? "Selected file" : "Tap to choose file"}</span>
        <span className="mt-1 max-w-full truncate text-xs text-ink/60">
          {selectedFile ? selectedFile.name : "PDF, image, Word, Excel, PPT, text and similar files"}
        </span>
        <input className="sr-only" type="file" accept={acceptedTypes} onChange={(e) => {
          const firstFile = e.target.files?.[0] || null;
          setFiles(firstFile ? [firstFile] : []);
        }} />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium text-ink">
          Your name
          <input className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" placeholder="Name for the shop counter" value={settings.customerName} onChange={(e) => update({ customerName: e.target.value })} />
        </label>
        <label className="text-sm font-medium text-ink">
          Number of copies
          <input className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" type="number" min="1" value={settings.copies} onChange={(e) => update({ copies: e.target.value })} />
        </label>
        <label className="text-sm font-medium text-ink">
          Print color
          <select className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" value={settings.colorMode} onChange={(e) => update({ colorMode: e.target.value })}>
            <option value="bw">Black and white</option>
            <option value="color">Color</option>
          </select>
        </label>
        <label className="text-sm font-medium text-ink">
          Pages to print
          <input className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" placeholder="all or 1-3,7" value={settings.pageSelection} onChange={(e) => update({ pageSelection: e.target.value })} />
          <span className="mt-1 block text-xs text-ink/55">Use "all" for the full document, or type pages like 1-3,7.</span>
        </label>
        <label className="text-sm font-medium text-ink">
          Orientation
          <select className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" value={settings.orientation} onChange={(e) => update({ orientation: e.target.value })}>
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </label>
        <label className="text-sm font-medium text-ink">
          Paper
          <select className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" value={settings.paperSize} onChange={(e) => update({ paperSize: e.target.value })}>
            <option value="A4">A4</option>
            <option value="Letter">Letter</option>
          </select>
        </label>
      </div>

      <label className="flex items-start gap-3 rounded-xl border border-ink/10 bg-paper/60 p-3 text-sm font-medium text-ink">
        <input className="mt-1" type="checkbox" checked={Boolean(settings.duplex)} onChange={(e) => update({ duplex: e.target.checked })} />
        <span>
          Print on both sides
          <span className="block text-xs font-normal text-ink/55">Enable only if you want double-sided printing.</span>
        </span>
      </label>

      <div className="rounded-xl bg-ink px-4 py-3 text-sm text-paper">
        The final amount is calculated after upload using the detected page count and the shop price.
      </div>

      <button type="submit" disabled={isLoading} className="w-full rounded-xl bg-mint px-4 py-3 text-sm font-semibold text-ink disabled:opacity-50">
        {isLoading ? "Uploading..." : "Upload & Continue to Pay"}
      </button>
    </form>
  );
}
