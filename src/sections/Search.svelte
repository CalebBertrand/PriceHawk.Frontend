<script>
  import { fade, fly } from 'svelte/transition';
  import Button from '../components/Button.svelte';
  import Header from '../components/Header.svelte';
  import Input from '../components/Input.svelte';
  import { responses } from '../stores';
  import { clamp } from 'lodash-es';

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
      header: "<em>For How Much</em> Would You Buy It?",
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
    }
  ];
  let stageIndex = 0;

  function next() {
    if (stageIndex === 2) {
      const start = document.getElementById('review');
      start.scrollIntoView({
        behavior: 'smooth'
      });
    } else {
      stageIndex = clamp(stageIndex + 1, 0, 2);
    }
  };

  $: stage = stages[stageIndex];
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
      <div class="mt-3 mx-auto w-4/5 w-md-3/4 flex flex-row items-stretch justify-items-stretch">
        {#each stage.inputs as input, index}
          <div class:flex-grow={input.main}>
            <Input type={input.type}
              applyClass={index === 0 ? 'rounded-l-lg pl-3' : ''}
              options={input?.options}
              placeholder={input?.placeholder}
              initialValue={$responses[input.name]}
              on:valueChanged={e => $responses[input.name] = e.detail.value}></Input>
          </div>
        {/each}
        <Button color="red"
          applyClass="rounded-r-lg text-xl px-5 py-4"
          callBack={() => next()}>
          Next
        </Button>
      </div>
    </div>
  {/key}
</section>
