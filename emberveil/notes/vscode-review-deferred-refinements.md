# VS Code deferred refinements

**Status:** Deliberately deferred after the first live visual audit  
**Applies to:** Emberveil and Emberveil Dark  
**Reviewed in:** VS Code with TypeScript, TSX, CSS, JSON, Rust, HTML, Markdown, test files, the integrated terminal, find states, and completion widgets

This note preserves two findings that were real but did not justify changing an otherwise stable theme during the `0.1.3` correction pass. They should be revisited through focused testing rather than folded into unrelated syntax changes.

## 1. Markdown hierarchy

### Observation

Markdown headings, links, and blockquotes have a recognizable Emberveil identity, but two areas remain unresolved:

- Strong emphasis currently uses the same orange family as executable keywords. In prose-heavy technical documents, repeated bold phrases can resemble control-flow landmarks and make the page feel busier than source code.
- Inline code and fenced code do not receive enough distinct treatment. In a monospaced editor, raw code can blend into the surrounding prose because typography alone cannot establish the boundary.

### Candidate direction

- Keep headings amber and links cyan.
- Change strong emphasis to the neutral foreground with bold styling, or test a quieter amber that remains visibly separate from keyword orange.
- Give inline and fenced code a dedicated low-saturation treatment. Possible approaches include a soft raised background, a restrained teal foreground, or both.
- Re-evaluate long blockquotes. Their green documentation color is thematically coherent, but large quoted sections should not overpower the document.

### Acceptance criteria

- A long Markdown specification remains calmer than executable source code.
- Bold prose is obvious without being mistaken for a keyword.
- Inline and fenced code can be found at a glance without becoming the brightest content on the page.
- Links, headings, emphasis, quotations, and code remain distinguishable in both family modes.

## 2. Secondary editor metadata contrast

### Observation

Emberveil Dark intentionally suppresses peripheral information, but some metadata sits close to the practical lower limit:

- Inactive line numbers (`#5F6777` on `#242632`) measure approximately `2.64:1` contrast.
- Standard comments (`#727D8E` on `#242632`) measure approximately `3.60:1` contrast.
- Git blame and CodeLens-style annotations can become difficult to read over the current-line background.

The comments remained readable during the audit. The weaker area was editor metadata, especially blame annotations and inactive line numbers. This is therefore a refinement question, not a request to brighten all secondary text.

### Candidate direction

- Raise inactive line numbers and CodeLens metadata by one restrained value step.
- Keep active line numbers golden and preserve the existing foreground hierarchy.
- Test blame annotations over normal, current-line, selected, and diff backgrounds.
- Leave standard comments unchanged unless prolonged use shows actual reading strain.
- Apply equivalent relative adjustments to the paper-light companion instead of copying dark-mode values numerically.

### Acceptance criteria

- Line numbers remain peripheral but can be located without effort.
- Blame and CodeLens annotations remain readable on the current line.
- Secondary metadata never competes with source text or comments.
- Both themes preserve their quiet editor chrome during prolonged use.

## Decision rule

Do not implement either refinement from palette theory alone. Revisit them after several days of normal use or when a concrete screenshot shows the hierarchy failing. Any change should be tested in both Emberveil modes and across Markdown, source code, diffs, and annotation-heavy editor states.
