"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, FileDown } from "lucide-react";
import { DashboardSectionCard } from "@/components/dashboard/dashboard-section-card";
import { quickActions } from "@/features/dashboard/data";

const quickActionLinks: Record<string, string> = {
  "Manage Courses": "/dashboard/courses",
  "View Bookings": "/dashboard/bookings",
};

const pdfTemplates = [
  {
    id: "am2-checklist",
    label: "AM2 Checklist",
    defaultFileName: "am2-checklist-preview.pdf",
  },
  {
    id: "am2e-v1-checklist",
    label: "AM2E V1 Checklist",
    defaultFileName: "am2e-v1-checklist-preview.pdf",
  },
  {
    id: "net-registration-form",
    label: "NET Registration Form",
    defaultFileName: "net-registration-form-preview.pdf",
  },
  {
    id: "net-am2e-full-candidate-checklist",
    label: "NET AM2E Full Candidate Checklist",
    defaultFileName: "net-am2e-full-candidate-checklist-preview.pdf",
  },
] as const;

export function DashboardActionPanel() {
  const [pdfFileNames, setPdfFileNames] = useState<Record<string, string>>(() =>
    pdfTemplates.reduce<Record<string, string>>((accumulator, template) => {
      accumulator[template.id] = template.defaultFileName;
      return accumulator;
    }, {}),
  );

  const updateFileName = (templateId: string, value: string) => {
    setPdfFileNames((current) => ({
      ...current,
      [templateId]: value,
    }));
  };

  const handleOpenPdfExport = (templateId: string) => {
    const rawFileName = pdfFileNames[templateId]?.trim() || "checklist-preview.pdf";
    const fileName = rawFileName.endsWith(".pdf") ? rawFileName : `${rawFileName}.pdf`;
    const url = `/api/pdf/am2?template=${encodeURIComponent(templateId)}&fileName=${encodeURIComponent(fileName)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <DashboardSectionCard title="Quick Actions">
      <div className="space-y-4">
        <div className="rounded-2xl border border-[#e8eef8] bg-white px-4 py-2">
          {quickActions.map((item, index) => (
            <div
              key={item.label}
              className={`flex items-center justify-between py-5 ${
                index < quickActions.length - 1 ? "border-b border-[#edf2fa]" : ""
              }`}
            >
              {quickActionLinks[item.label] ? (
                <Link
                  href={quickActionLinks[item.label]}
                  className="flex w-full items-center justify-between gap-4 text-[#3242a4]"
                >
                  <p className="text-[14px]">{item.label}</p>
                  <ChevronRight className="h-5 w-5 shrink-0 text-[#3948ac]" />
                </Link>
              ) : item.badge ? (
                <>
                  <p className="text-[14px] text-[#3242a4]">{item.label}</p>
                  <span className="rounded-xl border border-[#d7e5f7] bg-[#eef5ff] px-3 py-1.5 text-[13px] text-[#6273a4]">
                    {item.badge}
                  </span>
                </>
              ) : (
                <>
                  <p className="text-[14px] text-[#3242a4]">{item.label}</p>
                  <ChevronRight className="h-5 w-5 text-[#3948ac]" />
                </>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-[#e8eef8] bg-white px-4 py-4">
          <div className="mb-3">
            <h3 className="text-[14px] font-medium text-[#3242a4]">PDF Exports</h3>
            <p className="mt-1 text-[12px] leading-5 text-[#7a86a4]">
              PDF নাম লিখে click করলেই direct PDF download শুরু হবে।
            </p>
          </div>

          <div className="space-y-3">
            {pdfTemplates.map((template) => (
              <div
                key={template.id}
                className="rounded-[16px] border border-[#edf2fa] bg-[#fcfeff] p-3"
              >
                <label className="mb-2 block text-[13px] font-medium text-[#3242a4]">
                  {template.label}
                </label>

                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={pdfFileNames[template.id]}
                    onChange={(event) => updateFileName(template.id, event.target.value)}
                    placeholder="download pdf name"
                    className="h-10 rounded-[12px] border border-[#d6e6f2] bg-white px-3 text-[13px] text-[#33469c] outline-none transition placeholder:text-[#9da8b8] focus:border-[#0ba8dd]"
                  />

                  <button
                    type="button"
                    onClick={() => handleOpenPdfExport(template.id)}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(90deg,#48cfff_0%,#0ba8dd_100%)] px-4 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(11,168,221,0.2)]"
                  >
                    <FileDown className="h-4 w-4" />
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardSectionCard>
  );
}
