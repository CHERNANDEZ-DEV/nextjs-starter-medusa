import FeaturedProducts from "@modules/home/components/featured-products";
import Hero from "@modules/home/components/hero";
import SearchBar from "@modules/searchbar"; // Asegúrate de que esta ruta sea correcta
import { listCollections } from "@lib/data/collections";
import { getRegion } from "@lib/data/regions";

export const metadata = {
    title: "Medusa Next.js Starter Template",
    description: "A performant frontend ecommerce starter template with Next.js 15 and Medusa."
};

export default async function Home(props) {
    const params = await props.params;
    const { countryCode } = params;
    const region = await getRegion(countryCode);
    const { collections } = await listCollections({
        fields: "id, handle, title"
    });

    if (!collections || !region) {
        return null;
    }

    return (
        <>
            <div className="w-full ">
                <SearchBar />
            </div>
        </>
    );
}