<script type="typescript">
  import { createEventDispatcher } from 'svelte';
  import { MarketPlaceConfigs } from '../marketplace-configs';

  const valuesChangedDispatcher = createEventDispatcher();
  export let selectable = false;
  export let floatDirection: 'left' | 'right';
  export let selectedMarketplaces: number[] = [];

  function toggleMarketplace(marketplaceId) {
    if (selectedMarketplaces.includes(marketplaceId))
      selectedMarketplaces = selectedMarketplaces.filter(id => id !== marketplaceId);
    else
      selectedMarketplaces = [...selectedMarketplaces, marketplaceId];

    valuesChangedDispatcher('valueChanged', {
      value: selectedMarketplaces
    })
  }
</script>

{#each MarketPlaceConfigs as marketplace, index}
  {@const isSelected = selectedMarketplaces.includes(marketplace.id)}
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <div class="float-{floatDirection} w-24 h-24 sm:w-28 sm:h-28 md:h-36 md:w-36 rounded-lg shadow-lg m-2 flex align-middle justify-center
    p-2 bg-black relative {selectable && 'focus:scale-110 hover:scale-110 transition-transform duration-100 hover:bg-slate-900 cursor-pointer'}"
    tabindex={selectable ? index : -1}
    on:click={() => toggleMarketplace(marketplace.id)} on:keydown={e => e.key === 'Enter' && toggleMarketplace(marketplace.id)}>
    {#if selectable}
      <div class="absolute rounded border-solid border-red-500 border-2 w-5 h-5 right-2 top-2"
        class:bg-red-500={isSelected}>
        {#if isSelected}
          <i class="fa fa-check text-white absolute top-0 left-0"></i>
        {/if}
      </div>
    {/if}
    {#if marketplace.imageUrl}
      <div class="bg-contain bg-no-repeat bg-center w-full h-full"
        style={`background-image: url("${marketplace.imageUrl}"); background-size: 80%;`}>
      </div>
    {:else}
      <div class="w-full h-full flex items-center">
        <span class="w-full block text-center text-slate-100 font-semibold text-xl sm:text-2xl">
          {marketplace.name}
        </span>
      </div>
    {/if}
  </div>
{/each}
