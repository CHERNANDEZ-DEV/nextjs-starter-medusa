import { listCartOptions, retrieveCart } from "@lib/data/cart";
import { retrieveCustomer } from "@lib/data/customer";
import { getBaseURL } from "@lib/util/env";
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner";
import Footer from "@modules/layout/templates/footer";
import Nav from "@modules/layout/templates/nav";
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge";

export const metadata = {
    metadataBase: new URL(getBaseURL()),
};

export default async function PageLayout(props) {
    const customer = await retrieveCustomer();
    const cart = await retrieveCart();
    let shippingOptions = [];

    if (cart) {
        const { shipping_options } = await listCartOptions();
        shippingOptions = shipping_options;
    }

    return (
        <>

            {customer && cart && (
                <CartMismatchBanner customer={customer} cart={cart} />
            )}

            {cart && (
                <FreeShippingPriceNudge
                    variant="popup"
                    cart={cart}
                    shippingOptions={shippingOptions}
                />
            )}
            {props.children}

        </>
    );
}