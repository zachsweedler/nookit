export const useUserSession = async (supabase) => {
   const {
      data: { session },
   } = await supabase.auth.getSession();
   return session;
};
