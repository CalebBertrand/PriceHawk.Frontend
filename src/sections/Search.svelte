<script>
  import { fade, fly } from 'svelte/transition';
  import Button from '../components/Button.svelte';
  import Header from '../components/Header.svelte';
  import Input from '../components/Input.svelte';
  import { responses } from '../stores';
  import { clamp, isNil, set } from 'lodash-es';
  import MarketPlaces from '../marketplaces';

  const stages = [
    {
      header: "<em>What</em> Do You Want to Buy?",
      inputs: [
        {
          name: 'queryString',
          type: 'text',
          placeholder: 'ROG Zephyrus Duo 3070Ti',
          main: true
        }
      ]
    },
    {
      header: "For <em>How Much</em> Would You Buy It?",
      inputs: [
        {
          name: 'currency',
          type: 'select',
          options: ['$'],
          main: false
        },
        {
          name: 'priceWatch',
          type: 'number',
          placeholder: 1200,
          storedValue: '',
          main: true
        }
      ]
    },
    {
      header: "<em>When</em> Are You Planning To Buy?",
      inputs: [
        {
          name: 'timeRange',
          type: 'number',
          placeholder: 14,
          main: true
        },
        {
          name: 'timeUnit',
          type: 'select',
          options: ['days', 'weeks', 'months'],
          main: false
        }
      ]
    },
    {
      header: "<em>Where</em> Would You Buy It?"
    }
  ];
  let stageIndex = 0;
  let selectedMarketplaces = [];

  function next() {
    if (stageIndex === stages.length - 1) {
      const start = document.getElementById('review');
      start.scrollIntoView({
        behavior: 'smooth'
      });
    } else {
      stageIndex = clamp(stageIndex + 1, 0, stages.length - 1);
    }
  };

  $: stage = stages[stageIndex];

  function toggleMarketplace(marketplaceId) {
    if (selectedMarketplaces.includes(marketplaceId))
      selectedMarketplaces = selectedMarketplaces.filter(id => id !== marketplaceId);
    else
      selectedMarketplaces = [...selectedMarketplaces, marketplaceId];

    responses.set(set($responses, 'marketplaces', selectedMarketplaces));
  }
</script>
<style>
  #search {
    background-image: url('../assets/search-bg.jpg');
    background-size: cover;
    background-attachment: fixed;
  }
</style>

<section id="search" class="h-screen flex items-center relative">
  {#if stageIndex !== 0}
    <div class="absolute top-4 left-4" transition:fade={{ duration: 200 }}>
      <Button color="black"
        applyClass="rounded"
        callBack={() => stageIndex = clamp(stageIndex - 1, 0, 2)}>
        Back
      </Button>
    </div>
  {/if}
  {#key stageIndex}
    <div class="text-center w-full" in:fly={{ y: -25, duration: 500 }}>
      <Header text={stage.header}></Header>
      {#if !isNil(stage.inputs)}
        <div class="mt-3 mx-auto w-4/5 w-md-3/4 flex flex-row items-stretch justify-items-stretch">
          {#each stage.inputs as input, index}
            <div class:flex-grow={input.main}>
              <Input type={input.type}
                applyClass={index === 0 ? 'rounded-l-lg pl-3' : ''}
                options={input?.options}
                placeholder={input?.placeholder}
                initialValue={$responses[input.name]}
                on:valueChanged={e => $responses[input.name] = e.detail.value}>
              </Input>
            </div>
          {/each}
          <Button color="red"
            applyClass="rounded-r-lg text-xl px-5 py-4"
            callBack={() => next()}>
            Next
          </Button>
        </div>
      {:else}
        <div class="mx-auto pt-3">
          {#each MarketPlaces as marketplace}
            {@const isSelected = selectedMarketplaces.includes(marketplace.id)}
            <div class="float-left w-36 h-36 rounded-lg shadow-lg m-2 flex align-middle justify-center cursor-pointer
              hover:scale-110 transition-transform duration-100 p-2 bg-black hover:bg-slate-900 relative"
              on:click={() => toggleMarketplace(marketplace.id)} on:keydown={() => toggleMarketplace(marketplace.id)}>
              <div class="absolute rounded border-solid border-red-500 border-2 w-5 h-5 right-2 top-2"
                class:bg-red-500={isSelected}>
                {#if isSelected}
                  <i class="fa fa-check text-white absolute top-0 left-0"></i>
                {/if}
              </div>
              <div class="bg-contain bg-no-repeat bg-center w-full h-full"
                alt={ marketplace.name + " logo" }
                style={`background-image: url("${marketplace.imageUrl}");`}>
              </div>
            </div>
          {/each}
          <div class="float-left w-36 h-36 rounded-lg shadow-lg m-2 flex align-middle justify-center text-white
              p-2 pt-4 bg-black relative">
            ...More coming soon!
          </div>
        </div>
      {/if}
    </div>
  {/key}
</section>
