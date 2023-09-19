import { DatePicker } from "antd";
import { styled } from "styled-components";
const { RangePicker } = DatePicker;

export const DateRangePicker = styled(RangePicker)`
   height: 50px !important;
   width: 100% !important;
   padding: 20px;
   box-shadow: none;
   font-family: "__Poppins_1562c7 !important";

   &.ant-picker-focused {
      border-color: ${({ theme }) => theme.color.primary.grey.g50} !important;
      border-inline-end-width: 1px;
   }

   &.ant-picker:hover {
      border-color: ${({ theme }) => theme.color.primary.grey.g50} !important;
      border-inline-end-width: 1px;
   }

   .ant-picker-active-bar {
      background: ${({ theme }) => theme.color.primary.brand.b600} !important;
      height: 4px;
   }
   
   &.ant-picker-panel {
      :last-child {
         width: 0 !important;
         .ant-picker-header {
            position: absolute;
            right: 0;
            .ant-picker-header-prev-btn,
            .ant-picker-header-view {
               visibility: hidden !important;
            }
         }
         .ant-picker-body {
            display: none;
         }
         @media (min-width: ${({ theme }) => theme.breakPoint.mobile}) {
            width: 280px !important;
            .ant-picker-header {
               position: relative;
               .ant-picker-header-prev-btn,
               .ant-picker-header-view {
                  visibility: initial;
               }
            }
            .ant-picker-body {
               display: block;
            }
         }
      }
   }
`;
