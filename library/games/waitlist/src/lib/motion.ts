// Motion tokens for JS (motion/react). Mirrors --ease-* and --duration-* in
// styles.css so CSS and JS animations move alike.
export const ease = [0.22, 1, 0.36, 1] as const
export const easeSpring = [0.34, 1.56, 0.64, 1] as const

export const duration = {
  fast: 0.15,
  base: 0.35,
  slow: 0.8,
} as const
