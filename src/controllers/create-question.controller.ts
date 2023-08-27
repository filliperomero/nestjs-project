import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '@/auth/current-user-decorator'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { UserPayload } from '@/auth/jwt.strategy'

import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { z } from 'zod'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { content, title } = body
    const { sub: userId } = user

    await this.prisma.question.create({
      data: {
        title,
        content,
        slug: this.convertToSlug(title),
        authorId: userId,
      },
    })
  }

  private convertToSlug(title: string): string {
    return title
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // remove all white spaces
      .replace(/[^\w-]+/g, '') // remove everything that is not considered words
      .replace(/_/g, '-') // replace "_" for "-"
      .replace(/--+/g, '-') //
      .replace(/-$/g, '') // remove '-' if it is in the end of the string
  }
}
