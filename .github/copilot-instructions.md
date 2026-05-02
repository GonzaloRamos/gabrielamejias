# Copilot Instructions

## Repository shape

- This repository is a static site, not an application with a build pipeline. The authored source is primarily `index.html`.
- Third-party frontend assets are vendored under `lib/`:
  - `lib/bootstrap-5.3.8-dist/` contains Bootstrap CSS and JavaScript.
  - `lib/bootstrap-icons-1.13.1/` contains Bootstrap Icons CSS and font files.
- `logs/` is operational output, not part of the site source.

## Commands

- There are no repository-defined build, test, or lint commands in this codebase. Do not assume `npm`, `composer`, or other project tooling is present.

## High-level architecture

- `index.html` is the page entry point and contains the site structure, content, and all first-party UI composition.
- The page depends on vendored assets via relative paths from `index.html`:
  - `./lib/bootstrap-5.3.8-dist/css/bootstrap.min.css`
  - `./lib/bootstrap-icons-1.13.1/bootstrap-icons.min.css`
  - `./lib/bootstrap-5.3.8-dist/js/bootstrap.bundle.min.js`
- Interactive behavior is limited to Bootstrap's built-in JavaScript. The navbar toggle works through Bootstrap `data-bs-*` attributes; there is no custom JavaScript layer to update.
- Layout is composed directly with Bootstrap containers, rows, columns, cards, buttons, and icon classes. The existing authored content is centered around the `#servicios` section.

## Key conventions

- Keep site copy and labels in Spanish unless the surrounding content is intentionally being translated.
- Make UI changes directly in `index.html`; there is no component system, templating layer, or custom stylesheet abstraction in the current codebase.
- Preserve relative asset references (`./lib/...`, `./assets/...`) so the site works both in local Apache-style serving and under a GitHub Pages project subpath.
- Treat `lib/` as third-party code. Prefer adding first-party files outside `lib/` if custom CSS or JavaScript is needed, instead of editing Bootstrap or Bootstrap Icons directly.
- Follow the existing Bootstrap markup style for new content: section/container -> row -> column -> card/content block.
