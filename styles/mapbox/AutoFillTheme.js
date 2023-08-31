export const autoFillTheme = {
    variables: {
      fontFamily: "Poppins, sans-serif",
      color: ({theme})=> theme.colors.black || 'black',
      colorBackgroundHover: ({theme})=> theme.colors.primary.grey.g50 || '#000000',
      lineHeight: "1.45",
      unit: "1.3rem",
      fontWeight: "400",
      fontSemiBold: "500",
      fontWeightBold: "600",
      padding: "0.5em",
      paddingModal: "1em",
      borderRadius: "5px",
      border: `1px solid #dddddd`,
      boxShadow: "none",
      minWidth: "100px",
    },
    cssText: `
      .Input {
        padding: 0px 30px;
      }
      .ResultsAttribution {
        display: none !important;
      }
    `,
  };