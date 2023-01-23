<script type='typescript'>
  import Button from "../components/Button.svelte";
  import Header from "../components/Header.svelte";
  import MarketPlaceList from "../components/MarketPlaceList.svelte";

  function scrollToStart() {
    const start = document.getElementById('search');
    start.scrollIntoView({
      behavior: 'smooth'
    });
  }
</script>
<style type="scss">
  #hero {
    background-image: url('/hero_dark.jpg');
    background-size: cover;
    background-attachment: scroll;
    position: relative;

    .bottom-shadow {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 15vh;
      background-image: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.75));
    }

    .ad-strip {
      position: absolute;
      bottom: 0;
      left: 15%;
      width: 70%;
      height: 6rem;
    }
  }

  @media (min-width: 750px)  {
    #hero {
      background-attachment: fixed;
    }
  }
</style>

<section id="hero" class="min-h-screen text-slate-200 flex flex-col md:flex-row relative">
  <div class="md:w-1/2 py-8">
    <div class="bg-black bg-opacity-70 rounded-2xl p-5">
      <Header text="Get Price Updates On the Products You Love"></Header>
      <div class="h-1 w-3/4 bg-red-500 my-5"></div>
      <p class="my-5">
        PriceHawk sends you email notifications when products at supported stores drop below your specified price.
      </p>
      <Button color="red" applyClass="rounded" callBack={scrollToStart} size='lg'>Get Started</Button>
    </div>
  </div>
  <div class="md:w-1/2 py-8">
    <h5 class="bg-black text-slate-300 float-right text-lg rounded p-3">Supported Stores:</h5>
    <div class="pt-2 pl-5 clear-both">
      <MarketPlaceList floatDirection='right'></MarketPlaceList>
    </div>
  </div>
  <div class="bottom-shadow"></div>
  <div class="bg-black text-slate-300 absolute bottom-0 right-0 p-3">Image By Freepik</div>

  <div id="amzn-assoc-ad-0163a5ee-fdb9-470c-8eb9-0307b82077e2" class="ad-strip rounded-t-md"></div>
  <script async src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=0163a5ee-fdb9-470c-8eb9-0307b82077e2"></script>
</section>
