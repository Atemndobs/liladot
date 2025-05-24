# [ADR-001]: Use Manifest V3 for Chrome Extension

## Status
Accepted (2025-05-24)

## Context
We need to choose between Manifest V2 and V3 for our Chrome extension. Manifest V3 is the future of Chrome extensions and brings several improvements and restrictions that affect extension architecture.

## Decision
We will use Manifest V3 for the LilaDot Chrome extension, despite some of its limitations, because:
1. It's required for Chrome Web Store submissions starting January 2024
2. It provides better security through more restrictive permissions
3. It improves privacy with more declarative APIs
4. It enables better performance through service workers

## Consequences
### Positive
- Better security model
- Improved privacy for users
- More predictable extension behavior
- Better alignment with Chrome's future direction

### Negative
- Some APIs have reduced functionality compared to V2
- Service workers have limitations (e.g., no DOM access)
- More complex background script management

## Alternatives Considered
1. **Use Manifest V2**
   - Pros: More flexible APIs, simpler background scripts
   - Cons: Will be deprecated, not accepted in Chrome Web Store

2. **Use WebExtensions API with polyfills**
   - Pros: Potentially more cross-browser compatible
   - Cons: Adds complexity, still need to handle V3 specifics for Chrome

## References
- [Chrome Developers: Migrating to Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Manifest V3 Overview](https://developer.chrome.com/docs/extensions/mv3/intro/mv3-overview/)
