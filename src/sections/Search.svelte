<script type="typescript">
  import { fade, fly } from 'svelte/transition';
  import Button from '../components/Button.svelte';
  import Header from '../components/Header.svelte';
  import Input from '../components/Input.svelte';
  import { responses } from '../stores';
  import { clamp, clone, isNil, set } from 'lodash-es';
  import MarketPlaceList from '../components/MarketPlaceList.svelte';
  import { fromFetch } from 'rxjs/fetch';
  import { switchMap, filter, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
  import { areSetEqual } from '../set-equals';
  import 'isomorphic-fetch';
  import env from '../../environment.json';

  const resolvedEnv = window.location.hostname.includes('localhost') ? env['Local'] : env['Production'];

  type StageConfig = {
    header: string;
    inputs?: {
      name: string;
      type: 'text' | 'select' | 'number' | 'email';
      placeholder?: string | number;
      main: boolean;
      storedValue?: unknown;
      options?: string[];
    }[]
  };
  const stages: StageConfig[] = [
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
      header: "<em>How Much</em> Is The Highest You'd Pay?",
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
      header: "<em>Which</em> Email Should Recieve Price Notifications?",
      inputs: [
        {
          name: "contact",
          type: "email",
          main: true,
          placeholder: 'example@gmail.com'
        }
      ]
    },
    {
      header: "<em>When</em> Is The Latest You Would Buy It?",
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

  function updateResponseByName(name: string, value: unknown) {
    responses.next(clone(set(responses.value, name, clone(value))));
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
    distinctUntilChanged((previous, current) =>
      previous.priceWatch === current.priceWatch &&
      previous.queryString === current.queryString &&
      areSetEqual(previous.marketplaces, current.marketplaces)
    ),
    tap(() => (loading = true)),
    switchMap(({ queryString, priceWatch, marketplaces }) => {
      const request = new Request(resolvedEnv['PreviewEndpoint'], {
        method: 'POST',
        body: JSON.stringify({ query: queryString, price: priceWatch, marketplaceIds: marketplaces }),
        headers: {
          'Content-Type': 'text/plain'
        }
      });
      return fromFetch(request);
    }),
    switchMap(response => response.json()),
    tap(() => (loading = false))
  );

  $: stage = stages[stageIndex];
</script>
<style>
  #search {
    background-image: url('/search-bg.jpg');
    background-size: cover;
    background-attachment: fixed;
    padding: 12vh 0 0 0;
  }

  .input-block {
    min-height: 35vh;
    display: flex;
    flex-direction: column-reverse;
    align-items: stretch;
    justify-items: end;
  }

  .preview-card {
    width: 46%;
    margin: 0 2% 5vh 2%;
    height: 40vh;
  }
  @media (min-width: 750px)  {
    .preview-card {
      width: 30%;
      margin: 0 1.55% 5vh 1.55%;
    }
  }
  .preview-card img {
    max-height: 20vh;
  }
  .preview-card h3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;  
    overflow: hidden;
  }

  .arrow-up {
    width: 60px;
    height: 30px;
    border-left: solid 30px transparent;
    border-right: solid 30px transparent;
    border-bottom: solid 30px rgb(30 41 59);
    position: absolute;
    top: -30px;
    left: calc(50% - 30px);
  }

  .bottom-shadow {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 8vh;
    background-image: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.35));
  }
</style>

<section id="search" class="h-screen flex flex-col justify-center relative">
  {#if stageIndex !== 0}
    <div class="absolute top-6 left-6" transition:fade={{ duration: 200 }}>
      <Button color="black"
        applyClass="rounded focus:scale-110 hover:scale-110 transition-transform duration-100"
        callBack={() => stageIndex = clamp(stageIndex - 1, 0, 2)}>
        Back
      </Button>
    </div>
  {/if}
  {#key stageIndex}
    <div class="text-center w-full input-block" in:fly={{ y: -25, duration: 500 }}>
      <div class="order-2 px-4">
        <Header text={stage.header}></Header>
      </div>
      {#if !isNil(stage.inputs)}
        <div class="mt-3 mx-auto w-4/5 w-md-3/4 order-1 flex flex-row items-stretch justify-items-stretch">
          {#each stage.inputs as input, index}
            <div class:flex-grow={input.main}>
              <Input type={input.type}
                applyClass={index === 0 ? 'rounded-l-lg pl-3' : ''}
                options={input?.options}
                placeholder={input?.placeholder}
                initialValue={$responses[input.name]}
                on:valueChanged={e => updateResponseByName(input.name, e.detail.value)}>
              </Input>
            </div>
          {/each}
          <Button color="red"
            applyClass="rounded-r-lg text-xl px-5 py-4"
            callBack={next}>
            Next
          </Button>
        </div>
      {:else}
        <div class="mx-auto pt-3 px-3 overflow-y-scroll">
          <MarketPlaceList selectable floatDirection='left'
            selectedMarketplaces={$responses.marketplaces}
            on:valueChanged={e => updateResponseByName('marketplaces', e.detail.value)}>
          </MarketPlaceList>
        </div>
      {/if}
    </div>
  {/key}
  <div class="w-full py-5 px-[5%] mt-4 h-full overflow-y-scroll">
    {#if loading}
      <div class="w-full text-center mt-6">
        <i class="text-4xl fa fa-circle-notch fa-spin"></i>
      </div>
    {:else if !$previewResults}
      <div class="bg-slate-800 px-5 py-2 mt-6 rounded-lg shadow-lg w-fit mx-auto relative"
        in:fly={{ y: -25, duration: 500 }}>
        <div class="arrow-up border-slate-800"></div>
        <span class="text-slate-300 text-lg">Type a query, set a price and select at least one marketplace to see a preview</span>
      </div>
    {:else if !$previewResults.length}
      <div class="bg-slate-800 px-5 py-2 mt-6 rounded-lg shadow-lg w-fit mx-auto relative"
      in:fly={{ y: -25, duration: 500 }}>
        <div class="arrow-up border-slate-800"></div>
        <span class="text-slate-300 text-lg">Your query or price threshold may be too narrow</span>
      </div>
    {:else}
      {#each $previewResults as result, i}
        <div class="preview-card p-3 rounded-lg shadow-lg bg-slate-800 text-slate-200 text-center float-left mx-3 hover:scale-110 transition-transform duration-100"
          in:fly={{ y: 25, duration: 500, delay: i * 150 }}>
          <a href={result.url} target="_blank" rel="noreferrer">
            {#if result.imageUrl}
              <img class="mx-auto mb-2 rounded" src={result.imageUrl} alt={result.name}>
            {/if}
            <h3 class="text-lg text-slate-400">{result.name}</h3>
            <h2 class="text-3xl my-2">${result.price ?? 0}</h2>
          </a>
        </div>
      {/each}
    {/if}
  </div>
  <div class="bottom-shadow"></div>
</section>
