<script type="typescript">
  import { createEventDispatcher } from 'svelte';
  import MarketPlaces from '../marketplaces';

  const valuesChangedDispatcher = createEventDispatcher();
  export let selectable = false;
  export let floatDirection: 'left' | 'right';

  let selectedMarketplaces = [];
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

{#each MarketPlaces as marketplace}
  {@const isSelected = selectedMarketplaces.includes(marketplace.id)}
  <div class="float-{floatDirection} w-36 h-36 rounded-lg shadow-lg m-2 flex align-middle justify-center
    p-2 bg-black relative {selectable ? 'hover:scale-110 transition-transform duration-100 hover:bg-slate-900 cursor-pointer' : ''}"
    on:click={() => toggleMarketplace(marketplace.id)} on:keydown={() => toggleMarketplace(marketplace.id)}>
    {#if selectable}
      <div class="absolute rounded border-solid border-red-500 border-2 w-5 h-5 right-2 top-2"
        class:bg-red-500={isSelected}>
        {#if isSelected}
          <i class="fa fa-check text-white absolute top-0 left-0"></i>
        {/if}
      </div>
    {/if}
    <div class="bg-contain bg-no-repeat bg-center w-full h-full"
      alt={ marketplace.name + " logo" }
      style={`background-image: url("${marketplace.imageUrl}");`}>
    </div>
  </div>
{/each}