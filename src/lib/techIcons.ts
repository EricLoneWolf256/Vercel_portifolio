import {
  siReact, siNextdotjs, siTypescript, siJavascript, siNodedotjs, siTailwindcss,
  siFirebase, siVercel, siGit, siGithub, siDocker, siPostgresql, siMongodb,
  siGraphql, siRedux, siHtml5, siCss, siFigma, siPython, siExpress, siSass,
  siPrisma, siVuedotjs, siSupabase, siCloudinary, siJest, siWebpack, siVite,
  siStorybook, siStripe, siFlutter, siKotlin, siSwift, siGo, siRust, siPhp,
  siLaravel, siMysql, siRedis, siKubernetes, siNginx, siLinux, siGnubash,
  siNpm, siPnpm, siYarn, siEslint, siThreedotjs, siSocketdotio, siJquery, siD3,
} from 'simple-icons'

export interface TechIconData {
  title: string
  path: string
}

// Keyed by lowercased skill/tech name as it's likely to appear in Firestore data.
// Unlisted names simply render without a logo (graceful fallback) — this is
// a curated allow-list, not a full simple-icons re-export, to keep the
// client bundle small via tree-shaking.
const ICONS: Record<string, TechIconData> = {
  react: siReact,
  'next.js': siNextdotjs,
  nextjs: siNextdotjs,
  typescript: siTypescript,
  javascript: siJavascript,
  'node.js': siNodedotjs,
  nodejs: siNodedotjs,
  node: siNodedotjs,
  tailwind: siTailwindcss,
  'tailwind css': siTailwindcss,
  tailwindcss: siTailwindcss,
  firebase: siFirebase,
  vercel: siVercel,
  git: siGit,
  github: siGithub,
  docker: siDocker,
  postgresql: siPostgresql,
  postgres: siPostgresql,
  mongodb: siMongodb,
  mongo: siMongodb,
  graphql: siGraphql,
  redux: siRedux,
  html5: siHtml5,
  html: siHtml5,
  css3: siCss,
  css: siCss,
  figma: siFigma,
  python: siPython,
  express: siExpress,
  'express.js': siExpress,
  sass: siSass,
  scss: siSass,
  prisma: siPrisma,
  vue: siVuedotjs,
  'vue.js': siVuedotjs,
  supabase: siSupabase,
  cloudinary: siCloudinary,
  jest: siJest,
  webpack: siWebpack,
  vite: siVite,
  storybook: siStorybook,
  stripe: siStripe,
  flutter: siFlutter,
  kotlin: siKotlin,
  swift: siSwift,
  go: siGo,
  golang: siGo,
  rust: siRust,
  php: siPhp,
  laravel: siLaravel,
  mysql: siMysql,
  redis: siRedis,
  kubernetes: siKubernetes,
  k8s: siKubernetes,
  nginx: siNginx,
  linux: siLinux,
  bash: siGnubash,
  shell: siGnubash,
  npm: siNpm,
  pnpm: siPnpm,
  yarn: siYarn,
  eslint: siEslint,
  'three.js': siThreedotjs,
  threejs: siThreedotjs,
  'socket.io': siSocketdotio,
  jquery: siJquery,
  'd3.js': siD3,
  d3: siD3,
}

export function getTechIcon(name: string): TechIconData | null {
  return ICONS[name.trim().toLowerCase()] ?? null
}
