import Header from "@/components/Header";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const clerkUser = await currentUser();

    if (!clerkUser) redirect('/sign-in');

    const user: User = {
        id: clerkUser.id,
        name: clerkUser.firstName
            ? `${clerkUser.firstName}${clerkUser.lastName ? ' ' + clerkUser.lastName : ''}`
            : clerkUser.emailAddresses[0]?.emailAddress || 'User',
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        imageUrl: clerkUser.imageUrl,
    }

    return (
        <main className="min-h-screen bg-[#09090d] text-slate-200">
            <Header user={user} />

            <div className="container mx-auto py-8 px-4">
                {children}
            </div>

            <Footer />
        </main>
    )
}
export default Layout