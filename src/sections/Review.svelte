<script type='typescript'>
  import Popup from "../components/Popup.svelte";
  import Button from "../components/Button.svelte";
  import Header from "../components/Header.svelte";
  import { responses } from '../stores';

  let popupDisplayed = false;
  function showPopup(): void {
    popupDisplayed = true;
  }

  function submit() {
  }
</script>

<section id="review" class="min-h-screen text-slate-200 bg-gradient-to-tr from-black to-slate-700 
  flex flex-col md:flex-row">
  <div class="md:w-3/4 py-8">
    <Header text="Overview"></Header>
    <div class="h-1 w-3/4 bg-red-500 my-5"></div>

    <div class="my-3">
      <h2 class="text-lg font-bold text-slate-300 mb-1">Search Term: </h2>
      {#if !!$responses.queryString}
        <span class="text-xl">{$responses.queryString}</span>
      {:else}
        <span class="text-xl">Not set.</span>
      {/if}
    </div>

    <div class="my-2">
      <h2 class="text-lg font-bold text-slate-300 mb-1">Desired Price: </h2>
      {#if $responses.priceWatch}
        <span class="text-xl">{$responses.priceWatch} or less</span>
      {:else}
        <span class="text-xl">Not set.</span>
      {/if}
    </div>
    
    <div class="my-2">
      <h2 class="text-lg font-bold text-slate-300 mb-1">Watch For: </h2>
      <span class="text-xl">{$responses.timeRange} {$responses.timeUnit}</span>
    </div>

    <Button color="red" applyClass="rounded mt-3" callBack={submit}>Submit</Button>
  </div>
  <div class="md:w-1/4 py-8">
    <h5 class="bg-black text-slate-300 float-right rounded p-3 cursor-pointer hover:bg-slate-600 transition-colors"
      on:click={showPopup} on:keyup={showPopup}>
      <i class="fa fa-info-circle mr-1"></i>
      How Does It Work?
    </h5>
  </div>

  <Popup header="PriceHawk Takes the Hassle Out of Finding Great Prices."
    bind:displayed={popupDisplayed}>
  </Popup>
</section>
