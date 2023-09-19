'use client'
import { Button } from "@/styles/Buttons";
import Container from "@/styles/Containers";
import Input from "@/styles/Input";
import { H6, Para } from "@/styles/Typography";

export default function DevLogin () {

    const onSubmit = async (formData) => {
        setSuccess(null);
        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({
           email: formData.email,
        });
        if (error) {
           console.log(error);
           setLoading(false);
           setSuccess(false);
        } else {
           setLoading(false);
           setSuccess(true);
        }
     };
    
   return (
    <Container size="xs" style={{ display: "flex", alignItems: "center" }}>
          <FormWrapper onSubmit={handleSubmit(onSubmit)}>
             <FormSection style={{ rowGap: "9px" }}>
                <Para size="textsm" $weight="medium" color="primary.grey.g600">Login or sign up</Para>
                <H6 $weight="medium">Welcome to Nookit</H6>
             </FormSection>
             <FormSection>
                <Input
                   fieldName="email"
                   placeholder="Nookit Email"
                   register={register}
                   errors={errors}
                />
                 <Input
                   fieldName="password"
                   placeholder="Work Email"
                   register={register}
                   errors={errors}
                />
                <Button $brandcolor="true" type="submit">
                   {loading ? "Loading..." : "Continue"}
                </Button>
             </FormSection>
          </FormWrapper>
    </Container>
 );
}

const FormWrapper = styled.form`
 display: flex;
 flex-direction: column;
 width: 100%;
 align-items: start;
 justify-content: center;
 row-gap: 40px;
`;

const FormSection = styled.div`
 display: flex;
 flex-direction: column;
 row-gap: 20px;
 width: 100%;
`;

const OrContainer = styled.div`
 display: flex;
 flex-direction: row;
 justify-content: space-between;
 column-gap: 5px;
 width: 100%;
 align-items: center;
`;
