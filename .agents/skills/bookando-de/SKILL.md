```markdown
# bookando-de Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `bookando-de` Python codebase. It covers file naming, import/export styles, commit patterns, and testing practices. By following these guidelines, contributors can ensure consistency and maintainability in the project.

## Coding Conventions

### File Naming
- Use **snake_case** for all file names.
  - Example: `user_profile.py`, `order_manager.py`

### Import Style
- Use **relative imports** within modules.
  - Example:
    ```python
    from .utils import format_date
    from ..models import User
    ```

### Export Style
- Use **named exports** (explicitly define what is exported).
  - Example:
    ```python
    __all__ = ['User', 'Order']
    ```

### Commit Patterns
- Follow **conventional commit** format.
- Supported prefixes: `chore`, `fix`
- Example commit messages:
  - `chore: update dependencies`
  - `fix: correct date parsing in order processor`

## Workflows

### Code Contribution
**Trigger:** When adding or updating code
**Command:** `/contribute`

1. Create or update files using snake_case naming.
2. Use relative imports for internal modules.
3. Define `__all__` for explicit exports where appropriate.
4. Write clear, conventional commit messages (e.g., `fix: ...`, `chore: ...`).
5. Run and/or write tests (see Testing Patterns).

### Writing Tests
**Trigger:** When adding new features or fixing bugs
**Command:** `/write-test`

1. Create test files matching the pattern `*.test.*` (e.g., `user_profile.test.py`).
2. Place test files alongside the code or in a dedicated test directory.
3. Use the project's preferred (unknown) testing framework.
4. Write tests covering new or changed functionality.

## Testing Patterns

- Test files follow the pattern: `*.test.*`
  - Example: `order_manager.test.py`
- The specific testing framework is not detected; follow existing project examples.
- Place tests near the code they test or in a dedicated test directory.
- Ensure tests are comprehensive for any new or modified code.

## Commands
| Command        | Purpose                                      |
|----------------|----------------------------------------------|
| /contribute    | Steps for contributing code                  |
| /write-test    | Steps for writing and organizing tests       |
```
