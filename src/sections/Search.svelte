<script type="typescript">
  import { fade, fly } from 'svelte/transition';
  import Button from '../components/Button.svelte';
  import Header from '../components/Header.svelte';
  import Input from '../components/Input.svelte';
  import { Responses, responses } from '../stores';
  import { clamp, clone, isEqual, set, range } from 'lodash-es';
  import MarketPlaceList from '../components/MarketPlaceList.svelte';
  import { fromFetch } from 'rxjs/fetch';
  import { switchMap, filter, tap, debounceTime, map, withLatestFrom, distinctUntilChanged, catchError } from 'rxjs/operators';
  import 'isomorphic-fetch';
  import env from '../../environment.json';
  import { MarketPlaceConfigs } from '../marketplace-configs';
  import type { WatchResult } from '../watch-result';

  const resolvedEnv = window.location.hostname.includes('localhost') ? env['Local'] : env['Production'];
  let stageIndex = 0;
  let showAdvancedOptions = false;

  let currentMustIncludeText = '';

  function next() {
    if (stageIndex === 4) {
      const start = document.getElementById('review');
      start.scrollIntoView({
        behavior: 'smooth'
      });
    } else {
      stageIndex = clamp(stageIndex + 1, 0, 4);
    }
  };

  function updateResponseByName(name: keyof Responses, value: unknown) {
    responses.next(set(clone(responses.value), name, clone(value)));
  }

  function getPreviewParams(req: Responses) {
    return {
      marketplaces: req.marketplaces,
      queryString: req.queryString,
      priceWatch: req.priceWatch,
      mustInclude: req.mustInclude,
    };
  }

  let loading = false;
  const previewResults = responses.pipe(
    debounceTime(800),
    filter(({ queryString, priceWatch, marketplaces }) => 
      queryString &&
      queryString.trim().length > 3 &&
      priceWatch > 0 &&
      marketplaces.length > 0
    ),
    distinctUntilChanged((r1, r2) => {
      console.log(r1, r2);
      return isEqual(getPreviewParams(r1), getPreviewParams(r2));
    }),
    tap(() => {
      loading = true;
      console.log('loading...');
    }),
    switchMap(({ queryString, priceWatch, marketplaces, mustInclude }) => {
      const request = new Request(resolvedEnv['PreviewEndpoint'], {
        method: 'POST',
        body: JSON.stringify({
          query: queryString,
          price: priceWatch,
          marketplaceIds: marketplaces,
          mustInclude: mustInclude
        }),
        headers: {
          'Content-Type': 'text/plain'
        }
      });
      return fromFetch(request);
    }),
    switchMap(response => response.json() as Promise<Array<WatchResult>>),
    withLatestFrom(responses),
    map(([results, { priceWatch }]) => {
      // Put the ones out of range at the bottom
      const inPriceRange = results.filter(({ price }) => price <= priceWatch);
      const outOfPriceRange = results.filter(({ price }) => price > priceWatch);
      return [...inPriceRange, ...outOfPriceRange];
    }),
    tap(() => {
      loading = false;

      // Avoid jerking the scroll to the bottom of the search section
      const scrollPos = window.scrollY;
      setTimeout(() => window.scrollTo({ top: scrollPos }));
    })
  );

  function addMustIncludeItem(): void {
    if (!!currentMustIncludeText && currentMustIncludeText.trim().length > 0) {
      updateResponseByName('mustInclude', [currentMustIncludeText, ...responses.value.mustInclude]);
    }
  }
  function removeMustIncludeItem(mustIncludeItem: string): void {
    updateResponseByName('mustInclude', responses.value.mustInclude.filter(item => item !== mustIncludeItem));
  }
</script>
<style>
  #search {
    padding: 12vh 0 0 0;
    min-height: 100vh;
    /* background: radial-gradient(#ff1b1b96 10%, #dfdfdf 100%); */
  }

  .input-block {
    display: flex;
    flex-direction: column-reverse;
    align-items: stretch;
    justify-items: end;
  }

  .advanced-toggle {
    position: absolute;
    top: 100%;
  }

  .preview-card {
    width: 46%;
    margin: 0 2% 5vh 2%;
    height: 45vh;
  }
  @media (min-width: 750px)  {
    .preview-card {
      width: 30%;
      margin: 0 1.55% 5vh 1.55%;
    }
  }
  .preview-card img {
    max-height: 18vh;
  }
  .preview-card h3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;  
    overflow: hidden;
  }

  .arrow-up {
    width: 50px;
    height: 25px;
    border-left: solid 25px transparent;
    border-right: solid 25px transparent;
    border-bottom: solid 25px rgb(15, 23, 42);
    position: absolute;
    top: -25px;
    left: calc(50% - 25px);
  }
</style>

<section id="search" class="flex flex-col justify-center relative bg-gradient-to-tr from-violet-500 to-red-500">
  {#if stageIndex !== 0}
    <div class="absolute top-6 left-6" transition:fade={{ duration: 200 }}>
      <Button color="black"
        applyClass="rounded focus:scale-110 hover:scale-110 transition-transform duration-100"
        callBack={() => stageIndex = clamp(stageIndex - 1, 0, 2)}>
        Back
      </Button>
    </div>
  {/if}

  <!-- Query String Section -->
  {#if stageIndex === 0}
    <div class="text-center w-full input-block" in:fly={{ y: -25, duration: 500 }}>
      <div class="order-3 px-4">
        <Header text='<em>What</em> Do You Want to Buy?'></Header>
      </div>
      <div class="mt-3 mx-auto w-4/5 w-md-3/4 order-2 flex flex-row items-stretch justify-items-stretch">
        <div class="flex-grow relative">
          <Input type='text'
            applyClass='rounded-l-lg pl-3 relative z-10'
            placeholder='ROG Zephyrus Duo 3070Ti'
            initialValue={$responses.queryString}
            on:valueChanged={e => updateResponseByName('queryString', e.detail.value)}>
          </Input>

          {#if !showAdvancedOptions}
            <div class="advanced-toggle cursor-pointer bg-red-500 hover:bg-red-600 transition-all text-slate-200 left-5 rounded-b-md py-1 px-3 hover:scale-110 duration-100 z-0"
              on:click={() => (showAdvancedOptions = true)} on:keydown={e => e.key === 'Enter' && (showAdvancedOptions = true)}>
              <div class="tracking-wide">
                Advanced Options
              </div>
            </div>
          {/if}
        </div>
        <Button color="red"
          applyClass="rounded-r-lg text-xl px-5 py-4"
          callBack={next}>
          Next
        </Button>
      </div>

      {#if showAdvancedOptions}
        <div class="mx-auto w-4/5 w-md-3/4 order-1">
          <h4 class="text-lg mt-2 text-left text-slate-200 tracking-wide font-bold">Must Include:</h4>
          {#if $responses.mustInclude.length < 3}
            <div class="float-left bg-slate-800 text-slate-200 rounded-md w-52 h-11">
              <Input type='text'
                applyClass='rounded-t-md py-2 w-3/4 text-md md:text-lg'
                placeholder='Must Include...'
                on:valueChanged={e => (currentMustIncludeText = e.detail.value)}>
              </Input>
              <div class="float-right bg-red-500 hover:bg-red-600 w-12 h-full cursor-pointer rounded-r-md flex items-center justify-center" 
                on:click={() => addMustIncludeItem()} on:keydown={e => e.key === 'Enter' && addMustIncludeItem()}>
                <i class="fa fa-plus text-2xl"></i>
              </div>
            </div>
          {/if}
          {#each $responses.mustInclude as mustIncludeItem}
            <div class="float-left py-2 px-3 bg-slate-800 text-slate-200 rounded-md ml-2 h-11" in:fade={{ duration: 200 }}>
              <h3 class="inline text-lg">{mustIncludeItem}</h3>
              <i on:click={() => removeMustIncludeItem(mustIncludeItem)} on:keydown={e => e.key === 'Enter' && removeMustIncludeItem(mustIncludeItem)} class="fa fa-times text-2xl ml-4 cursor-pointer"></i>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
 
  <!-- Price -->
  {#if stageIndex === 1}
    <div class="text-center w-full input-block" in:fly={{ y: -25, duration: 500 }}>
      <div class="order-2 px-4">
        <Header text="<em>How Much</em> Is The Highest You'd Pay?"></Header>
      </div>
      <div class="mt-3 mx-auto w-4/5 w-md-3/4 order-1 flex flex-row items-stretch justify-items-stretch">
        <div>
          <Input type='select'
            applyClass='rounded-l-lg pl-3'
            options={['$']}
            on:valueChanged={e => updateResponseByName('currency', e.detail.value)}>
          </Input>
        </div>
        <div class="flex-grow">
          <Input type='number'
            placeholder={1200}
            initialValue={$responses.priceWatch}
            on:valueChanged={e => updateResponseByName('priceWatch', e.detail.value)}>
          </Input>
        </div>
        <Button color="red"
          applyClass="rounded-r-lg text-xl px-5 py-4"
          callBack={next}>
          Next
        </Button>
      </div>
    </div>
  {/if}

  <!-- Contact -->
  {#if stageIndex === 2}
    <div class="text-center w-full input-block" in:fly={{ y: -25, duration: 500 }}>
      <div class="order-2 px-4">
        <Header text='<em>Which</em> Email Should Recieve Price Notifications?'></Header>
      </div>
      <div class="mt-3 mx-auto w-4/5 w-md-3/4 order-1 flex flex-row items-stretch justify-items-stretch">
        <div class="flex-grow">
          <Input type='email'
            applyClass='rounded-l-lg pl-3'
            placeholder='example@gmail.com'
            initialValue={$responses.contact}
            on:valueChanged={e => updateResponseByName('contact', e.detail.value)}>
          </Input>
        </div>
        <Button color="red"
          applyClass="rounded-r-lg text-xl px-5 py-4"
          callBack={next}>
          Next
        </Button>
      </div>
    </div>
  {/if}

  <!-- Time Window -->
  {#if stageIndex === 3}
    <div class="text-center w-full input-block" in:fly={{ y: -25, duration: 500 }}>
      <div class="order-2 px-4">
        <Header text="<em>When</em> Is The Latest You Would Buy It?"></Header>
      </div>
      <div class="mt-3 mx-auto w-4/5 w-md-3/4 order-1 flex flex-row items-stretch justify-items-stretch">
        <div class="flex-grow">
          <Input type='number'
            applyClass='rounded-l-lg pl-3'
            placeholder={14}
            initialValue={$responses.timeRange}
            on:valueChanged={e => updateResponseByName('timeRange', e.detail.value)}>
          </Input>
        </div>
        <div>
          <Input type='select'
            placeholder={1200}
            options={['days', 'weeks', 'months']}
            initialValue={$responses.timeUnit}
            on:valueChanged={e => updateResponseByName('timeUnit', e.detail.value)}>
          </Input>
        </div>
        <Button color="red"
          applyClass="rounded-r-lg text-xl px-5 py-4"
          callBack={next}>
          Next
        </Button>
      </div>
    </div>
  {/if}

  <!-- Marketplaces -->
  {#if stageIndex === 4}
    <div class="text-center w-full input-block" in:fly={{ y: -25, duration: 500 }}>
      <div class="order-2 px-4">
        <Header text='<em>Where</em> Would You Buy It?'></Header>
      </div>
      <div class="mx-auto pt-3 px-3">
        <MarketPlaceList selectable floatDirection='left'
          selectedMarketplaces={$responses.marketplaces}
          on:valueChanged={e => updateResponseByName('marketplaces', e.detail.value)}>
        </MarketPlaceList>
      </div>
    </div>
  {/if}

  <div class="w-full pt-8 pb-5 px-[5%] mt-12">
    {#if loading}
      <div class="w-full text-center mt-6">
        <i class="text-4xl fa fa-circle-notch fa-spin"></i>
      </div>
    {:else if !$previewResults}
      <div class="bg-slate-900 px-4 py-1 mt-6 rounded-lg shadow-lg w-fit mx-auto relative"
        in:fly={{ y: -25, duration: 500 }}>
        <div class="arrow-up border-slate-900"></div>
        <span class="text-slate-300 text-lg">Type a search, set a price and select at least one marketplace to see a preview</span>
      </div>
    {:else if !$previewResults.length}
      <div class="bg-slate-900 px-4 py-1 mt-6 rounded-lg shadow-lg w-fit mx-auto relative"
      in:fly={{ y: -25, duration: 500 }}>
        <div class="arrow-up border-slate-900"></div>
        <span class="text-slate-300 text-lg">Your search or price threshold may be too narrow</span>
      </div>
    {:else}
      {#each $previewResults as result, i}
        {@const marketplaceName = MarketPlaceConfigs.find(({ id }) => id === result.marketplaceId)?.name}
        {@const outOfPriceRange = result.price > $responses.priceWatch}
        <div class="preview-card px-3 py-2 rounded-lg shadow-lg bg-slate-800 text-slate-200 text-center float-left mx-3 hover:scale-110 transition-transform duration-100"
          in:fly={{ y: 25, duration: 500, delay: i * 150 }} class:opacity-90={outOfPriceRange}>
          {#if marketplaceName}
            <div class="h-4 w-full text-right text-sm mb-3">
              {#if outOfPriceRange}
                <div class="float-left text-slate-300 ml-1">*Out Of Price Range</div>
              {/if}
              <div class="float-right">{marketplaceName}</div>
            </div>
          {/if}
          <a href={result.url} target="_blank" rel="noreferrer">
            {#if result.imageUrl}
              <img class="mx-auto mb-2 rounded" src={result.imageUrl} alt={result.name}>
            {/if}
            {#if result.rating}
              <div class="my-1">
                <span class="mr-2">{result.rating.toFixed(1)}</span>
                {#each range(Math.floor(result.rating)) as _}
                  <i class="fa fa-star text-yellow-400"></i>
                {/each}
                {#if result.rating % 1 >= 0.5}
                <i class="fa fa-star-half text-yellow-400"></i>
                {/if}
              </div>
            {/if}
            <h3 class="text-lg text-slate-400">{result.name}</h3>
            <h2 class="text-3xl my-2">${result.price ?? 0}</h2>
          </a>
        </div>
      {/each}
    {/if}
  </div>
</section>
