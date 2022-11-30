<script type="typescript">
  import { capitalize } from "lodash-es";

  export let errors: string[] = [];
</script>

<div class="bg-gradient-to-tr from-red-800 to-red-500 text-slate-200 py-2 px-3 rounded-lg leading-snug w-fit">
  <i class="fa fa-exclamation-triangle mr-1"></i> 
  {#each errors as error, i}
    { i == 0 ? capitalize(error) : error }{ i < (errors.length - 1) ? ', ' : '.' }
  {/each}
</div>
