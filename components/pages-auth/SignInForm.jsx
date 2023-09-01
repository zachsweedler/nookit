/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { Button } from "@/styles/Buttons";
import { Input } from "@/styles/Input";
import { H6, Para } from "@/styles/Typography";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
// import { useRouter } from "next/navigation";
import { useState } from "react";
import { styled } from "styled-components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ConfirmationPopup from "./ConfirmationPopup";
import Container from "@/styles/Containers";
import { InputErrorWrap } from "../upload-nook/steps/Styled";

export default function SignInForm() {
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const supabase = createClientComponentClient();
    const validationSchema = yup.object().shape({
        email: yup.string().required("This is a required field."),
    });

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = async (formData) => {
        setSuccess(null);
        setLoading(true);
        setError(null);
        await supabase.auth.signIn({email}, {
            redirectTo: window.location.origin
            });
        const { error } = await supabase.auth.signInWithOtp({
            email: formData.email,
            options: {
                emailRedirectTo: 'http://localhost:3000/waitlist/form'
            }
        });
        if (error) {
            console.log(error);
            setError(error);
            setLoading(false);
            setSuccess(false);
        } else {
            setLoading(false);
            setSuccess(true);
        }
    };

    // const handleGoogleSignIn = async () => {
    //     const { data, error } = await supabase.auth.signInWithOAuth({
    //         provider: "google",
    //     });
    //     if (error) {
    //         console.log("sign in error", error);
    //     } else {
    //         console.log("successful sign in", data);
    //     }
    // };

    return (
        <Container size="xs" style={{display: "flex", alignItems: "center"}}>
            {success ? (
                <ConfirmationPopup onClick={handleSubmit(onSubmit)} />
            ) : (
                <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                    <FormSection style={{rowGap: "9px"}}>
                        <Para size="textsm" weight="medium" color="primary.grey.g700">Login or Sign Up</Para>
                        <H6 weight="medium">Welcome to Nookit</H6>
                    </FormSection>
                    <FormSection>
                        <InputErrorWrap>
                        <Input
                            id="filled-basic"
                            variant="filled"
                            label="Email"
                            name="email"
                            {...register("email")}
                        />
                        {errors.email && (
                            <Para size="textxs" weight="regular" color="error">
                                {errors.email.message}
                            </Para>
                        )}
                        <Button $brandcolor='true' type="submit">
                            {loading ? "Loading..." : "Log In / Sign Up"}
                        </Button>
                        </InputErrorWrap>
                    </FormSection>
                    {error && (
                        <Para size="textxs" weight="regular" color="error">
                            {error.message}
                        </Para>
                    )}
                    {/* <OrContainer>
                        <hr style={{width: "100%", height: "1px", backgroundColor: "#dddddd", borderWidth: "0"}} />
                        OR
                        <hr style={{width: "100%", height: "1px", backgroundColor: "#dddddd", borderWidth: "0"}} />
                    </OrContainer> */}
                    {/* <Button
                        onClick={handleGoogleSignIn}
                        $googlecolor='true'
                        style={{ position: "relative" }}
                        type="button"
                    >
                        <img
                            src="/google-logo.svg"
                            width={20}
                            height={20}
                            style={{ position: "absolute", left: "12px" }}
                        />
                        Continue with Google
                    </Button> */}
                </FormWrapper>
            )}
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
    padding-left: 30px;
    padding-right: 30px;
`;

const FormSection = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    width: 100%;
`;

// const OrContainer = styled.div`
//     display: flex;
//     flex-direction: row;
//     justify-content: space-between;
//     column-gap: 5px;
//     width: 100%;
//     align-items: center;
// `;
