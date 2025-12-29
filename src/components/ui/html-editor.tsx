"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[200px] bg-white/5 border border-white/10 rounded-lg animate-pulse" />
  ),
});

interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function HtmlEditor({ value, onChange, placeholder, disabled }: HtmlEditorProps) {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "blockquote",
    "code-block",
    "link",
    "image",
  ];

  return (
    <div className="html-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={disabled}
      />
      <style jsx global>{`
        .html-editor .ql-toolbar {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px 8px 0 0;
        }
        .html-editor .ql-toolbar .ql-stroke {
          stroke: rgba(255, 255, 255, 0.6);
        }
        .html-editor .ql-toolbar .ql-fill {
          fill: rgba(255, 255, 255, 0.6);
        }
        .html-editor .ql-toolbar .ql-picker {
          color: rgba(255, 255, 255, 0.6);
        }
        .html-editor .ql-toolbar .ql-picker-options {
          background: #18181b;
          border-color: rgba(255, 255, 255, 0.1);
        }
        .html-editor .ql-toolbar button:hover .ql-stroke,
        .html-editor .ql-toolbar .ql-picker:hover .ql-stroke {
          stroke: #10b981;
        }
        .html-editor .ql-toolbar button:hover .ql-fill,
        .html-editor .ql-toolbar .ql-picker:hover .ql-fill {
          fill: #10b981;
        }
        .html-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: #10b981;
        }
        .html-editor .ql-toolbar button.ql-active .ql-fill {
          fill: #10b981;
        }
        .html-editor .ql-container {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-top: none;
          border-radius: 0 0 8px 8px;
          min-height: 150px;
          font-size: 14px;
        }
        .html-editor .ql-editor {
          color: white;
          min-height: 150px;
        }
        .html-editor .ql-editor.ql-blank::before {
          color: rgba(255, 255, 255, 0.4);
          font-style: normal;
        }
        .html-editor .ql-editor a {
          color: #10b981;
        }
        .html-editor .ql-snow .ql-tooltip {
          background: #18181b;
          border-color: rgba(255, 255, 255, 0.1);
          color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }
        .html-editor .ql-snow .ql-tooltip input[type="text"] {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
          color: white;
        }
        .html-editor .ql-snow .ql-tooltip a.ql-action::after,
        .html-editor .ql-snow .ql-tooltip a.ql-remove::before {
          color: #10b981;
        }
      `}</style>
    </div>
  );
}
