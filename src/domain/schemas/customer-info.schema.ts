import { z } from "zod";

export const customerInfoSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Nama pelanggan minimal 2 karakter")
    .max(80, "Nama terlalu panjang"),
  email: z.string().trim().email("Format alamat email tidak valid"),
  whatsapp: z
    .string()
    .trim()
    .transform((val) => val.replace(/[\s-]/g, ""))
    .pipe(
      z
        .string()
        .regex(/^\+?[0-9]{9,15}$/, "Nomor WhatsApp wajib 9–15 digit angka"),
    ),
});

export type CustomerInfo = z.infer<typeof customerInfoSchema>;
export type CustomerInfoInput = z.input<typeof customerInfoSchema>;
