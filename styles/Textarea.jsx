"use client";
import Textarea from "@mui/joy/Textarea";

export default function TextArea({ placeholder, field }) {
  return (
    <>
      <Textarea
        disabled={false}
        minRows={1}
        placeholder={placeholder}
        size="md"
        variant="plain"
        sx={{
          padding: "12px !important",
          backgroundColor: '#F8F6F5 !important',
          '&:hover': {
            backgroundColor: "#efebea !important",
          },
          "--Textarea-focusedHighlight" : "transparent"
        }}
        {...field}
      />
    </>
  );
}
