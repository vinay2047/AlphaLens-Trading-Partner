import Header from "@/components/Header";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const { userId, sessionClaims } = await auth();
    if (!userId) redirect('/sign-in');

    const clerkUser = await currentUser();
    const fallbackName =
        typeof sessionClaims?.fullName === 'string'
            ? sessionClaims.fullName
            : typeof sessionClaims?.firstName === 'string'
                ? `${sessionClaims.firstName}${typeof sessionClaims?.lastName === 'string' ? ` ${sessionClaims.lastName}` : ''}`
                : typeof sessionClaims?.email === 'string'
                    ? sessionClaims.email
                    : 'User';
    const fallbackEmail =
        typeof sessionClaims?.email === 'string'
            ? sessionClaims.email
            : '';

    const user: User = {
        id: userId,
        name: clerkUser?.firstName
            ? `${clerkUser.firstName}${clerkUser.lastName ? ' ' + clerkUser.lastName : ''}`
            : clerkUser?.emailAddresses[0]?.emailAddress || fallbackName,
        email: clerkUser?.emailAddresses[0]?.emailAddress || fallbackEmail,
        imageUrl: clerkUser?.imageUrl,
    }

    return (
        <main className="min-h-screen bg-gray-900 text-white selection:bg-teal-500/30">
            <Header user={user} />

            <div className="container mx-auto pt-8 pb-4 px-4 relative z-10">
                {children}
            </div>

            <Footer />
        </main>
    )
}
export default Layout
