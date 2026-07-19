import React from "react";
import { useEffect, useMemo, useState } from "react";

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
  const [showReview, setShowReview] = useState(false);
  const [reviewStep, setReviewStep] = useState(0);
  const [previewUrl, setPreviewUrl] = useState("");
  const acceptedTypes = ".pdf,.png,.jpg,.jpeg,.webp,.gif,.bmp,.tif,.tiff,.txt,.md,.csv,.json,.xml,.log,.doc,.docx,.rtf,.odt,.xls,.xlsx,.ods,.ppt,.pptx,.odp";
  const selectedFile = files[0] || null;
  const steps = useMemo(() => ["File", "Customer", "Print", "Paper", "Preview"], []);
  const currentStep = steps[reviewStep] || steps[0];
  const fileSizeKb = selectedFile ? Math.max(1, Math.round(selectedFile.size / 1024)) : 0;
  const isImagePreview = selectedFile?.type?.startsWith("image/");
  const isPdfPreview = selectedFile?.type === "application/pdf" || selectedFile?.name?.toLowerCase().endsWith(".pdf");

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const confirmUpload = () => {
    if (!selectedFile) {
      alert("Please choose one document file.");
      return;
    }
    setShowReview(false);
    onSubmit({ files: [selectedFile], settings });
  };

  const submit = (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Please choose one document file.");
      return;
    }

    setShowReview(true);
    setReviewStep(0);
  };

  const nextStep = () => setReviewStep((step) => Math.min(step + 1, steps.length - 1));
  const previousStep = () => setReviewStep((step) => Math.max(step - 1, 0));

  const optionSummary = [
    ["Customer name", settings.customerName || "Not added"],
    ["Copies", settings.copies || 1],
    ["Print color", settings.colorMode === "color" ? "Color" : "Black and white"],
    ["Pages", settings.pageSelection || "all"],
    ["Paper", settings.paperSize],
    ["Orientation", settings.orientation],
    ["Both sides", settings.duplex ? "Yes" : "No"]
  ];

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-ink/10 bg-white p-4 shadow-lg md:rounded-3xl md:p-6">
      <div>
        <p className="font-display text-2xl font-semibold text-ink">Upload your document</p>
        <p className="mt-1 text-sm text-ink/65">Choose one file, select the print options, then continue to payment.</p>
      </div>

      <label className="group relative flex min-h-56 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-alert bg-alert/10 px-4 py-10 text-center shadow-lg shadow-alert/10 transition hover:bg-alert/15 md:min-h-64 md:py-12">
        <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-alert sm:right-4 sm:top-4">Start here</span>
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-alert text-3xl font-bold text-white transition group-hover:scale-105">+</span>
        <span className="mt-4 text-xl font-bold text-ink">{selectedFile ? "File selected" : "Tap here to upload file"}</span>
        <span className="mt-2 max-w-full break-words text-sm text-ink/70">
          {selectedFile ? selectedFile.name : "PDF, image, Word, Excel, PPT, text and similar files"}
        </span>
        <span className="mt-3 rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink shadow-sm">
          {selectedFile ? "Tap to change file" : "Choose document"}
        </span>
        <input className="sr-only" type="file" accept={acceptedTypes} onChange={(e) => {
          const firstFile = e.target.files?.[0] || null;
          setFiles(firstFile ? [firstFile] : []);
          if (firstFile) {
            setReviewStep(0);
            setShowReview(true);
          }
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
        {isLoading ? "Uploading..." : selectedFile ? "Review & Upload" : "Choose File First"}
      </button>

      {showReview && selectedFile && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/45 px-2 py-2 sm:items-center sm:justify-center sm:px-3 sm:py-3">
          <div className="flex max-h-[94vh] w-full flex-col overflow-hidden rounded-3xl bg-white shadow-2xl sm:max-w-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="p-4 pb-0 sm:p-6 sm:pb-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-alert">Confirm before upload</p>
                <h2 className="mt-1 font-display text-2xl font-bold text-ink">Check your print details</h2>
                <p className="mt-1 text-sm font-semibold text-ink/70">Step {reviewStep + 1} of {steps.length}: {currentStep}</p>
              </div>
              <button type="button" onClick={() => setShowReview(false)} className="mr-4 mt-4 shrink-0 rounded-full border border-ink/15 px-3 py-1 text-sm font-semibold text-ink sm:mr-6 sm:mt-6">
                Close
              </button>
            </div>

            <div className="px-4 pt-4 sm:px-6">
              <div className="grid grid-cols-5 gap-2">
                {steps.map((step, index) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => setReviewStep(index)}
                    className={`h-2 rounded-full transition ${index <= reviewStep ? "bg-alert" : "bg-ink/10"}`}
                    aria-label={`Go to step ${index + 1}: ${step}`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 min-h-[390px] overflow-auto px-4 pb-4 sm:px-6">
              {reviewStep === 0 && (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-ink px-4 py-4 text-paper">
                    <p className="text-xs uppercase tracking-[0.18em] text-paper/70">Selected file</p>
                    <p className="mt-1 break-words text-lg font-semibold">{selectedFile.name}</p>
                    <p className="mt-1 text-xs text-paper/70">{fileSizeKb} KB</p>
                  </div>
                  <label className="block rounded-2xl border-2 border-dashed border-alert bg-alert/10 px-4 py-5 text-center text-sm font-semibold text-alert">
                    Tap here to change the file
                    <input className="sr-only" type="file" accept={acceptedTypes} onChange={(e) => {
                      const firstFile = e.target.files?.[0] || null;
                      setFiles(firstFile ? [firstFile] : []);
                    }} />
                  </label>
                </div>
              )}

              {reviewStep === 1 && (
                <div className="space-y-4">
                  <label className="text-sm font-medium text-ink">
                    Your name
                    <input className="mt-2 w-full rounded-xl border border-ink/15 px-4 py-3 text-base" placeholder="Name for the shop counter" value={settings.customerName} onChange={(e) => update({ customerName: e.target.value })} />
                  </label>
                  <div className="rounded-xl bg-paper/70 p-4 text-sm text-ink/65">
                    This name helps the shop identify your print at the counter.
                  </div>
                </div>
              )}

              {reviewStep === 2 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium text-ink">
                    Number of copies
                    <input className="mt-2 w-full rounded-xl border border-ink/15 px-4 py-3 text-base" type="number" min="1" value={settings.copies} onChange={(e) => update({ copies: e.target.value })} />
                  </label>
                  <label className="text-sm font-medium text-ink">
                    Print color
                    <select className="mt-2 w-full rounded-xl border border-ink/15 px-4 py-3 text-base" value={settings.colorMode} onChange={(e) => update({ colorMode: e.target.value })}>
                      <option value="bw">Black and white</option>
                      <option value="color">Color</option>
                    </select>
                  </label>
                  <label className="sm:col-span-2 text-sm font-medium text-ink">
                    Pages to print
                    <input className="mt-2 w-full rounded-xl border border-ink/15 px-4 py-3 text-base" placeholder="all or 1-3,7" value={settings.pageSelection} onChange={(e) => update({ pageSelection: e.target.value })} />
                    <span className="mt-2 block text-xs text-ink/55">Use "all" for the full document, or type pages like 1-3,7.</span>
                  </label>
                </div>
              )}

              {reviewStep === 3 && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-medium text-ink">
                      Orientation
                      <select className="mt-2 w-full rounded-xl border border-ink/15 px-4 py-3 text-base" value={settings.orientation} onChange={(e) => update({ orientation: e.target.value })}>
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                      </select>
                    </label>
                    <label className="text-sm font-medium text-ink">
                      Paper
                      <select className="mt-2 w-full rounded-xl border border-ink/15 px-4 py-3 text-base" value={settings.paperSize} onChange={(e) => update({ paperSize: e.target.value })}>
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
                </div>
              )}

              {reviewStep === 4 && (
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-2xl border border-ink/10 bg-paper/70">
                    <div className="flex min-h-56 items-center justify-center bg-white">
                      {previewUrl && isImagePreview && <img src={previewUrl} alt="Selected file preview" className="max-h-72 w-full object-contain" />}
                      {previewUrl && isPdfPreview && <iframe title="Selected PDF preview" src={previewUrl} className="h-72 w-full border-0" />}
                      {!isImagePreview && !isPdfPreview && (
                        <div className="px-4 text-center">
                          <p className="text-sm font-semibold text-ink">Preview is ready after upload for this file type.</p>
                          <p className="mt-1 break-words text-xs text-ink/55">{selectedFile.name}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-ink/10 bg-paper/70 p-4">
                    <p className="text-sm font-semibold text-ink">Full preview before upload</p>
                    <div className="mt-3 grid gap-2 text-sm text-ink/70 sm:grid-cols-2">
                      <p className="break-words sm:col-span-2">File: {selectedFile.name}</p>
                      <p>Size: {fileSizeKb} KB</p>
                      {optionSummary.map(([label, value]) => (
                        <p key={label}>{label}: {value}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-3 border-t border-ink/10 bg-white p-4 sm:grid-cols-3 sm:p-6">
              <button type="button" onClick={previousStep} disabled={reviewStep === 0 || isLoading} className="rounded-xl border border-ink/20 bg-white px-4 py-3 text-sm font-semibold text-ink disabled:opacity-40">
                Back
              </button>
              <button type="button" onClick={() => setShowReview(false)} disabled={isLoading} className="rounded-xl border border-ink/20 bg-white px-4 py-3 text-sm font-semibold text-ink disabled:opacity-40">
                Close
              </button>
              <div className="grid gap-3 sm:block">
                {reviewStep < steps.length - 1 ? (
                  <button type="button" onClick={nextStep} disabled={isLoading} className="w-full rounded-xl bg-alert px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
                    Next
                  </button>
                ) : (
                  <button type="button" onClick={confirmUpload} disabled={isLoading} className="w-full rounded-xl bg-mint px-4 py-3 text-sm font-semibold text-ink disabled:opacity-50">
                    {isLoading ? "Uploading..." : "Confirm & Upload"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
