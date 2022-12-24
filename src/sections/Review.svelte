<script type='typescript'>
  import Popup from "../components/Popup.svelte";
  import Button from "../components/Button.svelte";
  import Header from "../components/Header.svelte";
  import Input from '../components/Input.svelte';
  import ValidationErrors from "../components/ValidationErrors.svelte";
  import { responses } from '../stores';
  import { isNil } from "lodash-es";
  import { derived } from "svelte/store";
  import { MarketPlaceConfigs } from '../marketplace-configs';
  import type { OutgoingWatch } from "src/outgoing-watch";
  import env from '../../environment.json';
  import 'isomorphic-fetch';

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
      const { contact, queryString, priceWatch, timeRange, timeUnit, marketplaces } = $responses;
      const dayCount = timeRange * timeUnitsToDays[timeUnit];
      const request = {
        contact: contact,
        query: queryString,
        price: priceWatch,
        dayCount: dayCount,
        captchaToken: token,
        marketplaceIds: marketplaces,
        verificationCode: +verificationCode
      } as OutgoingWatch;

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

          const newResponse = $responses;
          newResponse.marketplaces = [];
          newResponse.priceWatch = null;
          newResponse.queryString = '';
          responses.set(newResponse);
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

  const validationErrors = derived(responses, ({ queryString, priceWatch, marketplaces, timeRange, contact }) => {
    let errors = [];
    if (!queryString) errors.push('search term missing');
    if (isNil(priceWatch)) errors.push('desired price missing');
    if (isNil(marketplaces) || !marketplaces.length) errors.push('at least one marketplace should be selected');
    if (isNil(timeRange) || timeRange <= 0) errors.push('the time range should be greater than 0');
    if (isNil(contact)) errors.push('email required');
    else if (!/^\S+@\S+\.\S+$/.test(contact)) errors.push('invalid email');
    return errors;
  }); 
</script>

<section id="review" class="min-h-screen text-slate-200 bg-gradient-to-tr from-black to-slate-700">
  <div class="pb-3">
    <h5 class="bg-black text-slate-300 float-right rounded p-3 mb-4 cursor-pointer hover:bg-slate-600 transition-colors
      w-full sm:w-auto"
      on:click={() => howItWorksPopup = true} on:keyup={() => howItWorksPopup = true}>
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
    <div class="md:w-1/2 py-8">
      <ins class="adsbygoogle float-right"
          style="display:block"
          data-ad-client="ca-pub-7152148528734124"
          data-ad-slot="6088146685"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
      <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    </div>
  </div>

  <Popup header="PriceHawk Takes the Hassle Out of Finding Great Prices."
    text="Twice a day, PriceHawk will search for products on [insert supported stores here... still in development!] that match the parameters you set here. 
    When a match is found, an email or text message is sent to notify you."
    bind:displayed={howItWorksPopup}>
  </Popup>

  <Popup header='Last Thing: Enter the Verification Code Sent to Your Email.' 
    bind:displayed={verificationPopup} style='black'>
    <div class="w-full h-full">
      <div class="w-full md:w-11/12 mx-auto mt-12 mr-4 flex md:flex-row flex-col justify-items-stretch rounded-lg overflow-hidden shadow-xl">
        <Input applyClass='h-14 flex-grow pl-3 {sent && 'border-green-400 border-2 focus:border-green-300'}' 
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
          <small class="text-sm text-red-500">{errorMessage}</small>
        </div>
      {/if}
    </div>
  </Popup>

  <Popup header='Success! You will now recieve price notifications.' 
    bind:displayed={sent} text='A check will be made for your query immediately, and twice a day from now on.'>
  </Popup>
</section>
