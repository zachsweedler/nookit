"use client";
import { MenuItem } from "@/styles/MenuItem";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { styled } from "styled-components";

export default function NavDropdown({
   status,
   isVisible,
   toggleDropdownVisibility,
}) {
   const supabase = createClientComponentClient();
   const router = useRouter();

   const applyItems = [
      { id: 1, title: "Waitlist", href: "/waitlist/dash" },
      { id: 2, title: "Brand Profile", href: "/waitlist/brand-profile" },
      { id: 3, title: "Sign Out", href: "/sign-in" },
   ];

   const memberItems = [
      { id: 1, title: "Book a Nook", href: "/members/book-a-nook" },
      { id: 2, title: "My Nooks", href: "/members/my-nooks" },
      { id: 3, title: "Bookings", href: "/members/bookings" },
      { id: 4, title: "Sign Out", href: "/sign-in" },
   ];

   const handleSignOut = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
         console.log("error signing out", error.message);
      } else {
         router.push("/sign-in");
         location.reload();
      }
   };

   return (
      <>
         {isVisible && (
            <Wrapper>
               {!status
                  ? applyItems.map((item) => (
                       
                          <Link
                             key={item.id}
                             href={item.href}
                             style={{ textDecoration: "none" }}
                          >
                             <MenuItem
                                onClick={() => {
                                   toggleDropdownVisibility();
                                   if (item.title === "Sign Out")
                                      handleSignOut();
                                }}
                                style={{
                                   padding: "12px 16px",
                                   alignItems: "start",
                                }}
                             >
                                {item.title}
                             </MenuItem>
                          </Link>
                
                    ))
                  : memberItems.map((item) => (
                  
                          <Link
                             href={item.href}
                             style={{ textDecoration: "none" }}
                             key={item.id}
                          >
                             <MenuItem
                                onClick={() => {
                                   toggleDropdownVisibility();
                                   if (item.title === "Sign Out")
                                      handleSignOut();
                                }}
                                style={{
                                   padding: "12px 16px",
                                   alignItems: "start",
                                }}
                             >
                                {item.title}
                             </MenuItem>
                          </Link>
                  
                    ))}
            </Wrapper>
         )}
      </>
   );
}

const Wrapper = styled.div`
   position: absolute;
   top: calc(100% + 12px);
   right: 0;
   background-color: ${({ theme }) => theme.color.white};
   border-radius: 5px;
   box-shadow: 0 2px 16px rgba(0, 0, 0, 0.12);
   width: 250px;
`;
