```markdown
# bookando-de Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `bookando-de` TypeScript codebase. It covers file naming, import/export styles, commit message conventions, and testing patterns. While no specific framework or automated workflows are detected, this guide ensures consistency and best practices for contributing to the project.

## Coding Conventions

### File Naming
- Use **snake_case** for all file names.
  - Example: `user_profile.ts`, `order_service.test.ts`

### Import Style
- Use **relative imports** for referencing modules.
  - Example:
    ```typescript
    import { getUser } from './user_service';
    ```

### Export Style
- Use **named exports** exclusively.
  - Example:
    ```typescript
    // user_service.ts
    export function getUser(id: string) { ... }
    export const USER_ROLE = 'admin';
    ```

### Commit Messages
- Follow the **conventional commit** style.
- Use prefixes such as `docs:` for documentation changes.
- Keep commit messages concise (average 71 characters).
  - Example:
    ```
    docs: update README with installation instructions
    ```

## Workflows

_No automated workflows detected in this repository._

## Testing Patterns

- Test files use the pattern: `*.test.*`
  - Example: `user_service.test.ts`
- The specific testing framework is **unknown**; check existing test files for patterns.
- Place tests alongside the code or in a dedicated `tests/` directory if present.

  Example test file structure:
  ```typescript
  // user_service.test.ts
  import { getUser } from './user_service';

  describe('getUser', () => {
    it('returns user by ID', () => {
      // test implementation
    });
  });
  ```

## Commands
| Command | Purpose |
|---------|---------|
| /test   | Run all test files matching `*.test.*` |
| /lint   | Lint the codebase for style consistency (if linter is configured) |
| /commit | Prepare a conventional commit message |
```