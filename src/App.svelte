<script>
  import Popup from './components/Popup.svelte';
  import Hero from './sections/Hero.svelte';
  import Review from './sections/Review.svelte';
  import Search from './sections/Search.svelte';
</script>

<Popup header="Notice!" 
  text="This site is still in development. Feel free to poke around, but don't 
  expect full functionality. A beta release is planned for January 2023!"
  displayed>
</Popup>

<Hero></Hero>
<Search></Search>
<Review></Review>