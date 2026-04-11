'use server';

import { auth } from "@clerk/nextjs/server";

export const getCurrentUserId = async (): Promise<string | null> => {
    const { userId } = await auth();
    return userId;
}
