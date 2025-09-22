"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./ToolBar";
import Heading from "@tiptap/extension-heading";
import { mergeAttributes } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import { useEffect } from "react";

export const CustomHeading = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const level = node.attrs.level;
    const classMap: Record<number, string> = {
      1: "text-4xl font-bold my-4",
      2: "text-3xl font-semibold my-3",
      3: "text-2xl font-semibold my-2",
      4: "text-xl font-semibold my-2",
      5: "text-lg font-medium my-1",
      6: "text-base font-medium my-1",
    };
    return [
      `h${level}`,
      mergeAttributes(HTMLAttributes, {
        class: classMap[level] ?? "",
      }),
      0,
    ];
  },
});

const Tiptap = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (richText: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bold: {
          HTMLAttributes: {
            class: "font-bold",
          },
        },
        italic: {
          HTMLAttributes: {
            class: "italic",
          },
        },
        strike: {
          HTMLAttributes: {
            class: "line-through",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class:
              "border-l-4 border-gray-300 pl-4 italic bg-secondary text-secondary-foreground rounded-md py-2 my-2",
          },
        },
        code: {
          HTMLAttributes: {
            class:
              "inline-block text-sm font-mono p-2 rounded bg-secondary text-secondary-foreground",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-6 my-2",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-6 my-2",
          },
        },
        listItem: {
          HTMLAttributes: {
            class: "mb-1",
          },
        },
      }),
      CustomHeading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: "bg-yellow-200 text-black",
        },
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "rounded-md border border-input bg-background min-h-[150px] px-3 py-2 focus:outline-none",
      },
    },
  });

  // Update content if value changes externally (only on mount or edit mode)
  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  return (
    <div className="space-y-4">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
