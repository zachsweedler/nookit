'use client'
import Container from "@/styles/Containers";
import { H1, Para } from "@/styles/Typography";

export default function NotFound() {
  return (
    <Container size="lg" style={{marginTop: "120px", textAlign: "center", display: "flex", flexDirection: "column", rowGap: "18px"}}>
       <H1>Oops 🫤</H1>
       <Para size="textmd" $weight="regular">The page you&apos;re looking for doesn&apos;t exist or has been removed.</Para>
    </Container>
  );
}
