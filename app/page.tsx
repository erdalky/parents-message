"use client";

import { ChangeEvent, useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Camera,
  Check,
  Clipboard,
  FileText,
  Film,
  GraduationCap,
  MessageCircle,
  Printer,
  RotateCcw,
  Sparkles,
  Users,
  Volleyball,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

type FormState = {
  mentor: string;
  group: string;
  date: string;
  lessons: string;
  videos: string;
  books: string;
  activities: string;
  bookHomework: string;
  quranHomework: string;
  parentExpectation: string;
};

type Photo = {
  id: string;
  name: string;
  dataUrl: string;
};

const initialState: FormState = {
  mentor: "",
  group: "",
  date: "",
  lessons: "",
  videos: "",
  books: "",
  activities: "",
  bookHomework: "",
  quranHomework: "",
  parentExpectation: "",
};

const contentFields = [
  {
    key: "lessons" as const,
    label: "Lessons covered",
    shortLabel: "Lessons",
    placeholder: "Example: Qur'an, Islamic studies, and character education",
    icon: GraduationCap,
  },
  {
    key: "videos" as const,
    label: "Videos / recordings watched",
    shortLabel: "Videos / recordings",
    placeholder: "Example: A video about patience and good character",
    icon: Film,
  },
  {
    key: "books" as const,
    label: "Books read",
    shortLabel: "Books",
    placeholder: "Example: The Youth Guide, pages 12–20",
    icon: BookOpen,
  },
  {
    key: "activities" as const,
    label: "Activities",
    shortLabel: "Activities",
    placeholder: "Example: Soccer, table tennis, and a team-building game",
    icon: Volleyball,
  },
  {
    key: "bookHomework" as const,
    label: "Book assignment",
    shortLabel: "Book assignment",
    placeholder: "Example: Read pages 20–28 of the assigned book",
    icon: Clipboard,
  },
  {
    key: "quranHomework" as const,
    label: "Qur'an assignment",
    shortLabel: "Qur'an assignment",
    placeholder: "Example: Review the first five verses of Surah Al-Mulk",
    icon: BookOpen,
  },
  {
    key: "parentExpectation" as const,
    label: "Mentor's expectations of parents",
    shortLabel: "Parent expectations",
    placeholder: "Example: Please follow up on assignments and arrive on time",
    icon: Users,
  },
];

function formatDate(value: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function clean(value: string) {
  return value.trim().replace(/\n{3,}/g, "\n\n");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function readPhoto(file: File): Promise<Photo> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({
        id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        name: file.name,
        dataUrl: String(reader.result),
      });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Home() {
  const [form, setForm] = useState<FormState>(initialState);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [copied, setCopied] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const tableRows = useMemo(
    () =>
      contentFields.map((field) => ({
        label: field.label,
        value: clean(form[field.key]),
      })),
    [form],
  );

  const message = useMemo(() => {
    const date = formatDate(form.date);
    const group = clean(form.group);
    const details = [
      ["📘 *Lessons covered:*", clean(form.lessons)],
      ["🎬 *Videos / recordings watched:*", clean(form.videos)],
      ["📚 *Books read:*", clean(form.books)],
      ["⚽ *Activities:*", clean(form.activities)],
      ["📖 *Book assignment:*", clean(form.bookHomework)],
      ["🕌 *Qur'an assignment:*", clean(form.quranHomework)],
      ["🤝 *Mentor's expectations of parents:*", clean(form.parentExpectation)],
    ].filter(([, value]) => value);

    const introDetails = [date, group].filter(Boolean).join(" - ");
    const intro = introDetails
      ? `Here is a brief update about our program (${introDetails}):`
      : "Here is a brief update about this week's program:";
    const detailText = details.length
      ? details.map(([label, value]) => `${label}\n${value}`).join("\n\n")
      : "Program details will appear here.";
    const photoNote = photos.length
      ? `\n\n📷 ${photos.length} program ${photos.length === 1 ? "photo has" : "photos have"} been added to the document.`
      : "";
    const signature = clean(form.mentor)
      ? `\n\nWarm regards,\n${clean(form.mentor)}`
      : "";

    return `Assalamu alaikum, dear parents,\n\n${intro}\n\n${detailText}${photoNote}\n\nThank you for your continued support.${signature}`;
  }, [form, photos.length]);

  const documentTitle = clean(form.group)
    ? `${clean(form.group)} Program Update`
    : "Weekly Program Update";

  const update = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setCopied(false);
  };

  const handlePhotos = async (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";
    setUploadError("");

    const invalid = selected.find(
      (file) => !file.type.startsWith("image/") || file.size > 8 * 1024 * 1024,
    );
    if (invalid) {
      setUploadError("Please upload image files smaller than 8 MB.");
      return;
    }

    const available = 4 - photos.length;
    if (available <= 0) {
      setUploadError("You can add up to 4 photos.");
      return;
    }

    const accepted = selected.slice(0, available);
    const uploaded = await Promise.all(accepted.map(readPhoto));
    setPhotos((current) => [...current, ...uploaded]);

    if (selected.length > available) {
      setUploadError("Only the first 4 photos were added to the document.");
    }
  };

  const copyMessage = async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  const shareOnWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const createPdf = () => {
    window.print();
  };

  const downloadDocument = () => {
    const rows = tableRows
      .map(
        (row) =>
          `<tr><th>${escapeHtml(row.label)}</th><td>${escapeHtml(row.value || "-").replaceAll(
            "\n",
            "<br>",
          )}</td></tr>`,
      )
      .join("");
    const photoHtml = photos.length
      ? `<section class="photo-page"><h2>Program Photos</h2><div class="photos photos-${photos.length}">${photos
          .map(
            (photo) =>
              `<img src="${photo.dataUrl}" alt="${escapeHtml(photo.name)}">`,
          )
          .join("")}</div></section>`
      : "";
    const messageHtml = escapeHtml(message.replaceAll("*", "")).replaceAll(
      "\n",
      "<br>",
    );
    const documentHtml = `<!doctype html>
      <html><head><meta charset="utf-8"><title>${escapeHtml(documentTitle)}</title>
      <style>
        @page { margin: 18mm; }
        body { font-family: Arial, sans-serif; color: #203129; margin: 36px; }
        .brand { color: #b1883f; font-size: 11px; font-weight: bold; letter-spacing: 1.5px; }
        h1 { color: #123f31; font-family: Georgia, serif; font-size: 26px; margin: 6px 0 5px; }
        .meta { color: #66736d; font-size: 12px; margin-bottom: 22px; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0 24px; }
        th, td { border: 1px solid #ccd8d0; padding: 11px; text-align: left; vertical-align: top; }
        th { width: 31%; color: #123f31; background: #edf4ef; }
        h2 { color: #123f31; font-family: Georgia, serif; font-size: 18px; margin-top: 26px; }
        .photo-page { page-break-before: always; padding-top: 8px; }
        .photos { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .photos-1 { grid-template-columns: 1fr; }
        .photos-2 { grid-template-columns: 1fr; }
        .photos img { width: 100%; height: 310px; object-fit: contain; border-radius: 8px; }
        .photos-1 img { height: 700px; }
        .message { margin-top: 24px; padding: 16px; border-left: 4px solid #b28a42; background: #f5f8f6; font-size: 12px; line-height: 1.45; }
        .footer { margin-top: 28px; color: #53625b; font-size: 12px; }
      </style></head><body>
      <div class="brand">RAINDROP EDUCATION</div>
      <h1>${escapeHtml(documentTitle)}</h1>
      <div class="meta">${escapeHtml(formatDate(form.date) || "Date not provided")} · Mentor: ${escapeHtml(
        clean(form.mentor) || "-",
      )}</div>
      <table><thead><tr><th>Topic</th><th>Program Details</th></tr></thead><tbody>${rows}</tbody></table>
      <h2>Parent Update Message</h2>
      <div class="message">${messageHtml}</div>
      <div class="footer">Thank you for your continued support.</div>
      ${photoHtml}
      </body></html>`;

    const blob = new Blob(["\ufeff", documentHtml], {
      type: "application/msword;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${clean(form.group) || "program"}-update.doc`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setForm(initialState);
    setPhotos([]);
    setCopied(false);
    setUploadError("");
  };

  return (
    <main className="min-h-screen">
      <div className="page-shell">
        <header className="site-header">
          <div className="brand-mark" aria-hidden="true">
            <MessageCircle size={23} strokeWidth={2.25} />
          </div>
          <div>
            <p className="eyebrow">Raindrop Education</p>
            <h1>Parent Update Message</h1>
          </div>
          <div className="header-note">
            <Sparkles size={15} /> Automatic message and document generator
          </div>
        </header>

        <div className="workspace-grid">
          <section className="form-panel" aria-labelledby="form-title">
            <div className="section-heading">
              <div>
                <p className="step-label">01 · Program details</p>
                <h2 id="form-title">Enter this week's details</h2>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={reset} className="reset-button">
                <RotateCcw size={15} /> Clear
              </Button>
            </div>

            <div className="identity-grid">
              <div className="field-group">
                <Label htmlFor="mentor">Mentor's name</Label>
                <div className="input-wrap">
                  <Users size={17} aria-hidden="true" />
                  <Input
                    id="mentor"
                    value={form.mentor}
                    onChange={(event) => update("mentor", event.target.value)}
                    placeholder="Example: Kerim Yılmaz"
                  />
                </div>
              </div>
              <div className="field-group">
                <Label htmlFor="group">Group / grade</Label>
                <Input
                  id="group"
                  value={form.group}
                  onChange={(event) => update("group", event.target.value)}
                  placeholder="Example: 7th Grade Group"
                />
              </div>
              <div className="field-group">
                <Label htmlFor="date">Program date</Label>
                <div className="input-wrap">
                  <CalendarDays size={17} aria-hidden="true" />
                  <Input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(event) => update("date", event.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="divider" />

            <div className="content-heading">
              <p className="step-label">02 · Program content</p>
              <p>The information will appear in the document as a table.</p>
            </div>

            <div className="content-fields">
              {contentFields.map((field, index) => {
                const Icon = field.icon;
                return (
                  <div className="content-field" key={field.key}>
                    <div className="field-number">{String(index + 1).padStart(2, "0")}</div>
                    <div className="field-icon" aria-hidden="true">
                      <Icon size={19} />
                    </div>
                    <div className="field-body">
                      <Label htmlFor={field.key}>{field.label}</Label>
                      <Textarea
                        id={field.key}
                        value={form[field.key]}
                        onChange={(event) => update(field.key, event.target.value)}
                        placeholder={field.placeholder}
                        rows={2}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="photo-section">
              <div className="content-heading">
                <p className="step-label">03 · Program photos</p>
                <p>Up to 4 photos · 8 MB maximum per photo</p>
              </div>
              <input
                id="program-photos"
                className="sr-only"
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotos}
              />
              {photos.length === 0 ? (
                <Label htmlFor="program-photos" className="upload-zone">
                  <span className="upload-icon"><Camera size={21} /></span>
                  <span>
                    <strong>Add photos</strong>
                    <small>Tap to choose from your gallery</small>
                  </span>
                </Label>
              ) : (
                <div className="photo-grid">
                  {photos.map((photo) => (
                    <div className="photo-thumb" key={photo.id}>
                      <img src={photo.dataUrl} alt={photo.name} />
                      <button
                        type="button"
                        aria-label={`Remove ${photo.name}`}
                        onClick={() => setPhotos((current) => current.filter((item) => item.id !== photo.id))}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {photos.length < 4 && (
                    <Label htmlFor="program-photos" className="add-photo-tile">
                      <Camera size={19} />
                      <span>Add photo</span>
                    </Label>
                  )}
                </div>
              )}
              {uploadError && <p className="upload-error" role="alert">{uploadError}</p>}
            </div>
          </section>

          <aside className="preview-panel" aria-labelledby="preview-title">
            <div className="preview-top">
              <div>
                <p className="step-label light">04 · Document preview</p>
                <h2 id="preview-title">Review before sending</h2>
              </div>
              <span className="live-badge"><span /> Live preview</span>
            </div>

            <article className="document-sheet">
              <div className="document-brand">Raindrop Education</div>
              <h3>{documentTitle}</h3>
              <div className="document-meta">
                <span>{formatDate(form.date) || "Date not provided"}</span>
                <span>Mentor: {clean(form.mentor) || "-"}</span>
              </div>

              <Table className="program-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Topic</TableHead>
                    <TableHead>Program details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableRows.map((row) => (
                    <TableRow key={row.label}>
                      <TableCell className="topic-cell">{row.label}</TableCell>
                      <TableCell className="detail-cell">{row.value || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <section className="document-message">
                <h4>Parent Update Message</h4>
                <pre>{message.replaceAll("*", "")}</pre>
              </section>

              <footer className="document-footer">
                Thank you for your continued support.
              </footer>
            </article>

            {photos.length > 0 && (
              <article className="photo-sheet">
                <div className="document-brand">Raindrop Education</div>
                <h3>Program Photos</h3>
                <div className={`photo-document-grid photo-count-${photos.length}`}>
                  {photos.map((photo) => (
                    <img key={photo.id} src={photo.dataUrl} alt={photo.name} />
                  ))}
                </div>
              </article>
            )}

            <div className="document-actions">
              <Button type="button" onClick={createPdf} className="pdf-button">
                <Printer size={18} /> Create PDF
              </Button>
              <Button type="button" variant="outline" onClick={downloadDocument} className="document-button">
                <FileText size={18} /> Word document
              </Button>
            </div>
            <p className="pdf-hint">In the print window, choose “Save as PDF.”</p>

            <div className="preview-actions">
              <Button type="button" onClick={copyMessage} className="copy-button">
                {copied ? <Check size={18} /> : <Clipboard size={18} />}
                {copied ? "Message copied" : "Copy message"}
              </Button>
              <Button type="button" variant="outline" onClick={shareOnWhatsApp} className="whatsapp-button">
                <MessageCircle size={18} /> Open in WhatsApp
              </Button>
            </div>

            <p className="privacy-note">
              Photos and information are processed only on your device and are not uploaded to a server.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
