'use client'
import { Para } from "@/styles/Typography";
import supabaseLoader from "@/supabase-image-loader";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { styled } from "styled-components"

export default function HostedBy () {

    const nook = useSelector((state) => state.viewNook.nook);

    return (
        <Wrapper>
            <HostWrapper>
                     <HostLogoWrapper>
                        <Image
                           alt=""
                           loader={supabaseLoader}
                           src={`/user-images/${nook?.company_profiles?.logo}`}
                           fill={true}
                           style={{ objectFit: "cover" }}
                           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                     </HostLogoWrapper>
                     <Link href={`/profiles/${nook.company_id}`}>
                        <Para
                           $isLink={true}
                           size="textmd"
                           $weight="medium"
                           color="black"
                        >
                           Hosted by {nook?.company_profiles?.name}
                        </Para>
                     </Link>
                  </HostWrapper>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    column-gap: 12px;
    width: 100%;
`


const HostWrapper = styled.div`
   display: flex;
   flex-direction: row;
   column-gap: 9px;
   align-items: center;
   width: 100%;
`;

const HostLogoWrapper = styled.div`
   position: relative;
   height: 25px;
   width: 25px;
   border-radius: 100%;
   overflow: hidden;
`;
