# [ADR-004]: Use Plasmo Framework for Chrome Extension Development

## Status
Accepted (2025-05-24)

## Context
We need to choose a framework for developing the LilaDot Chrome extension that provides:
1. Seamless Chrome Extension development experience
2. React and TypeScript support
3. Built-in development server and build tools
4. Simplified extension architecture

## Decision
We will use the Plasmo Framework for developing the LilaDot Chrome extension because:
1. It's specifically designed for browser extension development
2. Provides first-class React and TypeScript support
3. Includes built-in development server with hot module replacement
4. Handles manifest generation and asset management
5. Simplifies content script and background service worker development

## Consequences
### Positive
- Faster development with built-in tooling
- Better developer experience with hot reloading
- Type safety across the entire codebase
- Simplified extension architecture
- Automatic manifest generation
- Built-in support for React hooks

### Negative
- Additional dependency on the Plasmo ecosystem
- Learning curve for developers unfamiliar with Plasmo
- Potential limitations with very custom extension requirements

## Alternatives Considered
1. **Vanilla Chrome Extension**
   - Pros: No framework dependencies, complete control
   - Cons: More boilerplate, slower development

2. **Create React App + CRXJS**
   - Pros: More control over configuration
   - Cons: More complex setup, more maintenance

3. **Vite + Chrome Extension Plugin**
   - Pros: Fast development, modern tooling
   - Cons: More manual configuration needed

## References
- [Plasmo Framework Documentation](https://docs.plasmo.com/)
- [Plasmo GitHub](https://github.com/PlasmoHQ/plasmo)
