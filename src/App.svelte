<script>
  import Popup from './components/Popup.svelte';
  import Hero from './sections/Hero.svelte';
  import Review from './sections/Review.svelte';
  import Search from './sections/Search.svelte';
  import Button from './components/Button.svelte';
  import env from '../environment.json';
  import 'isomorphic-fetch';

  const urlParams = new URLSearchParams(window.location.search);
  let watchToCancelId = urlParams.get('finishId');
  if (watchToCancelId) {
    const finishEndpoint = window.location.hostname.includes('localhost') 
      ? env["Local"]["FinishWatchEndpoint"]
      : env["Production"]["FinishWatchEndpoint"];
    fetch(`${finishEndpoint}?id=${watchToCancelId}`, { method: 'POST', keepalive: true });
  }
</script>

<Popup header="Watch Cancelled" 
  text="Thanks for chosing PriceHawk!"
  displayed={!!watchToCancelId}>
</Popup>

<Hero></Hero>
<Search></Search>
<Review></Review>
