"use client";

import { useDeferredValue, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  Filter,
  MapPinned,
  Search,
  Send,
} from "lucide-react";

type SupportStatus = "New" | "In Progress" | "Resolved";
type SupportPriority = "High" | "Medium" | "Low";
type SupportFilter = "All" | SupportStatus;

type SupportMessage = {
  id: string;
  author: string;
  authorInitial: string;
  dateTime: string;
  body: string;
  tone: "user" | "staff" | "system";
};

type SupportTicket = {
  id: string;
  title: string;
  priority: SupportPriority;
  status: SupportStatus;
  category: string;
  submittedAt: string;
  messages: SupportMessage[];
};

const initialTickets: SupportTicket[] = [
  {
    id: "T-001",
    title: "Auto-Approve Bookings",
    priority: "High",
    status: "New",
    category: "Category",
    submittedAt: "15 May 2020 8:00 pm",
    messages: [],
  },
  {
    id: "T-001A",
    title: "Auto-Approve Bookings",
    priority: "High",
    status: "In Progress",
    category: "Category",
    submittedAt: "15 May 2020 8:00 pm",
    messages: [
      {
        id: "m-1",
        author: "Deja Brady",
        authorInitial: "D",
        dateTime: "15 May 2020 8:00 pm",
        body:
          "I filled in Section 2 of the AM2 checklist yesterday but when I logged in today it was all blank again. I have tried on Chrome and Firefox.",
        tone: "user",
      },
      {
        id: "m-2",
        author: "James Wilson",
        authorInitial: "J",
        dateTime: "15 May 2020 8:10 pm",
        body:
          "Hi James, we are looking into this. Could you try clearing your browser cache and trying again?",
        tone: "staff",
      },
    ],
  },
  {
    id: "T-001B",
    title: "Auto-Approve Bookings",
    priority: "High",
    status: "Resolved",
    category: "Category",
    submittedAt: "15 May 2020 8:00 pm",
    messages: [
      {
        id: "m-3",
        author: "Deja Brady",
        authorInitial: "D",
        dateTime: "15 May 2020 8:00 pm",
        body:
          "I filled in Section 2 of the AM2 checklist yesterday but when I logged in today it was all blank again. I have tried on Chrome and Firefox.",
        tone: "user",
      },
      {
        id: "m-4",
        author: "James Wilson",
        authorInitial: "J",
        dateTime: "15 May 2020 8:10 pm",
        body:
          "Hi James, we are looking into this. Could you try clearing your browser cache and trying again?",
        tone: "staff",
      },
      {
        id: "m-5",
        author: "System",
        authorInitial: "!",
        dateTime: "15 May 2020 8:12 pm",
        body: "This ticket has been resolved",
        tone: "system",
      },
    ],
  },
];

const statusBadgeClasses: Record<SupportStatus, string> = {
  New: "bg-[#bfe9ff] text-[#209bd6]",
  "In Progress": "bg-[#ffe7ad] text-[#d89500]",
  Resolved: "bg-[#b8f0c6] text-[#1f9b50]",
};

const priorityBadgeClasses: Record<SupportPriority, string> = {
  High: "bg-[#ffd9d7] text-[#ff5e5e]",
  Medium: "bg-[#fff0c5] text-[#cf9200]",
  Low: "bg-[#def7e7] text-[#1c9860]",
};

function MessageBubble({ message }: { message: SupportMessage }) {
  if (message.tone === "system") {
    return (
      <div className="flex items-center justify-between gap-3 rounded-[12px] border border-[#cfeecf] bg-[#dff8df] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-5 w-5 place-items-center rounded-full bg-white text-[#56b774]">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
          <p className="text-[12px] font-medium text-[#2e9b55]">{message.body}</p>
        </div>
      </div>
    );
  }

  const isStaff = message.tone === "staff";

  return (
    <div
      className={`rounded-[12px] border px-3 py-3 ${
        isStaff
          ? "border-[#d3e6f9] bg-[#eaf5ff]"
          : "border-[#dde7f8] bg-white"
      }`}
    >
      <div className="flex items-center gap-3 text-[#6b7aa5]">
        <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#11aada] text-[11px] font-semibold text-white">
          {message.authorInitial}
        </div>
        <p className="text-[12px] font-medium text-[#3a4ca4]">{message.author}</p>
        <p className="text-[11px]">{message.dateTime}</p>
      </div>
      <p className="mt-3 text-[12px] leading-6 text-[#69779d]">{message.body}</p>
    </div>
  );
}

export function SupportTicketsView() {
  const [tickets, setTickets] = useState(initialTickets);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<SupportFilter>("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [expandedTicketIds, setExpandedTicketIds] = useState<string[]>([
    "T-001A",
    "T-001B",
  ]);
  const [draftReplies, setDraftReplies] = useState<Record<string, string>>({});
  const deferredSearch = useDeferredValue(search);

  const query = deferredSearch.trim().toLowerCase();
  const filteredTickets = tickets.filter((ticket) => {
    const matchesFilter =
      selectedFilter === "All" || ticket.status === selectedFilter;
    const matchesSearch =
      query.length === 0 ||
      ticket.id.toLowerCase().includes(query) ||
      ticket.title.toLowerCase().includes(query) ||
      ticket.category.toLowerCase().includes(query) ||
      ticket.messages.some(
        (message) =>
          message.author.toLowerCase().includes(query) ||
          message.body.toLowerCase().includes(query),
      );

    return matchesFilter && matchesSearch;
  });

  const toggleExpanded = (ticketId: string) => {
    setExpandedTicketIds((current) =>
      current.includes(ticketId)
        ? current.filter((id) => id !== ticketId)
        : [...current, ticketId],
    );
  };

  const setDraftReply = (ticketId: string, value: string) => {
    setDraftReplies((current) => ({
      ...current,
      [ticketId]: value,
    }));
  };

  const updateTicket = (
    ticketId: string,
    updater: (ticket: SupportTicket) => SupportTicket,
  ) => {
    setTickets((current) =>
      current.map((ticket) => (ticket.id === ticketId ? updater(ticket) : ticket)),
    );
  };

  const handleSendReply = (ticketId: string) => {
    const draft = draftReplies[ticketId]?.trim();

    if (!draft) {
      return;
    }

    updateTicket(ticketId, (ticket) => ({
      ...ticket,
      status: ticket.status === "Resolved" ? "In Progress" : ticket.status,
      messages: [
        ...ticket.messages.filter((message) => message.tone !== "system"),
        {
          id: `${ticketId}-${ticket.messages.length + 1}`,
          author: "James Wilson",
          authorInitial: "J",
          dateTime: "15 May 2020 8:15 pm",
          body: draft,
          tone: "staff",
        },
      ],
    }));
    setDraftReply(ticketId, "");
  };

  const handleResolve = (ticketId: string) => {
    updateTicket(ticketId, (ticket) => ({
      ...ticket,
      status: "Resolved",
      messages: [
        ...ticket.messages.filter((message) => message.tone !== "system"),
        {
          id: `${ticketId}-resolved`,
          author: "System",
          authorInitial: "!",
          dateTime: "15 May 2020 8:16 pm",
          body: "This ticket has been resolved",
          tone: "system",
        },
      ],
    }));
  };

  const handleReopen = (ticketId: string) => {
    updateTicket(ticketId, (ticket) => ({
      ...ticket,
      status: "In Progress",
      messages: ticket.messages.filter((message) => message.tone !== "system"),
    }));
  };

  return (
    <section className="rounded-[18px] border border-[#dbe7f8] bg-[#fbfdff] p-4 shadow-[0_12px_32px_rgba(22,43,120,0.04)] sm:p-5">
      <div className="flex flex-col gap-4 border-b border-[#e8eff9] pb-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-[18px] font-medium text-[#2f3f98]">Candidates</h1>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative block w-full sm:w-[250px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#8796bb]" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search..."
              className="h-11 w-full rounded-[12px] border border-[#e2ebf8] bg-[#eff6ff] pl-11 pr-4 text-[13px] text-[#4453a3] outline-none placeholder:text-[#9aa8c4] focus:border-[#98d0f1]"
            />
          </label>

          <div className="relative">
            <button
              type="button"
              onClick={() => setFilterOpen((current) => !current)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[12px] border border-[#e2ebf8] bg-white px-4 text-[13px] font-semibold text-[#4958ab]"
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>

            {filterOpen ? (
              <div className="absolute right-0 top-[calc(100%+8px)] z-10 min-w-[170px] rounded-[14px] border border-[#dce7f8] bg-white p-2 shadow-[0_18px_40px_rgba(18,33,77,0.14)]">
                {(["All", "New", "In Progress", "Resolved"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setSelectedFilter(option);
                      setFilterOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-left text-[13px] ${
                      selectedFilter === option
                        ? "bg-[#eef6ff] text-[#2f46a4]"
                        : "text-[#67769d] hover:bg-[#f7fbff]"
                    }`}
                  >
                    <span>{option}</span>
                    {selectedFilter === option ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {filteredTickets.map((ticket) => {
          const isExpanded = expandedTicketIds.includes(ticket.id);
          const replyCount = ticket.messages.filter(
            (message) => message.tone !== "system",
          ).length;
          const draft = draftReplies[ticket.id] ?? "";

          return (
            <article
              key={ticket.id}
              className="overflow-hidden rounded-[14px] border border-[#1eb0ec] bg-[#fcfbff] shadow-[0_6px_20px_rgba(30,166,223,0.08)]"
            >
              <div className="px-4 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[12px] text-[#7383ad]">{ticket.id}</span>
                      <span
                        className={`rounded-[7px] px-2 py-1 text-[11px] font-semibold ${priorityBadgeClasses[ticket.priority]}`}
                      >
                        {ticket.priority}
                      </span>
                      <span
                        className={`rounded-[7px] px-2 py-1 text-[11px] font-semibold ${statusBadgeClasses[ticket.status]}`}
                      >
                        {ticket.status}
                      </span>
                    </div>

                    <h2 className="mt-4 text-[26px] font-medium tracking-[-0.02em] text-[#31439f]">
                      {ticket.title}
                    </h2>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-[12px] text-[#7b88ac]">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPinned className="h-3.5 w-3.5 text-[#4d5aae]" />
                        {ticket.category}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Circle className="h-2.5 w-2.5 fill-current" />
                        {ticket.submittedAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <span className="rounded-full border border-[#d7e7f8] bg-[#f4f9ff] px-3 py-1.5 text-[12px] font-medium text-[#5e70ab]">
                      {replyCount} reply{replyCount === 1 ? "" : "s"}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleExpanded(ticket.id)}
                      className="grid h-8 w-8 place-items-center rounded-full text-[#4f5eaa] transition hover:bg-[#f1f7ff]"
                    >
                      <ChevronDown
                        className={`h-4.5 w-4.5 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {isExpanded ? (
                <div className="border-t border-[#e7eef8] bg-[#fbfcff] px-4 py-4">
                  <div className="space-y-3">
                    {ticket.messages.map((message) => (
                      <MessageBubble key={message.id} message={message} />
                    ))}

                    {ticket.status !== "Resolved" ? (
                      <textarea
                        value={draft}
                        onChange={(event) => setDraftReply(ticket.id, event.target.value)}
                        placeholder="Type your reply..."
                        className="min-h-[96px] w-full resize-none rounded-[12px] border border-[#dce7f8] bg-[#eaf5ff] px-4 py-3 text-[13px] text-[#48579b] outline-none placeholder:text-[#92a1bf] focus:border-[#9ed2f1]"
                      />
                    ) : null}
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {ticket.status === "Resolved" ? (
                      <div />
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleResolve(ticket.id)}
                        className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-[10px] bg-[#1db954] px-4 text-[13px] font-semibold text-white shadow-[0_10px_18px_rgba(29,185,84,0.2)]"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Mark Resolved
                      </button>
                    )}

                    {ticket.status === "Resolved" ? (
                      <button
                        type="button"
                        onClick={() => handleReopen(ticket.id)}
                        className="inline-flex h-9 items-center justify-center self-start rounded-[10px] border border-[#d6e5f7] bg-white px-4 text-[12px] font-semibold text-[#4153aa]"
                      >
                        Reopen
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendReply(ticket.id)}
                        className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-[10px] bg-[linear-gradient(90deg,#58d0ff_0%,#12ace6_100%)] px-4 text-[13px] font-semibold text-white shadow-[0_12px_20px_rgba(18,172,230,0.2)]"
                      >
                        <Send className="h-4 w-4" />
                        Send Reply
                      </button>
                    )}
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}

        {filteredTickets.length === 0 ? (
          <div className="rounded-[14px] border border-dashed border-[#d9e6f7] bg-white px-6 py-12 text-center text-[14px] text-[#7b89ad]">
            No support tickets matched your current search or filter.
          </div>
        ) : null}
      </div>
    </section>
  );
}
