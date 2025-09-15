"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Download,
  FileText,
  Lock,
  Shield,
  AlertTriangle,
  Home,
  Settings,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";

// Client-only Markdown editor
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface ArticleData {
  title: string;
  content: string;
  category: string;
  excerpt: string;
  author: string;
  tags: string[];
}

const CATEGORIES = [
  { value: "AI", label: "AI & Technology" },
  { value: "coding", label: "Development" },
  { value: "drama", label: "Drama" },
  { value: "film", label: "Film" },
  { value: "general", label: "General" },
  { value: "shopping", label: "Shopping" },
] as const;

export default function EditorPage() {
  const router = useRouter();
  const [isProduction, setIsProduction] = useState(false);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Article form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(`# Write your article here...

Start writing your amazing content in markdown format.

## Getting Started

You can use all standard markdown syntax:

- **Bold text**
- *Italic text*
- [Links](https://example.com)
- \`Code blocks\`
- Images
- Lists

Happy writing! 🎉`);
  const [category, setCategory] = useState<string>("general");
  const [excerpt, setExcerpt] = useState("");
  const [author, setAuthor] = useState("MoreFusion Team");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const correctPassword =
    process.env.NEXT_PUBLIC_LOCAL_EDITOR_PASSWORD || "admin2025";

  // Security check on mount
  useEffect(() => {
    const isProd = process.env.NODE_ENV === "production";
    setIsProduction(isProd);
    if (isProd) {
      toast.error("Editor not available in production");
      setTimeout(() => router.push("/404"), 2000);
      return;
    }
    setLoading(false);
  }, [router]);

  const addTag = () => {
    const val = tagInput.trim();
    if (val && !tags.includes(val)) {
      setTags((prev) => [...prev, val]);
      setTagInput("");
      toast.success(`Tag "${val}" added`);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
    toast.success(`Tag "${tagToRemove}" removed`);
  };

  const generateSlug = (t: string): string =>
    t
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

  const validateForm = (): boolean => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return false;
    }
    if (!content.trim()) {
      toast.error("Please write some content");
      return false;
    }
    if (content.replace(/\s/g, "").length < 100) {
      toast.error("Content must be at least 100 characters");
      return false;
    }
    return true;
  };

  const saveAsDraft = () => {
    if (!validateForm()) return;

    const articleData: ArticleData = {
      title,
      content,
      category,
      excerpt:
        excerpt ||
        content.substring(0, 200).replace(/[#*`]/g, "") + "...",
      author,
      tags,
    };

    try {
      localStorage.setItem("morefusion-draft", JSON.stringify(articleData));
      toast.success("Draft saved successfully!");
    } catch (error) {
      toast.error("Failed to save draft");
      // eslint-disable-next-line no-console
      console.error("Draft save error:", error);
    }
  };

  const loadDraft = () => {
    try {
      const draft = localStorage.getItem("morefusion-draft");
      if (draft) {
        const data: ArticleData = JSON.parse(draft);
        setTitle(data.title);
        setContent(data.content);
        setCategory(data.category);
        setExcerpt(data.excerpt);
        setAuthor(data.author);
        setTags(data.tags || []);
        toast.success("Draft loaded successfully!");
      } else {
        toast.error("No draft found");
      }
    } catch (error) {
      toast.error("Failed to load draft");
      // eslint-disable-next-line no-console
      console.error("Draft load error:", error);
    }
  };

  const clearForm = () => {
    setTitle("");
    setContent(
      "# Write your article here...\n\nStart writing your amazing content in markdown format."
    );
    setCategory("general");
    setExcerpt("");
    setAuthor("MoreFusion Team");
    setTags([]);
    setTagInput("");
    localStorage.removeItem("morefusion-draft");
    toast.success("Form cleared!");
  };

  const generateMarkdownFile = () => {
    if (!validateForm()) return;

    const slug = generateSlug(title);
    const currentDate = new Date().toISOString().split("T");
    const finalExcerpt =
      excerpt ||
      content.substring(0, 200).replace(/[#*`]/g, "") + "...";

    // Escape quotes in YAML strings
    const esc = (s: string) => s.replace(/"/g, '\\"');

    const frontMatter = `---
title: "${esc(title)}"
excerpt: "${esc(finalExcerpt)}"
date: "${currentDate}"
category: "${category}"
author: "${esc(author)}"
tags: [${tags.map((t) => `"${esc(t)}"`).join(", ")}]
---

`;

    const fileContent = frontMatter + content;

    try {
      const blob = new Blob([fileContent], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${slug}.md`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(
        `Article "${title}" downloaded! Save it to src/content/blog/${category}/`,
        { duration: 8000 }
      );
      // Clear draft after successful download
      localStorage.removeItem("morefusion-draft");
    } catch (error) {
      toast.error("Failed to download file");
      // eslint-disable-next-line no-console
      console.error("Download error:", error);
    }
  };

  const handleAuthentication = () => {
    if (password === correctPassword) {
      setAuthenticated(true);
      toast.success("Welcome to MoreFusion Editor!");
    } else {
      toast.error("Invalid password");
      setPassword("");
    }
  };

  // 🚫 Production Block
  if (isProduction) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <Card className="glass-card w-96">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600 flex items-center justify-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-red-700 mb-4">
              The editor is not available in production environment.
            </p>
            <Button className="btn-secondary" onClick={() => router.push("/")}>
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ⏳ Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  // 🔐 Password Protection
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <Card className="glass-card w-96">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl gradient-text flex items-center justify-center gap-2">
              <Lock className="w-6 h-6" />
              Editor Access
            </CardTitle>
            <p className="text-slate-600 mt-2">
              Enter password to access the markdown editor
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter editor password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAuthentication();
                  }}
                  className="w-full"
                />
              </div>
              <Button
                className="btn-primary w-full"
                onClick={handleAuthentication}
              >
                <Shield className="w-4 h-4 mr-2" />
                Access Editor
              </Button>
              <div className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/")}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ✍️ Main Editor
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center gap-3">
              <Edit3 className="w-10 h-10 text-blue-600" />
              MoreFusion Editor
            </h1>
            <p className="text-slate-600">
              Create amazing articles with markdown
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={loadDraft} variant="outline" size="sm">
              Load Draft
            </Button>
            <Button onClick={saveAsDraft} variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={clearForm} variant="outline" size="sm">
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button onClick={generateMarkdownFile} className="btn-primary">
              <Download className="w-4 h-4 mr-2" />
              Download Article
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Settings */}
          <div className="lg:col-span-1">
            <Card className="glass-card sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Settings className="w-5 h-5" />
                  Article Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Title *
                  </label>
                  <Input
                    placeholder="Enter article title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Author
                  </label>
                  <Input
                    placeholder="Author name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Add tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button onClick={addTag} size="sm" variant="outline">
                      Add
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          #{tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Excerpt
                  </label>
                  <Textarea
                    placeholder="Brief description (auto-generated if empty)"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={3}
                    className="w-full resize-none"
                  />
                </div>

                {/* Instructions */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    📋 Instructions
                  </h4>
                  <ol className="text-sm text-blue-700 space-y-1">
                    <li>1. Fill in article details</li>
                    <li>2. Write content in markdown</li>
                    <li>3. Click &quot;Download Article&quot;</li>
                    <li>
                      4. Save file to:
                      <code className="bg-blue-100 px-1 rounded ml-1">
                        src/content/blog/{category}/
                      </code>
                    </li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Editor Panel */}
          <div className="lg:col-span-3">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Edit3 className="w-5 h-5" />
                  Markdown Editor
                  {title && (
                    <span className="text-sm font-normal text-slate-500">
                      - {title}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div data-color-mode="light" className="border rounded-lg overflow-hidden">
                  <MDEditor
                    value={content}
                    onChange={(val) => setContent(val || "")}
                    height={600}
                    preview="live"
                    data-color-mode="light"
                  />
                </div>

                <div className="mt-6 flex gap-4">
                  <Button
                    onClick={generateMarkdownFile}
                    className="btn-primary flex-1"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Download Article (.md file)
                  </Button>
                  <Button onClick={saveAsDraft} variant="outline">
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                </div>

                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    💡 Click &quot;Download Article&quot; to get a .md file, then save it under
                    <code className="bg-green-100 px-1 mx-1 rounded">
                      src/content/blog/{category}/filename.md
                    </code>
                    to publish on your blog.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
