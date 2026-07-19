import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import UploadForm from "../components/UploadForm";
import Footer from "../components/Footer";
import {
  beginDraftUploadWithProgress,
  cancelDraftUpload,
  finalizeDraftUpload,
  getUserJobProgress,
  getUserUploadDetails,
  uploadJobWithProgress,
  verifyPayment
} from "../api";

function formatBytesPerSecond(bytesPerSecond) {
  if (!bytesPerSecond || bytesPerSecond <= 0) return "0 KB/s";
  const units = ["B/s", "KB/s", "MB/s", "GB/s"];
  let size = bytesPerSecond;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) { size /= 1024; unitIndex += 1; }
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatElapsed(seconds) {
  const total = Math.max(0, Math.floor(seconds || 0));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function formatQueueTokenDisplay(queueToken, jobId) {
  const raw = String(queueToken || "").trim();
  if (!raw) {
    return `PP-${jobId}`;
  }
  return raw.replace(/^([A-Za-z]+-?)0+(\d+)$/, "$1$2");
}

const STAGE_FLOW = [
  { key: "not_paid", label: "Not Paid" },
  { key: "payment_verify", label: "Payment Check" },
  { key: "ready_for_print", label: "Ready" },
  { key: "printing", label: "Printing" },
  { key: "printed", label: "Done" }
];

const STATUS_LABELS = {
  payment_pending: "Awaiting Payment",
  paid: "Payment Received",
  approved: "Ready to Print",
  printing: "Printing",
  printed: "Printed",
  print_failed: "Print Failed",
  rejected: "Rejected"
};

const CUSTOMER_SCREENS = [
  { key: "upload", label: "Upload", icon: "+" },
  { key: "status", label: "Status", icon: "=" },
  { key: "history", label: "History", icon: "#" }
];

function getStageFromStatus(status) {
  const value = String(status || "").toLowerCase();
  switch (value) {
    case "payment_pending":
      return "not_paid";
    case "paid":
      return "payment_verify";
    case "approved":
      return "ready_for_print";
    case "printing":
      return "printing";
    case "printed":
      return "printed";
    case "print_failed":
      return "failed";
    case "rejected":
      return "rejected";
    default:
      return "unknown";
  }
}

function statusBadgeLabel(status) {
  const key = String(status || "").toLowerCase();
  return STATUS_LABELS[key] || String(status || "").replace(/_/g, " ").toUpperCase();
}

function statusBadgeClass(status) {
  const key = String(status || "").toLowerCase();
  if (key === "printed") return "bg-emerald-100 text-emerald-800";
  if (key === "printing") return "bg-blue-100 text-blue-800";
  if (key === "approved" || key === "paid") return "bg-amber-100 text-amber-800";
  if (key === "print_failed" || key === "rejected") return "bg-red-100 text-red-700";
  return "bg-slate-100 text-slate-700";
}

function countSelectedPagesForHistory(pageSelection, totalPageCount) {
  const total = Number(totalPageCount) > 0 ? Number(totalPageCount) : 1;
  const selection = String(pageSelection || "").trim().toLowerCase();
  if (!selection || selection === "all") {
    return total;
  }

  const pageSet = new Set();
  for (const part of selection.split(",")) {
    const trimmed = String(part || "").trim();
    const rangeMatch = trimmed.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      const from = Math.max(1, Number.parseInt(rangeMatch[1], 10));
      const to = Math.min(total, Number.parseInt(rangeMatch[2], 10));
      for (let i = from; i <= to; i += 1) {
        pageSet.add(i);
      }
    } else if (/^\d+$/.test(trimmed)) {
      const page = Number.parseInt(trimmed, 10);
      if (page >= 1 && page <= total) {
        pageSet.add(page);
      }
    }
  }

  return pageSet.size > 0 ? pageSet.size : total;
}

function stageVisualState(stageKey, currentStageKey) {
  const targetIndex = STAGE_FLOW.findIndex((stage) => stage.key === stageKey);
  const currentIndex = STAGE_FLOW.findIndex((stage) => stage.key === currentStageKey);
  if (targetIndex === -1 || currentIndex === -1) {
    return "pending";
  }
  if (targetIndex < currentIndex) {
    return "done";
  }
  if (targetIndex === currentIndex) {
    return "current";
  }
  return "pending";
}

function JobProgressPanel({ progressPayload, fallbackStatus }) {
  const [expanded, setExpanded] = useState(false);
  const currentStatus = String(progressPayload?.job?.status || fallbackStatus || "");
  const currentStage = getStageFromStatus(currentStatus);
  const timeline = Array.isArray(progressPayload?.timeline) ? progressPayload.timeline : [];
  const printProgress = progressPayload?.printProgress || {};
  const documentRetention = progressPayload?.documentRetention || null;
  const totalPages = Number(printProgress.totalPages || 0);
  const pagesPrinted = Number(printProgress.pagesPrinted || 0);
  const percent = totalPages > 0 ? Math.min(100, Math.max(0, Math.round((pagesPrinted / totalPages) * 100))) : 0;

  return (
    <div className="mt-4 rounded-2xl border border-ink/10 bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/65">Current Stage</p>
        <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusBadgeClass(currentStatus)}`}>{statusBadgeLabel(currentStatus)}</span>
      </div>

      {(currentStatus === "printing" || currentStatus === "printed") && (
        <div className="mt-3 rounded-xl border border-ink/10 bg-paper/70 p-3">
          <div className="flex items-center justify-between text-xs text-ink/70">
            <span>Printing Progress</span>
            <span>{pagesPrinted}/{totalPages || "?"} pages</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/10">
            <div className="h-full rounded-full bg-mint transition-all" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-2 text-xs text-ink/65">{percent}% complete</p>
        </div>
      )}

      {documentRetention && (
        <div className="mt-3 rounded-xl border border-ink/10 bg-paper/70 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/65">Document File</p>
          <div className="mt-2 grid gap-2 text-xs text-ink/70 sm:grid-cols-2">
            <p>Shop download: {documentRetention.downloadedByShop ? "Received by shop" : "Waiting for shop"}</p>
            <p>Server file: {documentRetention.serverFileDeleted ? "Deleted after retention" : documentRetention.serverFileAvailable ? "Available" : "Not available"}</p>
          </div>
        </div>
      )}
      <div className="mt-3 md:hidden">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="rounded-lg border border-ink/20 bg-white px-3 py-1.5 text-xs font-semibold text-ink"
        >
          {expanded ? "Hide timeline" : "Show timeline"}
        </button>
      </div>

      <div className="mt-3 hidden gap-2 sm:grid-cols-5 md:grid">
        {STAGE_FLOW.map((stage) => {
          const visual = stageVisualState(stage.key, currentStage);
          const className = visual === "done"
            ? "border-emerald-300 bg-emerald-100 text-emerald-900"
            : visual === "current"
              ? "border-blue-300 bg-blue-600 text-white"
              : "border-ink/15 bg-paper/70 text-ink/60";
          return (
            <div key={`desktop_${stage.key}`} className={`rounded-lg border px-2 py-2 text-center text-[11px] font-semibold ${className}`}>
              {stage.label}
            </div>
          );
        })}
      </div>

      <div className="mt-3 hidden md:block">
        {!!timeline.length && (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/65">Timeline</p>
            <div className="mt-2 space-y-2">
              {timeline.map((event, index) => (
                <div key={`desktop_${event.status}_${event.at}_${index}`} className="rounded-lg border border-ink/10 bg-paper/60 px-3 py-2">
                  <p className="text-xs font-semibold text-ink">{statusBadgeLabel(event.status)}</p>
                  <p className="text-[11px] text-ink/60">{event?.at ? new Date(event.at).toLocaleString() : "-"}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {expanded && (
        <>
          <div className="mt-3 grid gap-2 sm:grid-cols-5">
            {STAGE_FLOW.map((stage) => {
              const visual = stageVisualState(stage.key, currentStage);
              const className = visual === "done"
                ? "border-emerald-300 bg-emerald-100 text-emerald-900"
                : visual === "current"
                  ? "border-blue-300 bg-blue-600 text-white"
                  : "border-ink/15 bg-paper/70 text-ink/60";
              return (
                <div key={stage.key} className={`rounded-lg border px-2 py-2 text-center text-[11px] font-semibold ${className}`}>
                  {stage.label}
                </div>
              );
            })}
          </div>

          {!!timeline.length && (
            <div className="mt-3 md:hidden">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/65">Timeline</p>
              <div className="mt-2 space-y-2">
                {timeline.map((event, index) => (
                  <div key={`${event.status}_${event.at}_${index}`} className="rounded-lg border border-ink/10 bg-paper/60 px-3 py-2">
                    <p className="text-xs font-semibold text-ink">{statusBadgeLabel(event.status)}</p>
                    <p className="text-[11px] text-ink/60">{event?.at ? new Date(event.at).toLocaleString() : "-"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function getUploadStateStorageKey(userUid) {
  return `panda_upload_state_${String(userUid || "unknown")}`;
}

function loadSavedUploadState(userUid) {
  const key = getUploadStateStorageKey(userUid);
  const parse = (raw) => {
    if (!raw) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw);
      return {
        uploads: Array.isArray(parsed?.uploads) ? parsed.uploads : [],
        shopName: typeof parsed?.shopName === "string" ? parsed.shopName : ""
      };
    } catch {
      return null;
    }
  };

  try {
    const local = parse(localStorage.getItem(key));
    if (local) {
      return local;
    }
  } catch {
    // Ignore localStorage access failures and fallback to sessionStorage.
  }

  try {
    const session = parse(sessionStorage.getItem(key));
    if (session) {
      return session;
    }
  } catch {
    // Ignore sessionStorage access failures.
  }

  return { uploads: [], shopName: "" };
}

export default function CustomerUpload() {
  const { userUid } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const normalizedUserUid = String(userUid || "").trim();
  const hasValidUserUid = Boolean(normalizedUserUid);
  const storageKey = useMemo(() => getUploadStateStorageKey(userUid), [userUid]);
  const [uploads, setUploads] = useState(() => loadSavedUploadState(userUid).uploads);
  const [loading, setLoading] = useState(false);
  const [shopName, setShopName] = useState(() => loadSavedUploadState(userUid).shopName);
  const [shopDetails, setShopDetails] = useState(null);
  const [shopDetailsError, setShopDetailsError] = useState("");
  const [verifyLoadingMap, setVerifyLoadingMap] = useState({});
  const [expandedJobs, setExpandedJobs] = useState({});
  const [showOlderUploads, setShowOlderUploads] = useState(false);
  const [jobProgressMap, setJobProgressMap] = useState({});
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeScreen, setActiveScreen] = useState("upload");
  const uploadsRef = useRef(uploads);
  const shopNameRef = useRef(shopName);
  const redirectNoticeHandledRef = useRef(false);
  const draftUploadRef = useRef(null);
  const persistUploadState = (nextUploads, nextShopName) => {
    const payload = JSON.stringify({
      uploads: Array.isArray(nextUploads) ? nextUploads : [],
      shopName: String(nextShopName || ""),
      updatedAt: Date.now()
    });
    try {
      localStorage.setItem(storageKey, payload);
    } catch {
      // Ignore localStorage write failures.
    }
    try {
      sessionStorage.setItem(storageKey, payload);
    } catch {
      // Ignore sessionStorage write failures.
    }
  };

  const prepareBackgroundUpload = (file) => {
    if (!hasValidUserUid || !file) {
      return null;
    }

    const draftKey = `${Date.now()}_${file.name}_${file.size}`;
    const upload = beginDraftUploadWithProgress({
      file,
      userUid: normalizedUserUid,
      onProgress: () => {}
    });

    let settledDraft = null;
    const prepared = {
      key: draftKey,
      fileName: file.name,
      fileSize: file.size,
      promise: upload.promise.then((data) => {
        settledDraft = data?.draft || null;
        return data;
      }),
      cancel: () => {
        upload.abort();
        prepared.promise
          .then((data) => {
            const draftId = data?.draft?.id || settledDraft?.id;
            if (draftId) {
              cancelDraftUpload(normalizedUserUid, draftId).catch(() => {});
            }
          })
          .catch(() => {});
      }
    };
    draftUploadRef.current = prepared;
    return prepared;
  };
  const updateUploads = (updater) => {
    setUploads((previous) => {
      const next = typeof updater === "function" ? updater(previous) : updater;
      uploadsRef.current = next;
      if (isHydrated) {
        persistUploadState(next, shopNameRef.current);
      }
      return next;
    });
  };
  const updateShopName = (valueOrUpdater) => {
    setShopName((previous) => {
      const next = typeof valueOrUpdater === "function" ? valueOrUpdater(previous) : valueOrUpdater;
      shopNameRef.current = next;
      if (isHydrated) {
        persistUploadState(uploadsRef.current, next);
      }
      return next;
    });
  };
  const trackedJobs = useMemo(
    () => uploads
      .map((item) => ({
        localId: item.localId,
        jobId: Number(item?.result?.job?.id)
      }))
      .filter((item) => Number.isFinite(item.jobId)),
    [uploads]
  );
  const toggleJobExpanded = (localId) => {
    setExpandedJobs((current) => ({ ...current, [localId]: !current[localId] }));
  };
  const isJobExpanded = (localId) => Boolean(expandedJobs[localId]);
  const trackedJobsKey = useMemo(
    () => trackedJobs.map((item) => `${item.localId}:${item.jobId}`).join("|"),
    [trackedJobs]
  );

  useEffect(() => {
    const saved = loadSavedUploadState(userUid);
    const restoredUploads = (saved.uploads || []).map((item) => {
      const status = String(item?.status || "");
      if (status === "uploading" || status === "queued") {
        return {
          ...item,
          status: "failed",
          error: "Upload interrupted by refresh. Please upload this file again."
        };
      }
      return item;
    });
    uploadsRef.current = restoredUploads;
    shopNameRef.current = saved.shopName;
    setUploads(restoredUploads);
    setShopName(saved.shopName);
    setIsHydrated(true);
  }, [userUid]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    persistUploadState(uploads, shopName);
  }, [storageKey, uploads, shopName, isHydrated]);

  useEffect(() => {
    if (!hasValidUserUid) {
      return undefined;
    }

    const runProgressSync = async () => {
      if (!trackedJobs.length) {
        return;
      }

      const updates = await Promise.all(
        trackedJobs.map(async ({ localId, jobId }) => {
          try {
            const payload = await getUserJobProgress(normalizedUserUid, jobId);
            return { localId, payload };
          } catch {
            return null;
          }
        })
      );

      const validUpdates = updates.filter(Boolean);
      if (!validUpdates.length) {
        return;
      }

      setJobProgressMap((current) => {
        const next = { ...current };
        validUpdates.forEach((entry) => {
          next[entry.localId] = entry.payload;
        });
        return next;
      });

      updateUploads((current) => {
        let changed = false;
        const next = current.map((item) => {
          const payload = validUpdates.find((entry) => entry.localId === item.localId)?.payload;
          if (!payload?.job || !item.result) {
            return item;
          }
          const currentJob = item.result.job || {};
          const incomingJob = payload.job || {};
          if (
            currentJob.status === incomingJob.status
            && String(currentJob.updated_at || "") === String(incomingJob.updated_at || "")
            && Number(currentJob.print_progress_pages || 0) === Number(incomingJob.print_progress_pages || 0)
            && Number(currentJob.print_progress_total || 0) === Number(incomingJob.print_progress_total || 0)
          ) {
            return item;
          }
          changed = true;
          return {
            ...item,
            result: {
              ...item.result,
              job: incomingJob
            }
          };
        });
        return changed ? next : current;
      });
    };

    runProgressSync();
    const timer = setInterval(runProgressSync, 2000);
    return () => clearInterval(timer);
  }, [trackedJobs, trackedJobsKey, normalizedUserUid, hasValidUserUid]);

  useEffect(() => {
    if (!hasValidUserUid) {
      return;
    }

    let isAlive = true;
    setShopDetailsError("");

    getUserUploadDetails(normalizedUserUid)
      .then((details) => {
        if (!isAlive) {
          return;
        }
        setShopDetails(details || null);
        if (details?.shopName) {
          updateShopName(details.shopName);
        }
      })
      .catch((error) => {
        if (!isAlive) {
          return;
        }
        setShopDetailsError(error?.message || "Failed to load shop details");
      });

    return () => {
      isAlive = false;
    };
  }, [normalizedUserUid, hasValidUserUid]);

  useEffect(() => {
    if (redirectNoticeHandledRef.current) {
      return;
    }
    const paymentState = String(searchParams.get("payment") || "");
    const jobId = Number(searchParams.get("jobId") || 0);
    if (!paymentState) {
      return;
    }
    redirectNoticeHandledRef.current = true;
    setActiveScreen("status");
    if (paymentState === "success" && Number.isFinite(jobId) && jobId > 0) {
      alert(`Payment verified for job #${jobId}. The shop has been notified.`);
      getUserJobProgress(normalizedUserUid, jobId)
        .then((payload) => {
          setJobProgressMap((current) => ({ ...current, [`redirect-${jobId}`]: payload }));
          updateUploads((current) => current.map((item) => (
            Number(item?.result?.job?.id) === jobId
              ? { ...item, result: { ...item.result, job: payload.job || item.result.job } }
              : item
          )));
        })
        .catch(() => {});
    } else if (paymentState === "failed") {
      alert("Payment verification failed. Please contact the shop if money was debited.");
    }
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("payment");
    nextParams.delete("jobId");
    nextParams.delete("token");
    nextParams.delete("reason");
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams, normalizedUserUid]);

  const onUpload = async ({ files, settings, preparedUpload }) => {
    if (!hasValidUserUid) {
      alert("Invalid upload link. Please scan the QR code again.");
      return;
    }

    const targetFile = Array.isArray(files) ? files[0] : null;
    if (!targetFile) {
      alert("Please select one file to upload.");
      return;
    }

    try {
      setLoading(true);
      setActiveScreen("status");
      const initialRows = [{
        localId: `${Date.now()}_0_${targetFile.name}`,
        fileName: targetFile.name,
        fileSize: targetFile.size,
        progress: 0,
        loaded: 0,
        total: targetFile.size,
        speed: 0,
        elapsedSeconds: 0,
        status: "queued",
        result: null,
        error: ""
      }];
      updateUploads((prev) => [...initialRows, ...prev]);

      const row = initialRows[0];
      const start = Date.now();
      let dummyTimer = null;
      const startVisibleProgress = () => {
        dummyTimer = window.setInterval(() => {
          const elapsedSeconds = (Date.now() - start) / 1000;
          updateUploads((prev) => prev.map((item) => {
            if (item.localId !== row.localId || item.status !== "uploading") {
              return item;
            }
            const nextProgress = Math.min(95, Math.max(item.progress || 0, (item.progress || 0) + 7));
            const loaded = Math.round((targetFile.size * nextProgress) / 100);
            const speed = elapsedSeconds > 0 ? loaded / elapsedSeconds : 0;
            return { ...item, loaded, progress: nextProgress, speed, elapsedSeconds };
          }));
        }, 260);
      };
      updateUploads((prev) => prev.map((item) => (
        item.localId === row.localId ? { ...item, status: "uploading" } : item
      )));
      startVisibleProgress();

      try {
        let data = null;
        const canUsePreparedUpload = preparedUpload
          && preparedUpload.fileName === targetFile.name
          && Number(preparedUpload.fileSize) === Number(targetFile.size);

        if (canUsePreparedUpload) {
          const prepared = await preparedUpload.promise;
          const draftId = prepared?.draft?.id;
          if (!draftId) {
            throw new Error("Draft upload failed");
          }
          data = await finalizeDraftUpload({
            userUid: normalizedUserUid,
            jobId: draftId,
            settings
          });
          if (draftUploadRef.current?.key === preparedUpload.key) {
            draftUploadRef.current = null;
          }
        } else {
          data = await uploadJobWithProgress({
            file: targetFile,
            userUid: normalizedUserUid,
            settings,
            onProgress: () => {}
          });
        }

        if (data.shopName) updateShopName(data.shopName);
        if (data.shopName || data.assignedOperator) {
          setShopDetails((previous) => ({
            ...(previous || {}),
            shopName: data.shopName || previous?.shopName || "",
            assignedOperator: data.assignedOperator || previous?.assignedOperator || ""
          }));
        }
        const elapsedSeconds = (Date.now() - start) / 1000;
        const finalSpeed = elapsedSeconds > 0 ? targetFile.size / elapsedSeconds : 0;
        updateUploads((prev) => prev.map((item) => (
          item.localId === row.localId
            ? { ...item, progress: 100, loaded: item.total, speed: finalSpeed, elapsedSeconds, status: "done", result: data, error: "" }
            : item
        )));
      } catch (error) {
        const elapsedSeconds = (Date.now() - start) / 1000;
        updateUploads((prev) => prev.map((item) => (
          item.localId === row.localId
            ? { ...item, elapsedSeconds, status: "failed", error: error.message || "Upload failed" }
            : item
        )));
      } finally {
        if (dummyTimer) {
          window.clearInterval(dummyTimer);
        }
      }
    } catch (error) {
      alert(error.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async (localId, jobId) => {
    if (!jobId) return;
    try {
      setVerifyLoadingMap((prev) => ({ ...prev, [localId]: true }));
      const data = await verifyPayment(jobId, normalizedUserUid);
      updateUploads((prev) => prev.map((item) => (
        item.localId === localId && item.result
          ? { ...item, result: { ...item.result, job: data.job } }
          : item
      )));
      alert("Payment verified! Your document is now in the print queue.");
    } catch (error) {
      alert(error.message || "Verification failed");
    } finally {
      setVerifyLoadingMap((prev) => ({ ...prev, [localId]: false }));
    }
  };

  const terminalJobStatuses = new Set(["printed", "rejected", "print_failed"]);
  const completedUploads = uploads.filter((item) => item.result);
  const uploadProgressRows = uploads.filter((item) => {
    const resultStatus = String(item?.result?.job?.status || "").toLowerCase();
    return !resultStatus || !terminalJobStatuses.has(resultStatus);
  });
  const currentUpload = uploadProgressRows[0] || null;
  const olderUploads = uploadProgressRows.slice(1);
  const pendingPaymentUploads = completedUploads.filter((item) => item.result?.job?.status === "payment_pending");
  const activePrintStatusUploads = completedUploads.filter((item) => {
    const status = String(item.result?.job?.status || "").toLowerCase();
    return status && status !== "payment_pending" && !terminalJobStatuses.has(status);
  });
  const historyUploads = completedUploads.filter((item) => {
    const status = String(item.result?.job?.status || "").toLowerCase();
    return terminalJobStatuses.has(status);
  });
  const historyRows = useMemo(
    () => historyUploads
      .map((item) => {
        const job = item?.result?.job || {};
        const totalPages = Number(job.page_count || 1);
        const copies = Math.max(1, Number(job.copies || 1));
        const selectedPagesPerCopy = countSelectedPagesForHistory(job.page_selection, totalPages);
        const expectedPages = Math.max(1, selectedPagesPerCopy * copies);
        const progressPages = Number(jobProgressMap[item.localId]?.printProgress?.pagesPrinted || 0);
        const printedPages = String(job.status || "").toLowerCase() === "printed"
          ? Math.max(progressPages, expectedPages)
          : progressPages;

        return {
          localId: item.localId,
          id: Number(job.id || 0),
          token: formatQueueTokenDisplay(job.queue_token, job.id),
          fileName: item.fileName || job.original_name || "-",
          status: String(job.status || ""),
          colorMode: String(job.color_mode || "bw"),
          copies,
          selectedPagesPerCopy,
          expectedPages,
          printedPages,
          amount: Number(item?.result?.payment?.amount ?? job.total_price ?? 0),
          unitPrice: Number(job.unit_price || 0),
          updatedAt: job.updated_at || null
        };
      })
      .filter((row) => row.id > 0)
      .sort((a, b) => Date.parse(b.updatedAt || 0) - Date.parse(a.updatedAt || 0)),
    [historyUploads, jobProgressMap]
  );
  const historySummary = useMemo(() => historyRows.reduce((acc, row) => {
    acc.totalJobs += 1;
    if (row.status === "printed") {
      acc.printedJobs += 1;
      acc.pagesPrinted += Math.max(0, Number(row.printedPages || 0));
    }
    if (row.colorMode === "color") {
      acc.colorJobs += 1;
    } else {
      acc.bwJobs += 1;
    }
    acc.totalCopies += Math.max(1, Number(row.copies || 1));
    acc.totalAmount += Math.max(0, Number(row.amount || 0));
    return acc;
  }, {
    totalJobs: 0,
    printedJobs: 0,
    pagesPrinted: 0,
    totalCopies: 0,
    bwJobs: 0,
    colorJobs: 0,
    totalAmount: 0
  }), [historyRows]);
  const openJobsCount = uploadProgressRows.length;
  const screenCountMap = {
    upload: 0,
    status: openJobsCount,
    history: historyRows.length
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-paper">
    <main className="mx-auto w-full max-w-5xl flex-1 px-3 pb-28 pt-3 sm:px-4 md:py-10">
      <motion.header
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="rounded-b-3xl border border-ink/10 bg-white p-4 shadow-lg sm:p-5 md:rounded-3xl md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-alert">Print Panda Upload</p>
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="break-words font-display text-3xl font-bold text-ink md:text-5xl">
                {shopDetails?.shopName || shopName || "Print Shop"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-ink/70 md:text-base">
                Upload your document, pay the shown UPI amount, then tap "I Have Paid" so the shop can print it.
              </p>
            </div>
            <div className="rounded-2xl bg-paper/80 p-4 text-sm text-ink/75 md:min-w-64">
              <p className="font-semibold text-ink">Shop details</p>
              <p className="mt-1">Operator: {shopDetails?.assignedOperator || "Assigned at shop"}</p>
              <p>UPI: {shopDetails?.upiId || "Shown after upload"}</p>
              <p>
                B/W Rs {Number(shopDetails?.pricing?.bw ?? 0)} / page
                {" "} | {" "}
                Color Rs {Number(shopDetails?.pricing?.color ?? 0)} / page
              </p>
              {!!shopDetailsError && <p className="mt-2 text-red-600">{shopDetailsError}</p>}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            ["1", "Upload", "Choose one file and select print options."],
            ["2", "Pay", "Use the UPI button or pay to the shown UPI ID."],
            ["3", "Confirm", "Tap I Have Paid and watch your print status."]
          ].map(([number, title, text]) => (
            <div key={number} className="flex gap-3 rounded-2xl border border-ink/10 bg-white/80 p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-alert text-sm font-bold text-white">{number}</span>
              <div>
                <p className="font-semibold text-ink">{title}</p>
                <p className="mt-1 text-sm text-ink/60">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 hidden rounded-2xl border border-ink/10 bg-white p-2 shadow-sm md:grid md:grid-cols-3">
          {CUSTOMER_SCREENS.map((item) => {
            const isActive = activeScreen === item.key;
            const count = screenCountMap[item.key] || 0;
            return (
              <button
                key={`desktop_${item.key}`}
                type="button"
                onClick={() => setActiveScreen(item.key)}
                className={`relative rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? "bg-ink text-paper" : "text-ink/65 hover:bg-paper"}`}
              >
                <span>{item.label}</span>
                {!!count && (
                  <span className={`ml-2 rounded-full px-2 py-0.5 text-[11px] ${isActive ? "bg-paper text-ink" : "bg-alert text-white"}`}>{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </motion.header>

      {activeScreen === "upload" && (
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {!hasValidUserUid ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
            Invalid upload link. Please use the QR code generated for a desktop user.
          </div>
        ) : (
          <UploadForm onSubmit={onUpload} isLoading={loading} onPrepareUpload={prepareBackgroundUpload} />
        )}
      </motion.section>
      )}

      {activeScreen === "status" && (
      <>
      {!openJobsCount && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-ink/15 bg-white p-6 text-center shadow-xl"
        >
          <h2 className="font-display text-2xl font-semibold text-ink">No active jobs yet</h2>
          <p className="mt-2 text-sm text-ink/65">Upload a document first. Your payment and print status will appear here.</p>
          <button
            type="button"
            onClick={() => setActiveScreen("upload")}
            className="mt-4 rounded-xl bg-mint px-4 py-3 text-sm font-semibold text-ink"
          >
            Upload a file
          </button>
        </motion.section>
      )}

      {!!uploadProgressRows.length && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-ink/15 bg-white/80 p-4 shadow-xl sm:p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl font-semibold">Upload Progress</h2>
            {!!olderUploads.length && (
              <button
                type="button"
                onClick={() => setShowOlderUploads((prev) => !prev)}
                className="rounded-lg border border-ink/20 bg-white px-3 py-1.5 text-xs font-semibold text-ink md:hidden"
              >
                {showOlderUploads ? "Hide older" : `Show older (${olderUploads.length})`}
              </button>
            )}
          </div>
          <div className="mt-4 space-y-3 md:hidden">
            {currentUpload && (
              <div key={currentUpload.localId} className="rounded-xl border border-ink/10 bg-paper/70 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-ink">{currentUpload.fileName}</p>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusBadgeClass(currentUpload.status)}`}>
                    {statusBadgeLabel(currentUpload.status)}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/10">
                  <div className="h-full rounded-full bg-mint transition-all" style={{ width: `${currentUpload.progress}%` }} />
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-ink/70 sm:grid-cols-4">
                  <p>{currentUpload.progress}%</p>
                  <p>{Math.round((currentUpload.loaded || 0) / 1024)} KB</p>
                  <p>{formatElapsed(currentUpload.elapsedSeconds)}</p>
                  <p>{formatBytesPerSecond(currentUpload.speed)}</p>
                </div>
                {currentUpload.error && <p className="mt-2 text-xs text-red-600">{currentUpload.error}</p>}
              </div>
            )}

            {showOlderUploads && olderUploads.map((item) => (
              <div key={item.localId} className="rounded-xl border border-ink/10 bg-white p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-medium text-ink">{item.fileName}</p>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusBadgeClass(item.status)}`}>
                    {statusBadgeLabel(item.status)}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10">
                  <div className="h-full rounded-full bg-mint transition-all" style={{ width: `${item.progress}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 hidden space-y-3 md:block">
            {uploadProgressRows.map((item) => (
              <div key={`desktop_${item.localId}`} className="rounded-2xl border border-ink/10 bg-paper/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="max-w-[70%] truncate font-medium text-ink">{item.fileName}</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(item.status)}`}>
                    {statusBadgeLabel(item.status)}
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/10">
                  <div className="h-full rounded-full bg-mint transition-all" style={{ width: `${item.progress}%` }} />
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-ink/70 md:grid-cols-4">
                  <p>Progress: {item.progress}%</p>
                  <p>Uploaded: {Math.round((item.loaded || 0) / 1024)} KB</p>
                  <p>Time: {formatElapsed(item.elapsedSeconds)}</p>
                  <p>Speed: {formatBytesPerSecond(item.speed)}</p>
                </div>
                {item.error && <p className="mt-2 text-sm text-red-600">{item.error}</p>}
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {!!(pendingPaymentUploads.length || activePrintStatusUploads.length) && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-3xl border border-ink/15 bg-white/80 p-4 shadow-xl sm:p-6"
        >
          <h2 className="font-display text-2xl font-semibold">Payment and Print Status</h2>

          {!!pendingPaymentUploads.length && (
            <div className="mt-4 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink/65">Pending Payment Confirmation</h3>
              {pendingPaymentUploads.map((item) => {
                const result = item.result;
                const paymentProvider = String(result?.payment?.provider || "upi");
                const isPayPanda = paymentProvider === "pay_panda";
                const paymentUrl = result?.payment?.checkoutUrl || result?.payment?.upiLink || "#";
                return (
                  <article key={item.localId} className="rounded-2xl border border-ink/10 bg-paper/70 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">{item.fileName}</p>
                        <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusBadgeClass(result.job.status)}`}>{statusBadgeLabel(result.job.status)}</span>
                      </div>
                    </div>
                    <div className="mt-3 rounded-2xl bg-ink px-4 py-4 text-paper">
                      <p className="text-xs uppercase tracking-[0.2em] text-paper/70">Your queue token</p>
                      <p className="mt-1 break-words font-display text-4xl font-bold">{formatQueueTokenDisplay(result.job.queue_token, result.job.id)}</p>
                      <p className="mt-1 text-sm text-paper/80">Keep this token visible until the shop confirms your print.</p>
                    </div>
                    <div className="mt-4 grid gap-3 rounded-2xl border border-ink/10 bg-white p-4 text-sm text-ink/75 md:grid-cols-3">
                      <p><span className="block text-xs text-ink/50">Pages</span>{result.job.page_count}</p>
                      <p><span className="block text-xs text-ink/50">Amount to pay</span>Rs {result.payment.amount}</p>
                      <p className="break-words"><span className="block text-xs text-ink/50">Payment method</span>{isPayPanda ? "Secure online payment" : result.payment.upiId}</p>
                    </div>
                    {isPayPanda && (
                      <div className="mt-3 rounded-2xl border border-mint/40 bg-mint/15 px-4 py-3 text-sm text-ink">
                        This shop uses automatic payment verification. Complete payment on the secure page and you will return here automatically.
                      </div>
                    )}
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <a href={paymentUrl} className="rounded-xl bg-ink px-4 py-3 text-center font-semibold text-paper">
                        {isPayPanda ? "Pay Securely" : "Pay with UPI"}
                      </a>
                      <button
                        onClick={() => onVerify(item.localId, result.job.id)}
                        disabled={Boolean(verifyLoadingMap[item.localId])}
                        className="rounded-xl bg-mint px-4 py-3 font-semibold text-ink disabled:opacity-50"
                      >
                        {verifyLoadingMap[item.localId]
                          ? "Checking payment..."
                          : isPayPanda
                          ? "Check Payment Status"
                          : "I Have Paid"}
                      </button>
                    </div>
                    <JobProgressPanel
                      progressPayload={jobProgressMap[item.localId]}
                      fallbackStatus={result.job.status}
                    />
                  </article>
                );
              })}
            </div>
          )}

          {!!activePrintStatusUploads.length && (
            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink/65">Current Print Jobs</h3>
              {activePrintStatusUploads.map((item) => (
                <article key={item.localId} className="rounded-2xl border border-ink/10 bg-paper/70 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{item.fileName}</p>
                      <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusBadgeClass(item.result.job.status)}`}>{statusBadgeLabel(item.result.job.status)}</span>
                    </div>
                  </div>
                  <div className="mt-3 rounded-2xl bg-ink px-4 py-4 text-paper">
                    <p className="text-xs uppercase tracking-[0.2em] text-paper/70">Queue Token</p>
                    <p className="mt-1 font-display text-3xl font-bold">{formatQueueTokenDisplay(item.result.job.queue_token, item.result.job.id)}</p>
                  </div>
                  <p className="mt-4 text-ink/75">Job #{item.result.job.id} · {item.result.job.page_count} pages · Rs {item.result.payment.amount}</p>
                  <JobProgressPanel
                    progressPayload={jobProgressMap[item.localId]}
                    fallbackStatus={item.result.job.status}
                  />
                </article>
              ))}
            </div>
          )}
        </motion.section>
      )}
      </>
      )}

      {activeScreen === "history" && (
      <>
      {!historyRows.length && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-ink/15 bg-white p-6 text-center shadow-xl"
        >
          <h2 className="font-display text-2xl font-semibold text-ink">No history yet</h2>
          <p className="mt-2 text-sm text-ink/65">Completed and paid uploads saved in this browser will appear here.</p>
          <button
            type="button"
            onClick={() => setActiveScreen("upload")}
            className="mt-4 rounded-xl bg-mint px-4 py-3 text-sm font-semibold text-ink"
          >
            Start upload
          </button>
        </motion.section>
      )}

      {!!historyRows.length && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-ink/15 bg-white/80 p-4 shadow-xl sm:p-6"
        >
          <h2 className="font-display text-2xl font-semibold">Your History</h2>
          <p className="mt-1 text-xs text-ink/60">Saved per user upload link in your browser cache.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-ink/10 bg-white p-3">
              <p className="text-xs text-ink/55">Total Jobs</p>
              <p className="mt-1 text-xl font-bold text-ink">{historySummary.totalJobs}</p>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-white p-3">
              <p className="text-xs text-ink/55">Printed Jobs</p>
              <p className="mt-1 text-xl font-bold text-ink">{historySummary.printedJobs}</p>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-white p-3">
              <p className="text-xs text-ink/55">Pages Printed</p>
              <p className="mt-1 text-xl font-bold text-ink">{historySummary.pagesPrinted}</p>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-white p-3">
              <p className="text-xs text-ink/55">Total Spend</p>
              <p className="mt-1 text-xl font-bold text-ink">Rs {historySummary.totalAmount}</p>
            </div>
          </div>
          <div className="mt-3 text-xs text-ink/65">
            B/W jobs: {historySummary.bwJobs} • Color jobs: {historySummary.colorJobs} • Total copies: {historySummary.totalCopies}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:hidden">
            {historyRows.map((row) => (
              <article key={row.localId} className="rounded-xl border border-ink/10 bg-white p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-xs text-ink/75">{row.token}</p>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusBadgeClass(row.status)}`}>{statusBadgeLabel(row.status)}</span>
                </div>
                <p className="mt-2 truncate text-sm font-semibold text-ink">{row.fileName}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-ink/70">
                  <p>Mode: {row.colorMode.toUpperCase()}</p>
                  <p>Pages: {row.printedPages > 0 ? row.printedPages : row.expectedPages}</p>
                  <p>Copies: {row.copies}</p>
                  <p>Unit: Rs {row.unitPrice}</p>
                </div>
                <p className="mt-2 text-sm font-semibold text-ink">Rs {row.amount}</p>
                <p className="mt-1 text-[11px] text-ink/55">{row.updatedAt ? new Date(row.updatedAt).toLocaleString() : "-"}</p>
                <button
                  type="button"
                  onClick={() => toggleJobExpanded(row.localId)}
                  className="mt-3 w-full rounded-lg border border-ink/20 bg-paper px-3 py-2 text-xs font-semibold text-ink"
                >
                  {isJobExpanded(row.localId) ? "Hide details" : "Show details"}
                </button>
                {isJobExpanded(row.localId) && (
                  <JobProgressPanel
                    progressPayload={jobProgressMap[row.localId]}
                    fallbackStatus={row.status}
                  />
                )}
              </article>
            ))}
          </div>

          <div className="mt-4 hidden overflow-auto md:block">
            <table className="min-w-full text-left text-xs">
              <thead>
                <tr className="border-b border-ink/10 text-ink/60">
                  <th className="px-2 py-2">Token</th>
                  <th className="px-2 py-2">File</th>
                  <th className="px-2 py-2">Mode</th>
                  <th className="px-2 py-2">Pages</th>
                  <th className="px-2 py-2">Copies</th>
                  <th className="px-2 py-2">Unit</th>
                  <th className="px-2 py-2">Amount</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Time</th>
                  <th className="px-2 py-2">Details</th>
                </tr>
              </thead>
              <tbody>
                {historyRows.map((row) => (
                  <React.Fragment key={`desktop_${row.localId}`}>
                    <tr className="border-b border-ink/5">
                      <td className="px-2 py-2 font-mono">{row.token}</td>
                      <td className="px-2 py-2">{row.fileName}</td>
                      <td className="px-2 py-2">{row.colorMode.toUpperCase()}</td>
                      <td className="px-2 py-2">{row.printedPages > 0 ? row.printedPages : row.expectedPages}</td>
                      <td className="px-2 py-2">{row.copies}</td>
                      <td className="px-2 py-2">Rs {row.unitPrice}</td>
                      <td className="px-2 py-2 font-semibold">Rs {row.amount}</td>
                      <td className="px-2 py-2">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusBadgeClass(row.status)}`}>{statusBadgeLabel(row.status)}</span>
                      </td>
                      <td className="px-2 py-2">{row.updatedAt ? new Date(row.updatedAt).toLocaleString() : "-"}</td>
                      <td className="px-2 py-2">
                        <button
                          type="button"
                          onClick={() => toggleJobExpanded(row.localId)}
                          className="rounded-lg border border-ink/20 bg-white px-3 py-1.5 text-xs font-semibold text-ink"
                        >
                          {isJobExpanded(row.localId) ? "Hide" : "Show"}
                        </button>
                      </td>
                    </tr>
                    {isJobExpanded(row.localId) && (
                      <tr className="border-b border-ink/5">
                        <td className="px-2 py-2" colSpan={10}>
                          <JobProgressPanel
                            progressPayload={jobProgressMap[row.localId]}
                            fallbackStatus={row.status}
                          />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      )}
      </>
      )}
    </main>
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 px-3 pb-3 pt-2 shadow-2xl backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
        {CUSTOMER_SCREENS.map((item) => {
          const isActive = activeScreen === item.key;
          const count = screenCountMap[item.key] || 0;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveScreen(item.key)}
              className={`relative flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-xs font-semibold transition ${isActive ? "bg-ink text-paper" : "text-ink/60"}`}
            >
              {!!count && (
                <span className="absolute right-3 top-1 rounded-full bg-alert px-1.5 py-0.5 text-[10px] leading-none text-white">{count}</span>
              )}
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
    <div className="hidden md:block">
    <Footer />
    </div>
    </div>
  );
}
