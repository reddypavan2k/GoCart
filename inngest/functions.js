import { inngest } from './client'
import prisma from '../lib/prisma'

export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-creation" },
  { event: "clerk/user.created" },   // 👈 moved here
  async ({ event, step }) => {
    const { data } = event
    await step("Create User in DB", async () => {
      await prisma.user.create({
        data: {
          id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          image: data.image_url,
        }
      })
    })
  }
)

export const syncUserUpdation = inngest.createFunction(
  { id: "sync-user-update" },
  { event: "clerk/user.updated" },   // 👈 trigger
  async ({ event }) => {
    const { data } = event
    await prisma.user.update({
      where: { id: data.id },
      data: {
        email: data.email_addresses[0].email_address,
        name: `${data.first_name} ${data.last_name}`,
        image: data.image_url,
      }
    })
  }
)

export const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-delete" },
  { event: "clerk/user.deleted" },   // 👈 trigger
  async ({ event }) => {
    const { data } = event
    await prisma.user.delete({
      where: { id: data.id }
    })
  }
)
