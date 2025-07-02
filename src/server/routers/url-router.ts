import { FormSchema } from '@/schema/FormSchema'
import { router, procedure } from '../trpc'
import { z } from 'zod/v4'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/generate-slug'
import { TRPCError } from '@trpc/server'

const urlRouter = router({
  shortenUrl: procedure
    .input(
      FormSchema.extend({
        machineId: z.string()
      })
    )
    .output(
      z.object({
        slug: z.string()
      })
    )
    .mutation(async ({ input }) => {
      const { destinationUrl, enableAnalytics, machineId: clientMachineId, title } = input

      try {
        const machineId = clientMachineId === 'unknown-machine-id' ? uuidv4().slice(0, 8) : clientMachineId.slice(-8)

        const machine = await prisma.machine.upsert({
          where: { machineId },
          update: {
            counter: { increment: 1 }
          },
          create: {
            machineId,
            counter: 1
          }
        })

        const slug = generateSlug(machine.machineId, machine.counter)

        const shortUrl = await prisma.shortUrl.create({
          data: {
            destinationUrl,
            slug,
            analyticsEnabled: enableAnalytics,
            title,
            machineId
          }
        })

        return {
          slug: shortUrl.slug
        }
      } catch (error) {
        console.log(error)
        throw new Error('Failed to shorten URL')
      }
    }),
  getUrlBySlug: procedure
    .input(z.string())
    .output(
      z.object({
        destinationUrl: z.string()
      })
    )
    .query(async ({ input: slug }) => {
      try {
        const shortUrl = await prisma.shortUrl.findUnique({
          where: { slug }
        })

        if (!shortUrl) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Slug not found'
          })
        }

        if (shortUrl.analyticsEnabled) {
          await prisma.shortUrl.update({
            where: { slug },
            data: {
              clicks: { increment: 1 },
              lastClickedAt: new Date()
            }
          })
        }

        return {
          destinationUrl: shortUrl?.destinationUrl || ''
        }
      } catch (error) {
        console.log(error)
        throw new Error('Failed to get destination URL')
      }
    })
})

const caller = urlRouter.createCaller({})

export { urlRouter, caller as urlRouterCaller }
