import Footer from "../components/footer/footer";

import MultisendForm from "../components/multisend-form/multisend-form";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-10 gap-16 ">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>
          <MultisendForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
