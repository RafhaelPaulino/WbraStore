import { z } from 'zod'
import { UserRole } from '@prisma/client'

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  image: z.string().url('URL inválida').optional().nullable(),
})

export const updateUserPasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Senha atual é obrigatória'),
  newPassword: z.string().min(6, 'Nova senha deve ter no mínimo 6 caracteres'),
})

export const adminUpdateUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  role: z.nativeEnum(UserRole, { message: 'Role inválido' }).optional(),
  image: z.string().url('URL inválida').optional().nullable(),
})

export const getUsersSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  role: z.nativeEnum(UserRole).optional(),
  search: z.string().optional(),
})

export type UpdateUserDTO = z.infer<typeof updateUserSchema>
export type UpdateUserPasswordDTO = z.infer<typeof updateUserPasswordSchema>
export type AdminUpdateUserDTO = z.infer<typeof adminUpdateUserSchema>
export type GetUsersDTO = z.infer<typeof getUsersSchema>
