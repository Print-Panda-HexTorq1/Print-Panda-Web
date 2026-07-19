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

  const submit = (event) => {
    event.preventDefault();
    if (!files.length) {
      alert("Please choose one document file.");
      return;
    }

    onSubmit({ files: [files[0]], settings });
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-ink/10 bg-white/90 p-4 shadow-lg md:space-y-5 md:rounded-3xl md:p-6">
      <label className="block text-sm font-medium text-ink">
        Document
        <input className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" type="file" accept={acceptedTypes} onChange={(e) => {
          const firstFile = e.target.files?.[0] || null;
          setFiles(firstFile ? [firstFile] : []);
        }} />
        {!!files.length && <p className="mt-1 truncate text-xs text-ink/70">{files[0]?.name}</p>}
        <p className="mt-1 hidden text-xs text-ink/60 md:block">Supports PDF, images, text files, and common Office documents.</p>
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium text-ink">
          Name
          <input className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" value={settings.customerName} onChange={(e) => update({ customerName: e.target.value })} />
        </label>
        <label className="text-sm font-medium text-ink">
          Copies
          <input className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" type="number" min="1" value={settings.copies} onChange={(e) => update({ copies: e.target.value })} />
        </label>
        <label className="text-sm font-medium text-ink">
          Mode
          <select className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" value={settings.colorMode} onChange={(e) => update({ colorMode: e.target.value })}>
            <option value="bw">B/W</option>
            <option value="color">Color</option>
          </select>
        </label>
        <label className="text-sm font-medium text-ink">
          Pages
          <input className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" placeholder="all or 1-3,7" value={settings.pageSelection} onChange={(e) => update({ pageSelection: e.target.value })} />
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

      <label className="flex items-center gap-2 text-xs font-medium text-ink/80">
        <input type="checkbox" checked={Boolean(settings.duplex)} onChange={(e) => update({ duplex: e.target.checked })} />
        Duplex
      </label>

      <div className="hidden rounded-xl bg-ink px-4 py-3 text-paper md:block">
        Price is auto-calculated after upload from detected document pages.
      </div>

      <button type="submit" disabled={isLoading} className="w-full rounded-lg bg-mint px-4 py-2.5 text-sm font-semibold text-ink disabled:opacity-50">
        {isLoading ? "Uploading..." : "Upload & Continue to Pay"}
      </button>
    </form>
  );
}
