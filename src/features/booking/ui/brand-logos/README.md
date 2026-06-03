# Gas-station brand logos

Drop official station logo files in **this folder** and they are picked up
automatically by `FuelBrandIcon.tsx` (resolved at build time via
`import.meta.glob`). Until a file exists for a brand, the button shows a
colored tile with the brand's initial as a fallback.

## Filenames (lowercase slug, any of `.svg` / `.png` / `.webp`)

| Brand   | File          |
| ------- | ------------- |
| Petron  | `petron.svg`  |
| Shell   | `shell.svg`   |
| Caltex  | `caltex.svg`  |
| Phoenix | `phoenix.svg` |
| Seaoil  | `seaoil.svg`  |
| Unioil  | `unioil.svg`  |
| Jetti   | `jetti.svg`   |

`Others` has no logo (it is the catch-all) and always uses the tile.

## Notes

- Prefer **square-ish SVGs** (they render in a small rounded tile). A logo with
  built-in padding looks best; the component sizes them to 22-36px.
- These logos are **trademarks of their respective owners**. Use assets you are
  permitted to use (official brand/press kits, or a source you have rights to).
  They are intentionally git-ignored-by-convention here / not committed by the
  assistant; add the ones you have rights to.
