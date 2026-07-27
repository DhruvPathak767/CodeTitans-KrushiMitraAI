# Contributing to KrishiMitra AI

First off, **thank you** for considering contributing to KrishiMitra AI! It's people like you that make this project a truly great tool for Indian farmers. 🌾

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Branch Strategy](#branch-strategy)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

---

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

---

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your forked repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/KrishiMitra-AI.git
   cd KrishiMitra-AI
   ```
3. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/CodeTitans/KrishiMitra-AI.git
   ```
4. **Follow Setup Guide**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for full installation steps.

---

## Development Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your API keys in .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Python AI Microservice

```bash
cd python-ai
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## Branch Strategy

We follow **GitHub Flow** with the following branch naming conventions:

| Branch Type | Pattern | Example |
|-------------|---------|---------|
| **Feature** | `feature/short-description` | `feature/add-soil-analysis` |
| **Bug Fix** | `fix/short-description` | `fix/weather-api-timeout` |
| **Documentation** | `docs/short-description` | `docs/update-setup-guide` |
| **Refactor** | `refactor/short-description` | `refactor/auth-service` |
| **Hotfix** | `hotfix/short-description` | `hotfix/login-crash` |

**Base branch for all PRs: `main`**

```bash
# Sync with upstream before creating a branch
git fetch upstream
git rebase upstream/main

# Create your feature branch
git checkout -b feature/your-amazing-feature
```

---

## Commit Convention

We follow the **Conventional Commits** specification:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

| Type | When to Use |
|------|-------------|
| `feat` | New feature or functionality |
| `fix` | Bug fix |
| `docs` | Documentation changes only |
| `style` | Code style/formatting (no logic change) |
| `refactor` | Code refactoring (no feature/fix) |
| `perf` | Performance improvements |
| `test` | Adding or updating tests |
| `chore` | Build process, dependency updates |
| `ci` | CI/CD configuration changes |

### Examples

```bash
# Good commit messages
git commit -m "feat(weather): add AQI display to weather dashboard"
git commit -m "fix(auth): resolve JWT refresh token expiry bug"
git commit -m "docs(readme): update environment variables table"
git commit -m "refactor(irrigation): extract engine logic to separate service"
git commit -m "perf(market): add Redis cache for APMC price queries"
```

---

## Pull Request Process

1. **Ensure your branch is up-to-date** with `main`
2. **Run lint and type checks:**
   ```bash
   cd frontend && npm run typecheck && npm run lint
   ```
3. **Verify backend starts** without errors:
   ```bash
   cd backend && npm run dev
   ```
4. **Update documentation** if you changed API endpoints, environment variables, or project structure
5. **Create a Pull Request** with:
   - Clear title using Conventional Commits format
   - Description explaining **what** changed and **why**
   - Screenshots/GIFs for UI changes
   - Link to any related issues

### PR Template

```markdown
## Summary
<!-- Brief description of changes -->

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
<!-- List the specific changes -->

## Testing Done
<!-- How did you verify this works? -->

## Screenshots (if UI changes)
<!-- Add screenshots here -->

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have updated relevant documentation
- [ ] I have tested my changes
- [ ] I have added/updated comments for complex logic
```

---

## Coding Standards

### JavaScript / Node.js (Backend)

- Use **ES Module** syntax (`import`/`export`)
- Use `async/await` over Promises/callbacks
- Use `try/catch` for all async operations
- Throw `ApiError` for business logic errors (not native `Error`)
- Log with Winston `logger` — never use `console.log` in production code
- All controllers should delegate to services
- All services should use repositories for DB access

### TypeScript / React (Frontend)

- Use **TypeScript** for all new files (`.tsx`, `.ts`)
- Use functional components with hooks only
- Define prop interfaces inline or in `types/` directory
- Use `clsx` + `tailwind-merge` for conditional class names
- Use `@/` path aliases for imports
- Keep page components under `pages/`
- Keep reusable UI atoms under `components/ui/`
- Keep business-domain components under `features/`

### Python (AI Microservice)

- Follow **PEP 8** code style
- Use **Pydantic** models for request/response schemas
- Keep service logic in `services/`, not in routers
- Use singleton pattern for model loading (`model_loader_singleton`)
- Log with standard `logging` module

---

## Reporting Bugs

Before creating a bug report, please check if the issue already exists in [GitHub Issues](https://github.com/CodeTitans/KrishiMitra-AI/issues).

When creating a bug report, include:

1. **Environment**: OS, Node version, Python version, Browser
2. **Steps to reproduce**
3. **Expected behavior**
4. **Actual behavior**
5. **Error logs** (from backend console, browser DevTools, Python terminal)
6. **Screenshots** if applicable

---

## Feature Requests

We love feature ideas! When submitting a feature request:

1. Check the [Future Roadmap](./README.md#️-future-roadmap) — it might already be planned
2. Open a [GitHub Issue](https://github.com/CodeTitans/KrishiMitra-AI/issues) with the `enhancement` label
3. Describe:
   - The problem you're trying to solve
   - Your proposed solution
   - How it benefits Indian farmers

---

## Areas Where We Need Help

- 🌐 **Translation** — Additional Indian regional languages (Tamil, Telugu, Marathi, Punjabi)
- 🤖 **ML Models** — Training better crop disease models with more datasets
- 📱 **Mobile App** — React Native or Flutter version
- 🧪 **Testing** — Unit tests for backend services and frontend components
- 📚 **Documentation** — Hindi/Gujarati documentation

---

## Questions?

Feel free to open a [GitHub Discussion](https://github.com/CodeTitans/KrishiMitra-AI/discussions) or reach out to the team.

**Thank you for contributing to KrishiMitra AI! 🌾**

---

*Team CodeTitans — Building technology for Bharat's farmers.*
