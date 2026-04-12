<div align="center">

# 🚀 Task Tracker

A modern, full-stack Kanban task manager with drag-and-drop, real-time animations, and a polished UI.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?style=flat-square&logo=framer)](https://www.framer.com/motion/)

</div>

---

## ✨ Features

### Kanban Board
- **Drag-and-drop** tasks between columns (To Do, In Progress, Done) with `@dnd-kit`
- **Confetti celebration** when a task is marked as Done
- **Smooth column scrolling** with custom thin scrollbar
- **Staggered entrance animations** for columns and cards

### Task Management
- **Create, edit, delete** tasks with server-side persistence (Prisma + SQLite)
- **Priority levels** — High 🔴, Medium 🟡, Low 🟢 with visual emoji cards
- **Undo delete** — toast notification with a 6-second undo window
- **Search & filter** tasks in real-time

### Dashboard & Analytics
- **Completion ring** — animated SVG progress indicator
- **Status pie chart** — visual breakdown of task distribution
- **Priority bar chart** — see workload by priority level
- **Gradient progress bar** with glow effect

### UI/UX Polish
- **Dark/Light mode** — custom animated toggle with twinkling stars and sliding knob
- **Keyboard shortcuts** — `⌘K` search, `⌘N` new task, `Esc` clear
- **Animated focus states** — spring-physics focus rings on inputs
- **Responsive design** — works on desktop and mobile

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Server Components, Server Actions) |
| **Language** | TypeScript 5 (strict mode) |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | shadcn/ui (Base UI) |
| **Animations** | Framer Motion 12 |
| **Drag & Drop** | @dnd-kit (core + sortable) |
| **Database** | Prisma 7 + SQLite (via better-sqlite3 adapter) |
| **Charts** | Recharts 3 |
| **Icons** | Lucide React |
| **Theming** | next-themes |
| **Notifications** | Sonner |
| **Effects** | canvas-confetti |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+
- **pnpm** (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/AchrefHabhab/task-tracker.git
cd task-tracker

# Install dependencies
pnpm install

# Generate Prisma client & set up database
npx prisma generate
npx prisma db push

# Seed with sample data
npx tsx prisma/seed.ts

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Focus search bar |
| `⌘N` / `Ctrl+N` | Open new task dialog |
| `Esc` | Clear search & blur |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── _actions/          # Server Actions (CRUD operations)
│   ├── _components/       # Client components
│   │   ├── kanban-board    # DnD context + column grid
│   │   ├── kanban-column   # Droppable column with animations
│   │   ├── kanban-card     # Draggable task card
│   │   ├── stats-panel     # Charts dashboard
│   │   ├── add-task-dialog # Task creation form
│   │   ├── edit-task-dialog# Task editing form
│   │   ├── theme-toggle    # Animated dark/light switch
│   │   ├── search-bar      # Animated search with forwardRef
│   │   └── progress-bar    # Gradient progress indicator
│   ├── globals.css         # Tailwind config + custom scrollbar
│   ├── layout.tsx          # Root layout with ThemeProvider
│   └── page.tsx            # Server Component (data fetching)
├── lib/
│   ├── db.ts               # Prisma client singleton
│   └── confetti.ts         # Confetti utility
├── types/
│   └── task.ts             # TypeScript types
└── prisma/
    ├── schema.prisma        # Database schema
    └── seed.ts              # Sample data seeder
```

---

## 🧠 What I Learned

This project covers 40+ concepts documented in [`LEARNING_NOTES.md`](./LEARNING_NOTES.md), including:

- **Server Components vs Client Components** — data fetching on the server, interactivity on the client
- **Server Actions** — form mutations without API routes
- **Prisma 7** — type-safe ORM with driver adapters
- **@dnd-kit** — accessible drag-and-drop with sensors and collision detection
- **Framer Motion** — layout animations, spring physics, AnimatePresence
- **forwardRef** — imperative DOM access from parent components
- **useTransition** — non-blocking UI updates during async operations
- **Custom components** — building animated toggles, focus rings, and progress bars from scratch

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/AchrefHabhab">Achref Habhab</a></sub>
</div>
