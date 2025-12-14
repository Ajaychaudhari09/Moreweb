---
description: Mandatory project rules and standards. READ BEFORE EVERY TASK.
---

# Project Rules & Standards

**CRITICAL: You must read and follow these rules for every task in this project.**

1.  **Package Manager**: ALWAYS use `pnpm`. NEVER use `npm` or `yarn`.
    *   Install: `pnpm install`
    *   Dev: `pnpm dev`
    *   Build: `pnpm build`
    *   Preview: `pnpm preview`

2.  **CSS / Tailwind**: 
    *   Use `@import "tailwindcss";` syntax if using Tailwind v4+.
    *   Avoid `@apply` if it causes errors or violates the specific configuration.
    *   Ensure CSS is compatible with the installed Tailwind version.

3.  **Code Quality & Linting**:
    *   **No Unused Declarations**: NEVER declare a variable, function, or import that is not used.
    *   **No Variable Errors**: Ensure all variables are defined and typed correctly.
    *   **Strict Adherence**: Fix any lint errors immediately. Do not ignore them.

4.  **Workflow**:
    *   **Check this file**: Before starting any task, verify you are following these rules.
    *   **Integrity**: precise file editing. Do not break existing functionality.
