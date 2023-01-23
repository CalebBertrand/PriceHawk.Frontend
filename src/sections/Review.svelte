<script type='typescript'>
  import Popup from "../components/Popup.svelte";
  import Button from "../components/Button.svelte";
  import Header from "../components/Header.svelte";
  import Input from '../components/Input.svelte';
  import ValidationErrors from "../components/ValidationErrors.svelte";
  import { responses } from '../stores';
  import { clone, isNil } from "lodash-es";
  import { MarketPlaceConfigs } from '../marketplace-configs';
  import type { OutgoingWatch } from "src/outgoing-watch";
  import env from '../../environment.json';
  import 'isomorphic-fetch';
  import { map } from "rxjs";

  const resolvedEnv = window.location.hostname.includes('localhost') ? env["Local"] : env["Production"];

  const timeUnitsToDays = {
    days: 1,
    weeks: 7,
    months: 30
  };

  let loading = false;
  let howItWorksPopup = false;
  let verificationCode: number = null;
  let verificationPopup = false;
  let sent = false;
  let sentVerification = false;
  let errorMessage = '';
  let lastQuery = '';

  function updateVerificationCode(code: number) {
    verificationCode = code;
    sent = false;
  }

  async function sendVerificationEmail() {
    verificationPopup = true;

    if (!sentVerification) {
      loading = true;
      await fetch(resolvedEnv["VerifyContactEndpoint"] + '?email=' + $responses.contact, { method: 'POST' })
        .then(() => sentVerification = true)
        .catch(() => sentVerification = false);
      loading = false;
    }
  }

  async function submit() {
    loading = true;
    grecaptcha.ready(async () => {
      const token = await grecaptcha.execute('6Lc_a0wjAAAAAGXhTfV5G075dnJBkjUK61NcAZf0', { action: 'submit' });
      const { contact, queryString, priceWatch, timeRange, timeUnit, marketplaces, mustInclude } = $responses;
      const dayCount = timeRange * timeUnitsToDays[timeUnit];
      const request: OutgoingWatch = {
        contact: contact,
        query: queryString,
        price: priceWatch,
        dayCount: dayCount,
        captchaToken: token,
        marketplaceIds: marketplaces,
        mustInclude: mustInclude,
        verificationCode: +verificationCode
      };

      try {
        const res = await fetch(resolvedEnv["RequestsEndpoint"], {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain'
          },
          body: JSON.stringify(request)
        });

        if (res.ok) {
          sent = true;
          verificationPopup = false;
          errorMessage = '';

          const newResponse = clone($responses);
          newResponse.marketplaces = [];
          newResponse.priceWatch = null;

          lastQuery = newResponse.queryString;
          newResponse.queryString = '';
          responses.next(newResponse);

          window.scroll({ top: 0 });
        } else {
          const body = await res.json();
          errorMessage = 'message' in body
            ? body.message
            : 'There Was A Problem With The Request, Please Try Again Later';
        }
        loading = false;
      } catch (error) {
        errorMessage = error.message;
        loading = false;
      }
    });
  }

  const validationErrors = responses.pipe(
    map(({ queryString, priceWatch, marketplaces, timeRange, contact }) => {
      let errors = [];
      if (!queryString) errors.push('search term missing');
      if (isNil(priceWatch)) errors.push('desired price missing');
      if (isNil(marketplaces) || !marketplaces.length) errors.push('at least one marketplace should be selected');
      if (isNil(timeRange) || timeRange <= 0) errors.push('the time range should be greater than 0');
      if (isNil(contact)) errors.push('email required');
      else if (!/^\S+@\S+\.\S+$/.test(contact)) errors.push('invalid email');
      return errors;
    })
  );

  function displayAd(): void {
    document.getElementById('amzn-assoc-ad-2a4bd0ab-e5e9-45f4-8c7e-3dc18c9cd77c')
      .style.setProperty('display', 'inherit');
  }
</script>

<style>
  .ad-block {
    min-height: 18rem;
    height: 100%;
  }
</style>

<section id="review" class="min-h-screen text-slate-200 bg-gradient-to-tr from-black to-slate-700">
  <div class="pb-3">
    <h5 class=" text-slate-200 float-right rounded my-3 ml-3 cursor-pointer w-auto text-shadow text-sm md:text-lg"
      on:click={() => howItWorksPopup = true} on:keyup={() => howItWorksPopup = true}>
      <i class="fa fa-info-circle mr-1"></i>
      How Does It Work?
    </h5>

    <Header text="Overview"></Header>
    <div class="h-1 w-3/4 bg-red-500 my-5"></div>
  </div>
  <div class="flex flex-col md:flex-row w-full">
    <div class="md:w-1/2 py-4 pr-4">
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
              { MarketPlaceConfigs[marketplaceId - 1].name }{ i === selectedMarketplaces.length - 1 ? '' : ', ' }
            {/each}
          </span>
        {:else}
          <span class="text-xl">Not set.</span>
        {/if}
      </div>

      <Button color="red" 
        applyClass="rounded mt-3" 
        callBack={sendVerificationEmail} 
        disabled={!!$validationErrors.length || loading}
        size='lg'>
        Confirm
      </Button>
    </div>
    <div class="md:w-1/2 py-4 ad-block">
      <div id="amzn-assoc-ad-2a4bd0ab-e5e9-45f4-8c7e-3dc18c9cd77c" class="bg-slate-200 p-2 rounded-lg"></div>
      <script async src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=2a4bd0ab-e5e9-45f4-8c7e-3dc18c9cd77c"
        on:load={displayAd}></script>
    </div>
  </div>

  <Popup header="PriceHawk Takes the Hassle Out of Finding Great Prices."
    text='PriceHawk looks for products that match your search. 
      When a match is first found, as well as when the price drops, an email is sent to you. 
      Emails can be cancelled by clicking "Finish Watch" in any of the emails or by waiting until the end of the period you set here.'
    bind:displayed={howItWorksPopup}>
  </Popup>

  <Popup header='Last Thing: Enter the Verification Code Sent to Your Email.' 
    bind:displayed={verificationPopup} style='black'>
    <div class="w-full h-full">
      <div class="w-full md:w-11/12 mx-auto mt-12 mr-4 flex md:flex-row flex-col justify-items-stretch rounded-lg overflow-hidden shadow-xl">
        <Input applyClass='h-14 flex-grow md:pl-3 text-center md:text-left {sent && 'border-green-400 border-2 focus:border-green-300'}' 
          type='number' 
          disabled={loading || sent}
          placeholder='5-digit code here...'
          on:valueChanged={e => updateVerificationCode(e.detail.value)}></Input>
        <Button color={sent ? 'green' : 'red'}
          applyClass='px-5 h-14'
          callBack={() => submit}
          disabled={loading || sent}>
          <span class="text-shadow whitespace-nowrap">
            {#if loading}
              <i class="fa fa-circle-notch fa-spin mr-1"></i>
            {/if}
            {
              loading ? 
                'Loading' 
                : sent 
                  ? 'Success!' 
                  : 'Verify And Send Watch'
            }
          </span>
        </Button>
      </div>
      {#if errorMessage}
        <div class="h-9 mx-auto mt-6 mr-4 text-center">
          <small class="text-red-500">{errorMessage}</small>
        </div>
      {/if}
    </div>
  </Popup>

  <Popup header='Success! You will now recieve price notification emails.' 
    bind:displayed={sent} 
    text='A check will be made for your query "{lastQuery}" immediately, and at least twice a day for the next {$responses.timeRange} {$responses.timeUnit}. 
      To cancel the watch, click "Finish Watch" in any of the emails.'>
  </Popup>
</section>
