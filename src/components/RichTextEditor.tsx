import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Code,
  ImageIcon,
  LinkIcon,
  Highlighter,
  Undo,
  Redo,
  Minus,
  Paintbrush,
  ChevronDown,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { uploadImage } from "@/lib/api";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const COLORS = [
  { label: "Black", value: "#1a1a1a" },
  { label: "Dark Gray", value: "#4b5563" },
  { label: "Gold", value: "#c3a67d" },
  { label: "Olive", value: "#6d7350" },
  { label: "Red", value: "#dc2626" },
  { label: "Blue", value: "#2563eb" },
  { label: "Green", value: "#16a34a" },
  { label: "Purple", value: "#9333ea" },
  { label: "Orange", value: "#ea580c" },
  { label: "Pink", value: "#db2777" },
];

const HIGHLIGHT_COLORS = [
  { label: "Yellow", value: "#fef08a" },
  { label: "Gold", value: "#c3a67d50" },
  { label: "Green", value: "#bbf7d0" },
  { label: "Blue", value: "#bfdbfe" },
  { label: "Pink", value: "#fbcfe8" },
  { label: "Orange", value: "#fed7aa" },
];

const ToolbarButton = ({
  onClick,
  active,
  children,
  title,
  disabled,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    disabled={disabled}
    className={`flex items-center justify-center rounded-md p-2 transition-all ${
      active
        ? "bg-charcoal text-cream shadow-sm"
        : disabled
        ? "text-gray-300 cursor-not-allowed"
        : "text-charcoal/70 hover:bg-charcoal/10 hover:text-charcoal"
    }`}
  >
    {children}
  </button>
);

const ToolbarDivider = () => <div className="mx-1 h-7 w-px bg-gray-200" />;

/** Parse content: try JSON string → object, fallback to raw string */
const parseContent = (content: string) => {
  if (!content) return "";
  try {
    const parsed = JSON.parse(content);
    // Ensure it's a valid TipTap doc object
    if (parsed && typeof parsed === "object" && parsed.type === "doc") {
      return parsed;
    }
    return content;
  } catch {
    return content;
  }
};

const RichTextEditor = ({ content, onChange, placeholder }: RichTextEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const colorRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) setShowColorPicker(false);
      if (highlightRef.current && !highlightRef.current.contains(e.target as Node)) setShowHighlightPicker(false);
      if (headingRef.current && !headingRef.current.contains(e.target as Node)) setShowHeadingMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-xl max-w-full mx-auto my-6 shadow-md" },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Start writing your amazing blog post...",
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-gold underline cursor-pointer hover:text-gold/80" },
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      Color,
    ],
    content: parseContent(content),
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()));
    },
    editorProps: {
      attributes: {
        class:
          "focus:outline-none min-h-[500px] px-8 py-8 text-charcoal leading-relaxed",
      },
    },
  });

  // Sync editor content when the prop changes (e.g. after async API fetch)
  useEffect(() => {
    if (!editor) return;
    const parsed = parseContent(content);
    const currentJSON = JSON.stringify(editor.getJSON());
    const incomingJSON = typeof parsed === "object" ? JSON.stringify(parsed) : null;
    // Only update if the external content is actually different from what's in the editor
    if (incomingJSON && incomingJSON !== currentJSON) {
      editor.commands.setContent(parsed, false);
    }
  }, [content, editor]);

  const handleImageUpload = useCallback(async () => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;
      try {
        const url = await uploadImage(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch {
        console.error("Failed to upload image");
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [editor]
  );

  const addLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const getCurrentHeading = () => {
    if (!editor) return "Paragraph";
    if (editor.isActive("heading", { level: 1 })) return "Heading 1";
    if (editor.isActive("heading", { level: 2 })) return "Heading 2";
    if (editor.isActive("heading", { level: 3 })) return "Heading 3";
    return "Paragraph";
  };

  if (!editor) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      {/* ─── Toolbar Row 1: Block Format + Inline Styles ─── */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50/80 px-3 py-2">
        {/* Heading Dropdown */}
        <div className="relative" ref={headingRef}>
          <button
            type="button"
            onClick={() => { setShowHeadingMenu(!showHeadingMenu); setShowColorPicker(false); setShowHighlightPicker(false); }}
            className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 font-body text-sm text-charcoal hover:bg-gray-50 transition-colors min-w-[120px]"
          >
            <span className="font-medium">{getCurrentHeading()}</span>
            <ChevronDown className="h-3.5 w-3.5 text-charcoal/50" />
          </button>
          {showHeadingMenu && (
            <div className="absolute left-0 top-full z-30 mt-1 w-56 rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
              <button
                onClick={() => { editor.chain().focus().setParagraph().run(); setShowHeadingMenu(false); }}
                className={`flex w-full items-center px-4 py-2.5 text-left hover:bg-gray-50 ${editor.isActive("paragraph") ? "bg-gray-100" : ""}`}
              >
                <span className="font-body text-sm text-charcoal">Paragraph</span>
              </button>
              <button
                onClick={() => { editor.chain().focus().toggleHeading({ level: 1 }).run(); setShowHeadingMenu(false); }}
                className={`flex w-full items-center px-4 py-2.5 text-left hover:bg-gray-50 ${editor.isActive("heading", { level: 1 }) ? "bg-gray-100" : ""}`}
              >
                <span className="font-display text-2xl font-bold text-charcoal">Heading 1</span>
              </button>
              <button
                onClick={() => { editor.chain().focus().toggleHeading({ level: 2 }).run(); setShowHeadingMenu(false); }}
                className={`flex w-full items-center px-4 py-2.5 text-left hover:bg-gray-50 ${editor.isActive("heading", { level: 2 }) ? "bg-gray-100" : ""}`}
              >
                <span className="font-display text-xl font-semibold text-charcoal">Heading 2</span>
              </button>
              <button
                onClick={() => { editor.chain().focus().toggleHeading({ level: 3 }).run(); setShowHeadingMenu(false); }}
                className={`flex w-full items-center px-4 py-2.5 text-left hover:bg-gray-50 ${editor.isActive("heading", { level: 3 }) ? "bg-gray-100" : ""}`}
              >
                <span className="font-display text-lg font-medium text-charcoal">Heading 3</span>
              </button>
            </div>
          )}
        </div>

        <ToolbarDivider />

        {/* Bold / Italic / Underline / Strike */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold (Ctrl+B)">
          <Bold className="h-5 w-5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic (Ctrl+I)">
          <Italic className="h-5 w-5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline (Ctrl+U)">
          <UnderlineIcon className="h-5 w-5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
          <Strikethrough className="h-5 w-5" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Text Color */}
        <div className="relative" ref={colorRef}>
          <button
            type="button"
            onClick={() => { setShowColorPicker(!showColorPicker); setShowHighlightPicker(false); setShowHeadingMenu(false); }}
            title="Text Color"
            className="flex items-center gap-1 rounded-md p-2 text-charcoal/70 hover:bg-charcoal/10 hover:text-charcoal transition-all"
          >
            <Paintbrush className="h-5 w-5" />
            <div
              className="h-2 w-5 rounded-sm"
              style={{ backgroundColor: editor.getAttributes("textStyle").color || "#1a1a1a" }}
            />
          </button>
          {showColorPicker && (
            <div className="absolute left-0 top-full z-30 mt-1 w-[220px] rounded-xl border border-gray-200 bg-white p-3 shadow-xl">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-body text-xs font-medium text-charcoal/60 uppercase tracking-wider">Text Color</p>
                <button
                  onClick={() => { editor.chain().focus().unsetColor().run(); setShowColorPicker(false); }}
                  className="text-xs text-charcoal/50 hover:text-charcoal"
                >
                  Reset
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => { editor.chain().focus().setColor(c.value).run(); setShowColorPicker(false); }}
                    title={c.label}
                    className="h-8 w-8 rounded-lg border-2 border-gray-100 shadow-sm hover:scale-110 hover:border-gray-300 transition-all"
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Highlight */}
        <div className="relative" ref={highlightRef}>
          <button
            type="button"
            onClick={() => { setShowHighlightPicker(!showHighlightPicker); setShowColorPicker(false); setShowHeadingMenu(false); }}
            title="Highlight"
            className={`flex items-center gap-1 rounded-md p-2 transition-all ${
              editor.isActive("highlight")
                ? "bg-charcoal text-cream shadow-sm"
                : "text-charcoal/70 hover:bg-charcoal/10 hover:text-charcoal"
            }`}
          >
            <Highlighter className="h-5 w-5" />
          </button>
          {showHighlightPicker && (
            <div className="absolute left-0 top-full z-30 mt-1 w-[200px] rounded-xl border border-gray-200 bg-white p-3 shadow-xl">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-body text-xs font-medium text-charcoal/60 uppercase tracking-wider">Highlight</p>
                <button
                  onClick={() => { editor.chain().focus().unsetHighlight().run(); setShowHighlightPicker(false); }}
                  className="text-xs text-charcoal/50 hover:text-charcoal"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => { editor.chain().focus().toggleHighlight({ color: c.value }).run(); setShowHighlightPicker(false); }}
                    title={c.label}
                    className="h-8 rounded-lg border-2 border-gray-100 shadow-sm hover:scale-105 hover:border-gray-300 transition-all"
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <ToolbarDivider />

        {/* Alignment */}
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align Left">
          <AlignLeft className="h-5 w-5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align Center">
          <AlignCenter className="h-5 w-5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align Right">
          <AlignRight className="h-5 w-5" />
        </ToolbarButton>
      </div>

      {/* ─── Toolbar Row 2: Lists, Blocks, Media, Undo ─── */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50/50 px-3 py-1.5">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List">
          <List className="h-5 w-5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered List">
          <ListOrdered className="h-5 w-5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote">
          <Quote className="h-5 w-5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code Block">
          <Code className="h-5 w-5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
          <Minus className="h-5 w-5" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton onClick={handleImageUpload} title="Insert Image">
          <ImageIcon className="h-5 w-5" />
        </ToolbarButton>
        <ToolbarButton onClick={addLink} active={editor.isActive("link")} title="Insert Link">
          <LinkIcon className="h-5 w-5" />
        </ToolbarButton>
        {editor.isActive("link") && (
          <ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()} title="Remove Link">
            <X className="h-5 w-5 text-red-500" />
          </ToolbarButton>
        )}

        <div className="flex-1" />

        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo (Ctrl+Z)" disabled={!editor.can().undo()}>
          <Undo className="h-5 w-5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo (Ctrl+Shift+Z)" disabled={!editor.can().redo()}>
          <Redo className="h-5 w-5" />
        </ToolbarButton>
      </div>

      {/* ─── Editor Content Area ─── */}
      <style>{`
        .ProseMirror h1 {
          font-size: 2em;
          font-weight: 700;
          line-height: 1.2;
          margin: 1em 0 0.5em;
          font-family: var(--font-display, 'century-gothic', serif);
          color: #1a1a1a;
        }
        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: 600;
          line-height: 1.3;
          margin: 0.8em 0 0.4em;
          font-family: var(--font-display, 'century-gothic', serif);
          color: #1a1a1a;
        }
        .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: 600;
          line-height: 1.4;
          margin: 0.6em 0 0.3em;
          font-family: var(--font-display, 'century-gothic', serif);
          color: #1a1a1a;
        }
        .ProseMirror p {
          font-size: 1rem;
          line-height: 1.75;
          margin: 0.5em 0;
        }
        .ProseMirror ul, .ProseMirror ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
        }
        .ProseMirror li {
          margin: 0.25em 0;
        }
        .ProseMirror ul li { list-style-type: disc; }
        .ProseMirror ol li { list-style-type: decimal; }
        .ProseMirror blockquote {
          border-left: 4px solid #c3a67d;
          padding: 0.5em 1em;
          margin: 1em 0;
          background: #f6f4f0;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          color: #4b5563;
        }
        .ProseMirror pre {
          background: #1a1a1a;
          color: #e5e7eb;
          padding: 1em;
          border-radius: 12px;
          overflow-x: auto;
          margin: 1em 0;
          font-family: monospace;
          font-size: 0.9em;
        }
        .ProseMirror hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 1.5em 0;
        }
        .ProseMirror a {
          color: #c3a67d;
          text-decoration: underline;
        }
        .ProseMirror img {
          border-radius: 12px;
          max-width: 100%;
          margin: 1.5em auto;
          display: block;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .ProseMirror mark {
          padding: 0 4px;
          border-radius: 4px;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
      <EditorContent editor={editor} />

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50/50 px-4 py-2">
        <p className="font-body text-xs text-charcoal-light">
          {editor.storage.characterCount?.characters?.() ?? 0} characters
        </p>
        <p className="font-body text-xs text-charcoal-light">
          Tip: Select text to format • Ctrl+B Bold • Ctrl+I Italic • Ctrl+U Underline
        </p>
      </div>
    </div>
  );
};

export default RichTextEditor;
