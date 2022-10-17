<script type='typescript'>
  import { fade, fly } from 'svelte/transition';
  import Button from '../components/Button.svelte';
  import Header from '../components/Header.svelte';
  import Input from '../components/Input.svelte';
  import { clamp } from '../utils/clamp';

  const stages = [
    { 
      header: "<em>What</em> Do You Want to Buy?",
      inputs: [["text", "ROG Zephyrus Duo 3070Ti"]]
    },
    { 
      header: "<em>For How Much</em> Would You Buy It?",
      inputs: [["number", ""]]
    },
    { 
      header: "<em>When</em> Are You Planning To Buy?",
      inputs: [["number", ""]]
    }
  ];
  let stageIndex = 0;

  $: stage = stages[stageIndex];
</script>
<section id="search" class="h-screen flex items-center relative">
  {#if stageIndex !== 0}
    <div class="absolute top-4 left-4" transition:fade={{ duration: 200 }}>
      <Button color="black"
        callBack={() => stageIndex = clamp(stageIndex - 1, 0, 2)}>
        Back
      </Button>
    </div>
  {/if}
  {#key stageIndex}
    <div class="text-center w-full" in:fly={{ y: -25, duration: 500 }}>
      <Header text={stage.header}></Header>
      <div class="rounded-lg mt-3 mx-auto w-3/4 overflow-hidden flex flex-row">
        {#each stage.inputs as input}
          <Input type={input[0]} placeholder={input[1]}></Input>
        {/each}
        <Button color="red"
          rounded={false}
          callBack={() => stageIndex = clamp(stageIndex + 1, 0, 2)}>
          Next
        </Button>
      </div>
    </div>
  {/key}
</section>
