"use client";
import { styled } from "styled-components";
import { Para } from "./Typography";
import Input from "./Input";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setFormValues } from "@/slices/nookFormSlice";

export default function SearchInput({
   fieldName,
   register,
   errors,
   label,
   watch,
   results,
   setValue,
}) {
   const inputValue = watch(fieldName);
   const dispatch = useDispatch();
   const [visible, setVisible] = useState(false);
   const [filteredResults, setFilteredResults] = useState([]);

   useEffect(() => {
      const matchingResults = results.filter((result) =>
         result.toLowerCase().includes(inputValue?.toLowerCase())
      );
      setFilteredResults(matchingResults);
   }, [inputValue, visible, results]);

   const handleResultSelect = (result) => {
      setValue("location_type", result);
      dispatch(setFormValues({ location_type: result }));
      setVisible(false);
   };

   return (
      <Wrap>
         <Input
            label={label}
            register={register}
            fieldName={fieldName}
            errors={errors}
            onChange={()=>setVisible(true)}
         />
         {visible && (
            <Results>
               {filteredResults.length > 0 ? (
                  filteredResults.map((result, index) => (
                     <MenuItem
                        onClick={() => handleResultSelect(result)}
                        key={index}
                        size="textmd"
                        $weight="regular"
                     >
                        {result}
                     </MenuItem>
                  ))
               ) : (
                  <MenuItem size="textmd" $weight="regular">
                     No results found
                  </MenuItem>
               )}
            </Results>
         )}
      </Wrap>
   );
}

const Wrap = styled.div`
   display: flex;
   flex-direction: column;
   row-gap: 12px;
   width: 100%;
   align-items: start;
   position: relative;
`;

const Results = styled.div`
   position: absolute;
   top: calc(100% + 15px);
   right: 0;
   background-color: ${({ theme }) => theme.color.white};
   border-radius: 10px;
   box-shadow: 0 2px 16px rgba(0, 0, 0, 0.12);
   width: 100%;
   max-height: 215px;
   overflow: scroll;
   padding: 10px 0px;
   z-index: 1000;
   @media screen and (max-width: ${({ theme }) => theme.breakPoint.tablet}) {
      display: none;
   }
`;

const MenuItem = styled(Para)`
   display: flex;
   flex-direction: row;
   padding: 12px 15px;
   &:hover {
      background-color: ${({ theme }) => theme.color.primary.grey.g25};
      cursor: pointer;
   }
`;
