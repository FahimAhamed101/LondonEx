"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Eye,
  MapPin,
  Pencil,
  Plus,
  Search,
  X,
} from "lucide-react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  useCreateAdminCourseMutation,
  useGetAdminCoursesQuery,
  useGetCourseSourceOptionsQuery,
  useLazyGetAdminCourseByIdQuery,
  useUpdateAdminCourseMutation,
} from "@/features/dashboard/dashboard.api";
import type { AdminCourse } from "@/types/dashboard";

type CourseFormState = {
  courseName: string;
  description: string;
  from: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  totalSeats: string;
  price: string;
};

const initialFormState: CourseFormState = {
  courseName: "",
  description: "",
  from: "",
  date: "",
  time: "",
  duration: "",
  location: "",
  totalSeats: "",
  price: "",
};

function getCourseStatusLabel(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getApiErrorMessage(error: unknown) {
  const fallbackMessage = "We could not save this course right now.";

  if (!error || typeof error !== "object") {
    return fallbackMessage;
  }

  const apiError = error as FetchBaseQueryError & {
    data?: { message?: string };
  };

  if (typeof apiError.data?.message === "string") {
    return apiError.data.message;
  }

  if ("error" in apiError && typeof apiError.error === "string") {
    return apiError.error;
  }

  return fallbackMessage;
}

function toTimeInputValue(value: string) {
  if (!value) {
    return "";
  }

  const [timePart, meridiemPart] = value.trim().split(" ");

  if (!timePart || !meridiemPart) {
    return "";
  }

  const [rawHours, minutes] = timePart.split(":");

  if (!rawHours || !minutes) {
    return "";
  }

  let hours = Number(rawHours);

  if (Number.isNaN(hours)) {
    return "";
  }

  const meridiem = meridiemPart.toUpperCase();

  if (meridiem === "PM" && hours < 12) {
    hours += 12;
  }

  if (meridiem === "AM" && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, "0")}:${minutes}`;
}

function formatCourseToForm(course: AdminCourse, sourceFallback = ""): CourseFormState {
  return {
    courseName: course.title,
    description:
      course.description || course.shortDescription || course.overview || "",
    from: course.source.name || sourceFallback,
    date: course.adminMeta?.sessionDate || course.schedule.date || "",
    time: course.adminMeta?.timeSlot || toTimeInputValue(course.schedule.time),
    duration: course.duration || course.schedule.duration || "",
    location: course.location || course.audience || "",
    totalSeats: String(
      course.adminMeta?.totalSeats ?? course.capacity.totalSeats ?? "",
    ),
    price: String(course.pricing.amount ?? course.price ?? ""),
  };
}

export function CoursesManagementView() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Create New Course");
  const [form, setForm] = useState<CourseFormState>(initialFormState);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const { data, isLoading, isError } = useGetAdminCoursesQuery({
    page: 1,
    limit: 10,
  });
  const { data: sourceOptionsData } = useGetCourseSourceOptionsQuery();
  const sourceOptions = sourceOptionsData?.data.options ?? [];
  const selectedSourceOption =
    sourceOptions.find((option) => option.title === form.from) ?? null;
  const [
    fetchAdminCourseById,
    {
      isFetching: isFetchingSelectedCourseDetail,
      isError: isSelectedCourseDetailError,
    },
  ] = useLazyGetAdminCourseByIdQuery();
  const [createAdminCourse, { isLoading: isCreatingCourse }] =
    useCreateAdminCourseMutation();
  const [updateAdminCourse, { isLoading: isUpdatingCourse }] =
    useUpdateAdminCourseMutation();

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();
    const courses = data?.data.courses ?? [];

    if (!query) {
      return courses;
    }

    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(query) ||
        course.schedule.label.toLowerCase().includes(query) ||
        course.schedule.displayDate.toLowerCase().includes(query) ||
        course.duration.toLowerCase().includes(query) ||
        course.shortDescription.toLowerCase().includes(query) ||
        course.audience.toLowerCase().includes(query),
    );
  }, [data?.data.courses, search]);

  const openCreateModal = () => {
    setSelectedCourseId(null);
    setFormError(null);
    setModalTitle("Create New Course");
    setForm({
      ...initialFormState,
      from: sourceOptions[0]?.title ?? "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = async (course: AdminCourse) => {
    setSelectedCourseId(course.id);
    setFormError(null);
    setModalTitle("Edit Course");
    setForm(formatCourseToForm(course, sourceOptions[0]?.title ?? ""));
    setIsModalOpen(true);

    try {
      const response = await fetchAdminCourseById(course.id).unwrap();
      setForm(
        formatCourseToForm(response.data.course, sourceOptions[0]?.title ?? ""),
      );
    } catch {
      setFormError("We could not load the latest course details.");
    }
  };

  const openViewModal = async (course: AdminCourse) => {
    setSelectedCourseId(course.id);
    setFormError(null);
    setModalTitle("Course Overview");
    setForm(formatCourseToForm(course, sourceOptions[0]?.title ?? ""));
    setIsModalOpen(true);

    try {
      const response = await fetchAdminCourseById(course.id).unwrap();
      setForm(
        formatCourseToForm(response.data.course, sourceOptions[0]?.title ?? ""),
      );
    } catch {
      setFormError("We could not load the latest course details.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourseId(null);
    setFormError(null);
  };

  const updateField = (field: keyof CourseFormState, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setFormError(null);

    if (
      !form.courseName.trim() ||
      !form.description.trim() ||
      !form.duration.trim() ||
      !form.location.trim() ||
      !form.totalSeats.trim() ||
      !form.price.trim()
    ) {
      setFormError("Please complete all required course fields.");
      return;
    }

    const parsedPrice = Number(form.price);
    const parsedSeats = Number(form.totalSeats);

    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError("Please enter a valid course price.");
      return;
    }

    if (Number.isNaN(parsedSeats) || parsedSeats <= 0) {
      setFormError("Please enter a valid total seat count.");
      return;
    }

    const payload = {
      title: form.courseName.trim(),
      shortDescription: form.description.trim(),
      description: form.description.trim(),
      duration: form.duration.trim(),
      location: form.location.trim(),
      price: parsedPrice,
      totalSeats: parsedSeats,
      sourceCourseId: selectedSourceOption?.id ?? null,
      sessionDate: form.date || undefined,
      timeSlot: form.time || undefined,
    };

    try {
      if (selectedCourseId) {
        await updateAdminCourse({
          courseId: selectedCourseId,
          body: payload,
        }).unwrap();
      } else {
        await createAdminCourse(payload).unwrap();
      }

      closeModal();
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    }
  };

  const isReadOnlyView = modalTitle === "Course Overview";
  const isSubmitting = isCreatingCourse || isUpdatingCourse;
  const isLoadingSelectedCourse = isFetchingSelectedCourseDetail;
  const hasSelectedCourseError = isSelectedCourseDetailError;

  return (
    <>
      <div className="space-y-5">
        <section className="rounded-[18px] border border-[#dbe7f8] bg-[#fbfdff] p-4 shadow-[0_12px_32px_rgba(22,43,120,0.04)] sm:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-[30px] font-semibold tracking-[-0.02em] text-[#26346f]">
                Course Management
              </h1>
              <p className="mt-2 text-[14px] font-medium text-[#6e7d9b]">
                Create, edit, and manage assessment dates and courses.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-[12px] bg-[linear-gradient(90deg,#48cfff_0%,#0ba8dd_100%)] px-5 text-[14px] font-semibold text-white shadow-[0_12px_24px_rgba(11,168,221,0.24)]"
            >
              <Plus className="h-4 w-4" />
              Add New Course
            </button>
          </div>

          <div className="mt-5 rounded-[16px] border border-[#d8e6f7] bg-[#fcfeff] p-3 sm:p-4">
            <div className="flex flex-col gap-3 border-b border-[#e7eef8] pb-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[15px] font-medium text-[#25356f]">
                Courses
              </h2>

              <label className="relative block w-full sm:max-w-[300px]">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7d8eb7]" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search..."
                  className="h-12 w-full rounded-[12px] border border-[#e1ebf8] bg-[#eff6ff] pl-12 pr-4 text-[14px] font-medium text-[#50608f] outline-none transition placeholder:text-[#8e9ebf] focus:border-[#9acff2]"
                />
              </label>
            </div>

            {isError ? (
              <div className="mt-4 rounded-[14px] border border-[#ffd7db] bg-[#fff2f4] px-4 py-3 text-sm text-[#c5394f]">
                We could not load courses right now. Please try again.
              </div>
            ) : null}

            {isLoading ? (
              <div className="mt-4 rounded-[14px] border border-[#d4e4fb] bg-[#fbfdff] px-4 py-10 text-center text-sm text-[#6f778b]">
                Loading courses...
              </div>
            ) : null}

            {!isLoading && !isError ? (
              <div className="mt-3 overflow-hidden rounded-[16px] border border-[#dfe9f8]">
                <div className="overflow-x-auto">
                  <div className="min-w-[980px]">
                    <div className="grid grid-cols-[1.55fr_1.15fr_1.15fr_0.62fr] gap-3 border-b border-[#d8e2f1] bg-[#eaf3fd] px-4 py-4 text-[13px] font-semibold text-[#49587f]">
                      <div className="border-l border-[#cfdaeb] pl-3">
                        Course name
                      </div>
                      <div className="border-l border-[#cfdaeb] pl-3">
                        Schedule
                      </div>
                      <div className="border-l border-[#cfdaeb] pl-3">
                        Audience
                      </div>
                      <div className="border-l border-[#cfdaeb] pl-3 text-center">
                        Actions
                      </div>
                    </div>

                    {filteredCourses.map((course) => (
                      <div
                        key={course.id}
                        className="grid grid-cols-[1.55fr_1.15fr_1.15fr_0.62fr] gap-3 border-t border-dashed border-[#d8e3f3] px-4 py-4"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[16px] font-medium leading-[1.3] text-[#26323d]">
                            {course.title}
                          </p>
                          <p className="mt-1 text-[13px] font-medium text-[#7b879f]">
                            {course.pricing.displayPrice}
                          </p>
                          <p className="mt-1 text-[12px] text-[#8d99b5]">
                            {getCourseStatusLabel(course.status)}
                          </p>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-start gap-3">
                            <CalendarDays className="mt-0.5 h-5 w-5 text-[#6170a8]" />
                            <div>
                              <p className="text-[16px] font-medium leading-[1.2] text-[#3345a5]">
                                {course.schedule.displayDate}
                              </p>
                              <p className="mt-1 text-[13px] font-medium text-[#6f7d98]">
                                {course.schedule.time}
                              </p>
                              <p className="mt-1 text-[12px] text-[#8d99b5]">
                                {course.schedule.duration}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-start gap-3">
                            <MapPin className="mt-0.5 h-5 w-5 text-[#6170a8]" />
                            <p className="line-clamp-2 pt-0.5 text-[16px] font-medium leading-[1.2] text-[#3345a5]">
                              {course.audience || course.location || "Not specified"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-4 text-[#3345a5]">
                          <button
                            type="button"
                            onClick={() => openEditModal(course)}
                            className="grid h-9 w-9 place-items-center rounded-full border border-[#d6e2f5] transition hover:bg-[#f5f9ff]"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openViewModal(course)}
                            className="grid h-9 w-9 place-items-center rounded-full border border-[#d6e2f5] transition hover:bg-[#f5f9ff]"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {filteredCourses.length === 0 ? (
                      <div className="px-4 py-10 text-center text-sm text-[#7b88a5]">
                        No courses found for this search.
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f2434]/55 p-4">
          <div className="w-full max-w-[500px] rounded-[18px] border border-[#d8e4f6] bg-[#fbfdff] p-4 shadow-[0_24px_60px_rgba(18,33,77,0.22)] sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-[18px] font-semibold text-[#33469c]">
                {modalTitle}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="grid h-8 w-8 place-items-center rounded-full text-[#6676b5] transition hover:bg-[#f4f8ff]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 rounded-[16px] border border-[#e0e9f6] bg-[#fcfeff] p-4">
              {selectedCourseId && isLoadingSelectedCourse ? (
                <div className="mb-4 rounded-[12px] border border-[#d4e4fb] bg-[#fbfdff] px-4 py-3 text-sm text-[#6f778b]">
                  Loading course details...
                </div>
              ) : null}

              {selectedCourseId && hasSelectedCourseError ? (
                <div className="mb-4 rounded-[12px] border border-[#ffd7db] bg-[#fff2f4] px-4 py-3 text-sm text-[#c5394f]">
                  We could not load the latest course details.
                </div>
              ) : null}

              {formError ? (
                <div className="mb-4 rounded-[12px] border border-[#ffd7db] bg-[#fff2f4] px-4 py-3 text-sm text-[#c5394f]">
                  {formError}
                </div>
              ) : null}

              <div className="space-y-4">
                <div>
                  <label className="text-[12px] font-medium text-[#5e6ea9]">
                    Course Name *
                  </label>
                  <input
                    value={form.courseName}
                    readOnly={isReadOnlyView}
                    onChange={(event) =>
                      updateField("courseName", event.target.value)
                    }
                    placeholder="e.g. AM2 Assessment Preparation"
                    className="mt-2 h-11 w-full rounded-[10px] border border-[#e2ebf8] bg-[#f4f9ff] px-4 text-[13px] text-[#4453a3] outline-none read-only:cursor-default"
                  />
                </div>

                <div>
                  <label className="text-[12px] font-medium text-[#5e6ea9]">
                    Description *
                  </label>
                  <textarea
                    value={form.description}
                    readOnly={isReadOnlyView}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    placeholder="Detailed course description..."
                    className="mt-2 h-[76px] w-full resize-none rounded-[10px] border border-[#e2ebf8] bg-[#f4f9ff] px-4 py-3 text-[13px] text-[#4453a3] outline-none read-only:cursor-default"
                  />
                </div>

                <div>
                  <label className="text-[12px] font-medium text-[#5e6ea9]">
                    From
                  </label>
                  <select
                    value={form.from}
                    disabled={isReadOnlyView}
                    onChange={(event) => updateField("from", event.target.value)}
                    className="mt-2 h-11 w-full rounded-[10px] border border-[#e2ebf8] bg-[#f4f9ff] px-4 text-[13px] text-[#4453a3] outline-none disabled:cursor-default"
                  >
                    <option value="">No source course</option>
                    {sourceOptions.map((option) => (
                      <option key={option.id} value={option.title}>
                        {option.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[12px] font-medium text-[#5e6ea9]">
                      Date
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      readOnly={isReadOnlyView}
                      onChange={(event) => updateField("date", event.target.value)}
                      className="mt-2 h-11 w-full rounded-[10px] border border-[#e2ebf8] bg-[#f4f9ff] px-4 text-[13px] text-[#4453a3] outline-none read-only:cursor-default"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#5e6ea9]">
                      Time
                    </label>
                    <input
                      type={isReadOnlyView ? "text" : "time"}
                      value={form.time}
                      readOnly={isReadOnlyView}
                      onChange={(event) => updateField("time", event.target.value)}
                      className="mt-2 h-11 w-full rounded-[10px] border border-[#e2ebf8] bg-[#f4f9ff] px-4 text-[13px] text-[#4453a3] outline-none read-only:cursor-default"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[12px] font-medium text-[#5e6ea9]">
                      Duration *
                    </label>
                    <input
                      value={form.duration}
                      readOnly={isReadOnlyView}
                      onChange={(event) =>
                        updateField("duration", event.target.value)
                      }
                      placeholder="e.g. 5 days"
                      className="mt-2 h-11 w-full rounded-[10px] border border-[#e2ebf8] bg-[#f4f9ff] px-4 text-[13px] text-[#4453a3] outline-none read-only:cursor-default"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#5e6ea9]">
                      Location *
                    </label>
                    <input
                      value={form.location}
                      readOnly={isReadOnlyView}
                      onChange={(event) =>
                        updateField("location", event.target.value)
                      }
                      placeholder="e.g. London Training Centre"
                      className="mt-2 h-11 w-full rounded-[10px] border border-[#e2ebf8] bg-[#f4f9ff] px-4 text-[13px] text-[#4453a3] outline-none read-only:cursor-default"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[12px] font-medium text-[#5e6ea9]">
                      Total Seats *
                    </label>
                    <input
                      value={form.totalSeats}
                      readOnly={isReadOnlyView}
                      onChange={(event) =>
                        updateField("totalSeats", event.target.value)
                      }
                      className="mt-2 h-11 w-full rounded-[10px] border border-[#e2ebf8] bg-[#f4f9ff] px-4 text-[13px] text-[#4453a3] outline-none read-only:cursor-default"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#5e6ea9]">
                      Price (£) *
                    </label>
                    <input
                      value={form.price}
                      readOnly={isReadOnlyView}
                      onChange={(event) =>
                        updateField("price", event.target.value)
                      }
                      className="mt-2 h-11 w-full rounded-[10px] border border-[#e2ebf8] bg-[#f4f9ff] px-4 text-[13px] text-[#4453a3] outline-none read-only:cursor-default"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-10 items-center justify-center rounded-[10px] border border-[#e0e9f6] bg-white px-5 text-[13px] font-semibold text-[#2f3440]"
                >
                  {isReadOnlyView ? "Close" : "Cancel"}
                </button>
                {!isReadOnlyView ? (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="inline-flex h-10 items-center justify-center rounded-[10px] bg-[linear-gradient(90deg,#48cfff_0%,#0ba8dd_100%)] px-5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting
                      ? selectedCourseId
                        ? "Saving..."
                        : "Creating..."
                      : selectedCourseId
                        ? "Save Changes"
                        : "Add New Course"}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
