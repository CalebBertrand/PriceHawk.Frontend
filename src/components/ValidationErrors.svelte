<script type="typescript">
  import { fly } from "svelte/transition";
  import { capitalize } from "lodash-es";

  export let errors: string[] = [];
</script>

<div class="bg-red-100 border-red-800 border-2 border-solid text-red-800 p-3 rounded-lg text-lg leading-snug"
  transition:fly={{ y: -25, duration: 160 }}>
  <i class="fa fa-exclamation-triangle mr-1"></i> 
  {#each errors as error, i}
    { i == 0 ? capitalize(error) : error }{ i < (errors.length - 1) ? ', ' : '.' }
  {/each}
</div>
