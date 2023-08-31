"use client";
import React from "react";
import NookCard from "./NookCard";
import { styled } from "styled-components";
import { Para } from "@/styles/Typography";
import { Button } from "@/styles/Buttons";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { restartForm } from "@/slices/uploadNookSlice";

export default function MyNooks({ nooks, hostCompany }) {
    const dispatch = useDispatch();
    return (
        <Wrapper>
            <Header>
                <Para size="displayxs" weight="medium">
                    My Nooks
                </Para>
                <Link
                    href="/waitlist/upload-nook"
                    style={{ textDecoration: "none" }}
                    onClick={() => dispatch(restartForm())}
                >
                    <Button $blackcolor='true' style={{ width: "fit-content" }}>
                        Add Nook +
                    </Button>
                </Link>
            </Header>
            <Grid>
                {nooks?.map((nook, index) => (
                    <NookCard
                        key={index}
                        images={nook.images}
                        name={nook.name}
                        city={nook.retail_space_city}
                        state={nook.retail_space_state_code}
                        hostId={nook.host_id}
                        hostCompany={hostCompany}
                    />
                ))}
            </Grid>
        </Wrapper>
    );
}

const Grid = styled.div`
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto;
    grid-row-gap: 50px;
    grid-column-gap: 20px;
    height: auto;
    @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
    }
`;

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 50px;
`;

const Header = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;
