<script type="typescript">
  import { fly } from "svelte/transition";


  export let header = '';
  export let displayed = false;

  function toggleDisplay(): void {
    displayed = !displayed;
  }
</script>

<style>
  .backdrop {
    backdrop-filter: blur(15px);
    background-color: rgba(0, 0, 0, 0.35);
  }

  div.popup {
    max-width: 65%;
  }
</style>

{#if displayed}
  <div class="z-10 fixed top-0 left-0 w-screen h-screen flex justify-center items-center backdrop cursor-pointer"
    on:click={toggleDisplay} on:keyup={toggleDisplay}
    transition:fly={{ y: -25, duration: 120 }}>
    <div class="z-15 text-slate-200 h-2/3 rounded-lg p-6 px-9 bg-gradient-to-tr from-red-700 to-red-400 popup cursor-auto"
      on:click={e => e.stopPropagation()} on:keyup={e => e.stopPropagation()}>
      <h2 class="text-3xl font-bold text-slate-200 text-shadow mb-3">{header}</h2>
      <p class="text-lg">
        Twice a day, PriceHawk will search for products on BestBuy and Amazon.com that match the parameters you set here. 
        When a match is found, an email or text message is sent to notify you.
      </p>
    </div>
  </div>
{/if}
