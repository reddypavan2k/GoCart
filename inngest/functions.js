import { inngest } from './client'
import prisma from '../lib/prisma'

// Handle user creation
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-creation" },
  { event: "clerk/user.created" },   // ✅ event trigger
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

// Handle user updates
export const syncUserUpdation = inngest.createFunction(
  { id: "sync-user-update" },
  { event: "clerk/user.updated" },   // ✅ event trigger
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

// Handle user deletion
export const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-delete" },
  { event: "clerk/user.deleted" },   // ✅ event trigger
  async ({ event }) => {
    const { data } = event
    await prisma.user.delete({
      where: { id: data.id }
    })
  }
)
