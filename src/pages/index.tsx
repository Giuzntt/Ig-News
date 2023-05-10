import { SubscribeButton } from "@/components/SubscribeButton";
import { stripe } from "@/services/stripe";
import { GetServerSideProps, GetStaticProps } from "next";
import Image from "next/image";
import styles from "./home.module.scss";

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function Home({ product }: HomeProps) {


  return (
    <>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          {/* emoji */}
          <span role="img" aria-label="wave">
            👋 Hey, welcome
          </span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get acess to all the publications <br />
            <span>for {product.amount} per month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <Image
          src="/images/avatar.svg"
          alt="Girl Coding"
          width={500}
          height={500}
        />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1MkX2OC5KqI0y8K0V2KdNeWT", {
    expand: ["product"],
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format((price.unit_amount ?? 0) / 100),
  };

  return {
    props: {
      product,
    },

    revalidate: 60 * 60 * 24, // 24 hours
  };
};
