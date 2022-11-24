<script type="typescript">
  import { fly } from "svelte/transition";


  export let header = '';
  export let text = '';
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
</style>

{#if displayed}
  <div class="z-10 fixed top-0 left-0 w-screen h-screen flex justify-center items-center backdrop cursor-pointer"
    on:click={toggleDisplay} on:keyup={toggleDisplay}
    transition:fly={{ y: -25, duration: 160 }}>
    <div class="z-15 text-slate-200 min-h-[65%] max-w-[65%] rounded-lg p-6 px-9 bg-gradient-to-tr from-red-700 to-red-400 cursor-auto relative"
      on:click={e => e.stopPropagation()} on:keyup={e => e.stopPropagation()}>
      <div class="absolute top-2 right-4 text-slate-200 text-3xl font-bold cursor-pointer text-shadow" 
      on:click={toggleDisplay} on:keyup={toggleDisplay}>&times;</div>
      <h2 class="text-3xl font-bold text-slate-200 text-shadow mb-3">{header}</h2>
      <p class="text-lg">
        {text}
      </p>
    </div>
  </div>
{/if}
