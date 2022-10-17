<script type='typescript'>
  import Button from "./Button.svelte";
</script>
<style type="scss">
  #hero {
    z-index: -2;
    background-image: url('../assets/hero.jpg');
    background-size: cover;
    background-attachment: fixed;

    .shadow {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 15vh;
      background-image: linear-gradient(to bottom, transparent, black);
    }
  }
</style>

<section id="hero" class="h-screen text-slate-200 flex px-20 py-16 flex-col md:flex-row">
  <div class="md:w-1/2">
    <div class="bg-black bg-opacity-70 rounded-2xl p-5">
      <h1 class="text-5xl font-bold">Get Price Updates On the Products You Love</h1>
      <div class="h-1 w-3/4 bg-red-500 my-5"></div>
      <p class="my-5">
        PriceHawk sends you email notifications when products at supported stores drop below your specified price.
      </p>
      <Button text="Get Started"></Button>
    </div>
  </div>
  <div class="md:w-1/2">
    <h5 class="bg-black text-slate-300 float-right rounded p-3">Supported Stores:</h5>
  </div>
  <div class="shadow"></div>
  <div class="bg-black text-slate-300 absolute bottom-0 right-0 p-3">Image By Freepik</div>
</section>
