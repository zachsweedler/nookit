"use client";
import { useState } from "react";
import { Button, ButtonTab } from "./Buttons";
import Container from "./Containers";
import { H1, H2, H3, H4, H5, H6, Para } from "./Typography";
import TextCheckbox, { Checkbox } from "./Checkboxes";
import { Input } from "./Input";
import { industries } from "@/utils/industries";
import { MenuItem } from "./MenuItem";

export default function TestStylesheet() {
  const lorem =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  const [isActive, setIsActive] = useState(0);
  const tabs = [{ name: "Tab 1" }, { name: "Tab 2" }, { name: "Tab 3" }];

  const [isTextCheckboxActive, setIsTextCheckboxActive] = useState();

  const options = [
    { name: "Hello" },
    { name: "Hello, Brickswap" },
    { name: "Hello, Brickswap!" },
  ];

  return (
    <>
      <Container size="xl">
        <div style={{display: 'flex', flexDirection: 'column', rowGap: '50px', alignItems: "start"}}>
    
        <H1 color="primary.brand.b600" $weight="bold">
          Hello
        </H1>
        <H1 color="primary.brand.b500" $weight="semibold">
          Hello
        </H1>
        <H1 color="primary.brand.b400" $weight="medium">
          Hello
        </H1>
        <H1 color="primary.brand.b300" $weight="regular">
          Hello
        </H1>

        <H2 color="primary.grey.g900" $weight="bold">
          Hello
        </H2>
        <H2 color="primary.grey.g800" $weight="semibold">
          Hello
        </H2>
        <H2 color="primary.grey.g700" $weight="medium">
          Hello
        </H2>
        <H2 color="primary.grey.g600" $weight="regular">
          Hello
        </H2>

        <H3 $weight="bold">Hello</H3>
        <H3 $weight="semibold">Hello</H3>
        <H3 $weight="medium">Hello</H3>
        <H3 $weight="regular">Hello</H3>

        <H4 $weight="bold">Hello</H4>
        <H4 $weight="semibold">Hello</H4>
        <H4 $weight="medium">Hello</H4>
        <H4 $weight="regular">Hello</H4>

        <H5 $weight="bold">Hello</H5>
        <H5 $weight="semibold">Hello</H5>
        <H5 $weight="medium">Hello</H5>
        <H5 $weight="regular">Hello</H5>

        <H6 $weight="bold">Hello</H6>
        <H6 $weight="semibold">Hello</H6>
        <H6 $weight="medium">Hello</H6>
        <H6 $weight="regular">Hello</H6>

        <Para color="primary.brand.b600" size="textxl" $weight="bold">
          Para XL Bold. {lorem}
        </Para>
        <Para color="primary.brand.b500" size="textxl" $weight="semibold">
          Para XL Semibold. {lorem}
        </Para>
        <Para color="primary.brand.b400" size="textxl" $weight="medium">
          Para XL Medium. {lorem}
        </Para>
        <Para size="textxl" $weight="regular">
          Para XL Regular. {lorem}
        </Para>

        <Para size="textlg" $weight="bold">
          Para LG Bold. {lorem}
        </Para>
        <Para size="textlg" $weight="semibold">
          Para LG Semibold. {lorem}
        </Para>
        <Para size="textlg" $weight="medium">
          Para LG Medium. {lorem}
        </Para>
        <Para size="textlg" $weight="regular">
          Para LG Regular. {lorem}
        </Para>

        <Para size="textmd" $weight="bold">
          Para MD Bold. {lorem}
        </Para>
        <Para size="textmd" $weight="semibold">
          Para MD Semibold. {lorem}
        </Para>
        <Para size="textmd" $weight="medium">
          Para MD Medium. {lorem}
        </Para>
        <Para size="textmd" $weight="regular">
          Para MD Regular. {lorem}
        </Para>

        <Para size="textsm" $weight="bold">
          Para SM Bold. {lorem}
        </Para>
        <Para size="textsm" $weight="semibold">
          Para SM Semibold. {lorem}
        </Para>
        <Para size="textsm" $weight="medium">
          Para SM Medium. {lorem}
        </Para>
        <Para size="textsm" $weight="regular">
          Para SM Regular. {lorem}
        </Para>

        <Para size="textxs" $weight="bold">
          Para XS Bold. {lorem}
        </Para>
        <Para size="textxs" $weight="semibold">
          Para XS Semibold. {lorem}
        </Para>
        <Para size="textxs" $weight="medium">
          Para SM Medium. {lorem}
        </Para>
        <Para size="textxs" $weight="regular">
          Para SM Regular. {lorem}
        </Para>

        <Button $brandcolor='true'>Join Waitlist</Button>
        <Button $blackcolor='true'>Join Waitlist</Button>
        <Button $whitecolor='true'>Join Waitlist</Button>

        {tabs.map((tab, index) => (
          <ButtonTab
            key={index}
            onClick={() => setIsActive(index)}
            $isActive={isActive === index}
          >
            {tab.name}
          </ButtonTab>
        ))}

        <div style={{ display: "flex", columnGap: "12px", alignItems: "center" }}>
            <Checkbox />
            <Para size="textmd" $weight="regular">Referred by existing member</Para>
        </div>

        <TextCheckbox
          options={options}
          onClick={setIsTextCheckboxActive}
          $isActive={isTextCheckboxActive}
        />

        <Input id="filled" placeholder="Placeholder" label="Placeholder"/>
      
        <Input
          select
          id="filled-basic"
          label="Industry"
          name="industry"
          {...register("industry")}
        >
          <MenuItem value="" disabled>
            Disabled Option
          </MenuItem>
          {industries.map((industry, i) => (
            <MenuItem key={i} value={industry}>
              {industry}
            </MenuItem>
          ))}
        </Input>

        </div>
      </Container>

    </>
  );
}
