"use client";

import { Toggle } from "@/components/ui/toggle";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Underline,
  Undo,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { ReactNode } from "react";
import type { Editor } from "@tiptap/react";

type Props = {
  editor: Editor | null;
  type?: "leave" | "policy";
};

const Toolbar = ({ editor, type = "leave" }: Props) => {
  if (!editor) return null;

  const buttons: {
    icon: ReactNode;
    isActive: () => boolean;
    onToggle: () => void;
    key: string;
    label: string;
    section:
      | "headings"
      | "inline"
      | "lists"
      | "blocks"
      | "history"
      | "highlight";
  }[] = [
    // Headings
    {
      key: "heading-1",
      icon: <Heading1 className="size-4" />,
      isActive: () => editor.isActive("heading", { level: 1 }),
      onToggle: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      section: "headings",
      label: "Heading 1",
    },
    {
      key: "heading-2",
      icon: <Heading2 className="size-4" />,
      isActive: () => editor.isActive("heading", { level: 2 }),
      onToggle: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      section: "headings",
      label: "Heading 2",
    },
    {
      key: "heading-3",
      icon: <Heading3 className="size-4" />,
      isActive: () => editor.isActive("heading", { level: 3 }),
      onToggle: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      section: "headings",
      label: "Heading 3",
    },
    {
      key: "heading-4",
      icon: <Heading4 className="size-4" />,
      isActive: () => editor.isActive("heading", { level: 4 }),
      onToggle: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      section: "headings",
      label: "Heading 4",
    },
    {
      key: "heading-5",
      icon: <Heading5 className="size-4" />,
      isActive: () => editor.isActive("heading", { level: 5 }),
      onToggle: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
      section: "headings",
      label: "Heading 5",
    },
    {
      key: "heading-6",
      icon: <Heading6 className="size-4" />,
      isActive: () => editor.isActive("heading", { level: 6 }),
      onToggle: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
      section: "headings",
      label: "Heading 6",
    },

    // Inline styles
    {
      key: "bold",
      icon: <Bold className="size-4" />,
      isActive: () => editor.isActive("bold"),
      onToggle: () => editor.chain().focus().toggleBold().run(),
      section: "inline",
      label: "Bold",
    },
    {
      key: "italic",
      icon: <Italic className="size-4" />,
      isActive: () => editor.isActive("italic"),
      onToggle: () => editor.chain().focus().toggleItalic().run(),
      section: "inline",
      label: "Italic",
    },
    {
      key: "strike",
      icon: <Strikethrough className="size-4" />,
      isActive: () => editor.isActive("strike"),
      onToggle: () => editor.chain().focus().toggleStrike().run(),
      section: "inline",
      label: "Strike",
    },
    {
      key: "underline",
      icon: <Underline className="size-4" />,
      isActive: () => editor.isActive("underline"),
      onToggle: () => editor.chain().focus().toggleUnderline().run(),
      section: "inline",
      label: "Underline",
    },

    // Highlight
    {
      key: "highlight",
      icon: <Highlighter className="size-4" />,
      isActive: () => editor.isActive("highlight"),
      onToggle: () => editor.chain().focus().toggleHighlight().run(),
      section: "highlight",
      label: "Highlight",
    },

    // Lists
    {
      key: "bulletList",
      icon: <List className="size-4" />,
      isActive: () => editor.isActive("bulletList"),
      onToggle: () => editor.chain().focus().toggleBulletList().run(),
      section: "lists",
      label: "Bullet List",
    },
    {
      key: "orderedList",
      icon: <ListOrdered className="size-4" />,
      isActive: () => editor.isActive("orderedList"),
      onToggle: () => editor.chain().focus().toggleOrderedList().run(),
      section: "lists",
      label: "Ordered List",
    },

    // Block elements
    {
      key: "blockquote",
      icon: <Quote className="size-4" />,
      isActive: () => editor.isActive("blockquote"),
      onToggle: () => editor.chain().focus().toggleBlockquote().run(),
      section: "blocks",
      label: "Blockquote",
    },
    {
      key: "code",
      icon: <Code className="size-4" />,
      isActive: () => editor.isActive("code"),
      onToggle: () => editor.chain().focus().toggleCode().run(),
      section: "blocks",
      label: "Code",
    },

    // Undo / Redo
    {
      key: "undo",
      icon: <Undo className="size-4" />,
      isActive: () => false,
      onToggle: () => editor.chain().focus().undo().run(),
      section: "history",
      label: "Undo",
    },
    {
      key: "redo",
      icon: <Redo className="size-4" />,
      isActive: () => false,
      onToggle: () => editor.chain().focus().redo().run(),
      section: "history",
      label: "Redo",
    },
  ];

  const filteredButtons = buttons.filter((btn) => {
    if (type === "leave") {
      if (btn.section === "headings") return false;
      if (btn.key === "blockquote") return false;
      if (btn.key === "code") return false;
    }
    return true;
  });

  return (
    <section className="flex flex-wrap gap-2 sticky top-0 z-50 bg-background pb-2">
      {filteredButtons.map((btn) => {
        return (
          <Tooltip key={btn.key}>
            <TooltipTrigger asChild>
              <Toggle
                size="default"
                variant="outline"
                onPressedChange={btn.onToggle}
              >
                {btn.icon}
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>{btn.label}</TooltipContent>
          </Tooltip>
        );
      })}
    </section>
  );
};

export default Toolbar;
