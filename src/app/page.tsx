import { getCalendarEvents } from '@/actions/calender';
import { Calendar } from '@/components/calendar'
import { SignIn } from '@/components/sign-in';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function Home() {

  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="min-h-screen bg-background">
      {session ? (
        <div>
          <Calendar />
        </div>

      ) : <SignIn />}

    </main>
  )
}

