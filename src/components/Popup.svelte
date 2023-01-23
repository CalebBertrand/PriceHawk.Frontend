<script type="typescript">
  import { fly } from "svelte/transition";

  export let header = '';
  export let text = '';
  export let displayed = false;
  export let style: 'red' | 'black' = 'red';

  const styles = {
    red: 'text-slate-200 from-violet-500 to-red-500',
    black: 'text-slate-200 from-slate-800 to-slate-600'
  }

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
  <div class="z-10 fixed top-0 left-0 w-screen h-screen flex justify-center items-center backdrop cursor-pointer {styles[style]}"
    on:click={toggleDisplay} on:keyup={toggleDisplay}
    transition:fly={{ y: -25, duration: 160 }}>
    <div class="z-15 min-h-[65%] min-w-[65%] max-w-[85%] sm:max-w-[65%] rounded-lg p-6 px-9 bg-gradient-to-tr cursor-auto relative"
      on:click={e => e.stopPropagation()} on:keyup={e => e.stopPropagation()}>
      <div class="absolute top-3 right-5 text-3xl font-bold cursor-pointer text-shadow hover:scale-125 transition-transform duration-100" 
      on:click={toggleDisplay} on:keyup={toggleDisplay}><i class="fa fa-times"></i></div>
      <h2 class="text-3xl font-bold text-shadow mb-3 mr-12">{header}</h2>
      {#if !!text}
        <p class="text-lg">
          {text}
        </p>
      {/if}
      <slot></slot>
    </div>
  </div>
{/if}
