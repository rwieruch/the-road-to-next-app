import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { Lucia } from 'lucia';
import { prisma } from './prisma';

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes) => ({
    username: attributes.email,
    email: attributes.email,
    emailVerified: attributes.emailVerified,
    activeOrganizationId: attributes.activeOrganizationId,
  }),
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      username: string;
      email: string;
      emailVerified: boolean;
      activeOrganizationId: string | null;
    };
  }
}
