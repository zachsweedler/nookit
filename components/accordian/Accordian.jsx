import React, { useState } from "react";
import styled from "styled-components";
import AccordianItem from "./AccordianItem";
import AccordianPanel from "./AccordianPanel";

function Accordion({ qas }) {
  const [openIndex, setOpenIndex] = useState(null);

  const handleOpen = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <Wrapper>
      {qas.map((qa, index) => (
        <div key={qa.question}>
          <AccordianItem
            onClick={() => handleOpen(index)}
            question={qa.question}
            isOpen={index === openIndex}
          />
          {index === openIndex && (
            <AccordianPanel answer={qa.answer} />
          )}
        </div>
      ))}
    </Wrapper>
  );
}

export default Accordion;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      gap: 0px;
   }
`;
