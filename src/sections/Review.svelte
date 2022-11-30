<script type='typescript'>
  import Popup from "../components/Popup.svelte";
  import Button from "../components/Button.svelte";
  import Header from "../components/Header.svelte";
  import ValidationErrors from "../components/ValidationErrors.svelte";
  import { responses } from '../stores';
  import { isNil } from "lodash-es";
  import { derived } from "svelte/store";
  import MarketPlaces from '../marketplaces';

  let popupDisplayed = false;
  function showPopup(): void {
    popupDisplayed = true;
  }

  function submit() {
    grecaptcha.ready(() => {
      grecaptcha.execute('6LdsUEQjAAAAADj5LDQDij1v_z2Iw067p3uaZ68X', {action: 'submit'}).then((token) => {
          
      });
    });
  }

  const validationErrors = derived(responses, ({ queryString, priceWatch, marketplaces, timeRange }) => {
    let errors = [];
    if (!queryString) errors.push('search term missing');
    if (isNil(priceWatch)) errors.push('desired price missing');
    if (isNil(marketplaces) || !marketplaces.length) errors.push('at least one marketplace should be selected');
    if (isNil(timeRange) || timeRange <= 0) errors.push('the time range should be greater than 0');
    return errors;
  }); 
</script>

<section id="review" class="min-h-screen text-slate-200 bg-gradient-to-tr from-black to-slate-700">
  <div class="pb-3">
    <h5 class="bg-black text-slate-300 float-right rounded p-3 mb-4 cursor-pointer hover:bg-slate-600 transition-colors
      w-full sm:w-auto"
      on:click={showPopup} on:keyup={showPopup}>
      <i class="fa fa-info-circle mr-1"></i>
      How Does It Work?
    </h5>

    <Header text="Overview"></Header>
    <div class="h-1 w-3/4 bg-red-500 my-5"></div>
  </div>
  <div class="flex flex-col md:flex-row w-full">
    <div class="md:w-3/4 py-4">
      <div class="md:max-w-2/3 mb-6">
        {#if !!$validationErrors.length}
          <ValidationErrors errors={$validationErrors}></ValidationErrors>
        {/if}
      </div>

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
          <span class="text-xl">${$responses.priceWatch} or less</span>
        {:else}
          <span class="text-xl">Not set.</span>
        {/if}
      </div>
      
      <div class="my-2">
        <h2 class="text-lg font-bold text-slate-300 mb-1">Watch For: </h2>
        <span class="text-xl">{$responses.timeRange ?? 0} {$responses.timeUnit}</span>
      </div>

      <div class="my-2">
        <h2 class="text-lg font-bold text-slate-300 mb-1">Search in Marketplaces: </h2>
        {#if !!$responses.marketplaces?.length}
          {@const selectedMarketplaces = $responses.marketplaces}
          <span class="text-xl">
            {#each selectedMarketplaces as marketplaceId, i}
              { MarketPlaces[marketplaceId - 1].name }{ i === selectedMarketplaces.length - 1 ? '' : ', ' }
            {/each}
          </span>
        {:else}
          <span class="text-xl">Not set.</span>
        {/if}
      </div>
  
      <Button color="red" 
        applyClass="rounded mt-3" 
        callBack={submit} 
        disabled={!!$validationErrors.length}
        size='lg'>
        Submit
      </Button>
    </div>
    <div class="md:w-1/2 py-8">
      
    </div>
  </div>

  <Popup header="PriceHawk Takes the Hassle Out of Finding Great Prices."
    text="Twice a day, PriceHawk will search for products on [insert supported stores here... still in development!] that match the parameters you set here. 
    When a match is found, an email or text message is sent to notify you."
    bind:displayed={popupDisplayed}>
  </Popup>
</section>
