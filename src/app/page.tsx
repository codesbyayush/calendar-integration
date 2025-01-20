import { getCalendarEvents } from '@/actions/calender';
import { Calendar } from '@/components/calendar'
import { SignIn } from '@/components/sign-in';
import { SignOut } from '@/components/sign-out';
import { Session } from 'next-auth';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function Home() {

  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const { events, nextPageToken } = await getCalendarEvents({ startDate: new Date().toISOString() });

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

