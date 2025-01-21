import { getCalendarEvents } from '@/actions/calender';
import { Calendar } from '@/components/calendar'
import { SignIn } from '@/components/sign-in';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

import { PencilRuler } from 'lucide-react';

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
          <p className='max-w-screen-xl mx-auto text-center w-full text-sm flex gap-3 items-center'>
            <PencilRuler className='size-4' /> <span className='font-medium'>
              To improve the display of recurring events, they are combined on this page. This can sometimes result in fewer events being shown, causing the "Next" button to appear inactive.
            </span>
          </p>
        </div>

      ) : <SignIn />}

    </main>
  )
}

