<script type="typescript">
  import { createEventDispatcher } from "svelte";
  import { fly } from "svelte/transition";

  export let type: 'text' | 'select' | 'number' | 'email' = 'text';
  export let placeholder: string | number = '';
  export let options = [];
  export let initialValue: string | number = '';
  export let applyClass: string = '';
  export let disabled = false;
  export const dispatchValueChanged = createEventDispatcher();

  let selected = options.includes(initialValue) 
    ? initialValue 
    : options.length > 0 
    ? options[0] 
    : null;
  let expanded = false;

  function valueChanged(selectedValue) {
    if (type === 'select') selected = selectedValue;

    dispatchValueChanged('valueChanged', {
      value: selectedValue
    });

    expanded = false;
  }
</script>

{#if type !== 'select'}
  <input
    class="bg-slate-800 text-slate-200 text-lg md:text-2xl focus:border-red-500
            py-1 px-1 text-ellipsis shadow-lg w-full h-full {applyClass}"
    placeholder={`${placeholder}`}
    type={type}
    value={initialValue}
    min="0"
    maxlength="100"
    disabled={disabled}
    on:input={e => valueChanged(e.currentTarget.value)}>
{:else if type === 'select'}
  <div class="relative inline-block text-left h-full bg-slate-800 text-slate-200 {applyClass}">
    <button type="button" class="align-middle h-full px-2 text-lg"
     aria-expanded="true" aria-haspopup="true" on:click={() => expanded = !expanded}>
      {selected} 
      {#if options.length > 1}
        <i class="fa-solid fa-angle-down text-slate-300 transition-transform mx-1" 
          class:rotate-180={expanded}>
        </i>
      {/if}
    </button>
    {#if options.length > 1 && expanded}
      <div class="absolute bg-slate-800 text-slate-200 right-0 rounded-b overflow-hidden z-10" style="top: 100%;" 
        role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1"
        in:fly={{ y: -15, duration: 200 }}>
        {#each options as option}
          <a
            href={null}
            on:click={() => valueChanged(option)}
            class="text-slate-200 block px-4 py-2 text-lg cursor-pointer transition-colors 
                  hover:bg-slate-700" 
            role="option" aria-selected={selected === option} tabindex="-1">
            {option}
          </a>
        {/each}
      </div>
    {/if}
  </div>
{/if}
