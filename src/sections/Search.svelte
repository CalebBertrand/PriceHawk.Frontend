<script>
  import { fade, fly } from 'svelte/transition';
  import Button from '../components/Button.svelte';
  import Header from '../components/Header.svelte';
  import Input from '../components/Input.svelte';
  import { clamp } from '../utils/clamp';

  const stages = [
    {
      header: "<em>What</em> Do You Want to Buy?",
      inputs: [
        {
          type: 'text',
          placeholder: 'ROG Zephyrus Duo 3070Ti',
          storedValue: '',
          main: true
        }
      ]
    },
    {
      header: "<em>For How Much</em> Would You Buy It?",
      inputs: [
        {
          type: 'select',
          options: ['$'],
          storedValue: '$',
          main: false
        },
        {
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
          type: 'number',
          placeholder: 14,
          storedValue: '',
          main: true
        },
        {
          type: 'select',
          options: ['days', 'weeks', 'months'],
          storedValue: 'days',
          main: false
        }
      ]
    }
  ];
  let stageIndex = 0;

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
              initialValue={input.storedValue}
              on:valueChanged={e => input.storedValue = e.detail.value}></Input>
          </div>
        {/each}
        <Button color="red"
          applyClass="rounded-r-lg"
          callBack={() => stageIndex = clamp(stageIndex + 1, 0, 2)}>
          Next
        </Button>
      </div>
    </div>
  {/key}
</section>
