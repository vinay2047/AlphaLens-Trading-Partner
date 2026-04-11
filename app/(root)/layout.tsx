import Header from "@/components/Header";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import DonatePopup from "@/components/DonatePopup";
import SirayBanner from "@/components/SirayBanner";

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
        <main className="min-h-screen text-gray-400">
            <SirayBanner />
            <Header user={user} />

            <div className="container py-10">
                {children}
            </div>

            <Footer />
            <DonatePopup />
        </main>
    )
}
export default Layout