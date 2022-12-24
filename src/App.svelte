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
  text="Thanks for chosing PriceHawk. Please note that PriceHawk is still under development. If you have feedback, you can reach me through the button below."
  displayed={!!watchToCancelId}>
  <div class="text-center mt-12">
    <Button color='white' applyClass='rounded-lg shadow-lg'
      size='lg'
      callBack={() => window.open('https://www.linkedin.com/in/caleb-bertrand/', '_blank')}>
      Contact Developer
    </Button>
  </div>
</Popup>

<Hero></Hero>
<Search></Search>
<Review></Review>
