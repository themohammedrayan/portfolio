# portfolio

Personal website of Mohammed Rayan A: product analyst who finds the problem in the data,
writes the spec, builds it and launches it.

Next.js 15 static export, deployed on Vercel.

## Where the content comes from

- `content/master-profile.yaml` is a copy of the fact bank in
  [job-portal](https://github.com/themohammedrayan/job-portal) (`data/master-profile.yaml`),
  the same file every CV is built from. Update it there, then `npm run sync:profile`.
- `content/site.ts` holds the site narrative. It pulls bullets and metrics by id
  (`bullet()`, `metric()` in `lib/profile.ts`) so figures are never retyped.
- `public/Mohammed-Rayan-CV.pdf` is job-portal's default CV (`npm run render:default` there).

## Fact check

`npm test` (after `npm run build`) reads every built page and fails if it shows a number
that isn't in the master profile, or breaks one of its wording rules.

## Commands

```
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in out/
npm test           # fact check of out/
```
