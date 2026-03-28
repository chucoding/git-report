import { z } from 'zod'

export const RepoUrlSchema = z
  .string()
  .url()
  .refine((v: string) => v.includes('github.com/'), 'Must be a github.com URL')

export const IsoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)

export const GenerateReportSchema = z.object({
  repoUrl: RepoUrlSchema,
  branch: z.string().min(1),
  fromDate: IsoDateSchema,
  toDate: IsoDateSchema,
  githubToken: z.string().min(1).optional()
})

export const ListReportsSchema = z.object({})

export const CompareSchema = z.object({
  leftReportId: z.string().min(1),
  rightReportId: z.string().min(1)
})
