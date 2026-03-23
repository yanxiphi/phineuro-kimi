# AGENTS.md

Agentic coding guidelines for this React + TypeScript + Vite project.

## Build Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Lint Commands

```bash
# Lint all files
npm run lint

# Note: No test framework configured yet
```

## Code Style Guidelines

### TypeScript

- Target: ES2022, strict mode enabled
- Module: ESNext with bundler resolution
- Use TypeScript 5.x features
- Enable `verbatimModuleSyntax` - use `type` imports for types
- Path alias: `@/` maps to `./src/`

### Imports

- Group imports: React, external libraries, internal components, types
- Use `@/` alias for all internal imports
- Example:
  ```typescript
  import * as React from "react"
  import { Slot } from "@radix-ui/react-slot"
  import { cva, type VariantProps } from "class-variance-authority"
  import { cn } from "@/lib/utils"
  ```

### Formatting

- No Prettier configured - rely on ESLint
- 2 spaces indentation
- Semicolons: optional (follow existing code style)
- Quotes: double quotes preferred

### Naming Conventions

- **Components**: PascalCase (e.g., `Button`, `HeroSection`)
- **Hooks**: camelCase prefixed with `use` (e.g., `useMediaQuery`)
- **Utilities**: camelCase (e.g., `cn`, `formatDate`)
- **Types/Interfaces**: PascalCase (e.g., `ButtonProps`, `UserData`)
- **Constants**: UPPER_SNAKE_CASE or camelCase

### Component Patterns

- Use functional components with explicit return types when needed
- Destructure props in function parameters
- Use `React.ComponentProps<"element">` for HTML props
- Forward refs using `React.forwardRef` pattern
- Use `asChild` pattern for polymorphic components

Example:
```typescript
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

### Styling with Tailwind CSS

- Use `cn()` utility from `@/lib/utils` for class merging
- Follow existing color palette: burgundy, slate-blue, cream, gold
- Use CSS variables for theming (HSL format)
- Custom animations defined in `tailwind.config.js`
- Use `data-slot` attributes for component identification

### Error Handling

- Prefer early returns over nested conditionals
- Use TypeScript's strict null checks
- Handle async errors with try/catch
- Validate props with Zod when using forms

### File Organization

```
src/
  components/
    ui/          # shadcn/ui components
  lib/
    utils.ts     # Utility functions (cn, etc.)
  hooks/         # Custom React hooks
  types/         # TypeScript type definitions
  sections/      # Page sections (Hero, Footer, etc.)
```

### shadcn/ui Components

- 40+ pre-installed components in `src/components/ui/`
- Import pattern: `import { Button } from "@/components/ui/button"`
- Uses Radix UI primitives + class-variance-authority
- Theme: New York style (from components.json)

### Dependencies

Key libraries in use:
- React 19 + React DOM
- Radix UI primitives (40+ components)
- Tailwind CSS 3.4 + tailwindcss-animate
- class-variance-authority (CVA)
- tailwind-merge + clsx
- lucide-react (icons)
- zod (validation)
- react-hook-form

### Git

- Never commit `node_modules/` or `dist/`
- Build artifacts in `dist/` are gitignored
- Follow conventional commits when possible

### Performance

- Use `useMemo` and `useCallback` appropriately
- Lazy load components when beneficial
- Images should be optimized and use proper loading attributes
- Use CSS transforms over layout properties for animations

### Accessibility

- Use semantic HTML elements
- Include proper ARIA labels
- Support keyboard navigation
- Respect `prefers-reduced-motion`
- Use Radix UI primitives for accessible complex components
