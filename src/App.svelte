<script>
  import Popup from './components/Popup.svelte';
  import Hero from './sections/Hero.svelte';
  import Review from './sections/Review.svelte';
  import Search from './sections/Search.svelte';
  import env from '../environment.json';

  const urlParams = new URLSearchParams(window.location.search);
  let watchToCancelId = urlParams.get('finishId');
  if (watchToCancelId) {
    const finishEndpoint = window.location.hostname.includes('localhost') 
      ? env["Local"]["FinishWatchEndpoint"]
      : env["Production"]["FinishWatchEndpoint"];
    fetch(`${finishEndpoint}?id=${watchToCancelId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
</script>

<Popup header="Notice!" 
  text="This site is still in development. Feel free to poke around, but don't 
  expect full functionality. A beta release is planned for January 2023!"
  displayed={!watchToCancelId}>
</Popup>

<Popup header="Watch Cancelled" 
  displayed={!!watchToCancelId}>
  <p class="text-lg">
    Thanks for chosing PriceHawk. Please note that this product is still under development. 
    If you have feedback, you can reach the developer on <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/caleb-bertrand/">LinkedIn.</a>
  </p>
</Popup>

<Hero></Hero>
<Search></Search>
<Review></Review>