# Contributing to KarsaTek OS

Thank you for your interest in contributing to KarsaTek OS (HireOS)! We welcome developers, designers, proctoring security experts, and AI researchers to help build the future of autonomous cognitive recruitment.

## Code of Conduct
By participating in this project, you agree to abide by our Code of Conduct:
- Maintain a respectful, inclusive, and professional environment.
- Prioritize candidate privacy and data security.
- Document any code changes and follow existing style guidelines.

## Development Workflow
1.  **Fork the Repository**: Create a personal copy of this repository on GitHub.
2.  **Branching Convention**: Create a feature or bugfix branch:
    ```bash
    git checkout -b feature/amazing-feature
    ```
3.  **Local Testing**: Run local builds and ensure all code compiles cleanly before committing:
    ```bash
    npm run build
    ```
4.  **Proctoring Integrity Code**: When editing proctoring elements, ensure all changes are tested across multiple browsers (Chrome, Firefox, Safari) to verify that fullscreen events are handled identically.
5.  **Submit a Pull Request**: Submit your pull request to the `main` branch with a clear description of your modifications.

## Style Guidelines
- Use TypeScript for all components and API routes.
- Format files using Prettier configuration.
- Structure pages as server/client boundaries using Next.js `"use client"` directives appropriately.
