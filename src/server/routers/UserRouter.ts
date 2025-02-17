import { j, publicProcedure } from "../jstack";
import { UserTable } from "../db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const UserRouter = j.router({
  getAll: publicProcedure.query(async ({ c, ctx }) => {
    const { db } = ctx;

    const users = await db.select().from(UserTable);

    return c.superjson({ users });
  }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1), email: z.string().email() }))
    .outgoing(z.object({ message: z.string() }))
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;

      const new_user = await db.insert(UserTable).values({
        id: crypto.randomUUID(),
        name: input.name,
        email: input.email,
      });

      return c.superjson({ message: "the user creatded" });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      await db.delete(UserTable).where(eq(UserTable.id, input.id));

      return c.superjson({ message: `${input.id} deleted successfully` }, 200);
    }),
});
