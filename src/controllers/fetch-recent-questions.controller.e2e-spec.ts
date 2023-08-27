import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { hash } from 'bcryptjs'

import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'

describe('Fetch Questions (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: await hash('123456', 10),
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    await prisma.question.createMany({
      data: [
        {
          title: 'Question 01',
          slug: 'question-01',
          content: 'Content 01',
          authorId: user.id,
        },
        {
          title: 'Question 02',
          slug: 'question-02',
          content: 'Content 02',
          authorId: user.id,
        },
        {
          title: 'Question 03',
          slug: 'question-03',
          content: 'Content 03',
          authorId: user.id,
        },
        {
          title: 'Question 04',
          slug: 'question-04',
          content: 'Content 04',
          authorId: user.id,
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'Question 01' }),
        expect.objectContaining({ title: 'Question 02' }),
        expect.objectContaining({ title: 'Question 03' }),
        expect.objectContaining({ title: 'Question 04' }),
      ],
    })
  })
})
