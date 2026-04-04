# Contributing to SkinMinder

Thank you for your interest in contributing to SkinMinder! We welcome contributions from the community.

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

## How to Contribute

### Reporting Bugs

- Check the [Issues](https://github.com/surulere15/skinminder/issues) page first
- Open a new issue with a clear title and detailed description
- Include steps to reproduce, expected behavior, and actual behavior

### Suggesting Features

- Open an issue with the `enhancement` label
- Describe the feature and why it would be valuable
- Include any relevant mockups or examples

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`pnpm test`)
5. Run linting (`pnpm lint`)
6. Commit your changes (`git commit -m 'feat: add amazing feature'`)
7. Push to your branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
