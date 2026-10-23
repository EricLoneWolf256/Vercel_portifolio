// Shared result shape for every admin mutation (Server Actions across
// projects/experience/skills/testimonials/settings/messages).
export type AdminActionResult = { success: true } | { success: false; error: string }
