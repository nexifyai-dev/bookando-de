```markdown
# bookando-de Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches you the core development patterns and conventions used in the `bookando-de` TypeScript repository. You'll learn about file naming, import/export styles, commit conventions, and how to write and run tests according to the project's standards. This guide is essential for maintaining consistency and quality across the codebase.

## Coding Conventions

### File Naming
- Use **snake_case** for all file names.

**Example:**
```plaintext
user_profile.ts
order_details.test.ts
```

### Import Style
- Use **relative imports** for referencing other modules within the project.

**Example:**
```typescript
import { getUser } from './user_profile';
```

### Export Style
- Use **named exports** instead of default exports.

**Example:**
```typescript
// In user_profile.ts
export function getUser(id: string) { ... }

// In another file
import { getUser } from './user_profile';
```

### Commit Messages
- Follow **conventional commit** style.
- Use prefixes such as `docs`.
- Keep commit messages concise (average ~61 characters).

**Example:**
```plaintext
docs: update README with installation instructions
```

## Workflows

_No automated workflows detected in the repository._

## Testing Patterns

- Test files use the `*.test.*` naming pattern (e.g., `user_profile.test.ts`).
- The specific testing framework is **unknown**, but tests are colocated with implementation files.
- To add a test, create a file with `.test.ts` extension and use named exports for test helpers.

**Example:**
```typescript
// user_profile.test.ts
import { getUser } from './user_profile';

test('getUser returns correct user', () => {
  expect(getUser('123')).toEqual({ id: '123', name: 'Alice' });
});
```

## Commands

| Command      | Purpose                                            |
|--------------|----------------------------------------------------|
| /test        | Run all test files matching `*.test.*`             |
| /lint        | Lint the codebase according to project conventions |
| /commit      | Create a conventional commit                       |
```