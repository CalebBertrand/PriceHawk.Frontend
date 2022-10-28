<script>
  import { createEventDispatcher } from "svelte";
  import { fly } from "svelte/transition";

  export let type;
  export let placeholder;
  export let options = [];
  export let initialValue;
  export let applyClass = '';
  export const dispatchValueChanged = createEventDispatcher();

  let value = initialValue ?? (type === 'select' ? options[0] : placeholder);
  function valueChanged(selectedValue) {
    dispatchValueChanged('valueChanged', {
      value: selectedValue
    });
    value = selectedValue;
  }

  let expanded = false;
</script>

{#if type !== 'select'}
  <input
    class="bg-slate-800 text-slate-200 text-lg md:text-2xl focus:border-red-500
            py-1 px-1 text-ellipsis shadow-lg w-full h-full {applyClass}"
    placeholder={placeholder}
    type={type}
    value={initialValue}
    min="0"
    on:input={e => valueChanged(e.currentTarget.value)}>
{:else if type === 'select'}
  <div class="relative inline-block text-left h-full bg-slate-800 text-slate-200 {applyClass}">
    <button type="button" class="align-middle h-full px-2 text-lg"
     aria-expanded="true" aria-haspopup="true" on:click={() => expanded = !expanded}>
      {value} 
      {#if options.length > 1}
        <i class="fa-solid fa-angle-down text-slate-600 transition-transform mx-1" 
          class:rotate-180={expanded}>
        </i>
      {/if}
    </button>
    {#if options.length > 1 && expanded}
      <div class="absolute bg-slate-800 text-slate-200 right-0 rounded-b overflow-hidden" style="top: 100%;" 
        role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1"
        transition:fly={{ y: -15, duration: 200 }}>
        {#each options as option}
          <a
            href={null}
            on:click={() => valueChanged(option)}
            class="text-slate-200 block px-4 py-2 text-sm cursor-pointer transition-colors 
                  hover:bg-slate-700" 
            role="option" aria-selected={value === option} tabindex="-1">
            {option}
          </a>
        {/each}
      </div>
    {/if}
  </div>
{/if}
