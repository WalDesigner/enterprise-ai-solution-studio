# Security Policy

## Supported scope

This repository is an interview-ready demo rather than a production multi-tenant service. Security
fixes target the current `main` branch and the public CloudBase demo.

## Reporting a vulnerability

Use GitHub private vulnerability reporting from the repository Security tab. Do not place API keys,
tokens, request headers, customer data, exploit payloads, or retired infrastructure addresses in a
public Issue. If private reporting is temporarily unavailable, open an Issue containing only a
non-sensitive request for private follow-up.

## Secret boundary

- Real Provider credentials belong only in ignored local environment files or cloud-side secrets.
- `.env.local` and any real Token must never be committed, logged, screenshotted, or pasted into chat.
- Browser code must not receive Provider keys through `NEXT_PUBLIC_*` variables.
- Mock fallback must remain visibly distinguishable from real AI output.

The public repository begins from an audited clean-history snapshot and intentionally excludes the
legacy private engineering history.
