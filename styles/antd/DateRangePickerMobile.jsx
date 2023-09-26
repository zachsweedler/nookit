import { DatePicker } from "antd";
import { styled } from "styled-components";
const { RangePicker } = DatePicker;
import './MobileStyles.css'

export const DateRangePickerMobile = styled(RangePicker)`
    height: 50px !important;
    width: 100% !important;
    padding: 20px !important;
    font-family: "__Poppins_1562c7 !important";
    box-shadow: none;
`;
