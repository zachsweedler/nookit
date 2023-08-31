import { Para } from "@/styles/Typography";
import Link from "next/link";
import React from "react";
import { styled } from "styled-components";

function Agreement() {
  return (
    <Wrapper>
      <Para size="textxs" weight="regular" color="primary.grey.g500">
        By hitting &quot;Next&quot;, you agree to the Nookit&apos;s
      </Para>
      <Link href="">
        <Para size="textxs" weight="medium" color="black">
          privacy policy
        </Para>
      </Link>
      <Para size="textxs" weight="regular" color="primary.grey.g500">
        and
      </Para>
      <Link href="">
        <Para size="textxs" weight="medium" color="black">
          terms of service
        </Para>
      </Link>
    </Wrapper>
  );
}

export default Agreement;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  column-gap: 5px;
  row-gap: 5px;
`;
