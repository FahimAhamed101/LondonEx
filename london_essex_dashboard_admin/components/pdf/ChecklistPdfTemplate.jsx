"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CoverPage from "@/components/pdf/CoverPage";
import DeclarationPage from "@/components/pdf/DeclarationPage";
import InfoPage from "@/components/pdf/InfoPage";
import PdfPageWrapper from "@/components/pdf/PdfPageWrapper";
import SectionTable from "@/components/pdf/SectionTable";

const SECTION_PAGE_CAPACITY = 32;
const SECTION_STACK_CAPACITY = 48;
const BACKEND_SECTION_PAGE_CAPACITY = 25;

function estimateRowUnits(item) {
  if (item.kind === "group") {
    return 2.8;
  }

  const length = item.text.length;

  if (length > 170) {
    return 4.8;
  }

  if (length > 125) {
    return 4.1;
  }

  if (length > 90) {
    return 3.4;
  }

  if (length > 60) {
    return 2.8;
  }

  return 2.2;
}

function estimateSectionHeaderUnits(section) {
  let units = 7.5;

  if (section.subtitle) {
    units += 2.8;
  }

  if (section.description) {
    units += 2.6;
  }

  return units;
}

function stripTrailingDuration(title, duration) {
  if (!duration) {
    return title;
  }

  return title.replace(new RegExp(`\\s*\\(${duration.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\)\\s*$`, "i"), "");
}

function buildContinuedTitle(title) {
  return title.includes("continued") ? title : `${title} - continued`;
}

function chunkSection(section) {
  const pages = [];
  let chunkIndex = 0;
  let currentItems = [];
  let currentUnits = estimateSectionHeaderUnits(section);
  const pageCapacity = section.source === "backend"
    ? BACKEND_SECTION_PAGE_CAPACITY
    : SECTION_PAGE_CAPACITY;

  for (const item of section.items) {
    const rowUnits = estimateRowUnits(item);
    const nextUnits = currentUnits + rowUnits;

    if (currentItems.length > 0 && nextUnits > pageCapacity) {
      pages.push({
        ...section,
        id: `${section.id}-chunk-${chunkIndex}`,
        title: chunkIndex === 0 ? section.title : buildContinuedTitle(section.title),
        items: currentItems,
        estimatedUnits: currentUnits,
      });
      chunkIndex += 1;
      currentItems = [];
      currentUnits = estimateSectionHeaderUnits(section);
    }

    currentItems.push(item);
    currentUnits += rowUnits;
  }

  if (currentItems.length > 0) {
    pages.push({
      ...section,
      id: `${section.id}-chunk-${chunkIndex}`,
      title: chunkIndex === 0 ? section.title : buildContinuedTitle(section.title),
      items: currentItems,
      estimatedUnits: currentUnits,
    });
  }

  return pages;
}

function buildSectionRenderPages(sectionPages) {
  const sectionChunks = [];

  for (const page of sectionPages) {
    if (page.sections) {
      sectionChunks.push(...page.sections.flatMap((section) => chunkSection(section)));
      continue;
    }

    sectionChunks.push(...chunkSection(page));
  }

  const renderPages = [];
  let currentSections = [];
  let currentUnits = 0;

  for (const chunk of sectionChunks) {
    if (
      currentSections.length > 0 &&
      currentUnits + chunk.estimatedUnits > SECTION_STACK_CAPACITY
    ) {
      renderPages.push({
        id: `${currentSections[0].id}-stack-${renderPages.length}`,
        sections: currentSections,
      });
      currentSections = [];
      currentUnits = 0;
    }

    currentSections.push(chunk);
    currentUnits += chunk.estimatedUnits;
  }

  if (currentSections.length > 0) {
    renderPages.push({
      id: `${currentSections[0].id}-stack-${renderPages.length}`,
      sections: currentSections,
    });
  }

  return renderPages;
}

function buildDeclarationRenderPages(declarationPages) {
  return declarationPages.map((page) => ({
    id: page.id,
    banner: page.banner ?? null,
    dateField: page.dateField ?? null,
    sections: page.sections ?? [],
    submission: page.submission ?? null,
    privacyNotice: page.privacyNotice ?? null,
  }));
}

function normalizeAnswer(value) {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value.toLowerCase();
  }

  if (typeof value === "object" && typeof value.label === "string") {
    return value.label.toLowerCase();
  }

  if (typeof value === "object" && typeof value.id === "string") {
    return value.id.toLowerCase();
  }

  if (typeof value === "object") {
    const selectedOption = ["limited", "adequate", "extensive", "unsure"].find(
      (option) => value[option] === true,
    );

    if (selectedOption) {
      return selectedOption;
    }
  }

  return null;
}

function normalizeBackendSection(section) {
  return {
    id: section.id,
    source: "backend",
    title: stripTrailingDuration(
      section.title || section.label || "Checklist Section",
      section.duration,
    ),
    duration: section.duration,
    subtitle: section.summary || section.subtitle,
    description: section.description,
    items: (section.items || []).map((item, index) => ({
      id: item.id || `${section.id || "section"}-item-${index + 1}`,
      number: item.no || item.number || index + 1,
      text: item.criterion || item.text || "",
      knowledge: normalizeAnswer(item.knowledge),
      experience: normalizeAnswer(item.experience),
    })),
  };
}

function buildSectionPagesFromBackend(data) {
  const sections = data?.checklistSections || data?.sections || [];

  if (!Array.isArray(sections) || sections.length === 0) {
    return null;
  }

  return sections.map(normalizeBackendSection);
}

export default function ChecklistPdfTemplate({
  templateId = "am2-checklist",
  documentMeta: initialDocumentMeta,
  cover: initialCover,
  candidate: initialCandidate,
  infoPage: initialInfoPage,
  sectionPages: initialSectionPages,
  declarationPages: initialDeclarationPages,
  initialFileName,
  autoDownload = false,
  hideToolbar = false,
  data = null,
}) {
  // Merge data from backend if available
  const { documentMeta, cover, candidate, infoPage, sectionPages, declarationPages } = useMemo(() => {
    if (!data) {
      return {
        documentMeta: initialDocumentMeta,
        cover: initialCover,
        candidate: initialCandidate,
        infoPage: initialInfoPage,
        sectionPages: initialSectionPages,
        declarationPages: initialDeclarationPages,
      };
    }

    const mergedDocumentMeta = {
      ...initialDocumentMeta,
      title: data?.checklistSummary?.title || initialDocumentMeta.title,
    };

    const mergedCover = {
      ...initialCover,
      examQualification: data?.course?.qualification || initialCover.examQualification,
    };

    const mergedCandidate = {
      ...initialCandidate,
      name: data?.candidate?.name || initialCandidate.name,
      niNumber: data?.candidate?.niNumber || initialCandidate.niNumber,
      uln: data?.candidate?.uln || initialCandidate.uln,
    };

    const mergedSectionPages =
      buildSectionPagesFromBackend(data) || initialSectionPages;


    const mergedDeclarationPages = initialDeclarationPages.map(page => {
      // Merge signatures if available in data.signatures
      if (!data?.signatures) return page;

      return {
        ...page,
        sections: page.sections.map(section => {
          if (!section.signatureFields) return section;
          
          return {
            ...section,
            signatureValues: {
              "Candidate Signature": data.signatures.candidate?.url || data.signatures.candidateSignature,
              "Training Provider Signature": data.signatures.trainingProvider?.url || data.signatures.trainingProviderSignature,
              "Employer Signature": data.signatures.employer?.url || data.signatures.employerSignature,
            }
          };
        })
      };
    });

    return {
      documentMeta: mergedDocumentMeta,
      cover: mergedCover,
      candidate: mergedCandidate,
      infoPage: initialInfoPage,
      sectionPages: mergedSectionPages,
      declarationPages: mergedDeclarationPages,
    };
  }, [data, initialDocumentMeta, initialCover, initialCandidate, initialInfoPage, initialSectionPages, initialDeclarationPages]);

  const autoDownloadStartedRef = useRef(false);

  const sectionRenderPages = useMemo(
    () => buildSectionRenderPages(sectionPages),
    [sectionPages],
  );
  const declarationRenderPages = useMemo(
    () => buildDeclarationRenderPages(declarationPages),
    [declarationPages],
  );
  const defaultFileName = useMemo(() => {
    const parts = [documentMeta.title, candidate.name]
      .join(" ")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return `${parts || "am2-checklist"}.pdf`;
  }, [candidate.name, documentMeta.title]);

  const [downloadFileName, setDownloadFileName] = useState(
    initialFileName || defaultFileName,
  );
  const [isExporting, setIsExporting] = useState(false);

  const triggerDownload = useCallback(() => {
    const rawFileName = downloadFileName.trim() || defaultFileName;
    const finalFileName = rawFileName.endsWith(".pdf")
      ? rawFileName
      : `${rawFileName}.pdf`;
    const url = `/api/pdf/am2?template=${encodeURIComponent(templateId)}&fileName=${encodeURIComponent(finalFileName)}`;

    const link = document.createElement("a");
    link.href = url;
    link.download = finalFileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, [defaultFileName, downloadFileName, templateId]);

  const handleDownloadPdf = useCallback(() => {
    if (isExporting) {
      return;
    }

    setIsExporting(true);
    triggerDownload();
    window.setTimeout(() => {
      setIsExporting(false);
    }, 1200);
  }, [isExporting, triggerDownload]);

  useEffect(() => {
    if (!autoDownload || autoDownloadStartedRef.current) {
      return;
    }

    autoDownloadStartedRef.current = true;

    const timer = window.setTimeout(() => {
      handleDownloadPdf();
    }, 250);

    return () => window.clearTimeout(timer);
  }, [autoDownload, handleDownloadPdf]);

  return (
    <main className="am2-pdf">
      {!hideToolbar ? (
        <div className="am2-pdf__screen-toolbar">
          <div>
            <p className="am2-pdf__screen-label">
              {documentMeta.previewLabel || `${documentMeta.title} Preview`}
            </p>
            <p className="am2-pdf__screen-hint">
              Export creates a direct PDF download from the HTML layout.
            </p>
          </div>

          <div className="am2-pdf__download-tools">
            <label className="am2-pdf__download-field">
              <span>Download PDF</span>
              <input
                type="text"
                value={downloadFileName}
                onChange={(event) => setDownloadFileName(event.target.value)}
                placeholder="am2-checklist.pdf"
              />
            </label>

            <button
              type="button"
              className="am2-pdf__download-button"
              onClick={handleDownloadPdf}
              disabled={isExporting}
            >
              {isExporting ? "Generating..." : "Export PDF"}
            </button>
          </div>
        </div>
      ) : null}

      <div className="am2-pdf__document">
        <CoverPage
          documentMeta={documentMeta}
          cover={cover}
          candidate={candidate}
        />

        <InfoPage documentMeta={documentMeta} infoPage={infoPage} />

        {sectionRenderPages.map((sectionPage, index) => (
          <PdfPageWrapper
            key={sectionPage.id}
            pageNumber={index + 3}
            footerCode={documentMeta.footerCode}
            footerDate={documentMeta.footerDate}
          >
            <div className="am2-pdf__section-stack">
              {sectionPage.sections.map((section) => (
                <SectionTable key={section.id} section={section} />
              ))}
            </div>
          </PdfPageWrapper>
        ))}

        {declarationRenderPages.map((page, index) => (
          <DeclarationPage
            key={page.id}
            page={page}
            pageNumber={sectionRenderPages.length + index + 3}
            footerCode={documentMeta.footerCode}
            footerDate={documentMeta.footerDate}
          />
        ))}
      </div>
    </main>
  );
}
