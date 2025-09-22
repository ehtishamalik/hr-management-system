"use client";

import React from "react";

import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Undo,
  Redo,
  Quote,
  Code,
  Highlighter,
  Underline,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

import type { Editor } from "@tiptap/react";

type Props = {
  editor: Editor | null;
};

const Toolbar = ({ editor }: Props) => {
  if (!editor) return null;

  const buttons: {
    icon: React.ReactNode;
    isActive: () => boolean;
    onToggle: () => void;
    key: string;
  }[] = [
    // Headings
    {
      key: "heading-1",
      icon: <Heading1 className="size-4" />,
      isActive: () => editor.isActive("heading", { level: 1 }),
      onToggle: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      key: "heading-2",
      icon: <Heading2 className="size-4" />,
      isActive: () => editor.isActive("heading", { level: 2 }),
      onToggle: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      key: "heading-3",
      icon: <Heading3 className="size-4" />,
      isActive: () => editor.isActive("heading", { level: 3 }),
      onToggle: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      key: "heading-4",
      icon: <Heading4 className="size-4" />,
      isActive: () => editor.isActive("heading", { level: 4 }),
      onToggle: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
    },
    {
      key: "heading-5",
      icon: <Heading5 className="size-4" />,
      isActive: () => editor.isActive("heading", { level: 5 }),
      onToggle: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
    },
    {
      key: "heading-6",
      icon: <Heading6 className="size-4" />,
      isActive: () => editor.isActive("heading", { level: 6 }),
      onToggle: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
    },

    // Inline styles
    {
      key: "bold",
      icon: <Bold className="size-4" />,
      isActive: () => editor.isActive("bold"),
      onToggle: () => editor.chain().focus().toggleBold().run(),
    },
    {
      key: "italic",
      icon: <Italic className="size-4" />,
      isActive: () => editor.isActive("italic"),
      onToggle: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      key: "strike",
      icon: <Strikethrough className="size-4" />,
      isActive: () => editor.isActive("strike"),
      onToggle: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      key: "underline",
      icon: <Underline className="size-4" />,
      isActive: () => editor.isActive("underline"),
      onToggle: () => editor.chain().focus().toggleUnderline().run(),
    },

    // Highlight (if using)
    {
      key: "highlight",
      icon: <Highlighter className="size-4" />,
      isActive: () => editor.isActive("highlight"),
      onToggle: () => editor.chain().focus().toggleHighlight().run(),
    },

    // Lists
    {
      key: "bulletList",
      icon: <List className="size-4" />,
      isActive: () => editor.isActive("bulletList"),
      onToggle: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      key: "orderedList",
      icon: <ListOrdered className="size-4" />,
      isActive: () => editor.isActive("orderedList"),
      onToggle: () => editor.chain().focus().toggleOrderedList().run(),
    },

    // Block elements
    {
      key: "blockquote",
      icon: <Quote className="size-4" />,
      isActive: () => editor.isActive("blockquote"),
      onToggle: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      key: "code",
      icon: <Code className="size-4" />,
      isActive: () => editor.isActive("code"),
      onToggle: () => editor.chain().focus().toggleCode().run(),
    },

    // Undo / Redo (not toggles, but still buttons)
    {
      key: "undo",
      icon: <Undo className="size-4" />,
      isActive: () => false,
      onToggle: () => editor.chain().focus().undo().run(),
    },
    {
      key: "redo",
      icon: <Redo className="size-4" />,
      isActive: () => false,
      onToggle: () => editor.chain().focus().redo().run(),
    },
  ];

  return (
    <section className="flex flex-wrap gap-2 sticky top-0 z-50 p-2 bg-background border-b border-gray-200">
      {buttons.map((btn) => (
        <Toggle
          key={btn.key}
          size="default"
          variant="outline"
          pressed={btn.isActive()}
          onPressedChange={btn.onToggle}
        >
          {btn.icon}
        </Toggle>
      ))}
    </section>
  );
};

export default Toolbar;
