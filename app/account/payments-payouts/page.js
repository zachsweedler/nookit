import FormTabs from "@/components/account-page/payments-payouts/FormTabs";
import Container from "@/styles/Containers";

export default async function PaymentsPayouts() {

   return (
      <Container
         size="md"
         style={{
            margin: "130px auto",
            display: "flex",
            flexDirection: "column",
            rowGap: "50px",
         }}
      >
         <FormTabs />
      </Container>
   );
}
