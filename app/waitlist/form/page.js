import WaitlistForm from '@/components/waitlist-portal/apply-form/ApplyForm'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Waitlist Form | nookit",
};

async function WaitlistF() {

  const supabase = createServerComponentClient({ cookies })
  const {data: {session}} = await supabase.auth.getSession();
  const {data: submitted} = await supabase.from('waitlist').select('submitted_form').eq('user_id', session.user.id)
  
  if (submitted) {
    redirect('/waitlist/dash')
  }

  return (
    <WaitlistForm/>
  )
}

export default WaitlistF

