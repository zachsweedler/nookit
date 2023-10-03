import FetchNooks from "@/components/search-nooks/FetchNooks";

export const metadata = {
  title: "Nookit | Browse Available Nooks",
};

export default async function Search () {
    return (
      <>
        <FetchNooks/>
      </>
    )

}
