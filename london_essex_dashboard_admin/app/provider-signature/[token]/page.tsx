"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useParams } from "next/navigation";
import { AlertCircle, CheckCircle2, PenLine, Upload, X } from "lucide-react";

type SignatureScreen = {
  title: string;
  subtitle: string;
  provider: {
    email: string;
    name: string;
  };
  booking: {
    bookingNumber: string;
    courseTitle: string;
    candidateName: string;
  };
  signature: {
    status: string;
    signedAt: string | null;
    signerName: string;
    signerEmail: string;
    signatureType: string;
    fileName: string;
    imageUrl: string;
    previewUrl: string | null;
    downloadUrl: string | null;
    available: boolean;
  };
  actions: {
    submit: {
      apiUrl: string;
    };
  };
};

function getProxyUrl(token: string) {
  return `/api-proxy/bookings/provider-signature/${encodeURIComponent(token)}`;
}

export default function ProviderSignaturePage() {
  const params = useParams<{ token: string }>();
  const token = typeof params.token === "string" ? params.token : "";
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [screen, setScreen] = useState<SignatureScreen | null>(null);
  const [mode, setMode] = useState<"draw" | "upload">("draw");
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadScreen() {
      try {
        const response = await fetch(getProxyUrl(token), { cache: "no-store" });
        const json = await response.json();

        if (!response.ok || !json.success) {
          throw new Error(json.message || "Signature link could not be loaded");
        }

        if (mounted) {
          setScreen(json.data.screen);
        }
      } catch (loadError) {
        if (mounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Signature link could not be loaded",
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    if (token) {
      void loadScreen();
    }

    return () => {
      mounted = false;
    };
  }, [token]);

  function getCanvasPosition(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();

    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function startDrawing(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    const position = getCanvasPosition(event);
    context.lineWidth = 2.5;
    context.lineCap = "round";
    context.strokeStyle = "#24358f";
    context.beginPath();
    context.moveTo(position.x, position.y);
    setIsDrawing(true);
    setHasDrawn(true);
  }

  function draw(event: PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing) {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    const position = getCanvasPosition(event);
    context.lineTo(position.x, position.y);
    context.stroke();
  }

  function clearSignature() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }

    setHasDrawn(false);
  }

  async function handleFileChange(nextFile: File | null) {
    setError("");
    setFile(null);

    if (!nextFile) {
      return;
    }

    if (!nextFile.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    if (nextFile.size > 100 * 1024) {
      setError("Please upload an image smaller than 100KB.");
      return;
    }

    const objectUrl = URL.createObjectURL(nextFile);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);

      if (image.naturalWidth !== image.naturalHeight) {
        setError("Please upload a square signature image.");
        return;
      }

      setFile(nextFile);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setError("The selected image could not be read.");
    };
    image.src = objectUrl;
  }

  async function submitSignature() {
    setError("");
    setStatus("");

    if (!screen) {
      return;
    }

    const formData = new FormData();
    formData.set("signerName", screen.provider.name || screen.booking.candidateName);
    formData.set("signerEmail", screen.provider.email);

    if (mode === "upload") {
      if (!file) {
        setError("Please upload a signature image first.");
        return;
      }

      formData.set("signatureType", "upload");
      formData.set("file", file);
    } else {
      if (!hasDrawn || !canvasRef.current) {
        setError("Please draw your signature first.");
        return;
      }

      formData.set("signatureType", "draw");
      formData.set("signatureData", canvasRef.current.toDataURL("image/png"));
      formData.set("fileName", "training-provider-signature.png");
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(getProxyUrl(token), {
        method: "POST",
        body: formData,
      });
      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.message || "Signature could not be submitted");
      }

      setScreen(json.data.screen);
      setStatus("Signature submitted successfully.");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Signature could not be submitted",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const isSigned = screen?.signature.status === "signed";

  return (
    <main className="min-h-screen bg-[#eef5fb] px-4 py-8 text-[#26398f]">
      <section className="mx-auto w-full max-w-[760px] rounded-[18px] border border-[#d5e5f5] bg-white shadow-[0_24px_60px_rgba(22,43,120,0.12)]">
        <div className="flex items-start justify-between border-b border-[#dbe8f6] px-5 py-4">
          <div>
            <p className="text-sm font-semibold">Training Provider Signature</p>
            <h1 className="mt-2 text-xl font-semibold">
              {screen?.booking.courseTitle || "Loading signature request"}
            </h1>
          </div>
          <X className="h-5 w-5 text-[#6577b8]" />
        </div>

        <div className="p-5">
          {isLoading ? (
            <p className="rounded-xl bg-[#eef7ff] px-4 py-5 text-sm">
              Loading signature request...
            </p>
          ) : null}

          {screen && !isLoading ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#dce9f8] bg-[#f7fbff] px-4 py-3 text-sm">
                <p>
                  <span className="font-semibold">Candidate:</span>{" "}
                  {screen.booking.candidateName}
                </p>
                <p className="mt-1">
                  <span className="font-semibold">Booking:</span>{" "}
                  {screen.booking.bookingNumber}
                </p>
                <p className="mt-1">
                  <span className="font-semibold">Provider email:</span>{" "}
                  {screen.provider.email}
                </p>
              </div>

              {isSigned ? (
                <div className="rounded-xl border border-[#b8ebd2] bg-[#f0fff7] px-4 py-4 text-[#0f8f5d]">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>This request has already been signed.</span>
                  </div>
                  {screen.signature.previewUrl ? (
                    <div className="mt-4 rounded-lg border border-[#b8ebd2] bg-white p-3">
                      <div
                        aria-label="Training provider signature"
                        role="img"
                        className="h-32 w-full bg-contain bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url("${screen.signature.previewUrl}")`,
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#eaf4fb] p-2">
                    <button
                      type="button"
                      onClick={() => setMode("draw")}
                      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg text-sm ${
                        mode === "draw" ? "bg-white shadow-sm" : ""
                      }`}
                    >
                      <PenLine className="h-4 w-4" />
                      Draw
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("upload")}
                      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg text-sm ${
                        mode === "upload" ? "bg-white shadow-sm" : ""
                      }`}
                    >
                      <Upload className="h-4 w-4" />
                      Upload
                    </button>
                  </div>

                  {mode === "draw" ? (
                    <div className="rounded-xl border border-[#dce9f8] bg-white p-3">
                      <canvas
                        ref={canvasRef}
                        width={560}
                        height={180}
                        onPointerDown={startDrawing}
                        onPointerMove={draw}
                        onPointerUp={() => setIsDrawing(false)}
                        onPointerLeave={() => setIsDrawing(false)}
                        className="h-[180px] w-full touch-none rounded-lg border border-dashed border-[#c8d8ef] bg-white"
                      />
                      <button
                        type="button"
                        onClick={clearSignature}
                        className="mt-3 text-sm font-semibold text-[#4b60b8]"
                      >
                        Clear signature
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-[#dce9f8] bg-[#f8fbff] p-4">
                      <p className="text-sm">
                        Please upload a square image smaller than 100KB.
                      </p>
                      <label className="mt-4 inline-flex h-11 cursor-pointer items-center justify-center rounded-lg border border-[#d5e3f7] bg-white px-4 text-sm font-semibold">
                        {file ? "Re-upload" : "Upload"}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={(event) =>
                            void handleFileChange(event.target.files?.[0] || null)
                          }
                          className="sr-only"
                        />
                      </label>
                      {file ? (
                        <span className="ml-3 text-sm text-[#6271a7]">
                          {file.name}
                        </span>
                      ) : null}
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => void submitSignature()}
                    className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#12aee5] text-sm font-semibold text-white shadow-[0_12px_26px_rgba(11,168,221,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Signature"}
                  </button>
                </>
              )}
            </div>
          ) : null}

          {error ? (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#ffd3c8] bg-[#fff4f0] px-4 py-3 text-sm text-[#c24125]">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          ) : null}

          {status ? (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#b8ebd2] bg-[#f0fff7] px-4 py-3 text-sm text-[#0f8f5d]">
              <CheckCircle2 className="h-5 w-5" />
              <span>{status}</span>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
